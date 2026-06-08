# Category 7 — Legislative Status / Bill Bottleneck

**Snap Type:** `Legislative Bottleneck` / `Stagnation Sentinel`
**Feed Section:** `accountabilitySnaps`
**Schedule:** Weekly — automated sweep of tracked bills for new stalls or prolonged committee inactivity
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Alerts citizens when a bill they care about has stalled in committee — showing exactly how long it has been stuck, at what stage, and whether broad public support exists that isn't being reflected in legislative action. This is the "accountability for inaction" snap type.

Two variants serve different display contexts:

- **Legislative Bottleneck** (Sub-pattern A): Bill-centric snap with progress stepper + plain-English explanation of the stall. No rep header — the inaction is institutional, not individual.
- **Stagnation Sentinel** (Sub-pattern B): Gauge-based friction metric snap that quantifies legislative resistance mathematically. Used when district consensus data is available.

---

## Variants

### Sub-pattern A — Legislative Bottleneck

Progress stepper showing current stage, with an explicit bottleneck narrative ("stalled in Finance Committee for 45 days; bipartisan support").

**Elements:** `Metric.Progress.Stepper` → `Narrative.Insight.Summary` → `Identity.Source.Tag`

**Example:** `acc-leg-001` — S.312 Affordable Housing Act

### Sub-pattern B — Stagnation Sentinel

A friction coefficient gauge (`μf`) quantifying how much legislative resistance exists against a bill relative to district support. High `μf` + high district consensus = strong accountability signal.

**Elements:** `Universal.Gauge`

**Example:** `qa-stagnation-sentinel-001` — Sen. Schumer bill

---

## Element Stack — Sub-pattern A (Bottleneck)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Metric.Progress.Stepper` | Visual bill stage with timestamp of last action | Required |
| 2 | `Narrative.Insight.Summary` | Plain-English bottleneck explanation and district impact | Required |
| 3 | `Interaction.Sentiment.Pulse` | "Should this bill advance to a vote?" | Conditional (active bills only) |
| 4 | `Identity.Source.Tag` | Congress.gov + GovTrack data credit | Required |

Note: **No `Header.Representative`** — this snap focuses on the bill and the system, not a specific individual.

### Element Stack — Sub-pattern B (Stagnation Sentinel)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Universal.Gauge` | Friction coefficient (`μf`) with intensity label and insight text | Required |
| 2 | `Trust.Thread` (optional) | Source for district consensus figure | Conditional |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **Congress.gov** | Bill status, last action, committee referral date | `https://api.congress.gov/v3/bill/{congress}/{type}/{number}` |
| **GovTrack.us** | Committee inactivity tracking, prognosis scores | `https://www.govtrack.us/congress/bills/{congress}/{billId}` |
| **Congress.gov Committee API** | Committee assignment + hearing schedule | `https://api.congress.gov/v3/committee/{chamber}/{committeeCode}` |
| **PoliTickIt Analytics** | District consensus polling aggregation | Internal — required for Sub-pattern B |

---

## Snap ID Pattern

```
snap-bottleneck-{billIdSlug}-{YYYYMMDD}
```
```
snap-stagnation-{billIdSlug}-{YYYYMMDD}
```

Examples:
- `snap-bottleneck-s312-20260601`
- `snap-stagnation-s312-20260601`

---

## `Metric.Progress.Stepper` Structure

```typescript
{
  id: "bill-progress",
  type: "Metric.Progress.Stepper",
  data: {
    steps: ["Introduced", "Committee", "Floor Vote", "Enacted"],
    // or use full pipeline: ["Introduced", "Referred to Committee", "Committee Markup",
    //                        "Floor Vote", "Signed into Law"]
    activeStep: 1,         // 0-indexed — "Committee" = 1
    label: "[Bill ID] — [Bill Short Title]",
    statusNote: "Stalled in [COMMITTEE NAME] — [N] days without action",
    lastActionDate: "YYYY-MM-DD"
  }
}
```

---

## `Universal.Gauge` Structure (Sub-pattern B)

```typescript
{
  id: "stagnation-gauge",
  type: "Universal.Gauge",
  data: {
    value: 0.85,                    // μf friction coefficient 0–1
    label: "Legislative Friction",
    subLabel: "μf = 0.85",
    intensity: "Critical",          // "Critical" | "High" | "Medium" | "Low"
    insight: "[N] days in [committee] — [X]% district consensus",
    rippleEffect: "High"            // "High" | "Medium" | "Low"
  }
}
```

**Friction coefficient (`μf`) formula:**

```
μf = (daysStalled / maxExpectedDays) × 0.6
   + (1 - progressScore) × 0.25
   + (districtConsensus × 0.15)
```

Where:
- `daysStalled`: days since last committee action
- `maxExpectedDays`: 90 days (typical committee consideration window)
- `progressScore`: 0–1 (0 = just introduced; 1 = passed both chambers)
- `districtConsensus`: 0–1 (polling agreement score in home district)

**Intensity thresholds:**
- `μf ≥ 0.80`: Critical
- `μf 0.60–0.79`: High
- `μf 0.40–0.59`: Medium
- `μf < 0.40`: Low

---

## Recurring Generation Procedure

### Weekly Sweep Protocol

1. Load the list of "active tracked bills" (maintain in a local JSON file or session context)
2. For each tracked bill, `GET /v3/bill/` from Congress.gov → check `latestAction.actionDate`
3. Flag any bill where `daysWithoutAction ≥ 14` (two weeks without committee movement)
4. Also flag any bill where `daysWithoutAction ≥ 7` AND `GovTrack prognosis < 10%`
5. Generate bottleneck snaps for flagged bills

### Stage 1 — Mine

- `mineMode: "structured"` (Congress.gov API provides all needed data)
- Record: bill ID, committee name, days stalled, last action text
- For Sub-pattern B: query PoliTickIt Analytics for district consensus score

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- **No `validatedRepresentativeId`** — bill-centric snap (omit rep header)
- `insightType: "Legislative Bottleneck"` or `"Stagnation Sentinel"`
- `sentimentEligible: true` for active bills

### Stage 3 — Generate

- Sub-pattern A: `Metric.Progress.Stepper.statusNote` explains the specific bottleneck (which committee, days stalled)
- Sub-pattern B: calculate `μf` value; assign intensity label; write insight text combining days + district consensus
- `Narrative.Insight.Summary.text`: explain why the stall matters ("bipartisan support exists but the bill has not received a markup hearing...")
- `Identity.Source.Tag.sources[]`: `Congress.gov` + `GovTrack.us`

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Bill | Stage Stalled | Days Stalled | District Context |
|---|---|---|---|---|
| `acc-leg-001` | S.312 — Affordable Housing Act | Finance Committee | 45 days | Bipartisan sponsorship; 6 cosponsors |
| `qa-stagnation-sentinel-001` | [Sen. Schumer bill] | Committee | 124 days | 92% district consensus; μf = 0.85 |

---

## Prompt Invocation

**Sub-pattern A (Bottleneck):**

```
Generate a legislative bottleneck PoliSnap.

Bill: [BILL_ID] — [BILL_TITLE]
Current stage: [e.g., "Referred to Finance Committee"]
Committee: [COMMITTEE_NAME]
Days stalled: [N] (last action: [DATE])
Cosponsors: [N] (bipartisan: [yes/no])
Why the stall matters: [brief context — who benefits, what is blocked]

Sources:
  Congress.gov: https://congress.gov/bill/[CONGRESS]/[type]/[number]
  GovTrack: https://www.govtrack.us/congress/bills/[congress]/[billId]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-bottleneck-[billIdSlug]-[YYYYMMDD]
No Header.Representative — bill-centric snap.
```

**Sub-pattern B (Stagnation Sentinel):**

```
Generate a stagnation sentinel PoliSnap.

Bill: [BILL_ID] — [BILL_TITLE]
Days stalled in committee: [N]
District consensus: [X]% support in [REP]'s district
Progress score: [0.0–1.0 — how far through legislative pipeline]
Sponsor: [REP_NAME] ([BIOGUIDE_ID])

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Calculate μf using: (days/90 × 0.6) + ((1-progress) × 0.25) + (consensus × 0.15)
```

---

## Content Quality Rules

- **Days stalled**: Use exact `latestAction.actionDate` from Congress.gov — calculate days as of snap generation date
- **Sub-pattern A narrative**: Explain the bottleneck in plain terms — which committee, who chairs it, what the path forward would require
- **Sub-pattern B friction score**: Always show the formula components in the skill notes; `μf` is a derived metric, not a raw data point
- **No rep header** — resist the urge to assign blame to a specific rep unless an attributable statement exists
- **Prognosis threshold**: Only generate if `GovTrack prognosis < 20%` OR `daysStalled ≥ 14` — avoid generating stagnation snaps for bills in normal committee process
