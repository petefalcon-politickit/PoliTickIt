using System.Linq;
using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Infrastructure.Persistence;
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
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();

// Configure Oracle Settings from appsettings.json
builder.Services.Configure<OracleSettings>(builder.Configuration.GetSection(OracleSettings.SectionName));

// Register Core Infrastructure
builder.Services.AddSingleton<ISnapRepository, InMemorySnapRepository>();

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
        options.SwaggerEndpoint("/openapi/v1.json", "PoliTickIt API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");
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

