# PoliSnap Element Catalog

**Owner:** `polisnap-normalizer` (reuse analysis) + `polisnap-generator` (element creation reference + catalog curation)
**Used by:** Normalizer reads this to map content → elements and detect NEW_ELEMENT_DEPENDENCY. Generator reads this during element creation and **writes to this file** when a new element is created.
**Future:** This file will be replaced by a live element registry endpoint.

---

## How to Use This Catalog

**Normalizer:** For each content signal in the spawn, find the matching structural purpose. Add the element type to `suggestedElements[]`. If the type is NOT listed in this file → emit `NEW_ELEMENT_DEPENDENCY` warning.

**Generator:** When creating a new PoliElement (Option A — NEW_ELEMENT_DEPENDENCY path), after creation **add the new type to this catalog** using the Curation Template below. This ensures the normalizer detects it on all future runs.

**Reuse test:** Ask "what does this element *render structurally*?" — not "what is this snap about?". A titled text block with accent bar is always `Narrative.Insight.Summary` whether the title is "About This Bill" or "Policy Context".

---

## Catalog Curation Template

When the generator creates a new PoliElement, append a row to the appropriate section below using this format:

```
| `{Category.ElementName}` | {one-line structural purpose} | {key data field names} | {content signals} | {jurisdictionScope} |
```

**Field guidance:**
- **Type:** Full registered type string matching `ComponentFactory.register(...)` call
- **Structural purpose:** What the element *renders* — not what topic it covers
- **Key `data` fields:** Comma-separated field names from the component's props interface
- **Content signals:** Which `contentSignal` tags this element is appropriate for (`active`, `historical`, `editorial`, `biographical`, `any`)
- **`jurisdictionScope`:** One of: `any` / `federal` / `state` / `local` / `federal+state` — indicates which civic levels the element applies to

> After adding the row, the updated catalog is immediately active for the next normalizer run.

---

## Registered Elements

> **Column guide:** `jurisdictionScope` = civic levels this element applies to: `any` = all levels, `federal` = federal only, `state` = state only, `local` = county/city/school-district

### Sentiment & Public Opinion

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Narrative.SentimentSummary` | Color-coded opinion badge + summary text (POSITIVE/MIXED/NEGATIVE) | `sentiment`, `summary` | `active`, `historical` | `any` |
| `Interaction.Sentiment.Pulse` | Interactive agree/disagree poll **(2–4 options)** | `title`, `options[]` (min 2, max 4), `stats.agree`, `stats.disagree` | `active` | `any` |
| `Interaction.Sentiment.Slider` | Slider-based opinion capture (left–right spectrum) | slider-specific config | `active` | `any` |
| `Universal.Gauge` (mode: `Spectrum`) | Left–right political alignment gauge | `title`, `value` (0–100), `leftLabel`, `rightLabel`, `insight` | `active`, `historical` | `any` |
| `Metric.Scorecard.SentimentGap` | Rep vote vs constituent opinion gap | embed inside `Metric.Accountability.Scorecard` | `active`, `historical` | `any` |
| `Data.Consensus.Ripple` | District consensus score with ripple trend | `district`, `consensusScore`, `respondents`, `capitalVolume`, `trend`, `clusters[]` | `active` | `any` |
| `Visual.Chart.SentimentTrend` | Sentiment over time line chart | `value` (chart data) | `historical` | `any` |

### Text Blocks & Narrative

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Narrative.Insight.Summary` | Titled text block with left border, subtle bg, italic body + optional expand | `title`, `text`/`content`/`summary`, `isExpandable`, `sourceLink` | `any` | `any` |
| `Narrative.Congressional.Statement` | Official congressional quote / floor statement | `quote`/`text`, `speaker`, `date`, `context`, `fullTranscriptId` | `active`, `historical` | `federal` |
| `Narrative.Congressional.FloorStatement` | Congressional floor proceeding | same as Statement | `active`, `historical` | `federal` |
| `Narrative.Congressional.Debate` | Debate exchange between two named speakers | debate-specific structure | `historical` | `federal` |
| `Narrative.Congressional.Transcript` | Full hearing or session transcript | transcript-specific structure | `historical` | `federal` |
| `Narrative.Event.Details` | Scheduled event with date / location | event-specific structure | `active` | `any` |

### Voting & Legislative

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Data.BillVote` | Rep vote badge (Yea/Nay/Abstained) + bill name | `billName`, `vote` | `active`, `historical` | `federal` |
| `Data.FloorDebate` | Multi-speaker floor debate — each speaker gets position badge + direct quote + argument summary (max 3 speakers) | `billId`, `billTitle`, `debateDate`, `chamber`, `voteOutcome`, `speakers[]` (each: `representativeId`, `name`, `party`, `position`, `quote`, `summary`) | `active`, `historical` | `federal` |
| `data.legislative.votingrecord` | Rep voting history / record table | record-specific structure | `historical` | `federal` |
| `Metric.Progress.Stepper` | Bill progress through legislative stages | stepper-specific structure | `active` | `federal+state` |
| `Metric.Congressional.WeeklySummary` | Weekly congressional activity summary | summary-specific structure | `historical` | `federal` |

### Numbers, Stats & Comparisons

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Metric.Group` | Two or more labelled metric tiles in a row | `title`, `items[]` (each: `label`, `value`, `subtext`, `unit`, `color`) | `any` | `any` |
| `Metric.Dual.Comparison` | Exactly two items side-by-side | same as `Metric.Group` with two items | `any` | `any` |
| `Metric.DistrictFunding` | District spending / funding breakdown | funding-specific structure | `active`, `historical` | `any` |
| `Data.Table.Expandable` | Expandable tabular data set | table-specific structure | `any` | `any` |
| `Data.List.Columnar` | Columnar list | `items[]` | `any` | `any` |
| `Data.List.Bullet` | Bullet list | `items[]` | `any` | `any` |

### Scoring, Grades & Accountability

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Metric.Grade` | Single letter grade with label + description | `label`, `grade`, `color`, `description` | `active`, `historical` | `any` |
| `Metric.Accountability.Scorecard` | Full rep report card (composite scorecard) | scorecard composite structure | `historical` | `any` |
| `Universal.Gauge` (mode: `Friction`/`Radial`/`Linear`) | Intensity / support-level arc or radial gauge | `title`, `value`, `intensity`, `insight` | `active`, `historical` | `any` |
| `Metric.PredictiveScoring` | Predictive scoring | predictive structure | `active` | `any` |
| `Metric.PredictiveForecasting` | Outcome forecasting | predictive structure | `active` | `any` |
| `Logic.Predictive` | Logic-driven predictive model | config structure | `active` | `any` |
| `Metric.Leaderboard.Regional` | Regional leaderboard | leaderboard structure | `historical` | `any` |
| `Metric.Status.Grid` | Multi-item status grid | grid-specific structure | `any` | `any` |
| `Metric.Achievement.List` | Achievement / milestone list | achievement structure | `historical` | `any` |
| `Metric.Attendance.Grid` | Attendance record grid | attendance structure | `historical` | `federal+state` |
| `Metric.Local.Preference` | Local preference metric | preference structure | `active` | `local` |

### Finance & FEC

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Metric.FEC.Details` | Campaign finance summary tiles | FEC-specific structure | `historical` | `federal` |
| `Metric.FEC.ContributionAnalysis` | Donor / contribution breakdown | contribution-specific structure | `historical` | `federal` |
| `Data.Correlation.Heatmap` | Influence correlation heatmap | heatmap-specific structure | `historical` | `federal` |
| `Metric.CorruptionIndex` | Corruption risk index score | index-specific structure | `historical` | `any` |
| `Audit.Financial` | Financial audit result | audit-specific structure | `historical` | `any` |

### Identity & Context

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Identity.Rep.Brief` | Representative profile card (photo, name, party, district) | rep brief structure | `biographical` | `any` |
| `Header.Representative` | Snap header anchored to a single representative | `id`, `name`, `party`, `location`, `position`, `imgUri`, `tags` | `any` | `any` |
| `Header.Bill` | Snap header anchored to a bill (not a rep) — chamber badge, bill ID, official title | `billId`, `billTitle`, `chamber`, `congress`, `status`, `lastActionDate` | `active`, `historical` | `federal+state` |
| `Header.Profile` | Generic profile header | profile structure | `biographical` | `any` |
| `Header.Sponsor` | Bill sponsor header | sponsor structure | `active`, `historical` | `federal+state` |
| `Identity.Organization.Header` | Organization / committee header | org header structure | `any` | `any` |
| `Identity.Source.Tag` | Source attribution tag | `value`, `extraProps` | `any` | `any` |
| `Context.Thread` | Geographic / district context drill-down | `refinementScore`, `activeTier`, `derivationSummary`, `lineage`, `oracleSource` | `any` | `any` |
| `Trust.Thread` | Provenance / source verification footer | `referenceId`, `serialNumber`, `oracleSource`, `verificationLevel`, `auditDate` | `any` | `any` |

### Actions & CTAs

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Interaction.Action.Card` | Single action button / watchlist / contact CTA | `title`, `label`, `actionType`, `actionPayload` | `active` | `any` |
| `Interaction.Participation.CTA` | Community participation prompt | CTA-specific structure | `active` | `any` |
| `Interaction.VoterAudit` | Voter audit / identity verification | audit-specific structure | `active` | `any` |

### Navigation

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Navigation.SnapLinks` | Tappable list of links to related child snaps — renders as a labeled group of tap-targets, each showing a rep thumbnail and label. Used when a summary snap has individual drill-down snaps for each entity (speaker, witness, bill). | `title`, `links[]` (each: `snapId`, `label`, `thumbnailRepId`) | `active`, `historical` | `any` |

### Visual & Charts

| Type | Structural purpose | Key `data` fields | Content signals | `jurisdictionScope` |
|---|---|---|---|---|
| `Visual.Chart.Bar` | Vertical or horizontal bar chart | `value` (chart data) | `any` | `any` |
| `Visual.Chart.Line` | Line chart / trend over time | `value` (chart data) | `historical` | `any` |
| `Visual.RipplePulse` | Animated ripple / live signal | ripple-specific structure | `active` | `any` |
| `Visual.Aggregate.Pulse` | Aggregate community pulse animation | aggregate-specific structure | `active` | `any` |
| `Visual.Chart.SentimentTrend` | Sentiment over time line chart | `value` (chart data) | `historical` | `any` |
| `Visual.Card.Base` | Base card visual container | `value`, `presentation` | `any` | `any` |

---

## Reusability Decision Tree

```
Is the structural rendering purpose identical to an existing element?
  YES → Reuse. Set data.title to snap-specific context. No new file.
  NO  → Is it 80% the same with one missing optional field?
          YES → Extend (add optional field). No new file.
          NO  → Create new element. Add row to this catalog after creation.
```

---

## Development Phase Note

During the active development phase (approx. Jun–Aug 2026), the element catalog is growing. The mobile app renders `ShadowFallbackMolecule` for unregistered types — **it does not crash**. New element type suggestions that don't appear in this catalog trigger a `NEW_ELEMENT_DEPENDENCY` warning, not a halt.
