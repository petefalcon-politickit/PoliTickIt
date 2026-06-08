---
name: polisnap-miner
description: "SKILL 1 of 4 — PoliSnap Generation Chain. Mines political events and content from real-world sources, producing raw PoliSnapSpawn bundles for downstream normalization. Supports event-category, structured-prompt, and freeform modes. Does NOT validate rep IDs, map elements, or construct snaps."
metadata:
    version: "1.0.0"
    owner: "politickit"
    tags:
        - polisnap
        - content-mining
        - political-events
---

# Skill: polisnap-miner

**Chain Position:** Step 1 of 4 — Signal Acquisition
**Input:** User prompt (event-category / structured-prompt / freeform)
**Output:** `SPAWN-{YYYYMMDD-HHMMSS}-{slug}.json` → `apps/skill-execution/PoliSnaps/spawn/`
**Feeds into:** `polisnap-normalizer`

---

## Scope Boundary

| OWNED by this skill | NOT owned — do not perform |
|---|---|
| Political content discovery | Rep ID validation |
| Source summarization | Policy area validation |
| Copyright classification | Element type mapping |
| Raw spawn bundle creation | PoliSnap JSON construction |
| Content signal tagging | `snapLibrary.ts` writing |

**Do not call Congress.gov API directly** — that is the normalizer's job via `_polisnap-data/congress-api.md`. This skill captures raw signal from publicly available web content; the normalizer does structured API lookups.

---

## Input Modes

### Mode 1 — Event Category

Select a predefined category. The skill applies the matching prompt template from the Prompt Templates section.

**Syntax:** `Mine [category] for [date / "today" / "this week"]`

| Category | Primary Sources | Cadence |
|---|---|---|
| `DailyCongressionalRecord` | Congress.gov daily digest, Congressional Record | Daily |
| `FloorVote` | Congress.gov votes, Senate/House vote records | Event-driven |
| `RepStatement` | Congressional press releases, C-SPAN, official .gov sites | Daily |
| `CommitteeHearing` | Congress.gov committee schedules, hearing transcripts | Weekly |
| `BillActivity` | Congress.gov bills API — introductions, amendments, passage | Daily |
| `ExecutiveAction` | WhiteHouse.gov, Federal Register | Event-driven |
| `GeneralPolitical` | AP Politics, Reuters Politics, wire services | Continuous |

### Mode 2 — Structured Prompt

Supply named fields. The skill infers any gaps.

```
topic: <what the content is about>
rep: <optional — name or Bioguide ID>
bill: <optional — bill number e.g. S.Res.45>
date-range: <optional — e.g. "last 7 days", "May 2026">
source-hint: <optional — preferred source domain>
```

### Mode 3 — Freeform

Open natural language prompt. The skill extracts all signal fields through inference.

**Example:** `What has John Thune said recently about Arctic drilling?`

Inferred fields: `rep=Thune`, `topic=Arctic drilling`, `date-range=recent`, `source-hint=congress.gov`

> Freeform is the lowest-precision mode. When content must be reliable, prefer Mode 1 or Mode 2.

---

## Copyright Protection Rules (MANDATORY — all modes)

### Classification

Every content item in the spawn output must receive a `copyrightFlag`:

| Flag | When | Max verbatim reproduction |
|---|---|---|
| `public-domain` | .gov sources: congress.gov, senate.gov, house.gov, whitehouse.gov, federalregister.gov | Full text permitted |
| `summarized` | News articles, third-party analysis, private publications | ≤50 words verbatim |
| `unknown` | Source type cannot be determined | ≤50 words verbatim — treat as `summarized` |

### Rules

1. **Never reproduce verbatim text blocks exceeding 50 words** from a `summarized` or `unknown` source.
2. **Congressional records are public domain** — full text from any .gov domain is permitted.
3. **Always record the source** — every content item must include `sourceUrl`, `sourceName`, and `accessDate`. These fields seed the `Trust.Thread` element downstream. If no URL is available, set `sourceUrl: null` and `copyrightFlag: "unknown"`.
4. **Faithful summarization** — do not paraphrase in a way that changes the source's position or meaning. Summaries must be neutral.
5. **Attributed quotes** — if a direct quote from a public figure is included, set `"quoteFlag": true` and include `quoteSpeaker`, `quoteDate`, and `quoteSourceUrl`.

---

## Content Signal Tagging (MANDATORY)

Every spawn must include a `contentSignal` field. This is consumed by the normalizer to evaluate SR-13 sentiment eligibility.

| Signal | Use when |
|---|---|
| `active` | Open bill, pending vote, active policy debate, upcoming hearing |
| `historical` | Closed vote, completed legislative session, past event |
| `editorial` | Op-ed, analysis, commentary — no live civic action possible |
| `biographical` | Rep profile, career summary, personal statement |

When uncertain between `active` and `historical`, default to `historical` — the normalizer can upgrade it based on Congress.gov status lookup.

---

## Output Contract

**File:** `SPAWN-{YYYYMMDD-HHMMSS}-{slug}.json`
**Location:** `apps/skill-execution/PoliSnaps/spawn/`
**Slug:** kebab-case topic summary, max 5 words (e.g., `arctic-drilling-ban`, `thune-floor-vote`, `warren-healthcare-statement`)

```json
{
  "spawnId": "SPAWN-20260530-143022-arctic-drilling-ban",
  "generatedAt": "2026-05-30T14:30:22Z",
  "mineMode": "event-category | structured-prompt | freeform",
  "contentSignal": "active | historical | editorial | biographical",
  "copyrightFlag": "public-domain | summarized | unknown",
  "topic": "Arctic National Wildlife Refuge drilling ban",
  "repMentions": ["John Thune"],
  "billReferences": ["S.Res.45"],
  "sourceUrl": "https://www.congress.gov/bill/119th-congress/senate-resolution/45",
  "sourceName": "Congress.gov",
  "accessDate": "2026-05-30",
  "rawTitle": "S. Res. 45 — Arctic Wilderness Protection",
  "rawSummary": "S. Res. 45 proposes a permanent ban on exploratory drilling within the Arctic National Wildlife Refuge. Introduced by Sen. John Thune on January 25, 2026. Currently in committee.",
  "quotes": [],
  "additionalSources": [],
  "parentSnapRef": null,
  "drillDownRole": null,
  "drillDownEntityId": null,
  "drillDownOpportunities": []
}
```

**`drillDownOpportunities[]` format** (populated on parent spawns with 2+ named entities):
```json
"drillDownOpportunities": [
  {
    "role": "RepFullSpeech | RepFullStatement | WitnessTestimony | BillDetail",
    "entityId": "<Bioguide ID if known — null otherwise>",
    "entityName": "<full name>",
    "childSpawnSlug": "<kebab-slug matching child spawn>",
    "childSpawnId": "<SPAWN-{timestamp}-{slug}>"
  }
]
```

**Child spawn additions** (set on child SPAWNs; `null` on parent/standalone spawns):
- `parentSnapRef`: SPAWN ID of the parent
- `drillDownRole`: role key from the Drill-Down Roles table
- `drillDownEntityId`: Bioguide ID or entity identifier (nullable)

> A single mine operation may produce multiple spawn files when the prompt yields multiple distinct content items (e.g., `DailyCongressionalRecord` may spawn 3–8 items, a `FloorVote` with 3 speakers produces 1 parent + 3 child spawns). Save each as a separate file with a unique `spawnId` and slug.

---

## Drill-Down Detection (MANDATORY for multi-entity events)

Certain event types surface multiple distinct entities — representatives giving speeches, witnesses testifying at a hearing, multiple bills in a digest. Each entity is a **drill-down opportunity**: a child snap that will be independently discoverable in the feed AND navigable from the parent.

### When to detect

Apply drill-down detection whenever the source event contains **2 or more** of the following within a single content item:
- Named representatives giving identified floor statements or full speeches
- Named committee witnesses giving full testimony statements
- Named bill references where each bill has its own distinct content (not just a list reference)

### What to produce

For each detected drill-down entity, produce a **separate child SPAWN file** in the same mining operation. Child spawns are **full independent spawns** — not drafts, not stubs. They go through the complete 4-skill chain and land in the Accountability feed as standalone snaps. The `parentSnapRef` is additive navigation metadata only; it does not gate the child snap's independence.

**Parent SPAWN** gets a `drillDownOpportunities[]` array listing each child slug and role:
```json
"drillDownOpportunities": [
  {
    "role": "RepFullSpeech",
    "entityId": "W000798",
    "entityName": "Tim Walberg",
    "childSpawnSlug": "walberg-hr2616-full-speech",
    "childSpawnId": "SPAWN-20260530-090100-walberg-hr2616-full-speech"
  },
  {
    "role": "RepFullSpeech",
    "entityId": "F000466",
    "entityName": "Brian Fitzpatrick",
    "childSpawnSlug": "fitzpatrick-hr2616-full-speech",
    "childSpawnId": "SPAWN-20260530-090101-fitzpatrick-hr2616-full-speech"
  }
]
```

**Child SPAWN** gets a `parentSnapRef` field pointing back to the parent slug and a `drillDownRole` describing its place in the chain:
```json
"parentSnapRef": "SPAWN-20260530-090001-hr2616-floor-debate",
"drillDownRole": "RepFullSpeech",
"drillDownEntityId": "W000798"
```

### Child SPAWN slug format

```
{rep-last-name}-{bill-slug}-{role-slug}
```
Examples:
- `walberg-hr2616-full-speech`
- `pallone-hr2616-full-speech`
- `cassidy-sjres185-full-testimony`

### Drill-Down Roles

| Role key | When to use | Typical child snap type |
|---|---|---|
| `RepFullSpeech` | Rep gave a complete or substantial floor speech on a bill | `Narrative.Congressional.Statement` as primary element |
| `RepFullStatement` | Rep gave a statement shorter than a full speech (press release, floor remark) | `Narrative.Congressional.Statement` |
| `WitnessTestimony` | Named witness gave testimony at a committee hearing | `Narrative.Congressional.Statement` |
| `BillDetail` | Digest item references a specific bill with enough content for its own snap | `Narrative.Insight.Summary` + `Metric.Progress.Stepper` |

### Mining order

Always produce child SPAWNs **before** writing the parent SPAWN file. The parent's `drillDownOpportunities[].childSpawnId` fields must reference existing spawn IDs.

---

## Prompt Templates

> Phase 2 templates. Apply as the starting basis and adapt to live source data.

### DailyCongressionalRecord
```
Summarize today's Congressional Record activity. For each item provide:
- Bill number or vote ID
- Primary sponsor or voting representative name
- One-sentence neutral summary (public domain — full text permitted)
- Congress.gov source URL
- Whether the item is active (pending action) or historical (completed)
Produce one spawn object per distinct item.
```

### FloorVote
```
Find the most recent floor vote on [bill/topic]. Provide:
- Vote result (passed / failed / tabled)
- Yea / Nay / Abstained counts
- Bill name and number
- Voting date
- Congress.gov source URL
Flag contentSignal as "active" if the bill has further pending action, otherwise "historical".
```

### RepStatement
```
Find recent public statements by [rep name] regarding [topic].
For each statement: summarize in ≤50 words (do not reproduce >50 verbatim from non-.gov sources),
include the date, venue or publication, and source URL.
Set copyrightFlag to "public-domain" for .gov sources, "summarized" for all others.
```

### BillActivity
```
Summarize the current status of [bill number].
Include: current stage, committee assignment, last action date, primary sponsor.
Source: congress.gov. Full text permitted (public domain).
Set contentSignal to "active" if the bill has not yet passed or failed.
```

### CommitteeHearing
```
Find scheduled or recent committee hearings on [topic or committee name].
For each: committee name, hearing date, subject, key witnesses if available, source URL.
Set contentSignal to "active" for future hearings, "historical" for completed ones.
```

### GeneralPolitical
```
Find the most significant political developments regarding [topic] in the last [timeframe].
For each: title, one-sentence summary, source name, source URL.
Apply copyrightFlag: "public-domain" for .gov sources, "summarized" for news sources.
```

### RepFullSpeech *(child snap template — used during Drill-Down Detection)*
```
Find the complete or most substantial floor speech given by [rep name] on [bill/topic] on [date].
Include:
- Full or near-complete verbatim text if sourced from the Congressional Record (.gov — public domain)
- Speaker name, party, state, title/role
- Date and venue (chamber + session)
- Congress.gov or congressional record source URL
Set copyrightFlag: "public-domain" (Congressional Record is always public domain).
Set contentSignal: same as parent FloorVote/FloorDebate spawn (active or historical).
Set drillDownRole: "RepFullSpeech"
```

### CommitteeStatement *(child snap template — used during Drill-Down Detection)*
```
Find the complete or most substantial committee testimony or opening statement given by [witness/rep name]
at [committee name] hearing on [date] regarding [topic].
Include:
- Full or summarized testimony (public domain if from official hearing record)
- Witness name, affiliation, role
- Committee name, hearing date, source URL
Set copyrightFlag: "public-domain" for official hearing records; "summarized" for third-party coverage.
Set contentSignal: "historical" (testimony is always a completed event).
Set drillDownRole: "WitnessTestimony"
```

---

## Forbidden Patterns

| Pattern | Consequence |
|---|---|
| Reproducing >50 verbatim words from a non-.gov source | Copyright infringement risk. Always summarize. |
| Omitting `sourceUrl` or `sourceName` | Breaks the `Trust.Thread` chain — downstream distributor cannot produce a provenance footer. |
| Performing rep ID validation or policy area validation | That is the normalizer's job — do not duplicate. |
| Calling the Congress.gov v3 API directly | That is the normalizer's job via `_polisnap-data/congress-api.md`. |
| Setting `contentSignal` on an item without evaluating it | Every item must be classified. Default to `historical` if uncertain. |
| Writing the parent SPAWN before child SPAWNs when drill-down opportunities are detected | Parent's `drillDownOpportunities[].childSpawnId` fields must reference existing spawn IDs. Always write children first. |
| Omitting `drillDownOpportunities[]` from a parent SPAWN that contains 2+ named speakers or witnesses | Missed drill-down opportunities mean the feed never surfaces individual speech snaps. Always run Drill-Down Detection on multi-entity events. |

---

## Handoff

After writing the spawn file(s), present:
1. File path(s) written to `spawn/` — list children before parent
2. One-line content summary per spawn
3. Drill-down opportunities detected (if any) — list entity name + role + child spawn ID for each
4. Any copyright flags that are `summarized` or `unknown`
5. Next step: `Normalize [parentSpawnId]` (normalize children first, then parent)
