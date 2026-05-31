// ─────────────────────────────────────────────────────────────────────────────
// FILE        : StaticZipDistrictLookupService.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → District
// PURPOSE     : Implements IDistrictLookupService using a bundled static JSON
//               lookup table (state-postalcode-district.json).  Zero network
//               calls, no API key required.  For zip codes that span multiple
//               congressional districts the most-frequently-occurring district
//               is returned.
// ─────────────────────────────────────────────────────────────────────────────

using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Infrastructure.District;

public sealed class StaticZipDistrictLookupService : IDistrictLookupService
{
    // key = zip code, value = ordered list of (state, district) by frequency desc
    private readonly Dictionary<string, List<ZipEntry>> _lookup;

    public StaticZipDistrictLookupService()
    {
        _lookup = LoadLookup();
    }

    public Task<DistrictLookupResult?> LookupByZipAsync(string zip)
    {
        if (string.IsNullOrWhiteSpace(zip) || zip.Length != 5 || !zip.All(char.IsDigit))
            return Task.FromResult<DistrictLookupResult?>(null);

        if (!_lookup.TryGetValue(zip, out var entries) || entries.Count == 0)
            return Task.FromResult<DistrictLookupResult?>(null);

        // Take the most frequent entry (first after grouping by frequency)
        var best = entries[0];
        return Task.FromResult<DistrictLookupResult?>(
            new DistrictLookupResult(best.State, best.District, entries.Count));
    }

    // ── Startup loader ────────────────────────────────────────────────────────

    private static Dictionary<string, List<ZipEntry>> LoadLookup()
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = assembly.GetManifestResourceNames()
            .First(n => n.EndsWith("state-postalcode-district.json", StringComparison.OrdinalIgnoreCase));

        using var stream = assembly.GetManifestResourceStream(resourceName)!;
        var raw = JsonSerializer.Deserialize<List<RawEntry>>(stream,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

        return raw
            .GroupBy(e => e.PostalCode)
            .ToDictionary(
                g => g.Key,
                g => g
                    .GroupBy(e => (e.State, e.District))
                    .OrderByDescending(sg => sg.Count())
                    .Select(sg => new ZipEntry(sg.Key.State, sg.Key.District))
                    .ToList());
    }

    private sealed record RawEntry(
        [property: JsonPropertyName("state")]      string State,
        [property: JsonPropertyName("postalCode")] string PostalCode,
        [property: JsonPropertyName("district")]   string District);

    private sealed record ZipEntry(string State, string District);
}
