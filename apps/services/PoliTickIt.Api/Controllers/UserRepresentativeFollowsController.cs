// ─────────────────────────────────────────────────────────────────────────────
// FILE        : UserRepresentativeFollowsController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Manages the authenticated user's followed representatives list.
//               All endpoints require a valid JWT (email claim used as partition key).
//
// ENDPOINTS:
//   GET    /api/user/representatives/following
//          — Returns the user's followed BioguideIds.
//   POST   /api/user/representatives/follow
//          — Adds a representative to the user's follow list.
//   DELETE /api/user/representatives/follow/{bioguideId}
//          — Removes a representative from the user's follow list.
// ─────────────────────────────────────────────────────────────────────────────

using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/user/representatives")]
[Authorize]
public sealed class UserRepresentativeFollowsController : ControllerBase
{
    private readonly IUserFollowsRepository _follows;
    private readonly ILogger<UserRepresentativeFollowsController> _logger;

    public UserRepresentativeFollowsController(
        IUserFollowsRepository follows,
        ILogger<UserRepresentativeFollowsController> logger)
    {
        _follows = follows;
        _logger = logger;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/user/representatives/following
    // Returns the list of BioguideIds the current user follows.
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
    // POST /api/user/representatives/follow
    // Body: { "bioguideId": "M001184" }
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("follow")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Follow([FromBody] FollowRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.BioguideId))
            return BadRequest(new { error = "bioguideId is required." });

        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        await _follows.FollowAsync(email, req.BioguideId.Trim().ToUpperInvariant(), ct);
        _logger.LogInformation("User {Email} followed rep {BioguideId}", email, req.BioguideId);
        return Ok(new { followed = true, bioguideId = req.BioguideId });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DELETE /api/user/representatives/follow/{bioguideId}
    // ──────────────────────────────────────────────────────────────────────────
    [HttpDelete("follow/{bioguideId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Unfollow(string bioguideId, CancellationToken ct)
    {
        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        await _follows.UnfollowAsync(email, bioguideId.Trim().ToUpperInvariant(), ct);
        _logger.LogInformation("User {Email} unfollowed rep {BioguideId}", email, bioguideId);
        return Ok(new { followed = false, bioguideId });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private string? GetUserEmail() =>
        User.FindFirstValue(JwtRegisteredClaimNames.Email)
        ?? User.FindFirstValue(ClaimTypes.Email);
}

// ── Request DTOs ──────────────────────────────────────────────────────────────
public sealed record FollowRequest([Required] string BioguideId);
