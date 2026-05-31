// ─────────────────────────────────────────────────────────────────────────────
// FILE        : RepresentativesHydrationService.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → BackgroundServices
// PURPOSE     : Hydrates the Congress member store on application startup and
//               makes a single initial fetch so the cache is warm by the time
//               any client makes a request.
// ─────────────────────────────────────────────────────────────────────────────

using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Api.BackgroundServices;

public sealed class RepresentativesHydrationService : BackgroundService
{
    private readonly IRepresentativeStore _store;
    private readonly ILogger<RepresentativesHydrationService> _logger;

    public RepresentativesHydrationService(
        IRepresentativeStore store,
        ILogger<RepresentativesHydrationService> logger)
    {
        _store = store;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _logger.LogInformation("Hydrating Congress member store on startup…");
            await _store.HydrateAsync(stoppingToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // Non-fatal — the API still starts; requests will return an empty
            // list until a manual /admin/hydrate-reps refresh is triggered.
            _logger.LogError(ex, "Startup Congress hydration failed");
        }
    }
}
