# B5 — Mobile Storage Hardening: Manual Test Cases

**Phase**: B — Mobile Storage Hardening  
**Date**: 2026-06-07  
**Scope**: Cold start full-fetch, delta-cursor sync, retraction tombstone eviction, TTL cache purge

---

## Prerequisites

- PoliTickIt API is running locally (`dotnet run` or CyberX-Api task)
- Expo dev server is running (`[PoliTickIt-Mobile] EXPO START` task)
- Mobile app is open on a simulator or physical device
- Metro bundler console is visible for log output

---

## Quick Utility — Check AsyncStorage State

Paste into the Expo JS console at any time to inspect the sync cursor:

```js
import AsyncStorage from "@react-native-async-storage/async-storage";
const val = await AsyncStorage.getItem("@politickit:lastSyncedAt");
console.log("lastSyncedAt:", val);
```

---

## TC-1 — Cold Start: No cursor → full fetch

**What it verifies**: When no `lastSyncedAt` cursor exists, the app performs a full snap fetch instead of a delta call.

### Precondition

- API is running
- Mobile app has been run at least once (SQLite database exists)

### Steps

1. Delete the sync cursor from AsyncStorage via the Expo JS console:
   ```js
   await AsyncStorage.removeItem("@politickit:lastSyncedAt");
   ```
2. Close and reopen the app (or trigger a background → foreground transition).
3. Watch the Metro/Expo console output.

### Expected Console Output (Mobile)

```
[ApiSyncService] Starting Auto-Sync with C# Backend...
[ApiSyncService] Full snap sync (no cursor)...
[ApiSyncService] Full sync complete: N snaps.
```

### Expected API Log (.NET)

- `GET /api/snaps` is hit — **not** `/api/snaps/delta`

### Pass Criteria

- ✅ No `lastSyncedAt` key in AsyncStorage before sync
- ✅ "Full snap sync" log line appears in Metro console
- ✅ `@politickit:lastSyncedAt` is **set** in AsyncStorage after sync completes

---

## TC-2 — Second Run: Cursor exists → delta fetch

**What it verifies**: When a `lastSyncedAt` cursor exists, the app calls the delta endpoint instead of doing a full fetch.

### Precondition

- TC-1 has been run so `@politickit:lastSyncedAt` is present in AsyncStorage

### Steps

1. Confirm `@politickit:lastSyncedAt` is present (use Quick Utility above).
2. Close and reopen the app again to trigger another sync.
3. Watch the Metro/Expo console output.

### Expected Console Output (Mobile)

```
[ApiSyncService] Starting Auto-Sync with C# Backend...
[ApiSyncService] Delta sync since <ISO-timestamp>...
[ApiSyncService] Delta sync complete: N changes.
```

### Expected API Log (.NET)

- `GET /api/snaps/delta?since=<timestamp>` is hit
- Response body shape: `{ snaps: [...], total: N, since: "...", syncTimestamp: "..." }`

### Pass Criteria

- ✅ "Delta sync since" log line appears with the timestamp stored from TC-1
- ✅ `@politickit:lastSyncedAt` is **updated** to a newer timestamp after this sync
- ✅ `total` returned by the delta endpoint is ≤ the full snap count from TC-1

---

## TC-3 — Retraction: Tombstone evicts snap from feed

**What it verifies**: A snap marked `isRetracted: true` on the API is deleted from the local SQLite cache during delta sync and no longer appears in the feed.

### Precondition

- At least one snap is visible in the feed (from TC-1 or TC-2)
- Direct file access to `apps/services/PoliTickIt.Api/Data/snaps/`

### Steps

1. Note the `id` of any snap currently visible in the feed.
2. Open that snap's JSON file in `Data/snaps/` and set:
   ```json
   "isRetracted": true,
   "retractedAt": "<current UTC ISO timestamp>",
   "updatedAt": "<current UTC ISO timestamp>"
   ```
3. Trigger an API hot-reload to pick up the file change:
   ```
   POST /admin/reload
   ```
4. Force a delta covering this snap by backdating the cursor in the Expo JS console:
   ```js
   await AsyncStorage.setItem(
     "@politickit:lastSyncedAt",
     "2020-01-01T00:00:00Z",
   );
   ```
5. Background/foreground the app to trigger sync.
6. Navigate to the feed and search for the snap.

### Expected Console Output (Mobile)

```
[ApiSyncService] Delta sync since 2020-01-01T00:00:00.000Z...
[ApiSyncService] Delta sync complete: N changes.
```

### Pass Criteria

- ✅ The retracted snap is **absent** from the feed after sync
- ✅ If the snap somehow persists in SQLite, the renderer returns `null` (retraction safety net in `polisnap-renderer.tsx`)
- ✅ No crash or error in the Metro console

---

## TC-4 — TTL Eviction: Stale snaps purged on cold start

**What it verifies**: Snaps with a `cached_at` older than 24 hours are automatically deleted from SQLite during `SqliteDatabaseService.initialize()`.

### Precondition

- SQLite browser tool installed (e.g. [DB Browser for SQLite](https://sqlitebrowser.org/))
- `politickit.db` accessible on the simulator/device

### Steps

1. Open `politickit.db` in the SQLite browser.
2. Manually set `cached_at` on one snap row to a stale value:
   ```sql
   UPDATE snaps SET cached_at = '2020-01-01 00:00:00' WHERE id = '<target-id>';
   ```
3. Force-close and reopen the app (this triggers database initialization and TTL eviction).
4. After restart, query the database:
   ```sql
   SELECT * FROM snaps WHERE cached_at < datetime('now', '-24 hours');
   ```

### Expected Console Output (Mobile)

```
[SqliteDatabaseService] TTL eviction complete (threshold: 24h).
```

### Pass Criteria

- ✅ The manually backdated snap row is **gone** from SQLite after restart
- ✅ Other snaps with recent `cached_at` values are unaffected
- ✅ TTL eviction log line appears in Metro console

---

## Test Run Log

| TC   | Date | Tester | Result | Notes |
| ---- | ---- | ------ | ------ | ----- |
| TC-1 |      |        |        |       |
| TC-2 |      |        |        |       |
| TC-3 |      |        |        |       |
| TC-4 |      |        |        |       |
