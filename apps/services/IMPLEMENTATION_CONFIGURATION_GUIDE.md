# Environment Configuration Implementation Guide
## Setup Oracle API Keys Properly

**Framework:** .NET 9  
**Estimated Time:** 2-3 hours

---

## Step 1: Create OracleSettings Class

**Create File:** `PoliTickIt.Ingestion/Configuration/OracleSettings.cs`

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
    public bool Enabled { get; set; } = false;
    public RateLimitSettings RateLimit { get; set; } = new();
}

public class FecGovSettings
{
    public string ApiKey { get; set; } = "DEMO_KEY";
    public string BaseUrl { get; set; } = "https://api.open.fec.gov";
    public bool Enabled { get; set; } = false;
    public RateLimitSettings RateLimit { get; set; } = new();
}

public class GrantsGovSettings
{
    public string ApiKey { get; set; } = "";
    public string BaseUrl { get; set; } = "https://api.sam.gov";
    public bool Enabled { get; set; } = false;
    public RateLimitSettings RateLimit { get; set; } = new();
}

public class EthicsSettings
{
    public string Url { get; set; } = "https://ethics.house.gov/press-releases";
    public bool Enabled { get; set; } = false;
    public int Timeout { get; set; } = 30000;
}

public class RateLimitSettings
{
    public int RequestsPerSecond { get; set; } = 1;
    public int RequestsPerDay { get; set; } = 1000;
}

public class IntegrationSettings
{
    public const string SectionName = "Integration";
    
    public bool EnableExternalApiTests { get; set; } = false;
    public int ExternalApiTimeout { get; set; } = 30000;
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

## Step 2: Update appsettings.json

**File:** `PoliTickIt.Api/appsettings.json`

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

## Step 3: Create appsettings.Development.json

**File:** `PoliTickIt.Api/appsettings.Development.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "DataOracles": {
    "CongressGov": {
      "ApiKey": "DEMO_KEY",
      "Enabled": false
    },
    "FecGov": {
      "ApiKey": "DEMO_KEY",
      "Enabled": false
    }
  }
}
```

---

## Step 4: Create appsettings.Production.json

**File:** `PoliTickIt.Api/appsettings.Production.json`

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
    },
    "GrantsGov": {
      "ApiKey": "${GRANTS_GOV_API_KEY}",
      "Enabled": true
    }
  }
}
```

---

## Step 5: Create appsettings.Integration.json

**File:** `PoliTickIt.Api/appsettings.Integration.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "DataOracles": {
    "CongressGov": {
      "ApiKey": "DEMO_KEY",
      "Enabled": true,
      "RateLimit": {
        "RequestsPerSecond": 1,
        "RequestsPerDay": 1000
      }
    },
    "FecGov": {
      "ApiKey": "DEMO_KEY",
      "Enabled": true
    }
  },
  "Integration": {
    "EnableExternalApiTests": true,
    "ExternalApiTimeout": 60000,
    "RetryPolicy": {
      "MaxRetries": 3,
      "InitialDelayMs": 500,
      "MaxDelayMs": 5000
    }
  }
}
```

---

## Step 6: Update Program.cs

**File:** `PoliTickIt.Api/Program.cs`

Add these lines after `var builder = WebApplication.CreateBuilder(args);`:

```csharp
// Add Configuration
var oracleSettings = builder.Configuration
    .GetSection(OracleSettings.SectionName)
    .Get<OracleSettings>() ?? new OracleSettings();

builder.Services.Configure<OracleSettings>(
    builder.Configuration.GetSection(OracleSettings.SectionName));

builder.Services.Configure<IntegrationSettings>(
    builder.Configuration.GetSection(IntegrationSettings.SectionName));

builder.Services.AddSingleton(oracleSettings);
```

Add the using statement at the top:
```csharp
using PoliTickIt.Ingestion.Configuration;
```

---

## Step 7: Update CongressionalActivityProvider

**File:** `PoliTickIt.Ingestion/Providers/CongressionalActivityProvider.cs`

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;
using PoliTickIt.Ingestion.Configuration;

namespace PoliTickIt.Ingestion.Providers;

public class CongressionalActivityProvider : IDataSourceProvider
{
    private readonly HttpClient _httpClient;
    private readonly IContextEnrichmentProcessor _cep;
    private readonly OracleSettings _oracleSettings;

    public string ProviderName => "Congressional.Activity.Oracle";

    public CongressionalActivityProvider(
        HttpClient httpClient,
        IContextEnrichmentProcessor cep,
        IOptions<OracleSettings> oracleSettings)
    {
        _httpClient = httpClient;
        _cep = cep;
        _oracleSettings = oracleSettings.Value;
    }

    public async Task<bool> CheckHeartbeatAsync()
    {
        return await Task.FromResult(true);
    }

    public async Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync()
    {
        var snaps = new List<PoliSnap>();

        // Return empty if disabled
        if (!_oracleSettings.CongressGov.Enabled)
        {
            return snaps;
        }

        try
        {
            var apiKey = _oracleSettings.CongressGov.ApiKey;
            var baseUrl = _oracleSettings.CongressGov.BaseUrl;
            var url = $"{baseUrl}/bill?api_key={apiKey}&format=json";

            var response = await _httpClient.GetFromJsonAsync<CongressApiResponse>(url);

            if (response?.Bills != null)
            {
                foreach (var bill in response.Bills)
                {
                    snaps.Add(MapToActivitySnap(bill));
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Oracle Error [{ProviderName}]: {ex.Message}");
        }

        return snaps;
    }

    // ... rest of the implementation
}
```

---

## Step 8: Update Other Providers (FecProvider, GrantPulseProvider)

Follow the same pattern as CongressionalActivityProvider.

---

## Step 9: Setup User Secrets (Development)

```bash
# Initialize user secrets for the API project
cd PoliTickIt.Api
dotnet user-secrets init

# Set your actual API keys (don't commit these!)
dotnet user-secrets set "DataOracles:CongressGov:ApiKey" "your-actual-api-key"
dotnet user-secrets set "DataOracles:FecGov:ApiKey" "your-actual-fec-key"
dotnet user-secrets set "DataOracles:GrantsGov:ApiKey" "your-actual-grants-key"

# Verify secrets were set
dotnet user-secrets list
```

---

## Step 10: Update .gitignore

**File:** `.gitignore`

Add these entries:
```
# User Secrets
/PoliTickIt.Api/Properties/launchSettings.json
/PoliTickIt.Api/appsettings.*.local.json
secrets.json
/PoliTickIt.Api/appsettings.secrets.json
```

---

## Step 11: Register Providers with HttpClient

**Update Program.cs:**

```csharp
// Register Ingestion Engine Components with configuration
builder.Services.AddScoped<IDataSourceProvider>(provider =>
    new CongressionalActivityProvider(
        provider.GetRequiredService<HttpClient>(),
        provider.GetRequiredService<IContextEnrichmentProcessor>(),
        provider.GetRequiredService<IOptions<OracleSettings>>()
    ));

builder.Services.AddScoped<IDataSourceProvider>(provider =>
    new FecProvider(
        provider.GetRequiredService<HttpClient>(),
        provider.GetRequiredService<IContextEnrichmentProcessor>(),
        provider.GetRequiredService<IOptions<OracleSettings>>()
    ));

// ... similar for other providers
```

---

## Step 12: Test Configuration

Create test file: `PoliTickIt.Api.Tests/Integration/ConfigurationTests.cs`

```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using PoliTickIt.Ingestion.Configuration;

namespace PoliTickIt.Api.Tests.Integration;

public class ConfigurationTests
{
    [Fact]
    public void OracleSettings_LoadsFromConfiguration()
    {
        // Arrange
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        // Act
        var settings = config.GetSection(OracleSettings.SectionName).Get<OracleSettings>();

        // Assert
        Assert.NotNull(settings);
        Assert.NotNull(settings.CongressGov);
        Assert.Equal("https://api.congress.gov/v3", settings.CongressGov.BaseUrl);
    }

    [Fact]
    public void CongressGovSettings_HasDefaultValues()
    {
        // Arrange & Act
        var settings = new OracleSettings();

        // Assert
        Assert.NotNull(settings.CongressGov);
        Assert.Equal("DEMO_KEY", settings.CongressGov.ApiKey);
        Assert.False(settings.CongressGov.Enabled);
    }
}
```

---

## Verification Checklist

- [ ] Created OracleSettings.cs
- [ ] Updated appsettings.json with DataOracles section
- [ ] Created appsettings.Development.json
- [ ] Created appsettings.Production.json
- [ ] Created appsettings.Integration.json
- [ ] Updated Program.cs to register configuration
- [ ] Updated CongressionalActivityProvider with IOptions
- [ ] Updated FecProvider with IOptions
- [ ] Updated other providers with IOptions
- [ ] Setup user-secrets for development
- [ ] Updated .gitignore
- [ ] Built and tested the solution
- [ ] Configuration tests pass

---

## Build & Test

```bash
# Build solution
dotnet build

# Run tests
dotnet test PoliTickIt.Api.Tests

# Run with Development settings
dotnet run --project PoliTickIt.Api

# Run with Integration settings
ASPNETCORE_ENVIRONMENT=Integration dotnet run --project PoliTickIt.Api
```

---

## Production Deployment

### Azure App Service

1. Set application settings in Azure Portal:
```
CONGRESS_GOV_API_KEY = [your-key]
FEC_API_KEY = [your-key]
GRANTS_GOV_API_KEY = [your-key]
ASPNETCORE_ENVIRONMENT = Production
```

2. OR use Azure Key Vault with Managed Identity

### Docker

```dockerfile
ENV ASPNETCORE_ENVIRONMENT=Production
ENV CONGRESS_GOV_API_KEY=${CONGRESS_API_KEY}
ENV FEC_API_KEY=${FEC_API_KEY}
```

---

## Summary

**After Implementation:**
? No hard-coded API keys  
? Environment-specific configuration  
? Secrets management  
? Easy to switch between oracles  
? Production-ready configuration  
? Integration test support  

**Files Changed:** 8-10 files  
**Time Required:** 2-3 hours  
**Difficulty:** Medium

**Start with Steps 1-6, then update providers gradually.**

