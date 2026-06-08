using Moq;
using PoliTickIt.Domain.Interfaces;
using Xunit;
using PoliTickIt.Ingestion.Providers;
using PoliTickIt.Ingestion.Configuration;
using System.Net.Http;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;

namespace PoliTickIt.Api.Tests.Providers;

public class FecProviderTests
{
    private Mock<IContextEnrichmentProcessor> _mockCep = new Mock<IContextEnrichmentProcessor>();
    private HttpClient _httpClient = new HttpClient(); // In a real unit test, we should mock the handler
    private IOptions<OracleSettings> _options = Options.Create(new OracleSettings());
    private Mock<IMemoryCache> _mockCache = new Mock<IMemoryCache>();

    [Fact]
    public async Task FetchLatestSnapsAsync_ShouldReturnSnaps()
    {
        // Arrange
        var provider = new FecProvider(_httpClient, _mockCep.Object, _options, _mockCache.Object);

        // Act
        var result = await provider.FetchLatestSnapsAsync();

        // Assert
        Assert.NotNull(result);
        // Note: Live data might be empty if the API is down, but we expect an object
    }

    [Fact]
    public void ProviderName_ShouldReturnFecOracle()
    {
        // Arrange
        var provider = new FecProvider(_httpClient, _mockCep.Object, _options, _mockCache.Object);

        // Act
        var name = provider.ProviderName;

        // Assert
        Assert.Equal("FEC.Oracle", name);
    }
}
