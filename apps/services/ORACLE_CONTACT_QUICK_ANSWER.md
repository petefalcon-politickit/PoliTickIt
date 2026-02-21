# Quick Answer: Oracle Contact in Tests

**Question:** What tests actually contact data oracles?

**Answer:** NONE (currently)

---

## Breakdown

### Tests in PoliTickIt.Api.Tests

| Test | Oracle Contact | Notes |
|------|---|---|
| FecProviderTests.cs | NO (?? but could) | Has HttpClient, uses mock data |
| IngestionControllerTests.cs | NO | All mock providers |
| SnapsControllerTests.cs | NO | In-memory data only |
| IngestionServiceTests.cs | NO | Mocked providers |
| InMemorySnapRepositoryTests.cs | NO | Mock snaps |
| CapabilityValidationTest.cs | NO | Test data only |

**Result: 0 out of 6 test files contact real data oracles**

---

## Data Providers Status

| Provider | Oracle Endpoint | Currently Uses | Status |
|----------|---|---|---|
| FecProvider | api.open.fec.gov | Mock data | Disabled |
| CongressionalActivityProvider | Congress.gov/GovTrack | Mock data | Disabled |
| EthicsCommitteeProvider | ethics.house.gov | Mock data | Disabled |
| GrantPulseProvider | grants.gov/sam.gov | Mock data | Disabled |

---

## Why?

**All 18 tests use MOCK DATA by design:**
- Faster execution
- No external dependencies
- Deterministic results
- Works offline
- Suitable for CI/CD
- Industry best practice

---

## Infrastructure Status

? System designed for oracle contact  
? HttpClient infrastructure available  
? Actual oracle calls are commented out  
? Tests use simulated data instead

---

## If You Want Real Oracle Testing

Create new **integration tests** (separate from unit tests):

```csharp
[Trait("Category", "Integration")]
[Fact(Skip = "Requires API Key")]
public async Task FecProvider_ContactsRealFecOracle()
{
    var provider = new FecProvider(
        new HttpClient(),
        new ContextEnrichmentProcessor()
    );
    
    var snaps = await provider.FetchLatestSnapsAsync();
    Assert.NotEmpty(snaps);
}
```

---

**Summary:** All tests currently use mock data. System is ready for oracle contact but disabled by design.
