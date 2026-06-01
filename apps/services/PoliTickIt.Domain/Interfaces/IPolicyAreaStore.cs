// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IPolicyAreaStore.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : In-memory store for the fixed Congress.gov policy area taxonomy.
//               Seeded at startup; read-only at runtime.
// ─────────────────────────────────────────────────────────────────────────────

using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IPolicyAreaStore
{
    /// <summary>Returns all policy areas, ordered alphabetically by name.</summary>
    IReadOnlyList<PolicyArea> GetAll();

    /// <summary>Looks up a single policy area by its slug ID.</summary>
    PolicyArea? GetById(string id);
}
