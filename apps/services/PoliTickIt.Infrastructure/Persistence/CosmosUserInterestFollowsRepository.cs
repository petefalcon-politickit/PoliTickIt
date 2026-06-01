// ─────────────────────────────────────────────────────────────────────────────
// FILE        : CosmosUserInterestFollowsRepository.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Persistence
// PURPOSE     : Cosmos DB implementation of IUserInterestFollowsRepository.
//               Stores a single "interest-follows" document per user inside the
//               existing UserLogin container (partition key = user's email).
//
// DOCUMENT SHAPE:
//   {
//     "id":             "interest-follows",
//     "partitionKey":   "user@example.com",
//     "type":           "interest-follows",
//     "policyAreaIds":  ["economics-and-public-finance", "health", ...]
//   }
//
// Co-located with the user account — zero cross-partition reads.
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Infrastructure.Persistence;

public sealed class CosmosUserInterestFollowsRepository : IUserInterestFollowsRepository
{
    private const string DocId   = "interest-follows";
    private const string DocType = "interest-follows";

    private readonly Container _container;
    private readonly ILogger<CosmosUserInterestFollowsRepository> _logger;

    public CosmosUserInterestFollowsRepository(
        CosmosClient cosmosClient,
        IOptions<CosmosSettings> options,
        ILogger<CosmosUserInterestFollowsRepository> logger)
    {
        var settings = options.Value;
        _container = cosmosClient
            .GetDatabase(settings.DatabaseId)
            .GetContainer(settings.UserContainerId);
        _logger = logger;
    }

    // ── IUserInterestFollowsRepository ────────────────────────────────────────

    public async Task<IReadOnlyList<string>> GetFollowedIdsAsync(
        string userEmail, CancellationToken ct = default)
    {
        try
        {
            var response = await _container.ReadItemAsync<InterestFollowsDocument>(
                id: DocId,
                partitionKey: new PartitionKey(userEmail),
                cancellationToken: ct);
            return response.Resource.PolicyAreaIds ?? [];
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return [];
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read interest-follows for {Email}", userEmail);
            return [];
        }
    }

    public async Task FollowAsync(
        string userEmail, string policyAreaId, CancellationToken ct = default)
    {
        var doc = await ReadOrCreateAsync(userEmail, ct);
        if (!doc.PolicyAreaIds.Contains(policyAreaId, StringComparer.OrdinalIgnoreCase))
        {
            doc.PolicyAreaIds.Add(policyAreaId);
            await _container.UpsertItemAsync(doc, new PartitionKey(userEmail), cancellationToken: CancellationToken.None);
        }
    }

    public async Task UnfollowAsync(
        string userEmail, string policyAreaId, CancellationToken ct = default)
    {
        var doc = await ReadOrCreateAsync(userEmail, ct);
        var removed = doc.PolicyAreaIds.RemoveAll(
            id => string.Equals(id, policyAreaId, StringComparison.OrdinalIgnoreCase));
        if (removed > 0)
            await _container.UpsertItemAsync(doc, new PartitionKey(userEmail), cancellationToken: ct);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private async Task<InterestFollowsDocument> ReadOrCreateAsync(string userEmail, CancellationToken ct)
    {
        try
        {
            var response = await _container.ReadItemAsync<InterestFollowsDocument>(
                id: DocId,
                partitionKey: new PartitionKey(userEmail),
                cancellationToken: ct);
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return new InterestFollowsDocument
            {
                Id           = DocId,
                PartitionKey = userEmail,
                Type         = DocType,
                PolicyAreaIds = new List<string>(),
            };
        }
    }
}

// ── Cosmos document model ─────────────────────────────────────────────────────
internal sealed class InterestFollowsDocument
{
    [System.Text.Json.Serialization.JsonPropertyName("id")]
    public string Id { get; set; } = DocId;

    [System.Text.Json.Serialization.JsonPropertyName("partitionKey")]
    public string PartitionKey { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("type")]
    public string Type { get; set; } = DocType;

    [System.Text.Json.Serialization.JsonPropertyName("policyAreaIds")]
    public List<string> PolicyAreaIds { get; set; } = [];

    // constant shims so the class compiles without referencing the outer consts
    private const string DocId   = "interest-follows";
    private const string DocType = "interest-follows";
}
