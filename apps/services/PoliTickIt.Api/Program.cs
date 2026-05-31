using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PoliTickIt.Api.Auth;
using Microsoft.Azure.Cosmos;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Infrastructure.Persistence;
using PoliTickIt.Infrastructure.Security;
using PoliTickIt.Infrastructure.District;
using PoliTickIt.Infrastructure.Email;
using PoliTickIt.Infrastructure.Representatives;
using PoliTickIt.Infrastructure.Trending;
using PoliTickIt.Api.BackgroundServices;
using PoliTickIt.Ingestion.Providers;
using PoliTickIt.Ingestion.Services;
using PoliTickIt.Ingestion.Configuration;
using PoliTickIt.Ingestion.Normalization.Extensions;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;
using Microsoft.Extensions.Caching.Memory;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "PoliTickIt API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Paste the JWT access token from the login response. Swagger will add the 'Bearer ' prefix automatically.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();

// Configure Oracle Settings from appsettings.json
builder.Services.Configure<OracleSettings>(builder.Configuration.GetSection(OracleSettings.SectionName));

// ── JWT Authentication ────────────────────────────────────────────────────────
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));

var jwtKey = builder.Configuration[$"{JwtSettings.SectionName}:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException("Jwt:Key is missing from configuration.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Prevent remapping of standard JWT claim names (sub, email, etc.)
        // so they are accessible as-is via User.FindFirstValue("sub").
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration[$"{JwtSettings.SectionName}:Issuer"] ?? "PoliTickIt",
            ValidateAudience = true,
            ValidAudience = builder.Configuration[$"{JwtSettings.SectionName}:Audience"] ?? "PoliTickIt.Mobile",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    });

// ── Auth Services ─────────────────────────────────────────────────────────────
builder.Services.Configure<CosmosSettings>(builder.Configuration.GetSection(CosmosSettings.SectionName));

builder.Services.AddSingleton<CosmosClient>(sp =>
{
    var endpoint = builder.Configuration[$"{CosmosSettings.SectionName}:AccountEndpoint"];
    var key = builder.Configuration[$"{CosmosSettings.SectionName}:AccountKey"];
    if (string.IsNullOrWhiteSpace(endpoint) || endpoint.StartsWith("REPLACE"))
        throw new InvalidOperationException("CosmosDb:AccountEndpoint is not configured.");
    return new CosmosClient(endpoint, key, new CosmosClientOptions
    {
        SerializerOptions = new CosmosSerializationOptions
        {
            PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase,
        },
    });
});

builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
builder.Services.AddSingleton<IUserRepository, CosmosUserRepository>();
builder.Services.AddSingleton<ITokenService, JwtTokenService>();

// ── Email Service ─────────────────────────────────────────────────────────────
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection(EmailSettings.SectionName));
builder.Services.AddSingleton<IEmailService, AzureEmailService>();

// ── District Lookup Service ───────────────────────────────────────────────────
builder.Services.AddSingleton<IDistrictLookupService, StaticZipDistrictLookupService>();

// ── Representatives Store + Startup Hydration ─────────────────────────────────
builder.Services.Configure<CongressApiOptions>(
    builder.Configuration.GetSection("OracleSettings:Congress"));
builder.Services.AddSingleton<IRepresentativeStore, CongressMemberStore>();
builder.Services.AddHostedService<RepresentativesHydrationService>();

// ── Trending Service ──────────────────────────────────────────────────────────
builder.Services.AddSingleton<ITrendingService, ChannelTrendingService>();

// Register Core Infrastructure — LocalFileSnapRepository
// Data folder: {ContentRoot}/Data/snaps  (one *.json per snap)
// Call POST /admin/reload to refresh at runtime without redeploying.
builder.Services.Configure<SnapDataOptions>(o =>
    o.DataPath = Path.Combine(builder.Environment.ContentRootPath, "Data", "snaps"));

builder.Services.AddSingleton<LocalFileSnapRepository>();
builder.Services.AddSingleton<ISnapRepository>(sp =>
    sp.GetRequiredService<LocalFileSnapRepository>());
builder.Services.AddSingleton<IReloadableSnapRepository>(sp =>
    sp.GetRequiredService<LocalFileSnapRepository>());

// Register Multi-Oracle Entity Normalization System (manual initialization)
NormalizationInitializer.CreateNormalizationServices(
    out var index,
    out var repRepo,
    out var billRepo,
    out var committeeRepo,
    out var donorRepo,
    out var resolver,
    out var linker,
    out var pipeline);

builder.Services.AddSingleton(index);
builder.Services.AddSingleton(repRepo);
builder.Services.AddSingleton(billRepo);
builder.Services.AddSingleton(committeeRepo);
builder.Services.AddSingleton(donorRepo);
builder.Services.AddSingleton(resolver);
builder.Services.AddSingleton(linker);
builder.Services.AddSingleton(pipeline);

// Register Ingestion Engine Components
builder.Services.AddScoped<IManifestorIntelligenceService, ManifestorIntelligenceService>();
builder.Services.AddScoped<IManifestorMaintenanceService, ManifestorMaintenanceService>();
builder.Services.AddScoped<IContextEnrichmentProcessor, ContextEnrichmentProcessor>();

// Register Data Providers with API configuration
builder.Services.AddScoped<IDataSourceProvider, FecProvider>();
builder.Services.AddScoped<IDataSourceProvider, CongressionalActivityProvider>();
builder.Services.AddScoped<IDataSourceProvider, EthicsCommitteeProvider>();
builder.Services.AddScoped<IDataSourceProvider, FiscalPulseProvider>();
builder.Services.AddScoped<IDataSourceProvider, GrantPulseProvider>();
builder.Services.AddScoped<IIngestionService, IngestionService>();

// Register Tech Debt Services
builder.Services.AddScoped<IOracleDriftDetector>(sp =>
{
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    var catalogPath = Path.Combine(env.ContentRootPath, "../../documentation/Technical/ORACLE_DATA_CATALOG.md");
    var journalPath = Path.Combine(env.ContentRootPath, "../../documentation/Technical/MANIFESTOR_JOURNAL.md");
    return new OracleDriftDetector(catalogPath, journalPath);
});

builder.Services.AddScoped<IDistrictResolver, DistrictResolver>();

// Enable CORS for mobile development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ── Cosmos DB — ensure database and container exist ───────────────────────────
{
    var cosmosClient = app.Services.GetRequiredService<CosmosClient>();
    var cosmosSettings = app.Services.GetRequiredService<IOptions<CosmosSettings>>().Value;
    var dbResponse = await cosmosClient.CreateDatabaseIfNotExistsAsync(cosmosSettings.DatabaseId);
    await dbResponse.Database.CreateContainerIfNotExistsAsync(
        id: cosmosSettings.UserContainerId,
        partitionKeyPath: "/partitionKey",
        throughput: 400);
}

// Initialize normalization system from static files
await NormalizationInitializer.InitializeNormalizationAsync(
    "Data/Normalization",
    repRepo, billRepo, committeeRepo, donorRepo, index);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "PoliTickIt API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Minimal API Endpoints for Snap Distribution
app.MapGet("/api/snaps/registry", async (ISnapRepository repository) =>
{
    var snaps = await repository.GetAllSnapsAsync();
    return Results.Ok(snaps);
})
.WithName("GetSnapRegistry")
.WithOpenApi();

app.MapGet("/api/snaps/{id}", async (string id, ISnapRepository repository) =>
{
    var snap = await repository.GetSnapByIdAsync(id);
    return snap is not null ? Results.Ok(snap) : Results.NotFound();
})
.WithName("GetSnapById")
.WithOpenApi();

// Minimal API Endpoints for Representative Distribution (RSP Protocol)
app.MapGet("/api/representatives/registry", async (ICanonicalEntityRepository<CanonicalRepresentative> repository) =>
{
    var reps = await repository.GetAllAsync();
    return Results.Ok(reps.Select(r => new {
        id = r.Id.ToString(),
        name = r.FullName,
        state = r.State,
        party = r.Party,
        position = r.Chamber,
        profileImage = "" // Managed by mobile client fallback if empty
    }));
})
.WithName("GetRepresentativeRegistry")
.WithOpenApi();

app.MapGet("/api/representatives/{id}", async (Guid id, ICanonicalEntityRepository<CanonicalRepresentative> repository) =>
{
    var rep = await repository.GetAsync(id);
    if (rep == null) return Results.NotFound();
    
    return Results.Ok(new {
        id = rep.Id.ToString(),
        name = rep.FullName,
        state = rep.State,
        party = rep.Party,
        position = rep.Chamber,
        profileImage = ""
    });
})
.WithName("GetRepresentativeById")
.WithOpenApi();

// Minimal API Endpoints for Civic Participation (CPAP Protocol)
app.MapPost("/api/participation/audit", async ([FromBody] dynamic payload) =>
{
    // Placeholder for participation audit logging
    return Results.Ok(new { success = true, received = DateTime.UtcNow });
})
.WithName("UploadParticipationAudit")
.WithOpenApi();

// Minimal API Endpoints for Financial Correlations (FPP Protocol)
app.MapGet("/api/correlations/sync", () =>
{
    // Placeholder for correlation data distribution
    return Results.Ok(Array.Empty<object>());
})
.WithName("SyncCorrelations")
.WithOpenApi();

// Minimal API Endpoints for Hardware Verification (ZKTP Protocol)
app.MapPost("/api/verify/hardware", () =>
{
    return Results.Ok(new { verified = true });
})
.WithName("VerifyHardware")
.WithOpenApi();

// Persist normalization data on shutdown
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStopping.Register(async () =>
{
    await NormalizationInitializer.PersistNormalizationAsync(
        "Data/Normalization",
        repRepo, billRepo, committeeRepo, donorRepo, index);
});

app.Run();

// Make Program accessible to test projects
public partial class Program { }

