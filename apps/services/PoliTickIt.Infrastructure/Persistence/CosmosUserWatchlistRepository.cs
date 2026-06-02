// ─────────────────────────────────────────────────────────────────────────────
// FILE        : CosmosUserWatchlistRepository.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Persistence
// PURPOSE     : Cosmos DB implementation of IUserWatchlistRepository.
//               Stores a single "watchlist" document per user inside the
//               existing UserLogin container (partition key = user email).
//
// DOCUMENT SHAPE:
//   {
//     "id":           "watchlist",
//     "partitionKey": "user@example.com",
//     "type":         "watchlist",
//     "snapIds":      ["snap-abc", "snap-xyz", ...]
//   }
//
// Co-located with the user account — zero cross-partition reads.
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Infrastructure.Persistence;

public sealed class CosmosUserWatchlistRepository : IUserWatchlistRepository
{
    private const string DocId   = "watchlist";
    private const string DocType = "watchlist";

    private readonly Container _container;
    private readonly ILogger<CosmosUserWatchlistRepository> _logger;

    public CosmosUserWatchlistRepository(
        CosmosClient cosmosClient,
        IOptions<CosmosSettings> options,
        ILogger<CosmosUserWatchlistRepository> logger)
    {
        var settings = options.Value;
        _container = cosmosClient
            .GetDatabase(settings.DatabaseId)
            .GetContainer(settings.UserContainerId);
        _logger = logger;
    }

    // ── IUserWatchlistRepository ──────────────────────────────────────────────

    public async Task<IReadOnlyList<string>> GetWatchedIdsAsync(
        string userEmail, CancellationToken ct = default)
    {
        try
        {
            var response = await _container.ReadItemAsync<WatchlistDocument>(
                id: DocId,
                partitionKey: new PartitionKey(userEmail),
                cancellationToken: ct);
            return response.Resource.SnapIds ?? [];
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return [];
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read watchlist for {Email}", userEmail);
            return [];
        }
    }

    public async Task AddAsync(
        string userEmail, string snapId, CancellationToken ct = default)
    {
        var doc = await ReadOrCreateAsync(userEmail, ct);
        if (!doc.SnapIds.Contains(snapId, StringComparer.OrdinalIgnoreCase))
        {
            doc.SnapIds.Add(snapId);
            await _container.UpsertItemAsync(doc, new PartitionKey(userEmail),
                cancellationToken: CancellationToken.None);
        }
    }

    public async Task RemoveAsync(
        string userEmail, string snapId, CancellationToken ct = default)
    {
        var doc = await ReadOrCreateAsync(userEmail, ct);
        var removed = doc.SnapIds.RemoveAll(
            id => string.Equals(id, snapId, StringComparison.OrdinalIgnoreCase));
        if (removed > 0)
        {
            await _container.UpsertItemAsync(doc, new PartitionKey(userEmail),
                cancellationToken: CancellationToken.None);
        }
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private async Task<WatchlistDocument> ReadOrCreateAsync(
        string userEmail, CancellationToken ct)
    {
        try
        {
            var response = await _container.ReadItemAsync<WatchlistDocument>(
                id: DocId,
                partitionKey: new PartitionKey(userEmail),
                cancellationToken: ct);
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return new WatchlistDocument
            {
                Id           = DocId,
                PartitionKey = userEmail,
                Type         = DocType,
                SnapIds      = [],
            };
        }
    }

    // ── Private document model ────────────────────────────────────────────────

    private sealed class WatchlistDocument
    {
        [System.Text.Json.Serialization.JsonPropertyName("id")]
        public string Id { get; set; } = DocId;

        [System.Text.Json.Serialization.JsonPropertyName("partitionKey")]
        public string PartitionKey { get; set; } = string.Empty;

        [System.Text.Json.Serialization.JsonPropertyName("type")]
        public string Type { get; set; } = DocType;

        [System.Text.Json.Serialization.JsonPropertyName("snapIds")]
        public List<string> SnapIds { get; set; } = [];
    }
}
