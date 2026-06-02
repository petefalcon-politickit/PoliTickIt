# **Analysis: Trending Feed — Strategy, Scoring & Implementation**

- **Subject**: Trending snap feed — scoring algorithm, API wiring, channel strategy, and Accountability display
- **Status**: ANALYSIS — Implementation Ready
- **Date**: 2026-06-01
- **References**: `ChannelTrendingService.cs`, `ITrendingService.cs`, `SnapsController.cs`, `accountability.tsx`, `OmniFeedProvider.ts`, `IOmniFeedProvider.ts`, `snapLibrary.ts`

---

## 1. Current State

### What Already Exists

| Layer      | Component                                                     | Status                                   |
| ---------- | ------------------------------------------------------------- | ---------------------------------------- |
| **API**    | `ITrendingService` + `ChannelTrendingService`                 | ✅ Fully implemented                     |
| **API**    | `GET /api/snaps?mode=trending`                                | ✅ Working, returns ranked snap list     |
| **API**    | `IngestionController` calls `_trending.Invalidate()`          | ✅ Cache cleared on new snap ingest      |
| **Mobile** | `selectedSegment: "focus" \| "trending"` state                | ✅ Toggle exists in `accountability.tsx` |
| **Mobile** | `SnapCategory` includes `"trending"`                          | ✅ Defined in `IOmniFeedProvider.ts`     |
| **Mobile** | `trendingSnaps: any[] = []` in `snapLibrary.ts`               | ❌ Empty array — mock data never added   |
| **Mobile** | Trending filter: `snap.id.includes("trending")`               | ❌ Wrong — local mock, not API data      |
| **Mobile** | `OmniFeedProvider` uses local `ISnapRepository` for all snaps | ❌ No HTTP call to snap API              |

### The Core Gap

The API's trending pipeline is production-ready but **the mobile app never calls it**. The Accountability screen's Trending tab performs a local string-match against empty static data. The work is primarily a **mobile-side wiring** task.

---

## 2. Trending Score — Algorithm

### Existing Algorithm: Recency Burst (`ChannelTrendingService`)

```
Score(snap) = Score(snap's best channel)
Score(channel) = Σ 1 / hoursAgo² for each snap tagged to that channel

hoursAgo = (now - max(createdAt, updatedAt)).TotalHours
```

**Properties**:

- A snap from 1 hour ago scores **576×** more than the same snap from 24 hours ago
- Channels with clusters of recent activity (e.g. a committee hearing + 3 related snaps) score higher than lone items
- Rolling window: **48 hours** (configurable via constructor injection)
- Eligible channel prefixes: `FloorDebate:*`, `Representative:*`, `PolicyArea:*`
- Result: top-N snap IDs ordered by combined channel heat + individual snap recency

**What the algorithm does NOT yet incorporate**:

- User pulse / engagement signals from the mobile `ForensicSignalCoordinator`
- Consensus Ripple signature count
- Watchlist add rate
- Cross-district resonance (same issue trending in multiple districts)

### MVP Score Enhancement (Phase 2 — Post-Wire)

For the MVP, the existing Recency Burst is sufficient. Post-MVP, add an **Engagement Boost** layer:

$$\text{Score}_{enhanced}(snap) = \text{RecencyScore}(snap) \times (1 + \lambda \cdot E)$$

Where:

- $E$ = normalized engagement count (pulses + signatures + watchlists in last 24h)
- $\lambda$ = engagement weight coefficient (suggested: `0.3` to start)

This requires a `POST /api/snaps/{id}/signal` endpoint to receive engagement events from mobile (see Tasks).

---

## 3. Where the List Lives

### API Side

| Component    | Location                                                       | Notes                                                 |
| ------------ | -------------------------------------------------------------- | ----------------------------------------------------- |
| Algorithm    | `PoliTickIt.Infrastructure/Trending/ChannelTrendingService.cs` | In-memory computation                                 |
| Cache        | `_cache` field (volatile, in-memory)                           | Null = stale, recomputed on next `GetTrending()` call |
| Invalidation | `_trending.Invalidate()` called in `IngestionController`       | Resets on every snap ingest batch                     |
| Response     | `GET /api/snaps?mode=trending` → `SnapFeedResponse`            | Snaps ordered by score descending                     |

The trending list is **not persisted** — it is recomputed from the in-memory snap store whenever the cache is stale. This is correct for MVP given the current snap volume. When snap counts grow large (10K+), consider background computation on a timer.

### Mobile Side (Target State)

Trending snaps should be fetched from the API, not from local SQLite. The mobile app needs a `ApiSnapRepository` (or extend `OmniFeedProvider`) to call `GET /api/snaps?mode=trending`.

Optionally cache the last trending response in SQLite (`snaps` table with a `source = "trending"` marker) for offline display — low priority for MVP.

---

## 4. Volume — How Many Trending Snaps

| Context                         | Count                          | Rationale                                            |
| ------------------------------- | ------------------------------ | ---------------------------------------------------- |
| **Accountability Trending tab** | **20 snaps**                   | Matches `ChannelTrendingService` default `topN = 20` |
| API max (fallback)              | Up to 200                      | `MaxLimit` in `SnapsController`                      |
| Initial page size               | 20                             | Load more on scroll (pagination via `offset`)        |
| Refresh cadence                 | On tab focus + pull-to-refresh | Same pattern as Focus tab                            |

The Trending tab should not be filtered to followed reps or policy areas — by design, it surfaces **any snap** that is heating up, regardless of the user's preferences. This is the explicit requirement from the user brief.

---

## 5. Channels — What Drives Trending

### Current Eligible Channels

| Channel Prefix    | Example                  | Represents                            |
| ----------------- | ------------------------ | ------------------------------------- |
| `FloorDebate:`    | `FloorDebate:HR1041`     | Active floor proceedings              |
| `Representative:` | `Representative:D000622` | Activity around a specific rep        |
| `PolicyArea:`     | `PolicyArea:ArmedForces` | Legislative movement in a policy area |

### Recommended Additions (Phase 2)

| Channel Prefix | Example             | Represents                                        |
| -------------- | ------------------- | ------------------------------------------------- |
| `Vote:`        | `Vote:2026-S-042`   | Active/just-completed roll call votes             |
| `Committee:`   | `Committee:SSAS`    | Committee markup / hearing sessions               |
| `State:`       | `State:TX`          | State-scoped activity (future: state legislature) |
| `National:`    | `National:BudgetCR` | Omnibus / national legislative moments            |

> **Note**: Adding new prefixes to `ChannelTrendingService._trendingPrefixes` takes one line. Snaps must be tagged with the corresponding channel at ingestion time by the Oracle Providers.

---

## 6. Display in Accountability Screen

### Current Trending Tab Behavior (Broken)

```typescript
// accountability.tsx — current broken filter
const isTrending = snap.id.includes("trending") || snap.type === "trends";
if (selectedSegment === "trending" && !isTrending) return false;
```

This filters from the already-loaded Focus snaps looking for snaps with "trending" in the ID. Since `trendingSnaps` in `snapLibrary.ts` is empty, the tab shows nothing.

### Target Behavior

The Trending tab loads a **separate, independently fetched list** from `GET /api/snaps?mode=trending`. It:

- Shows any snap type (Accountability, Community, Knowledge) — not filtered to user follows
- Is not subject to the rep/policy area filters (those belong to Focus tab only)
- Retains: pull-to-refresh, scroll pagination, snap renderer
- Does **not** show: the filter button (no point filtering a trending list)
- Shows: a small "Trending" badge or score indicator on each snap card (optional, Phase 2)

### UI Changes Required

1. **Separate state**: `trendingSnaps: PoliSnap[]` alongside existing `snaps: PoliSnap[]`
2. **Separate load function**: `loadTrendingSnaps()` called when segment switches to `"trending"` or on refresh
3. **Filter bypass**: When `selectedSegment === "trending"`, skip all `displayedSnaps` filters (rep, policy, insight type, importance)
4. **Filter button hidden**: Show filter icon only on `"focus"` segment
5. **Empty state**: "No trending snaps right now — check back shortly" (not "no snaps match your filters")

---

## 7. Implementation Plan

### Phase 1 — Wire the API (MVP)

**Step 1: Add `ApiSnapRepository` (or inline in `OmniFeedProvider`)**

Create `apps/mobile/services/implementations/ApiSnapRepository.ts`:

```typescript
export class ApiSnapRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTrendingSnaps(limit = 20, offset = 0): Promise<PoliSnap[]> {
    const resp = await fetch(
      `${this.baseUrl}/snaps?mode=trending&limit=${limit}&offset=${offset}`,
    );
    if (!resp.ok) return [];
    const data: SnapFeedResponse = await resp.json();
    return data.snaps ?? [];
  }
}
```

**Step 2: Add `getTrendingFeed()` to `IOmniFeedProvider`**

```typescript
// IOmniFeedProvider.ts
getTrendingFeed(limit?: number, offset?: number): Promise<FeedResult>;
```

**Step 3: Implement in `OmniFeedProvider`**

```typescript
async getTrendingFeed(limit = 20, offset = 0): Promise<FeedResult> {
  try {
    const snaps = await this.apiSnapRepository.getTrendingSnaps(limit, offset);
    return { snaps };
  } catch {
    return { snaps: [] };
  }
}
```

**Step 4: Update `accountability.tsx`**

```typescript
// Separate state for trending
const [trendingSnaps, setTrendingSnaps] = useState<PoliSnap[]>([]);
const [isTrendingLoading, setIsTrendingLoading] = useState(false);

const loadTrendingSnaps = useCallback(async () => {
  setIsTrendingLoading(true);
  try {
    const { snaps } = await omniFeedProvider.getTrendingFeed(20, 0);
    setTrendingSnaps(snaps);
  } catch (error) {
    console.error("Error loading trending snaps:", error);
  } finally {
    setIsTrendingLoading(false);
  }
}, [omniFeedProvider]);

// Load trending when segment switches
useEffect(() => {
  if (selectedSegment === "trending") loadTrendingSnaps();
}, [selectedSegment, loadTrendingSnaps]);
```

**Step 5: Route display to correct snap list**

```typescript
// Use trendingSnaps directly when on trending tab — bypass all filters
const displayedSnaps =
  selectedSegment === "trending"
    ? trendingSnaps
    : snaps.filter(/* existing filter logic */);
```

---

### Phase 2 — Engagement Signals (Post-MVP)

**Goal**: Feed user engagement back to the API to boost trending scores for snaps that are generating real interaction, not just recent publication.

**New API endpoint**:

```
POST /api/snaps/{id}/signal
Body: { signalType: "pulse" | "signature" | "watchlist" | "share", userId: string }
```

- Mobile fires this after any `forensicSignalCoordinator.emitSignal()` call
- API accumulates signals in a `SignalStore` (in-memory or Cosmos)
- `ChannelTrendingService.Compute()` reads from `SignalStore` and applies the engagement boost formula above
- No PII — only snap IDs and signal types

**New channel tags at ingestion** (add to Oracle Providers):

- Add `Vote:*` and `Committee:*` channel prefixes to snap metadata in `BaseOracleProvider`
- Update `ChannelTrendingService._trendingPrefixes` to include new prefixes

---

## 8. Trending Score Debug Endpoint (Optional but Useful)

Add to `SnapsController` or a new `TrendingController`:

```
GET /api/snaps/trending/debug
Returns: [{ snapId, score, primaryChannel, title }] for inspection
```

Useful during QA to verify the algorithm is picking up the right snaps.

---

## 9. Tasks

### API

- [ ] **Phase 2**: Add `POST /api/snaps/{id}/signal` endpoint to receive mobile engagement signals
- [ ] **Phase 2**: Feed `SignalStore` into `ChannelTrendingService.Compute()` with engagement boost multiplier
- [ ] **Phase 2**: Add `Vote:*`, `Committee:*` to `_trendingPrefixes` and ensure Oracle Providers tag snaps correctly
- [ ] **Optional**: Add `GET /api/snaps/trending/debug` for score inspection during QA

### Mobile

- [ ] Create `ApiSnapRepository.ts` with `getTrendingSnaps(limit, offset)` — calls `GET /api/snaps?mode=trending`
- [ ] Add `getTrendingFeed()` to `IOmniFeedProvider` interface
- [ ] Implement `getTrendingFeed()` in `OmniFeedProvider` (delegates to `ApiSnapRepository`)
- [ ] Register `ApiSnapRepository` in Awilix container in `service-provider.tsx`
- [ ] Update `accountability.tsx`:
  - Add `trendingSnaps` state + `loadTrendingSnaps()` function
  - Load trending on segment switch to `"trending"` + on pull-to-refresh
  - Bypass all filters when `selectedSegment === "trending"`
  - Hide filter button on Trending tab
  - Add appropriate empty state for Trending tab
- [ ] Remove the dead `snap.id.includes("trending")` filter logic from `displayedSnaps`
- [ ] **Phase 2**: Fire `POST /api/snaps/{id}/signal` after `forensicSignalCoordinator.emitSignal()` in `ForensicSignalCoordinator.ts`

### Config / Infra

- [ ] Ensure Azure App Service base URL is wired into `ApiSnapRepository` (same env config as `ApiRepresentativeRepository`)
- [ ] Set `ChannelTrendingService` window in `appsettings.json` (default 48h is fine for MVP)
