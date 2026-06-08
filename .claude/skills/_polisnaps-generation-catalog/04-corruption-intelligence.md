# Category 4 — Corruption Intelligence

**Snap Type:** `Corruption Index Intelligence`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-demand / Event-triggered (large donations near vote events, flagged correlation patterns)
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Surfaces the correlation between a representative's campaign donations and their legislative votes. This is the most forensically complex snap type — it combines FEC donation data with Congress.gov vote records to calculate a **Corruption Index score** and display the raw evidence visually (via a heatmap of donor industries).

The citizen sees: Who donated to this rep? How much? When? And how does that line up with their votes? This snap does NOT allege wrongdoing — it presents the data and lets citizens form their own conclusion.

**Ethical guardrail**: All data must come from public FEC records. No speculation beyond what the data shows.

---

## Variants

### Variant A — Single Donation Correlation

Focus on one specific donation event correlated with one specific vote. Most impactful when timing is tight (donation within 30 days of vote).

**Example:** `TOP-CORRELATION-COLLECTIVE` (Greg Casar — Global Energy PAC, $5K, 4 days before H.R. 882 Yea vote)

### Variant B — Comprehensive Corruption Audit

Multi-donor analysis showing the rep's full industry funding pattern. Includes a heatmap of top contributing sectors with correlation scores.

**Example:** `cr-corruption-johnson-2026` (Mike Johnson — Oil & Gas concentration, corruption score 78)

---

## Element Stack — Variant A (Single Correlation)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Metric.CorruptionIndex` | Corruption score + single donor + vote correlation | Required |
| 3 | `Data.Correlation.Heatmap` | Industry-level donation breakdown with correlation scores | High value |
| 4 | `Interaction.Sentiment.Pulse` | "Does this represent undue influence?" | Conditional |
| 5 | `Trust.Thread` | Source: FEC.gov + Congress.gov | Required |

### Element Stack — Variant B (Comprehensive Audit)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Metric.CorruptionIndex` | Aggregate corruption score + top donor pattern | Required |
| 3 | `Trust.Thread` | Source: FEC.gov + OpenSecrets | Required |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **FEC.gov** | Official campaign finance filings — donations, amounts, dates, donors | `https://api.open.fec.gov/v1/schedules/schedule_a/?recipient_name={REP_NAME}` |
| **OpenSecrets.org** | Industry aggregations, PAC summaries, career totals | `https://www.opensecrets.org/politicians/summary.php?cid={OPENSECRETS_ID}` |
| **Congress.gov** | Roll call vote records with date | `https://api.congress.gov/v3/member/{bioguideId}/votes` |
| **FEC Bulk Data** | Full donation history by candidate | `https://www.fec.gov/data/` |

**FEC API Key**: Obtain from `https://api.open.fec.gov/` (free, requires registration)

---

## Snap ID Pattern

```
snap-corruption-{repLastName}-{YYYY}
```
Or for event-specific:
```
snap-correlation-{repLastName}-{billIdSlug}-{YYYYMMDD}
```

Examples:
- `cr-corruption-johnson-2026`
- `snap-correlation-casar-hr882-20260126`

---

## Corruption Index Score Calculation

The `Metric.CorruptionIndex.score` (0–100) is computed as follows:

| Factor | Weight | Calculation |
|---|---|---|
| **Timing proximity** | 40% | Donation within 7 days of vote = 40pts; 30 days = 25pts; 90 days = 10pts |
| **Amount significance** | 30% | Max individual contribution = 30pts; PAC max = 20pts; <$1K = 5pts |
| **Industry alignment** | 20% | If donor industry directly benefits from the bill = 20pts; tangential = 10pts; unrelated = 0pts |
| **Pattern recurrence** | 10% | 3+ similar correlations in current session = 10pts; 2 = 5pts; 1 = 0pts |

**Score interpretation:**
- 0–29: Low — routine campaign activity
- 30–59: Moderate — worth monitoring
- 60–79: Elevated — pattern warrants scrutiny
- 80–100: Severe — high correlation of donations and favorable votes

---

## Recurring Generation Procedure

### When to Generate

- FEC filing deadline passes (quarterly) — review large donations against recent votes
- A specific vote occurs on a bill in an industry that has recently donated heavily to the voting rep
- An investigative news story surfaces a specific correlation

### Stage 1 — Mine

- `mineMode: "freeform"` (cross-referencing two separate data sources)
- Record: donor name, industry, amount, donation date, bill ID, vote, vote date
- Calculate timing gap: days between donation and vote
- Calculate corruption score using the formula above

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- `validatedRepresentativeId`: the rep being audited
- `insightType: "Corruption Index Intelligence"`
- `suggestedElements[]`: always include `Metric.CorruptionIndex`
- `copyrightFlag: "public-domain"` (FEC data is public record)

### Stage 3 — Generate

- `Metric.CorruptionIndex.confidence`: decimal 0–1 (based on data completeness)
- `Metric.CorruptionIndex.auditId`: format `FEC-{STATE}{DISTRICT}-{REP_LAST}-{YYYY}`
- `Data.Correlation.Heatmap.donors[]`: list up to 5 industries with `amount` and `correlation` (0–1 float)
- `Trust.Thread.sources[]`: `FEC.gov` + `Congress.gov` (both required for this type)
- `verificationLevel: "Tier 3"` — FEC data is primary government source

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Rep | Key Correlation | Score |
|---|---|---|---|
| `TOP-CORRELATION-COLLECTIVE` | Rep. Greg Casar | Global Energy PAC $5K → H.R. 882 Yea, 4-day gap | 88 |
| `cr-corruption-johnson-2026` | Rep. Mike Johnson | Oil & Gas PAC concentration | 78 |

---

## Prompt Invocation

**Variant A — Single event correlation:**

```
Generate a corruption intelligence PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [PARTY], [STATE/DISTRICT]
Donation event: [DONOR_NAME], [INDUSTRY], $[AMOUNT], received [DATE]
Vote event: [VOTE] on [BILL_ID] — [BILL_TITLE], voted [DATE]
Day gap: [N] days between donation and vote
FEC source: [FEC.gov filing URL]
Vote source: [Congress.gov vote URL]
Audit ID: FEC-[STATE][DISTRICT]-[LAST_NAME]-[YYYY]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
```

**Variant B — Comprehensive audit:**

```
Generate a comprehensive corruption audit PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID])
Time period: [YYYY]–[YYYY] election cycle
Top donor industries: [list industries from OpenSecrets]
Key vote pattern: [describe the pattern — e.g., "7 Yea votes on oil subsidies, $450K from Energy sector"]
Sources: FEC.gov, OpenSecrets.org

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
```

---

## Content Quality Rules

- **All data must be from public FEC records** — no inferences beyond what filings show
- **Corruption score** must be calculated using the formula above — not estimated
- **`Metric.CorruptionIndex.insight` text**: Present as correlation, not allegation. Use language: "A [AMOUNT] donation was received [N] days prior to a [VOTE] vote on [BILL]" — not "the rep was bribed"
- **`confidence` field**: Reduce by 0.1 for each data gap (e.g., if date of donation is approximate, if industry is inferred rather than FEC-stated)
- **Never fabricate donor names, amounts, or dates** — all must be from FEC.gov or OpenSecrets
