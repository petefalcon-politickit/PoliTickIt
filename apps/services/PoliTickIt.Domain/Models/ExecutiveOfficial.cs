// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ExecutiveOfficial.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Models
// PURPOSE     : Represents a US Executive Branch official (President, VP,
//               Cabinet secretary).  Seeded from executive-officials.json at
//               startup via ExecutiveOfficialStore.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Models;

/// <summary>
/// Immutable record for a US Executive Branch official.
/// </summary>
public sealed record ExecutiveOfficial(
    string Id,
    string Name,
    string Title,
    string Party,
    string State,
    string ImageUrl,
    string? Biography,
    string BranchType = "executive");
