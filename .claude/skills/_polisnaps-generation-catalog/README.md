# PoliSnap Generation Catalog

**Purpose:** Formal reference catalog of every repeatable PoliSnap pattern in the PoliTickIt product. Each entry documents enough information to re-generate that class of snap from a cold-start chat using the standard 4-skill pipeline (Mine â†’ Normalize â†’ Generate â†’ Distribute).

**Last cataloged:** 2026-05-31
**Total snap types documented:** 13 categories, 28 existing production snaps

---

## How to Use This Catalog

1. Identify the snap type you want to generate (see table below).
2. Open the corresponding category file.
3. Find the **Prompt Invocation** section â€” copy the stub into a new chat.
4. The prompt references the 4-skill pipeline skills automatically.
5. Follow the step-by-step procedure for that snap type.

### Pipeline Skill References (always the same)

```
Mine:        c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\polisnap-miner\SKILL.md
Normalize:   c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\polisnap-normalizer\SKILL.md
Generate:    c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\polisnap-generator\SKILL.md
Distribute:  c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\polisnap-distributor\SKILL.md
```

### Reference Data Files

```
Representatives:  c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\_polisnap-data\representatives.md
Policy Areas:     c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\_polisnap-data\policy-areas.md
Element Catalog:  c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\_polisnap-data\element-catalog.md
Congress API:     c:\Projects\Alithix\Products\PoliTickIt\.claude\skills\_polisnap-data\congress-api.md
```

### Output Directories

```
Spawn files:       C:\Projects\Alithix\Products\PoliTickIt\apps\skill-execution\PoliSnaps\spawn\
Normalized files:  C:\Projects\Alithix\Products\PoliTickIt\apps\skill-execution\PoliSnaps\normalized\
Constructed files: C:\Projects\Alithix\Products\PoliTickIt\apps\skill-execution\PoliSnaps\constructed\
Distributed logs:  C:\Projects\Alithix\Products\PoliTickIt\apps\skill-execution\PoliSnaps\distributed\
snapLibrary.ts:    C:\Projects\Alithix\Products\PoliTickIt\apps\mobile\constants\snapLibrary.ts
```

---

## Category Index

| # | File | Snap Type | Schedule | Primary Source | Existing Examples |
|---|---|---|---|---|---|
| 1 | [01-floor-debates.md](01-floor-debates.md) | Congressional Floor Debate | Daily (session days) | Congress.gov + GovInfo.gov | snap-sjres185, snap-hr2616, snap-hr1329, snap-hr1041, snap-hr6644 |
| 2 | [02-rep-bill-position.md](02-rep-bill-position.md) | Rep Bill Position / Statement | On-event (votes, hearings) | Congress.gov, Senate.gov press releases | snap-sjres12-thune, acc-pulse-arctic-res |
| 3 | [03-bill-vote-record.md](03-bill-vote-record.md) | Rep Bill Vote with District Impact | On-event (roll call votes) | Congress.gov, House/Senate Clerk | infra-bill-vote-001 |
| 4 | [04-corruption-intelligence.md](04-corruption-intelligence.md) | Corruption Index Intelligence | Weekly / On-event (large donations) | FEC.gov, OpenSecrets, Congress.gov | TOP-CORRELATION-COLLECTIVE, cr-corruption-johnson-2026 |
| 5 | [05-campaign-finance-audit.md](05-campaign-finance-audit.md) | Campaign Finance Audit | Quarterly / Per election cycle | FEC.gov, OpenSecrets | accountability-fec-001 |
| 6 | [06-congressional-stock-trading.md](06-congressional-stock-trading.md) | Congressional Stock Trading Alert | On-event (new STOCK Act disclosures) | SEC EDGAR, PoliTickIt aggregator | accountability-high-fi-001 |
| 7 | [07-legislative-status.md](07-legislative-status.md) | Legislative Bottleneck / Bill Status | Weekly | Congress.gov | acc-leg-001, qa-stagnation-sentinel-001 |
| 8 | [08-vote-alignment.md](08-vote-alignment.md) | Vote Alignment & Divergence | On-event (key votes) | Congress.gov, PoliTickIt Analytics | acc-district-align-001, accountability-votes-001, acc-vote-reversal-001 |
| 9 | [09-sentiment-pulse.md](09-sentiment-pulse.md) | Legislative Sentiment Pulse | On-event / Weekly | Congress.gov, policy news | acc-pulse-cyber-security, acc-pulse-veterans-bill, acc-pulse-small-biz-incentive, acc-pulse-energy-roadmap |
| 10 | [10-sector-funding-contrast.md](10-sector-funding-contrast.md) | Sector / Funding Contrast | Quarterly | FEC.gov, OpenSecrets | acc-industry-contrast-001 |
| 11 | [11-community-initiatives.md](11-community-initiatives.md) | Community Organization Initiative | On-event (org announcements) | Org websites, local news | community-org-001 |
| 12 | [12-constituent-voter-audit.md](12-constituent-voter-audit.md) | Constituent Voter Audit | On-demand (per user) | TargetSmart, ZK-Proof bridge | audit-casar-001 |
| 13 | [13-judicial-opinion.md](13-judicial-opinion.md) | Judicial Opinion Alert | On-event (court rulings) | Court records, legal news | acc-judicial-001 |

---

## Element Quick-Reference Matrix

| Element Type | Used In Categories |
|---|---|
| `Header.Bill` | 1, 3 |
| `Header.Representative` | 2, 3, 4, 5, 6, 8, 9, 10 |
| `Data.FloorDebate` | 1 |
| `Data.BillVote` | 3 |
| `Data.Correlation.Heatmap` | 4 |
| `Data.Grid.Grouped` | 5 |
| `Data.Table.Expandable` | 6 |
| `Narrative.Insight.Summary` | All |
| `Narrative.Congressional.Statement` | 2 |
| `Narrative.SentimentSummary` | 3 |
| `Narrative.Event.Details` | 11 |
| `Metric.Progress.Stepper` | 2, 7 |
| `Metric.CorruptionIndex` | 4 |
| `Metric.DistrictFunding` | 3 |
| `Metric.Alignment.Gauge` | 8 |
| `Metric.Dual.Comparison` | 8, 10 |
| `Universal.Gauge` | 7 |
| `Visual.Chart.Bar` | 6, 9, 10 |
| `Visual.Chart.SentimentTrend` | 9, 10 |
| `Interaction.Sentiment.Pulse` | 1, 2, 4, 5, 8, 9, 10 |
| `Interaction.Sentiment.Slider` | 6, 9 |
| `Interaction.Action.Card` | 2, 9, 11 |
| `Interaction.VoterAudit` | 12 |
| `Identity.Organization.Header` | 11 |
| `Identity.Source.Tag` | 2, 7, 8, 9, 10 |
| `Navigation.SnapLinks` | 1 (parent snaps with drill-down) |
| `Trust.Thread` | All (required) |

---

## Template File Map

| Template ID | File | Used By |
|---|---|---|
| `floor-debate` | `floor-debate.template.json` | Category 1 |
| `rep-full-speech` | `rep-full-speech.template.json` | Category 2 (drill-down child) |
| `senator-statement` | `senator-statement.template.json` | Category 2 (parent) |
| _(needs creation)_ | `bill-vote-record.template.json` | Category 3 |
| _(needs creation)_ | `corruption-intelligence.template.json` | Category 4 |
| _(needs creation)_ | `campaign-finance-audit.template.json` | Category 5 |
| _(needs creation)_ | `stock-trading-alert.template.json` | Category 6 |
| _(needs creation)_ | `legislative-status.template.json` | Category 7 |
| _(needs creation)_ | `vote-alignment.template.json` | Category 8 |
| _(needs creation)_ | `sentiment-pulse.template.json` | Category 9 |
| _(needs creation)_ | `sector-funding-contrast.template.json` | Category 10 |
| _(needs creation)_ | `community-initiative.template.json` | Category 11 |

> Templates to create are tracked as future work. Categories without templates use the `AUTO_GENERATE` path in the snap-template-catalog lookup strategy.

---

## Recurring Schedule Summary

| Frequency | Categories |
|---|---|
| **Daily** (session days) | 1 â€” Floor Debates (`/daily-floor-debates` prompt exists) |
| **Weekly** | 7 â€” Legislative Status, 9 â€” Sentiment Pulse (active bills) |
| **On-event** (votes, hearings, disclosures) | 2, 3, 6, 8, 11, 13 |
| **Quarterly** | 5 â€” Campaign Finance, 10 â€” Sector Contrast |
| **On-demand** | 4 â€” Corruption Intelligence, 12 â€” Voter Audit |

---

## Prompts Inventory

Existing prompts in `.github/prompts/`:

| Prompt File | Snap Category | Status |
|---|---|---|
| `daily-floor-debates.prompt.md` | Category 1 â€” Floor Debates | âœ… Production-ready |

All other categories need a corresponding `.prompt.md` file created in `.github/prompts/`. Each category file in this catalog includes a **Prompt Invocation** stub that can be used to bootstrap that prompt file.

