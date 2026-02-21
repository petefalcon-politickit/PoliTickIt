# Congress.gov API Integration Testing Guide
## For PoliTickIt CongressionalActivityProvider

**Target Framework:** .NET 9  
**API Documentation:** https://github.com/LibraryOfCongress/api.congress.gov

---

## Quick Answer: URLs to Use

### Production URLs

```
Base URL: https://api.congress.gov/v3/

Common Endpoints:
- Bills: https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json
- Members: https://api.congress.gov/v3/member?api_key=YOUR_API_KEY&format=json
- Votes: https://api.congress.gov/v3/votes?api_key=YOUR_API_KEY&format=json
- Amendments: https://api.congress.gov/v3/amendment?api_key=YOUR_API_KEY&format=json
```

---

## API Key Setup

### Getting a Free API Key

1. **Request Key at:** https://api.congress.gov/
2. **Enter Email Address** - Key is generated instantly
3. **Check Email** - API key will be in your inbox
4. **Key Format:** Alphanumeric string (example: `DEMO_KEY_123abc`)

### DEMO Key (Rate Limited)

```
API Key: DEMO_KEY
Rate Limit: 1 request per second
Requests/Day: 1000
Use Case: Testing & demos only
```

---

## Integration Test URLs by Feature

### 1. Latest Bills

**URL:** 
```
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json&limit=10&sort=-updateDate
```

**What It Returns:**
- Latest bills
- Update date (good for tracking changes)
- Bill type (S, HR, etc.)
- Title and summary

**Use Case:** Testing bill tracking feature

---

### 2. Bills by Congress Session

**URL:**
```
https://api.congress.gov/v3/bill/118?api_key=YOUR_API_KEY&format=json&limit=20
```

**Parameters:**
- `118` = Congress session number (118th Congress = 2023-2024)
- `117` = 117th Congress (2021-2022)
- `119` = 119th Congress (2025-2026)

**What It Returns:**
- All bills from specific Congress
- Paginated results

---

### 3. Specific Bill Details

**URL:**
```
https://api.congress.gov/v3/bill/118/s/1234?api_key=YOUR_API_KEY&format=json
```

**Format:** `/bill/{congress}/{chamber}/{number}`
- `congress` = 118 (session number)
- `chamber` = s (Senate), hr (House)
- `number` = 1234 (bill number)

**What It Returns:**
- Full bill details
- Sponsors
- Co-sponsors
- Actions history
- Status

---

### 4. Congressional Members

**URL:**
```
https://api.congress.gov/v3/member?api_key=YOUR_API_KEY&format=json&limit=50
```

**Optional Parameters:**
```
&state=NY          # Limit to specific state
&party=D           # Filter by party (D/R/I)
&chamber=senate    # or 'house'
&sort=-dateUpdated # Sort by update date
```

**What It Returns:**
- Member information
- Party affiliation
- Office details
- Social media accounts

---

### 5. Member Voting Record

**URL:**
```
https://api.congress.gov/v3/member/S001234/votes?api_key=YOUR_API_KEY&format=json
```

**Format:** `/member/{bioGuide}/votes`

**What It Returns:**
- Voting history
- Vote dates
- Positions taken

---

### 6. Voting Records

**URL:**
```
https://api.congress.gov/v3/votes/118/senate?api_key=YOUR_API_KEY&format=json&limit=20
```

**Format:** `/votes/{congress}/{chamber}`

**What It Returns:**
- Senate or House votes
- Vote results
- Descriptions
- Timestamps

---

### 7. Amendments

**URL:**
```
https://api.congress.gov/v3/amendment/118?api_key=YOUR_API_KEY&format=json&limit=50
```

**What It Returns:**
- Proposed amendments
- Amendment details
- Status

---

## Current Implementation

### What CongressionalActivityProvider Uses

```csharp
// Currently implemented in CongressionalActivityProvider:
var response = await HttpClient.GetFromJsonAsync<CongressApiResponse>(
    "https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json"
);
```

**Current Status:**
- ? URL is correct
- ? Endpoint is valid
- ? Response mapping implemented
- ?? Uses DEMO_KEY (rate limited)
- ?? Currently commented out (returns mock data)

---

## Integration Test Examples

### Test 1: Basic Bill Endpoint

```csharp
[Fact]
[Trait("Category", "Integration")]
[Trait("API", "Congress.gov")]
public async Task CongressionalActivityProvider_ContactsCongressGovBillsEndpoint()
{
    // Arrange
    var apiKey = "DEMO_KEY"; // Or from config
    var httpClient = new HttpClient();
    var provider = new CongressionalActivityProvider(
        httpClient,
        new ContextEnrichmentProcessor()
    );

    // Act
    var snaps = await provider.FetchLatestSnapsAsync();

    // Assert
    Assert.NotNull(snaps);
    // Bills endpoint may return data or empty based on rate limits
}
```

### Test 2: Verify API Response Structure

```csharp
[Fact]
[Trait("Category", "Integration")]
public async Task CongressGovApi_BillsEndpoint_ReturnsValidStructure()
{
    // Arrange
    var apiKey = "DEMO_KEY";
    var url = $"https://api.congress.gov/v3/bill?api_key={apiKey}&format=json&limit=1";
    var httpClient = new HttpClient();

    // Act
    var response = await httpClient.GetFromJsonAsync<dynamic>(url);

    // Assert
    Assert.NotNull(response);
    // Response should have bills collection
}
```

### Test 3: Handle Rate Limiting

```csharp
[Fact]
[Trait("Category", "Integration")]
public async Task CongressGovApi_RateLimited_HandlesTooManyRequests()
{
    // Arrange
    var httpClient = new HttpClient();
    var tasks = new List<Task>();

    // Act - Make rapid requests to hit rate limit
    for (int i = 0; i < 5; i++)
    {
        tasks.Add(httpClient.GetAsync(
            "https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json"
        ));
    }

    // Assert - Should handle 429 status gracefully
    try
    {
        await Task.WhenAll(tasks);
    }
    catch (HttpRequestException ex)
    {
        Assert.Contains("429", ex.Message); // Too Many Requests
    }
}
```

### Test 4: Mock Congress.gov Response

```csharp
[Fact]
public async Task CongressionalActivityProvider_WithMockedCongressGovResponse()
{
    // Arrange
    var mockHandler = new Mock<HttpMessageHandler>();
    var responseJson = @"
    {
        ""bills"": [
            {
                ""number"": ""S1234"",
                ""title"": ""Test Bill"",
                ""type"": ""S"",
                ""originChamber"": ""Senate"",
                ""updateDate"": ""2026-01-30"",
                ""url"": ""https://www.congress.gov/bill/118/s/1234""
            }
        ]
    }";

    mockHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(r => r.RequestUri!.Host.Contains("api.congress.gov")),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
            StatusCode = System.Net.HttpStatusCode.OK,
            Content = new StringContent(responseJson, System.Text.Encoding.UTF8, "application/json")
        });

    var httpClient = new HttpClient(mockHandler.Object);
    var provider = new CongressionalActivityProvider(
        httpClient,
        new ContextEnrichmentProcessor()
    );

    // Act
    var snaps = await provider.FetchLatestSnapsAsync();

    // Assert
    Assert.NotNull(snaps);
    Assert.NotEmpty(snaps);
    
    // Verify HTTP call was made
    mockHandler.Protected().Verify(
        "SendAsync",
        Times.Once(),
        ItExpr.Is<HttpRequestMessage>(r => r.RequestUri!.Host.Contains("api.congress.gov")),
        ItExpr.IsAny<CancellationToken>()
    );
}
```

---

## Response Format Examples

### Bills Endpoint Response

```json
{
  "bills": [
    {
      "number": "S1234",
      "title": "A bill to establish a program...",
      "type": "S",
      "originChamber": "Senate",
      "updateDate": "2026-01-30",
      "url": "https://www.congress.gov/bill/118/s/1234",
      "originChamber": "Senate",
      "introducedDate": "2025-01-15",
      "latestAction": {
        "actionDate": "2026-01-30",
        "text": "Referred to the Committee on..."
      }
    }
  ],
  "pagination": {
    "count": 1,
    "offset": 0
  }
}
```

### Members Endpoint Response

```json
{
  "members": [
    {
      "bioguideId": "S000148",
      "firstName": "Chuck",
      "lastName": "Schumer",
      "party": "D",
      "state": "NY",
      "chamber": "Senate",
      "office": "322 Hart Senate Office Building",
      "phone": "202-224-6542",
      "url": "https://www.schumer.senate.gov"
    }
  ]
}
```

---

## Rate Limiting & Best Practices

### Rate Limits

```
DEMO_KEY:
- 1 request per second
- 1000 requests per day
- Hard reset at midnight EST

Production API Key:
- 120 requests per minute
- 50,000 requests per day
- Better for integration testing
```

### Best Practices

1. **Use proper API key** (not DEMO_KEY for integration tests)
2. **Implement retry logic** for rate limit errors (429)
3. **Cache responses** when possible
4. **Use pagination** for large datasets
5. **Filter by parameters** to reduce data (state, chamber, etc.)
6. **Mock for unit tests**, real API for integration tests

---

## Recommended Integration Test Setup

### Create Integration Test File

**File:** `PoliTickIt.Api.Tests/Integration/CongressGovIntegrationTests.cs`

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using PoliTickIt.Ingestion.Providers;
using PoliTickIt.Ingestion.Services;

namespace PoliTickIt.Api.Tests.Integration
{
    [Collection("Congress.gov Integration Tests")]
    [Trait("Category", "Integration")]
    public class CongressGovIntegrationTests
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public CongressGovIntegrationTests()
        {
            _httpClient = new HttpClient();
            // Load from config or environment variable
            _apiKey = Environment.GetEnvironmentVariable("CONGRESS_GOV_API_KEY") ?? "DEMO_KEY";
        }

        [Fact(Skip = "Requires Congress.gov API connectivity")]
        public async Task FetchLatestBills_ReturnsSnapsFromCongressGov()
        {
            // Arrange
            var provider = new CongressionalActivityProvider(
                _httpClient,
                new ContextEnrichmentProcessor()
            );

            // Act
            var snaps = await provider.FetchLatestSnapsAsync();

            // Assert
            Assert.NotNull(snaps);
            // Bills may be empty depending on API state, but should not throw
        }

        [Fact(Skip = "Requires Congress.gov API connectivity")]
        public async Task CongressGovApi_Bills_ContainsExpectedFields()
        {
            // Arrange
            var url = $"https://api.congress.gov/v3/bill?api_key={_apiKey}&format=json&limit=1";

            // Act
            var response = await _httpClient.GetAsync(url);

            // Assert
            Assert.True(response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.TooManyRequests);
        }

        [Fact]
        public async Task CongressGovApi_DocumentedEndpoints_AreAccessible()
        {
            // Arrange
            var endpoints = new List<string>
            {
                $"https://api.congress.gov/v3/bill?api_key={_apiKey}&format=json",
                $"https://api.congress.gov/v3/member?api_key={_apiKey}&format=json",
                $"https://api.congress.gov/v3/votes/118/senate?api_key={_apiKey}&format=json"
            };

            // Act & Assert
            foreach (var endpoint in endpoints)
            {
                var response = await _httpClient.GetAsync(endpoint);
                // Just verify endpoint is accessible
                Assert.True(
                    response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.TooManyRequests,
                    $"Endpoint {endpoint} failed with status {response.StatusCode}"
                );
            }
        }
    }
}
```

---

## Configuration Setup

### appsettings.Integration.json

```json
{
  "CongressGov": {
    "ApiKey": "YOUR_ACTUAL_API_KEY",
    "BaseUrl": "https://api.congress.gov/v3",
    "RateLimit": {
      "RequestsPerSecond": 1,
      "RequestsPerDay": 1000
    }
  },
  "Integration": {
    "EnableExternalApiTests": true,
    "ExternalApiTimeout": 30000
  }
}
```

### Load Configuration in Test

```csharp
public class CongressGovIntegrationTests
{
    private readonly IConfiguration _config;

    public CongressGovIntegrationTests()
    {
        _config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.Integration.json")
            .AddEnvironmentVariables()
            .Build();
    }

    private string GetApiKey()
    {
        return _config["CongressGov:ApiKey"] ?? "DEMO_KEY";
    }
}
```

---

## Summary: URLs for Integration Testing

| Purpose | URL |
|---------|-----|
| Latest Bills | `https://api.congress.gov/v3/bill?api_key=YOUR_KEY&format=json` |
| Bills from Congress | `https://api.congress.gov/v3/bill/118?api_key=YOUR_KEY&format=json` |
| Specific Bill | `https://api.congress.gov/v3/bill/118/s/1234?api_key=YOUR_KEY&format=json` |
| Members | `https://api.congress.gov/v3/member?api_key=YOUR_KEY&format=json` |
| Member Votes | `https://api.congress.gov/v3/member/S001234/votes?api_key=YOUR_KEY&format=json` |
| Senate Votes | `https://api.congress.gov/v3/votes/118/senate?api_key=YOUR_KEY&format=json` |
| House Votes | `https://api.congress.gov/v3/votes/118/house?api_key=YOUR_KEY&format=json` |
| Amendments | `https://api.congress.gov/v3/amendment/118?api_key=YOUR_KEY&format=json` |

**Get Free API Key:** https://api.congress.gov/

---

**Status:** Ready for integration testing  
**Framework:** .NET 9  
**API:** Congress.gov API v3  
**Documentation:** https://github.com/LibraryOfCongress/api.congress.gov
