using System;
using System.Collections.Generic;

namespace PoliTickIt.Domain.Models;

public class PoliSnap
{
    public string Id { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    /// <summary>
    /// Set to <see cref="CreatedAt"/> on first save. Updated in-place when
    /// the snap's content changes (e.g. bill advances to Senate).
    /// Used by delta-sync: the server returns snaps where
    /// Max(CreatedAt, UpdatedAt) > sinceDate.
    /// </summary>
    public DateTime UpdatedAt { get; set; }
    /// <summary>
    /// Channel routing tags used for feed filtering, e.g.
    /// "PoliTickIt:Accountability", "Representative:S000148".
    /// Preserved from SNAP JSON for future API category queries.
    /// </summary>
    public List<string> Channels { get; set; } = new();
    public List<Source> Sources { get; set; } = new();
    public SnapMetadata Metadata { get; set; } = new();
    /// <summary>
    /// Jurisdiction scope for feed filtering and Cosmos partitioning.
    /// Format: "federal" | "state:TX" | "county:TX-Travis" | "city:Austin-TX".
    /// </summary>
    public string Jurisdiction { get; set; } = "federal";
    /// <summary>
    /// Tombstone flag — never hard-delete snaps.  When true the snap should be
    /// evicted from mobile caches and hidden from feeds.
    /// </summary>
    public bool IsRetracted { get; set; } = false;
    public DateTimeOffset? RetractedAt { get; set; }
    public List<SnapElement> Elements { get; set; } = new();
    public SnapNavigation? Navigation { get; set; }
    public string? Theme { get; set; }
    public string? Locale { get; set; }
}

public class Source
{
    public string Name { get; set; } = string.Empty;
    public string? Url { get; set; }
}

public class SnapMetadata
{
    public string? PolicyArea { get; set; }
    public string? InsightType { get; set; }
    public string? RepresentativeId { get; set; }
    public string? ApplicationTier { get; set; }
    public string? HeaderElementId { get; set; }
    public string? LaymanSummary { get; set; }
    public string? Description { get; set; }
    public ProvenanceMetadata? Provenance { get; set; }
    public List<string> Keywords { get; set; } = new();
    public string? SchemaVersion { get; set; }
    public string? AccessLevel { get; set; }
    public Dictionary<string, bool>? FeatureFlags { get; set; }
    public string? Author { get; set; }
    /// <summary>
    /// Stable domain identifier used for upsert detection by the generator.
    /// Structured prefix convention: "bill:{billNumber}", "rep:{bioguideId}",
    /// "amendment:{amendmentNumber}", "committee:{committeeCode}".
    /// Null for snaps that are never updated in-place.
    /// </summary>
    public string? ContentKey { get; set; }

    // ── Domain entity reference fields ──────────────────────────────────────
    // These are the canonical query surface for metadata algorithms and the
    // mining normalizer. All optional — old snaps without them deserialize cleanly.

    /// <summary>
    /// Stable bill identifier in Congress.gov format: "H.R.1041", "S.J.Res.185".
    /// Enables cross-snap bill joins without scanning element data.
    /// </summary>
    public string? BillId { get; set; }

    /// <summary>Congressional chamber: "House" or "Senate".</summary>
    public string? Chamber { get; set; }

    /// <summary>ISO-8601 date of the primary vote or event: "2026-05-21".</summary>
    public string? VoteDate { get; set; }

    /// <summary>
    /// Plain-text vote outcome: "Passed", "Failed", "Agreed to (50-47)", etc.
    /// </summary>
    public string? VoteOutcome { get; set; }

    /// <summary>Congressional session number as string: "119".</summary>
    public string? Congress { get; set; }

    // ── Policy Area ──────────────────────────────────────────────────────────

    /// <summary>
    /// Canonical slug ID from the Congress.gov policy area taxonomy,
    /// e.g. "economics-and-public-finance". Set by <c>IPolicyAreaNormalizer</c>
    /// during ingestion. Used for interest-based feed filtering.
    /// Null when the raw label could not be resolved to a known taxonomy entry.
    /// </summary>
    public string? PolicyAreaId { get; set; }

    // ── Full-body content (Executive Orders, legislation text, etc.) ─────────

    /// <summary>
    /// Plain-text body of the document (HTML tags stripped), truncated to
    /// ~3 000 characters. Populated at ingest time for document-type snaps
    /// (e.g. ExecutiveOrder) so detail screens can render content inline
    /// without a network call.
    /// </summary>
    public string? BodyText { get; set; }

    /// <summary>
    /// URL to the authoritative HTML rendering of the full document body.
    /// Used as a "Read full order →" deep-link fallback when <see cref="BodyText"/>
    /// is truncated or unavailable.
    /// </summary>
    public string? BodyHtmlUrl { get; set; }
}

public class SnapNavigation
{
    public string? ScreenName { get; set; }
    public Dictionary<string, object>? ScreenParams { get; set; }
    public List<string>? AvailableActions { get; set; }
}

public class SnapElement
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public Dictionary<string, object>? Data { get; set; }
    public SnapTemplate? Template { get; set; }
    public TextMetadata? TextMetadata { get; set; }
    public NavigationMetadata? Navigation { get; set; }
    public PresentationMetadata? Presentation { get; set; }
    public ControlFeatures? ControlFeatures { get; set; }
    public ProvenanceMetadata? Provenance { get; set; }
    public List<SnapElement>? Children { get; set; }
    public DataBinding? DataBinding { get; set; }
    public AccessibilityMetadata? Accessibility { get; set; }
    public AnalyticsMetadata? Analytics { get; set; }
}

public class ProvenanceMetadata
{
    public string Url { get; set; } = string.Empty;
    public string? Label { get; set; }
    public string? Type { get; set; }
    public bool? IsVerified { get; set; }
    public DateTime? Timestamp { get; set; }
    public string? Provider { get; set; }
    public string? AuditTrailId { get; set; }
}

public class TextMetadata
{
    public int? MaxCharacters { get; set; }
    public bool? ShowMoreAction { get; set; }
    public string? TruncationType { get; set; }
    public bool? IsClickable { get; set; }
    public string? Level { get; set; }
    public string? TextTransform { get; set; }
    public int? LineClamp { get; set; }
    public bool? Selectable { get; set; }
    public bool? Monospace { get; set; }
}

public class NavigationMetadata
{
    public string Route { get; set; } = string.Empty;
    public Dictionary<string, object>? Parameters { get; set; }
    public bool IsClickable { get; set; }
    public string ActionType { get; set; } = "navigate";
    public string? CustomAction { get; set; }
    public string? FeedbackType { get; set; }
}

public class PresentationMetadata
{
    public string? Layout { get; set; }
    public string? Styling { get; set; }
    public int? Order { get; set; }
    public bool? Visible { get; set; }
    public string? Size { get; set; }
    public PresentationAttributes? Attributes { get; set; }
}

public class PresentationAttributes
{
    public string? ResponsiveSize { get; set; }
    public string? Emphasis { get; set; }
    public string? Border { get; set; }
    public string? Spacing { get; set; }
    public string? Background { get; set; }
    public Dictionary<string, object>? AdditionalProperties { get; set; }
}

public class ControlFeatures
{
    public string? Template { get; set; }
    public string? CollectionMode { get; set; }
    public string? Carousel { get; set; }
    public string? Truncation { get; set; }
    public CustomSettings? CustomSettings { get; set; }
}

public class CustomSettings
{
    public int? AutoScrollInterval { get; set; }
    public bool? ShowPagingIndicators { get; set; }
    public int? Columns { get; set; }
    public string? ItemSpacing { get; set; }
    public int? TruncationLimit { get; set; }
    public int? PageSize { get; set; }
    public bool? Hidden { get; set; }
    public AnimationMetadata? Animation { get; set; }
    public Dictionary<string, object>? AdditionalProperties { get; set; }
}

public class AnimationMetadata
{
    public string? Type { get; set; }
    public int? Duration { get; set; }
    public int? Delay { get; set; }
}

public class SnapTemplate
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ElementType { get; set; } = string.Empty;
    public Dictionary<string, string>? DataSchema { get; set; }
    public List<string>? RequiredFields { get; set; }
    public Dictionary<string, string>? ComponentMap { get; set; }
    public string? RenderingGuidance { get; set; }
    public string? Version { get; set; }
}

public class DataBinding
{
    public string? SourcePath { get; set; }
    public string? DataType { get; set; }
    public string? Transformation { get; set; }
    public bool? IsRequired { get; set; }
}

public class AccessibilityMetadata
{
    public string? Label { get; set; }
    public string? Hint { get; set; }
    public string? Role { get; set; }
    public string? AlternativeText { get; set; }
}

public class AnalyticsMetadata
{
    public string? EventName { get; set; }
    public Dictionary<string, object>? EventProperties { get; set; }
}
