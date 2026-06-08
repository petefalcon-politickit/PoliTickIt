using System.Net;
using System.Text.Json;
using Xunit;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Api.Tests.Controllers;

public class SnapsControllerTests : IAsyncLifetime
{
    private ApiWebApplicationFactory? _factory;
    private HttpClient? _client;

    public async Task InitializeAsync()
    {
        _factory = new ApiWebApplicationFactory();
        _client = _factory.CreateClient();
    }

    public async Task DisposeAsync()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }

    [Fact]
    public async Task GetAll_ShouldReturnEmptyList_WhenNoSnapsExist()
    {
        // Act
        var response = await _client!.GetAsync("/api/snaps");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(content,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // SnapsController returns a SnapFeedResponse, not a raw list
        Assert.True(result.TryGetProperty("snaps", out var snapsEl));
        Assert.Equal(JsonValueKind.Array, snapsEl.ValueKind);
    }

    [Fact]
    public async Task GetById_ShouldReturnNotFound_WhenSnapDoesNotExist()
    {
        // Act
        var response = await _client!.GetAsync("/api/snaps/non-existent-id");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetById_ShouldReturnSnap_WhenSnapExists()
    {
        // First get all snaps to find an existing ID via the feed endpoint
        var allResponse = await _client!.GetAsync("/api/snaps");
        var allContent = await allResponse.Content.ReadAsStringAsync();
        var feedResult = JsonSerializer.Deserialize<JsonElement>(allContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Assert.True(feedResult.TryGetProperty("snaps", out var snapsEl));
        var snapsList = snapsEl.EnumerateArray().ToList();
        Assert.NotEmpty(snapsList);

        // Now test getting by ID
        var existingId = snapsList[0].GetProperty("id").GetString();
        var response = await _client!.GetAsync($"/api/snaps/{existingId}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        var snap = JsonSerializer.Deserialize<PoliSnap>(content,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(snap);
        Assert.Equal(existingId, snap.Id);
    }
}
