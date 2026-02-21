# Congress.gov API - Quick Reference

## Main URL for PoliTickIt

```
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json
```

---

## Other Key URLs

```
Bills:
  https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json

Members:
  https://api.congress.gov/v3/member?api_key=YOUR_API_KEY&format=json

Votes:
  https://api.congress.gov/v3/votes/118/senate?api_key=YOUR_API_KEY&format=json
  https://api.congress.gov/v3/votes/118/house?api_key=YOUR_API_KEY&format=json

Amendments:
  https://api.congress.gov/v3/amendment?api_key=YOUR_API_KEY&format=json
```

---

## Parameters

```
?api_key=YOUR_API_KEY      - Required
&format=json               - JSON format
&limit=10                  - Results per page (default 20)
&sort=-updateDate          - Sort by most recent
&state=NY                  - Filter by state (members)
&party=D                   - Filter by party D/R/I
&chamber=Senate            - Filter by chamber
```

---

## Get Free API Key

1. Go to: https://api.congress.gov/
2. Enter email address
3. Receive key instantly in inbox

**DEMO Key:** `DEMO_KEY` (1 req/sec, 1000/day)

---

## Current Implementation

**File:** `PoliTickIt.Ingestion/Providers/CongressionalActivityProvider.cs`

Currently uses:
```
https://api.congress.gov/v3/bill?api_key=DEMO_KEY&format=json
```

Status: Returns mock data (commented out real API call)

---

## For Integration Tests

Use endpoint:
```
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json
```

Add `&limit=10` for faster testing:
```
https://api.congress.gov/v3/bill?api_key=YOUR_API_KEY&format=json&limit=10
```

---

## Rate Limits

- DEMO_KEY: 1 req/sec, 1000/day
- Production: 120 req/min, 50,000/day

---

## Documentation

Full API docs: https://github.com/LibraryOfCongress/api.congress.gov

For detailed guide, see: `CONGRESS_GOV_INTEGRATION_TEST_GUIDE.md`
