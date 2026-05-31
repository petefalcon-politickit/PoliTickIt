// ─────────────────────────────────────────────────────────────────────────────
// FILE        : CongressDistrictLookupService.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → District
// PURPOSE     : Implements IDistrictLookupService using the Congress.gov API
//               (GET /v3/member?zip={zip}) to resolve a zip code to its
//               state and congressional district.
// ─────────────────────────────────────────────────────────────────────────────

using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Infrastructure.District;

public sealed class CongressDistrictLookupService : IDistrictLookupService
{
    private readonly HttpClient _http;
    private readonly string _baseUrl;
    private readonly string _apiKey;
    private readonly ILogger<CongressDistrictLookupService> _logger;

    public CongressDistrictLookupService(
        HttpClient http,
        string congressBaseUrl,
        string congressApiKey,
        ILogger<CongressDistrictLookupService> logger)
    {
        _http = http;
        _baseUrl = congressBaseUrl;
        _apiKey = congressApiKey;
        _logger = logger;
    }

    public async Task<DistrictLookupResult?> LookupByZipAsync(string zip)
    {
        if (string.IsNullOrWhiteSpace(zip) || zip.Length != 5 || !zip.All(char.IsDigit))
            return null;

        try
        {
            var url = $"{_baseUrl}/member?zip={zip}&api_key={_apiKey}&format=json&limit=10";
            var response = await _http.GetFromJsonAsync<CongressMemberResponse>(url);

            var members = response?.Members;
            if (members is null || members.Count == 0)
                return null;

            // Prefer a House member — they carry both state AND district.
            // Senators have no district number, so taking state from a senator
            // and district from a different House member risks a state mismatch.
            var houseMember = members.FirstOrDefault(m =>
                m.Terms?.Item?.Any(t => t.Chamber?.Equals("House of Representatives", StringComparison.OrdinalIgnoreCase) == true) == true);

            var state    = houseMember?.State ?? members.FirstOrDefault()?.State ?? string.Empty;
            var district = houseMember?.District?.ToString() ?? string.Empty;

            return new DistrictLookupResult(state, district, members.Count);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "District lookup failed for zip {Zip}", zip);
            return null;
        }
    }

    // ── Congress.gov API response shapes ─────────────────────────────────────

    private sealed class CongressMemberResponse
    {
        [JsonPropertyName("members")]
        public List<CongressMember>? Members { get; set; }
    }

    private sealed class CongressMember
    {
        [JsonPropertyName("bioguideId")]
        public string? BioguideId { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("state")]
        public string? State { get; set; }

        [JsonPropertyName("district")]
        public int? District { get; set; }

        [JsonPropertyName("partyName")]
        public string? PartyName { get; set; }

        [JsonPropertyName("terms")]
        public CongressMemberTerms? Terms { get; set; }
    }

    private sealed class CongressMemberTerms
    {
        [JsonPropertyName("item")]
        public List<CongressTerm>? Item { get; set; }
    }

    private sealed class CongressTerm
    {
        [JsonPropertyName("chamber")]
        public string? Chamber { get; set; }
    }
}
