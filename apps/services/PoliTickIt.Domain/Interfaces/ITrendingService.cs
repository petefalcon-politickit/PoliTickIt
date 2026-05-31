// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ITrendingService.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Computes a ranked list of trending snaps based on channel
//               activity within a rolling time window.  Decoupled from
//               ISnapRepository so the algorithm can evolve independently.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Interfaces;

public interface ITrendingService
{
    /// <summary>
    /// Returns up to <paramref name="topN"/> trending snap IDs, ranked
    /// by score descending.  Results are cached until <see cref="Invalidate"/>
    /// is called (e.g. after a new ingestion batch lands).
    /// </summary>
    IReadOnlyList<TrendingEntry> GetTrending(int topN = 20);

    /// <summary>
    /// Drops the cached result so the next call to <see cref="GetTrending"/>
    /// recomputes from the current snap store.  Call this after ingestion.
    /// </summary>
    void Invalidate();
}

/// <summary>
/// A single entry in the trending list.
/// </summary>
/// <param name="SnapId">The snap's unique identifier.</param>
/// <param name="Score">Normalised activity score (higher = hotter).</param>
/// <param name="PrimaryChannel">
/// The channel that drove this snap into trending, e.g.
/// "FloorDebate:HR1041" or "Representative:D000622".
/// </param>
public sealed record TrendingEntry(string SnapId, double Score, string PrimaryChannel);
