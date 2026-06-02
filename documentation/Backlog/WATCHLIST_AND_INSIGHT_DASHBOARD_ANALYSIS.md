# Watchlist & Insight Dashboard — Feature Analysis

- **Product**: PoliTickIt Mobile
- **Author**: GitHub Copilot (Forensic Architect)
- **Date**: 2026-07-11
- **Status**: Analysis — Pre-Implementation

---

## 1. Executive Summary

The Watchlist feature has a **solid foundation** in place: the service interface, SQLite implementation, DI registration, and two UI entry points (snap bookmark icon + ActionCard molecule) are all functional. What is **missing** is:

1. Cloud sync — the watchlist is entirely local; users lose it when switching devices
2. A real Insight Dashboard — the tab currently shows generic trending snaps; no actual per-rep or per-issue analytical intelligence is implemented
3. A functional filter sheet — the `DualTabBottomSheet` on the Watchlist screen has empty render functions
4. A gating + tier enforcement mechanism for Insight Dashboard content

This document maps the current state, gaps, and a full development strategy for both sub-features.

---

## 2. Current Architecture

### 2.1 SQLite Schema

Defined in `SqliteDatabaseService.ts` Migration 1:

```sql
CREATE TABLE IF NOT EXISTS watchlist (
  snap_id TEXT PRIMARY KEY,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Gap**: No `synced` flag. No `syncedAt`. Cannot track local-only vs. cloud-confirmed items.

---

### 2.2 Service Layer

| Layer           | File                                           | Status                     |
| --------------- | ---------------------------------------------- | -------------------------- |
| Interface       | `services/interfaces/IWatchlistService.ts`     | ✅ Complete                |
| Implementation  | `services/implementations/WatchlistService.ts` | ✅ Complete                |
| DI Registration | `services/container.ts` (line 122)             | ✅ Registered as singleton |

**`IWatchlistService` contract:**

```typescript
getWatchedIds(): Promise<string[]>
addToWatchlist(snapId: string): Promise<boolean>
removeFromWatchlist(snapId: string): Promise<boolean>
isWatched(snapId: string): Promise<boolean>
```

**Gap**: No `syncToCloud()`, no `getWatchlistPage()` (pagination), no `getWatchlistCount()`.

---

### 2.3 UI Entry Points

Two independent code paths trigger add/remove:

#### Path A: `polisnap-renderer.tsx` — Bookmark Icon

- Shown in snap header row for every snap card
- `isWatched` checked on mount via `watchlistService.isWatched(snap.id)`
- Toggle calls `watchlistService.add/removeFromWatchlist(snap.id)` + `useTelemetry.trackAction(snap.id, "watchlist_add" | "watchlist_remove")`
- Haptic: `triggerMediumImpact()`

#### Path B: `components/polisnap-elements/interaction/action-card.tsx` — ActionCardMolecule

- Dedicated watchlist action card within snap (when `actionType === "watchlist"`)
- Same logic as Path A; additionally calls `forensicSignalCoordinator.emitSignal({ type: "pulse" })` for participation credit reward
- Displays toggle label: "Add to Watchlist" / "Remove from Watchlist"

**Gap**: These two paths operate independently — no shared service event or state update between them. If a user bookmarks via Path A, the ActionCardMolecule on the same snap doesn't visually update.

---

### 2.4 Watchlist Screen

**File**: `apps/mobile/app/(tabs)/watchlist.tsx`

Two tabs:

| Tab        | Label             | Current Data Source                                                      | Actual Intent                         |
| ---------- | ----------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| `insights` | Insight Dashboard | `omniFeedProvider.getSnaps({ category: "trending" })`                    | Per-rep/issue analytical intelligence |
| `tracked`  | Tracked Items     | `watchlistService.getWatchedIds()` → `snapRepository.getSnapsByIds(ids)` | User's saved snaps                    |

**Stub state**: The Insight Dashboard tab is a placeholder — it renders trending snaps until the real intelligence layer is built. The empty-state message gates on "Community Capital" tier levels, indicating the intent for a tier-gated feature.

**Filter sheet**: `DualTabBottomSheet` is shown on search press, but both `renderTabOne` and `renderTabTwo` return `<View />` — the filter UI is not implemented.

---

### 2.5 Telemetry Integration

**Signal path**: `useTelemetry.trackAction(snapId, actionType)` → `forensicSignalCoordinator.emitSignal({ type: "action", metadata: { actionType } })` → persisted to `participation_log` SQLite table.

**ForensicSignalCoordinator** also:

- Queries `SELECT COUNT(*) FROM watchlist` to populate the `watchlist` activity badge count
- Awards **10 participation credits** on first watchlist action per snap

**No API-side telemetry pathway** exists for watchlist events — they are local-only today.

---

## 3. Gap Analysis

### 3.1 Watchlist Management Gaps

| Gap                                                                                          | Impact                                                        | Priority |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------- |
| No cloud sync (`synced` flag missing from schema)                                            | User loses watchlist on device switch                         | HIGH     |
| No API endpoint (`GET /watchlist`, `POST /watchlist/{snapId}`, `DELETE /watchlist/{snapId}`) | No server-side watchlist state                                | HIGH     |
| Dual UI paths don't share state                                                              | Visual inconsistency (bookmark icon + ActionCard out of sync) | MEDIUM   |
| No filter sheet implementation                                                               | Cannot filter watchlist by category/rep/date                  | MEDIUM   |
| No pagination in `getWatchedIds()`                                                           | Will degrade for large watchlists                             | LOW      |
| No `watchlist_count` metric in user profile                                                  | Cannot surface engagement to user                             | LOW      |

### 3.2 Insight Dashboard Gaps

| Gap                                      | Impact                                                                                          | Priority |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- | -------- |
| Tab shows generic trending — no insights | Core value proposition not delivered                                                            | HIGH     |
| No per-rep intelligence surface          | Cannot show rep-specific trend lines, alignment scores, ROI metrics                             | HIGH     |
| No tier enforcement architecture         | Empty-state copy references "Community Capital" tiers, but no gate is enforced programmatically | MEDIUM   |
| No issue/policy-area tracking            | Cannot aggregate watchlisted snaps by subject area                                              | MEDIUM   |
| No sentiment trend display               | `participation_log` has RS data but it isn't surfaced                                           | LOW      |

---

## 4. Development Strategy

### 4.1 Watchlist Management

#### Phase A: Schema & Sync Flag

Upgrade `SqliteDatabaseService.ts` with Migration 3:

```sql
ALTER TABLE watchlist ADD COLUMN synced INTEGER DEFAULT 0;
ALTER TABLE watchlist ADD COLUMN syncedAt TEXT;
```

This lets the sync service query `WHERE synced = 0` to push pending items.

#### Phase B: API Endpoints (ASP.NET Core)

Create `WatchlistController.cs` under `PoliTickIt.Api/Controllers/`:

```
POST   /api/watchlist/{snapId}    — add snap to server watchlist
DELETE /api/watchlist/{snapId}    — remove snap from server watchlist
GET    /api/watchlist             — return list of watched snap IDs
```

**Data model** (Cosmos DB): Store on the user document as a `watchlist: string[]` array or as a dedicated `UserWatchlist` container. A dedicated container is preferred for scalability (allows querying across users for trend aggregation).

**Authentication**: All three endpoints require `[Authorize]` with JWT bearer token (pattern matches existing `RepresentativeController`).

#### Phase C: Sync Service (Mobile)

Add `syncToCloud()` to `IWatchlistService`:

```typescript
syncToCloud(): Promise<void>
```

Implementation in `WatchlistService.ts`:

1. Query `SELECT snap_id FROM watchlist WHERE synced = 0`
2. `POST /api/watchlist/{snap_id}` for each pending item
3. On success, `UPDATE watchlist SET synced = 1, syncedAt = ?`
4. Call on app foreground resume and after each `addToWatchlist`

#### Phase D: Filter Sheet

Implement `DualTabBottomSheet` content in `watchlist.tsx`:

- **Tab 1 (Watchlist Filters)**: Filter by category, date range, rep affiliation
- **Tab 2 (Alerts)**: Per-snap or per-rep notification triggers (stretch goal)

UI pattern: Reuse the filter component pattern from `settings-reps.tsx` (category/chamber/party filters).

#### Phase E: State Cohesion

Fix the dual-path state inconsistency. Options:

**Option 1** (Recommended): Add a `WatchlistContext` (lightweight React context) that holds a `Set<string>` of watched snap IDs. Both `polisnap-renderer.tsx` and `ActionCardMolecule` subscribe to it. `addToWatchlist` / `removeFromWatchlist` update the context.

**Option 2**: Emit a React Native `EventEmitter` event on toggle; each card subscribes. More fragile.

---

### 4.2 Insight Dashboard

The Insight Dashboard tab's empty-state copy references "Community Capital" tiers and "collective signal dashboards". The feature's intent is intelligence aggregated from the watchlisted snaps and representative activity — not a generic trending feed.

#### Insight Dashboard Architecture

```
WatchlistScreen (Insight Dashboard Tab)
  └─ InsightDashboardView (new component)
       ├─ RepInsightCard[]         — per-rep: alignment score, snap count, ROI metrics
       ├─ PolicyAreaTrendChart     — snap volume over time by category
       ├─ SentimentTrendCard       — rational sentiment trend for watched snaps
       └─ GateGuard (tier check)  — hides deep analytics below tier threshold
```

#### Data Sources

| Insight                             | Source                                            | Available Now          |
| ----------------------------------- | ------------------------------------------------- | ---------------------- |
| Watched snap list                   | `watchlist` SQLite table                          | ✅ Yes                 |
| Snap metadata (rep, category, tier) | `snaps` + `snap_elements` SQLite tables           | ✅ Yes                 |
| Rational Sentiment per snap         | `participation_log` (rs column)                   | ✅ Yes                 |
| Rep alignment score                 | `AlignmentReport` (used in `representative.tsx`)  | ✅ Yes (needs wiring)  |
| Rep ROI score                       | `ROIReportCard` component in `representative.tsx` | ✅ Exists as component |
| Snap volume trends                  | Aggregate query on `snaps` table                  | ✅ Derivable           |
| Cross-user sentiment                | Cosmos DB aggregate / API endpoint                | ❌ Not yet             |

#### Tier Gating

The existing `ForensicSignalCoordinator` `getImpactMetrics()` returns `tierLevel` (1–4). Apply it:

```typescript
// In InsightDashboardView
const { credits, tierLevel } = await forensicSignalCoordinator.getImpactMetrics();

if (tierLevel < 2) {
  return <InsightGateScreen onBoostPress={showParticipationModal} />;
}
```

Tier access map:

| Tier | Name        | Requirement    | Dashboard Access                            |
| ---- | ----------- | -------------- | ------------------------------------------- |
| 1    | Observation | 0 credits      | Watched snap list only                      |
| 2    | Engagement  | 1,000 credits  | Per-rep alignment cards                     |
| 3    | Influence   | 5,000 credits  | Sentiment trends + policy area charts       |
| 4    | Sovereign   | 20,000 credits | Cross-user aggregate signals (requires API) |

---

## 5. Telemetry Events

All events route through `forensicSignalCoordinator.emitSignal()` → persisted to `participation_log`.

### Existing (already implemented)

| Event                       | `actionType` value                | Triggered From          |
| --------------------------- | --------------------------------- | ----------------------- |
| Add to watchlist            | `"watchlist_add"`                 | `polisnap-renderer.tsx` |
| Remove from watchlist       | `"watchlist_remove"`              | `polisnap-renderer.tsx` |
| ActionCard watchlist toggle | `"watchlist"` (via `trackAction`) | `action-card.tsx`       |

### Required (not yet implemented)

| Event                    | `actionType` / `type`      | When                     | Metadata                                                   |
| ------------------------ | -------------------------- | ------------------------ | ---------------------------------------------------------- |
| View Insight Dashboard   | `"insight_dashboard_view"` | Tab shown                | `tierLevel`                                                |
| Insight tier gate hit    | `"feature_gate_hit"`       | User below required tier | `feature: "insight_dashboard"`, `tierLevel`, `required: 2` |
| Watchlist filter applied | `"watchlist_filter"`       | Filter sheet apply       | `filterType`, `value`                                      |
| Watchlist sync complete  | `"watchlist_sync"`         | After cloud sync         | `itemCount`, `failedCount`                                 |
| Rep insight card viewed  | `"rep_insight_viewed"`     | Card render              | `representativeId`                                         |

### Implementation Pattern

```typescript
// In useTelemetry.ts — no new hook needed; use existing trackAction
trackAction(snapId, "feature_gate_hit", {
  feature: "insight_dashboard",
  tierLevel,
  required: 2,
});

// In InsightDashboardView on mount
trackAction("screen", "insight_dashboard_view", { tierLevel });
```

---

## 6. API Contract (New Endpoints)

### `POST /api/watchlist/{snapId}`

- **Auth**: Bearer JWT required
- **Response 200**: `{ snapId: string, addedAt: string }`
- **Response 409**: Already in watchlist (idempotent, return 200 instead)

### `DELETE /api/watchlist/{snapId}`

- **Auth**: Bearer JWT required
- **Response 204**: No content
- **Response 404**: Not in watchlist (acceptable to return 204)

### `GET /api/watchlist`

- **Auth**: Bearer JWT required
- **Response 200**: `{ snapIds: string[], count: number }`
- **Query params**: `?page=1&pageSize=50` (pagination)

### `GET /api/watchlist/insights` _(Phase 2 / Tier 3+)_

- **Auth**: Bearer JWT required
- **Response 200**: Aggregated insight payload (sentiment distribution, top reps, top categories) derived from the user's watchlisted snaps
- **Gated**: API enforces minimum `participationTier >= 3` from user's Cosmos profile

---

## 7. Implementation Order

| Step | Work Item                                                          | Dependency                           |
| ---- | ------------------------------------------------------------------ | ------------------------------------ |
| 1    | Schema migration 3 — add `synced`, `syncedAt` to `watchlist` table | None                                 |
| 2    | Fix dual-path state issue — introduce `WatchlistContext`           | Step 1                               |
| 3    | Implement filter sheet (`DualTabBottomSheet` content)              | Step 2                               |
| 4    | `WatchlistController.cs` — POST/DELETE/GET endpoints               | None                                 |
| 5    | `syncToCloud()` in `WatchlistService.ts`                           | Steps 1 + 4                          |
| 6    | Wire sync on app resume + post-add                                 | Step 5                               |
| 7    | `InsightDashboardView` component — Tier 1/2 content                | Step 2                               |
| 8    | Tier gating logic in Insight Dashboard                             | ForensicSignalCoordinator (existing) |
| 9    | Per-rep insight cards (wire `AlignmentReport` + `ROIReportCard`)   | Step 7                               |
| 10   | Sentiment trend + policy area chart (Tier 3)                       | Step 7                               |
| 11   | Telemetry events for all new interactions                          | Steps 7–10                           |
| 12   | `GET /api/watchlist/insights` endpoint (Tier 3 aggregation)        | Step 9                               |

---

## 8. Out of Scope (Deferred)

- **Push alerts** for watchlisted snap updates (Tab 2 "Alerts" in filter sheet) — requires notification infrastructure not yet in place
- **Cross-user aggregate sentiment** in Insight Dashboard — requires Cosmos query aggregation or a dedicated analytics pipeline
- **Watchlist sharing** — share a watchlist as a link — no infrastructure today

---

## 9. Validation Scenarios

### Prerequisite: Reset state

Run the app fresh (or clear app data) so the watchlist is empty and SQLite is on migration 23.

---

### Test 1 — Add to Watchlist (Context sync)

1. Navigate to the **Accountability** or **Knowledge** feed
2. Tap the **bookmark icon** on any snap card → icon fills/highlights
3. Without navigating away, tap the same snap's **ActionCard** (ellipsis/more) — the watchlist toggle should already show "Remove from Watchlist" (shared context state)
4. Navigate to **Watchlist → Tracked Items** tab → the snap appears

**Pass criteria:** Both Path A (bookmark icon) and Path B (ActionCard) reflect the same state without a reload.

---

### Test 2 — Filter Sheet (Tracked tab)

1. On the Watchlist screen, tap the **search/filter icon** in the header
2. **Tab 1 "Watchlist"** should show:
   - "Sort By" → Newest First / Oldest First chips
   - "Filter by Category" → 38 policy area chips, scrollable
3. Select **2–3 categories** → tap "Apply Filters"
4. Tracked Items list should narrow to only snaps in those categories
5. Empty state should show **"Clear Filters"** button when filters are active and nothing matches
6. Tap **Tab 2 "Alerts"** → should show "Push Alerts Coming Soon" placeholder

---

### Test 3 — Insight Dashboard: Tier Gate (Tier 1 user)

1. Use a **new account** with 0 participation credits
2. Go to **Watchlist → Insight Dashboard** tab
3. Should show the gate screen: lock icon + "Intelligence Locked" + "Boost Participation Capital" button
4. Tap the button → **ParticipationStatusModal** should open

**Pass criteria:** No crash, gate screen renders cleanly.

---

### Test 4 — Insight Dashboard: Analytics (Tier 2+ user)

1. Use an account with **1,000+ participation credits** (or temporarily lower the threshold in `ForensicSignalCoordinator` for testing)
2. First, bookmark **5–8 snaps** across at least 3 different policy areas
3. Go to **Watchlist → Insight Dashboard**
4. Should show:
   - Tier badge (e.g. "Engagement Access")
   - 3 stat cards: Tracked count, Reps count, Categories count
   - Policy Area Breakdown bars — top 6 categories with proportional fill bars
   - "Sentiment Trend Analysis" tease card (locked, shows "Influence" badge)

**Pass criteria:** Counts match what you bookmarked. Bars are proportional.

---

### Test 5 — Cloud Sync (requires API running)

1. Start the API (`dotnet run`)
2. Add 2 snaps to watchlist while **offline** (airplane mode)
3. Re-enable network → pull-to-refresh on Watchlist screen
4. Check API: `GET http://10.0.0.252:5000/api/watchlist` (with Bearer token) → `snapIds` array should contain both snaps
5. Verify SQLite: `synced = 1` on both rows

**Quick manual API test:**

```bash
# Get token from login, then:
curl -X GET http://10.0.0.252:5000/api/watchlist \
  -H "Authorization: Bearer <token>"

curl -X POST http://10.0.0.252:5000/api/watchlist/snap-001 \
  -H "Authorization: Bearer <token>"
```

---

### Test 6 — Cross-device sync

1. Bookmark 3 snaps on **Device A** (sync fires automatically after each add)
2. Log into the **same account** on Device B (fresh install)
3. On Device B, navigate to Watchlist → the 3 snaps from Device A should appear (pulled from server on mount)

---

### Edge Cases

| Scenario                                                 | Expected                                                 |
| -------------------------------------------------------- | -------------------------------------------------------- |
| Bookmark snap, immediately check Insight Dashboard stats | Count updates without reload (same `watchedSnaps` state) |
| Filter by category with no matching snaps                | Empty state + "Clear Filters" button                     |
| Unauthenticated user → `syncToCloud()`                   | Silent no-op, no crash, warning logged                   |
| API returns 401 mid-sync                                 | Token refresh attempted, then retry once                 |

---

_PoliTickIt · Intelligence at the Constituent Level_
