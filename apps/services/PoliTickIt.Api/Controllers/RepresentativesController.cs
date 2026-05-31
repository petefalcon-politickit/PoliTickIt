// ─────────────────────────────────────────────────────────────────────────────
// FILE        : RepresentativesController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Exposes sitting Congress members filtered by state + district.
//
// ENDPOINTS:
//   GET  /api/representatives?state={state2}&district={district}
//        — Returns House member(s) for the district + both Senators for the state.
//   POST /admin/hydrate-reps
//        — Force-refresh the Congress member cache from api.congress.gov.
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Api.Controllers;

[ApiController]
public sealed class RepresentativesController : ControllerBase
{
    private readonly IRepresentativeStore _store;
    private readonly ILogger<RepresentativesController> _logger;

    public RepresentativesController(
        IRepresentativeStore store,
        ILogger<RepresentativesController> logger)
    {
        _store = store;
        _logger = logger;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/representatives?state=CO&district=4
    // Returns House reps for the district + both Senators for the state.
    // State must be the 2-letter code; district is the district number string.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("/api/representatives")]
    [ProducesResponseType(typeof(IReadOnlyList<RepresentativeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetByDistrict(
        [FromQuery] string? state,
        [FromQuery] string? district)
    {
        if (string.IsNullOrWhiteSpace(state) || state.Length != 2)
            return BadRequest(new { error = "state must be a 2-letter US state code (e.g. CO)." });

        if (string.IsNullOrWhiteSpace(district))
            return BadRequest(new { error = "district is required (e.g. 4)." });

        if (!_store.IsHydrated)
        {
            _logger.LogWarning("Representatives requested before hydration complete");
            // Return empty rather than a 503 — mobile app handles empty list gracefully
            return Ok(Array.Empty<RepresentativeResponse>());
        }

        var members = _store.GetForDistrict(state.ToUpperInvariant(), district);
        var response = members
            .Select(m => new RepresentativeResponse(
                m.BioguideId, m.Name, m.Party, m.State,
                m.District, m.Chamber, m.ImageUrl, m.CongressGovUrl))
            .ToList();

        return Ok(response);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /admin/hydrate-reps
    // Force-refresh the in-memory Congress member cache.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("/admin/hydrate-reps")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForceHydrate(CancellationToken ct)
    {
        _logger.LogInformation("Manual Congress member hydration requested");
        await _store.HydrateAsync(ct);
        return Ok(new { status = "hydrated", memberCount = _store.GetAll().Count, timestamp = DateTime.UtcNow });
    }
}

// ── Response DTO ──────────────────────────────────────────────────────────────
public sealed record RepresentativeResponse(
    string BioguideId,
    string Name,
    string Party,
    string State,
    string? District,
    string Chamber,
    string? ImageUrl,
    string? CongressGovUrl);
