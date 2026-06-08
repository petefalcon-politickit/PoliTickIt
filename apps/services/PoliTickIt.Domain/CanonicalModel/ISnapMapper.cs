// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ISnapMapper.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → CanonicalModel
// PURPOSE     : Contract for mapping a single source API item to a PoliSnap.
//               Each provider owns exactly one ISnapMapper implementation.
//               The mapper is the only place in the system that knows the
//               shape of the source API response — all element attribute
//               construction is delegated to IElementBinding implementations.
//
// DECISION    : D8 — ISnapMapper<TSource> is the only place that knows source API shape
// ─────────────────────────────────────────────────────────────────────────────

using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.CanonicalModel;

/// <summary>
/// Maps a raw source API item of type <typeparamref name="TSource"/> to a
/// fully-populated <see cref="PoliSnap"/>.
/// </summary>
/// <typeparam name="TSource">The source API DTO type (e.g. <c>FrDocument</c>).</typeparam>
public interface ISnapMapper<TSource>
{
    /// <summary>Maps a single source item to a <see cref="PoliSnap"/>.</summary>
    PoliSnap Map(TSource source);

    /// <summary>
    /// Canonical provider identifier matching the registration name used in
    /// Functions CRON triggers and <c>POST /ingestion/run/{providerName}</c>.
    /// </summary>
    string ProviderName { get; }

    /// <summary>
    /// Snap type string key registered in <c>SnapSchemaRegistry</c>
    /// (e.g. <c>"ExecutiveOrder"</c>).
    /// </summary>
    string SnapType { get; }
}
