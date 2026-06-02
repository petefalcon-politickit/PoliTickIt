// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IUserWatchlistRepository.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Contract for managing a user's cloud-synced watchlist of snap
//               IDs. Implementations persist to Cosmos DB, co-located with the
//               user's account document.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Interfaces;

public interface IUserWatchlistRepository
{
    /// <summary>Returns all snap IDs on the user's watchlist.</summary>
    Task<IReadOnlyList<string>> GetWatchedIdsAsync(
        string userEmail, CancellationToken ct = default);

    /// <summary>Adds a snap to the watchlist. Idempotent.</summary>
    Task AddAsync(string userEmail, string snapId, CancellationToken ct = default);

    /// <summary>Removes a snap from the watchlist. No-op if not present.</summary>
    Task RemoveAsync(string userEmail, string snapId, CancellationToken ct = default);
}
