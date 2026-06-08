# PoliSnap Operationalization — Execution Plan

**Classification**: Execution Plan  
**Status**: Ready for Execution  
**Created**: 2026-06-03  
**Author**: Architecture Review  
**Analysis Reference**: [POLISNAP_GENERATION_OPERATIONALIZATION.md](../Analysis/POLISNAP_GENERATION_OPERATIONALIZATION.md)

---

## Overview

This plan translates the operationalization analysis into discrete, executable work items that can be picked up across chat sessions. Each phase is independent and deployable on its own. Work items within a phase must be executed in the order listed — earlier items are dependencies of later ones.

The analysis document is the authoritative reference for all design decisions (§14.4, D1–D18). This plan does not re-explain rationale — it focuses on _what to build_ and _in what order_.

**Build verification command** (run after every step):

```powershell
dotnet build apps/services/PoliTickIt.Ingestion/PoliTickIt.Ingestion.csproj --no-restore
```

---

## Phase A — Code Hardening _(No Azure dependency)_

**Goal**: Replace ad-hoc `MapToSnap` with a validated, type-safe, schema-driven pipeline. All changes are local and backwards-compatible. The API and mobile app continue to work unchanged throughout.

**Session start prompt**:

> "I am starting Phase A of the PoliSnap Operationalization plan. Read `documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md` and `documentation/Analysis/POLISNAP_GENERATION_OPERATIONALIZATION.md` in full, then continue from the first unchecked item in Phase A."

---

### A0 — Domain Canonical Model _(foundation; all other steps depend on this)_

**Project**: `PoliTickIt.Domain`  
**New path**: `apps/services/PoliTickIt.Domain/CanonicalModel/`

- [ ] **A0.1** Create `ElementAttributes.cs` — typed attribute records and enums for every current element type:
  - `GaugeMode` enum: `Linear`, `Progress`, `Circular`
  - `VerificationTier` enum: `Tier1`, `Tier2`, `Tier3`
  - `TrustSource` enum: `FederalRegister`, `CongressGov`, `Fec`, `OpenStates`, `Derived`
  - `TextBlockAttributes` record: `Title` (required), `Subtitle?`, `Subtext?`, `BodyText?`, `BodyHtmlUrl?`
  - `GaugeAttributes` record: `Value` (required, 0–100), `Label` (required), `Mode` (required), `Subtext?`, `Color?`
  - `TrustThreadAttributes` record: `VerificationLevel` (required), `Source` (required), `SourceUrl?`, `LastVerified?`
  - `RepresentativeIdentityAttributes` record: `RepresentativeId` (required), `DisplayName` (required), `Role?`, `AvatarUrl?`, `Party?`
  - `ContextThreadAttributes` record: `Summary` (required), `EnrichedAt` (required), `Model?`

- [ ] **A0.2** Create `IElementBinding.cs`:

  ```csharp
  public interface IElementBinding<TSource, TAttributes> {
      TAttributes Bind(TSource source);
  }
  ```

- [ ] **A0.3** Create `ProviderReadiness.cs` — `IProviderBindingValidator` interface and `ProviderReadinessReport` record:

  ```csharp
  public interface IProviderBindingValidator {
      ProviderReadinessReport Validate<TSource>(ISnapMapper<TSource> mapper);
  }
  public record ProviderReadinessReport {
      public string ProviderName { get; init; }
      public string SnapType { get; init; }
      public int RequiredAttributeCount { get; init; }
      public int SatisfiedAttributeCount { get; init; }
      public IReadOnlyList<string> MissingRequiredAttributes { get; init; }
      public bool IsReady => !MissingRequiredAttributes.Any();
      public double ReadinessScore => (double)SatisfiedAttributeCount / RequiredAttributeCount;
  }
  ```

- [ ] **A0.4** Create `apps/mobile/types/canonical-model.ts` — TypeScript mirror of C# records. Document at the top of the file: `// Hand-maintained mirror of PoliTickIt.Domain/CanonicalModel/ElementAttributes.cs`. All element attribute interfaces go here; mobile renderer handlers must import from this file, not define inline types.

- [ ] **A0.5** ✅ Build passes.

---

### A1 — Schema Registry & Builder

**Project**: `PoliTickIt.Ingestion`  
**New path**: `apps/services/PoliTickIt.Ingestion/Schema/`

- [ ] **A1.1** Create `ISnapSchemaRegistry.cs` in `PoliTickIt.Domain` — interface + supporting records:

  ```csharp
  public interface ISnapSchemaRegistry {
      SnapSchema GetSchema(string snapType);
      bool IsRegistered(string snapType);
  }
  public record SnapSchema(
      string Type,
      IReadOnlyList<SnapElementTemplate> RequiredElements,
      IReadOnlyList<string> RequiredChannelPrefixes,
      TimeSpan DefaultTtl
  );
  public record SnapElementTemplate(
      string ElementType,   // e.g. "Universal.Gauge"
      bool IsRequired,
      string Description
  );
  ```

- [ ] **A1.2** Create `ISnapMapper.cs` and `IContextEnrichmentProcessor.cs` in `PoliTickIt.Domain`:

  ```csharp
  public interface ISnapMapper<TSource> {
      PoliSnap Map(TSource source);
      string ProviderName { get; }
      string SnapType { get; }
  }
  public interface IContextEnrichmentProcessor {
      Task EnrichAsync(PoliSnap snap, CancellationToken ct = default);
  }
  ```

- [ ] **A1.3** Implement `SnapSchemaRegistry` in `PoliTickIt.Ingestion/Schema/SnapSchemaRegistry.cs` — hardcode contracts for the 5 existing snap types: `ExecutiveOrder`, `BillActivity`, `FecContribution`, `StagnationSentinel`, `GrantPulse`.

- [ ] **A1.4** Implement `SnapBuilder` in `PoliTickIt.Ingestion/Schema/SnapBuilder.cs`:
  - Fluent API: `For(snapType)`, `WithId()`, `WithTitle()`, `OnChannel()`, `WithSource()`, `WithBodyText()`, `AddGauge()`, `AddTrustThread()`, `AddTextBlock()`, `WithJurisdiction()`, `Build()`
  - `Build()` validates all required elements against `ISnapSchemaRegistry`; throws `SnapValidationException` if missing
  - All `Data` dictionaries populated from DCM attribute records — no raw `Dictionary<string, object>` literals
  - `WithJurisdiction()` sets `snap.Jurisdiction`; defaults to `"federal"` if not called

- [ ] **A1.5** ✅ Build passes.

---

### A2 — Provider Refactor

**Project**: `PoliTickIt.Ingestion`

- [ ] **A2.1** Implement `NullContextEnrichmentProcessor` (no-op) in `PoliTickIt.Ingestion/Enrichment/NullContextEnrichmentProcessor.cs`. Register as default `IContextEnrichmentProcessor` in `Program.cs`.

- [ ] **A2.2** Implement `GenericOracleProvider<TResponse, TItem>` in `PoliTickIt.Ingestion/Providers/GenericOracleProvider.cs` extending `BaseOracleProvider`:

  ```csharp
  public abstract class GenericOracleProvider<TResponse, TItem> : BaseOracleProvider {
      protected abstract string ApiEndpoint { get; }
      protected abstract IEnumerable<TItem> ExtractItems(TResponse response);
      protected abstract PoliSnap MapItem(TItem item);
      protected abstract double GetIntensity(TItem item);
      // Inherited: FetchLatestSnapsAsync() — handles fetch loop, ThreadDown, enrichment
  }
  ```

- [ ] **A2.3** Implement `ProviderBindingValidator` in `PoliTickIt.Ingestion/Validation/ProviderBindingValidator.cs`. Called from `IngestionService` constructor for all registered providers. In development: log warning on `IsReady == false`. In production: throw on startup if any required binding is missing.

- [ ] **A2.4** Refactor `FederalRegisterIngestionProvider` to:
  - Extend `GenericOracleProvider<FrListResponse, FrDocument>`
  - Replace `MapToSnap` with `MapItem` using `SnapBuilder`
  - Add typed `IElementBinding<FrDocument, GaugeAttributes>`, `IElementBinding<FrDocument, TextBlockAttributes>` etc. as private inner classes
  - Verify all `FrDocument` properties used in bindings still compile against the DTO
  - Keep `FetchBodyTextAsync` and `StripHtml` — these become enrichment helpers passed to `SnapBuilder.WithBodyText()`

- [ ] **A2.5** ✅ Build passes. Run full ingest manually (`POST /ingestion/run`) and verify snaps are produced with correct structure.

---

### A3 — Domain Model Fields

**Project**: `PoliTickIt.Domain`  
**File**: `apps/services/PoliTickIt.Domain/Models/PoliSnap.cs`

- [ ] **A3.1** Add to `PoliSnap`:

  ```csharp
  /// <summary>Jurisdiction scope. Format: "federal" | "state:TX" | "county:TX-Travis" | "city:Austin-TX"</summary>
  public string Jurisdiction { get; set; } = "federal";

  public bool IsRetracted { get; set; } = false;
  public DateTimeOffset? RetractedAt { get; set; }
  ```

- [ ] **A3.2** Add `RunProviderAsync(string providerName)` overload to `IIngestionService` and implement in `IngestionService`. Provider lookup is case-insensitive match on `IDataSourceProvider.ProviderName`. Throws `ProviderNotFoundException` if not found.

- [ ] **A3.3** ✅ Build passes.

---

### A4 — API Surface

**Project**: `PoliTickIt.Api`

- [ ] **A4.1** `POST /ingestion/run/{providerName}` — calls `IngestionService.RunProviderAsync(providerName)`. Returns `204 No Content` on success, `404` if provider not found, `500` with error detail on ingest failure.

- [ ] **A4.2** `GET /ingestion/status` — returns JSON:

  ```json
  {
    "lastFullRunAt": "2026-06-03T14:00:00Z",
    "providers": [
      {
        "name": "FederalRegister.ExecutiveOrders.Oracle",
        "lastRunAt": "2026-06-03T14:00:00Z",
        "snapCount": 20,
        "lastError": null,
        "readinessScore": 1.0,
        "isReady": true,
        "missingBindings": []
      }
    ]
  }
  ```

- [ ] **A4.3** `GET /api/snaps/delta?since={iso8601}` — returns snaps where `Max(createdAt, updatedAt) > since`. Includes tombstones (`isRetracted: true`) so mobile clients can evict. Requires `LocalFileSnapRepository.GetDeltaAsync(DateTimeOffset since)` — filter in-memory index by `Max(snap.CreatedAt, snap.UpdatedAt) > since`.

- [ ] **A4.4** ✅ Build passes. Smoke-test all three new endpoints.

---

### A5 — Mobile

**Project**: `apps/mobile`

- [ ] **A5.1** Add to `apps/mobile/types/polisnap.ts`:

  ```typescript
  jurisdiction: string;  // "federal" | "state:TX" | etc.
  isRetracted?: boolean;
  retractedAt?: string;
  ```

- [ ] **A5.2** `polisnap-renderer.tsx`: add guard at the top of the render function — return `null` (or empty fragment) if `snap.isRetracted === true`.

- [ ] **A5.3** Replace all inline `any` / loose object types in renderer element handlers with imports from `canonical-model.ts`. This is a type-safety pass — no behavioural changes.

- [ ] **A5.4** ✅ Mobile builds (`npx expo export --platform ios` or dev server starts clean).

---

### Phase A — Done Criteria

All of the following must be true before moving to Phase B:

- [ ] `dotnet build` on `PoliTickIt.Ingestion` is clean (no errors, no suppressed warnings for new code)
- [ ] `POST /ingestion/run` produces snaps with `jurisdiction`, `isRetracted`, and all DCM-typed element attributes
- [ ] `GET /ingestion/status` returns a readiness score of `1.0` for all registered providers
- [ ] `GET /api/snaps/delta?since=<yesterday>` returns the correct snaps
- [ ] Mobile renderer returns `null` for any snap where `isRetracted === true`
- [ ] No `any` types in renderer element handlers

---

## Phase B — Mobile Storage Hardening

**Goal**: Replace full-refetch sync with delta-cursor-based sync. Add SQLite TTL. Proactive cache hydration for followed representatives.

**Session start prompt**:

> "I am starting Phase B of the PoliSnap Operationalization plan. Read `documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md` and confirm Phase A done criteria are met, then continue from the first unchecked item in Phase B."

**Prerequisite**: Phase A done criteria met (delta endpoint live).

- [ ] **B1** Add `cached_at` column to SQLite `snaps` table. On cold start, evict rows where `cached_at < now() - 24h` (configurable via `SNAP_CACHE_TTL_HOURS` env var, default `24`).

- [ ] **B2** Persist `lastSyncedAt` in `AsyncStorage` (`@polisnap/lastSyncedAt`). On startup, if `lastSyncedAt` exists, call `GET /api/snaps/delta?since={lastSyncedAt}` instead of `GET /api/snaps`. Update `lastSyncedAt` after a successful sync.

- [ ] **B3** Delta response handler: for any snap where `isRetracted === true`, delete from local SQLite by `id` before upserting others.

- [ ] **B4** Proactive cache hydration: after user follows a representative, immediately call `GET /api/snaps?channels=Representative:{repId}&limit=50` and upsert results into SQLite without waiting for the feed to scroll to them.

- [ ] **B5** ✅ Cold start with no network loads from SQLite. Sync on resume only fetches delta. Retracted snaps disappear from feed immediately.

---

## Phase C — Azure Functions Scheduling

**Goal**: Replace manual `POST /ingestion/run` with automated scheduled ingest via Azure Functions Timer Triggers.

**Session start prompt**:

> "I am starting Phase C of the PoliSnap Operationalization plan. Read `documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md`, then continue from the first unchecked item in Phase C."

**Prerequisite**: Phase A done (targeted `POST /ingestion/run/{provider}` endpoint live).

- [ ] **C1** Create `apps/services/PoliTickIt.Functions/` project — .NET 9 isolated worker Azure Functions.

- [ ] **C2** Add `HttpClient`-based `IngestionHttpClient` that calls `POST /ingestion/run/{provider}` on the deployed API. Functions do not import `PoliTickIt.Ingestion` directly — they call the API over HTTP (decoupled deployment).

- [ ] **C3** Implement one `TimerTrigger` function per provider. CRON schedules (UTC):

  | Function                   | CRON             | Equivalent EST |
  | -------------------------- | ---------------- | -------------- |
  | `IngestExecutiveOrders`    | `0 0 14 * * 1-5` | 09:00 Mon–Fri  |
  | `IngestBills`              | `0 0 */6 * * *`  | Every 6 hours  |
  | `IngestFecContributions`   | `0 0 11 * * *`   | 06:00 daily    |
  | `IngestGrants`             | `0 0 13 * * *`   | 08:00 daily    |
  | `IngestEthicsCommittee`    | `0 0 12 * * 1`   | 07:00 Monday   |
  | `IngestStagnationSentinel` | `0 0 12 * * 0`   | 07:00 Sunday   |

- [ ] **C4** Add Application Insights telemetry. Alert on: function failure, ingest taking >5 minutes.

- [ ] **C5** `local.settings.json` with `INGEST_API_BASE_URL` pointing to `https://localhost:{port}` for local testing.

- [ ] **C6** ✅ Run one function locally. Confirm ingest fires, snaps land in `LocalFileSnapRepository`, no errors in App Insights.

---

## Phase D — Cosmos DB Snap Persistence

**Goal**: Replace `LocalFileSnapRepository` with `CosmosSnapRepository` behind a feature flag. Safe, non-breaking rollout.

**Session start prompt**:

> "I am starting Phase D of the PoliSnap Operationalization plan. Read `documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md`, then continue from the first unchecked item in Phase D."

**Prerequisite**: Phase A done (`ISnapRepository` interface verified clean).

- [ ] **D1** Add `snapBucket` computed property to `PoliSnap`:

  ```csharp
  // Cosmos partition key — set by repository at write time
  public string SnapBucket => $"{Jurisdiction}-{Type}-{CreatedAt:yyyy-MM}";
  ```

- [ ] **D2** Create Cosmos container `snaps` with:
  - Partition key: `/snapBucket`
  - Index policy: include `/type/?`, `/channels/*`, `/metadata/representativeId/?`, `/updatedAt/?`, `/createdAt/?`, `/isRetracted/?`; exclude `/metadata/bodyText/?`, `/elements/*`
  - No default TTL (snaps are permanent unless retracted)

- [ ] **D3** Implement `CosmosSnapRepository` in `PoliTickIt.Infrastructure/Repositories/CosmosSnapRepository.cs` implementing `ISnapRepository`. Use `CosmosSettings` (already exists) for connection config. Implement all `ISnapRepository` methods including `GetDeltaAsync`.

- [ ] **D4** Add `AppSettings.UseCosmosSnaps` bool toggle. Register in `Program.cs`:

  ```csharp
  if (settings.UseCosmosSnaps)
      services.AddSingleton<ISnapRepository, CosmosSnapRepository>();
  else
      services.AddSingleton<ISnapRepository, LocalFileSnapRepository>();
  ```

- [ ] **D5** Create `snap-events` container (partition key `/snapId`, TTL 30 days). Write an event record on every snap upsert from `CosmosSnapRepository`: `{ snapId, providerName, action: "upsert"|"retract", at }`.

- [ ] **D6** One-time migration script `scripts/migrate-snaps-to-cosmos.ps1`: reads all `Data/snaps/SNAP-*.json`, bulk-inserts to Cosmos. Idempotent (upsert, not insert).

- [ ] **D7** ✅ With `UseCosmosSnaps=true`: run full ingest, confirm snaps land in Cosmos, `GET /api/snaps/delta` returns correct results, `snap-events` has audit records.

---

## Phase E — Real-Time Push _(Future)_

**Goal**: Push high-priority snaps to mobile clients without requiring a poll.

**Prerequisite**: Phase D done (Cosmos Change Feed available).

- [ ] **E1** Cosmos Change Feed processor — listens on `snaps` container for new/updated documents
- [ ] **E2** Azure SignalR Hub — broadcasts snap IDs to subscribed mobile clients
- [ ] **E3** Mobile: `useEffect` SignalR listener — on receiving a snap ID, fetch that snap and upsert into local cache
- [ ] **E4** Push notification for high-priority snap types (`ExecutiveOrder`, `BillVote`) via Azure Notification Hubs

---

## Working Recipes _(post-Phase A operational procedures)_

> These recipes apply **after Phase A is complete**. They are repeatable, ordered checklists for any session that needs to extend the snap architecture. Paste the session start prompt to cold-start an agent directly into the recipe without re-reading the full plan.

---

### Recipe 1 — Add a New Snap Type (using existing element types)

**When to use**: You need to ingest a new political data source (e.g., `StateLegislation` from OpenStates) and the element types it needs (`Universal.TextBlock`, `Universal.Gauge`, `Trust.Thread`) are already in the DCM.

**Session start prompt**:

> "I am adding a new snap type to PoliTickIt. Read `documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md` Recipe 1. The new snap type is `{SnapType}`, sourced from `{API name}`. Phase A is complete. Follow the recipe exactly."

**Decision check** — confirm before starting:

- [ ] All element types this snap needs exist in `ElementAttributes.cs` → use **Recipe 1**
- [ ] Any element type is new → use **Recipe 2** first, then return to Recipe 1 step R1.3

---

**R1.1 — Schema Registry entry** (`PoliTickIt.Ingestion/Schema/SnapSchemaRegistry.cs`)

Add a new `SnapSchema` to the registry:

```csharp
["StateLegislation"] = new SnapSchema(
    Type: "StateLegislation",
    RequiredElements: [
        new SnapElementTemplate("Identity.Representative", IsRequired: true,  "Sponsoring legislator"),
        new SnapElementTemplate("Universal.TextBlock",     IsRequired: true,  "Bill title + status"),
        new SnapElementTemplate("Universal.Gauge",         IsRequired: true,  "Legislative progress"),
        new SnapElementTemplate("Trust.Thread",            IsRequired: true,  "OpenStates verification"),
    ],
    RequiredChannelPrefixes: ["Branch:Legislative", "Jurisdiction:"],
    DefaultTtl: TimeSpan.FromDays(365)
),
```

**R1.2 — Source DTO** (`PoliTickIt.Ingestion/Providers/{ProviderName}/`)

Create the typed DTO that mirrors the raw API response. No logic — just `[JsonPropertyName]` attributes and nullable fields.

**R1.3 — Element Bindings** (inner classes of the provider class)

For each required element type, implement one `IElementBinding<TSourceDto, TAttributes>`:

```csharp
private sealed class GaugeBinding : IElementBinding<OsLegislation, GaugeAttributes> {
    public GaugeAttributes Bind(OsLegislation source) => new() {
        Value    = LegislativeProgressScore(source.Status),
        Label    = "Legislative Progress",
        Mode     = GaugeMode.Progress,
        Subtext  = source.LastActionAt?.ToString("MMM d, yyyy")
    };
}
```

**Rule**: if a source field is null or missing, the binding must still produce a valid attribute record. Use a sensible default; do not return null from `Bind()`.

**R1.4 — Provider class** (`PoliTickIt.Ingestion/Providers/{ProviderName}/{ProviderName}Provider.cs`)

Extend `GenericOracleProvider<TResponse, TItem>`:

```csharp
public sealed class OpenStatesLegislationProvider
    : GenericOracleProvider<OsListResponse, OsLegislation> {

    protected override string ApiEndpoint => "https://v3.openstates.org/bills?...";
    protected override IEnumerable<OsLegislation> ExtractItems(OsListResponse r) => r.Results;
    protected override double GetIntensity(OsLegislation item) => 0.75;

    protected override PoliSnap MapItem(OsLegislation item) =>
        SnapBuilder.For("StateLegislation")
            .WithId($"sl-{item.Id}")
            .WithJurisdiction($"state:{item.Jurisdiction.OcdId.Split('/')[3].ToUpper()}")
            .OnChannel("Branch:Legislative")
            .OnChannel($"Jurisdiction:{item.Jurisdiction.OcdId}")
            .WithSource("OpenStates v3", item.OpenstatesUrl)
            .AddTextBlock(new TextBlockBinding().Bind(item))
            .AddGauge(new GaugeBinding().Bind(item))
            .AddTrustThread(new TrustThreadBinding().Bind(item))
            .Build();
}
```

**R1.5 — Register provider** (`PoliTickIt.Api/Program.cs` or DI registration file)

```csharp
services.AddSingleton<IDataSourceProvider, OpenStatesLegislationProvider>();
```

**R1.6 — Add Functions timer** (`PoliTickIt.Functions/Triggers/`)

```csharp
[Function("IngestStateLegislation")]
public async Task Run([TimerTrigger("0 0 */6 * * *")] TimerInfo timer)
    => await _client.PostAsync("/ingestion/run/OpenStates.Legislation.Oracle", null);
```

**R1.7 — Validate**

- [ ] `dotnet build` clean
- [ ] `GET /ingestion/status` shows new provider with `readinessScore: 1.0`
- [ ] `POST /ingestion/run/OpenStates.Legislation.Oracle` returns `204` and produces snaps
- [ ] Snaps have correct `jurisdiction` (e.g., `"state:TX"`), correct element types, no null attribute fields
- [ ] Mobile feed renders the snap without `any`-cast warnings

---

### Recipe 2 — Add a New Element Type to the DCM

**When to use**: A new snap type needs an element that does not exist in `ElementAttributes.cs` — e.g., a `VoteRecord` element for roll-call votes, a `CampaignFinance` element for FEC data, a `TimelineEvent` element for bill history.

**Session start prompt**:

> "I am adding a new element type to the PoliTickIt Domain Canonical Model. Read `documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md` Recipe 2. The new element type is `{ElementType}` (e.g., `VoteRecord`). Phase A is complete. Follow the recipe exactly."

**Rule**: A new element type MUST be added to the DCM before any provider or schema entry references it. Never define attribute shapes inline in a provider.

---

**R2.1 — Define the attribute record** (`PoliTickIt.Domain/CanonicalModel/ElementAttributes.cs`)

Add the C# record. Mark every field as `[Required]` or nullable explicitly — do not leave ambiguity:

```csharp
/// <summary>Roll-call vote cast by a representative on a bill or motion.</summary>
public record VoteRecordAttributes {
    [Required] public string RepresentativeId { get; init; }  // e.g. "S-TX-001"
    [Required] public string Vote { get; init; }               // "Yea" | "Nay" | "Abstain" | "Not Voting"
    [Required] public DateTimeOffset VotedAt { get; init; }
    public string? BillId { get; init; }
    public string? MotionText { get; init; }
}
```

Naming convention: `{ElementConcept}Attributes` (PascalCase, suffix `Attributes`).

**R2.2 — Add any new enums** to `ElementAttributes.cs`

If the attribute record uses a new finite value set (e.g., `VoteChoice`), define it as an enum in the same file. Never use raw strings for known finite values.

```csharp
public enum VoteChoice { Yea, Nay, Abstain, NotVoting }
```

Then update the attribute record to use the enum instead of `string`.

**R2.3 — Mirror in TypeScript** (`apps/mobile/types/canonical-model.ts`)

Add the TypeScript equivalent immediately — do not defer:

```typescript
// VoteRecord element (maps to VoteRecordAttributes.cs)
export type VoteChoice = "Yea" | "Nay" | "Abstain" | "NotVoting";

export interface VoteRecordAttributes {
  representativeId: string; // required
  vote: VoteChoice; // required
  votedAt: string; // ISO 8601, required
  billId?: string;
  motionText?: string;
}
```

Add a comment above the interface: `// Server: VoteRecordAttributes in ElementAttributes.cs`.

**R2.4 — Add fluent builder method** (`PoliTickIt.Ingestion/Schema/SnapBuilder.cs`)

Add a typed `Add{ElementConcept}()` method that accepts the DCM record:

```csharp
public SnapBuilder AddVoteRecord(VoteRecordAttributes attrs) {
    _elements.Add(new SnapElement {
        Id   = $"{_snapType.ToLower()}-vote-{_elements.Count}",
        Type = "Vote.Record",
        Data = SerializeAttributes(attrs)
    });
    return this;
}
```

**R2.5 — Add mobile renderer handler** (`apps/mobile/components/polisnap-renderer.tsx`)

Add a case in the element type switch/map that imports `VoteRecordAttributes` from `canonical-model.ts`:

```typescript
case 'Vote.Record': {
  const attrs = element.data as VoteRecordAttributes;
  return <VoteRecordElement key={element.id} {...attrs} />;
}
```

Create the `VoteRecordElement` component in `apps/mobile/components/elements/VoteRecordElement.tsx` importing its prop type from `canonical-model.ts`.

**R2.6 — Validate**

- [ ] `ElementAttributes.cs` compiles with no warnings
- [ ] `canonical-model.ts` has a matching interface for every new C# record
- [ ] `SnapBuilder` has a matching `Add{ElementConcept}()` method
- [ ] Mobile renderer has a case for the new element type string
- [ ] `dotnet build` clean; mobile dev server starts clean
- [ ] Return to **Recipe 1** and proceed from R1.3 using the new element type

---

### Recipe 3 — Add a New Provider to an Existing Snap Type

**When to use**: A second data source for an already-registered snap type needs to be added — e.g., a second news feed for `ExecutiveOrder`, or a state-level source that supplements an existing federal one. The snap type and its element layout are already in the registry.

**Session start prompt**:

> "I am adding a second provider for an existing snap type in PoliTickIt. Read `documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md` Recipe 3. The snap type is `{SnapType}`, the new provider is `{ProviderName}`. Phase A is complete. Follow the recipe exactly."

This is the lightest recipe — no DCM changes, no schema changes, no mobile changes.

- [ ] **R3.1** Create source DTO for the new API response shape
- [ ] **R3.2** Implement element bindings (`IElementBinding<TNewDto, TAttributes>`) — one per required element in the existing schema
- [ ] **R3.3** Implement provider class extending `GenericOracleProvider<TResponse, TItem>`, using the **same snap type string** as the existing provider
- [ ] **R3.4** Register in DI
- [ ] **R3.5** Add `TimerTrigger` function in Phase C (or add to existing Functions project)
- [ ] **R3.6** Validate: `GET /ingestion/status` shows new provider at `readinessScore: 1.0`; snaps from the new provider render identically to existing ones in the mobile app

---

### Recipe Decision Tree

```
Need to add political data to PoliTickIt?
│
├─ Is this a new data source?
│   │
│   ├─ Yes — does it fit an existing snap type (ExecutiveOrder, BillActivity, etc.)?
│   │   └─ Yes → Recipe 3 (new provider, existing snap type)
│   │
│   └─ Yes — it needs a new snap type
│       │
│       ├─ Do all required elements exist in ElementAttributes.cs?
│       │   └─ Yes → Recipe 1 (new snap type, existing elements)
│       │
│       └─ No — at least one element type is new
│           └─ Recipe 2 first (new element) → then Recipe 1 (new snap type)
│
└─ Is this changing how an existing snap type looks?
    └─ Adding a new optional element → Recipe 2 (if element is new) + update SnapSchemaRegistry
       Changing a required element's attributes → update ElementAttributes.cs + canonical-model.ts
       + bump all bindings that use that record (compiler will find them)
```

---

## Cross-Phase Reference

| Binding Decision                                                     | Analysis Section    |
| -------------------------------------------------------------------- | ------------------- |
| Domain Canonical Model is the source of truth for element attributes | §8.3                |
| `IElementBinding` and `IProviderBindingValidator` startup validation | §8.4                |
| `SnapBuilder` + `ISnapSchemaRegistry` eliminate magic strings        | §7.2                |
| `snapBucket = "{jurisdiction}-{type}-{YYYY-MM}"` partition key       | §6.2, D12           |
| `IsRetracted` tombstone (not hard delete)                            | §13 Decision 2      |
| `Jurisdiction` as first-class field                                  | §13 Decision 4, D14 |
| AI limited to enrichment pipeline only — providers are AI-free       | §7.3, D9            |
| Azure Functions Timer Triggers (not Container Apps Jobs)             | §9.5, D15           |
| EO Amendment linkage deferred until Phase D is live                  | §13 Decision 1      |
