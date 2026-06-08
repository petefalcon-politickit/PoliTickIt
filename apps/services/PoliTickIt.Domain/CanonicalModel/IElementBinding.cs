// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IElementBinding.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → CanonicalModel
// PURPOSE     : Compile-safe, typed binding contract between a source API DTO
//               and a DCM attribute record.  One binding implementation per
//               element type per provider — no raw Dictionary literals.
//
// DECISION    : D2 — IElementBinding<TSource, TAttributes> typed compile-safe binding
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.CanonicalModel;

/// <summary>
/// Maps a raw source API item (<typeparamref name="TSource"/>) to a typed
/// DCM attribute record (<typeparamref name="TAttributes"/>).
/// <para>
/// Rules:
/// <list type="bullet">
///   <item>Implementations must never return null from <see cref="Bind"/>.</item>
///   <item>If a source field is absent or null, supply a sensible default.</item>
///   <item>Implementations live as private inner classes of the owning mapper.</item>
/// </list>
/// </para>
/// </summary>
/// <typeparam name="TSource">The source API DTO type.</typeparam>
/// <typeparam name="TAttributes">The DCM attribute record type (from <c>ElementAttributes.cs</c>).</typeparam>
public interface IElementBinding<TSource, TAttributes>
{
    /// <summary>Produces a fully-populated attribute record from the source item.</summary>
    TAttributes Bind(TSource source);
}
