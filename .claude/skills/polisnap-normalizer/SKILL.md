---
name: polisnap-normalizer
description: "SKILL 2 of 4 — PoliSnap Generation Chain. Validates, cross-references, and element-maps a PoliSnapSpawn bundle. Produces a PoliSnapNormalized document ready for snap construction. Owns ALL validation logic and external data lookups — no other skill in the chain validates."
metadata:
    version: "1.0.0"
    owner: "politickit"
    tags:
        - polisnap
        - normalization
        - validation
---

# Skill: polisnap-normalizer

**Chain Position:** Step 2 of 4 — Validation & Cross-Reference
**Input:** `SPAWN-{id}.json` from `apps/skill-execution/PoliSnaps/spawn/`
**Output:** `NORM-{YYYYMMDD-HHMMSS}-{slug}.json` → `apps/skill-execution/PoliSnaps/normalized/`
**Feeds into:** `polisnap-generator`

---

## Scope Boundary

| OWNED by this skill | NOT owned — do not perform |
|---|---|
| Rep ID validation and resolution | Content discovery |
| Policy area label validation | PoliSnap JSON construction |
| Congress.gov cross-reference (bill/vote lookup) | PoliElement `.tsx` file creation |
| Element reuse analysis | `snapLibrary.ts` writing |
| SR-13 sentiment eligibility pre-evaluation | |
| Snap category determination | |
| Trust verification level assignment | |
| `NEW_ELEMENT_DEPENDENCY` warning emission | |

---

## External Data Sources

All reference data lives in `.github/skills/_polisnap-data/`. Read these files for each normalization run. These are today's implementation — they will be replaced by live API/MCP tools as the platform matures.

| File | Purpose |
|---|---|
| `_polisnap-data/representatives.md` | Canonical Bioguide ID table — validate and resolve rep names |
| `_polisnap-data/policy-areas.md` | Exact valid policy area labels + alias resolutions |
| `_polisnap-data/element-catalog.md` | Registered element types + reusability metadata |
| `_polisnap-data/congress-api.md` | Congress.gov v3 API endpoints and bill number format |

---

## Normalization Procedure

### Step 1 — Read Spawn File

Load the SPAWN JSON from `apps/skill-execution/PoliSnaps/spawn/`. Confirm these fields exist before proceeding:
- `spawnId`, `contentSignal`, `copyrightFlag`, `rawSummary`, `rawTitle`

If any are missing, halt and report: `MALFORMED_SPAWN — missing required field: {fieldName}`.

### Step 2 — Resolve Representative ID

Read `_polisnap-data/representatives.md`.

- For each entry in `repMentions[]`: resolve the name/alias to a canonical Bioguide ID.
- If resolved: set `validatedRepresentativeId` to the primary rep's ID. List secondary reps in `additionalRepIds[]`.
- If NOT found in the table:
  - Emit `UNKNOWN_REPRESENTATIVE` warning.
  - Set `validatedRepresentativeId: null`.
  - **Do not halt** — the snap may still be generated but will be hidden by the rep filter until the rep is added.
- If `repMentions[]` is empty: set `validatedRepresentativeId: null` (multi-rep or no-rep snap).

### Step 3 — Validate Policy Area

Read `_polisnap-data/policy-areas.md`.

- Map the spawn `topic` to the closest matching label.
- Apply alias resolutions silently (e.g., "Infrastructure" → `"Transportation and Public Works"`).
- Label must match exactly (case-sensitive).
- If no match can be determined: emit `UNKNOWN_POLICY_AREA` warning. Set `validatedPolicyArea: null`. **Do not halt.**

### Step 3b — Resolve Drill-Down Relationships

Check the spawn for `drillDownOpportunities[]` and `parentSnapRef`.

**For parent spawns** (`drillDownOpportunities[]` is non-empty):
- Record the full `drillDownOpportunities[]` array as-is into `suggestedChildSnaps[]` in the normalized output.
- Child snaps are **independent** and will each go through their own full normalization run. This step only records the relationship for the generator to use.
- Set `snapRelationshipRole: "parent"` in the normalized output.

**For child spawns** (`parentSnapRef` is non-null):
- Record `parentSnapRef` and `drillDownRole` in the normalized output.
- Inherit `validatedPolicyArea` and `billReferences` from the parent if the child lacks them (check spawn fields first).
- Set `snapRelationshipRole: "child"` in the normalized output.
- `validatedRepresentativeId` is resolved independently from the child spawn's `drillDownEntityId` or `repMentions[]`. Do NOT inherit from parent.

**For standalone spawns** (neither field present):
- Set `snapRelationshipRole: null`, `suggestedChildSnaps: []`, `parentSnapRef: null`.

> Drill-down relationships are **navigation metadata only**. They do not affect snap category determination, element mapping, sentiment eligibility, or any other normalization decision. A child snap is a full independent snap that happens to link back to a parent.



Read `_polisnap-data/congress-api.md` for endpoint details.

For each entry in `billReferences[]`:
- Normalize bill number format (e.g., `"S. Res. 45"` → `sres/45`).
- Call `GET /bill/{congress}/{billType}/{billNumber}` against the Congress.gov v3 API.
- On success: populate `canonicalBillId`, `billTitle`, `billStatus`, `lastActionDate`, `sponsor`.
- On `404` or API failure: emit `BILL_NOT_FOUND` warning with the raw reference. Use `rawTitle` as fallback title. **Do not halt.**

### Step 5 — Determine Snap Category

| Category | Use when |
|---|---|
| `Accountability` | Rep votes, bill positions, FEC/finance, corruption, attendance records |
| `Knowledge` | Policy explainers, bill summaries, committee activity, hearings |
| `Economics` | Economic data, district funding, budget, trade figures |
| `Community` | Public sentiment, events, civic participation, local impact |

### Step 6 — Element Mapping

Read `_polisnap-data/element-catalog.md`.

Build `suggestedElements[]` using the content signal mapping below. Order elements in the sequence they should appear in the snap.

**Mandatory elements — always evaluate:**

| Condition | Element | Position |
|---|---|---|
| `validatedRepresentativeId` is set (single rep) | `Header.Representative` | First |
| `sourceUrl` is present in the spawn | `Trust.Thread` | Last |

**Content-driven elements — infer from spawn:**

| Content signal in spawn | Suggested element | Confidence |
|---|---|---|
| Bill summary / description text | `Narrative.Insight.Summary` | `high` |
| Legislative stage / progress data | `Metric.Progress.Stepper` | `high` |
| Vote result (Yea/Nay/count) | `Data.BillVote` | `high` |
| Direct quote / floor statement | `Narrative.Congressional.Statement` | `high` |
| Economic figures / stats | `Metric.Group` or `Metric.Dual.Comparison` | `medium` |
| Hearing / event details | `Narrative.Event.Details` | `high` |
| Voting history record | `data.legislative.votingrecord` | `medium` |
| Weekly summary digest | `Metric.Congressional.WeeklySummary` | `medium` |

**SR-13 Sentiment Eligibility Pre-Evaluation:**

Set `sentimentEligible: true` ONLY if ALL three conditions pass:
1. `contentSignal` is `"active"`
2. No other `Interaction.*` element is already in `suggestedElements[]`
3. Content is not purely editorial or biographical

If eligible, add `Interaction.Sentiment.Pulse` to `suggestedElements[]` as the second-to-last element (before `Trust.Thread`).

**NEW_ELEMENT_DEPENDENCY Check:**

For each element type in `suggestedElements[]`, verify it exists in `_polisnap-data/element-catalog.md`.
- If NOT found: do **not** remove it from suggestions. Emit a `NEW_ELEMENT_DEPENDENCY` warning.
- The app renders `ShadowFallbackMolecule` for unknown types — **it does not crash**.
- This is expected and acceptable during the active development phase (Jun–Aug 2026).

### Step 7 — Compose Normalized Titles

Apply SR-11 rules (from `polisnap-generator`):
- `normalizedTitle`: categorical, action-oriented, ≤50 chars, no proper nouns (e.g., `"Bill Position"`, `"Floor Vote"`, `"Committee Hearing"`)
- `normalizedSubtitle`: the subject proper noun — bill name, topic, district (e.g., `"S. Res. 45 — Arctic Wilderness Protection"`)

### Step 8 — Determine Trust Verification Level

Based on `sourceName` / `sourceUrl` from the spawn:

| Level | Source |
|---|---|
| `Tier 3` | congress.gov, senate.gov, house.gov, whitehouse.gov, federalregister.gov |
| `Tier 2` | CBO, GAO, FEC, SEC filings, official government agencies |
| `Tier 1` | AP, Reuters, major verified news outlets, verified NGOs |
| `VERIFIED` | PoliTickIt internal aggregation with multiple corroborating sources |

### Step 9 — Write Normalized File

**File:** `NORM-{YYYYMMDD-HHMMSS}-{slug}.json`
**Location:** `apps/skill-execution/PoliSnaps/normalized/`
**Slug:** carry forward from the spawn slug.

---

## Normalized Output Schema

```json
{
  "normId": "NORM-20260530-143045-arctic-drilling-ban",
  "spawnRef": "SPAWN-20260530-143022-arctic-drilling-ban",
  "generatedAt": "2026-05-30T14:30:45Z",
  "validatedRepresentativeId": "T000250",
  "additionalRepIds": [],
  "validatedPolicyArea": "Public Lands and Natural Resources",
  "canonicalBillId": "S.Res.45",
  "billTitle": "Arctic Wilderness Protection Resolution",
  "billStatus": "In Committee",
  "lastActionDate": "2026-02-10",
  "snapCategory": "Accountability",
  "contentSignal": "active",
  "copyrightFlag": "public-domain",
  "sentimentEligible": true,
  "snapRelationshipRole": "parent | child | null",
  "parentSnapRef": null,
  "drillDownRole": null,
  "suggestedChildSnaps": [
    {
      "role": "RepFullSpeech",
      "entityId": "W000798",
      "entityName": "Tim Walberg",
      "childSpawnSlug": "walberg-hr2616-full-speech",
      "childSpawnId": "SPAWN-20260530-090100-walberg-hr2616-full-speech"
    }
  ],
  "suggestedElements": [
    { "type": "Header.Representative", "confidence": "required", "reason": "Single rep snap — SR-9" },
    { "type": "Narrative.Insight.Summary", "confidence": "high", "reason": "Bill summary text present in spawn" },
    { "type": "Metric.Progress.Stepper", "confidence": "high", "reason": "Legislative stage available from Congress.gov" },
    { "type": "Interaction.Sentiment.Pulse", "confidence": "eligible", "reason": "SR-13: contentSignal=active, no other Interaction.* elements" },
    { "type": "Trust.Thread", "confidence": "required", "reason": "sourceUrl present in spawn" }
  ],
  "warnings": [],
  "normalizedTitle": "Bill Position",
  "normalizedSubtitle": "S. Res. 45 — Arctic Wilderness Protection",
  "trustVerificationLevel": "Tier 3",
  "sourceUrl": "https://www.congress.gov/bill/119th-congress/senate-resolution/45",
  "sourceName": "Congress.gov",
  "accessDate": "2026-05-30",
  "rawSummary": "S. Res. 45 proposes a permanent ban on exploratory drilling within the Arctic National Wildlife Refuge."
}
```

---

## Warning Schema

```json
{
  "code": "NEW_ELEMENT_DEPENDENCY | UNKNOWN_REPRESENTATIVE | UNKNOWN_POLICY_AREA | BILL_NOT_FOUND | MALFORMED_SPAWN",
  "elementType": "Interaction.NewThing",
  "message": "Human-readable explanation",
  "action": "Recommended resolution step",
  "blocksExecution": false
}
```

> All warnings are **non-blocking** during the active development phase. The generator will read and display them.

---

## Forbidden Patterns

| Pattern | Consequence |
|---|---|
| Halting on `NEW_ELEMENT_DEPENDENCY` | Blocks valid snap generation. The app handles unknown elements gracefully. Report and continue. |
| Performing element type mapping without reading `_polisnap-data/element-catalog.md` | Risk of suggesting deprecated or mis-cased type strings that cause silent render failures. |
| Modifying `snapLibrary.ts` | That is the distributor's sole responsibility. |
| Adding inline rep tables or policy area lists (instead of reading `_polisnap-data/`) | Creates drift between the data source and the skill logic. Always read the external files. |
| Inheriting `validatedRepresentativeId` from a parent spawn onto a child spawn | Each child snap's rep ID must be independently resolved. Children are standalone snaps — their identity anchors are their own. |
| Treating `snapRelationshipRole: "child"` as grounds to skip any normalization step | Children go through the full 9-step normalization procedure. The relationship role is additive metadata only. |

---

## Handoff

After writing the normalized file, present:
1. The norm file path
2. A summary of validated fields (rep ID, policy area, bill status)
3. The `suggestedElements[]` list
4. Drill-down summary: `snapRelationshipRole`, number of `suggestedChildSnaps[]` (parent), or `parentSnapRef` + `drillDownRole` (child)
5. Any warnings with their resolution hints
6. Next step:
   - If this is a **child** snap: `Generate [normId]` (distribute before parent)
   - If this is a **parent** snap: `Generate [normId]` (distribute after all children)
