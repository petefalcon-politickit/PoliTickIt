---
name: polisnap-distributor
description: "SKILL 4 of 4 — PoliSnap Generation Chain. Distributes a constructed PoliSnap to the correct category array in snapLibrary.ts, assigns channel partitions, and writes a distribution audit record. The ONLY skill that writes to snapLibrary.ts."
metadata:
    version: "1.1.0"
    owner: "politickit"
    tags:
        - polisnap
        - distribution
        - snap-library
        - data-files
---

# Skill: polisnap-distributor

**Chain Position:** Step 4 of 4 — Channel Delivery
**Input:** `SNAP-{id}.json` from `apps/skill-execution/PoliSnaps/constructed/`
**Output (dual-write):**
- `apps/mobile/constants/snapLibrary.ts` — prepended to category array (mobile feed)
- `apps/services/PoliTickIt.Api/Data/snaps/{snapId}.json` — API data file (hot-reload source)
- `DIST-{YYYYMMDD-HHMMSS}-{snapId}.json` → `apps/skill-execution/PoliSnaps/distributed/`

---

## Scope Boundary

This is the **only skill in the chain that writes to `snapLibrary.ts`**.

| OWNED by this skill | NOT owned — do not perform |
|---|---|
| Category array routing | Content discovery |
| `snapLibrary.ts` prepend | Rep ID or policy area validation |
| API data file write | Element `.tsx` file creation |
| Channel partition assignment | PoliSnap JSON construction |
| Distribution audit record | |

---

## Distribution Procedure

### Step 1 — Read Constructed Snap

Load the SNAP JSON from `apps/skill-execution/PoliSnaps/constructed/`.

### Step 2 — Pre-Distribution Validation

Confirm these fields exist and are non-empty before writing. If any are missing, halt and report — do NOT write a partial snap to `snapLibrary.ts`.

| Field | Required | Check |
|---|---|---|
| `id` | Yes | Unique, non-empty string |
| `type` | Yes | One of: `Accountability`, `Knowledge`, `Economics`, `Community` |
| `elements[]` | Yes | At least one element present |
| `createdAt` | Yes | Must be an ISO timestamp; set to `new Date().toISOString()` if absent |
| `metadata.representativeId` OR `metadata.policyArea` | At least one | Routing anchor required |

### Step 3 — Map to Category Array

| Snap `type` | Target array in `snapLibrary.ts` |
|---|---|
| `Accountability` | `accountabilitySnaps` |
| `Knowledge` | `knowledgeSnaps` |
| `Economics` | `economicsSnaps` |
| `Community` | `accountabilitySnaps` *(use until a `communitySnaps` array is created)* |

### Step 4 — Prepend to Category Array (MANDATORY)

Read `apps/mobile/constants/snapLibrary.ts`. Insert the new snap as the **first element** of the target array.

```typescript
// CORRECT — prepend
export const accountabilitySnaps = [
  { id: "new-snap-id", ... },   // ← inserted here
  ...existingSnaps
];

// WRONG — never append
export const accountabilitySnaps = [
  ...existingSnaps,
  { id: "new-snap-id", ... }   // ← invisible to test user
];
```

The feed sorts by `createdAt` descending — prepending with `new Date().toISOString()` guarantees the snap surfaces at the top of the feed immediately.

**Do NOT add the snap directly to `allCandidateSnaps`** — it spreads from the category arrays automatically.

### Step 5 — Assign Channel Partitions

Record the channel partitions in the distribution audit. These define which feed channels the snap appears in.

| Partition key | Logic |
|---|---|
| `Representative:{id}` | Set if `metadata.representativeId` is present |
| `PolicyArea:{label}` | Always set from `metadata.policyArea` |
| `Geography:{state}` | Set if the snap's rep has a known state |
| `PoliTickIt:{pillar}` | One or more: `Accountability`, `Knowledge`, `Economics`, `Community` |

### Step 5b — Enforce Child-First Distribution Order

Before writing any snap to `snapLibrary.ts`, check the snap's `relationships[]` array.

**If the snap has `type: "child"` entries in `relationships[]` (this is a parent snap):**
- **HALT distribution of the parent snap.**
- Verify each child snap referenced in `relationships[]` is already present in `snapLibrary.ts` by searching for its `snapId`.
- For any child snap not yet distributed: distribute it first (run the full distribution procedure for that child SNAP file), then return to distribute the parent.
- Child snaps are independent first-class snaps — each goes through Steps 1–5 and gets its own DIST audit record.

**If the snap has `type: "parent"` in `relationships[]` (this is a child snap):**
- Distribute normally — no ordering dependency.
- Record the parent snap reference in the DIST audit for traceability.

**If `relationships[]` is empty or absent:**
- Distribute normally — no ordering logic needed.

### Step 5c — Backfill `snapId` References After Distribution

After a snap is written to `snapLibrary.ts`, if other snaps reference it via `null` `snapId` placeholders, backfill those placeholders.

**Case A — Distributing a child snap:**
After the child snap is distributed (its `id` is now known), find the parent snap in `snapLibrary.ts` and:
1. In the parent's `relationships[]`: find the entry matching this child's `drillDownRole` and `entityId` — set its `snapId` to the child's `id`.
2. In the parent's `Navigation.SnapLinks` element `data.links[]`: find the entry matching this child's `thumbnailRepId` — set its `snapId` to the child's `id`.
3. In the parent's `Data.FloorDebate.data.speakers[]` (or equivalent): find the speaker matching the child's `representativeId` — set `fullSpeechSnapId` to the child's `id`.

**Case B — Distributing a parent snap:**
After the parent snap is distributed (its `id` is now known), find all child snaps in `snapLibrary.ts` that have a `type: "parent"` relationship pointing back to this parent's spawn ref:
1. In each child's `relationships[]`: find the `type: "parent"` entry — set its `snapId` to the parent's `id`.

> Backfill only touches `snapId`, `fullSpeechSnapId`, and `relationships[].snapId` fields. No other snap data is modified during backfill.

### Step 6 — Write API Data File (MANDATORY — Dual-Write Contract)

After the `snapLibrary.ts` prepend (Step 4) is complete, write the snap JSON to the API data folder:

**Destination:** `apps/services/PoliTickIt.Api/Data/snaps/{snapId}.json`

**Source:** Copy the raw content of `apps/skill-execution/PoliSnaps/constructed/SNAP-{id}.json` verbatim — no transformation needed. The camelCase JSON is the correct format for the API loader.

**Example:**
```
Source : apps/skill-execution/PoliSnaps/constructed/SNAP-snap-sjres185-floor-debate-20260519.json
Dest   : apps/services/PoliTickIt.Api/Data/snaps/snap-sjres185-floor-debate-20260519.json
```

**Why dual-write?**
- `snapLibrary.ts` → powers the mobile app's offline / mock feed.
- `Data/snaps/{snapId}.json` → powers `LocalFileSnapRepository`, which the live API loads at startup and on `POST /admin/reload`. Placing new files here and calling the reload endpoint updates the API feed without a code redeploy.

**After writing the data file:** record `dataFileStatus: "written"` and `dataFilePath` in the DIST audit record (see below).

If the `Data/snaps/` folder does not exist locally, create it.



**File:** `DIST-{YYYYMMDD-HHMMSS}-{snapId}.json`
**Location:** `apps/skill-execution/PoliSnaps/distributed/`

```json
{
  "distId": "DIST-20260530-143500-snap-sres45-thune",
  "snapId": "snap-sres45-thune",
  "snapRef": "SNAP-snap-sres45-thune.json",
  "distributedAt": "2026-05-30T14:35:00Z",
  "targetArray": "accountabilitySnaps",
  "channelPartitions": [
    "Representative:T000250",
    "PolicyArea:Public Lands and Natural Resources",
    "Geography:South Dakota",
    "PoliTickIt:Accountability"
  ],
  "snapLibraryStatus": "prepended",
  "dataFileStatus": "written",
  "dataFilePath": "apps/services/PoliTickIt.Api/Data/snaps/snap-sres45-thune.json",
  "warningsAtDistribution": []
}
```

---

## Forbidden Patterns

| ID | Pattern | Consequence |
|---|---|---|
| FP-D1 | Appending snap to the end of a category array instead of prepending. | Snap invisible under existing content. Test user never sees it. |
| FP-D2 | Adding snap directly to `allCandidateSnaps`. | Causes duplicate entries — it spreads from category arrays automatically. |
| FP-D3 | Distributing a snap missing `id`, `type`, or `elements[]`. | Causes runtime errors in the snap feed renderer. |
| FP-D4 | Setting `createdAt` to a static date string instead of an ISO timestamp. | Snap may not sort to the top of the feed. |
| FP-D5 | Any skill other than `polisnap-distributor` writing to `snapLibrary.ts`. | Violates single-writer contract — causes merge conflicts and inconsistent state. |
| FP-D6 | Writing a snap whose `NEW_ELEMENT_DEPENDENCY` warnings were not reviewed. | The snap will render `ShadowFallbackMolecule` for unknown elements. This is allowed during development but should be acknowledged before distribution. |
| FP-D7 | Distributing a parent snap before its child snaps are in `snapLibrary.ts`. | `Navigation.SnapLinks` and `fullSpeechSnapId` references remain `null` — the navigation taps have no destination. Always distribute children first. |
| FP-D8 | Skipping the Step 5c backfill after distributing a child snap. | The parent snap's speaker entries and `Navigation.SnapLinks` stay with `null` `snapId` values — the drill-down UI never becomes tappable. Backfill is mandatory immediately after each child distribution. |
| FP-D9 | Writing the API data file (Step 6) without also writing to `snapLibrary.ts` (Step 4), or vice versa. | Violates the dual-write contract. The mobile offline feed and the live API feed become out of sync. Both writes are mandatory and must succeed in the same distribution run. |

---

## Handoff

After distribution, present:
1. Snap ID and which array it was prepended to (`snapLibrary.ts`)
2. API data file written: `apps/services/PoliTickIt.Api/Data/snaps/{snapId}.json`
3. Channel partitions assigned
4. Dist audit file path
5. Backfill summary: which parent/child snap IDs were updated and which fields were backfilled (Step 5c)
6. Any active `NEW_ELEMENT_DEPENDENCY` warnings to track for the next app release
7. Confirmation: "Snap is live — mobile feed updated. To apply to the running API call `POST /admin/reload`."
