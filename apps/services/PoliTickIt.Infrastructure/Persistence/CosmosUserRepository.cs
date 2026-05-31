using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.Persistence;

/// <summary>
/// Cosmos DB implementation of IUserRepository.
/// Partition key: /email  (matches UserLogin container configuration).
/// Document id  : AppUser.Id (Guid, stored as string).
/// </summary>
public sealed class CosmosUserRepository : IUserRepository
{
    private readonly Container _container;

    public CosmosUserRepository(CosmosClient cosmosClient, IOptions<CosmosSettings> options)
    {
        var settings = options.Value;
        _container = cosmosClient
            .GetDatabase(settings.DatabaseId)
            .GetContainer(settings.UserContainerId);
    }

    public async Task<AppUser?> FindByEmailAsync(string email)
    {
        // Point-read via partition key — O(1) RU cost
        try
        {
            var response = await _container.ReadItemAsync<CosmosUserDocument>(
                id: email, // Use email as document id for direct partition-key lookup
                partitionKey: new PartitionKey(email));

            return response.Resource.ToAppUser();
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            // Fall back to query in case id != email (legacy docs where id = Guid)
            return await QueryByEmailAsync(email);
        }
    }

    public async Task<AppUser?> FindByIdAsync(Guid id)
    {
        var query = new QueryDefinition(
            "SELECT * FROM c WHERE c.userId = @id")
            .WithParameter("@id", id.ToString());

        using var iterator = _container.GetItemQueryIterator<CosmosUserDocument>(query);
        while (iterator.HasMoreResults)
        {
            foreach (var doc in await iterator.ReadNextAsync())
                return doc.ToAppUser();
        }
        return null;
    }

    public async Task AddAsync(AppUser user)
    {
        var doc = CosmosUserDocument.FromAppUser(user);
        await _container.CreateItemAsync(doc, new PartitionKey(user.Email));
    }

    public async Task UpdateAsync(AppUser user)
    {
        var doc = CosmosUserDocument.FromAppUser(user);
        await _container.UpsertItemAsync(doc, new PartitionKey(user.Email));
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private async Task<AppUser?> QueryByEmailAsync(string email)
    {
        var query = new QueryDefinition(
            "SELECT * FROM c WHERE c.email = @email")
            .WithParameter("@email", email);

        using var iterator = _container.GetItemQueryIterator<CosmosUserDocument>(query);
        while (iterator.HasMoreResults)
        {
            foreach (var doc in await iterator.ReadNextAsync())
                return doc.ToAppUser();
        }
        return null;
    }
}

/// <summary>
/// Cosmos document shape for AppUser.
/// Uses "id" = email so FindByEmail can use a cheap point-read.
/// </summary>
internal sealed class CosmosUserDocument
{
    // Cosmos-required "id" — set to email for O(1) partition+id lookups
    public string id { get; set; } = string.Empty;

    // Partition key field — value is always the email
    public string partitionKey { get; set; } = string.Empty;

    public string userId { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string firstName { get; set; } = string.Empty;
    public string lastName { get; set; } = string.Empty;
    public string passwordHash { get; set; } = string.Empty;
    public string zip { get; set; } = string.Empty;
    public string party { get; set; } = string.Empty;
    public string state { get; set; } = string.Empty;
    public string district { get; set; } = string.Empty;
    public List<string> interests { get; set; } = new();
    public DateTime createdAt { get; set; }
    public string? refreshToken { get; set; }
    public DateTime? refreshTokenExpiry { get; set; }
    public bool isEmailVerified { get; set; } = false;
    public string? verificationCode { get; set; }
    public DateTime? verificationCodeExpiry { get; set; }

    public static CosmosUserDocument FromAppUser(AppUser u) => new()
    {
        id = u.Email,
        partitionKey = u.Email,
        userId = u.Id.ToString(),
        email = u.Email,
        firstName = u.FirstName,
        lastName = u.LastName,
        passwordHash = u.PasswordHash,
        zip = u.Zip,
        party = u.Party,
        state = u.State,
        district = u.District,
        interests = u.Interests,
        createdAt = u.CreatedAt,
        refreshToken = u.RefreshToken,
        refreshTokenExpiry = u.RefreshTokenExpiry,
        isEmailVerified = u.IsEmailVerified,
        verificationCode = u.VerificationCode,
        verificationCodeExpiry = u.VerificationCodeExpiry,
    };

    public AppUser ToAppUser() => new()
    {
        Id = Guid.TryParse(userId, out var guid) ? guid : Guid.NewGuid(),
        Email = email,
        FirstName = firstName,
        LastName = lastName,
        PasswordHash = passwordHash,
        Zip = zip,
        Party = party,
        State = state,
        District = district,
        Interests = interests,
        CreatedAt = createdAt,
        RefreshToken = refreshToken,
        RefreshTokenExpiry = refreshTokenExpiry,
        IsEmailVerified = isEmailVerified,
        VerificationCode = verificationCode,
        VerificationCodeExpiry = verificationCodeExpiry,
    };
}
