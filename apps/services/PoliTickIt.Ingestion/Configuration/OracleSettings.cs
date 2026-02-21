using System;

namespace PoliTickIt.Ingestion.Configuration;

/// <summary>
/// Configuration settings for all Oracle API providers.
/// Currently uses local configuration files (unsecure for local dev).
/// Will migrate to Azure Key Vault on production deployment.
/// </summary>
public class OracleSettings
{
    public const string SectionName = "OracleSettings";

    /// <summary>
    /// Federal Election Commission (FEC) API settings
    /// </summary>
    public FecApiSettings Fec { get; set; } = new();

    /// <summary>
    /// Congress.gov API settings
    /// </summary>
    public CongressApiSettings Congress { get; set; } = new();

    /// <summary>
    /// SAM.gov / Grants.gov API settings
    /// </summary>
    public GrantsApiSettings Grants { get; set; } = new();

    /// <summary>
    /// Census API settings for geospatial queries
    /// </summary>
    public CensusApiSettings Census { get; set; } = new();

    public class FecApiSettings
    {
        /// <summary>
        /// API Key for api.open.fec.gov
        /// Obtain from: https://api.open.fec.gov/developers/
        /// </summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for FEC API (defaults to production)
        /// </summary>
        public string BaseUrl { get; set; } = "https://api.open.fec.gov/v1";

        /// <summary>
        /// Request timeout in seconds
        /// </summary>
        public int TimeoutSeconds { get; set; } = 30;

        /// <summary>
        /// Enable/disable caching of FEC responses
        /// </summary>
        public bool EnableCaching { get; set; } = true;

        /// <summary>
        /// Cache duration in minutes
        /// </summary>
        public int CacheDurationMinutes { get; set; } = 60;
    }

    public class CongressApiSettings
    {
        /// <summary>
        /// API Key for api.congress.gov
        /// Obtain from: https://api.congress.gov/
        /// </summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for Congress API
        /// </summary>
        public string BaseUrl { get; set; } = "https://api.congress.gov/v3";

        /// <summary>
        /// Request timeout in seconds
        /// </summary>
        public int TimeoutSeconds { get; set; } = 30;

        /// <summary>
        /// Enable/disable caching
        /// </summary>
        public bool EnableCaching { get; set; } = true;

        /// <summary>
        /// Cache duration in minutes
        /// </summary>
        public int CacheDurationMinutes { get; set; } = 120;
    }

    public class GrantsApiSettings
    {
        /// <summary>
        /// API Key for SAM.gov
        /// Obtain from: https://open.sam.gov/SAMPortal/
        /// </summary>
        public string SamApiKey { get; set; } = string.Empty;

        /// <summary>
        /// API Key for Grants.gov
        /// Obtain from: https://www.grants.gov/
        /// </summary>
        public string GrantsApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for SAM API
        /// </summary>
        public string SamBaseUrl { get; set; } = "https://api.sam.gov/opportunities/v2";

        /// <summary>
        /// Request timeout in seconds
        /// </summary>
        public int TimeoutSeconds { get; set; } = 30;

        /// <summary>
        /// Enable/disable caching
        /// </summary>
        public bool EnableCaching { get; set; } = true;

        /// <summary>
        /// Cache duration in minutes
        /// </summary>
        public int CacheDurationMinutes { get; set; } = 60;
    }

    public class CensusApiSettings
    {
        /// <summary>
        /// API Key for Census Bureau API
        /// Obtain from: https://api.census.gov/data/key_signup.html
        /// </summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for Census API
        /// </summary>
        public string BaseUrl { get; set; } = "https://api.census.gov/data";

        /// <summary>
        /// Request timeout in seconds
        /// </summary>
        public int TimeoutSeconds { get; set; } = 30;

        /// <summary>
        /// Enable/disable caching for district lookups
        /// </summary>
        public bool EnableCaching { get; set; } = true;

        /// <summary>
        /// Cache duration in minutes
        /// </summary>
        public int CacheDurationMinutes { get; set; } = 1440; // 24 hours - districts don't change often
    }
}
