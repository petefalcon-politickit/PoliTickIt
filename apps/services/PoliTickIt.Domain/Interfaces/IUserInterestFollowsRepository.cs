// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IUserInterestFollowsRepository.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Manages a user's followed policy-area (interest) slug list.
//               Mirrors IUserFollowsRepository but for policy-area slugs.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Interfaces;

public interface IUserInterestFollowsRepository
{
    /// <summary>Returns all policy-area slugs the user currently follows.</summary>
    Task<IReadOnlyList<string>> GetFollowedIdsAsync(string userEmail, CancellationToken ct = default);

    /// <summary>Adds a policy-area slug to the user's follow list (idempotent).</summary>
    Task FollowAsync(string userEmail, string policyAreaId, CancellationToken ct = default);

    /// <summary>Removes a policy-area slug from the user's follow list.</summary>
    Task UnfollowAsync(string userEmail, string policyAreaId, CancellationToken ct = default);
}
