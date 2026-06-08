// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IExecutiveOfficialStore.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Read-only access to the Executive Branch official registry.
//               Loaded once at startup from the bundled seed file.
// ─────────────────────────────────────────────────────────────────────────────

using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IExecutiveOfficialStore
{
    /// <summary>Returns all seeded executive officials (President, VP, Cabinet).</summary>
    IReadOnlyList<ExecutiveOfficial> GetAll();

    /// <summary>Returns a single official by their stable ID (e.g. "POTUS-47"), or null.</summary>
    ExecutiveOfficial? GetById(string id);
}
