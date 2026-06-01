// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IPolicyAreaNormalizer.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Normalizes the free-text PolicyArea string on snap metadata
//               to a canonical slug from the Congress.gov taxonomy.
//               Ensures snap metadata is machine-queryable and consistent
//               for feed filtering and interest matching.
// ─────────────────────────────────────────────────────────────────────────────

using System.Collections.Generic;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IPolicyAreaNormalizer
{
    /// <summary>
    /// Resolves a free-text policy area label (e.g. "Economics and Public Finance",
    /// "Legislative Activity") to the canonical <see cref="PolicyArea"/>.
    /// Returns <c>null</c> if no match found in the taxonomy.
    /// </summary>
    PolicyArea? Resolve(string? rawLabel);

    /// <summary>
    /// Normalizes a single snap in-place:
    /// <list type="bullet">
    ///   <item>Sets <c>snap.Metadata.PolicyAreaId</c> to the canonical slug.</item>
    ///   <item>Corrects <c>snap.Metadata.PolicyArea</c> to the canonical display name.</item>
    ///   <item>Adds a <c>PolicyArea:{slug}</c> channel tag for feed routing.</item>
    /// </list>
    /// No-ops if the policy area cannot be resolved.
    /// </summary>
    void NormalizeSnap(PoliSnap snap);

    /// <summary>Normalizes a batch of snaps in-place.</summary>
    void NormalizeSnaps(IEnumerable<PoliSnap> snaps);
}
