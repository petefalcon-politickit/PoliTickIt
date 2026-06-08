// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ElementAttributes.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → CanonicalModel
// PURPOSE     : Domain Canonical Model (DCM) — typed attribute records and
//               enums for every PoliSnap element type.  This file is the
//               single authoritative type system for element attributes on
//               both server (C#) and mobile (TypeScript mirror: canonical-model.ts).
//               All providers, bindings, and renderers MUST reference these
//               types — never define element attribute shapes inline.
//
// MIRROR      : apps/mobile/types/canonical-model.ts
// DECISION    : D1 — DCM is single authoritative type system for all element attributes
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.ComponentModel.DataAnnotations;

namespace PoliTickIt.Domain.CanonicalModel;

// ── Enums ────────────────────────────────────────────────────────────────────

/// <summary>Display mode for a gauge element.</summary>
public enum GaugeMode
{
    Linear,
    Progress,
    Circular
}

/// <summary>
/// Trust verification tier indicating the quality level of the source.
/// Tier1 = primary official source; Tier3 = inferred/derived.
/// </summary>
public enum VerificationTier
{
    Tier1,
    Tier2,
    Tier3
}

/// <summary>Canonical source identifier used in trust thread elements.</summary>
public enum TrustSource
{
    FederalRegister,
    CongressGov,
    Fec,
    OpenStates,
    Derived
}

// ── Element Attribute Records ─────────────────────────────────────────────────

/// <summary>
/// Text block element — primary content card (title, subtitle, body).
/// Maps to element type "Universal.TextBlock".
/// </summary>
public record TextBlockAttributes
{
    [Required] public string Title { get; init; } = string.Empty;
    public string? Subtitle { get; init; }
    public string? Subtext { get; init; }
    /// <summary>Plain-text body, truncated to ~3 000 chars at ingest time.</summary>
    public string? BodyText { get; init; }
    /// <summary>Deep-link to the authoritative HTML rendering of the full document.</summary>
    public string? BodyHtmlUrl { get; init; }
}

/// <summary>
/// Gauge element — progress or intensity indicator.
/// Maps to element type "Universal.Gauge".
/// </summary>
public record GaugeAttributes
{
    /// <summary>0–100 inclusive.</summary>
    [Required] public int Value { get; init; }
    [Required] public string Label { get; init; } = string.Empty;
    [Required] public GaugeMode Mode { get; init; }
    public string? Subtext { get; init; }
    /// <summary>Optional CSS-compatible colour override (e.g. "#FF5733").</summary>
    public string? Color { get; init; }
}

/// <summary>
/// Trust thread element — institutional provenance / verification signal.
/// Maps to element type "Trust.Thread".
/// </summary>
public record TrustThreadAttributes
{
    [Required] public VerificationTier VerificationLevel { get; init; }
    [Required] public TrustSource Source { get; init; }
    public string? SourceUrl { get; init; }
    public DateTimeOffset? LastVerified { get; init; }
}

/// <summary>
/// Representative identity element — links a snap to a specific legislator/official.
/// Maps to element type "Identity.Representative".
/// </summary>
public record RepresentativeIdentityAttributes
{
    /// <summary>Stable representative identifier, e.g. "S-TX-001" or bioguideId.</summary>
    [Required] public string RepresentativeId { get; init; } = string.Empty;
    [Required] public string DisplayName { get; init; } = string.Empty;
    public string? Role { get; init; }
    public string? AvatarUrl { get; init; }
    /// <summary>Party abbreviation: "D", "R", "I", etc.</summary>
    public string? Party { get; init; }
}

/// <summary>
/// Context thread element — AI-generated contextual enrichment summary.
/// Maps to element type "Context.Thread".
/// </summary>
public record ContextThreadAttributes
{
    [Required] public string Summary { get; init; } = string.Empty;
    [Required] public DateTimeOffset EnrichedAt { get; init; }
    /// <summary>Model identifier used to generate the summary, e.g. "gpt-4o".</summary>
    public string? Model { get; init; }
}
