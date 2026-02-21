# Congress.gov Integration Testing - Complete Answer

## Your Question: "What URL should I use to integration test the congress.gov oracle?"

---

## Quick Answer

Use this base URL for integration testing:

```
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json
```

---

## URLs for Different Queries

### Bills (What PoliTickIt Uses)
```
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json
```

### Latest Bills with Limit
```
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json&limit=10
```

### Bills from Specific Congress (118th = 2023-2024)
```
https://api.congress.gov/v3/bill/118?api_key=YOUR_API_KEY&format=json
```

### Specific Bill Details
```
https://api.congress.gov/v3/bill/118/s/1234?api_key=YOUR_API_KEY&format=json
```

### Congressional Members
```
https://api.congress.gov/v3/member?api_key=YOUR_API_KEY&format=json
```

### Senate Votes
```
https://api.congress.gov/v3/votes/118/senate?api_key=YOUR_API_KEY&format=json
```

### House Votes
```
https://api.congress.gov/v3/votes/118/house?api_key=YOUR_API_KEY&format=json
```

---

## Getting an API Key

1. **Go to:** https://api.congress.gov/
2. **Enter Email:** Your email address
3. **Get Key:** Instantly in your inbox
4. **Use DEMO_KEY:** For quick testing (limited: 1 req/sec, 1000/day)

---

## What PoliTickIt Currently Uses

**File:** `PoliTickIt.Ingestion/Providers/CongressionalActivityProvider.cs`

**Endpoint:**
```
https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json
```

**Status:** Code has bugs that need fixing (see CONGRESSIONAL_PROVIDER_FIXES_NEEDED.md)

---

## Quick Integration Test

```csharp
[Fact]
[Trait("Category", "Integration")]
public async Task TestCongressGovBillsEndpoint()
{
    // Arrange
    var httpClient = new HttpClient();
    var url = "https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json&limit=5";

    // Act
    var response = await httpClient.GetAsync(url);

    // Assert
    Assert.True(response.IsSuccessStatusCode || 
                response.StatusCode == System.Net.HttpStatusCode.TooManyRequests);
}
```

---

## Rate Limits

| Key Type | Requests/Second | Requests/Day | Best For |
|----------|---|---|---|
| DEMO_KEY | 1 | 1,000 | Testing & demos |
| Production | 120/minute | 50,000 | Integration tests |

---

## Documentation Resources

- **Official API Docs:** https://github.com/LibraryOfCongress/api.congress.gov
- **Get API Key:** https://api.congress.gov/
- **Full Guide:** See `CONGRESS_GOV_INTEGRATION_TEST_GUIDE.md`

---

## Complete Document References

This workspace now contains:

1. **CONGRESS_GOV_QUICK_REFERENCE.md** - One-page cheat sheet
2. **CONGRESS_GOV_INTEGRATION_TEST_GUIDE.md** - Comprehensive testing guide
3. **CONGRESSIONAL_PROVIDER_FIXES_NEEDED.md** - Code fixes required
4. **ORACLE_CONTACT_QUICK_ANSWER.md** - Which tests contact oracles
5. **ORACLE_CONTACT_TEST_ANALYSIS.md** - Detailed analysis
6. **TEST_ORACLE_CONTACT_DETAILED.md** - Code examples

---

## Summary

**Main URL:** `https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json`

**API Key:** Free from https://api.congress.gov/

**Parameters:** `&limit=10&sort=-updateDate&format=json`

**Rate Limit:** 1 req/sec (DEMO), 120 req/min (production)

**Status:** Ready for integration testing

