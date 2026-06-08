# Category 8 — Vote Alignment & Divergence

**Snap Type:** `Vote Alignment` / `Vote Divergence` / `Vote Reversal`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-event — after significant roll call votes, quarterly alignment reviews, or committee-to-floor vote changes
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Shows citizens how their representative's voting record aligns — or diverges — from the people they represent. This is the direct democratic accountability signal: is my rep voting with my community, or for their party?

Three sub-patterns address different accountability angles:

1. **Alignment Gauge**: Aggregate picture — what % of votes did this rep align with their district vs. their party?
2. **Key Vote Divergence**: Single high-profile vote where constituent support and party alignment are dramatically different
3. **Vote Reversal / Pivot**: Rep changed their vote between committee markup and the floor vote (often following an amendment or pressure campaign)

---

## Variants

### Sub-pattern A — Alignment Gauge

Periodic audit of a rep's aggregate voting alignment. Combines a gauge metric with a sentiment pulse.

**Example:** `acc-district-align-001` — Sen. Schumer, 78% party line

### Sub-pattern B — Key Vote Divergence

Single-vote analysis: "Your rep voted Yea on [BILL]. Only 42% of their constituents support this. Their party votes 98% in favor."

**Example:** `accountability-votes-001` — Rep. Johnson, S.Res.542: 42% constituent vs 98% party

### Sub-pattern C — Vote Reversal / Pivot

The rep voted one way in committee and a different way on the floor — usually after an amendment changed the bill.

**Example:** `acc-vote-reversal-001` — Rep. Miller, H.R.882: Committee Nay → Floor Yea after $5M transit amendment added

---

## Element Stack — Sub-pattern A (Alignment Gauge)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Metric.Alignment.Gauge` | Aggregate alignment score — district focus % vs party line % | Required |
| 3 | `Interaction.Sentiment.Pulse` | "Does your rep vote for you or for party?" | Conditional |
| 4 | `Identity.Source.Tag` | Congress.gov vote records + PoliTickIt Analytics | Required |

### Element Stack — Sub-pattern B (Divergence)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Metric.Dual.Comparison` | Left: constituent support %; Right: party alignment % | Required |
| 3 | `Narrative.Insight.Summary` | "This is the Nth time this quarter" + bill context | Required |
| 4 | `Interaction.Sentiment.Pulse` | "Was this the right vote for [district]?" | Conditional |

### Element Stack — Sub-pattern C (Vote Reversal)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Narrative.Insight.Summary` | Explains what changed — what amendment was added, what the pivot means | Required |
| 2 | `Metric.Dual.Comparison` | Left: Committee Vote; Right: Floor Vote (side-by-side timeline comparison) | Required |
| 3 | `Identity.Source.Tag` | Congressional Record + House/Senate Clerk | Required |

Note for Sub-pattern C: **No `Header.Representative` is required** but it is recommended when a single rep is the subject.

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **Congress.gov Member Votes API** | Individual vote history by bioguide | `https://api.congress.gov/v3/member/{bioguideId}/votes` |
| **House Clerk Roll Calls** | Detailed roll call XML with member-by-member breakdown | `https://clerk.house.gov/evs/{YYYY}/roll{NNN}.xml` |
| **Senate.gov Roll Calls** | Senate individual votes | `https://www.senate.gov/legislative/LIS/roll_call_lists/` |
| **PoliTickIt Analytics** | District-level polling aggregation for constituent support % | Internal aggregator |
| **GovTrack Party Vote Analysis** | Party-line voting patterns | `https://www.govtrack.us/congress/members/{bioguideId}` |

---

## Snap ID Patterns

```
snap-alignment-{repLastName}-{YYYY}           // Sub-pattern A
snap-divergence-{repLastName}-{billIdSlug}    // Sub-pattern B
snap-pivot-{repLastName}-{billIdSlug}         // Sub-pattern C
```

Examples:
- `snap-alignment-schumer-2026`
- `snap-divergence-johnson-sres542`
- `snap-pivot-miller-hr882`

---

## `Metric.Alignment.Gauge` Structure

```typescript
{
  id: "alignment-gauge",
  type: "Metric.Alignment.Gauge",
  data: {
    value: 0.78,                           // 0 = full district focus; 1 = full party line
    leftLabel: "District Focus",
    rightLabel: "Party Line",
    insight: "78% of votes align with party position",
    period: "2025–2026 session"
  }
}
```

## `Metric.Dual.Comparison` Structure (Sub-pattern B)

```typescript
{
  id: "alignment-compare",
  type: "Metric.Dual.Comparison",
  data: {
    leftLabel: "Constituent Support",
    leftValue: "42%",
    rightLabel: "Party Alignment",
    rightValue: "98%",
    leftColor: "#4CAF50",               // green = in favor
    rightColor: "#FF5722",              // red = divergent
    insight: "Gap of 56 percentage points"
  }
}
```

## `Metric.Dual.Comparison` Structure (Sub-pattern C — Vote Timeline)

```typescript
{
  id: "vote-comparison",
  type: "Metric.Dual.Comparison",
  data: {
    leftLabel: "Committee Vote",
    leftValue: "Nay",
    rightLabel: "Floor Vote",
    rightValue: "Yea",
    leftColor: "#FF5722",
    rightColor: "#4CAF50",
    insight: "$5M transit amendment added before floor vote"
  }
}
```

---

## Recurring Generation Procedure

### When to Generate

- **Sub-pattern A**: Quarterly — run after each quarter's votes are finalized
- **Sub-pattern B**: After any notable roll call vote where constituent polling is available
- **Sub-pattern C**: When a rep changes their vote between committee and floor — detected by comparing committee vote record vs. floor vote record

### Stage 1 — Mine

- `mineMode: "structured"` for Sub-patterns B and C (both votes come from Congress.gov)
- `mineMode: "freeform"` for Sub-pattern A (requires aggregating a rep's full session vote history)
- For Sub-pattern B: gather both the roll call vote AND constituent polling data
- For Sub-pattern C: retrieve the committee markup vote from Congressional Record + floor roll call vote

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- `validatedRepresentativeId`: the rep being analyzed
- `sentimentEligible: true` for Sub-patterns A and B
- For Sub-pattern C: `insightType: "Vote Reversal"` — note the amendment that changed the vote

### Stage 3 — Generate

- Sub-pattern A: `Metric.Alignment.Gauge.value` is the party-line alignment rate (0–1)
- Sub-pattern B: `Metric.Dual.Comparison` shows the constituent-to-party gap; `Narrative.Insight.Summary` notes recurrence ("Nth time this quarter")
- Sub-pattern C: `Metric.Dual.Comparison` uses timeline framing (Committee → Floor); `Narrative.Insight.Summary` explains the amendment

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Sub-pattern | Rep | Key Metric | Notes |
|---|---|---|---|---|
| `acc-district-align-001` | A — Alignment | Sen. Chuck Schumer | 78% party line vs district | Quarterly review |
| `accountability-votes-001` | B — Divergence | Rep. Mike Johnson | 42% constituent vs 98% party | S.Res.542; 5th divergence this quarter |
| `acc-vote-reversal-001` | C — Reversal | Rep. Miller | Nay → Yea on H.R.882 | $5M transit amendment added |

---

## Prompt Invocation

**Sub-pattern A (Alignment Gauge):**

```
Generate a vote alignment gauge PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [PARTY], [STATE/DISTRICT]
Period: [YYYY] session (or Q[N])
Party-line alignment rate: [X]% of votes aligned with party position
District focus rate: [Y]% of votes aligned with district polling
Most notable divergence: [describe one example]
Source: [Congress.gov member votes URL] + PoliTickIt Analytics

Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-alignment-[repLastName]-[YYYY]
```

**Sub-pattern B (Key Vote Divergence):**

```
Generate a vote divergence PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID])
Bill: [BILL_ID] — [BILL_TITLE]
Their vote: [Yea/Nay] on [DATE]
Constituent support: [X]% in [DISTRICT]
Party alignment: [Y]% of party voted same
Recurrence: [Nth time this quarter/session]
Sources: [Roll call URL] + [PoliTickIt Analytics constituency data]

Target array: accountabilitySnaps in snapLibrary.ts
```

**Sub-pattern C (Vote Reversal):**

```
Generate a vote reversal PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID])
Bill: [BILL_ID] — [BILL_TITLE]
Committee vote: [Nay/Yea] on [DATE]
Floor vote: [Yea/Nay] on [DATE]
What changed: [amendment description — what was added/removed]
Source: Congressional Record (committee markup) + House/Senate Clerk (floor vote)

Target array: accountabilitySnaps in snapLibrary.ts
```

---

## Content Quality Rules

- **Constituent support %**: Must come from PoliTickIt Analytics or an explicit cited poll — never estimated
- **Party alignment %**: Calculated from roll call records — `(reps in party voting same way) / (total party members voting)`
- **Sub-pattern C**: The amendment text must be real — find it in the Congressional Record bill text or committee report
- **Recurrence language**: "Nth time this quarter" — only assert if you have counted the actual votes; if uncertain, omit this qualifier
- **Gauge value**: Range 0–1 where 1 = 100% party line; 0 = votes entirely against party — never invert this axis
