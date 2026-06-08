# PoliSnap Jurisdiction Reference

**Owner:** `polisnap-normalizer`
**Used by:** All skills — jurisdiction context determines ID format, source APIs, and valid policy areas.
**Future:** FIPS lookups and district boundary data to be served via MCP tool integration.

---

## Jurisdiction Level Taxonomy

PoliTickIt covers civic activity across five levels. Each level has its own ID convention, source API, and policy area vocabulary.

| Level | `jurisdictionLevel` value | Examples | Status |
|---|---|---|---|
| Federal | `federal` | POTUS, SCOTUS, U.S. Senate, U.S. House | ✅ Active |
| State | `state` | Governor, State Senate, State House, State AG | 🔜 Upcoming |
| County | `county` | County Commission, County Executive, County AG | 🔜 Upcoming |
| City / Municipality | `city` | Mayor, City Council, City AG | 🔜 Upcoming |
| School District | `school-district` | Superintendent, School Board | 🔜 Upcoming |

---

## ID Conventions by Level

### Federal (`federal`)
| Role type | ID format | Source |
|---|---|---|
| Congress member (House or Senate) | Bioguide ID (e.g., `T000250`) | bioguide.congress.gov |
| President | `POTUS-{LastName}` (e.g., `POTUS-BIDEN`) | Custom — register in representatives.md |
| Supreme Court Justice | `SCOTUS-{LastName}` (e.g., `SCOTUS-ROBERTS`) | Custom — register in representatives.md |
| Vice President | `VPOTUS-{LastName}` | Custom — register in representatives.md |

### State (`state`)
| Role type | ID format | Source |
|---|---|---|
| Governor | `{STATE_FIPS}-GOV` (e.g., `48-GOV` for Texas) | FIPS state codes |
| Lt. Governor | `{STATE_FIPS}-LTGOV` | FIPS state codes |
| State Senator | `{STATE_FIPS}-SSEN-{DistrictNumber}` (e.g., `48-SSEN-21`) | State legislature |
| State Representative | `{STATE_FIPS}-SREP-{DistrictNumber}` | State legislature |
| State Attorney General | `{STATE_FIPS}-AG` | State AG office |
| State Treasurer | `{STATE_FIPS}-TRES` | State office |

### County (`county`)
| Role type | ID format | Source |
|---|---|---|
| County Commissioner | `{COUNTY_FIPS}-COM-{DistrictNumber}` (e.g., `48453-COM-2`) | FIPS county codes |
| County Executive | `{COUNTY_FIPS}-EXEC` | County office |
| County Judge | `{COUNTY_FIPS}-JUDGE` | County office |

### City / Municipality (`city`)
| Role type | ID format | Source |
|---|---|---|
| Mayor | `{COUNTY_FIPS}-{CitySlug}-MAYOR` (e.g., `48453-austin-MAYOR`) | City official website |
| City Council | `{COUNTY_FIPS}-{CitySlug}-CC-{DistrictNumber}` | City official website |
| City Attorney | `{COUNTY_FIPS}-{CitySlug}-ATY` | City official website |

### School District (`school-district`)
| Role type | ID format | Source |
|---|---|---|
| Superintendent | `{NCES_ID}-SUPT` (e.g., `4813560-SUPT`) | NCES district ID |
| School Board Member | `{NCES_ID}-SB-{DistrictNumber}` | NCES / local district |

> **NCES District ID lookup:** https://nces.ed.gov/ccd/schoolsearch/

---

## FIPS Reference

FIPS codes are standardized geographic identifiers used for state and county IDs.

- **State FIPS:** 2-digit numeric code (e.g., `06` = California, `48` = Texas, `36` = New York)
- **County FIPS:** 5-digit code = State FIPS (2) + County (3) (e.g., `48453` = Travis County, TX)

**Quick FIPS lookup:** https://www.census.gov/library/reference/code-lists/ansi/ansi-codes-for-states.html

### Common State FIPS Codes

| State | FIPS |
|---|---|
| Alabama | `01` |
| Alaska | `02` |
| Arizona | `04` |
| Arkansas | `05` |
| California | `06` |
| Colorado | `08` |
| Florida | `12` |
| Georgia | `13` |
| Illinois | `17` |
| New York | `36` |
| Texas | `48` |
| Virginia | `51` |
| Washington | `53` |

> Full table: https://www.census.gov/library/reference/code-lists/ansi/ansi-codes-for-states.html

---

## Source APIs by Jurisdiction Level

| Level | Primary data source | API / URL |
|---|---|---|
| Federal (legislative) | Congress.gov v3 | See `congress-api.md` |
| Federal (executive) | WhiteHouse.gov, Federal Register | https://api.federalregister.gov/v1/ |
| Federal (judicial) | CourtListener / Free Law Project | https://www.courtlistener.com/api/ |
| State (legislative) | OpenStates API | https://v3.openstates.org/ |
| State (executive) | Governor press release feeds (.gov) | State-specific |
| County / City | Legistar (council meetings) | https://webapi.legistar.com/ |
| School District | NCES / local district public portals | https://nces.ed.gov/ccd/ |

> **Note:** All non-federal APIs are planned integrations. The normalizer currently handles Federal data only (congress-api.md). Future iterations will add OpenStates and Legistar MCP tool integrations.

---

## Snap Jurisdiction Metadata

Every PoliSnap carries jurisdiction metadata. The normalizer sets these fields:

```json
{
  "metadata": {
    "jurisdictionLevel": "federal",
    "jurisdictionScope": "national",
    "stateFips": null,
    "countyFips": null,
    "citySlug": null,
    "ncesId": null,
    "policyArea": "Environmental Protection"
  }
}
```

| Field | Required at | Description |
|---|---|---|
| `jurisdictionLevel` | All levels | One of: `federal`, `state`, `county`, `city`, `school-district` |
| `jurisdictionScope` | All levels | `national` / `{state-abbr}` / `{county-name}` / `{city-name}` |
| `stateFips` | State and below | 2-digit FIPS code string (e.g., `"48"`) |
| `countyFips` | County and below | 5-digit FIPS code string (e.g., `"48453"`) |
| `citySlug` | City and school | kebab-case city name (e.g., `"austin"`) |
| `ncesId` | School district | NCES district ID string |

---

## Adding a New Jurisdiction Scope

When the miner produces content from a new jurisdiction not yet registered:

1. Confirm the FIPS code (state/county) or NCES ID (school district).
2. Register the official(s) in `representatives.md` using the ID convention above.
3. Add any jurisdiction-specific policy area labels to `policy-areas.md` (State/Local sections).
4. Record the jurisdiction's primary source URL in this file (Source APIs table or a new row).
5. Emit `NEW_JURISDICTION` in the spawn's `warnings[]` so the normalizer flags it for review.
