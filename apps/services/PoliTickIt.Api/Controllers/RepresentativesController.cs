// ─────────────────────────────────────────────────────────────────────────────
// FILE        : RepresentativesController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Exposes sitting Congress members from CongressMemberStore.
//
// ENDPOINTS:
//   GET  /api/representatives?state={state2}&district={district}
//        — Returns House member(s) for the district + both Senators for the state.
//   GET  /api/representatives/registry
//        — Returns all 535 current Congress members (RSP mobile sync).
//   GET  /api/representatives/{bioguideId}
//        — Returns a single member by BioguideId.
//   GET  /api/my-representatives   [Authorize]
//        — Returns the authenticated user's House member + 2 Senators,
//          derived from the `state` and `district` JWT claims.
//   POST /admin/hydrate-reps
//        — Force-refresh the Congress member cache from api.congress.gov.
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Api.Controllers;

[ApiController]
public sealed class RepresentativesController : ControllerBase
{
    private readonly IRepresentativeStore _store;
    private readonly IExecutiveOfficialStore _executiveStore;
    private readonly ILogger<RepresentativesController> _logger;

    public RepresentativesController(
        IRepresentativeStore store,
        IExecutiveOfficialStore executiveStore,
        ILogger<RepresentativesController> logger)
    {
        _store = store;
        _executiveStore = executiveStore;
        _logger = logger;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/representatives?state=CO&district=4
    // Returns House reps for the district + both Senators for the state.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("/api/representatives")]
    [ProducesResponseType(typeof(IReadOnlyList<RepresentativeMobileDto>), StatusCodes.Status200OK)]
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
            return Ok(Array.Empty<RepresentativeMobileDto>());
        }

        var members = _store.GetForDistrict(state.ToUpperInvariant(), district);
        return Ok(members.Select(RepresentativeMobileDto.FromMember));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/representatives/registry
    // Full registry of all 535 Congress members — used by mobile RSP sync.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("/api/representatives/registry")]
    [ProducesResponseType(typeof(IReadOnlyList<RepresentativeMobileDto>), StatusCodes.Status200OK)]
    public IActionResult GetRegistry()
    {
        if (!_store.IsHydrated)
        {
            _logger.LogWarning("Representatives registry requested before hydration complete");
            return Ok(Array.Empty<RepresentativeMobileDto>());
        }

        return Ok(_store.GetAll().Select(RepresentativeMobileDto.FromMember));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/representatives/{bioguideId}
    // Single member lookup by BioguideId (e.g. "M001184").
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("/api/representatives/{bioguideId}")]
    [ProducesResponseType(typeof(RepresentativeMobileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(string bioguideId)
    {
        // Check executive store first (IDs like "POTUS-47", "SEC-STATE" never exist in Congress store)
        var executive = _executiveStore.GetById(bioguideId);
        if (executive is not null)
            return Ok(RepresentativeMobileDto.FromExecutive(executive));

        if (!_store.IsHydrated)
            return Ok(null);

        var member = _store.GetAll()
            .FirstOrDefault(m => string.Equals(m.BioguideId, bioguideId, StringComparison.OrdinalIgnoreCase));

        if (member is null) return NotFound();
        return Ok(RepresentativeMobileDto.FromMember(member));
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

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/my-representatives   [Authorize]
    // Returns the authenticated user's House member + 2 Senators.
    // State and district are read from the JWT claims (set at login time from
    // the user's onboarding zip lookup — no extra DB call required).
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("/api/my-representatives")]
    [Authorize]
    [ProducesResponseType(typeof(IReadOnlyList<RepresentativeMobileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetMyRepresentatives()
    {
        var state    = User.FindFirst("state")?.Value;
        var district = User.FindFirst("district")?.Value;

        if (string.IsNullOrWhiteSpace(state) || string.IsNullOrWhiteSpace(district))
            return BadRequest(new { error = "User profile is missing state or district. Please update your district in Settings." });

        if (!_store.IsHydrated)
        {
            _logger.LogWarning("My-representatives requested before hydration complete");
            return Ok(Array.Empty<RepresentativeMobileDto>());
        }

        var members = _store.GetForDistrict(state.ToUpperInvariant(), district);
        return Ok(members.Select(RepresentativeMobileDto.FromMember));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/representatives/executive
    // Returns all Executive Branch officials (President, VP, Cabinet).
    // Public endpoint — no auth required.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("/api/representatives/executive")]
    [ProducesResponseType(typeof(IReadOnlyList<RepresentativeMobileDto>), StatusCodes.Status200OK)]
    public IActionResult GetExecutive()
    {
        var officials = _executiveStore.GetAll();
        return Ok(officials.Select(RepresentativeMobileDto.FromExecutive));
    }
}

// ── Response DTO (mobile-facing shape) ───────────────────────────────────────
/// <summary>
/// Mobile-facing representative payload. Uses BioguideId as the canonical ID,
/// derives imageUrl from the unitedstates.github.io CDN.
/// </summary>
public sealed record RepresentativeMobileDto(
    string Id,
    string Name,
    string Party,
    string State,
    string? District,
    string Chamber,
    string ImageUrl,
    string? CongressGovUrl,
    string BranchType = "legislative")
{
    private const string ImageCdnBase =
        "https://unitedstates.github.io/images/congress/225x275";

    public static RepresentativeMobileDto FromMember(CongressMember m) =>
        new(
            Id:            m.BioguideId,
            Name:          m.Name,
            Party:         m.Party,
            State:         m.State,
            District:      m.District,
            Chamber:       m.Chamber,
            ImageUrl:      !string.IsNullOrWhiteSpace(m.ImageUrl)
                               ? m.ImageUrl
                               : $"{ImageCdnBase}/{m.BioguideId}.jpg",
            CongressGovUrl: m.CongressGovUrl,
            BranchType:    "legislative");

    public static RepresentativeMobileDto FromExecutive(ExecutiveOfficial o) =>
        new(
            Id:            o.Id,
            Name:          o.Name,
            Party:         o.Party,
            State:         o.State,
            District:      null,
            Chamber:       o.Title,
            ImageUrl:      o.ImageUrl,
            CongressGovUrl: null,
            BranchType:    "executive");
}

// Keep old DTO name as alias so existing Swagger-generated clients don't break
[Obsolete("Use RepresentativeMobileDto")]
public sealed record RepresentativeResponse(
    string BioguideId, string Name, string Party, string State,
    string? District, string Chamber, string? ImageUrl, string? CongressGovUrl);
