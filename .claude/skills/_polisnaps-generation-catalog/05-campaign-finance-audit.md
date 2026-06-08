# Category 5 — Campaign Finance Audit

**Snap Type:** `Campaign Finance Audit`
**Feed Section:** `accountabilitySnaps`
**Schedule:** Quarterly (aligned with FEC filing deadlines: Jan 31, Apr 15, Jul 15, Oct 15)
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Provides a broad campaign finance overview for a specific representative — showing total fundraising, the mix of donor sources (corporate PACs vs. individual small donors vs. industry clusters), and any notable concentration patterns. 

Unlike the Corruption Intelligence snap (which focuses on a specific donation-to-vote correlation), this snap presents the **structural funding picture**: how is this rep's campaign funded? What industries dominate? What percentage comes from outside their district?

Citizens use this to understand who has financial access to their representative before any specific vote occurs.

---

## Element Stack

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Narrative.Insight.Summary` | Plain-English summary of the funding pattern and any notable concentration | Required |
| 3 | `Data.Grid.Grouped` | Top PAC/donor grid — shows largest donors with amounts | Required |
| 4 | `Interaction.Sentiment.Pulse` | "Does this level of industry funding concern you?" | Conditional |
| 5 | `Trust.Thread` | Source: FEC.gov + OpenSecrets | Required |

**Optional additions:**
- `Visual.Chart.Bar` — show funding breakdown across top 3–5 industries (donor concentration chart)
- `Metric.Dual.Comparison` — compare current cycle to prior cycle total

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **FEC.gov** | Official filings — total receipts, PAC vs individual breakdown, large donor list | `https://api.open.fec.gov/v1/candidates/?name={REP_NAME}&election_year={YYYY}` |
| **OpenSecrets.org** | Industry aggregations, outside spending, career totals, PAC sponsor industry | `https://www.opensecrets.org/politicians/summary.php?cid={ID}` |
| **FEC Bulk Data** | CSV exports of all contributions by candidate | `https://www.fec.gov/data/` |

**Quarterly FEC Filing Deadlines:**
- Q1: April 15
- Q2: July 15
- Q3: October 15
- Year-end: January 31

---

## Snap ID Pattern

```
snap-fec-{repLastName}-{YYYY}-q{N}
```

Examples:
- `snap-fec-mcconnell-2026-q1`
- `snap-fec-johnson-2026-q2`

---

## `Data.Grid.Grouped` Structure

```typescript
{
  id: "fec-grid",
  type: "Data.Grid.Grouped",
  data: {
    title: "[Industry Focus Area] Focus",  // e.g., "Energy & Infrastructure Focus"
    totalAmount: 2450000,                   // total from top donors, in cents or integer dollars
    pacs: [
      { name: "PAC/Donor Name", amount: 450000 },
      { name: "...", amount: 280000 },
      // up to 5 entries
    ],
    corporateTrace: "Optional — parent company or notable corporate link text"
    // omit corporateTrace if no notable link exists
  }
}
```

**Title guidance for `Data.Grid.Grouped`:**
- Use the dominant industry as the focus label: `"Energy & Infrastructure Focus"`, `"Tech Sector Focus"`, `"Healthcare Donor Concentration"`, etc.
- If no industry dominates (diverse funding), use: `"Top Campaign Donors"`

---

## Recurring Generation Procedure

### When to Generate

- FEC quarterly filing deadline passes — pull new numbers for reps of interest
- A rep's funding pattern changes significantly (e.g., sudden surge from a new industry)
- A rep is about to vote on major legislation in their top donor industry

### Stage 1 — Mine

- `mineMode: "freeform"` (pull from FEC API + OpenSecrets)
- Collect: total receipts for the cycle, top 5 PACs/donors by amount, industry breakdown
- Calculate: % from PACs vs. individual donors; % from out-of-state donors (if available)

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- `validatedRepresentativeId`: the audited rep
- `insightType: "Campaign Finance"`
- `copyrightFlag: "public-domain"` (FEC data is public record)
- `sentimentEligible: true` — campaign finance questions are always relevant

### Stage 3 — Generate

- `Data.Grid.Grouped.totalAmount`: total from listed donors (not total campaign receipts — just the displayed donors)
- `Narrative.Insight.Summary.text`: lead with the most notable finding (e.g., "15% increase in energy sector funding") + context (what bills are they on committees for?)
- Include `corporateTrace` only when a verified parent company link exists
- `Trust.Thread.sources[]`: both `FEC.gov` and `OpenSecrets` (cite specific filing URLs)

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Rep | Filing Period | Top Sector | Notable Finding |
|---|---|---|---|---|
| `accountability-fec-001` | Sen. Mitch McConnell (KY) | 2026 cycle | Energy | 15% increase in energy PAC funding; 40% from out-of-state corporations |

---

## Prompt Invocation

```
Generate a campaign finance audit PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [PARTY], [STATE/DISTRICT]
Filing period: [YYYY] cycle, Q[N] (through [DATE])
FEC candidate ID: [FEC_ID]  (from fec.gov — starts with P, S, or H)
Total receipts: $[AMOUNT]
Top donor industries (from OpenSecrets): [list top 3]
Top named PACs/donors: [list with amounts]
Notable finding: [e.g., "15% increase from energy sector PACs vs. prior cycle"]

Sources:
  FEC: https://www.fec.gov/data/committee/[FEC_ID]/
  OpenSecrets: https://www.opensecrets.org/politicians/summary.php?cid=[ID]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-fec-[repLastName]-[YYYY]-q[N]
```

---

## Content Quality Rules

- **All amounts from FEC filings only** — OpenSecrets industry aggregations are acceptable as supplemental but must be labeled as such
- **`corporateTrace` text**: state the relationship factually ("Funding linked to parent company X") — do not use language implying wrongdoing
- **No inference beyond the data**: "40% from non-resident corporate entities" is factual; "bought by corporations" is not
- **Cycle consistency**: all figures should be from the same election cycle — don't mix cycles without explicit labeling
- **FEC IDs**: always include the FEC candidate ID in the snap's `metadata` or Trust.Thread for verifiability
