using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Ingestion.Services;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("ingestion")]
public class IngestionController : ControllerBase
{
    private readonly IIngestionService _ingestionService;
    private readonly IReloadableSnapRepository _reloadable;
    private readonly ITrendingService _trending;
    private readonly ILogger<IngestionController> _logger;

    public IngestionController(
        IIngestionService ingestionService,
        IReloadableSnapRepository reloadable,
        ITrendingService trending,
        ILogger<IngestionController> logger)
    {
        _ingestionService = ingestionService;
        _reloadable = reloadable;
        _trending = trending;
        _logger = logger;
    }

    [HttpPost("run")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Run()
    {
        _logger.LogInformation("Triggering manual ingestion run");
        
        var snaps = await _ingestionService.RunIngestionAsync();

        // New snaps landed — invalidate trending so next request recomputes.
        _trending.Invalidate();
        
        return Ok(new 
        { 
            count = snaps.Count(), 
            provider = "All Active Providers", 
            timestamp = DateTime.UtcNow,
            snaps = snaps 
        });
    }

    /// <summary>
    /// Hot-reloads all snap data files from disk without restarting
    /// the server. Drop updated *.json files into Data/snaps/ then
    /// call this endpoint — no code redeploy required.
    /// </summary>
    [HttpPost("/admin/reload")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Reload()
    {
        _logger.LogInformation("Admin hot-reload requested.");
        await _reloadable.ReloadAsync();
        // Snap data changed — invalidate trending cache.
        _trending.Invalidate();
        return Ok(new { status = "reloaded", timestamp = DateTime.UtcNow });
    }
}

