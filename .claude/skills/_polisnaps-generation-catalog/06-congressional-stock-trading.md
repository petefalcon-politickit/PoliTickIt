# Category 6 — Congressional Stock Trading Alert

**Snap Type:** `Stock Trading Alert`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-event — triggered by new STOCK Act financial disclosure filings
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Surfaces anomalous stock trading activity by a congressional member, cross-referenced with their committee assignments and upcoming votes. The STOCK Act (Stop Trading on Congressional Knowledge Act) requires members to disclose trades within 45 days. This snap makes those disclosures accessible and contextually meaningful to citizens.

The citizen sees: What did this rep buy or sell? When? How does that compare to their normal trading pattern? Are they on a committee that oversees that industry?

**Ethical guardrail**: This is not an allegation of insider trading — it is a transparency alert presenting public disclosure data alongside relevant legislative context.

---

## Element Stack

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Narrative.Insight.Summary` | Plain-English description of the anomaly — what was traded, when, how it deviates from baseline | Required |
| 3 | `Visual.Chart.Bar` | Trading volume comparison — recent activity vs. 3-year historical baseline | High value |
| 4 | `Data.Table.Expandable` | Specific trade disclosures — ticker, amount range, date, notes | Required |
| 5 | `Interaction.Sentiment.Pulse` | "Does this trading activity represent a conflict of interest?" | Conditional |
| 6 | `Trust.Thread` | Source: SEC EDGAR, PoliTickIt analytics, STOCK Act disclosure portal | Required |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **House Financial Disclosures** | STOCK Act transaction reports (House members) | `https://disclosures.house.gov/` |
| **Senate Financial Disclosures** | STOCK Act transaction reports (Senate members) | `https://efts.senate.gov/LATEST/search-index?q={senator}` |
| **SEC EDGAR** | Public company filings for context | `https://www.sec.gov/cgi-bin/browse-edgar` |
| **Quiver Quantitative** | Aggregated congressional trade data | `https://www.quiverquant.com/congresstrading/` |
| **Congress.gov** | Committee assignments, vote schedule | `https://api.congress.gov/v3/member/{bioguideId}` |
| **PoliTickIt Analytics** | 3-year baseline trading volume | Internal aggregator |

---

## Snap ID Pattern

```
snap-stock-{repLastName}-{tickerSlug}-{YYYYMMDD}
```

Examples:
- `snap-stock-schumer-pfe-20260315`
- `snap-stock-pelosi-nvda-20260210`

---

## `Data.Table.Expandable` Structure

```typescript
{
  id: "transaction-table",
  type: "Data.Table.Expandable",
  data: {
    title: "Recent High-Value Disclosures",
    headers: ["Ticker", "Amount"],
    data: [
      {
        col1: "PFE",
        col2: "$150K – $250K",     // STOCK Act uses ranges, not exact amounts
        details: [
          "Purchased [N] days before [committee/vote event]",
          "Broker: [if disclosed]",
          "Link: [SEC Filing or disclosure link]"
        ]
      }
    ]
  }
}
```

**Amount range format** (per STOCK Act disclosure tiers):
- `"$1K – $15K"`, `"$15K – $50K"`, `"$50K – $100K"`, `"$100K – $250K"`, `"$250K – $500K"`, `"$500K – $1M"`, `"$1M – $5M"`, `"$5M+"`

---

## Recurring Generation Procedure

### When to Generate

1. Monitor STOCK Act disclosure portals (House: `disclosures.house.gov`, Senate: `efts.senate.gov`) for new filings
2. Look for trades that are: (a) in an industry the rep oversees via committee, or (b) significantly larger than their historical average
3. Cross-reference trade date with: committee hearings on that industry, upcoming votes on relevant bills

### Anomaly Detection Criteria

Generate a snap when ANY of the following are true:
- Trade volume in a single transaction exceeds 3x the rep's average transaction size
- Trade occurs within 30 days of a committee hearing on the same industry
- Trade occurs within 45 days of a vote on legislation that affects the traded company
- Pattern: 3+ trades in the same industry cluster within a 90-day window

### Stage 1 — Mine

- `mineMode: "freeform"` (STOCK Act disclosures + historical baseline research)
- Record: ticker(s), amount range(s), transaction date, transaction type (Purchase/Sale), baseline deviation %
- Record: relevant committee assignments, upcoming/recent votes on same industry

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- `validatedRepresentativeId`: the trading member
- `insightType: "Stock Activity Deep-Dive"`
- `contentSignal: "active"` — trading alerts are always current
- `sentimentEligible: true`

### Stage 3 — Generate

- `Narrative.Insight.Summary.text`: lead with the deviation percentage ("deviates from 3-year baseline by X%"), then the specific trade context
- `Visual.Chart.Bar` data: use relative units, not exact dollar amounts (STOCK Act only provides ranges)
  - Label axes: "Disclosed Trading Value (Range)" vs. "Historical Avg"
  - Use midpoint of the disclosed range for chart bars
- `Data.Table.Expandable.details[]`: include pre-vote/pre-hearing timing context explicitly
- `Trust.Thread.sources[]`: cite the specific disclosure filing URL + SEC EDGAR if applicable
- `verificationLevel: "Tier 3"` — STOCK Act disclosures are primary government records

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Rep | Ticker | Deviation | Committee Overlap |
|---|---|---|---|---|
| `accountability-high-fi-001` | Sen. Chuck Schumer (NY) | PFE, JNJ | 240% above 3-yr baseline | Pharmaceutical stocks before drug price cap committee vote |

---

## Prompt Invocation

```
Generate a congressional stock trading alert PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [PARTY], [STATE/DISTRICT]
Trade(s):
  - Ticker: [TICKER], Amount: [STOCK_ACT_RANGE], Date: [YYYY-MM-DD], Type: [Purchase/Sale]
  - [Additional trades if multiple]
Baseline deviation: [X]% above/below 3-year historical average
Committee context: [Rep sits on [COMMITTEE] which oversees [INDUSTRY]]
Vote/hearing proximity: [N] days before/after [COMMITTEE HEARING or VOTE on BILL_ID]
Disclosure source: [URL to STOCK Act filing]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-stock-[repLastName]-[tickerSlug]-[YYYYMMDD]
```

---

## Content Quality Rules

- **Use STOCK Act amount ranges only** — never estimate the exact amount from the range midpoint in text (charts may use midpoints)
- **Disclosure date vs. transaction date**: these are different — STOCK Act gives transaction date; note when the disclosure was filed (it may be 45 days later)
- **Baseline calculation**: acknowledge if baseline is estimated ("based on available disclosures 2023–2026") — don't present it as a precise figure
- **Never suggest illegality**: this is a transparency alert. Language: "this activity deviates from their historical baseline" — not "this constitutes insider trading"
- **Committee context**: only cite committee overlap if the rep is actually on a relevant committee — verify via `representatives.md` or Congress.gov
