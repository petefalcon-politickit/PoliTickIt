using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("snaps")]
public class SnapsController : ControllerBase
{
    private readonly ISnapRepository _snapRepository;
    private readonly ILogger<SnapsController> _logger;

    public SnapsController(ISnapRepository snapRepository, ILogger<SnapsController> logger)
    {
        _snapRepository = snapRepository;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PoliSnap>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PoliSnap>>> GetAll()
    {
        _logger.LogInformation("Fetching all snaps from repository");
        var snaps = await _snapRepository.GetAllSnapsAsync();
        return Ok(snaps);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PoliSnap), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PoliSnap>> GetById(string id)
    {
        _logger.LogInformation("Fetching snap with ID: {Id}", id);
        var snap = await _snapRepository.GetSnapByIdAsync(id);
        
        if (snap == null)
        {
            return NotFound();
        }

        return Ok(snap);
    }
}
