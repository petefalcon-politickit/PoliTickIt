# Category 2 — Rep Bill Position / Statement

**Snap Type:** `Rep Bill Position` / `Rep Full Speech (Drill-Down Child)`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-event — triggered by a notable vote, press statement, or floor speech by a single representative
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Anchors a single representative to a specific bill or policy position. This is the most flexible accountability snap — it works for:

1. **A senator's official position** on a bill they sponsored, co-sponsored, or voted on
2. **A floor speech drill-down** — a child snap auto-generated from a floor debate parent, containing the rep's full speech text
3. **A press-release statement** — when a rep makes a formal public statement about legislation

The citizen sees: Who is this rep? What is their position? What did they actually say? What stage is the bill at? And can vote their own sentiment.

---

## Variants

### Variant A — Senator/Rep Statement (Standalone)

Used for official press office statements, notable votes, or policy positions. The primary stand-alone snap type for single-rep accountability.

**Example:** `snap-sjres12-thune-iran-senate-vote`, `acc-pulse-arctic-res`

### Variant B — Rep Full Speech (Drill-Down Child)

Auto-generated as a **child snap** when the floor-debate miner detects 2+ substantive speeches. Contains the full verbatim speech from the Congressional Record. Appears standalone in the feed AND is navigable via tap from the parent floor-debate snap.

**Template:** `rep-full-speech.template.json`
**Example snap ID pattern:** `snap-walberg-hr2616-full-speech`

---

## Element Stack — Variant A (Standalone Statement)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor — photo, name, party, location, title | Required |
| 2 | `Narrative.Congressional.Statement` | Verbatim quote or key excerpt from their statement | Conditional (if statement text available) |
| 3 | `Metric.Progress.Stepper` | Bill legislative stage (Introduced → Committee → Floor → Law) | High confidence |
| 4 | `Interaction.Sentiment.Pulse` | Citizen poll on the policy position | Conditional (`contentSignal = active`) |
| 5 | `Trust.Thread` | Source provenance — Congress.gov, senate.gov/house.gov press office | Required |

### Element Stack — Variant B (Drill-Down Child)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Narrative.Congressional.Statement` | Full speech text from Congressional Record (150–600 words) | Required |
| 3 | `Metric.Progress.Stepper` | Bill context (bill ID, stage) | High confidence |
| 4 | `Interaction.Sentiment.Pulse` | "Does this speech change your view on X?" | Conditional |
| 5 | `Trust.Thread` | Source: Congressional Record URL | Required |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **Congress.gov** | Bill status, sponsor info, vote records, policy area | `https://api.congress.gov/v3/bill/{congress}/{type}/{number}` |
| **Senate.gov press offices** | Official senator statements, press releases | `https://www.{senator}.senate.gov/public/index.cfm/press-releases` |
| **House.gov press offices** | Official representative statements | `https://www.{rep}.house.gov/newsroom/press-releases` |
| **GovInfo.gov / Congressional Record** | Full speech text (for Variant B drill-down) | `https://api.govinfo.gov/search?query={name}+{bill}&docClass=CREC` |
| **`representatives.md`** | Bioguide ID, party, state, district | Local skill data file |

---

## Snap ID Patterns

**Variant A (Standalone):**
```
snap-{billIdSlug}-{repLastName}-{eventType}
```
Examples:
- `snap-sjres12-thune-iran-senate-vote`
- `snap-sres45-thune-bill-position`

**Variant B (Drill-Down Child):**
```
snap-{repLastName}-{billIdSlug}-full-speech
```
Examples:
- `snap-walberg-hr2616-full-speech`
- `snap-pallone-hr2616-full-speech`
- `snap-duckworth-sjres185-full-speech`

---

## Recurring Generation Procedure

### When to Generate

- A notable roll call vote occurs (check Senate.gov or House Clerk daily vote records)
- A rep makes a high-profile floor speech or public statement on significant legislation
- Automatically triggered by the floor-debate miner when drill-down detection fires

### Stage 1 — Mine

- `mineMode: "freeform"` for Variant A (pull from press releases + Congress.gov)
- `mineMode: "structured"` for Variant B (text already extracted by floor-debate miner)
- For Variant B: set `parentSnapRef` to the parent SPAWN ID, `drillDownRole: "RepFullSpeech"`
- `contentSignal: "active"` if vote/statement occurred in the last 7 days; else `"historical"`

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- `validatedRepresentativeId`: single rep bioguide ID
- `Header.Representative` required (not `Header.Bill` — rep-centric snap)
- For Variant B: `snapRelationshipRole: "child"`, record `parentSnapRef` + `drillDownRole`
- `sentimentEligible: true` when `contentSignal = "active"`

### Stage 3 — Generate

- **Variant A**: Use template `senator-statement.template.json`
- **Variant B**: Use template `rep-full-speech.template.json`
- `Narrative.Congressional.Statement.statementText`: verbatim — no paraphrasing
- `Metric.Progress.Stepper`: derive from Congress.gov bill status
- `Trust.Thread.sources[]`: cite the press release URL or Congressional Record URL
- `verificationLevel: "Tier 3"` for government sources; `"VERIFIED"` when both CR + Congress.gov cited

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- For Variant B: distribute before the parent floor-debate snap (child-first ordering)
- After distribution: parent snap's `fullSpeechSnapId` is backfilled by distributor Step 5c

---

## Existing Production Examples

| Snap ID | Rep | Bill | Variant | Notes |
|---|---|---|---|---|
| `snap-sjres12-thune-iran-senate-vote` | Sen. John Thune | S.J.Res.12 | A — Standalone | Senate Majority Leader position on Iran AUMF |
| `acc-pulse-arctic-res` | Sen. John Thune | S. Res. 45 | A — Standalone | Arctic drilling ban bill position + stepper |

---

## Prompt Invocation

**Cold-start stub for a standalone rep statement:**

```
Generate a rep bill position PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [PARTY], [STATE/DISTRICT]
Bill: [BILL_ID] — [BILL_SHORT_TITLE]
Event: [brief description — e.g., "Voted Yea on final passage, May 20, 2026"]
Statement source: [URL of press release or Congressional Record link]
Statement text: "[paste key quote or mark as 'fetch from source']"

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Template: senator-statement.template.json
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-[billIdSlug]-[repLastName]-[eventType]
```

**Cold-start stub for a drill-down child (full speech):**

```
Generate a rep full speech drill-down child PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID])
Bill: [BILL_ID] — [BILL_SHORT_TITLE]
Parent snap: [PARENT_SNAP_ID] (floor debate snap this drills down from)
Speech source: Congressional Record — [DATE]
Speech text: "[paste full speech or 'fetch from GovInfo.gov']"
drillDownRole: RepFullSpeech

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Template: rep-full-speech.template.json
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-[repLastName]-[billIdSlug]-full-speech
Distribute BEFORE parent snap. Distributor must backfill fullSpeechSnapId in parent after distribution.
```

---

## Content Quality Rules

- **Quote text**: Must be verbatim from the official source — not summarized or paraphrased
- **Rep position**: Derive from the vote record or explicit statement text (don't infer from party)
- **Bill stage**: Use Congress.gov API for the current stage at time of snap creation
- **Sentiment question**: Policy-focused — "Do you support X policy?" not "Do you support Rep. Y?"
- **Full speech (Variant B)**: Minimum 150 words. If speech is shorter, use full verbatim. If longer than 600 words, use first substantial section + note "[excerpt]"
