using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.CanonicalModel;
using PoliTickIt.Domain.Exceptions;
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
    private readonly ISnapSchemaRegistry _schemaRegistry;
    private readonly ILogger<IngestionController> _logger;

    public IngestionController(
        IIngestionService ingestionService,
        IReloadableSnapRepository reloadable,
        ITrendingService trending,
        ISnapSchemaRegistry schemaRegistry,
        ILogger<IngestionController> logger)
    {
        _ingestionService = ingestionService;
        _reloadable = reloadable;
        _trending = trending;
        _schemaRegistry = schemaRegistry;
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
    /// Runs a single named provider. Returns 404 if the provider name is unknown.
    /// </summary>
    [HttpPost("run/{providerName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RunProvider(string providerName)
    {
        _logger.LogInformation("Triggering ingestion for provider: {Provider}", providerName);
        try
        {
            var snaps = await _ingestionService.RunProviderAsync(providerName);
            _trending.Invalidate();
            return Ok(new
            {
                count = snaps.Count(),
                provider = providerName,
                timestamp = DateTime.UtcNow,
                snaps = snaps
            });
        }
        catch (ProviderNotFoundException ex)
        {
            _logger.LogWarning("Provider not found: {Provider}", ex.ProviderName);
            return NotFound(new { error = $"Provider '{ex.ProviderName}' is not registered." });
        }
    }

    /// <summary>
    /// Returns the readiness status of all registered snap schemas.
    /// Binding Decision D4 — surfaced at GET /ingestion/status.
    /// </summary>
    [HttpGet("status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Status()
    {
        var schemas = _schemaRegistry.RegisteredTypes.Select(t =>
        {
            var schema = _schemaRegistry.GetSchema(t);
            return new
            {
                type = t,
                requiredElements = schema.RequiredElements.Select(e => new
                {
                    elementType = e.ElementType,
                    isRequired = e.IsRequired,
                    description = e.Description
                }),
                requiredChannelPrefixes = schema.RequiredChannelPrefixes,
                defaultTtlHours = schema.DefaultTtl.TotalHours
            };
        });

        return Ok(new
        {
            timestamp = DateTime.UtcNow,
            registeredSnapTypes = _schemaRegistry.RegisteredTypes.Count,
            schemas = schemas
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

