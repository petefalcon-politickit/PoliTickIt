// ─────────────────────────────────────────────────────────────────────────────
// FILE        : DistrictController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Provides zip-to-district lookup for onboarding validation.
//
// ENDPOINTS:
//   GET /api/district/lookup?zip={zip}   — Validate zip and return district data
// ─────────────────────────────────────────────────────────────────────────────

using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/district")]
public sealed class DistrictController : ControllerBase
{
    private readonly IDistrictLookupService _districtLookup;

    public DistrictController(IDistrictLookupService districtLookup)
    {
        _districtLookup = districtLookup;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/district/lookup?zip={zip}
    // Returns district info for a valid US zip, or { valid: false } if not found.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("lookup")]
    public async Task<IActionResult> Lookup([FromQuery][Required][StringLength(5, MinimumLength = 5)] string zip)
    {
        if (!zip.All(char.IsDigit))
            return BadRequest(new { valid = false, error = "Zip code must be 5 digits." });

        var result = await _districtLookup.LookupByZipAsync(zip);

        if (result is null)
            return Ok(new { valid = false, error = "No congressional district found for this zip code." });

        return Ok(new
        {
            valid = true,
            state = result.State,
            district = result.District,
            memberCount = result.MemberCount,
        });
    }
}
