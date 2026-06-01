// ─────────────────────────────────────────────────────────────────────────────
// FILE        : CosmosUserFollowsRepository.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Persistence
// PURPOSE     : Cosmos DB implementation of IUserFollowsRepository.
//               Stores a single "rep-follows" document per user inside the
//               existing UserLogin container (partition key = user's email).
//
// DOCUMENT SHAPE:
//   {
//     "id":           "rep-follows",
//     "partitionKey": "user@example.com",
//     "type":         "rep-follows",
//     "bioguideIds":  ["M001184", "S000033", ...]
//   }
//
// This co-locates user follows with the user account — zero cross-partition
// reads and trivially portable when the container moves to a dedicated store.
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Infrastructure.Persistence;

public sealed class CosmosUserFollowsRepository : IUserFollowsRepository
{
    private const string DocId = "rep-follows";
    private const string DocType = "rep-follows";

    private readonly Container _container;
    private readonly ILogger<CosmosUserFollowsRepository> _logger;

    public CosmosUserFollowsRepository(
        CosmosClient cosmosClient,
        IOptions<CosmosSettings> options,
        ILogger<CosmosUserFollowsRepository> logger)
    {
        var settings = options.Value;
        _container = cosmosClient
            .GetDatabase(settings.DatabaseId)
            .GetContainer(settings.UserContainerId);
        _logger = logger;
    }

    // ── IUserFollowsRepository ────────────────────────────────────────────────

    public async Task<IReadOnlyList<string>> GetFollowedIdsAsync(
        string userEmail, CancellationToken ct = default)
    {
        try
        {
            var response = await _container.ReadItemAsync<RepFollowsDocument>(
                id: DocId,
                partitionKey: new PartitionKey(userEmail),
                cancellationToken: ct);
            return response.Resource.BioguideIds ?? [];
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return [];
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read rep-follows for {Email}", userEmail);
            return [];
        }
    }

    public async Task FollowAsync(
        string userEmail, string bioguideId, CancellationToken ct = default)
    {
        var doc = await ReadOrCreateAsync(userEmail, ct);
        if (!doc.BioguideIds.Contains(bioguideId, StringComparer.OrdinalIgnoreCase))
        {
            doc.BioguideIds.Add(bioguideId);
            await _container.UpsertItemAsync(doc, new PartitionKey(userEmail), cancellationToken: CancellationToken.None);
        }
    }

    public async Task UnfollowAsync(
        string userEmail, string bioguideId, CancellationToken ct = default)
    {
        var doc = await ReadOrCreateAsync(userEmail, ct);
        var removed = doc.BioguideIds.RemoveAll(
            id => string.Equals(id, bioguideId, StringComparison.OrdinalIgnoreCase));
        if (removed > 0)
            await _container.UpsertItemAsync(doc, new PartitionKey(userEmail), cancellationToken: CancellationToken.None);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private async Task<RepFollowsDocument> ReadOrCreateAsync(string userEmail, CancellationToken ct)
    {
        try
        {
            var response = await _container.ReadItemAsync<RepFollowsDocument>(
                id: DocId,
                partitionKey: new PartitionKey(userEmail),
                cancellationToken: ct);
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return new RepFollowsDocument
            {
                Id = DocId,
                PartitionKey = userEmail,
                Type = DocType,
                BioguideIds = new List<string>()
            };
        }
    }
}

// ── Cosmos document model ─────────────────────────────────────────────────────
internal sealed class RepFollowsDocument
{
    [System.Text.Json.Serialization.JsonPropertyName("id")]
    public string Id { get; set; } = RepFollowsDocumentConstants.DefaultId;

    [System.Text.Json.Serialization.JsonPropertyName("partitionKey")]
    public string PartitionKey { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("type")]
    public string Type { get; set; } = RepFollowsDocumentConstants.DefaultType;

    [System.Text.Json.Serialization.JsonPropertyName("bioguideIds")]
    public List<string> BioguideIds { get; set; } = [];
}

internal static class RepFollowsDocumentConstants
{
    public const string DefaultId = "rep-follows";
    public const string DefaultType = "rep-follows";
}
