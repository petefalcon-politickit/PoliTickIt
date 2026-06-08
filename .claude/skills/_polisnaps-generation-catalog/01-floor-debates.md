# Category 1 — Congressional Floor Debates

**Snap Type:** `Floor Debate`
**Feed Section:** `accountabilitySnaps`
**Schedule:** Daily on congressional session days
**Prompt File:** `c:\Projects\Alithix\Genotype\.github\prompts\daily-floor-debates.prompt.md` ✅ (production-ready)

---

## Purpose

Surfaces the top congressional floor debates from the prior day's Congressional Record. Each snap represents a single bill that received significant floor attention — with attributed speaker quotes (For/Against), vote outcome, and a public sentiment pulse. This is the highest-frequency snap type and the most direct accountability signal in the feed.

Supports **drill-down navigation**: if 2+ reps gave substantive speeches, child snaps (`rep-full-speech` template) are auto-generated for each speaker, making the full speech available as a standalone snap AND tappable from the parent.

---

## Element Stack

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Bill` | Bill identity anchor — ID, title, chamber, status, vote date | Required |
| 2 | `Data.FloorDebate` | Structured speaker table (up to 3) with quotes, positions, vote tally | Required |
| 3 | `Narrative.Insight.Summary` | 2–3 sentence plain-English bill description and context | Required |
| 4 | `Navigation.SnapLinks` | Tappable links to child full-speech snaps | Conditional (when drill-down detected) |
| 5 | `Interaction.Sentiment.Pulse` | Citizen poll — "Do you support this bill?" | Conditional (`contentSignal = active`) |
| 6 | `Trust.Thread` | Source provenance — Congress.gov + GovInfo.gov Congressional Record | Required |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **Congress.gov API** | Bill metadata, vote outcomes, bill status, policy area, last action date | `https://api.congress.gov/v3/congressional-record?y={Y}&m={M}&d={D}&api_key={KEY}` |
| **GovInfo.gov API** | Full Congressional Record text — speaker attribution, verbatim quotes | `https://api.govinfo.gov/search?query={bill}+floor&docClass=CREC` |
| **Congress.gov Member API** | Rep bioguide IDs, party, state, district | `https://api.congress.gov/v3/member/{bioguideId}` |
| **`representatives.md`** | Local cache of bioguide IDs for fast name → ID resolution | Local skill data file |

**API Key (Congress.gov):** `da8cb9e9-19ac-4e33-9a4a-81a3bc44c8a2`

---

## Snap ID Pattern

```
snap-{billIdSlug}-floor-debate-{YYYYMMDD}
```

Examples:
- `snap-sjres185-floor-debate-20260519`
- `snap-hr2616-floor-debate-20260520`
- `snap-hr1329-floor-debate-20260521`

---

## Recurring Generation Procedure

### Pre-flight

1. Confirm congress is in session (check Congress.gov for recess schedule)
2. Target date = yesterday (`current_date - 1 day`)
3. Load the 4 skill files + 4 data reference files (once, reuse for all bills)

### Stage 0 — Fetch & Rank

1. `GET /v3/congressional-record` for target date → get Senate + House proceedings links
2. `GET` each proceedings link → extract all floor debate items
3. For each candidate bill, `GET` full CR text from GovInfo.gov → extract speakers + quotes
4. Score bills by unique speaker count (minimum 3)
5. Select top 5 (or `--limit N`)
6. Show the user a ranked manifest table before proceeding

### Stage 1 — Mine (per bill)

- `mineMode: "structured"` (data is pre-structured from Stage 0)
- SPAWN slug: `{YYYYMMDD-HHMMSS}-{billIdSlug}-floor-debate`
- Carry full speakers array (`quote` + `summary` per speaker) into SPAWN
- Set `contentSignal: "active"` if last action ≤ 1 day ago, else `"historical"`
- **Drill-down detection**: if 2+ speakers gave substantive speeches (>2 sentences), create child SPAWN files with `parentSnapRef` + `drillDownRole: "RepFullSpeech"` — one per speaker

### Stage 2 — Normalize (per bill)

- `snapCategory: "Accountability"` (always)
- `validatedRepresentativeId` = bioguide of first `For` speaker; rest → `additionalRepIds[]`
- `Header.Bill` replaces `Header.Representative` (bill-centric snap)
- `sentimentEligible: true` only when `contentSignal = "active"`
- If drill-down detected: set `snapRelationshipRole: "parent"`, populate `suggestedChildSnaps[]`

### Stage 3 — Generate (per bill)

- Use template: `floor-debate.template.json`
- `Data.FloorDebate.speakers[]` — max 3; prioritize For/Against balance
- Add `Navigation.SnapLinks` element when `suggestedChildSnaps[]` is non-empty (before Sentiment Pulse)
- All `fullSpeechSnapId` values = `null` at generation time (distributor backfills)
- `Trust.Thread` sources[]: `Congress.gov` + `GovInfo.gov Congressional Record`
- `verificationLevel: "Tier 3"`

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend in reverse rank order (rank 5 first → rank 1 lands at position [0])
- **Child-first ordering**: distribute all child (full-speech) snaps before parent
- After each child distribution: backfill `fullSpeechSnapId` + `Navigation.SnapLinks[].snapId` in parent
- Write DIST audit record per snap

---

## Drill-Down Child Snaps

When a floor debate has 2+ substantive speeches, auto-generate `rep-full-speech` template child snaps:

- **Child snap category**: See [02-rep-bill-position.md](02-rep-bill-position.md) — "Rep Full Speech (Drill-Down Child)"
- **Child snap ID pattern**: `snap-{repLastName}-{billIdSlug}-full-speech`
- **Distribute children before parent**
- Children appear independently at the top of the Accountability feed

---

## Existing Production Examples

| Snap ID | Bill | Vote Outcome | Date |
|---|---|---|---|
| `snap-sjres185-floor-debate-20260519` | S.J.Res.185 — Remove US Forces from Iran | Agreed to (50-47) | 2026-05-19 |
| `snap-hr2616-floor-debate-20260520` | H.R.2616 — PROTECT Kids Act | Passed House | 2026-05-20 |
| `snap-hr1329-floor-debate-20260521` | H.R.1329 — PORTS Act | Passed House | 2026-05-21 |
| `snap-hr1041-floor-debate-20260521` | H.R.1041 — Protecting Hunting Heritage | Passed House | 2026-05-21 |
| `snap-hr6644-floor-debate-20260520` | H.R.6644 — Improving Seniors' Timely Access to Care | Passed House | 2026-05-20 |

---

## Prompt Invocation

The production prompt already exists. Use it directly:

```
/daily-floor-debates                        ← yesterday's debates (default)
/daily-floor-debates 2026-05-29             ← specific date
/daily-floor-debates --chamber senate       ← Senate only
/daily-floor-debates --chamber house        ← House only
/daily-floor-debates --limit 3              ← top 3 only
```

To generate for a **specific known bill** (not automated harvest):

```
Generate a floor debate PoliSnap for [BILL_ID] debated on [DATE].
Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Template: floor-debate.template.json
Source: Congress.gov bill page + GovInfo.gov Congressional Record for [DATE].
Snap ID: snap-[billIdSlug]-floor-debate-[YYYYMMDD]
Target array: accountabilitySnaps in snapLibrary.ts
```

---

## Content Quality Rules

- **Speaker quotes**: Must be verbatim from the Congressional Record — no paraphrasing
- **Vote outcome**: Use exact official tally from Senate.gov or House Clerk records
- **Bill title**: Use the official enrolled title from Congress.gov, not news headlines
- **Summary text**: Plain English — assume reader has no legislative knowledge; explain why it matters
- **Sentiment question**: Policy-focused ("Do you support X?") — never partisan or personal
- **Max 3 speakers** in `Data.FloorDebate`: prioritize 1 For + 1 Against + 1 notable (leadership or swing vote)

---

## Known Limitations

- Congress.gov API may be delayed 12–24 hours on same-day records
- GovInfo.gov full-text indexing can lag 48 hours for new CR entries
- On recess days: no floor debates — prompt fallback prints a recess warning and stops
- Bioguide resolution fails for non-voting delegates and some territorial representatives — use best available name match
