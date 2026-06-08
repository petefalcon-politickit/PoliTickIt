// ─────────────────────────────────────────────────────────────────────────────
// FILE        : FederalRegisterIngestionProvider.cs
// PROJECT     : PoliTickIt.Ingestion
// LAYER       : Ingestion → Providers
// PURPOSE     : Fetches recent Presidential Executive Orders from the
//               Federal Register public API (no auth required) and maps
//               each one to a PoliSnap with Type = "ExecutiveOrder".
//               Extends GenericOracleProvider<FrApiResponse, FrDocument> (D7).
//               Body-text fetch is handled in EnrichSnapAsync override.
//
// DATA SOURCE : https://www.federalregister.gov/api/v1/documents.json
//               ?conditions[type][]=PRESDOCU
//               &conditions[presidential_document_type_id][]=2  (EO only)
//               &per_page=20&order=newest
//
// DNA HEADER  : Phase 4 — Executive Branch
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Linq;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Providers;

/// <summary>
/// Autonomous Oracle for Presidential Executive Orders via Federal Register API.
/// Maps each order to a PoliSnap (Type = "ExecutiveOrder") keyed to POTUS-47.
/// </summary>
public class FederalRegisterIngestionProvider
    : GenericOracleProvider<FrApiResponse, FrDocument>
{
    private const string ApiUrl =
        "https://www.federalregister.gov/api/v1/documents.json" +
        "?conditions[type][]=PRESDOCU" +
        "&conditions[presidential_document_type_id][]=2" +
        "&per_page=20&order=newest" +
        "&fields[]=document_number&fields[]=title&fields[]=publication_date" +
        "&fields[]=abstract&fields[]=html_url&fields[]=body_html_url" +
        "&fields[]=signing_date&fields[]=executive_order_number";

    private const int BodyTextMaxLength = 3000;

    // Hard-coded to current administration. Will be updated each term via config.
    private const string PotusId = "POTUS-47";

    public override string ProviderName => "FederalRegister.ExecutiveOrders.Oracle";

    public FederalRegisterIngestionProvider(
        HttpClient httpClient,
        IContextEnrichmentProcessor cep) : base(httpClient, cep)
    {
    }

    // ── GenericOracleProvider contract ───────────────────────────────────────

    protected override string BuildRequestUri() => ApiUrl;

    protected override IEnumerable<FrDocument> ExtractItems(FrApiResponse response) =>
        response.Results?.Where(d => !string.IsNullOrWhiteSpace(d.DocumentNumber))
        ?? Enumerable.Empty<FrDocument>();

    protected override PoliSnap? MapItem(FrDocument doc) => MapToSnap(doc);

    protected override async Task EnrichSnapAsync(PoliSnap snap, FrDocument doc)
    {
        ThreadDown(
            snap,
            intensity: 0.85,
            geographicDensity: 1.0,
            roiPotential: 0.9,
            derivationSummary: $"Executive Order #{doc.ExecutiveOrderNumber}: {doc.Title}");

        if (!string.IsNullOrWhiteSpace(doc.BodyHtmlUrl))
            await FetchBodyTextAsync(snap, doc.BodyHtmlUrl!);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private async Task FetchBodyTextAsync(PoliSnap snap, string bodyHtmlUrl)
    {
        try
        {
            var html = await HttpClient.GetStringAsync(bodyHtmlUrl);
            snap.Metadata.BodyText = StripHtml(html);
            snap.Metadata.BodyHtmlUrl = bodyHtmlUrl;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Oracle Warning [{ProviderName}]: body fetch failed for {snap.Id} — {ex.Message}");
            snap.Metadata.BodyHtmlUrl = bodyHtmlUrl; // store URL even if fetch failed
        }
    }

    private static string StripHtml(string html)
    {
        if (string.IsNullOrWhiteSpace(html)) return string.Empty;

        // Remove script/style blocks entirely
        var cleaned = Regex.Replace(html, @"<(script|style)[^>]*>[\s\S]*?<\/\1>",
            string.Empty, RegexOptions.IgnoreCase);
        // Strip remaining tags
        cleaned = Regex.Replace(cleaned, @"<[^>]+>", " ");
        // Collapse whitespace
        cleaned = Regex.Replace(cleaned, @"\s{2,}", " ").Trim();

        return cleaned.Length > BodyTextMaxLength
            ? cleaned[..BodyTextMaxLength] + "…"
            : cleaned;
    }

    private static PoliSnap MapToSnap(FrDocument doc)
    {
        var eoNumber = doc.ExecutiveOrderNumber is not null
            ? $"EO {doc.ExecutiveOrderNumber}"
            : doc.DocumentNumber;

        var publishedAt = doc.PublicationDate is not null
            ? DateTime.TryParse(doc.PublicationDate, out var d) ? d : DateTime.UtcNow
            : DateTime.UtcNow;

        var policyArea = doc.Subjects?.FirstOrDefault() ?? "Executive Action";

        return new PoliSnap
        {
            Id = $"eo-{doc.DocumentNumber}",
            Sku = $"EXECUTIVE-ORDER-{doc.DocumentNumber}",
            Title = doc.Title ?? $"Executive Order {doc.ExecutiveOrderNumber}",
            Subtitle = eoNumber,
            Type = "ExecutiveOrder",
            CreatedAt = publishedAt,
            UpdatedAt = publishedAt,
            Channels = new List<string>
            {
                "PoliTickIt:Accountability",
                $"Representative:{PotusId}",
                "Branch:Executive",
            },
            Sources = new List<Source>
            {
                new Source
                {
                    Name = "Federal Register",
                    Url = doc.HtmlUrl ?? "https://www.federalregister.gov",
                }
            },
            Metadata = new SnapMetadata
            {
                RepresentativeId = PotusId,
                InsightType = "Executive Order",
                PolicyArea = policyArea,
                ContentKey = $"eo:{doc.DocumentNumber}",
                LaymanSummary = doc.Abstract ?? $"Presidential Executive Order signed by the President of the United States.",
                Keywords = new List<string>(doc.Subjects ?? Enumerable.Empty<string>())
                    { "Executive Order", "Presidential Action", "Executive Branch" },
            },
            Elements = new List<SnapElement>
            {
                new SnapElement
                {
                    Id = "eo-header",
                    Type = "Universal.TextBlock",
                    Data = new Dictionary<string, object>
                    {
                        { "label", eoNumber },
                        { "text", doc.Title ?? "" },
                        { "subtext", doc.Abstract ?? "" },
                    }
                },
                new SnapElement
                {
                    Id = "eo-meta",
                    Type = "Universal.Gauge",
                    Data = new Dictionary<string, object>
                    {
                        { "mode", "Linear" },
                        { "value", 85 },
                        { "label", "Executive Authority" },
                        { "subLabel", $"Signed {doc.SigningDate ?? doc.PublicationDate ?? "—"}" },
                    }
                },
                new SnapElement
                {
                    Id = "trust-thread",
                    Type = "Trust.Thread",
                    Data = new Dictionary<string, object>
                    {
                        { "oracleSource", "Federal Register API v1" },
                        { "verificationLevel", "Tier 1" },
                        { "analysisMode", "Primary Source — U.S. Government" },
                    }
                }
            }
        };
    }

    // ── Federal Register API response shapes ─────────────────────────────────
    // Moved to top-level internal classes below (CS0060 accessibility requirement).
}

public sealed class FrApiResponse
{
    [JsonPropertyName("results")]
    public List<FrDocument>? Results { get; set; }
}

public sealed class FrDocument
{
    [JsonPropertyName("document_number")]
    public string? DocumentNumber { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("publication_date")]
    public string? PublicationDate { get; set; }

    [JsonPropertyName("signing_date")]
    public string? SigningDate { get; set; }

    [JsonPropertyName("abstract")]
    public string? Abstract { get; set; }

    [JsonPropertyName("html_url")]
    public string? HtmlUrl { get; set; }

    [JsonPropertyName("subjects")]
    public List<string>? Subjects { get; set; }

    [JsonPropertyName("executive_order_number")]
    public string? ExecutiveOrderNumber { get; set; }

    [JsonPropertyName("body_html_url")]
    public string? BodyHtmlUrl { get; set; }
}
