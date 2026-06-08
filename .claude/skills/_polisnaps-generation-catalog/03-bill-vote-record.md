# Category 3 — Rep Bill Vote with District Impact

**Snap Type:** `Bill Vote Record`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-event — triggered by a notable roll call vote, especially when district-level funding is at stake
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Combines a representative's specific vote (`Yea`/`Nay`/`Present`) on a bill with the concrete dollar or policy impact that vote has on their district. Unlike the generic bill position snap, this one makes the **local stakes explicit** — showing constituents what their rep's vote means for roads, jobs, healthcare, or schools in their specific district.

This is the most locally resonant accountability snap. A citizen in Louisiana District 4 seeing "$2.5B for Louisiana's 4th District" alongside their rep's "Yea" vote creates immediate, tangible accountability.

---

## Element Stack

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor — photo, name, party, location, title | Required |
| 2 | `Data.BillVote` | The vote itself — bill name + Yea/Nay/Present | Required |
| 3 | `Metric.DistrictFunding` | Dollar amount or policy impact on the specific district | Conditional (when quantifiable impact exists) |
| 4 | `Narrative.Insight.Summary` | Plain-English explanation of the bill and why the vote matters locally | Required |
| 5 | `Narrative.SentimentSummary` | Community reaction summary ("Mixed — supporters cite X, critics cite Y") | Optional |
| 6 | `Interaction.Sentiment.Pulse` | "Was this the right vote for your district?" | Conditional (`contentSignal = active`) |
| 7 | `Trust.Thread` | Source provenance — Congress.gov + House/Senate Clerk | Required |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **Congress.gov** | Bill text, vote records, policy area, bill status | `https://api.congress.gov/v3/bill/{congress}/{type}/{number}` |
| **House Clerk (clerk.house.gov)** | House roll call votes with member-by-member breakdown | `https://clerk.house.gov/evs/{YYYY}/roll{NNN}.xml` |
| **Senate.gov roll call** | Senate roll call votes | `https://www.senate.gov/legislative/LIS/roll_call_lists/` |
| **USASpending.gov** | Federal spending by district — for funding impact figures | `https://api.usaspending.gov/` |
| **CBO Cost Estimates** | Congressional Budget Office — district-level impact estimates | `https://www.cbo.gov/cost-estimates` |
| **`representatives.md`** | Bioguide ID, party, state, district | Local skill data file |

---

## Snap ID Pattern

```
snap-{billIdSlug}-{repLastName}-vote-{YYYYMMDD}
```

Examples:
- `snap-infra-johnson-vote-20260520`
- `snap-hr2616-casar-vote-20260521`

---

## Recurring Generation Procedure

### When to Generate

- A major appropriations or infrastructure bill passes (any chamber)
- A bill with clear district-level funding formula (e.g., transportation, broadband, grants) passes
- A notable rep votes against their party on a district-impact bill (vote divergence angle)

### Finding District Impact Figures

Priority order for quantifying district impact:
1. **CBO score or bill text** — explicit state/district funding formulas
2. **Congressional Research Service reports** — CRS analysis often has per-state breakdowns
3. **Bill sponsor press releases** — often contain district-level talking points
4. **USASpending.gov** — actual historical spending in the district for similar programs
5. **State/local news estimates** — acceptable if clearly attributed; mark as `verificationLevel: "Tier 2"`

If no district impact is quantifiable → omit `Metric.DistrictFunding` element; keep `Narrative.Insight.Summary` with state-level context instead.

### Stage 1 — Mine

- `mineMode: "freeform"` (mix of structured vote data + district impact research)
- `contentSignal: "active"` if vote occurred in last 7 days; else `"historical"`
- Capture: vote direction, bill title, district funding figure (if available), bill status

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- `validatedRepresentativeId`: the voting rep's bioguide
- `Header.Representative` required (rep-centric, not bill-centric)
- Include `Metric.DistrictFunding` in `suggestedElements[]` only when a real figure is found
- `sentimentEligible: true` when `contentSignal = "active"`

### Stage 3 — Generate

- Use template: `bill-vote-record.template.json` _(to be created)_ or `AUTO_GENERATE`
- `Data.BillVote.vote`: `"Yea"` / `"Nay"` / `"Present"` / `"Not Voting"` — exact from roll call
- `Metric.DistrictFunding.amount`: format as `"$2.5B"` / `"$450M"` — round to nearest significant figure
- `Narrative.SentimentSummary.sentiment`: `"Positive"` / `"Negative"` / `"Mixed"` — based on local press reaction
- `Trust.Thread.sources[]`: cite both Congress.gov bill page AND the roll call record URL

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Rep | Bill | Vote | District Impact |
|---|---|---|---|---|
| `infra-bill-vote-001` | Rep. Mike Johnson (LA-04) | American Infrastructure and Jobs Act of 2026 | Yea | $2.5B for Louisiana District 4 |

---

## Prompt Invocation

```
Generate a bill vote record PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [PARTY], [STATE/DISTRICT]
Bill: [BILL_ID] — [BILL_TITLE]
Vote: [Yea / Nay / Present / Not Voting]
Vote date: [YYYY-MM-DD]
Vote record URL: [House Clerk or Senate roll call URL]
District impact: [dollar figure or description, e.g., "$2.5B for Louisiana District 4"] (or "none quantified")
Bill summary: [2-3 sentences — what it does, why it matters to constituents]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-[billIdSlug]-[repLastName]-vote-[YYYYMMDD]
```

---

## Content Quality Rules

- **Vote direction**: Must come from the official roll call record — not from press reports
- **District impact figure**: Must be sourced (CBO, bill text, or CRS) — not estimated by the model
- **If no figure available**: Describe qualitative impact ("expands rural broadband eligibility in District 4") rather than inventing a number
- **Narrative text**: Lead with the local impact, then explain the broader bill context
- **`Narrative.SentimentSummary`**: Use real community reaction from local news if available; otherwise omit this element
