# PoliTickIt Environment Configuration Analysis
## API Keys & Secrets Management Setup

**Framework:** .NET 9  
**Analysis Date:** 2026-01-30

---

## Executive Summary

**Current Status:** ? MISSING PROPER CONFIGURATION

**Issues Found:**
1. ? No API keys configuration structure
2. ? No environment variables setup
3. ? No secrets management
4. ? No appsettings for different environments
5. ? Hard-coded DEMO_KEY in code
6. ?? No configuration section for data oracles

**Recommendation:** IMPLEMENT CONFIGURATION SYSTEM NOW

---

## Current Configuration Files

### What Exists

**Files Found:**
- ? `appsettings.json` (basic)
- ? `appsettings.Development.json` (basic)

### What's Missing

- ? `appsettings.Production.json`
- ? `appsettings.Integration.json`
- ? `appsettings.Testing.json`
- ? User Secrets configuration
- ? Environment variable mappings
- ? Oracle API keys section

---

## Current Content

### appsettings.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**Status:** ? MINIMAL - Only logging and CORS

---

### appsettings.Development.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Status:** ? IDENTICAL TO BASE - No development-specific config

---

## Problems Identified

### Problem 1: Hard-Coded API Keys

**File:** `CongressionalActivityProvider.cs`

```csharp
var response = await HttpClient.GetFromJsonAsync<CongressApiResponse>(
    "https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json"  // HARDCODED!
);
```

**Issues:**
- ? API key exposed in source code
- ? DEMO_KEY rate-limited (1 req/sec)
- ? Can't be changed without code modification
- ? Security risk if code is shared

---

### Problem 2: No Configuration Injection

**File:** `Program.cs`

```csharp
builder.Services.AddScoped<IDataSourceProvider, CongressionalActivityProvider>();
builder.Services.AddScoped<IDataSourceProvider, FecProvider>();
// NO configuration passed to providers
```

**Issues:**
- ? Providers can't access configuration
- ? No way to set API keys
- ? No environment-specific behavior

---

### Problem 3: No Secrets Management

**Missing:**
- ? User Secrets (for development)
- ? Azure Key Vault integration (for production)
- ? Environment variable support
- ? Secret rotation capability

---

### Problem 4: No Environment-Specific Settings

**Currently Only:**
- ? `appsettings.json`
- ? `appsettings.Development.json`

**Missing:**
- ? Production configuration
- ? Staging configuration
- ? Testing configuration
- ? Integration testing configuration

---

## What Should Be Implemented

### 1. Configuration Structure

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "DataOracles": {
    "CongressGov": {
      "ApiKey": "DEMO_KEY",
      "BaseUrl": "https://api.congress.gov/v3",
      "Enabled": false,
      "RateLimit": {
        "RequestsPerSecond": 1,
        "RequestsPerDay": 1000
      }
    },
    "FecGov": {
      "ApiKey": "DEMO_KEY",
      "BaseUrl": "https://api.open.fec.gov",
      "Enabled": false,
      "RateLimit": {
        "RequestsPerSecond": 1,
        "RequestsPerDay": 1000
      }
    },
    "GrantsGov": {
      "ApiKey": "",
      "BaseUrl": "https://api.sam.gov",
      "Enabled": false,
      "RateLimit": {
        "RequestsPerSecond": 2,
        "RequestsPerDay": 5000
      }
    },
    "EthicsHouse": {
      "Url": "https://ethics.house.gov/press-releases",
      "Enabled": false,
      "Timeout": 30000
    }
  },
  "Integration": {
    "EnableExternalApiTests": false,
    "ExternalApiTimeout": 30000,
    "RetryPolicy": {
      "MaxRetries": 3,
      "InitialDelayMs": 1000,
      "MaxDelayMs": 30000
    }
  }
}
```

---

### 2. Settings Class

Create: `PoliTickIt.Ingestion/Configuration/OracleSettings.cs`

```csharp
namespace PoliTickIt.Ingestion.Configuration;

public class OracleSettings
{
    public const string SectionName = "DataOracles";
    
    public CongressGovSettings CongressGov { get; set; } = new();
    public FecGovSettings FecGov { get; set; } = new();
    public GrantsGovSettings GrantsGov { get; set; } = new();
    public EthicsSettings EthicsHouse { get; set; } = new();
}

public class CongressGovSettings
{
    public string ApiKey { get; set; } = "DEMO_KEY";
    public string BaseUrl { get; set; } = "https://api.congress.gov/v3";
    public bool Enabled { get; set; }
    public RateLimitSettings RateLimit { get; set; } = new();
}

public class FecGovSettings
{
    public string ApiKey { get; set; } = "DEMO_KEY";
    public string BaseUrl { get; set; } = "https://api.open.fec.gov";
    public bool Enabled { get; set; }
    public RateLimitSettings RateLimit { get; set; } = new();
}

public class GrantsGovSettings
{
    public string ApiKey { get; set; } = "";
    public string BaseUrl { get; set; } = "https://api.sam.gov";
    public bool Enabled { get; set; }
    public RateLimitSettings RateLimit { get; set; } = new();
}

public class EthicsSettings
{
    public string Url { get; set; } = "https://ethics.house.gov/press-releases";
    public bool Enabled { get; set; }
    public int Timeout { get; set; } = 30000;
}

public class RateLimitSettings
{
    public int RequestsPerSecond { get; set; }
    public int RequestsPerDay { get; set; }
}

public class IntegrationSettings
{
    public const string SectionName = "Integration";
    
    public bool EnableExternalApiTests { get; set; }
    public int ExternalApiTimeout { get; set; }
    public RetryPolicySettings RetryPolicy { get; set; } = new();
}

public class RetryPolicySettings
{
    public int MaxRetries { get; set; } = 3;
    public int InitialDelayMs { get; set; } = 1000;
    public int MaxDelayMs { get; set; } = 30000;
}
```

---

### 3. Register in Program.cs

```csharp
// Add Configuration Binding
var oracleSettings = builder.Configuration.GetSection(OracleSettings.SectionName).Get<OracleSettings>();
builder.Services.Configure<OracleSettings>(builder.Configuration.GetSection(OracleSettings.SectionName));
builder.Services.Configure<IntegrationSettings>(builder.Configuration.GetSection(IntegrationSettings.SectionName));

// Make configuration available
builder.Services.AddSingleton(oracleSettings ?? new OracleSettings());
```

---

### 4. Use in Providers

```csharp
public class CongressionalActivityProvider : IDataSourceProvider
{
    private readonly HttpClient _httpClient;
    private readonly IContextEnrichmentProcessor _cep;
    private readonly OracleSettings _oracleSettings;

    public CongressionalActivityProvider(
        HttpClient httpClient,
        IContextEnrichmentProcessor cep,
        IOptions<OracleSettings> oracleSettings)
    {
        _httpClient = httpClient;
        _cep = cep;
        _oracleSettings = oracleSettings.Value;
    }

    public async Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync()
    {
        if (!_oracleSettings.CongressGov.Enabled)
        {
            return await Task.FromResult(new List<PoliSnap>());
        }

        var apiKey = _oracleSettings.CongressGov.ApiKey;
        var url = $"{_oracleSettings.CongressGov.BaseUrl}/bill?api_key={apiKey}&format=json";
        
        // ... rest of implementation
    }
}
```

---

## Environment-Specific Files Needed

### appsettings.Production.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error"
    }
  },
  "DataOracles": {
    "CongressGov": {
      "ApiKey": "${CONGRESS_GOV_API_KEY}",
      "Enabled": true
    },
    "FecGov": {
      "ApiKey": "${FEC_API_KEY}",
      "Enabled": true
    }
  }
}
```

### appsettings.Integration.json
```json
{
  "DataOracles": {
    "CongressGov": {
      "Enabled": true,
      "RateLimit": {
        "RequestsPerSecond": 1,
        "RequestsPerDay": 1000
      }
    }
  },
  "Integration": {
    "EnableExternalApiTests": true,
    "ExternalApiTimeout": 60000
  }
}
```

---

## User Secrets Setup

### For Development Only

```bash
# Initialize user secrets
dotnet user-secrets init --project PoliTickIt.Api

# Set secrets
dotnet user-secrets set "DataOracles:CongressGov:ApiKey" "your-real-api-key" --project PoliTickIt.Api
dotnet user-secrets set "DataOracles:FecGov:ApiKey" "your-real-fec-key" --project PoliTickIt.Api
dotnet user-secrets set "DataOracles:GrantsGov:ApiKey" "your-real-grants-key" --project PoliTickIt.Api
```

### .gitignore Entry
```
# User Secrets
/PoliTickIt.Api/Properties/launchSettings.json
/PoliTickIt.Api/appsettings.*.local.json
secrets.json
```

---

## Environment Variables

### Development
```bash
# PowerShell
$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:CONGRESS_GOV_API_KEY = "your-demo-key"
```

### Production
```bash
# Azure App Service automatically sets:
ASPNETCORE_ENVIRONMENT = Production
CONGRESS_GOV_API_KEY = (from Key Vault)
FEC_API_KEY = (from Key Vault)
```

---

## Current Code Issues

### Hard-Coded Keys Problem

**Before:**
```csharp
var url = "https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json";
```

**After:**
```csharp
var apiKey = _oracleSettings.CongressGov.ApiKey;
var url = $"{_oracleSettings.CongressGov.BaseUrl}/bill?api_key={apiKey}&format=json";
```

---

## Implementation Priority

### Phase 1: CRITICAL (Do First)
1. ? Create OracleSettings class
2. ? Add appsettings sections
3. ? Update Program.cs to register
4. ? Remove hard-coded keys from providers
5. ? Update providers to use IOptions

### Phase 2: IMPORTANT (Do Soon)
1. ? Create appsettings.Production.json
2. ? Create appsettings.Integration.json
3. ? Setup user secrets
4. ? Add retry policy

### Phase 3: NICE-TO-HAVE (Later)
1. ? Azure Key Vault integration
2. ? Configuration validation on startup
3. ? Rate limiting enforcement

---

## Summary

**Current State:** ? NO PROPER CONFIGURATION

**Issues:**
- Hard-coded API keys
- No configuration system
- No environment-specific settings
- No secrets management

**Required:**
1. Create OracleSettings class
2. Add configuration sections to appsettings
3. Update providers to use IOptions
4. Setup environment-specific files
5. Remove hard-coded keys

**Effort:** ~2-3 hours for full implementation

**Priority:** HIGH - Do this before production deployment

---

**Recommendation:** Implement configuration system immediately before any real API calls are made.

See: `IMPLEMENTATION_CONFIGURATION_GUIDE.md` for step-by-step instructions.
