// ─────────────────────────────────────────────────────────────────────────────
// FILE        : PolicyAreasController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Exposes the Congress.gov policy area taxonomy.
//               Used by the mobile app for interest selection and by the
//               snap generator for metadata tagging.
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/policy-areas")]
public sealed class PolicyAreasController : ControllerBase
{
    private readonly IPolicyAreaStore _store;

    public PolicyAreasController(IPolicyAreaStore store)
    {
        _store = store;
    }

    /// <summary>
    /// Returns all 34 Congress.gov legislative policy area categories,
    /// ordered alphabetically. No authentication required — public taxonomy.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PolicyAreaDto>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        var result = _store.GetAll()
            .Select(a => new PolicyAreaDto(a.Id, a.Name, a.Description, a.ImageUrl))
            .ToList();

        return Ok(result);
    }

    /// <summary>Returns a single policy area by its slug ID.</summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PolicyAreaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(string id)
    {
        var area = _store.GetById(id);
        if (area is null) return NotFound();
        return Ok(new PolicyAreaDto(area.Id, area.Name, area.Description, area.ImageUrl));
    }
}

/// <summary>API response shape for a policy area.</summary>
public sealed record PolicyAreaDto(
    string Id,
    string Name,
    string Description,
    string? ImageUrl);
