// ─────────────────────────────────────────────────────────────────────────────
// FILE        : CongressMember.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Models
// PURPOSE     : Represents a sitting US Congress member (House or Senate).
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Models;

/// <summary>
/// A sitting member of the US Congress, normalised from Congress.gov data.
/// </summary>
public sealed record CongressMember(
    string BioguideId,
    string Name,
    string Party,
    /// <summary>2-letter state code, e.g. "CO".</summary>
    string State,
    /// <summary>House district number as a string (e.g. "4"), or null for Senators.</summary>
    string? District,
    /// <summary>"House" or "Senate".</summary>
    string Chamber,
    string? ImageUrl,
    string? CongressGovUrl);
