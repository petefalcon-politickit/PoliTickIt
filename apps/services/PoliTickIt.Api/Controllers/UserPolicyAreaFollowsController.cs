// ─────────────────────────────────────────────────────────────────────────────
// FILE        : UserPolicyAreaFollowsController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Manages the authenticated user's followed policy-area (interest)
//               list. All endpoints require a valid JWT.
//
// ENDPOINTS:
//   GET    /api/user/interests/following
//          — Returns the user's followed policy-area slugs.
//   POST   /api/user/interests/follow
//          — Adds a policy area to the user's follow list.
//          Body: { "policyAreaId": "economics-and-public-finance" }
//   DELETE /api/user/interests/follow/{policyAreaId}
//          — Removes a policy area from the user's follow list.
// ─────────────────────────────────────────────────────────────────────────────

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/user/interests")]
[Authorize]
public sealed class UserPolicyAreaFollowsController : ControllerBase
{
    private readonly IUserInterestFollowsRepository _follows;
    private readonly IPolicyAreaStore _store;
    private readonly ILogger<UserPolicyAreaFollowsController> _logger;

    public UserPolicyAreaFollowsController(
        IUserInterestFollowsRepository follows,
        IPolicyAreaStore store,
        ILogger<UserPolicyAreaFollowsController> logger)
    {
        _follows = follows;
        _store   = store;
        _logger  = logger;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/user/interests/following
    // Returns the list of policy-area slugs the current user follows.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("following")]
    [ProducesResponseType(typeof(IReadOnlyList<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetFollowing(CancellationToken ct)
    {
        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        var ids = await _follows.GetFollowedIdsAsync(email, ct);
        return Ok(ids);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/user/interests/follow
    // Body: { "policyAreaId": "economics-and-public-finance" }
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("follow")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Follow([FromBody] InterestFollowRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.PolicyAreaId))
            return BadRequest(new { error = "policyAreaId is required." });

        var slug = req.PolicyAreaId.Trim().ToLowerInvariant();

        if (_store.GetById(slug) is null)
            return BadRequest(new { error = $"Unknown policy area: '{slug}'." });

        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        await _follows.FollowAsync(email, slug, ct);
        _logger.LogInformation("User {Email} followed interest {PolicyAreaId}", email, slug);
        return Ok(new { followed = true, policyAreaId = slug });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DELETE /api/user/interests/follow/{policyAreaId}
    // ──────────────────────────────────────────────────────────────────────────
    [HttpDelete("follow/{policyAreaId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Unfollow(string policyAreaId, CancellationToken ct)
    {
        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        var slug = policyAreaId.Trim().ToLowerInvariant();
        await _follows.UnfollowAsync(email, slug, ct);
        _logger.LogInformation("User {Email} unfollowed interest {PolicyAreaId}", email, slug);
        return Ok(new { followed = false, policyAreaId = slug });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private string? GetUserEmail() =>
        User.FindFirstValue(JwtRegisteredClaimNames.Email)
        ?? User.FindFirstValue(ClaimTypes.Email);
}

/// <summary>Request body for POST /api/user/interests/follow.</summary>
public sealed record InterestFollowRequest(string PolicyAreaId);
