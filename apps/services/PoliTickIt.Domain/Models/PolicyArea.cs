// ─────────────────────────────────────────────────────────────────────────────
// FILE        : PolicyArea.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Models
// PURPOSE     : Represents a Congress.gov legislative subject-matter category
//               used for snap metadata tagging and user interest tracking.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Models;

/// <summary>
/// A Congress.gov policy area / legislative subject-matter category.
/// Used as snap metadata tags and as the basis for user interest selection.
/// </summary>
public sealed record PolicyArea(
    /// <summary>Stable slug, e.g. "agriculture-and-food".</summary>
    string Id,
    /// <summary>Display name, e.g. "Agriculture and Food".</summary>
    string Name,
    /// <summary>Short description of the policy area.</summary>
    string Description,
    /// <summary>Optional icon image URL.</summary>
    string? ImageUrl = null);
