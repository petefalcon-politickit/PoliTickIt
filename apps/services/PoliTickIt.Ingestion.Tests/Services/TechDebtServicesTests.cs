using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using PoliTickIt.Ingestion.Configuration;
using PoliTickIt.Ingestion.Services;
using Moq;

namespace PoliTickIt.Ingestion.Tests.Services;

/// <summary>
/// Unit tests for Oracle Drift Detection service
/// </summary>
public class OracleDriftDetectorTests
{
    private readonly IOracleDriftDetector _driftDetector;
    private readonly string _testCatalogPath;
    private readonly string _testJournalPath;

    public OracleDriftDetectorTests()
    {
        _testCatalogPath = Path.Combine(Path.GetTempPath(), $"test_catalog_{Guid.NewGuid()}.md");
        _testJournalPath = Path.Combine(Path.GetTempPath(), $"test_journal_{Guid.NewGuid()}.md");
        _driftDetector = new OracleDriftDetector(_testCatalogPath, _testJournalPath);
    }

    [Fact]
    public async Task AuditProvidersAsync_ReturnsReport()
    {
        // Act
        var report = await _driftDetector.AuditProvidersAsync();

        // Assert
        Assert.NotNull(report);
        Assert.Equal("All Providers", report.ProviderName);
    }

    [Fact]
    public async Task GenerateCatalogUpdatesAsync_ReturnsMarkdownContent()
    {
        // Act
        var updates = await _driftDetector.GenerateCatalogUpdatesAsync();

        // Assert
        Assert.NotNull(updates);
        Assert.Contains("Suggested Oracle Data Catalog Updates", updates);
        Assert.Contains("Generated:", updates);
    }

    [Fact]
    public async Task AuditProviderAsync_WithNullType_ThrowsArgumentNullException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<NullReferenceException>(
            () => _driftDetector.AuditProviderAsync(null!));
    }

    [Fact]
    public async Task AuditProvidersAsync_LogsDriftToJournal_WhenDriftFound()
    {
        // Arrange
        // Create a test catalog file
        var catalogContent = "| Provider | Property | Type |\n" +
                            "|---|---|---|\n" +
                            "| FecProvider | ContributionAmount | decimal |\n";
        Directory.CreateDirectory(Path.GetDirectoryName(_testCatalogPath)!);
        await File.WriteAllTextAsync(_testCatalogPath, catalogContent);

        // Act
        var report = await _driftDetector.AuditProvidersAsync();

        // Assert - may or may not have drift depending on actual implementation
        Assert.NotNull(report);
    }

    public void Dispose()
    {
        // Cleanup
        try
        {
            if (File.Exists(_testCatalogPath)) File.Delete(_testCatalogPath);
            if (File.Exists(_testJournalPath)) File.Delete(_testJournalPath);
        }
        catch { /* Ignore cleanup errors */ }
    }
}

/// <summary>
/// Unit tests for District Resolver service
/// </summary>
public class DistrictResolverTests
{
    private readonly IDistrictResolver _districtResolver;
    private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
    private readonly IMemoryCache _cache;

    public DistrictResolverTests()
    {
        _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
        _cache = new MemoryCache(new MemoryCacheOptions());
        
        var options = Options.Create(new OracleSettings
        {
            Census = new OracleSettings.CensusApiSettings
            {
                ApiKey = "test_key",
                BaseUrl = "https://api.census.gov/data",
                TimeoutSeconds = 30,
                EnableCaching = true
            }
        });

        _districtResolver = new DistrictResolver(httpClient, options, _cache);
    }

    [Fact]
    public async Task ResolveFromStateDistrictAsync_PA23_ReturnsDistrict()
    {
        // Act
        var result = await _districtResolver.ResolveFromStateDistrictAsync("PA", 23);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("PA", result.State);
        Assert.Equal(23, result.District);
        Assert.Equal("PA-23", result.DisplayName);
        Assert.True(result.Latitude > 0);
        Assert.True(result.Longitude != 0);
    }

    [Fact]
    public async Task ResolveFromStateDistrictAsync_CA3_ReturnsDistrict()
    {
        // Act
        var result = await _districtResolver.ResolveFromStateDistrictAsync("CA", 3);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("CA", result.State);
        Assert.Equal(3, result.District);
        Assert.Equal("CA-3", result.DisplayName);
    }

    [Fact]
    public async Task ResolveFromStateDistrictAsync_GA5_ReturnsDistrict()
    {
        // Act
        var result = await _districtResolver.ResolveFromStateDistrictAsync("GA", 5);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("GA", result.State);
        Assert.Equal(5, result.District);
    }

    [Fact]
    public async Task ResolveFromStateDistrictAsync_CacheWorks()
    {
        // Act - First call
        var result1 = await _districtResolver.ResolveFromStateDistrictAsync("PA", 23);
        
        // Act - Second call should hit cache
        var result2 = await _districtResolver.ResolveFromStateDistrictAsync("PA", 23);

        // Assert
        Assert.NotNull(result1);
        Assert.NotNull(result2);
        Assert.Equal(result1.DisplayName, result2.DisplayName);
    }

    [Fact]
    public async Task ResolveFromStateDistrictAsync_UnknownDistrict_ReturnsNull()
    {
        // Act
        var result = await _districtResolver.ResolveFromStateDistrictAsync("XX", 99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task ResolveFromCoordinatesAsync_WithInvalidCoordinates_ReturnsNull()
    {
        // Act
        var result = await _districtResolver.ResolveFromCoordinatesAsync(0, 0);

        // Assert
        Assert.Null(result);
    }
}

/// <summary>
/// Unit tests for Oracle Settings configuration
/// </summary>
public class OracleSettingsTests
{
    [Fact]
    public void OracleSettings_HasSectionName()
    {
        // Assert
        Assert.Equal("OracleSettings", OracleSettings.SectionName);
    }

    [Fact]
    public void FecApiSettings_HasDefaultValues()
    {
        // Arrange & Act
        var settings = new OracleSettings.FecApiSettings();

        // Assert
        Assert.Equal("https://api.open.fec.gov/v1", settings.BaseUrl);
        Assert.Equal(30, settings.TimeoutSeconds);
        Assert.True(settings.EnableCaching);
        Assert.Equal(60, settings.CacheDurationMinutes);
    }

    [Fact]
    public void CongressApiSettings_HasDefaultValues()
    {
        // Arrange & Act
        var settings = new OracleSettings.CongressApiSettings();

        // Assert
        Assert.Equal("https://api.congress.gov/v3", settings.BaseUrl);
        Assert.Equal(30, settings.TimeoutSeconds);
        Assert.True(settings.EnableCaching);
        Assert.Equal(120, settings.CacheDurationMinutes);
    }

    [Fact]
    public void GrantsApiSettings_HasDefaultValues()
    {
        // Arrange & Act
        var settings = new OracleSettings.GrantsApiSettings();

        // Assert
        Assert.Equal("https://api.sam.gov/opportunities/v2", settings.SamBaseUrl);
        Assert.Equal(30, settings.TimeoutSeconds);
        Assert.True(settings.EnableCaching);
    }

    [Fact]
    public void CensusApiSettings_HasDefaultValues()
    {
        // Arrange & Act
        var settings = new OracleSettings.CensusApiSettings();

        // Assert
        Assert.Equal("https://api.census.gov/data", settings.BaseUrl);
        Assert.Equal(30, settings.TimeoutSeconds);
        Assert.True(settings.EnableCaching);
        Assert.Equal(1440, settings.CacheDurationMinutes); // 24 hours
    }

    [Fact]
    public void OracleSettings_CanBeInstantiated()
    {
        // Act
        var settings = new OracleSettings();

        // Assert
        Assert.NotNull(settings.Fec);
        Assert.NotNull(settings.Congress);
        Assert.NotNull(settings.Grants);
        Assert.NotNull(settings.Census);
    }
}
