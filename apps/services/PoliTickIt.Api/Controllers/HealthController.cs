// ─────────────────────────────────────────────────────────────────────────────
// FILE        : HealthController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Lightweight liveness probe for Azure App Service, mobile clients,
//               and load-balancer health checks.
//
// ENDPOINTS:
//   GET /api/health/check   — Returns 200 + timestamp (no auth required)
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.AspNetCore.Mvc;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    /// <summary>
    /// Liveness probe. Returns 200 when the API process is running.
    /// </summary>
    [HttpGet("check")]
    [ProducesResponseType(typeof(HealthCheckResponse), StatusCodes.Status200OK)]
    public IActionResult Check() =>
        Ok(new HealthCheckResponse(
            Status: "healthy",
            Timestamp: DateTimeOffset.UtcNow));
}

internal sealed record HealthCheckResponse(string Status, DateTimeOffset Timestamp);
