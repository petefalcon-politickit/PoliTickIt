// ─────────────────────────────────────────────────────────────────────────────
// FILE        : WatchlistController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Manages the authenticated user's cloud-synced watchlist of
//               snap IDs. All endpoints require a valid JWT.
//
// ENDPOINTS:
//   GET    /api/watchlist
//          — Returns all snap IDs on the user's watchlist.
//   POST   /api/watchlist/{snapId}
//          — Adds a snap to the watchlist. Idempotent.
//   DELETE /api/watchlist/{snapId}
//          — Removes a snap from the watchlist.
// ─────────────────────────────────────────────────────────────────────────────

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/watchlist")]
[Authorize]
public sealed class WatchlistController : ControllerBase
{
    private readonly IUserWatchlistRepository _watchlist;
    private readonly ILogger<WatchlistController> _logger;

    public WatchlistController(
        IUserWatchlistRepository watchlist,
        ILogger<WatchlistController> logger)
    {
        _watchlist = watchlist;
        _logger    = logger;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/watchlist
    // Returns all snap IDs in the current user's watchlist.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet]
    [ProducesResponseType(typeof(WatchlistResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetWatchlist(CancellationToken ct)
    {
        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        var snapIds = await _watchlist.GetWatchedIdsAsync(email, ct);
        return Ok(new WatchlistResponse(snapIds, snapIds.Count));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/watchlist/{snapId}
    // Adds a snap to the watchlist. Idempotent — returns 200 if already present.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("{snapId}")]
    [ProducesResponseType(typeof(WatchlistAddResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddToWatchlist(string snapId, CancellationToken ct)
    {
        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        await _watchlist.AddAsync(email, snapId, ct);
        _logger.LogInformation("User {Email} added snap {SnapId} to watchlist", email, snapId);

        return Ok(new WatchlistAddResponse(snapId, DateTime.UtcNow));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DELETE /api/watchlist/{snapId}
    // Removes a snap from the watchlist. Returns 204 even if not present.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpDelete("{snapId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RemoveFromWatchlist(string snapId, CancellationToken ct)
    {
        var email = GetUserEmail();
        if (email is null) return Unauthorized();

        await _watchlist.RemoveAsync(email, snapId, ct);
        _logger.LogInformation("User {Email} removed snap {SnapId} from watchlist", email, snapId);

        return NoContent();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private string? GetUserEmail() =>
        User.FindFirstValue(JwtRegisteredClaimNames.Email)
        ?? User.FindFirstValue(ClaimTypes.Email);
}

/// <summary>Response body for GET /api/watchlist.</summary>
public sealed record WatchlistResponse(IReadOnlyList<string> SnapIds, int Count);

/// <summary>Response body for POST /api/watchlist/{snapId}.</summary>
public sealed record WatchlistAddResponse(string SnapId, DateTime AddedAt);
