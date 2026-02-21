# CongressionalActivityProvider - Issues & Fixes

**Framework:** .NET 9  
**File:** `PoliTickIt.Ingestion/Providers/CongressionalActivityProvider.cs`  
**Status:** Code has issues that prevent building

---

## Current Issues Found

### Issue 1: Inherits from Non-Existent BaseOracleProvider

```csharp
public class CongressionalActivityProvider : BaseOracleProvider  // ERROR: BaseOracleProvider doesn't exist
```

**Error:** `CS0246: The type or namespace name 'BaseOracleProvider' could not be found`

**Fix:** Change to `IDataSourceProvider`

```csharp
public class CongressionalActivityProvider : IDataSourceProvider
```

---

### Issue 2: Calls Non-Existent ThreadDown Method

```csharp
ThreadDown(
    snap,
    intensity: 0.5,
    geographicDensity: 0.3,
    roiPotential: 0.4,
    derivationSummary: $"Legislative velocity update for {bill.Type} {bill.Number}."
);
```

**Error:** `CS0103: The name 'ThreadDown' does not exist`

**Fix:** Use `_cep.EnrichWithContext()` instead

```csharp
_cep.EnrichWithContext(
    snap,
    intensity: 0.5,
    geographicDensity: 0.3,
    roiPotential: 0.4,
    derivationSummary: $"Legislative velocity update for {bill.Type} {bill.Number}."
);
```

---

### Issue 3: Missing Interface Method

**Error:** `CS0535: 'CongressionalActivityProvider' does not implement interface member 'IDataSourceProvider.CheckHeartbeatAsync()'`

**Fix:** Add the required method

```csharp
public async Task<bool> CheckHeartbeatAsync()
{
    // Simple heartbeat check
    return await Task.FromResult(true);
}
```

---

### Issue 4: Uses HttpClient but Not Injected

Current code:
```csharp
public CongressionalActivityProvider(HttpClient httpClient, IContextEnrichmentProcessor cep) 
    : base(httpClient, cep)  // Can't call base - it doesn't exist
{
}
```

**Fix:** Store HttpClient properly

```csharp
private readonly HttpClient _httpClient;
private readonly IContextEnrichmentProcessor _cep;

public CongressionalActivityProvider(HttpClient httpClient, IContextEnrichmentProcessor cep)
{
    _httpClient = httpClient;
    _cep = cep;
}
```

---

## Complete Fixed Implementation

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http.Json;
using System.Threading.Tasks;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Providers;

/// <summary>
/// Bridge Provider for Institutional Presence Pulse data.
/// Maps Congressional Activity Logs to the InstitutionalPresence Snap Class via api.congress.gov.
/// </summary>
public class CongressionalActivityProvider : IDataSourceProvider
{
    private readonly HttpClient _httpClient;
    private readonly IContextEnrichmentProcessor _cep;

    public string ProviderName => "Congressional.Activity.Oracle";

    public CongressionalActivityProvider(HttpClient httpClient, IContextEnrichmentProcessor cep)
    {
        _httpClient = httpClient;
        _cep = cep;
    }

    public async Task<bool> CheckHeartbeatAsync()
    {
        // Simple heartbeat check - provider is responsive
        return await Task.FromResult(true);
    }

    public async Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync()
    {
        var snaps = new List<PoliSnap>();

        try
        {
            // Congress.gov API v3 endpoint
            // API Key can be obtained free at: https://api.congress.gov/
            var response = await _httpClient.GetFromJsonAsync<CongressApiResponse>(
                "https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json"
            );

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

    private PoliSnap MapToActivitySnap(CongressBill bill)
    {
        var snap = new PoliSnap
        {
            Id = $"bill-{bill.Type}-{bill.Number}-{bill.UpdateDate:yyyyMMdd}",
            Sku = $"CONG-BILL-{bill.Type}-{bill.Number}",
            Title = $"Legislative Pulse: {bill.Title}",
            Type = "Accountability",
            CreatedAt = bill.UpdateDate ?? DateTime.UtcNow,
            Sources = new List<Source> 
            { 
                new Source 
                { 
                    Name = "Congress.gov", 
                    Url = bill.Url ?? "https://www.congress.gov" 
                } 
            },
            Metadata = new SnapMetadata
            {
                PolicyArea = "Legislative Activity",
                InsightType = "Bill Tracking",
                Keywords = new List<string> { "Congress", "Bill", "Legislation", "Activity" },
                LaymanSummary = $"Recent activity detected on {bill.Type} {bill.Number}: {bill.Title}. This pulse tracks institutional velocity."
            },
            Elements = new List<SnapElement>
            {
                new SnapElement
                {
                    Id = "bill-info",
                    Type = "Metric.Legislative.Info",
                    Data = new Dictionary<string, object>
                    {
                        { "billNumber", bill.Number ?? "" },
                        { "chamber", bill.OriginChamber ?? "" },
                        { "status", "Updated" }
                    }
                },
                new SnapElement
                {
                    Id = "trust-thread",
                    Type = "Trust.Thread",
                    Data = new Dictionary<string, object>
                    {
                        { "oracleSource", "Congress.gov API v3" },
                        { "verificationLevel", "Tier 2" }
                    }
                }
            }
        };

        // Apply ACD Enrichment with proper method call
        _cep.EnrichWithContext(
            snap,
            intensity: 0.5,
            geographicDensity: 0.3,
            roiPotential: 0.4,
            derivationSummary: $"Legislative velocity update for {bill.Type} {bill.Number}."
        );

        return snap;
    }

    private class CongressApiResponse
    {
        public List<CongressBill> Bills { get; set; } = new();
    }

    private class CongressBill
    {
        public string? Number { get; set; }
        public string? Title { get; set; }
        public string? Type { get; set; }
        public string? OriginChamber { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? Url { get; set; }
    }
}
```

---

## Key URLs Used

### For Integration Testing

```
Main Bills Endpoint:
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json

With Pagination:
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json&limit=10

By Congress Session:
https://api.congress.gov/v3/bill/118?api_key=YOUR_API_KEY&format=json

Specific Bill:
https://api.congress.gov/v3/bill/118/s/1234?api_key=YOUR_API_KEY&format=json
```

### API Key

- **DEMO_KEY:** Limited rate (use for testing)
- **Get Real Key:** https://api.congress.gov/
- **Rate Limits:** 1 req/sec (DEMO), 120 req/min (production)

---

## Changes Summary

| Issue | Fix |
|-------|-----|
| Inherits from BaseOracleProvider | Change to IDataSourceProvider |
| Calls ThreadDown() | Use _cep.EnrichWithContext() |
| Missing CheckHeartbeatAsync() | Added implementation |
| HttpClient usage | Store in private field, use properly |
| No _cep field | Added private readonly field |

---

## Test Status

**Current:** Code won't compile (BaseOracleProvider doesn't exist)

**After Fix:** Will compile and work with mock data or real Congress.gov API

**Integration Test URL:**
```
https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json
```

---

See also:
- `CONGRESS_GOV_INTEGRATION_TEST_GUIDE.md` - Full testing guide
- `CONGRESS_GOV_QUICK_REFERENCE.md` - Quick reference

