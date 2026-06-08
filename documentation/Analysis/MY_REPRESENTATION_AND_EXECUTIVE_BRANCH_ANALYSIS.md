# My Representation & Executive Branch — Feature Initiative Analysis

- **Product**: PoliTickIt Mobile + API
- **Author**: GitHub Copilot (Forensic Architect)
- **Date**: 2026-06-02
- **Status**: Pre-Implementation Analysis
- **Scope**: Federal MVP. State-level deferred.

---

## 1. Executive Summary

This initiative introduces two distinct but related capabilities:

1. **My Representation** — A new drawer menu item that navigates to a dedicated screen showing the authenticated user's representatives across all branches (Congressional + Executive). No inline card in the drawer — a standard nav item that opens a full-page summary.
2. **Executive Branch** — Import, store, index, and display Executive Branch officials (President, Vice President, Cabinet) as first-class representatives within the platform, with adapted UI tabs and new filter taxonomy.

Both features extend existing architecture cleanly. The Representative data pipeline (`CongressMemberStore` → API → SQLite → UI) is already fully operational for Congress. The gap is a second data class (`branch_type`) and a dedicated screen section.

---

## 2. Current Architecture Baseline

### 2.1 Representative Data Pipeline (Congress — Already Working)

```
api.congress.gov
    └─ CongressMemberStore (C# singleton, in-memory)
         └─ GET /api/representatives/registry   → 535 members
         └─ GET /api/representatives?state=&district=   → district slice
         └─ GET /api/representatives/{bioguideId}
              └─ ApiRepresentativeRepository.ts (mobile)
                   └─ SqliteRepresentativeRepository.ts (local cache)
                        └─ representatives table (Migration 3)
```

**Key fields in `representatives` table**: `id`, `name`, `position`, `party`, `state`, `district`, `profile_image`, `biography`, `is_following`, `metadata_json`

**Missing field**: `branch_type` (`legislative` | `executive`) — needed to distinguish Congress from Executive Branch.

### 2.2 User District Data

- `AuthUser` (defined in `ApiAuthService.ts`) **already carries `state` and `district`** — these are populated from the ZIP step during onboarding (`ZipValidationResult` → backend lookup → stored in the user's Cosmos profile → returned with every auth response from `login`, `verifyEmail`, and `getMe`).
- The `AuthUser` object is persisted to `AsyncStorage` at key `@politickit:user` on every successful auth call. It is restored on app launch via `apiAuthService.initialize()` and exposed app-wide through `useAuth()` in `auth-context.tsx`.
- **The gap**: `drawer.tsx` and `header.tsx` import `currentUser` from `constants/mockData.ts` (hardcoded Colorado, District 4) instead of calling `useAuth()`. The real data is already there — it is simply not being read.
- **No dedicated "my reps" endpoint or context exists** — the `GET /api/my-representatives` endpoint must be built to accept the authenticated user's identity and return their district representatives server-side.

### 2.3 Navigation Drawer

File: `apps/mobile/components/navigation/drawer.tsx`

- Drawer `activityItems` array is static. `"Representative"` routes to the generic rep browser.
- The "My Representation" section needs to appear **above** `"Representative"` in the `activityItems` list as a visually distinct card, not a simple list row.

### 2.4 Representative Screen Tabs (Current)

```typescript
const TABS = [
  "Activity",
  "Audit",
  "Productivity",
  "Community",
  "Voting",
  "Events",
  "Committee",
  "Biography",
];
```

These tabs are hardcoded globally. Executive Branch officials have no `Committee` or `Voting` record but do have `Executive Orders` and `Events`. The tab set needs to be **branch-aware**.

---

## 3. Gap Analysis

### 3.1 My Representation

| Gap                                                                   | Impact                                                                | Priority |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| `drawer.tsx` and `header.tsx` import `currentUser` from `mockData.ts` | Hardcoded Colorado/District 4 shown for all users                     | HIGH     |
| No `my-representation.tsx` screen exists                              | The destination page for the menu item doesn't exist                  | HIGH     |
| No `GET /api/my-representatives` endpoint                             | Screen has no server-side data source keyed to the authenticated user | HIGH     |
| No "My Representation" item in the drawer `activityItems` array       | Menu entry point doesn't exist                                        | HIGH     |

> **Note**: `AuthUser` already carries `state` and `district` from onboarding — no new storage infrastructure is needed. The fix is replacing `mockData.ts` imports with `useAuth()` calls.

### 3.2 Executive Branch

| Gap                                                                | Impact                                            | Priority |
| ------------------------------------------------------------------ | ------------------------------------------------- | -------- |
| No Executive Branch data source wired to platform                  | No executive officials exist in the system        | HIGH     |
| `CongressMemberStore` only hydrates Congress from api.congress.gov | Executive data requires a separate ingestion path | HIGH     |
| `representatives` table has no `branch_type` column                | Cannot query/filter by legislative vs. executive  | HIGH     |
| `RepresentativeMobileDto` has no `branchType` field                | Mobile client cannot distinguish branch           | HIGH     |
| `TABS` array is global and hardcoded                               | Executive officials cannot have their own tab set | HIGH     |
| Filter UI (representative-selection sheet) has no "Branch" filter  | Users cannot filter by Executive vs. Congress     | MEDIUM   |
| Snaps have no executive branch affiliation path                    | `metadata.representativeId` maps to Congress only | MEDIUM   |
| No executive orders data source                                    | "Executive Orders" tab would be empty             | MEDIUM   |

---

## 4. External Data Sources

### 4.1 Executive Branch Officials

| Source                                 | URL                                               | Data Available                                        | Auth Required   |
| -------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- | --------------- |
| **congress.gov API** (`/v3/member`)    | `https://api.congress.gov/v3/member`              | Senators, House, some executive roles                 | API Key         |
| **whitehouse.gov**                     | public pages                                      | Name, title, photo, biography — but no structured API | None (scraping) |
| **data.gov / Federal Register**        | `https://www.federalregister.gov/api/v1`          | Executive Orders (full text, date, number)            | None            |
| **USA.gov Executive Branch directory** | `https://www.usa.gov/executive-branch`            | Cabinet positions + names (static)                    | None            |
| **Wikipedia / Wikidata**               | `https://www.wikidata.org/w/api.php`              | Photos, biography, roles                              | None            |
| **unitedstates/images GitHub CDN**     | `https://unitedstates.github.io/images/congress/` | Photos for Congress members (BioguideId keyed)        | None            |

**Recommended approach for MVP**:

- **Officials data**: Seed a static `executive-officials.json` file (same pattern as the `Data/snaps/` directory) containing President, VP, and 15 Cabinet secretaries. This can be hydrated on startup alongside `CongressMemberStore`.
- **Executive Orders**: `federalregister.gov` REST API — free, no auth, returns structured JSON. Map to PoliSnaps in the ingestion pipeline.
- **Photos**: Whitehouse.gov or Wikipedia Commons provide high-quality official portraits. Store CDN URLs in the seed file.

### 4.2 My Representation — District Lookup

Already available: `GET /api/district/lookup?zip=` returns `{ state, district }`. The user's zip must be stored on their profile (Cosmos user document) and used to seed the user's rep list on login.

---

## 5. API Needs

### 5.1 New Endpoint: User's Federal Representatives

```
GET /api/my-representatives
  Auth: Bearer JWT required
  Response 200: RepresentativeMobileDto[]   (House member + 2 Senators)
  Logic: Reads state + district from authenticated user's Cosmos profile,
         then calls _store.GetForDistrict(state, district)
```

This avoids the mobile client needing to know the user's state/district — it's derived server-side from the JWT identity.

### 5.2 New Endpoint: Executive Branch Registry

```
GET /api/representatives/executive
  Auth: None required (public data)
  Response 200: ExecutiveMobileDto[]   (President, VP, Cabinet)
  Logic: Reads from ExecutiveOfficialStore (new singleton, static seed)
```

### 5.3 Schema Extension: `RepresentativeMobileDto`

Add `BranchType` field:

```csharp
public sealed record RepresentativeMobileDto(
    string Id, string Name, string Party, string State,
    string? District, string Chamber, string ImageUrl,
    string? CongressGovUrl,
    string BranchType   // "legislative" | "executive"  ← NEW
);
```

### 5.4 New Model: `ExecutiveOfficial`

```csharp
public sealed record ExecutiveOfficial(
    string Id,           // e.g. "POTUS-47", "VPOTUS-47", "SEC-STATE"
    string Name,
    string Title,        // "President", "Vice President", "Secretary of State", etc.
    string Party,
    string ImageUrl,
    string? Biography,
    string BranchType    // always "executive"
);
```

### 5.5 Existing Endpoint Enhancement: Representatives Registry

`GET /api/representatives/registry` — extend to optionally include executive officials:

```
GET /api/representatives/registry?includeBranch=all|legislative|executive
```

Backward compatible: default is `legislative` only.

### 5.6 Executive Orders Ingestion

New ingestion provider: `FederalRegisterIngestionProvider`

```
GET https://www.federalregister.gov/api/v1/documents.json
  ?conditions[type][]=PRESDOCU
  &conditions[presidential_document_type_id][]=2   (Executive Orders)
  &per_page=20&order=newest
```

Maps each order to a `PoliSnap` with:

- `type: "ExecutiveOrder"`
- `metadata.representativeId: "POTUS-47"`
- `metadata.policyArea`: derived from Federal Register subject terms

---

## 6. Local Storage Needs

### 6.1 SQLite Schema — Migration 24

```sql
-- Add branch_type to representatives table
ALTER TABLE representatives ADD COLUMN branch_type TEXT DEFAULT 'legislative';

-- Index for branch-filtered queries
CREATE INDEX IF NOT EXISTS idx_rep_branch ON representatives(branch_type);
CREATE INDEX IF NOT EXISTS idx_rep_following ON representatives(is_following);
```

### 6.2 SQLite Schema — Migration 25 (Executive Orders)

Executive orders are PoliSnaps — they route through the existing `snap_elements` / `snaps` table. No new table needed. The `metadata_json` field on a snap carries `representativeId` and `type: "ExecutiveOrder"`.

### 6.3 User Profile — No New Storage Required

`AuthUser` already carries `state` and `district` and is persisted to `AsyncStorage` at `@politickit:user` on every login, verify-email, and token refresh. The `useAuth()` hook exposes it app-wide.

The only change needed is to replace `import { currentUser } from "@/constants/mockData"` with `const { user } = useAuth()` in `drawer.tsx` and `header.tsx`. No new storage keys, no new service methods.

---

## 7. UI/UX Needs

### 7.1 My Representation Drawer Menu Item

**Design**: A standard drawer navigation item — no inline card, no rep photos in the drawer. The drawer stays clean.

**Drawer change**: Add `"My Representation"` as a menu item in the `activityItems` array (above `"Representative"`). Tapping it navigates to the new `my-representation` screen.

```
ACTIVITY
  • My Representation    ← new item → /my-representation
  • Representative
  • Accountability
  • ...
```

---

### 7.2 My Representation Screen (New Page)

**Route**: `apps/mobile/app/my-representation.tsx`

**Content**: A full-page summary of the authenticated user's representatives across all branches, organized into sections:

```
┌────────────────────────────────────────────┐
│  MY REPRESENTATION                         │
├────────────────────────────────────────────┤
│  CONGRESS                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ [photo]  │  │ [photo]  │  │ [photo]  │ │
│  │ Rep. X   │  │ Sen. Y   │  │ Sen. Z   │ │
│  │ House·CO │  │ Senate·CO│  │ Senate·CO│ │
│  └──────────┘  └──────────┘  └──────────┘ │
├────────────────────────────────────────────┤
│  EXECUTIVE BRANCH                          │
│  ┌──────────┐  ┌──────────┐               │
│  │ [photo]  │  │ [photo]  │               │
│  │ President│  │ Vice     │               │
│  │          │  │ President│               │
│  └──────────┘  └──────────┘               │
└────────────────────────────────────────────┘
```

- Each rep card is tappable → navigates to `representative.tsx?id={id}`
- Loading state: skeleton placeholders per section
- If user's district is unknown: inline nudge to set district in Settings
- Executive Branch section always shows (President + VP as universal federal representation)
- Cabinet members shown in a collapsible sub-section (optional, Phase 3)

### 7.3 Representative Screen — Branch-Aware Tabs

Introduce a `TABS_BY_BRANCH` map in `representative.tsx`:

```typescript
const TABS_BY_BRANCH: Record<string, string[]> = {
  legislative: [
    "Activity",
    "Audit",
    "Productivity",
    "Community",
    "Voting",
    "Events",
    "Committee",
    "Biography",
  ],
  executive: [
    "Activity",
    "Executive Orders",
    "Events",
    "Productivity",
    "Biography",
  ],
};
```

The `Representative` type already has a `level` field. Add a `branchType` field:

```typescript
interface Representative {
  // ... existing
  branchType?: "legislative" | "executive";
}
```

Tab rendering in the screen derives the tab set from `representative?.branchType ?? "legislative"`.

### 7.4 Executive Profile Header

For executive officials, the rep profile header needs adjustments:

- **Chamber badge**: Replace "Senate" / "House" with title, e.g. "President", "Secretary of Defense"
- **State**: Not applicable — show "Executive Branch" or "White House"
- **Party badge**: Retain
- **Follow toggle**: Retain (users can follow the President to see executive order snaps)

### 7.5 Filter Sheet — Branch Filter

Add a "Branch" filter chip group to `RepresentativeAndPolicyAreaFilterBottomSheet`:

```
Branch: [ All ] [ Legislative ] [ Executive ]
```

This filters the rep grid in the "Representatives" tab of the filter sheet.

### 7.6 Executive Orders Tab Content

The "Executive Orders" tab on an executive profile renders a `PoliSnapCollection` filtered to:

```typescript
snaps.filter(
  (s) =>
    s.type === "ExecutiveOrder" &&
    s.metadata?.representativeId === representative.id,
);
```

No new component needed — it reuses the existing snap feed renderer.

---

## 8. Phased Implementation Plan

### Phase 1 — My Representation (1–2 sprints)

| Step | Work Item                                                                       | Layer      | Dependency                                       |
| ---- | ------------------------------------------------------------------------------- | ---------- | ------------------------------------------------ |
| 1    | Add `branchType` to `Representative` TypeScript type                            | Mobile     | None                                             |
| 2    | SQLite Migration 24: add `branch_type` column                                   | Mobile DB  | None                                             |
| 3    | Replace `mockData.ts` imports with `useAuth()` in `drawer.tsx` and `header.tsx` | Mobile     | None — `AuthUser` already has `state`/`district` |
| 4    | `GET /api/my-representatives` endpoint                                          | API        | User profile in Cosmos                           |
| 5    | New `apps/mobile/app/my-representation.tsx` screen                              | Mobile UI  | Steps 3–4                                        |
| 6    | Add `"My Representation"` item to drawer `activityItems`                        | Mobile UI  | Step 5                                           |
| 7    | Each rep card on the screen taps → `representative.tsx?id={id}`                 | Mobile Nav | Step 5                                           |

**Acceptance test**: A real user (not mock data) opens the drawer, taps "My Representation", and sees the screen populated with their actual House member and 2 Senators (derived from the `state`/`district` already stored in their `AuthUser` profile), plus the President and VP under Executive Branch. Tapping any navigates to their profile.

---

### Phase 2 — Executive Branch Data (1–2 sprints)

| Step | Work Item                                                                           | Layer    | Dependency  |
| ---- | ----------------------------------------------------------------------------------- | -------- | ----------- |
| 8    | Author `executive-officials.json` seed file (President, VP, 15 Cabinet)             | API Data | None        |
| 9    | `ExecutiveOfficialStore` (C# singleton, loads from seed file)                       | API      | Step 8      |
| 10   | `GET /api/representatives/executive` endpoint                                       | API      | Step 9      |
| 11   | Extend `RepresentativeMobileDto` with `BranchType`                                  | API      | Step 9      |
| 12   | Mobile: fetch executive officials and persist to SQLite `branch_type = 'executive'` | Mobile   | Steps 10–11 |
| 13   | Extend `GET /api/representatives/registry` to optionally include executive          | API      | Steps 9–11  |

---

### Phase 3 — Executive Branch UI (1 sprint)

| Step | Work Item                                                                                 | Layer     | Dependency |
| ---- | ----------------------------------------------------------------------------------------- | --------- | ---------- |
| 14   | `TABS_BY_BRANCH` map in `representative.tsx`                                              | Mobile UI | Phase 2    |
| 15   | Branch-aware tab rendering on rep profile screen                                          | Mobile UI | Step 14    |
| 16   | Executive profile header adjustments (title instead of chamber)                           | Mobile UI | Phase 2    |
| 17   | Branch filter in `RepresentativeAndPolicyAreaFilterBottomSheet`                           | Mobile UI | Phase 2    |
| 18   | Executive officials appear in `my-representation.tsx` under an "Executive Branch" section | Mobile UI | Phases 1–2 |

---

### Phase 4 — Executive Orders Ingestion (1–2 sprints)

| Step | Work Item                                                   | Layer     | Dependency           |
| ---- | ----------------------------------------------------------- | --------- | -------------------- |
| 19   | `FederalRegisterIngestionProvider` — fetches recent EO list | API       | Federal Register API |
| 20   | Map Executive Orders to PoliSnap format                     | API       | Step 19              |
| 21   | Wire into `IngestionController`                             | API       | Step 20              |
| 22   | "Executive Orders" tab renders filtered snap feed           | Mobile UI | Steps 19–21, Phase 3 |
| 23   | Telemetry: `"executive_order_viewed"` signal                | Mobile    | Step 22              |

---

### Phase 5 — State-Level (Deferred)

- Extend `DistrictController` to return state legislature district
- New `StateRepresentativeStore` or third-party API (OpenStates.org API is the canonical source)
- New `branchType = 'state_legislative'` and new tab set

---

## 9. Missing Requirements / Considerations

### 9.1 User Profile State/District Source of Truth

`AuthUser.state` and `AuthUser.district` are already populated from the ZIP onboarding step and returned with every auth response. They are persisted at `@politickit:user` in `AsyncStorage` and available immediately via `useAuth()`.

The only required change is removing the `mockData.ts` import in `drawer.tsx` and `header.tsx` and reading from `useAuth()` instead. If `user.state` or `user.district` is absent (edge case: user created before the ZIP step was added), the `my-representation.tsx` screen should show a nudge to re-verify district in Settings.

### 9.2 Executive Branch in the Snap Feed

Executive officials following must flow into the Accountability and Knowledge feeds. When a user follows the President, executive order and event snaps should appear in their Accountability feed. This requires:

- `OmniFeedProvider` to include executive snap types
- `activeFilters.insightType` to include `"Executive Order"` as a type option in the filter sheet

### 9.3 "My Representation" vs. "Representative" Disambiguation

After this feature, two drawer items will exist with distinct but related intent:

- **"My Representation"** → navigates to `my-representation.tsx` — shows _the user's_ reps across all branches (personalized)
- **"Representative"** → remains the general directory / rep browser — rename to **"Browse Representatives"** to clarify it is not personalized

### 9.4 Executive Branch in the Watchlist

Executive officials should be watchlistable. The `watchlist` table stores `snap_id` not `rep_id`, so this works automatically once EO snaps are in the feed. No schema change needed.

### 9.5 AlignmentReport for Executive Officials

The `CivicIntelligenceService.getAlignmentReport(id)` is currently keyed to legislative voting records. Executive officials have no voting record — the "Audit" tab must be hidden for them (addressed in Phase 3 tab remapping).

### 9.6 Photo Licensing

Official government photos of the President, VP, and Cabinet secretaries are in the public domain (U.S. government works). The seed file can link directly to `whitehouse.gov` official photos or the Library of Congress.

---

## 10. Component & File Inventory

### New Files

| File                                                                                  | Layer     | Purpose                                           |
| ------------------------------------------------------------------------------------- | --------- | ------------------------------------------------- |
| `apps/mobile/app/my-representation.tsx`                                               | Mobile UI | Full-page screen: user's reps across all branches |
| `apps/services/PoliTickIt.Api/Data/executive-officials.json`                          | API Data  | Static seed: President, VP, Cabinet               |
| `apps/services/PoliTickIt.Api/BackgroundServices/ExecutiveOfficialStore.cs`           | API       | In-memory store for executive officials           |
| `apps/services/PoliTickIt.Api/Controllers/ExecutiveBranchController.cs`               | API       | `GET /api/representatives/executive`              |
| `apps/services/PoliTickIt.Api/BackgroundServices/FederalRegisterIngestionProvider.cs` | API       | Fetches Executive Orders from federalregister.gov |

### Modified Files

| File                                                                               | Change                                                              |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `apps/mobile/types/user.ts`                                                        | Add `branchType?: "legislative" \| "executive"` to `Representative` |
| `apps/mobile/services/implementations/SqliteDatabaseService.ts`                    | Migration 24: `branch_type` column                                  |
| `apps/mobile/services/implementations/ApiRepresentativeRepository.ts`              | Map `branchType` from API response                                  |
| `apps/mobile/services/implementations/SqliteRepresentativeRepository.ts`           | Read/write `branch_type` column                                     |
| `apps/mobile/components/navigation/drawer.tsx`                                     | Add `"My Representation"` item to `activityItems` array             |
| `apps/mobile/app/representative.tsx`                                               | Branch-aware tab set (`TABS_BY_BRANCH`)                             |
| `apps/mobile/app/(tabs)/representative.tsx`                                        | Same tab set update                                                 |
| `apps/mobile/components/ui/representative-and-policy-area-filter-bottom-sheet.tsx` | Branch filter chips                                                 |
| `apps/services/PoliTickIt.Api/Controllers/RepresentativesController.cs`            | Add `BranchType` to `RepresentativeMobileDto`                       |
| `apps/services/PoliTickIt.Api/Controllers/RepresentativesController.cs`            | New `GET /api/my-representatives` endpoint                          |

---

## 11. Open Questions for Product

1. Should Cabinet members (15 secretaries) appear on the My Representation screen, or only the President + VP? Recommended: President + VP always shown; Cabinet in a collapsible sub-section (Phase 3). Elected Congress members are specific to the user; executive officials are universal for all users.
2. ~~Should the Executive Branch be a separate drawer item?~~ **Resolved**: Executive officials are shown on the `my-representation.tsx` screen under an "Executive Branch" section — no separate drawer item needed.
3. What is the cadence for refreshing the executive officials seed? Cabinet positions change with administrations. A quarterly seed update + admin endpoint (`POST /admin/hydrate-executive`) is sufficient.
4. Should the "My Representation" card be visible to unauthenticated/guest users? Recommended: show a "Sign in to see your reps" nudge for guests.

---

_PoliTickIt · Intelligence at the Constituent Level_
