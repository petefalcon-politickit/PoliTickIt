// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IUserFollowsRepository.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Persistence contract for a user's followed representative list.
//               The followed set is keyed by the user's email (Cosmos partition)
//               and stored as an array of BioguideId strings.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Interfaces;

public interface IUserFollowsRepository
{
    /// <summary>
    /// Returns the BioguideIds of all representatives followed by the user.
    /// Returns an empty list if the user has no follows yet.
    /// </summary>
    Task<IReadOnlyList<string>> GetFollowedIdsAsync(string userEmail, CancellationToken ct = default);

    /// <summary>
    /// Adds a representative to the user's follow list (idempotent).
    /// </summary>
    Task FollowAsync(string userEmail, string bioguideId, CancellationToken ct = default);

    /// <summary>
    /// Removes a representative from the user's follow list (no-op if not present).
    /// </summary>
    Task UnfollowAsync(string userEmail, string bioguideId, CancellationToken ct = default);
}
