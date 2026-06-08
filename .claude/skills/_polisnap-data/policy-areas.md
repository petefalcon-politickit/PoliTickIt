# PoliSnap Policy Areas Reference

**Owner:** `polisnap-normalizer`
**Used by:** Normalizer only — no other skill validates policy areas directly.
**Jurisdiction scope:** Federal labels are authoritative (Congress.gov taxonomy). State and Local labels are PoliTickIt-defined extensions.
**Future:** Federal labels will be replaced by a live Congress.gov taxonomy API call (MCP tool). State/Local labels will be drawn from OpenStates and Legistar taxonomies.

---

## Federal Policy Area Labels

Source: Congress.gov subject taxonomy (119th Congress). Labels must match **exactly** (case-sensitive). Using any other value causes the policy-area filter to silently hide the snap.

**Applicable at:** `jurisdictionLevel: "federal"`

| Label |
|---|
| `Agriculture and Food` |
| `Animals` |
| `Armed Forces and National Security` |
| `Arts, Culture, Religion` |
| `Civil Rights and Liberties, Minority Issues` |
| `Commerce` |
| `Congress` |
| `Crime and Law Enforcement` |
| `Economics and Public Finance` |
| `Education` |
| `Emergency Management` |
| `Energy` |
| `Environmental Protection` |
| `Families` |
| `Finance and Financial Sector` |
| `Foreign Trade and International Finance` |
| `Government Operations and Politics` |
| `Health` |
| `Housing and Community Development` |
| `Immigration` |
| `International Affairs` |
| `Labor and Employment` |
| `Law` |
| `Native Americans` |
| `Public Lands and Natural Resources` |
| `Science, Technology, Communications` |
| `Social Welfare` |
| `Sports and Recreation` |
| `Taxation` |
| `Transportation and Public Works` |
| `Water Resources Development` |
| `Veterans` |
| `Small Business` |
| `Cybersecurity` |
| `Accountability` |
| `Strategic Intelligence` |
| `Trends` |
| `Ethics` |

---

## Common Alias Resolutions

Apply these silently during normalization. Do not emit a warning for aliases — just resolve and continue.

| User / spawn phrase | Resolved label |
|---|---|
| "Infrastructure" | `Transportation and Public Works` |
| "Gun Control", "Gun Violence" | `Crime and Law Enforcement` |
| "Climate", "Climate Change" | `Environmental Protection` |
| "Defense", "Military" | `Armed Forces and National Security` |
| "Social Security", "Medicare", "Medicaid" | `Social Welfare` |
| "Immigration Reform" | `Immigration` |
| "Taxes", "Tax Reform" | `Taxation` |
| "Economy", "GDP" | `Economics and Public Finance` |
| "Healthcare", "ACA" | `Health` |
| "Land", "National Parks", "Drilling", "ANWR" | `Public Lands and Natural Resources` |
| "Tech", "AI", "Internet" | `Science, Technology, Communications` |
| "Trade", "Tariffs" | `Foreign Trade and International Finance` |
| "Campaign Finance", "FEC", "Donors" | `Finance and Financial Sector` |
| "Foreign Policy" | `International Affairs` |
| "Voting Rights", "Civil Rights" | `Civil Rights and Liberties, Minority Issues` |

---

## State Policy Area Labels

**Applicable at:** `jurisdictionLevel: "state"`

These labels are PoliTickIt-defined and align with OpenStates subject taxonomy. They are used for state legislative activity that does not map cleanly to the federal taxonomy.

| Label | Notes |
|---|---|
| `State Budget and Appropriations` | Annual state budget cycles, state spending bills |
| `State Education Policy` | K-12 curriculum, state board of education rules |
| `State Healthcare` | Medicaid expansion, state insurance regulations |
| `State Criminal Justice` | State sentencing, corrections, parole policy |
| `State Elections` | Voter ID, redistricting, ballot access |
| `State Infrastructure` | State roads, bridges, water systems |
| `State Taxation` | State income, property, and sales tax |
| `State Environment` | State EPA rules, water rights, state parks |
| `State Labor` | Minimum wage, workers' comp, unions |
| `State Housing` | Zoning, affordable housing, tenant rights |
| `State Immigration` | State-level enforcement, sanctuary policies |
| `State Economic Development` | Business incentives, state enterprise zones |
| `State Ethics` | State legislator conduct, lobbying disclosure |

### State Alias Resolutions

| Spawn phrase | Resolved label |
|---|---|
| "State budget", "State spending" | `State Budget and Appropriations` |
| "K-12", "School curriculum" | `State Education Policy` |
| "Redistricting", "Gerrymandering" | `State Elections` |
| "State minimum wage" | `State Labor` |
| "State zoning", "HOA" | `State Housing` |

---

## County / City Policy Area Labels

**Applicable at:** `jurisdictionLevel: "county"` or `"city"`

| Label | Notes |
|---|---|
| `Local Budget` | City / county annual budget and tax rates |
| `Local Public Safety` | Police, fire, EMS policy |
| `Local Zoning and Land Use` | Building permits, development approvals |
| `Local Transportation` | Roads, transit, bike infrastructure |
| `Local Parks and Recreation` | Park funding, recreation programs |
| `Local Housing` | Affordable housing ordinances, shelter funding |
| `Local Education` | City-level school partnerships, city college |
| `Local Environment` | City recycling, stormwater, urban green space |
| `Local Business` | Business licensing, local economic programs |
| `Local Ethics` | City council conduct, council financial disclosure |

### County / City Alias Resolutions

| Spawn phrase | Resolved label |
|---|---|
| "City budget", "County budget" | `Local Budget` |
| "Police reform", "City police" | `Local Public Safety` |
| "Zoning", "Development approval" | `Local Zoning and Land Use` |
| "Bus lines", "Light rail", "Bike lanes" | `Local Transportation` |

---

## School District Policy Area Labels

**Applicable at:** `jurisdictionLevel: "school-district"`

| Label | Notes |
|---|---|
| `School District Budget` | District budget, bond elections, tax rates |
| `Curriculum and Standards` | Course offerings, state standard adoption |
| `School Safety` | Campus security, crisis response |
| `Student Services` | Special education, counseling, lunch programs |
| `Teacher and Staff Policy` | Hiring, tenure, compensation |
| `Facilities` | School construction, maintenance, closures |
| `School Board Governance` | Board elections, open meetings, ethics |

### School District Alias Resolutions

| Spawn phrase | Resolved label |
|---|---|
| "School bond", "School tax" | `School District Budget` |
| "Curriculum ban", "Book ban" | `Curriculum and Standards` |
| "School shooting", "Campus safety" | `School Safety` |
| "IEP", "Special ed" | `Student Services` |
