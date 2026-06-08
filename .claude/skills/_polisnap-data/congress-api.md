# Congress.gov API Reference

**Owner:** `polisnap-normalizer`
**Used by:** Normalizer only — for cross-referencing bill numbers, vote IDs, and legislative status.
**Jurisdiction scope:** `federal` only. For state legislative cross-reference, see OpenStates API (planned — `jurisdictions.md`). For county/city, see Legistar API (planned — `jurisdictions.md`).
**Future:** This file will be replaced by a live MCP tool integration with the Congress.gov v3 API.

---

## API Base URL

```
https://api.congress.gov/v3
```

**Authentication:** Requires `api_key` query parameter. Key is managed by the PoliTickIt platform configuration.

**Rate limit:** 5,000 requests per hour (free tier).

---

## Key Endpoints

### Bill Lookup

```
GET /bill/{congress}/{billType}/{billNumber}
```

| Parameter | Description | Example |
|---|---|---|
| `congress` | Congress number | `119` |
| `billType` | Bill type (case-insensitive) | `s`, `hr`, `sres`, `hres`, `sjres`, `hjres` |
| `billNumber` | Numeric bill number | `45` |

**Example:** `GET /bill/119/sres/45?api_key={key}`

**Key response fields:**
```json
{
  "bill": {
    "number": "45",
    "title": "A resolution to...",
    "type": "SRES",
    "introducedDate": "2026-01-25",
    "latestAction": {
      "actionDate": "2026-02-10",
      "text": "Referred to the Committee on..."
    },
    "sponsors": [{ "bioguideId": "T000250", "fullName": "Sen. John Thune" }],
    "policyArea": { "name": "Public Lands and Natural Resources" },
    "congress": "119"
  }
}
```

---

### Vote Lookup (Senate)

```
GET /senate/sessions/{congress}/{session}/votes/{rollCallNumber}
```

**Key response fields:** `question`, `result`, `yeas`, `nays`, `notVoting`, `date`

---

### Vote Lookup (House)

```
GET /house/members/votes
```

Filter by `bioguideId` and `startDate`/`endDate`.

---

### Member Lookup

```
GET /member/{bioguideId}
```

**Key response fields:** `name`, `party`, `state`, `district`, `terms`, `officialWebsiteUrl`

---

### Bills by Member

```
GET /member/{bioguideId}/sponsored-legislation
```

---

### Committee Hearings

```
GET /committee-meeting/{congress}
```

Filter by `chamberCode` (`S`=Senate, `H`=House) and `startDate`.

---

## Bill Number Format

When parsing bill references from spawn content, normalize to this format before API lookup:

| Raw text | Normalized | API billType | API billNumber |
|---|---|---|---|
| `S. Res. 45` | `S.Res.45` | `sres` | `45` |
| `H.R. 1192` | `H.R.1192` | `hr` | `1192` |
| `S. 2341` | `S.2341` | `s` | `2341` |
| `H. Res. 88` | `H.Res.88` | `hres` | `88` |
| `S.J. Res. 12` | `S.J.Res.12` | `sjres` | `12` |
| `H.J. Res. 55` | `H.J.Res.55` | `hjres` | `55` |

---

## Congress Number Lookup

| Year | Congress Number |
|---|---|
| 2025–2026 | 119th (`119`) |
| 2023–2024 | 118th (`118`) |
| 2021–2022 | 117th (`117`) |

---

## Error Handling

| HTTP Status | Meaning | Normalizer action |
|---|---|---|
| `200` | Success | Use response data |
| `404` | Bill/member not found | Emit `BILL_NOT_FOUND` warning. Continue. |
| `429` | Rate limited | Note in warning. Use spawn rawTitle as fallback. |
| `400` | Bad request (malformed bill number) | Re-parse bill reference. Try again once. |

---

## Current Session Notes (119th Congress, 2025–2026)

- Congress opened January 3, 2025
- Session 1: 2025
- Session 2: 2026
- Use `congress=119` for all current legislation
