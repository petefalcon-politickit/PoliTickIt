// ─────────────────────────────────────────────────────────────────────────────
// FILE        : NewEndpointTests.cs
// PROJECT     : PoliTickIt.Api.Tests
// LAYER       : Tests → Controllers
// PURPOSE     : Unit tests for A4 endpoints:
//                 POST /ingestion/run/{providerName}
//                 GET  /ingestion/status
//                 GET  /api/snaps/delta?since=
// ─────────────────────────────────────────────────────────────────────────────

using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using PoliTickIt.Api.Controllers;
using PoliTickIt.Domain.CanonicalModel;
using PoliTickIt.Domain.Exceptions;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;
using Xunit;

namespace PoliTickIt.Api.Tests.Controllers;

// ── Helpers ───────────────────────────────────────────────────────────────────

file static class Stubs
{
    public static SnapSchema ExecutiveOrderSchema() =>
        new SnapSchema(
            Type: "ExecutiveOrder",
            RequiredElements: new[]
            {
                new SnapElementTemplate("TextBlock", true, "Body"),
                new SnapElementTemplate("TrustThread", true, "Provenance"),
            },
            RequiredChannelPrefixes: new[] { "potus", "federal" },
            DefaultTtl: TimeSpan.FromHours(24));

    public static PoliSnap MakeSnap(string id = "snap-1") =>
        new PoliSnap
        {
            Id = id,
            Sku = $"EXECUTIVEORDER-20260603-{id}",
            Title = "Test Snap",
            Type = "ExecutiveOrder",
            CreatedAt = DateTime.UtcNow.AddHours(-1),
            UpdatedAt = DateTime.UtcNow,
            Sources = new(),
            Elements = new(),
        };
}

// ── POST /ingestion/run/{providerName} ────────────────────────────────────────

public class RunProviderEndpointTests
{
    private readonly Mock<IIngestionService> _ingestion = new();
    private readonly Mock<IReloadableSnapRepository> _reloadable = new();
    private readonly Mock<ITrendingService> _trending = new();
    private readonly Mock<ISnapSchemaRegistry> _registry = new();

    private IngestionController CreateController() =>
        new IngestionController(
            _ingestion.Object,
            _reloadable.Object,
            _trending.Object,
            _registry.Object,
            NullLogger<IngestionController>.Instance);

    [Fact]
    public async Task RunProvider_ReturnsOk_WithSnapCount()
    {
        // Arrange
        var snaps = new[] { Stubs.MakeSnap("a"), Stubs.MakeSnap("b") };
        _ingestion
            .Setup(s => s.RunProviderAsync("FederalRegister"))
            .ReturnsAsync(snaps);

        var controller = CreateController();

        // Act
        var result = await controller.RunProvider("FederalRegister") as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(StatusCodes.Status200OK, result!.StatusCode);

        var json = JsonSerializer.Serialize(result.Value);
        var doc = JsonDocument.Parse(json).RootElement;
        Assert.Equal(2, doc.GetProperty("count").GetInt32());
        Assert.Equal("FederalRegister", doc.GetProperty("provider").GetString());
    }

    [Fact]
    public async Task RunProvider_InvalidatesTrendingCache()
    {
        _ingestion
            .Setup(s => s.RunProviderAsync(It.IsAny<string>()))
            .ReturnsAsync(new[] { Stubs.MakeSnap() });

        var controller = CreateController();
        await controller.RunProvider("FederalRegister");

        _trending.Verify(t => t.Invalidate(), Times.Once);
    }

    [Fact]
    public async Task RunProvider_Returns404_ForUnknownProvider()
    {
        _ingestion
            .Setup(s => s.RunProviderAsync("Unknown"))
            .ThrowsAsync(new ProviderNotFoundException("Unknown"));

        var controller = CreateController();
        var result = await controller.RunProvider("Unknown");

        Assert.IsType<NotFoundObjectResult>(result);
    }
}

// ── GET /ingestion/status ─────────────────────────────────────────────────────

public class IngestionStatusEndpointTests
{
    private readonly Mock<IIngestionService> _ingestion = new();
    private readonly Mock<IReloadableSnapRepository> _reloadable = new();
    private readonly Mock<ITrendingService> _trending = new();
    private readonly Mock<ISnapSchemaRegistry> _registry = new();

    private IngestionController CreateController() =>
        new IngestionController(
            _ingestion.Object,
            _reloadable.Object,
            _trending.Object,
            _registry.Object,
            NullLogger<IngestionController>.Instance);

    [Fact]
    public void Status_ReturnsOk_WithRegisteredSchemas()
    {
        // Arrange
        var schema = Stubs.ExecutiveOrderSchema();
        _registry.Setup(r => r.RegisteredTypes).Returns(new[] { "ExecutiveOrder" });
        _registry.Setup(r => r.GetSchema("ExecutiveOrder")).Returns(schema);

        var controller = CreateController();

        // Act
        var result = controller.Status() as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(StatusCodes.Status200OK, result!.StatusCode);

        var json = JsonSerializer.Serialize(result.Value);
        var doc = JsonDocument.Parse(json).RootElement;
        Assert.Equal(1, doc.GetProperty("registeredSnapTypes").GetInt32());
    }

    [Fact]
    public void Status_IncludesSchemaDetails()
    {
        var schema = Stubs.ExecutiveOrderSchema();
        _registry.Setup(r => r.RegisteredTypes).Returns(new[] { "ExecutiveOrder" });
        _registry.Setup(r => r.GetSchema("ExecutiveOrder")).Returns(schema);

        var controller = CreateController();
        var result = (controller.Status() as OkObjectResult)!;

        var json = JsonSerializer.Serialize(result.Value);
        var doc = JsonDocument.Parse(json).RootElement;
        var schemas = doc.GetProperty("schemas").EnumerateArray().ToList();

        Assert.Single(schemas);
        Assert.Equal("ExecutiveOrder", schemas[0].GetProperty("type").GetString());
        Assert.Equal(24.0, schemas[0].GetProperty("defaultTtlHours").GetDouble());
    }
}

// ── GET /api/snaps/delta?since= ───────────────────────────────────────────────

public class SnapsDeltaEndpointTests
{
    private readonly Mock<ISnapRepository> _snapRepo = new();
    private readonly Mock<ITrendingService> _trending = new();
    private readonly Mock<IRepresentativeStore> _repStore = new();

    private SnapsController CreateController() =>
        new SnapsController(
            _snapRepo.Object,
            _trending.Object,
            _repStore.Object,
            NullLogger<SnapsController>.Instance);

    [Fact]
    public async Task GetDelta_ReturnsBadRequest_WhenSinceIsNull()
    {
        var controller = CreateController();
        var result = await controller.GetDelta(since: null);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetDelta_ReturnsOk_WithFilteredSnaps()
    {
        // Arrange
        var since = DateTimeOffset.UtcNow.AddHours(-2);
        var snaps = new[]
        {
            Stubs.MakeSnap("delta-1"),
            Stubs.MakeSnap("delta-2"),
        };
        _snapRepo
            .Setup(r => r.GetDeltaAsync(since))
            .ReturnsAsync(snaps);

        var controller = CreateController();

        // Act
        var result = await controller.GetDelta(since) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(StatusCodes.Status200OK, result!.StatusCode);

        var response = result.Value as SnapDeltaResponse;
        Assert.NotNull(response);
        Assert.Equal(2, response!.Total);
        Assert.Equal(since, response.Since);
    }

    [Fact]
    public async Task GetDelta_ReturnsEmptyList_WhenNoUpdatedSnaps()
    {
        var since = DateTimeOffset.UtcNow;
        _snapRepo
            .Setup(r => r.GetDeltaAsync(since))
            .ReturnsAsync(Array.Empty<PoliSnap>());

        var controller = CreateController();
        var result = await controller.GetDelta(since) as OkObjectResult;

        var response = result!.Value as SnapDeltaResponse;
        Assert.Equal(0, response!.Total);
        Assert.Empty(response.Snaps);
    }
}
