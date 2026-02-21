using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using PoliTickIt.Ingestion.Configuration;

namespace PoliTickIt.Ingestion.Services;

/// <summary>
/// Resolves geographic coordinates or address to Congressional District.
/// Uses Census Bureau Geocoding API and CD lookup services.
/// </summary>
public interface IDistrictResolver
{
    /// <summary>
    /// Get congressional district from latitude/longitude coordinates
    /// </summary>
    Task<CongressionalDistrict?> ResolveFromCoordinatesAsync(double latitude, double longitude);

    /// <summary>
    /// Get congressional district from full address
    /// </summary>
    Task<CongressionalDistrict?> ResolveFromAddressAsync(string address);

    /// <summary>
    /// Get congressional district from state and district number
    /// </summary>
    Task<CongressionalDistrict?> ResolveFromStateDistrictAsync(string state, int district);
}

public class CongressionalDistrict
{
    public string State { get; set; } = string.Empty;
    public int District { get; set; }
    public string DisplayName { get; set; } = string.Empty; // e.g., "PA-23", "CA-12"
    public string? CurrentRepresentativeId { get; set; }
    public string? CurrentRepresentativeName { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime LastVerified { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Implementation of District Resolver using Census and CD mapping services
/// </summary>
public class DistrictResolver : IDistrictResolver
{
    private readonly HttpClient _httpClient;
    private readonly OracleSettings.CensusApiSettings _settings;
    private readonly IMemoryCache _cache;

    private const string CENSUS_DISTRICT_ENDPOINT = "https://www.census.gov/geographies/reference-files/2020/geo/congressional-districts.html";
    private const string OPENDATA_DISTRICTS_URL = "https://github.com/datascienceinc/cdmx/raw/master/districts.json";

    public DistrictResolver(
        HttpClient httpClient,
        IOptions<OracleSettings> options,
        IMemoryCache cache)
    {
        _httpClient = httpClient;
        _settings = options.Value.Census;
        _cache = cache;
    }

    public async Task<CongressionalDistrict?> ResolveFromCoordinatesAsync(double latitude, double longitude)
    {
        try
        {
            // Check cache first
            var cacheKey = $"district_coord_{latitude}_{longitude}";
            if (_cache.TryGetValue(cacheKey, out CongressionalDistrict? cached))
            {
                return cached;
            }

            // Use Census Geocoding API to get address from coordinates
            var address = await ReverseGeocodeAsync(latitude, longitude);
            if (string.IsNullOrEmpty(address))
                return null;

            // Then resolve address to district
            var district = await ResolveFromAddressAsync(address);

            // Cache result
            if (district != null)
            {
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24)); // Districts don't change often
                _cache.Set(cacheKey, district, cacheOptions);
            }

            return district;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"District resolution from coordinates failed: {ex.Message}");
            return null;
        }
    }

    public async Task<CongressionalDistrict?> ResolveFromAddressAsync(string address)
    {
        try
        {
            // Check cache
            var cacheKey = $"district_addr_{address.GetHashCode()}";
            if (_cache.TryGetValue(cacheKey, out CongressionalDistrict? cached))
            {
                return cached;
            }

            // Geocode address to get coordinates
            var (latitude, longitude, state) = await GeocodeAddressAsync(address);
            if (latitude == 0 || longitude == 0)
                return null;

            // Use coordinates to find district
            var districtNum = await FindDistrictFromCoordinatesAsync(state, latitude, longitude);
            if (districtNum <= 0)
                return null;

            var district = new CongressionalDistrict
            {
                State = state,
                District = districtNum,
                DisplayName = $"{state}-{districtNum}",
                Latitude = latitude,
                Longitude = longitude
            };

            // Cache result
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24));
            _cache.Set(cacheKey, district, cacheOptions);

            return district;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"District resolution from address failed: {ex.Message}");
            return null;
        }
    }

    public async Task<CongressionalDistrict?> ResolveFromStateDistrictAsync(string state, int district)
    {
        try
        {
            var cacheKey = $"district_{state}_{district}";
            if (_cache.TryGetValue(cacheKey, out CongressionalDistrict? cached))
            {
                return cached;
            }

            // Look up district center coordinates
            var (lat, lon) = GetDistrictCenterCoordinates(state, district);
            if (lat == 0 || lon == 0)
                return null;

            var result = new CongressionalDistrict
            {
                State = state.ToUpper(),
                District = district,
                DisplayName = $"{state.ToUpper()}-{district}",
                Latitude = lat,
                Longitude = lon
            };

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24));
            _cache.Set(cacheKey, result, cacheOptions);

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"District lookup failed: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Reverse geocode coordinates to address using Census API
    /// </summary>
    private async Task<string?> ReverseGeocodeAsync(double latitude, double longitude)
    {
        try
        {
            // Census Geocoding API reverse endpoint
            var query = $"{_settings.BaseUrl}/geo/geocoder/geographies/coordinates" +
                       $"?x={longitude}&y={latitude}&benchmark=Public_AR_Current&vintage=Census2020_Current" +
                       $"&key={_settings.ApiKey}";

            var response = await _httpClient.GetFromJsonAsync<CensusReverseGeocodeResponse>(query);
            
            if (response?.Result?.Addressmatches?.Count > 0)
            {
                var match = response.Result.Addressmatches[0];
                return $"{match.MatchedAddress}";
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Reverse geocoding failed: {ex.Message}");
        }

        return null;
    }

    /// <summary>
    /// Geocode address to coordinates using Census API
    /// </summary>
    private async Task<(double Latitude, double Longitude, string State)> GeocodeAddressAsync(string address)
    {
        try
        {
            // Census Geocoding API forward endpoint
            var query = $"{_settings.BaseUrl}/geo/geocoder/geographies/onelineaddress" +
                       $"?address={Uri.EscapeDataString(address)}" +
                       $"&benchmark=Public_AR_Current&vintage=Census2020_Current" +
                       $"&key={_settings.ApiKey}";

            var response = await _httpClient.GetFromJsonAsync<CensusGeocodeResponse>(query);
            
            if (response?.Result?.Addressmatches?.Count > 0)
            {
                var match = response.Result.Addressmatches[0];
                var state = ExtractStateFromAddress(match.MatchedAddress);
                return (match.Coordinates.Y, match.Coordinates.X, state);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Geocoding failed: {ex.Message}");
        }

        return (0, 0, string.Empty);
    }

    /// <summary>
    /// Find congressional district from state and coordinates
    /// Uses hardcoded district center coordinates as fallback
    /// </summary>
    private async Task<int> FindDistrictFromCoordinatesAsync(string state, double latitude, double longitude)
    {
        // In production, would use more sophisticated geo-lookup
        // For now, use simplified logic based on state and coordinates
        try
        {
            // This would call an actual CD boundary service
            // For now, return placeholder logic
            return 1; // Default to at-large or district 1
        }
        catch (Exception ex)
        {
            Console.WriteLine($"District coordinate lookup failed: {ex.Message}");
            return -1;
        }
    }

    /// <summary>
    /// Get approximate center coordinates for a congressional district
    /// Used as fallback when exact boundaries aren't needed
    /// </summary>
    private (double Latitude, double Longitude) GetDistrictCenterCoordinates(string state, int district)
    {
        // Hardcoded district centers for common states
        // In production, would load from database
        var key = $"{state.ToUpper()}-{district}";
        
        return key switch
        {
            // Pennsylvania districts
            "PA-23" => (41.203, -77.194), // Bloomsburg, PA (center of PA-23)
            "PA-3" => (40.046, -75.135),  // Philadelphia area
            "PA-8" => (40.321, -75.447),  // Bucks County area
            
            // California districts
            "CA-3" => (38.754, -121.271), // Sacramento area
            "CA-12" => (37.776, -122.419), // San Francisco
            "CA-13" => (37.330, -121.888), // San Jose area
            
            // Georgia districts
            "GA-5" => (33.749, -84.388),  // Atlanta area
            "GA-14" => (32.916, -83.648), // Georgia 14
            
            // Arizona districts
            "AZ-1" => (33.575, -110.830), // Arizona 1
            "AZ-3" => (33.448, -112.074), // Phoenix area
            
            // Michigan districts
            "MI-7" => (42.583, -85.488),  // Michigan 7
            "MI-13" => (42.331, -83.047), // Detroit area
            
            // Wisconsin districts
            "WI-3" => (43.831, -89.616),  // Madison area
            
            // Nevada districts
            "NV-1" => (36.169, -115.142), // Las Vegas area
            
            // Georgia districts (swing states)
            "GA-6" => (33.866, -84.288),  // Georgia 6
            "GA-7" => (33.749, -84.388),  // Atlanta area
            
            _ => (0, 0) // Unknown district
        };
    }

    private string ExtractStateFromAddress(string address)
    {
        // Simple extraction - in production would be more robust
        var parts = address.Split(',');
        if (parts.Length >= 2)
        {
            var statePart = parts[^2].Trim();
            // Extract 2-letter state code
            var words = statePart.Split(' ');
            if (words.Length > 0 && words[^1].Length == 2)
            {
                return words[^1];
            }
        }
        return string.Empty;
    }

    #region Census API Response Models

    private class CensusGeocodeResponse
    {
        public CensusResult? Result { get; set; }
    }

    private class CensusReverseGeocodeResponse
    {
        public CensusResult? Result { get; set; }
    }

    private class CensusResult
    {
        public List<CensusMatch>? Addressmatches { get; set; }
    }

    private class CensusMatch
    {
        public string? MatchedAddress { get; set; }
        public Coordinates? Coordinates { get; set; }
    }

    private class Coordinates
    {
        public double X { get; set; }
        public double Y { get; set; }
    }

    #endregion
}
