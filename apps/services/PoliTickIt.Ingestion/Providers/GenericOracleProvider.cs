// ─────────────────────────────────────────────────────────────────────────────
// FILE        : GenericOracleProvider.cs
// PROJECT     : PoliTickIt.Ingestion
// LAYER       : Ingestion → Providers
// PURPOSE     : Generic base class for type-safe Oracle providers (A2.2 / D7).
//               Separates HTTP fetch + deserialization from item extraction and
//               snap mapping. Concrete providers only implement:
//                 - BuildRequestUri()    — endpoint URL
//                 - ExtractItems()       — pull item list from envelope response
//                 - MapItem()            — map one item to a PoliSnap
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Providers;

/// <summary>
/// Generic Oracle base class.
/// <typeparam name="TResponse">The API envelope type (e.g. the JSON root object).</typeparam>
/// <typeparam name="TItem">The individual record type within the response.</typeparam>
/// </summary>
public abstract class GenericOracleProvider<TResponse, TItem> : BaseOracleProvider
{
    private static readonly JsonSerializerOptions _jsonOptions =
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

    protected GenericOracleProvider(HttpClient httpClient, IContextEnrichmentProcessor cep)
        : base(httpClient, cep) { }

    // ── Abstract interface for concrete providers ─────────────────────────────

    /// <summary>Returns the full request URI for this Oracle.</summary>
    protected abstract string BuildRequestUri();

    /// <summary>
    /// Extracts the list of items from the API envelope response.
    /// Return empty enumerable (never null) when the response has no items.
    /// </summary>
    protected abstract IEnumerable<TItem> ExtractItems(TResponse response);

    /// <summary>
    /// Maps a single API item to a PoliSnap.
    /// Return null to skip the item (e.g. when the item fails validation).
    /// </summary>
    protected abstract PoliSnap? MapItem(TItem item);

    // ── Orchestration ─────────────────────────────────────────────────────────

    public override async Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync()
    {
        var snaps = new List<PoliSnap>();

        try
        {
            var httpResponse = await HttpClient.GetAsync(BuildRequestUri());

            if (!httpResponse.IsSuccessStatusCode)
            {
                Console.WriteLine(
                    $"Oracle Error [{ProviderName}]: HTTP {(int)httpResponse.StatusCode} from {BuildRequestUri()}");
                return snaps;
            }

            var envelope = await httpResponse.Content.ReadFromJsonAsync<TResponse>(_jsonOptions);
            if (envelope is null)
                return snaps;

            foreach (var item in ExtractItems(envelope))
            {
                var snap = MapItem(item);
                if (snap is null)
                    continue;

                await EnrichSnapAsync(snap, item);
                snaps.Add(snap);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Oracle Error [{ProviderName}]: {ex.Message}");
        }

        return snaps;
    }

    // ── Optional extension point ──────────────────────────────────────────────

    /// <summary>
    /// Override to perform per-item async enrichment (e.g. body-text fetch, ACD threading).
    /// Default implementation calls ThreadDown with neutral scores.
    /// </summary>
    protected virtual Task EnrichSnapAsync(PoliSnap snap, TItem item)
    {
        ThreadDown(snap, intensity: 0.5, geographicDensity: 0.5, roiPotential: 0.5,
            derivationSummary: $"{ProviderName} — {snap.Title}");
        return Task.CompletedTask;
    }
}
