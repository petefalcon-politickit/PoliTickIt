# Watchlist Evolution — Initiative Analysis & Implementation Plan

**Classification**: Architecture Initiative  
**Status**: Ready for Implementation  
**Date**: 2026-06-07  
**Scope**: Snap Correlation Model · Watchlist UX · API Surface · Local Storage  
**Target Phases**: W1 – W5

---

## Cold-Start Briefing

This document is the complete implementation reference for the Watchlist Evolution initiative. An engineer or AI agent starting fresh can read this document and execute the full plan without prior session context.

**Solution root**: `C:\Projects\Alithix\Products\PoliTickIt\`  
**Runtime**: ASP.NET Core 9.0 (API) · Expo React Native SDK 54 (Mobile)  
**Monorepo layout**: `apps/services/` (C#) · `apps/mobile/` (TypeScript/React Native)

### Key Files for This Initiative

| File | Purpose |
|---|---|
| `apps/services/PoliTickIt.Domain/Models/PoliSnap.cs` | Core domain model — add correlation fields here |
| `apps/services/PoliTickIt.Domain/Interfaces/ISnapRepository.cs` | Repository contract — add query methods here |
| `apps/services/PoliTickIt.Domain/CanonicalModel/ISnapSchemaRegistry.cs` | SnapSchema record definition |
| `apps/services/PoliTickIt.Ingestion/Schema/SnapSchemaRegistry.cs` | Registered snap type schemas |
| `apps/services/PoliTickIt.Ingestion/Schema/SnapBuilder.cs` | Fluent builder — add `.WithCorrelationKey()` etc. here |
| `apps/services/PoliTickIt.Ingestion/Providers/CongressionalActivityProvider.cs` | Reference provider for correlation wiring |
| `apps/services/PoliTickIt.Api/Controllers/SnapsController.cs` | Add `GET /api/snaps/process/{key}` here |
| `apps/services/PoliTickIt.Api/Controllers/WatchlistController.cs` | Add process watch endpoints here |
| `apps/services/PoliTickIt.Infrastructure/Persistence/LocalFileSnapRepository.cs` | Add `GetByCorrelationKeyAsync` here |
| `apps/services/PoliTickIt.Infrastructure/Persistence/InMemorySnapRepository.cs` | Add `GetByCorrelationKeyAsync` here |
| `apps/mobile/types/polisnap.ts` | TypeScript snap model — mirror correlation fields here |
| `apps/mobile/types/watched-process.ts` | New file — WatchedProcess TypeScript type |
| `apps/mobile/services/implementations/SqliteDatabaseService.ts` | Add Migrations 26 + 27 here |
| `apps/mobile/services/implementations/SqliteSnapRepository.ts` | Add `getByCorrelationKey()` and update saver |
| `apps/mobile/services/implementations/WatchlistService.ts` | Reference pattern for WatchedProcessService |
| `apps/mobile/app/(tabs)/watchlist.tsx` | Watchlist screen — restructure tabs here |
| `apps/mobile/services/container.ts` | DI container — register new service here |
| `apps/mobile/contexts/service-provider.tsx` | Add new service to context type and resolution |

---

## 1. Problem Statement

PoliTickIt currently supports adding a single `PoliSnap` to a watchlist. This works for static, self-contained content but breaks down for **process-oriented political events** — things that evolve over time and generate a family of related snaps.

### 1.1 Concrete Examples of the Gap

| User Intent | What They Add Today | What They Actually Need |
|---|---|---|
| Follow a bill through Congress | Adds the `BillActivity` intro snap | All subsequent snaps: votes, amendments, debate, final passage |
| Track an open cabinet seat | Adds a `CommitteeHearing` snap | All snaps in the confirmation process: nomination, hearing, vote |
| Monitor an Executive Order | Adds the initial `ExecutiveOrder` snap | Amendments, agency implementation rules, legal challenges |
| Watch a FEC contribution pattern | Adds one `FecContribution` snap | All contributions from the same donor to the same rep |
| Track a local zoning decision | Adds one `MunicipalMotion` snap | Public comment period, council vote, final ruling |
| Follow a judicial appointment | Adds one snap | All hearing snaps, committee vote, Senate confirmation vote |

The current watchlist is a **bookmark list**. What users need is a **process tracker**.

### 1.2 The Two Distinct Features

| Feature | Name | What It Is |
|---|---|---|
| **F1** | **Snap Bookmarks** | Save a specific snap to revisit it. Short-lived, personal, flat list. Already exists — no changes required. |
| **F2** | **Process Trackers** | Watch a political process and automatically see all related snaps as they are generated. Long-lived, structured, requires snap correlation. This is the new work. |

F1 and F2 are **additive**. The existing bookmark watchlist is completely unchanged.

---

## 2. Extensibility — Is This Generic for Any Concept?

**Yes — by design.** The correlation model uses a single string field (`CorrelationKey`) with a free-form but conventioned format. The system makes **no assumption about what a process is**. The examples in §1 (bills, seats, EOs) are just illustrations — the mechanism works identically for any political event at any level of government.

### 2.1 The `CorrelationKey` Convention

```
{processType}:{stableId}
```

Examples spanning every level of government and domain:

| Domain | CorrelationKey | ProcessType |
|---|---|---|
| Federal bill | `bill:H.R.1041` | `BillActivity` |
| Executive order | `eo:14110` | `ExecutiveOrder` |
| Cabinet nomination | `cabinet:AG-2026` | `CabinetNomination` |
| Senate confirmation | `confirmation:D000622` | `CommitteeHearing` |
| FEC donor pattern | `fec-donor:C001234:S000148` | `FecContribution` |
| Federal grant | `grant:OPP-2026-NSF-001` | `GrantPulse` |
| Ethics investigation | `ethics:OCE-2026-042` | `EthicsCommittee` |
| State bill | `state-bill:TX-HB-1234` | `StateLegislation` |
| County ordinance | `ordinance:TX-Travis-2026-012` | `CountyOrdinance` |
| City council motion | `motion:Austin-TX-2026-CM-088` | `MunicipalMotion` |
| School board action | `schoolboard:AISD-2026-04` | `SchoolBoardAction` |
| Local election | `election:TX-HD-50-2026` | `LocalElection` |
| Ballot measure | `ballot:TX-Prop12-2026` | `BallotMeasure` |
| Judicial appointment | `judicial:SCOTUS-2026-seat1` | `JudicialNomination` |
| Any future concept | `{type}:{stableId}` | Any registered snap type |

### 2.2 Why This Is Extensible

The system does not enumerate what a process can be. Adding a new process type requires only:

1. Register a `SnapSchema` in `SnapSchemaRegistry.cs` with `IsProcessOriented = true`.
2. Write an `ISnapMapper<TSource>` that sets `CorrelationKey` as a deterministic function of source data.

There is **no enum of process types**, no class hierarchy, no switch statement anywhere that would need updating. The mobile Process Tracker UI queries snaps by `CorrelationKey` string — it does not care what the key represents.

### 2.3 The `ProcessStep` Convention Is Also Generic

`ProcessStep` is an `int`. Its meaning is defined entirely by the mapper for each snap type:

- Bills: `1=Introduced, 2=Committee, 3=Floor, 4=Signed`
- Cabinet nominations: `1=Nominated, 2=Hearing, 3=Committee Vote, 4=Senate Vote, 5=Confirmed/Rejected`
- Zoning decisions: `1=Proposed, 2=Public Comment, 3=Planning Board, 4=Council Vote, 5=Finalized`
- Anything with no defined stages: set to `0` or omit — the UI falls back to chronological sort

The mobile `ProcessTrackerCard` renders the steps as a progress rail using whatever integers are present — it never hard-codes stage names or counts.

### 2.4 The `SnapMetadata` Fields Are Also Extensible

The existing `SnapMetadata` class uses a mix of typed properties (`BillId`, `RepresentativeId`, `PolicyAreaId`) and the `BodyText`/`BodyHtmlUrl` pattern. This is intentional. For new domains:

- **Add a typed property** to `SnapMetadata` when the field is a stable query key used across multiple providers (e.g., `CaseId`, `AppropriationsId`).
- **Use `metadata_json`** serialization for domain-specific ad-hoc fields that are display-only — they round-trip through JSON without schema changes.
- **Never put display logic in metadata** — renderer presentation is driven by element types, not metadata fields.

---

## 3. Current Architecture Assessment

### 3.1 What Exists (Do Not Re-implement)

**Schema system**:
- `ISnapSchemaRegistry` / `SnapSchemaRegistry` — 5 registered snap types
- `SnapBuilder` — fluent builder with `ForType`, `WithTitle`, `WithContentKey`, `AddChannel`, `AddElement`, `Build`
- `ISnapMapper<TSource>` — per-provider typed mapping contract
- `SnapSchema` record: `Type`, `RequiredElements`, `RequiredChannelPrefixes`, `DefaultTtl`

**Repository**:
- `ISnapRepository`: `SaveSnapAsync`, `GetAllSnapsAsync`, `GetSnapByIdAsync`, `FindByContentKeyAsync`, `GetDeltaAsync`
- `LocalFileSnapRepository` + `InMemorySnapRepository` — both use a `Dictionary<string, PoliSnap> _store`

**Watchlist (F1 — fully working)**:
- SQLite table: `watchlist (snap_id, createdAt, synced, syncedAt)`
- `IWatchlistService` / `WatchlistService` — get/add/remove/isWatched/syncToCloud
- `WatchlistController` — GET/POST/DELETE `/api/watchlist/{snapId}`

### 3.2 Gaps to Fill by Phase

| Gap | Phase |
|---|---|
| `CorrelationKey`, `ParentSnapId`, `ProcessStep`, `ProcessStage` on `PoliSnap` | W1 |
| `IsProcessOriented`, `CorrelationKeyFormat` on `SnapSchema` | W1 |
| `.WithCorrelationKey()` etc. on `SnapBuilder` | W1 |
| `WatchedProcess` domain model + `IWatchedProcessRepository` | W1 |
| `GetByCorrelationKeyAsync`, `GetByChannelsAsync` on `ISnapRepository` | W1 |
| SQLite Migrations 26 + 27 | W1 |
| `getByCorrelationKey()` on `SqliteSnapRepository` + saver update | W1 |
| Correlation wired in all Oracle provider mappers | W2 |
| `GET /api/snaps/process/{correlationKey}` | W3 |
| `GET/POST/DELETE /api/watchlist/processes/{correlationKey}` | W3 |
| `LocalFileWatchedProcessRepository` | W3 |
| `IWatchedProcessService` / `WatchedProcessService` | W4 |
| DI + context registration | W4 |
| Watchlist screen tabs restructure + `ProcessTrackerCard` | W5 |
| "Track Process" button in `PoliSnapRenderer` | W5 |

---

## 4. Domain Model Changes (W1)

### 4.1 `PoliSnap.cs` — Add Correlation Fields

Add after the `RetractedAt` property:

```csharp
// ── Process Correlation ──────────────────────────────────────────────────────

/// <summary>
/// Groups all snaps belonging to the same political process.
/// Convention: "{processType}:{stableId}" — e.g. "bill:H.R.1041",
/// "eo:14110", "cabinet:AG-2026", "state-bill:TX-HB-1234".
/// Set deterministically by the ISnapMapper at ingest time.
/// Null for standalone snaps that are not part of a process.
/// </summary>
public string? CorrelationKey { get; set; }

/// <summary>
/// The snap ID of the root/origin snap in this process.
/// Null if this snap IS the root, or if the snap is standalone.
/// </summary>
public string? ParentSnapId { get; set; }

/// <summary>
/// Ordinal step within the process (1=first stage, N=final stage).
/// Meaning is defined per snap type by the mapper.
/// Null for standalone snaps or process types with no defined stages.
/// </summary>
public int? ProcessStep { get; set; }

/// <summary>
/// Human-readable stage label verbatim from the source data.
/// e.g. "Introduced", "In Committee", "Passed House", "Signed into Law".
/// </summary>
public string? ProcessStage { get; set; }
```

### 4.2 `ISnapSchemaRegistry.cs` — Extend `SnapSchema`

The `SnapSchema` record currently has 4 positional parameters. Add two optional named parameters:

```csharp
public record SnapSchema(
    string Type,
    IReadOnlyList<SnapElementTemplate> RequiredElements,
    IReadOnlyList<string> RequiredChannelPrefixes,
    TimeSpan DefaultTtl,
    bool IsProcessOriented = false,
    string? CorrelationKeyFormat = null
);
```

`CorrelationKeyFormat` is documentation only (e.g. `"bill:{BillNumber}"`) — it is not validated at runtime. It tells the next engineer writing a mapper exactly what format to use.

### 4.3 `WatchedProcess.cs` — New Domain Model

Create `apps/services/PoliTickIt.Domain/Models/WatchedProcess.cs`:

```csharp
namespace PoliTickIt.Domain.Models;

public class WatchedProcess
{
    /// <summary>Deterministic composite: first 16 hex chars of SHA256("{userId}:{correlationKey}").</summary>
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string CorrelationKey { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string ProcessType { get; set; } = string.Empty;
    public DateTime WatchedSince { get; set; } = DateTime.UtcNow;
    public bool NotifyOnUpdate { get; set; } = true;
    public DateTime? LastViewedAt { get; set; }
}
```

### 4.4 `IWatchedProcessRepository.cs` — New Interface

Create `apps/services/PoliTickIt.Domain/Interfaces/IWatchedProcessRepository.cs`:

```csharp
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IWatchedProcessRepository
{
    Task<IEnumerable<WatchedProcess>> GetForUserAsync(string userId, CancellationToken ct = default);
    Task AddAsync(WatchedProcess process, CancellationToken ct = default);
    Task RemoveAsync(string userId, string correlationKey, CancellationToken ct = default);
    Task<bool> IsWatchingAsync(string userId, string correlationKey, CancellationToken ct = default);
    Task UpdateLastViewedAsync(string userId, string correlationKey, DateTime viewedAt, CancellationToken ct = default);
}
```

### 4.5 `ISnapRepository.cs` — Two New Methods

```csharp
/// <summary>
/// Returns all snaps sharing the given correlation key,
/// ordered by ProcessStep ASC then CreatedAt ASC.
/// </summary>
Task<IEnumerable<PoliSnap>> GetByCorrelationKeyAsync(string correlationKey);

/// <summary>
/// Returns snaps whose Channels list contains at least one of the given channels.
/// Ordered newest first. Capped at <paramref name="limit"/>.
/// </summary>
Task<IEnumerable<PoliSnap>> GetByChannelsAsync(IEnumerable<string> channels, int limit = 100);
```

---

## 5. SnapBuilder Extensions (W1)

Add these four methods to `SnapBuilder.cs` alongside the existing `WithContentKey()`:

```csharp
public SnapBuilder WithCorrelationKey(string? correlationKey)
{
    _snap.CorrelationKey = correlationKey;
    return this;
}

public SnapBuilder WithParentSnapId(string? parentSnapId)
{
    _snap.ParentSnapId = parentSnapId;
    return this;
}

public SnapBuilder WithProcessStep(int? step)
{
    _snap.ProcessStep = step;
    return this;
}

public SnapBuilder WithProcessStage(string? stage)
{
    _snap.ProcessStage = stage;
    return this;
}
```

No changes to `Build()` — correlation fields are always optional.

---

## 6. SnapSchemaRegistry Updates (W1)

Update the 5 existing schemas in `SnapSchemaRegistry.cs` to declare correlation metadata. Because `IsProcessOriented` and `CorrelationKeyFormat` are optional named parameters on the record, this is a non-breaking additive change:

| Schema | IsProcessOriented | CorrelationKeyFormat |
|---|---|---|
| `ExecutiveOrder` | `true` | `"eo:{EoNumber}"` |
| `BillActivity` | `true` | `"bill:{BillNumber}"` |
| `FecContribution` | `true` | `"fec-donor:{DonorId}:{RepBioguide}"` |
| `StagnationSentinel` | `false` | `null` |
| `GrantPulse` | `true` | `"grant:{OpportunityId}"` |

New schemas for future providers (register when the provider is built):

| Schema | IsProcessOriented | CorrelationKeyFormat |
|---|---|---|
| `CommitteeHearing` | `true` | `"hearing:{CommitteeCode}-{Congress}"` |
| `CabinetNomination` | `true` | `"cabinet:{RoleCode}-{Year}"` |
| `StateLegislation` | `true` | `"state-bill:{StateCode}-{BillNumber}"` |
| `CountyOrdinance` | `true` | `"ordinance:{StateCode}-{County}-{Year}-{Seq}"` |
| `MunicipalMotion` | `true` | `"motion:{CitySlug}-{Year}-{Seq}"` |
| `JudicialNomination` | `true` | `"judicial:{CourtCode}-{Year}-{Seat}"` |

---

## 7. Repository Implementations (W1)

### 7.1 `LocalFileSnapRepository.cs`

```csharp
public Task<IEnumerable<PoliSnap>> GetByCorrelationKeyAsync(string correlationKey)
{
    var results = _store.Values
        .Where(s => string.Equals(s.CorrelationKey, correlationKey, StringComparison.OrdinalIgnoreCase))
        .OrderBy(s => s.ProcessStep ?? int.MaxValue)
        .ThenBy(s => s.CreatedAt)
        .ToList();
    return Task.FromResult<IEnumerable<PoliSnap>>(results);
}

public Task<IEnumerable<PoliSnap>> GetByChannelsAsync(IEnumerable<string> channels, int limit = 100)
{
    var channelSet = new HashSet<string>(channels, StringComparer.OrdinalIgnoreCase);
    var results = _store.Values
        .Where(s => s.Channels.Any(c => channelSet.Contains(c)))
        .OrderByDescending(s => s.CreatedAt)
        .Take(limit)
        .ToList();
    return Task.FromResult<IEnumerable<PoliSnap>>(results);
}
```

### 7.2 `InMemorySnapRepository.cs`

Apply the identical two method implementations to the inner `Repository` class. The `_store` field has the same type and semantics.

### 7.3 `LocalFileWatchedProcessRepository.cs` (dev stub)

Create `apps/services/PoliTickIt.Infrastructure/Persistence/LocalFileWatchedProcessRepository.cs`:

```csharp
public sealed class LocalFileWatchedProcessRepository : IWatchedProcessRepository
{
    private readonly List<WatchedProcess> _store = new();
    private readonly Lock _lock = new();

    public Task<IEnumerable<WatchedProcess>> GetForUserAsync(string userId, CancellationToken ct = default)
    {
        lock (_lock)
            return Task.FromResult<IEnumerable<WatchedProcess>>(
                _store.Where(p => p.UserId == userId).ToList());
    }

    public Task AddAsync(WatchedProcess process, CancellationToken ct = default)
    {
        lock (_lock)
            if (!_store.Any(p => p.UserId == process.UserId && p.CorrelationKey == process.CorrelationKey))
                _store.Add(process);
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string userId, string correlationKey, CancellationToken ct = default)
    {
        lock (_lock) _store.RemoveAll(p => p.UserId == userId && p.CorrelationKey == correlationKey);
        return Task.CompletedTask;
    }

    public Task<bool> IsWatchingAsync(string userId, string correlationKey, CancellationToken ct = default)
    {
        lock (_lock)
            return Task.FromResult(_store.Any(p => p.UserId == userId && p.CorrelationKey == correlationKey));
    }

    public Task UpdateLastViewedAsync(string userId, string correlationKey, DateTime viewedAt, CancellationToken ct = default)
    {
        lock (_lock)
        {
            var proc = _store.FirstOrDefault(p => p.UserId == userId && p.CorrelationKey == correlationKey);
            if (proc != null) proc.LastViewedAt = viewedAt;
        }
        return Task.CompletedTask;
    }
}
```

---

## 8. Oracle Provider Correlation Wiring (W2)

### 8.1 Rule for All Providers

Every `ISnapMapper<TSource>` whose snap type has `IsProcessOriented = true` MUST:
- Call `.WithCorrelationKey(...)` with a value derived deterministically from a source DTO field.
- Call `.WithProcessStep(...)` using a static lookup table (not an if-chain, not AI).
- Call `.WithProcessStage(...)` with the verbatim label from the source data.

### 8.2 `CongressionalActivityProvider` — Reference Implementation

```csharp
.WithCorrelationKey($"bill:{item.BillNumber}")
.WithProcessStep(MapBillActionToStep(item.ActionCode))
.WithProcessStage(item.ActionText ?? item.ActionDescription ?? "Unknown")
.WithParentSnapId(item.IsIntroductoryAction ? null : $"bill-{NormalizeBillNumber(item.BillNumber)}-intro")
```

```csharp
private static int MapBillActionToStep(string? code) => code switch
{
    "1000" => 1,   // Introduced
    "2000" => 1,   // Referred to committee
    "5000" => 2,   // Reported by committee
    "7000" => 3,   // Floor consideration
    "8000" => 3,   // Passed/agreed to in chamber
    "9000" => 4,   // Passed both chambers
    "10000" => 5,  // Enacted / signed
    "11000" => 5,  // Vetoed
    _ => 0
};
```

### 8.3 `FederalRegisterIngestionProvider`

```csharp
.WithCorrelationKey(doc.ExecutiveOrderNumber != null ? $"eo:{doc.ExecutiveOrderNumber}" : null)
.WithProcessStep(1)
.WithProcessStage("Signed")
```

### 8.4 `ProviderBindingValidator` — Process Completeness Check

Add to `ProviderBindingValidator.Validate()`:

```csharp
if (schema.IsProcessOriented && string.IsNullOrEmpty(snap.CorrelationKey))
    report.Warnings.Add(
        $"Snap type '{snap.Type}' is process-oriented (CorrelationKeyFormat: '{schema.CorrelationKeyFormat}') " +
        $"but CorrelationKey was not set by mapper '{mapper.GetType().Name}'.");
```

This is a warning, not an error — allows partial provider development in dev mode.

---

## 9. API Endpoints (W3)

### 9.1 `SnapsController.cs` — Process Query Endpoint

```csharp
// GET /api/snaps/process/{correlationKey}
[HttpGet("process/{correlationKey}")]
[ProducesResponseType(typeof(SnapProcessResponse), StatusCodes.Status200OK)]
public async Task<IActionResult> GetByProcess(string correlationKey)
{
    if (string.IsNullOrWhiteSpace(correlationKey))
        return BadRequest(new { error = "correlationKey is required." });

    var snaps = (await _snapRepository.GetByCorrelationKeyAsync(
        Uri.UnescapeDataString(correlationKey))).ToList();

    var currentStage = snaps
        .OrderByDescending(s => s.ProcessStep ?? 0)
        .FirstOrDefault()?.ProcessStage;

    return Ok(new SnapProcessResponse(correlationKey, snaps, snaps.Count, currentStage));
}

public sealed record SnapProcessResponse(
    string CorrelationKey,
    List<PoliSnap> Snaps,
    int Total,
    string? CurrentStage);
```

### 9.2 `WatchlistController.cs` — Process Watch Endpoints

Inject `IWatchedProcessRepository` alongside the existing `IUserWatchlistRepository`. Add three endpoints after the existing DELETE:

```csharp
// GET /api/watchlist/processes
[HttpGet("processes")]
public async Task<IActionResult> GetWatchedProcesses(CancellationToken ct)
{
    var email = GetUserEmail();
    if (email is null) return Unauthorized();
    var processes = await _watchedProcessRepo.GetForUserAsync(email, ct);
    return Ok(new { processes = processes.ToList() });
}

// POST /api/watchlist/processes/{correlationKey}
[HttpPost("processes/{correlationKey}")]
public async Task<IActionResult> WatchProcess(
    string correlationKey,
    [FromBody] WatchProcessRequest request,
    CancellationToken ct)
{
    var email = GetUserEmail();
    if (email is null) return Unauthorized();
    var key = Uri.UnescapeDataString(correlationKey);
    var process = new WatchedProcess
    {
        Id = ComputeId(email, key),
        UserId = email,
        CorrelationKey = key,
        DisplayName = request.DisplayName,
        ProcessType = request.ProcessType,
        WatchedSince = DateTime.UtcNow
    };
    await _watchedProcessRepo.AddAsync(process, ct);
    return Ok();
}

// DELETE /api/watchlist/processes/{correlationKey}
[HttpDelete("processes/{correlationKey}")]
public async Task<IActionResult> UnwatchProcess(string correlationKey, CancellationToken ct)
{
    var email = GetUserEmail();
    if (email is null) return Unauthorized();
    await _watchedProcessRepo.RemoveAsync(email, Uri.UnescapeDataString(correlationKey), ct);
    return NoContent();
}

public sealed record WatchProcessRequest(string DisplayName, string ProcessType);

private static string ComputeId(string userId, string correlationKey)
{
    var input = System.Text.Encoding.UTF8.GetBytes($"{userId}:{correlationKey}");
    var hash = System.Security.Cryptography.SHA256.HashData(input);
    return Convert.ToHexString(hash)[..16].ToLowerInvariant();
}
```

Register in `Program.cs`:

```csharp
builder.Services.AddSingleton<IWatchedProcessRepository, LocalFileWatchedProcessRepository>();
```

---

## 10. Mobile TypeScript Mirror (W1)

### 10.1 `apps/mobile/types/polisnap.ts`

Add after the `isRetracted` field:

```typescript
// ── Process Correlation ───────────────────────────────────────────────────────
/** Groups all snaps in the same political process. e.g. "bill:H.R.1041". */
correlationKey?: string;
/** ID of the root snap. Null if this snap is the root. */
parentSnapId?: string;
/** Ordinal process step. Meaning defined per snap type. */
processStep?: number;
/** Human-readable stage label verbatim from source. e.g. "In Committee". */
processStage?: string;
```

### 10.2 `apps/mobile/types/watched-process.ts` — New File

```typescript
export interface WatchedProcess {
  id: string;
  correlationKey: string;
  displayName: string;
  processType: string;
  watchedSince: string;       // ISO-8601
  notifyOnUpdate: boolean;
  lastViewedAt?: string;      // ISO-8601 — null until user opens the tracker
}
```

---

## 11. Mobile SQLite Migrations (W1)

Add to `SqliteDatabaseService.ts` inside the second `withTransactionAsync` block, after Migration 25:

```typescript
// Migration 26: Snap correlation fields
if (currentVersion < 26) {
  console.log("[SqliteDatabaseService] Applying Migration 26: Snap correlation fields...");
  for (const sql of [
    "ALTER TABLE snaps ADD COLUMN correlation_key TEXT",
    "ALTER TABLE snaps ADD COLUMN process_step INTEGER",
    "ALTER TABLE snaps ADD COLUMN process_stage TEXT",
    "ALTER TABLE snaps ADD COLUMN parent_snap_id TEXT",
  ]) {
    try { await database.runAsync(sql); } catch { /* column may already exist */ }
  }
  try {
    await database.runAsync(
      "CREATE INDEX IF NOT EXISTS idx_snaps_correlation ON snaps(correlation_key)"
    );
  } catch { /* index may already exist */ }
  await database.runAsync("PRAGMA user_version = 26");
}

// Migration 27: Watched processes table
if (currentVersion < 27) {
  console.log("[SqliteDatabaseService] Applying Migration 27: Watched processes table...");
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS watched_processes (
      id TEXT PRIMARY KEY,
      correlation_key TEXT NOT NULL,
      display_name TEXT,
      process_type TEXT,
      watched_since TEXT DEFAULT (datetime('now')),
      notify_on_update INTEGER DEFAULT 1,
      last_viewed_at TEXT,
      synced INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_wp_correlation ON watched_processes(correlation_key);
  `);
  await database.runAsync("PRAGMA user_version = 27");
}
```

---

## 12. Mobile — `SqliteSnapRepository.ts` Updates (W1)

### 12.1 Update the Saver

The `saver` in the constructor must persist the four new fields:

```typescript
saver: (snap: PoliSnap) => ({
  query: `INSERT OR REPLACE INTO snaps 
    (id, sku, title, type, createdAt, metadata_json, sources_json, cached_at,
     correlation_key, process_step, process_stage, parent_snap_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?)`,
  params: [
    snap.id, snap.sku, snap.title, snap.type, snap.createdAt,
    JSON.stringify(snap.metadata || {}), JSON.stringify(snap.sources || []),
    snap.correlationKey ?? null,
    snap.processStep ?? null,
    snap.processStage ?? null,
    snap.parentSnapId ?? null,
  ],
}),
```

Also update `mapper` to read the new columns:

```typescript
mapper: (row: any) => ({
  // ...existing fields...
  correlationKey: row.correlation_key ?? undefined,
  processStep: row.process_step ?? undefined,
  processStage: row.process_stage ?? undefined,
  parentSnapId: row.parent_snap_id ?? undefined,
}),
```

### 12.2 Add `getByCorrelationKey()`

Add after `deleteSnap()`:

```typescript
async getByCorrelationKey(correlationKey: string): Promise<PoliSnap[]> {
  const rows = await this.db.execute(
    `SELECT * FROM snaps
     WHERE correlation_key = ?
     ORDER BY COALESCE(process_step, 999) ASC, createdAt ASC`,
    [correlationKey],
  );
  return Promise.all(rows.map((row: any) => this.mapRowToSnap(row)));
}
```

---

## 13. Mobile — Service Layer (W4)

### 13.1 `IWatchedProcessService.ts`

Create `apps/mobile/services/interfaces/IWatchedProcessService.ts`:

```typescript
import { PoliSnap } from "@/types/polisnap";
import { WatchedProcess } from "@/types/watched-process";

export interface IWatchedProcessService {
  getWatchedProcesses(): Promise<WatchedProcess[]>;
  watchProcess(correlationKey: string, displayName: string, processType: string): Promise<boolean>;
  unwatchProcess(correlationKey: string): Promise<boolean>;
  isWatching(correlationKey: string): Promise<boolean>;
  getSnapsForProcess(correlationKey: string): Promise<PoliSnap[]>;
  markViewed(correlationKey: string): Promise<void>;
  syncToCloud(): Promise<void>;
}
```

### 13.2 `WatchedProcessService.ts` — Pattern Reference

Create `apps/mobile/services/implementations/WatchedProcessService.ts`. Mirror the structure of `WatchlistService.ts`:

- SQLite `watched_processes` table for local persistence
- `getSnapsForProcess(key)` calls `this.sqliteSnapRepo.getByCorrelationKey(key)` for offline-first; falls back to API (`GET /api/snaps/process/{key}`) when online
- `syncToCloud()` pushes rows where `synced = 0` to the API, then pulls server list and merges missing entries locally
- All methods wrapped in try/catch — no method throws to the caller

### 13.3 DI Registration

In `apps/mobile/services/container.ts` — add to `IServices`:

```typescript
watchedProcessService: WatchedProcessService;
```

Add to `container.register`:

```typescript
watchedProcessService: asClass(WatchedProcessService).singleton(),
```

In `apps/mobile/contexts/service-provider.tsx`:

```typescript
// Import
import { WatchedProcessService } from "../services/implementations/WatchedProcessService";
import { IWatchedProcessService } from "../services/interfaces/IWatchedProcessService";

// ServiceContextType
watchedProcessService: IWatchedProcessService;

// Resolution
watchedProcessService: container.resolve("watchedProcessService"),
```

---

## 14. Mobile — UX Changes (W5)

### 14.1 Watchlist Screen Tab Restructure

File: `apps/mobile/app/(tabs)/watchlist.tsx`

Current tabs: `insights` / `tracked`  
New tabs: `insights` / `tracked` / `processes`

The `tracked` tab renders the existing flat snap list unchanged. The `processes` tab is new.

New state:
```typescript
const [watchedProcesses, setWatchedProcesses] = useState<WatchedProcess[]>([]);
const [processSnaps, setProcessSnaps] = useState<Record<string, PoliSnap[]>>({});
const { watchlistService, watchedProcessService, snapRepository, hapticService } = useServices();
```

Load on focus (add alongside existing `loadWatchlist`):
```typescript
const loadProcesses = useCallback(async () => {
  const processes = await watchedProcessService.getWatchedProcesses();
  setWatchedProcesses(processes);
  const snapMap: Record<string, PoliSnap[]> = {};
  await Promise.all(processes.map(async (p) => {
    snapMap[p.correlationKey] = await watchedProcessService.getSnapsForProcess(p.correlationKey);
  }));
  setProcessSnaps(snapMap);
}, [watchedProcessService]);
```

### 14.2 `ProcessTrackerCard` Component

Create `apps/mobile/components/ui/process-tracker-card.tsx`.

```typescript
interface ProcessTrackerCardProps {
  process: WatchedProcess;
  snaps: PoliSnap[];
  onUnwatch: () => void;
  onSnapPress: (snap: PoliSnap) => void;
}
```

**Render structure**:
1. **Header**: `displayName` + unwatch icon button
2. **Meta**: `processType` · "Watching since {date}"
3. **Progress rail**: Derive sorted unique steps from `snaps`. Filled dot = has snaps, hollow = no snaps yet. Label the highest filled dot as current stage.
4. **New badge**: count of snaps where `createdAt > process.lastViewedAt`
5. **Expand chevron**: reveals `<PoliSnapCollection snaps={sortedSnaps} />` — reuses existing component, no renderer changes

The progress rail is **fully data-driven** — it renders whatever steps exist in the snap data for that key, with no hard-coded stage names or counts.

### 14.3 "Track Process" Button in `PoliSnapRenderer`

Add an optional `onTrackProcess` prop to the renderer action bar (alongside the existing bookmark action). Only rendered when `snap.correlationKey` is non-null:

```typescript
{snap.correlationKey && onTrackProcess && (
  <TouchableOpacity
    onPress={() => onTrackProcess(snap.correlationKey!, snap.title, snap.type)}
    accessibilityLabel={isWatching ? "Stop tracking this process" : "Track this process"}
  >
    <Ionicons
      name={isWatching ? "git-branch" : "git-branch-outline"}
      size={20}
      color={Colors.accent}
    />
  </TouchableOpacity>
)}
```

The prop is optional — all existing callers that do not pass `onTrackProcess` see no change. No backward-compatibility risk.

---

## 15. API Needs Summary

| Endpoint | Status | Phase | Notes |
|---|---|---|---|
| `GET /api/watchlist` | ✅ Exists | — | Snap bookmarks (F1) — unchanged |
| `POST /api/watchlist/{snapId}` | ✅ Exists | — | Snap bookmarks (F1) — unchanged |
| `DELETE /api/watchlist/{snapId}` | ✅ Exists | — | Snap bookmarks (F1) — unchanged |
| `GET /api/snaps/process/{correlationKey}` | ❌ New | W3 | All snaps in a process, ordered by step |
| `GET /api/watchlist/processes` | ❌ New | W3 | List user's watched processes |
| `POST /api/watchlist/processes/{correlationKey}` | ❌ New | W3 | Watch a process |
| `DELETE /api/watchlist/processes/{correlationKey}` | ❌ New | W3 | Unwatch a process |

---

## 16. Hard Rules

- **Do not infer `CorrelationKey` from content, titles, or AI.** Every key must be a deterministic function of a field in the source API data.
- **Do not add a `CorrelationKey` enum or type registry.** The key is a free-form string following a convention — extensibility comes from that convention, not enumeration.
- **Do not change the existing bookmark watchlist behavior.** F1 and F2 are purely additive.
- **Do not require `CorrelationKey` on all snaps.** The field is nullable throughout — null means "standalone snap, bookmark only."
- **Do not build W5 UI before W1 data layer is complete.** The Process Tracker has no data until correlation keys are populated by the ingestion pipeline.
- **Do not re-implement `PoliSnapRenderer` or `PoliSnapCollection`.** The `ProcessTrackerCard` reuses them as-is when expanded — only the wrapper and progress rail are new.

---

## 17. Implementation Phases

### Phase W1 — Domain Model & Data Layer
**Acceptance gate**: `dotnet build` passes. `GetByCorrelationKeyAsync` returns snaps grouped by key.

1. Add correlation fields to `PoliSnap.cs` (§4.1)
2. Extend `SnapSchema` record in `ISnapSchemaRegistry.cs` (§4.2)
3. Create `WatchedProcess.cs` (§4.3)
4. Create `IWatchedProcessRepository.cs` (§4.4)
5. Add two new methods to `ISnapRepository.cs` (§4.5)
6. Add four methods to `SnapBuilder.cs` (§5)
7. Update all 5 schemas in `SnapSchemaRegistry.cs` (§6)
8. Implement new methods in `LocalFileSnapRepository.cs` (§7.1)
9. Implement new methods in `InMemorySnapRepository.cs` (§7.2)
10. Create `LocalFileWatchedProcessRepository.cs` (§7.3)
11. Mirror correlation fields in `apps/mobile/types/polisnap.ts` (§10.1)
12. Create `apps/mobile/types/watched-process.ts` (§10.2)
13. Add Migrations 26 + 27 to `SqliteDatabaseService.ts` (§11)
14. Update saver + mapper + add `getByCorrelationKey()` in `SqliteSnapRepository.ts` (§12)

### Phase W2 — Provider Correlation Wiring
**Acceptance gate**: Run ingest. Verify snaps for a bill have `CorrelationKey = "bill:{number}"` and ascending `ProcessStep` values.

15. Wire `CongressionalActivityProvider` mapper (§8.2) — reference implementation
16. Wire `FederalRegisterIngestionProvider` mapper (§8.3)
17. Wire `FecProvider`, `EthicsCommitteeProvider`, `GrantPulseProvider` mappers
18. Add process completeness warning to `ProviderBindingValidator` (§8.4)

### Phase W3 — API Endpoints
**Acceptance gate**: `dotnet test` still 39+/39. Manual: `GET /api/snaps/process/bill:H.R.1041` returns ordered snap list.

19. Add `GET /api/snaps/process/{correlationKey}` to `SnapsController.cs` (§9.1)
20. Add process endpoints to `WatchlistController.cs` (§9.2)
21. Register `IWatchedProcessRepository` → `LocalFileWatchedProcessRepository` in `Program.cs`
22. Write xUnit tests for the three new controller actions

### Phase W4 — Mobile Service + Storage
**Acceptance gate**: App starts without error. `watchedProcessService.watchProcess(...)` writes to SQLite. `getSnapsForProcess(...)` returns snaps from SQLite.

23. Create `IWatchedProcessService.ts` (§13.1)
24. Create `WatchedProcessService.ts` (§13.2)
25. Register in `container.ts` and `service-provider.tsx` (§13.3)

### Phase W5 — Mobile UX
**Acceptance gate**: Tapping "Track Process" on a snap with a `correlationKey` adds it to the Tracking tab. The progress rail reflects the actual steps in the snap data.

26. Add `processes` tab to watchlist screen (§14.1)
27. Create `ProcessTrackerCard` component (§14.2)
28. Add optional `onTrackProcess` prop to `PoliSnapRenderer` (§14.3)
29. Wire `watchedProcessService` into the new tab and card

---

## 18. Acceptance Criteria

| Criterion | Verified By |
|---|---|
| `CorrelationKey` is traceable to a source DTO field | Code review of each mapper — no UUID, no AI output |
| All `IsProcessOriented` providers set `CorrelationKey` | `ProviderBindingValidator` warning appears if missing |
| `GET /api/snaps/process/{key}` returns snaps ordered by `ProcessStep` | xUnit test + manual check |
| Watching a process auto-surfaces all related snaps in Tracking tab | E2E: watch a bill, trigger ingest, verify new snaps appear |
| Existing bookmark behavior is unchanged | Regression: add/remove snap bookmark still works end-to-end |
| Snaps without `correlationKey` show bookmark-only UI | UI test: no "Track Process" button on standalone snaps |
| Progress rail is data-driven, not hard-coded | Add a new process type without changing `ProcessTrackerCard` |
| SQLite Migrations 26 + 27 are non-breaking | Try-catch on every `ALTER TABLE`; app starts clean on existing installs |
| Delta sync delivers correlation fields to mobile | Fields present on snaps after `syncWithBackend()` |
| New process type requires only a schema + mapper | Checklist: zero enum changes, zero switch-case changes, zero UI changes |
