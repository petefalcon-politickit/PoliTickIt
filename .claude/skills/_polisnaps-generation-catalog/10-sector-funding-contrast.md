# Category 10 — Sector / Funding Contrast

**Snap Type:** `Sector Funding Contrast`
**Feed Section:** `accountabilitySnaps`
**Schedule:** Quarterly (after FEC filing deadlines) or post-election cycle
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Directly compares two representatives' campaign funding sources side by side, highlighting how their donor sector concentrations differ. This is the most visually striking accountability snap — placing two reps from the same state, chamber, or committee next to each other to reveal structural differences in who funds them.

Where the Campaign Finance Audit (Category 5) is a deep-dive on a single rep, the Sector Contrast snap uses comparison to create context: *"Your two senators are funded very differently — here's what that might mean for legislation."*

---

## Variants

### Variant A — Two-Rep Same State/Chamber Contrast

Side-by-side comparison of two reps from the same state or serving the same constituents but funded by different industries.

**Example:** `acc-industry-contrast-001` — Sen. Jenkins ($8.2M Tech) vs Sen. Miller ($1.4M Agri), California

### Variant B — Single Rep Cycle-Over-Cycle Comparison

Same rep compared across two election cycles — showing how their donor base has shifted.

**Example:** _(no production example yet)_ — "Sen. Smith received $1.2M from pharma in 2022; $3.8M in 2026"

---

## Element Stack

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Metric.Dual.Comparison` | Total funding comparison — two reps or two cycles, top-line amounts | Required |
| 2 | `Visual.Chart.Bar` | Per-sector breakdown (3–5 industries side by side) | Required |
| 3 | `Interaction.Sentiment.Pulse` | "Which senator's funding alignment do you support?" or policy question | Conditional |
| 4 | `Identity.Source.Tag` | Source: FEC.gov + OpenSecrets | Required |

Note: **No `Header.Representative`** — this snap is inherently comparative; neither rep is primary subject.

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **FEC.gov** | Total receipts, PAC vs. individual breakdown per candidate | `https://api.open.fec.gov/v1/candidates/?state={ST}&chamber={ch}` |
| **OpenSecrets.org** | Industry aggregation for each rep | `https://www.opensecrets.org/politicians/summary.php?cid={ID}` |

---

## Snap ID Pattern

```
snap-contrast-{repLastName1}-vs-{repLastName2}-{YYYY}
```
Or for single rep cycle comparison:
```
snap-contrast-{repLastName}-{YYYY1}-vs-{YYYY2}
```

Examples:
- `snap-contrast-jenkins-vs-miller-2026`
- `snap-contrast-smith-2022-vs-2026`

---

## `Metric.Dual.Comparison` Structure

```typescript
{
  id: "funding-compare",
  type: "Metric.Dual.Comparison",
  data: {
    leftLabel: "Sen. [NAME] — [Primary Sector]",
    leftValue: "$8.2M",
    rightLabel: "Sen. [NAME] — [Primary Sector]",
    rightValue: "$1.4M",
    leftColor: "#2196F3",       // blue
    rightColor: "#FF9800",      // orange
    insight: "[Plain-English contrast: 'A $6.8M gap — tech vs. agriculture prioritization']"
  }
}
```

## `Visual.Chart.Bar` Structure (Sector Comparison)

```typescript
{
  id: "sector-chart",
  type: "Visual.Chart.Bar",
  data: {
    title: "Sector Funding Breakdown — [YEAR] Cycle",
    xAxis: "Sector",
    yAxis: "Total Contributions ($M)",
    series: [
      { label: "Sen. [NAME1]", color: "#2196F3" },
      { label: "Sen. [NAME2]", color: "#FF9800" }
    ],
    bars: [
      { category: "Technology",    values: [5.2, 0.1] },
      { category: "Agriculture",   values: [0.3, 0.9] },
      { category: "Healthcare",    values: [1.8, 0.3] },
      // 3–5 sectors maximum
    ]
  }
}
```

**Sector selection guidance:**
- Choose sectors where the contrast is most pronounced (largest absolute or relative difference)
- Maximum 5 sectors; minimum 3
- Use consistent sector labels across snaps (align with OpenSecrets industry categories)

---

## Recurring Generation Procedure

### When to Generate

- Quarterly FEC deadlines pass — pull updated totals for both reps
- Pre-election cycle: contrast snaps are especially high-value when constituents are evaluating candidates
- When both reps are about to vote on legislation that affects one of the contrasted sectors

### Stage 1 — Mine

- `mineMode: "freeform"` (pull from FEC API + OpenSecrets for both reps)
- Collect per-rep: total cycle receipts, top 5 industry categories with amounts
- Identify: the dominant sectors for each rep; the largest differential sectors

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- **No single `validatedRepresentativeId`** — both reps in `additionalRepIds[]`
- `insightType: "Sector Funding Contrast"`
- `copyrightFlag: "public-domain"`
- `sentimentEligible: true` when contrasting current-cycle senators

### Stage 3 — Generate

- `Metric.Dual.Comparison`: top-line totals from the dominant sector for each rep (not total campaign receipts — use the sector total that best illustrates the contrast)
- `Visual.Chart.Bar`: include all shared significant sectors plus any that one rep dominates
- `Interaction.Sentiment.Pulse.question`: make it policy-neutral — "Which sector should have more influence on California legislation?" or avoid pulse entirely if framing would be partisan
- `Identity.Source.Tag.sources[]`: FEC.gov + OpenSecrets (both required)

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Rep 1 | Rep 2 | Key Contrast | Cycle |
|---|---|---|---|---|
| `acc-industry-contrast-001` | Sen. Jenkins (CA) — Tech $8.2M | Sen. Miller (CA) — Agri $1.4M | $6.8M gap; same state, opposite industry priorities | 2026 |

---

## Prompt Invocation

**Variant A (Two-rep contrast):**

```
Generate a sector funding contrast PoliSnap.

Rep 1: [REP1_NAME] ([BIOGUIDE_ID1]) — [PARTY1], [STATE]
  Total receipts: $[AMOUNT] in [CYCLE]
  Top industries: [Industry: $Amount], [Industry: $Amount], [Industry: $Amount]
  FEC ID: [FEC_ID1]

Rep 2: [REP2_NAME] ([BIOGUIDE_ID2]) — [PARTY2], [STATE]
  Total receipts: $[AMOUNT] in [CYCLE]
  Top industries: [Industry: $Amount], [Industry: $Amount], [Industry: $Amount]
  FEC ID: [FEC_ID2]

Key contrast: [describe the most striking difference in 1 sentence]
Sources:
  FEC: https://www.fec.gov/data/
  OpenSecrets: [links to both rep profiles]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-contrast-[repLastName1]-vs-[repLastName2]-[YYYY]
No Header.Representative — comparative snap.
```

---

## Content Quality Rules

- **Same cycle only**: all comparison figures must be from the same FEC election cycle — no mixing
- **Sector labels**: use OpenSecrets standard industry categories (Energy & Natural Resources, Health, Finance, etc.) for consistency
- **Dollar display**: round to one decimal place in millions (`$8.2M` not `$8,200,000`)
- **Sentiment question**: must be policy-focused, not "which rep is better" — contrast snaps are data-focused
- **No `Header.Representative`**: neither rep should be positioned as the primary subject in comparative snaps
