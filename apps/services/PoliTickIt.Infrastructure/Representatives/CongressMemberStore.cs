// ─────────────────────────────────────────────────────────────────────────────
// FILE        : CongressMemberStore.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Representatives
// PURPOSE     : Fetches all sitting Congress members from api.congress.gov and
//               caches them in memory for fast district-based lookup.
//               Hydrated on startup via RepresentativesHydrationService.
// ─────────────────────────────────────────────────────────────────────────────

using System.Collections.Concurrent;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.Representatives;

/// <summary>
/// Thread-safe in-memory store for all current US Congress members.
/// Keyed by "{STATE2}:{DISTRICT}" for House members and "{STATE2}:S" for Senators.
/// </summary>
public sealed class CongressMemberStore : IRepresentativeStore
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOptions<CongressApiOptions> _options;
    private readonly ILogger<CongressMemberStore> _logger;

    private readonly ConcurrentDictionary<string, List<CongressMember>> _index = new();
    private volatile bool _hydrated;

    public bool IsHydrated => _hydrated;

    public CongressMemberStore(
        IHttpClientFactory httpClientFactory,
        IOptions<CongressApiOptions> options,
        ILogger<CongressMemberStore> logger)
    {
        _httpClientFactory = httpClientFactory;
        _options = options;
        _logger = logger;
    }

    // ── IRepresentativeStore ──────────────────────────────────────────────────

    public IReadOnlyList<CongressMember> GetForDistrict(string state, string district)
    {
        var s = state.ToUpperInvariant();
        var result = new List<CongressMember>();

        // House reps for this specific district
        if (_index.TryGetValue($"{s}:{district}", out var house))
            result.AddRange(house);

        // Both senators for this state
        if (_index.TryGetValue($"{s}:S", out var senators))
            result.AddRange(senators);

        return result;
    }

    public IReadOnlyList<CongressMember> GetAll()
    {
        var all = new List<CongressMember>();
        foreach (var list in _index.Values)
            all.AddRange(list);
        return all;
    }

    public async Task HydrateAsync(CancellationToken ct = default)
    {
        var congress = _options.Value;
        var client = _httpClientFactory.CreateClient();

        const int limit = 250;
        int offset = 0;
        int fetched = 0;

        var newIndex = new ConcurrentDictionary<string, List<CongressMember>>();

        _logger.LogInformation("Starting Congress member hydration…");

        while (true)
        {
            var url = $"{congress.BaseUrl}/member?api_key={congress.ApiKey}" +
                      $"&format=json&currentMember=true&limit={limit}&offset={offset}";

            MemberListResponse? response;
            try
            {
                response = await client.GetFromJsonAsync<MemberListResponse>(url, ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Congress API fetch failed at offset {Offset}", offset);
                break;
            }

            if (response?.Members == null || response.Members.Count == 0)
                break;

            foreach (var dto in response.Members)
            {
                var state2 = ToStateCode(dto.State);
                if (state2 == null) continue;

                var lastChamber = dto.Terms?.Item?.LastOrDefault()?.Chamber ?? string.Empty;
                var isSenate = lastChamber.Contains("Senate", StringComparison.OrdinalIgnoreCase);
                var chamber = isSenate ? "Senate" : "House";

                var member = new CongressMember(
                    BioguideId: dto.BioguideId ?? string.Empty,
                    Name: NormalizeName(dto.Name),
                    Party: dto.PartyName ?? "Unknown",
                    State: state2,
                    District: isSenate ? null : (dto.District?.ToString() ?? "0"),
                    Chamber: chamber,
                    ImageUrl: dto.Depiction?.ImageUrl,
                    CongressGovUrl: dto.Url);

                var key = isSenate
                    ? $"{state2}:S"
                    : $"{state2}:{member.District}";

                newIndex.AddOrUpdate(
                    key,
                    _ => [member],
                    (_, existing) => { lock (existing) { existing.Add(member); } return existing; });

                fetched++;
            }

            offset += response.Members.Count;

            // Stop if we received fewer records than the page limit (last page)
            if (response.Members.Count < limit)
                break;
        }

        // Atomic swap
        _index.Clear();
        foreach (var (k, v) in newIndex)
            _index[k] = v;

        _hydrated = true;
        _logger.LogInformation(
            "Congress hydration complete: {Members} members, {Keys} state/district keys",
            fetched, _index.Count);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static string NormalizeName(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return string.Empty;
        // Congress.gov returns "LastName, FirstName" — invert to "FirstName LastName"
        var comma = raw.IndexOf(',');
        return comma > 0
            ? $"{raw[(comma + 1)..].Trim()} {raw[..comma].Trim()}"
            : raw.Trim();
    }

    private static readonly Dictionary<string, string> StateNames =
        new(StringComparer.OrdinalIgnoreCase)
        {
            { "Alabama", "AL" }, { "Alaska", "AK" }, { "Arizona", "AZ" },
            { "Arkansas", "AR" }, { "California", "CA" }, { "Colorado", "CO" },
            { "Connecticut", "CT" }, { "Delaware", "DE" }, { "Florida", "FL" },
            { "Georgia", "GA" }, { "Hawaii", "HI" }, { "Idaho", "ID" },
            { "Illinois", "IL" }, { "Indiana", "IN" }, { "Iowa", "IA" },
            { "Kansas", "KS" }, { "Kentucky", "KY" }, { "Louisiana", "LA" },
            { "Maine", "ME" }, { "Maryland", "MD" }, { "Massachusetts", "MA" },
            { "Michigan", "MI" }, { "Minnesota", "MN" }, { "Mississippi", "MS" },
            { "Missouri", "MO" }, { "Montana", "MT" }, { "Nebraska", "NE" },
            { "Nevada", "NV" }, { "New Hampshire", "NH" }, { "New Jersey", "NJ" },
            { "New Mexico", "NM" }, { "New York", "NY" }, { "North Carolina", "NC" },
            { "North Dakota", "ND" }, { "Ohio", "OH" }, { "Oklahoma", "OK" },
            { "Oregon", "OR" }, { "Pennsylvania", "PA" }, { "Rhode Island", "RI" },
            { "South Carolina", "SC" }, { "South Dakota", "SD" }, { "Tennessee", "TN" },
            { "Texas", "TX" }, { "Utah", "UT" }, { "Vermont", "VT" },
            { "Virginia", "VA" }, { "Washington", "WA" }, { "West Virginia", "WV" },
            { "Wisconsin", "WI" }, { "Wyoming", "WY" },
            { "District of Columbia", "DC" },
            { "Puerto Rico", "PR" }, { "Guam", "GU" }, { "Virgin Islands", "VI" },
            { "American Samoa", "AS" }, { "Northern Mariana Islands", "MP" },
        };

    private static string? ToStateCode(string? state)
    {
        if (string.IsNullOrWhiteSpace(state)) return null;
        // Already a 2-letter code
        if (state.Length == 2) return state.ToUpperInvariant();
        return StateNames.TryGetValue(state, out var code) ? code : null;
    }

    // ── JSON DTOs (private — only used by this class) ─────────────────────────

    private sealed class MemberListResponse
    {
        [JsonPropertyName("members")]
        public List<MemberDto>? Members { get; set; }
    }

    private sealed class MemberDto
    {
        [JsonPropertyName("bioguideId")]
        public string? BioguideId { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("partyName")]
        public string? PartyName { get; set; }

        [JsonPropertyName("state")]
        public string? State { get; set; }

        [JsonPropertyName("district")]
        public int? District { get; set; }

        [JsonPropertyName("terms")]
        public TermsDto? Terms { get; set; }

        [JsonPropertyName("depiction")]
        public DepictionDto? Depiction { get; set; }

        [JsonPropertyName("url")]
        public string? Url { get; set; }
    }

    private sealed class TermsDto
    {
        [JsonPropertyName("item")]
        public List<TermItemDto>? Item { get; set; }
    }

    private sealed class TermItemDto
    {
        [JsonPropertyName("chamber")]
        public string? Chamber { get; set; }
    }

    private sealed class DepictionDto
    {
        [JsonPropertyName("imageUrl")]
        public string? ImageUrl { get; set; }
    }
}

// ── Options ───────────────────────────────────────────────────────────────────
/// <summary>
/// Bound from appsettings OracleSettings:Congress.
/// </summary>
public sealed class CongressApiOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.congress.gov/v3";
}
