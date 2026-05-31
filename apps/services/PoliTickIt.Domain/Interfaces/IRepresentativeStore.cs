// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IRepresentativeStore.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : In-memory store for sitting Congress members, hydrated from
//               Congress.gov on startup and refreshable on demand.
// ─────────────────────────────────────────────────────────────────────────────

using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IRepresentativeStore
{
    /// <summary>True after at least one successful hydration.</summary>
    bool IsHydrated { get; }

    /// <summary>
    /// Returns House members for the given state + district and both Senators
    /// for the given state.  State is the 2-letter code (e.g. "CO"),
    /// district is the district number string (e.g. "4").
    /// </summary>
    IReadOnlyList<CongressMember> GetForDistrict(string state, string district);

    /// <summary>
    /// Returns all stored members (for admin / debug use).
    /// </summary>
    IReadOnlyList<CongressMember> GetAll();

    /// <summary>
    /// Fetches all current members from Congress.gov and refreshes the cache.
    /// </summary>
    Task HydrateAsync(CancellationToken ct = default);
}
