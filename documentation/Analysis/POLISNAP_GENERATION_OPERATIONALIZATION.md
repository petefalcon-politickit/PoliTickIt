# PoliSnap Generation — Operationalization Initiative

**Classification**: Architecture Initiative  
**Status**: Analysis → Ready for Implementation  
**Date**: 2026-06-02  
**Scope**: Ingestion Pipeline · PoliSnap Schema · Cloud Persistence · Scheduling · Mobile UX

---

## 1. Executive Summary

PoliTickIt currently has a working end-to-end ingestion pipeline — political data at the federal level enters through Oracle Providers, is mapped to PoliSnap format, persisted to disk, and served to the mobile app. This pipeline is **functional at low scale**, but carries significant structural debt that will compound as the number of providers grows.

> **Scope note**: PoliTickIt is designed to cover political accountability from national to neighborhood — federal, state, county, municipal, and local district levels. The Oracle Provider pattern must scale to this full spectrum. Every design decision in this document is evaluated against that north star, not just the current federal data sources.

The core problem is that **each provider hand-crafts its own `MapToSnap` method**. That means every new data source requires an engineer to:

1. Inspect the raw API shape
2. Decide which PoliSnap elements to use (`Universal.Gauge`, `Trust.Thread`, etc.)
3. Wire channels, metadata, sources, and body content manually

At 5 providers this is tolerable. At 50 it is a maintenance crisis. This document proposes a structured approach to operationalize snap generation that is **code-first, schema-driven, and AI-assisted only where inference is genuinely required**.

---

## 2. The MapToSnap Problem — How Did We Get Here?

### 2.1 How the Current Schema Was Determined

When `FederalRegisterIngestionProvider.MapToSnap()` was written, the schema was determined by a combination of:

1. **AI analysis of the Federal Register API response** — fields like `document_number`, `title`, `abstract`, `signing_date`, and `executive_order_number` were mapped by inspecting the API JSON and inferring which PoliSnap fields they aligned to.
2. **Pattern-matching against existing providers** — `CongressionalActivityProvider` was used as a reference for element types (`Universal.Gauge`, `Trust.Thread`) and metadata patterns.
3. **Domain judgment** — channel tags (`Branch:Executive`, `Representative:POTUS-47`) were assigned based on the political domain context.

**The problem**: This process was ad-hoc and not reproducible at scale. There is no contract defining which element types belong in which snap type, no validation of channel routing, and no test that a snap rendered by a new provider will look correct in the mobile app.

### 2.2 The Bottleneck Model (Current State)

```
Federal Register API ──► FederalRegisterIngestionProvider (custom ETL + MapToSnap) ──► LocalFileSnapRepository
Congress.gov API    ──► CongressionalActivityProvider     (custom ETL + MapToSnap) ──► LocalFileSnapRepository
FEC API             ──► FecProvider                       (custom ETL + MapToSnap) ──► LocalFileSnapRepository
...
N-th API            ──► N-th Provider                     (custom ETL + MapToSnap) ──► LocalFileSnapRepository
```

Every box in the middle is a bespoke implementation. There is no shared snap construction logic, no schema registry, and no scheduled execution. The ingestion endpoint is manually triggered.

---

## 3. API Needs

### 3.1 Current State

| Endpoint              | Purpose                            | Status  |
| --------------------- | ---------------------------------- | ------- |
| `POST /ingestion/run` | Manual full ingest — all providers | ✅ Live |
| `POST /admin/reload`  | Hot-reload snaps from disk         | ✅ Live |
| `GET /api/snaps`      | Snap feed with channel filtering   | ✅ Live |
| `GET /api/snaps/{id}` | Single snap by ID                  | ✅ Live |

### 3.2 Missing API Surface

| Endpoint                               | Purpose                                            | Priority |
| -------------------------------------- | -------------------------------------------------- | -------- |
| `POST /ingestion/run/{providerName}`   | Targeted single-provider run                       | High     |
| `GET /ingestion/status`                | Last run time, snap counts per provider, error log | High     |
| `GET /ingestion/providers`             | Registered provider list + heartbeat status        | Medium   |
| `POST /ingestion/schedule`             | Override schedule for a provider (admin)           | Low      |
| `GET /api/snaps/delta?since={iso8601}` | Delta sync — snaps updated after timestamp         | High     |
| `DELETE /api/snaps/{id}`               | Tombstone a snap (retraction support)              | Medium   |

### 3.3 Delta Sync is Critical for Mobile

The mobile app currently pulls `GET /api/snaps?limit=200` and caches to SQLite. At scale this is untenable — 10,000 snaps at 2KB each is 20MB per sync. The `delta?since=` endpoint, using `Max(createdAt, updatedAt)` as the cursor, should be the primary sync protocol. The `PoliSnap.UpdatedAt` field already supports this — it just needs a query path.

---

## 4. UI/UX Needs

### 4.1 Content Freshness Signal

Users cannot currently tell when a snap was last updated or whether they are seeing live data. Required:

- **"Last synced" timestamp** on the feed screen
- **"New" badge** on snaps ingested in the last 24 hours
- **Staleness indicator** on snaps not updated in >7 days (especially relevant for EOs that are amended)

### 4.2 Executive Order Detail UX (Implemented, Phase 4)

The `bodyText` expand/collapse pattern implemented in Phase 4 covers the immediate need. Long-term, EO detail should also surface:

- **Signed date** prominently (not buried in a gauge)
- **Affected agencies** (available from Federal Register `agencies[]` field)
- **EO number as a scannable badge** (e.g., `EO 14110`)
- **Amendment linkage** — if EO X amends EO Y, show a linked snap card

### 4.3 Snap Type Presentation Registry

The mobile renderer (`polisnap-renderer.tsx`) has no concept of snap type — every snap renders through the same element pipeline. As snap types multiply (`ExecutiveOrder`, `BillActivity`, `FecContribution`, `GrantPulse`, `StagnationSentinel`, etc.) a type-aware presentation layer is needed:

```typescript
// Proposed: SnapTypeRegistry
const SNAP_TYPE_PRESENTATION: Record<string, SnapTypeConfig> = {
  ExecutiveOrder: {
    accentColor: "#164570",
    icon: "document-text",
    badge: "EO",
  },
  BillActivity: { accentColor: "#10B981", icon: "library", badge: "BILL" },
  FecContribution: { accentColor: "#F59E0B", icon: "cash", badge: "FEC" },
  // ...
};
```

This prevents every new snap type from requiring renderer changes.

---

## 5. Local Storage Needs (Mobile)

### 5.1 Current Architecture

```
HybridSnapRepository
├── MockSnapRepository     (development fixtures)
├── SQLiteSnapRepository   (local cache — SQLite via expo-sqlite)
└── ApiSnapRepository      (live API fallback)
```

The hybrid repo implements a priority cascade: mock → SQLite → API, with auto-caching of API results into SQLite. This is the correct pattern.

### 5.2 Gaps

| Gap                               | Impact                                          | Fix                                                                 |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| No TTL on SQLite cache            | Stale snaps served indefinitely                 | Store `cachedAt` column; evict after configurable TTL (default 24h) |
| No delta cursor persisted locally | Full refetch on every cold start                | Persist `lastSyncedAt` in `AsyncStorage`; use delta endpoint        |
| No tombstone support              | Retracted/deleted snaps persist locally forever | API should return a `deleted: true` flag in delta responses         |
| SQLite schema is flat             | `metadata` is JSON-serialized string            | Fine for now; document as intentional                               |

### 5.3 Offline-First Requirement

For the "My Representation" use case, snaps for a user's followed representatives must be available offline. The SQLite cache already provides this for previously loaded snaps. The gap is proactive prefetch: after login/follow, the app should immediately hydrate the SQLite cache for the user's representatives without waiting for the feed to scroll.

---

## 6. Cloud Persistence

### 6.1 Why LocalFileSnapRepository Does Not Scale to Azure

`LocalFileSnapRepository` writes snaps as individual JSON files to `Data/snaps/`. This works in a single-instance, single-machine deployment. On Azure it fails for these reasons:

1. **App Service and Azure Functions have ephemeral file systems** — files written during execution do not survive an instance restart or scale-out event.
2. **Multiple instances write to independent file systems** — two instances running the ingest concurrently produce divergent state.
3. **No query capability** — filtering by channel, type, or date requires loading all snaps into memory.
4. **No TTL** — snaps accumulate forever with no eviction policy.

### 6.2 Azure Cosmos DB (Recommended for Snaps)

Cosmos DB is the right fit because:

- Document model maps 1:1 to `PoliSnap` JSON — no ORM, no schema migration
- Point reads by `id` are <10ms globally
- Change Feed enables real-time push to mobile (via Azure SignalR or notification hub)
- Serverless billing tier is cost-effective at sub-1M RU/month scale

#### Container Design

| Container            | Partition Key | TTL              | Purpose                                                  |
| -------------------- | ------------- | ---------------- | -------------------------------------------------------- |
| `snaps`              | `/type`       | None (permanent) | All PoliSnaps                                            |
| `snap-events`        | `/snapId`     | 30 days          | Ingest audit log (what changed, when, by which provider) |
| `snap-delta-cursors` | `/userId`     | None             | Per-user last-sync cursor for delta sync                 |

**Partition Key Alternatives for `snaps`:**

| Option              | Partition Key                                              | Pros                                                                                        | Cons                                                                                           |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A                   | `/type`                                                    | Natural grouping; feed queries by type are efficient                                        | Hot partition if `BillActivity` dominates volume; poor for `GET /snaps/{id}` (cross-partition) |
| B                   | `/id` (synthetic)                                          | Even distribution; point reads are fast                                                     | All feed queries are cross-partition scans; higher RU cost for channel filtering               |
| C                   | `/channels[0]` (first channel)                             | Channel-aligned queries are cheap                                                           | Snaps with multiple channels only land in one partition; awkward for multi-channel queries     |
| **D (Recommended)** | **`/snapBucket`** (computed field: hash of `type` + month) | Controlled hot-partition ceiling; time-bucketed for natural expiry; efficient range queries | Requires computed field at write time                                                          |

**Recommendation: Option D** with `snapBucket = "{type}-{YYYY-MM}"`. A new bucket is created automatically each month per type, capping partition growth. Feed queries filter within a bucket range; point reads use `id` as the document key.

#### Index Policy (snaps container)

```json
{
  "includedPaths": [
    { "path": "/type/?" },
    { "path": "/channels/*" },
    { "path": "/metadata/representativeId/?" },
    { "path": "/updatedAt/?" },
    { "path": "/createdAt/?" }
  ],
  "excludedPaths": [
    { "path": "/metadata/bodyText/?" },
    { "path": "/elements/*" }
  ]
}
```

Excluding `bodyText` and `elements` from indexing saves significant RU/write costs — these fields are large and never used as query filters.

### 6.3 Repository Swap Strategy

`ISnapRepository` is already an interface. Adding `CosmosSnapRepository` requires:

1. Implement `ISnapRepository` against Cosmos SDK
2. Register in `Program.cs` behind a feature flag (`AppSettings.UseCosmosSnaps`)
3. `LocalFileSnapRepository` remains the default for local dev and CI
4. Migration script: read all files from `Data/snaps/`, bulk-insert to Cosmos

The `CosmosSettings` class already exists in `PoliTickIt.Infrastructure`. The `SnapDataOptions` toggle is the only addition needed.

**Pros of Cosmos for snaps:**

- Scales horizontally without configuration
- Change Feed enables real-time mobile push
- Built-in geo-replication for disaster recovery
- Serverless tier: pay per operation, zero cost when idle

**Cons of Cosmos for snaps:**

- Cost spikes on full-table-scan patterns (e.g., `GetAllSnapsAsync()`) — must be eliminated in favour of paginated queries
- RU consumption requires capacity planning — runaway ingest loops can exhaust provisioned throughput
- Schema flexibility is a double-edged sword — malformed snaps are accepted silently

---

## 7. Design Patterns to Reduce Boilerplate

### 7.1 The Root Problem: Ad-Hoc `MapToSnap`

The current pattern:

```csharp
// Every provider does this independently — no shared contract
private static PoliSnap MapToSnap(FrDocument doc) {
    return new PoliSnap {
        Id = $"eo-{doc.DocumentNumber}",
        Elements = new List<SnapElement> {
            new SnapElement { Id = "eo-header", Type = "Universal.TextBlock", Data = ... },
            new SnapElement { Id = "trust-thread", Type = "Trust.Thread", Data = ... },
        }
    };
}
```

This has no reuse, no validation, and the element type strings (`"Universal.TextBlock"`, `"Trust.Thread"`) are magic strings scattered across the codebase.

### 7.2 Proposed Pattern Stack

#### 7.2.1 Snap Type Schema Registry (`ISnapSchemaRegistry`)

A compile-time registry that maps snap type names to their canonical element layout:

```csharp
public interface ISnapSchemaRegistry {
    SnapSchema GetSchema(string snapType);
}

public record SnapSchema(
    string Type,
    IReadOnlyList<SnapElementTemplate> RequiredElements,
    IReadOnlyList<string> RequiredChannels,
    TimeSpan DefaultTtl
);
```

The schema for `ExecutiveOrder` declares: must have a `Universal.TextBlock` header element, a `Universal.Gauge` for executive authority, and a `Trust.Thread`. Any provider producing an `ExecutiveOrder` snap that omits these fails schema validation at ingest time — not at render time.

#### 7.2.2 Fluent Snap Builder

```csharp
var snap = SnapBuilder.For("ExecutiveOrder")
    .WithId($"eo-{doc.DocumentNumber}")
    .WithTitle(doc.Title)
    .WithSubtitle($"EO {doc.ExecutiveOrderNumber}")
    .OnChannel("Branch:Executive")
    .OnChannel($"Representative:{PotusId}")
    .WithSource("Federal Register", doc.HtmlUrl)
    .WithLaymanSummary(doc.Abstract)
    .AddGauge("Executive Authority", 85, $"Signed {doc.SigningDate}")
    .AddTrustThread("Federal Register API v1", "Tier 1")
    .WithBodyText(strippedBody, doc.BodyHtmlUrl)
    .Build();
```

The builder:

- Enforces required fields at build time (throws if `Id` or `Type` missing)
- Generates the correct element IDs automatically (`{type}-header`, `{type}-gauge`, etc.)
- Validates against the schema registry before returning
- Is pure code — no AI in the path

#### 7.2.3 Typed Mapper Interface (`ISnapMapper<TSource>`)

```csharp
public interface ISnapMapper<TSource> {
    PoliSnap Map(TSource source);
    string ProviderName { get; }
    string SnapType { get; }
}
```

Each provider registers one mapper. The mapper receives a typed DTO (e.g., `FrDocument`) and returns a `PoliSnap`. The mapper is the only place that knows about the source API shape — it does not know about persistence, enrichment, or scheduling.

#### 7.2.4 Generic Provider Base (`GenericOracleProvider<TResponse, TItem>`)

```csharp
public abstract class GenericOracleProvider<TResponse, TItem> : BaseOracleProvider {
    protected abstract string ApiEndpoint { get; }
    protected abstract IEnumerable<TItem> ExtractItems(TResponse response);
    protected abstract PoliSnap MapItem(TItem item);
    protected abstract double GetIntensity(TItem item);

    public override async Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync() {
        var response = await HttpClient.GetFromJsonAsync<TResponse>(ApiEndpoint, _jsonOptions);
        var snaps = ExtractItems(response!).Select(item => {
            var snap = MapItem(item);
            ThreadDown(snap, GetIntensity(item), 1.0, 0.9, snap.Title);
            return snap;
        });
        return snaps;
    }
}
```

With this base, `FederalRegisterIngestionProvider` reduces to:

- `ApiEndpoint` property
- `ExtractItems` (one line: `response.Results`)
- `MapItem` (clean DTO → snap builder call)
- `GetIntensity` (one line: `return 0.85`)

The fetch loop, error handling, enrichment, and logging are inherited.

### 7.3 Where AI Belongs in This Architecture

| Stage                         | Mechanism                        | AI Role                                                    |
| ----------------------------- | -------------------------------- | ---------------------------------------------------------- |
| Raw API fetch                 | `HttpClient` + typed DTOs        | None — deterministic                                       |
| ETL / Mapping                 | `ISnapMapper<T>` + `SnapBuilder` | None — deterministic                                       |
| Content enrichment            | `IContextEnrichmentProcessor`    | None — rules-based                                         |
| Body text extraction          | `StripHtml()`                    | None — deterministic regex                                 |
| **Snap schema discovery**     | **AI analysis of new API**       | ✅ AI determines which fields map to which snap properties |
| **Layman summary generation** | **Azure OpenAI**                 | ✅ AI generates `laymanSummary` for complex policy text    |
| **Snap type classification**  | **ML classifier**                | ✅ AI classifies ambiguous political content               |
| Snap persistence              | `ISnapRepository`                | None — deterministic                                       |
| Mobile rendering              | `polisnap-renderer.tsx`          | None — deterministic                                       |

AI is invoked at the **discovery phase** (one-time, offline, produces a mapper) and optionally at **enrichment time** (for `laymanSummary` on complex content). The ETL pipeline itself — fetch → map → validate → persist — is pure code.

> **AI Injection Model — Schema-Based, Not Provider-Hardcoded**
>
> This is a critical design clarification: **individual providers do not contain AI calls**. The two AI roles map to entirely different mechanisms:
>
> 1. **Snap schema discovery (design time, one-time):** An engineer uses AI to analyse a new API's response shape and determine which fields map to which `PoliSnap` properties. The output is a hand-authored `ISnapMapper<TSource>` implementation — pure C# code that is committed to the repo. After this one-time act, the provider runs forever with zero AI involvement. The `ISnapSchemaRegistry` is populated from these code-defined schemas, not from runtime AI queries.
> 2. **Layman summary generation (runtime, centralised):** The `IContextEnrichmentProcessor` makes a single call to Azure OpenAI per snap that lacks a `laymanSummary`. This processor is injected into `IngestionService` after mapping — it is not inside any individual provider. Providers remain AI-free by design.
>
> **Net result:** Adding a new provider requires zero AI at runtime. AI at design time is a tool for the engineer, not a dependency of the running system.

---

## 8. PoliSnap Schema Standardization

### 8.1 Snap Type Taxonomy (Proposed)

| Snap Type            | Source                   | Parent? | Child Types                               | Update Frequency |
| -------------------- | ------------------------ | ------- | ----------------------------------------- | ---------------- |
| `ExecutiveOrder`     | Federal Register         | ✅      | `EoAmendment`                             | Weekly           |
| `BillActivity`       | Congress.gov             | ✅      | `BillVote`, `BillDebate`, `BillAmendment` | Daily            |
| `FecContribution`    | FEC API                  | ✅      | `ContributorProfile`                      | Daily            |
| `StagnationSentinel` | Congress.gov (derived)   | No      | —                                         | Weekly           |
| `GrantPulse`         | Grants.gov               | ✅      | `GrantAward`                              | Daily            |
| `FiscalPulse`        | Treasury API             | No      | —                                         | Daily            |
| `CommitteeHearing`   | Congress.gov             | ✅      | `HearingTranscript`                       | Daily            |
| `StateLegislation`   | OpenStates API           | ✅      | `StateVote`                               | Daily            |
| `CountyOrdinance`    | County portals (scraped) | ✅      | `OrdinanceVote`                           | Weekly           |
| `MunicipalMotion`    | City council feeds       | ✅      | `CouncilVote`, `PublicComment`            | Weekly           |
| `SchoolBoardAction`  | District portals         | No      | —                                         | Weekly           |
| `LocalElection`      | State election boards    | ✅      | `BallotMeasure`, `CandidateProfile`       | Event-driven     |

> **Scale implication**: State + county + municipal coverage represents thousands of jurisdictions across 50 states. This changes the Cosmos partitioning strategy (see Section 6.2), the Functions scheduling model (see Section 9), and the mobile filtering UX — users must be able to scope their feed to their geographic level without being overwhelmed by national volume.

### 8.2 Element Type Contract per Snap Type

Each snap type declares a canonical element layout. This is the contract between providers and the mobile renderer.

```
ExecutiveOrder:
  [0] Universal.TextBlock   — header (title, subtitle = EO number, subtext = abstract)
  [1] Universal.Gauge       — mode: Linear, label: "Executive Authority"
  [2] Trust.Thread          — verificationLevel: Tier 1
  [optional] Context.Thread — ACD enrichment

BillActivity:
  [0] Identity.Representative — linked rep header
  [1] Universal.TextBlock     — bill title + sponsor
  [2] Universal.Gauge         — mode: Progress, label: "Legislative Progress"
  [3] Trust.Thread            — verificationLevel: Tier 2
```

These contracts are what the `ISnapSchemaRegistry` encodes. The mobile renderer uses the element `type` field — as long as element types are consistent across providers, the renderer requires no changes as new snap types land.

### 8.3 Domain Canonical Model (DCM)

**The gap in §8.2**: The element layout contract declares _which_ element types must appear in a snap but says nothing about _what attributes_ those elements carry, what their types are, which are required vs optional, or what valid values look like. Without a DCM, each `ISnapMapper<T>` independently decides what to put in `Universal.Gauge.Data` — the mobile renderer has to handle any shape defensively, and there is no way to catch an attribute-level mistake before it reaches a user's screen.

**The DCM is the single authoritative type system for all PoliSnap element attributes across the entire platform** — server-side C# and mobile TypeScript must both conform to it.

```csharp
// PoliTickIt.Domain/CanonicalModel/ElementAttributes.cs

public enum GaugeMode { Linear, Progress, Circular }
public enum VerificationTier { Tier1, Tier2, Tier3 }
public enum TrustSource { FederalRegister, CongressGov, FEC, OpenStates, Derived }

public record TextBlockAttributes {
    [Required] public string Title { get; init; }
    public string? Subtitle { get; init; }   // e.g. "EO 14110"
    public string? Subtext { get; init; }    // e.g. abstract
    public string? BodyText { get; init; }   // full stripped body (optional)
    public string? BodyHtmlUrl { get; init; }
}

public record GaugeAttributes {
    [Required, Range(0, 100)] public double Value { get; init; }
    [Required] public string Label { get; init; }
    [Required] public GaugeMode Mode { get; init; }
    public string? Subtext { get; init; }    // e.g. "Signed Jan 20, 2025"
    public string? Color { get; init; }
}

public record TrustThreadAttributes {
    [Required] public VerificationTier VerificationLevel { get; init; }
    [Required] public TrustSource Source { get; init; }
    public string? SourceUrl { get; init; }
    public DateTimeOffset? LastVerified { get; init; }
}

public record RepresentativeIdentityAttributes {
    [Required] public string RepresentativeId { get; init; }  // e.g. "POTUS-47"
    [Required] public string DisplayName { get; init; }
    public string? Role { get; init; }        // e.g. "President of the United States"
    public string? AvatarUrl { get; init; }
    public string? Party { get; init; }
}
```

The DCM is the **source of truth** for both layers:

- **Server**: `SnapBuilder` serialises DCM attribute records into `SnapElement.Data`
- **Mobile**: TypeScript interfaces in `apps/mobile/types/canonical-model.ts` are the **hand-maintained mirror** of the C# records (generated tooling is a Phase E concern — keep it manual for now and documented as intentional)

> **Principle**: No element attribute is ever defined outside the DCM. Magic strings like `"Tier 1"` or `"Linear"` in provider code are replaced by enum references (`VerificationTier.Tier1`, `GaugeMode.Linear`). The DCM is the only place where those values are defined.

### 8.4 Oracle Binding Validation

The DCM enables a second structural guarantee: **a provider can be validated at startup against its target snap type's canonical requirements**. If the Oracle API source cannot satisfy a required DCM attribute, this is a compile-time or startup error — not a runtime or render-time surprise.

#### The Binding Interface

```csharp
// A typed binding declares how source fields satisfy a DCM attribute record
public interface IElementBinding<TSource, TAttributes> {
    TAttributes Bind(TSource source);
}

// Example: FederalRegisterIngestionProvider's gauge binding
public class FederalRegisterGaugeBinding : IElementBinding<FrDocument, GaugeAttributes> {
    public GaugeAttributes Bind(FrDocument source) => new GaugeAttributes {
        Value = 85.0,                        // fixed executive authority score
        Label = "Executive Authority",
        Mode = GaugeMode.Linear,
        Subtext = $"Signed {source.SigningDate:MMM d, yyyy}"
    };
}
```

The binding is **pure code** — no magic strings, no `Dictionary<string, object>`. If `FrDocument` removes `SigningDate`, the binding fails to compile.

#### Provider Readiness Validation

At startup (DI registration), each provider's mapper is validated against the DCM contract for its declared snap type:

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

A provider that is not `IsReady` **fails startup** in production mode. In development mode it logs a warning and proceeds (to allow partial provider development).

The `ProviderReadinessReport` is also surfaced by `GET /ingestion/status` — operators can see at a glance which providers are fully canonical-compliant and which have gaps. This replaces ad-hoc "why is this snap rendering blank" debugging.

#### Impact on the Architecture Table (§7.3)

The AI table in §7.3 gains a new deterministic row:

| Stage                        | Mechanism                                  | AI Role                         |
| ---------------------------- | ------------------------------------------ | ------------------------------- |
| **DCM attribute validation** | **`IProviderBindingValidator` at startup** | None — deterministic type check |

---

## 9. Scheduling Architecture

### 9.1 Current State

Ingestion is triggered exclusively by `POST /ingestion/run` — a manual HTTP call. There is no scheduled execution.

### 9.2 Provider Update Frequency Requirements

| Provider               | Required Frequency | Acceptable Latency | Notes                        |
| ---------------------- | ------------------ | ------------------ | ---------------------------- |
| Federal Register (EOs) | Daily at 09:00 EST | 4 hours            | New EOs published M-F        |
| Congress.gov (Bills)   | Every 6 hours      | 1 hour             | Floor activity can be fast   |
| FEC (Contributions)    | Daily at 06:00 EST | 12 hours           | FEC publishes nightly        |
| Grants.gov             | Daily at 08:00 EST | 4 hours            | Grant cycles are predictable |
| Ethics Committee       | Weekly (Monday)    | 24 hours           | Slow-moving source           |
| Stagnation Sentinel    | Weekly (Sunday)    | 24 hours           | Derived, not a live source   |

### 9.3 Option A — Azure Functions Timer Triggers

Add a `PoliTickIt.Functions` project. Each provider gets a dedicated `TimerTrigger` function:

```csharp
[Function("IngestExecutiveOrders")]
public async Task Run([TimerTrigger("0 0 14 * * 1-5")] TimerInfo timer) {
    // 09:00 EST = 14:00 UTC, Mon-Fri
    await _ingestionService.RunProviderAsync("FederalRegister.ExecutiveOrders.Oracle");
}
```

**Pros:**

- Serverless — zero cost when not running
- CRON syntax is expressive and well-documented
- Independent scaling per function
- Native Azure Monitor integration for alerting on failures
- No always-on compute cost

**Cons:**

- Cold start latency (100–300ms for .NET isolated) — acceptable for scheduled jobs
- Requires a Storage Account for the Function runtime (minor cost ~$0.05/month)
- Deployment is separate from the main API project — two deployment pipelines
- Durable Functions needed for retry orchestration on long-running ingest chains

### 9.4 Option B — Azure Container Apps Jobs

A single `PoliTickIt.Ingestion.Job` container that accepts a `--provider` argument. Azure Container Apps Jobs run on a CRON schedule:

```yaml
schedule: "0 14 * * 1-5"
replicaCompletionCount: 1
args: ["--provider", "FederalRegister.ExecutiveOrders.Oracle"]
```

**Pros:**

- Full .NET runtime — no cold start constraints
- Can run long-duration ingestion chains (>10 minutes) without hitting Function timeout limits
- Container isolation — a crashing ingest job does not affect the API
- Natural fit if ingestion grows to require parallel provider execution at scale

**Cons:**

- Higher baseline cost than Functions (~$0.10–0.50/month per job)
- Container build + push pipeline required
- More operational overhead (container registry, image versioning)
- Overkill for low-frequency, short-duration ingest jobs

### 9.5 Recommendation

**Start with Azure Functions (Option A).** The current ingest providers complete in seconds to minutes. Functions cover this well, cost nothing at rest, and are simpler to operate. If a provider requires a body-fetch loop (as `FederalRegisterIngestionProvider` now does), the Function timeout of 10 minutes (default, configurable to 60) is more than sufficient.

Migrate to Container Apps Jobs only when:

- A single provider's ingest takes >30 minutes
- Ingest requires stateful orchestration across multiple API pages
- Fan-out parallelism across >20 sub-providers is needed

---

## 10. Full Architecture — Target State

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          Azure Functions (Scheduled Ingest)                  │
│                                                                              │
│  IngestEOs (daily)   IngestBills (6h)   IngestFEC (daily)   ...             │
│        │                    │                  │                             │
│        └────────────────────┴──────────────────┘                            │
│                             │                                                │
│                    PoliTickIt.Ingestion                                     │
│                    IngestionService.RunProviderAsync()                       │
│                             │                                                │
│              ┌──────────────┼──────────────────┐                            │
│              │              │                  │                             │
│   GenericOracleProvider  (ETL + MapItem)       │                            │
│   + ISnapMapper<TSource>                       │                            │
│   + SnapBuilder (fluent, validated)            │                            │
│   + ISnapSchemaRegistry (type contracts)       │                            │
│              │                                 │                            │
│   [Optional] Azure OpenAI                      │                            │
│   → LaymanSummary generation                   │                            │
│   → Only for complex policy text               │                            │
│              │                                 │                            │
│              └────────────┬────────────────────┘                            │
│                           │                                                  │
│                  ISnapRepository                                             │
│                  CosmosSnapRepository                                        │
│                  Container: snaps / Partition: snapBucket                    │
│                           │                                                  │
│                  Cosmos Change Feed                                          │
│                           │                                                  │
│              ┌────────────┴──────────────────┐                              │
│              │                               │                              │
│    PoliTickIt.Api                  Azure SignalR (future)                    │
│    GET /api/snaps                  Push to subscribed mobile clients         │
│    GET /api/snaps/delta?since=     (real-time EO alerts)                     │
│              │                                                               │
│    Mobile App                                                                │
│    HybridSnapRepository                                                      │
│    SQLite cache + delta cursor                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Implementation Phases

### Phase A — Code Hardening (No Azure dependency)

**Step 0 — Domain Canonical Model (foundation; all other steps depend on this)**

1. Author `PoliTickIt.Domain/CanonicalModel/ElementAttributes.cs` — typed attribute records + enums for all current element types: `TextBlockAttributes`, `GaugeAttributes`, `TrustThreadAttributes`, `RepresentativeIdentityAttributes`, `ContextThreadAttributes`
2. Mirror DCM as TypeScript interfaces in `apps/mobile/types/canonical-model.ts`
3. Implement `IElementBinding<TSource, TAttributes>` interface
4. Implement `IProviderBindingValidator` + `ProviderReadinessReport`

**Step 1 — Schema Registry & Builder** 5. Implement `ISnapSchemaRegistry` referencing DCM element types (not strings) — contracts for existing 5 snap types 6. Implement `SnapBuilder` (fluent builder, validates against registry and DCM attribute records; throws on missing required fields)

**Step 2 — Provider Refactor** 7. Implement `GenericOracleProvider<TResponse, TItem>` abstract base 8. Refactor `FederalRegisterIngestionProvider` to extend `GenericOracleProvider` with typed `IElementBinding` implementations as the reference 9. Run `IProviderBindingValidator` at startup for all registered providers

**Step 3 — Domain Model Fields** 10. Add `public string Jurisdiction { get; set; } = "federal";` to `PoliSnap` 11. Add `public bool IsRetracted { get; set; } = false;` and `public DateTimeOffset? RetractedAt { get; set; }` to `PoliSnap`

**Step 4 — API Surface** 12. Add `RunProviderAsync(string providerName)` to `IIngestionService` 13. `POST /ingestion/run/{providerName}` — targeted single-provider ingest 14. `GET /ingestion/status` — last run time, snap counts, `ProviderReadinessReport` per provider 15. `GET /api/snaps/delta?since={iso8601}` — delta sync including `isRetracted` tombstones 16. `LocalFileSnapRepository.GetDeltaAsync(DateTimeOffset since)` — filter from in-memory index

**Step 5 — Mobile** 17. Mirror `jurisdiction` and `isRetracted` in `apps/mobile/types/polisnap.ts` 18. `polisnap-renderer.tsx`: skip rendering if `snap.isRetracted === true` 19. Wire `canonical-model.ts` types into renderer element handlers (replace `any` / loose object types)

### Phase B — Mobile Storage Hardening

1. Add `cachedAt` to SQLite schema; evict stale entries on cold start
2. Persist `lastSyncedAt` in `AsyncStorage`; use delta endpoint as primary sync
3. Proactive cache hydration for followed representatives after login

### Phase C — Azure Functions Scheduling

1. Create `PoliTickIt.Functions` project
2. One `TimerTrigger` function per provider (calls `POST /ingestion/run/{provider}`)
3. Application Insights alerts on function failure
4. Deploy independently via Azure Functions deployment pipeline

### Phase D — Cosmos DB Snap Persistence

1. Implement `CosmosSnapRepository` behind `ISnapRepository`
2. `AppSettings.UseCosmosSnaps` feature flag for safe rollout
3. Add `snapBucket` computed field to `PoliSnap`
4. Update Cosmos index policy (exclude `bodyText`, `elements` from indexing)
5. Migration script: `LocalFileSnapRepository → CosmosSnapRepository` bulk import
6. `snap-events` container for ingest audit log

### Phase E — Real-Time Push (Future)

1. Cosmos Change Feed consumer
2. Azure SignalR Hub
3. Mobile push notification for high-priority snaps (EOs, major votes)

---

## 12. Acceptance Criteria Mapping

| Criterion                                  | Implementation                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| Structured code over AI for consistent ETL | `ISnapMapper<T>` + `SnapBuilder` + `GenericOracleProvider`                         |
| AI reserved for inference only             | AI touches only `laymanSummary` generation + snap type classification at discovery |
| Scheduled execution                        | Azure Functions Timer Triggers, one per provider                                   |
| Cosmos DB with correct partitioning        | `snapBucket = "{jurisdiction}-{type}-{YYYY-MM}"`, scoped index policy              |
| Design patterns reducing boilerplate       | Builder, Template, Strategy, Generic Base patterns                                 |
| Delta sync for mobile efficiency           | `GET /api/snaps/delta?since=` + `lastSyncedAt` cursor in SQLite                    |
| Provider-level ingest control              | `RunProviderAsync(name)` + targeted endpoint                                       |
| Ingest observability                       | `GET /ingestion/status`, Application Insights, `snap-events` container             |

---

## 13. Resolved Decisions

The following questions were raised during analysis and are now resolved. These decisions are binding for implementation.

---

**1. EO Amendment Linkage** — _(Deferred — post-infra)_

**Decision**: Punt until Phases A–D are complete. The Federal Register API does return superseded EO numbers but wiring `parent/child` snap linkage requires the Cosmos container and the delta sync endpoint to exist first. Revisit when `CosmosSnapRepository` is live.

---

**2. Snap Retraction**

**Decision**: Use `isRetracted: true` (soft delete / tombstone) on the Cosmos document. Do **not** hard-delete.

**Rationale**: Hard-deleting a snap makes it invisible to delta sync — mobile clients that already cached the snap would never know to evict it from SQLite. With a tombstone, the delta endpoint returns `{ id: "...", isRetracted: true }` and mobile clients remove it from the local cache. The snap is effectively invisible in the feed immediately (renderer skips `isRetracted` snaps), satisfying the immediate UX requirement.

**Schema addition** (add to `PoliSnap.cs`):

```csharp
public bool IsRetracted { get; set; } = false;
public DateTimeOffset? RetractedAt { get; set; }
```

---

**3. AI Budget**

**Decision**: $1.50 per 1,000 summary-eligible snaps (GPT-4o, ~500 tokens each) is acceptable for the `laymanSummary` enrichment path.

**Important caveat**: This estimate covers **only the Azure OpenAI token cost for summary generation**. It does not include:

- **Schema discovery labour** — engineer time (or AI-assisted session cost) to analyse a new provider's API shape and produce the `ISnapMapper<T>` implementation. This is a one-time design-time cost per provider, not a per-snap runtime cost.
- **Classification** — if snap type classification requires an ML call, add that separately.
- **Cosmos RU cost** for writes (small but non-zero at volume).

The $1.50/1k figure should be treated as the marginal steady-state cost once a provider is coded, not the total cost of onboarding a new provider.

---

**4. Jurisdictional Scale & OpenStates**

**Decision**: Jurisdictional scope is a first-class design constraint starting now. The `jurisdiction` field lands on `PoliSnap` in Phase A before any Cosmos work begins.

**OpenStates (openstates.org)**: ✅ Free to use. Legislative data is public domain (state government records). Requires a free API key (registration at openstates.org/accounts/register/). Free tier: 100 requests/day. Paid tiers unlock higher rate limits. Bulk data downloads are also free. No licensing barrier for PoliTickIt. GraphQL and REST APIs are both available.

**Action items baked into Phase A**:

- Add `public string Jurisdiction { get; set; } = "federal";` to `PoliSnap` (format: `"federal"`, `"state:TX"`, `"county:TX-Travis"`, `"city:Austin-TX"`)
- All existing providers default to `"federal"`
- `snapBucket` in Cosmos will be `"{jurisdiction}-{type}-{YYYY-MM}"` to prevent cross-jurisdiction hot partitions at scale

---

## 14. Cold Start Reference

> **Purpose**: This section is the briefing document for an AI coding agent starting fresh on this initiative. It contains everything needed to begin Phase A implementation without prior session context.

---

### 14.1 Project Identity

**PoliTickIt** is a political accountability app. Citizens track their elected representatives' actions — bills, votes, executive orders, campaign finance — at every level of government from federal to local. Data enters through Oracle Providers (server-side ingestion), is stored as `PoliSnap` documents, and is consumed by a React Native mobile app.

- **Solution root**: `C:\Projects\Alithix\Products\PoliTickIt\`
- **Runtime**: ASP.NET Core 9.0 (API + Ingestion) · Expo React Native SDK 54 (Mobile)
- **Monorepo layout**: `apps/services/` (C#) · `apps/mobile/` (TypeScript/React Native)

---

### 14.2 Key File Map

| File                                                                               | Purpose                                                                    |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `apps/services/PoliTickIt.Domain/Models/PoliSnap.cs`                               | Core domain model. `PoliSnap`, `SnapElement`, `SnapMetadata`, `SnapSource` |
| `apps/services/PoliTickIt.Domain/Interfaces/ISnapRepository.cs`                    | Repository interface                                                       |
| `apps/services/PoliTickIt.Infrastructure/Repositories/LocalFileSnapRepository.cs`  | Current persistence — writes JSON files to `Data/snaps/`                   |
| `apps/services/PoliTickIt.Infrastructure/CosmosSettings.cs`                        | Cosmos config class (exists, not yet used for snaps)                       |
| `apps/services/PoliTickIt.Ingestion/Providers/BaseOracleProvider.cs`               | Base class: HTTP client, `ThreadDown()` enrichment                         |
| `apps/services/PoliTickIt.Ingestion/Providers/FederalRegisterIngestionProvider.cs` | Reference implementation (most recent, post all fixes)                     |
| `apps/services/PoliTickIt.Ingestion/Services/IngestionService.cs`                  | Iterates all `IDataSourceProvider` implementations                         |
| `apps/services/PoliTickIt.Ingestion/Interfaces/IDataSourceProvider.cs`             | Provider contract: `FetchLatestSnapsAsync()`                               |
| `apps/services/PoliTickIt.Api/Program.cs`                                          | DI registration, endpoint mapping                                          |
| `apps/mobile/types/polisnap.ts`                                                    | TypeScript `PoliSnap` type mirror                                          |
| `apps/mobile/components/polisnap-renderer.tsx`                                     | Mobile snap renderer — all snap types flow through here                    |
| `apps/mobile/services/implementations/HybridSnapRepository.ts`                     | Mock → SQLite → API cascade                                                |
| `apps/mobile/services/implementations/ApiSnapRepository.ts`                        | Live API calls                                                             |

---

### 14.3 What Exists vs What Needs to Be Built

| Capability                         | Status              | Notes                                              |
| ---------------------------------- | ------------------- | -------------------------------------------------- |
| `IDataSourceProvider` pattern      | ✅ Exists           | `BaseOracleProvider` + `IngestionService`          |
| `FederalRegisterIngestionProvider` | ✅ Exists           | Fetches EOs, strips body HTML, maps to snap        |
| `ISnapRepository` interface        | ✅ Exists           | Clean interface, swap-ready                        |
| `LocalFileSnapRepository`          | ✅ Exists           | Works locally, not Azure-safe                      |
| `POST /ingestion/run`              | ✅ Exists           | Manual full ingest                                 |
| `GET /api/snaps`                   | ✅ Exists           | Channel-filtered feed                              |
| `CosmosSettings.cs`                | ✅ Exists (partial) | Config class present; no snap repo against it      |
| `HybridSnapRepository` (mobile)    | ✅ Exists           | SQLite cache layer working                         |
| `ISnapSchemaRegistry`              | ❌ Not built        | Phase A Step 1 — snap type contracts               |
| `SnapBuilder`                      | ❌ Not built        | Phase A Step 1 — fluent builder                    |
| `GenericOracleProvider<T,U>`       | ❌ Not built        | Phase A Step 2 — generic ETL base                  |
| `ISnapMapper<TSource>`             | ❌ Not built        | Phase A Step 2 — typed mapper interface            |
| `IContextEnrichmentProcessor`      | ❌ Not built        | Phase A Step 4 — AI layman summary                 |
| DCM `ElementAttributes.cs`         | ❌ Not built        | Phase A Step 0 — canonical attribute types + enums |
| `canonical-model.ts` (mobile)      | ❌ Not built        | Phase A Step 0 — TypeScript DCM mirror             |
| `IElementBinding<TSource,TAttr>`   | ❌ Not built        | Phase A Step 0 — typed source→DCM binding          |
| `IProviderBindingValidator`        | ❌ Not built        | Phase A Step 0 — startup readiness check           |
| `GET /api/snaps/delta?since=`      | ❌ Not built        | Phase A — delta sync endpoint                      |
| `POST /ingestion/run/{provider}`   | ❌ Not built        | Phase A — targeted ingest                          |
| `GET /ingestion/status`            | ❌ Not built        | Phase A — observability                            |
| `CosmosSnapRepository`             | ❌ Not built        | Phase D — behind feature flag                      |
| `PoliTickIt.Functions` project     | ❌ Not built        | Phase C — scheduled ingest                         |
| `Jurisdiction` on `PoliSnap`       | ❌ Not built        | Phase A — add immediately                          |
| `IsRetracted` on `PoliSnap`        | ❌ Not built        | Phase A — tombstone support                        |
| SQLite delta cursor + TTL (mobile) | ❌ Not built        | Phase B                                            |

---

### 14.4 All Architectural Decisions (Binding)

| #   | Decision                                                                                            | Rationale                                                                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Domain Canonical Model (DCM)** is the single authoritative type system for all element attributes | One definition of `GaugeAttributes`, `TextBlockAttributes`, etc. — C# records on server, TypeScript interfaces on mobile. No attribute defined outside the DCM. |
| D2  | `IElementBinding<TSource, TAttributes>` declares how source fields satisfy DCM attributes           | Typed, compile-safe — if the source DTO loses a field, the binding fails to compile                                                                             |
| D3  | `IProviderBindingValidator` runs at startup; providers missing required bindings fail in production | Catches API → DCM gaps at registration time, not at render time                                                                                                 |
| D4  | `ProviderReadinessReport` surfaced in `GET /ingestion/status`                                       | Operators see canonical compliance without reading code                                                                                                         |
| D5  | `ISnapSchemaRegistry` encodes element layout contracts per snap type, referencing DCM types         | Prevents magic strings; validates at ingest not render time                                                                                                     |
| D6  | `SnapBuilder` fluent API enforces required DCM attributes at build time                             | Eliminates missing-field bugs discovered only at render time                                                                                                    |
| D7  | `GenericOracleProvider<TResponse, TItem>` is the new base                                           | Eliminates bespoke fetch loops in every provider                                                                                                                |
| D8  | `ISnapMapper<TSource>` is the only place that knows the source API shape                            | SRP — mapping is isolated from fetch, persistence, enrichment                                                                                                   |
| D9  | AI at design time only for schema discovery — providers are AI-free at runtime                      | AI is a tool for engineers, not a runtime dependency                                                                                                            |
| D10 | `IContextEnrichmentProcessor` owns all Azure OpenAI calls (centralised)                             | Providers cannot call AI; enrichment is a pipeline step after mapping                                                                                           |
| D11 | `CosmosSnapRepository` behind `AppSettings.UseCosmosSnaps` feature flag                             | `LocalFileSnapRepository` stays as default for local dev and CI                                                                                                 |
| D12 | `snapBucket = "{jurisdiction}-{type}-{YYYY-MM}"` as Cosmos partition key                            | Prevents hot partitions; natural TTL boundary; efficient range queries                                                                                          |
| D13 | Snap retraction uses `IsRetracted: true` tombstone, not hard delete                                 | Delta sync requires the record to exist to tell mobile clients to evict                                                                                         |
| D14 | `Jurisdiction` is a first-class field on `PoliSnap`                                                 | National-to-neighborhood scope; format: `"federal"`, `"state:TX"`, `"county:TX-Travis"`, `"city:Austin-TX"`                                                     |
| D15 | Scheduling via Azure Functions Timer Triggers (not Container Apps Jobs)                             | Providers complete in seconds to minutes; Functions are simpler and zero-cost at rest                                                                           |
| D16 | EO amendment linkage deferred until Cosmos is live                                                  | Requires delta sync and parent/child document traversal in Cosmos                                                                                               |
| D17 | OpenStates is the provider for state legislation (50 legislatures)                                  | Free API, public domain data, free API key at openstates.org/accounts/register/                                                                                 |
| D18 | AI budget for `laymanSummary`: ~$1.50/1k snaps (GPT-4o, 500 tokens)                                 | Marginal runtime cost only — schema discovery and mapper authoring are separate one-time costs                                                                  |

---

### 14.5 Phase A — Exact Implementation Checklist

Phase A is the starting point. It requires no Azure infrastructure — all changes are local and backwards-compatible.

**Step 0 — Domain Canonical Model (do this first; everything else depends on it)**

- [ ] Create `PoliTickIt.Domain/CanonicalModel/ElementAttributes.cs` — typed attribute records and enums: `TextBlockAttributes`, `GaugeAttributes` (`GaugeMode` enum), `TrustThreadAttributes` (`VerificationTier` + `TrustSource` enums), `RepresentativeIdentityAttributes`, `ContextThreadAttributes`
- [ ] Create `apps/mobile/types/canonical-model.ts` — TypeScript mirror of the C# records (hand-maintained, document as intentional)
- [ ] Create `IElementBinding<TSource, TAttributes>` interface in `PoliTickIt.Domain`
- [ ] Create `IProviderBindingValidator` interface + `ProviderReadinessReport` record in `PoliTickIt.Domain`

**Step 1 — Schema Registry & Builder**

- [ ] Create `ISnapSchemaRegistry` interface and `SnapSchema` / `SnapElementTemplate` records (referencing DCM types, not strings)
- [ ] Implement `SnapSchemaRegistry` with contracts for: `ExecutiveOrder`, `BillActivity`, `FecContribution`, `StagnationSentinel`, `GrantPulse`
- [ ] Implement `SnapBuilder` (fluent, validates against registry and DCM attribute records, throws on missing required fields)

**Step 2 — Provider Refactor**

- [ ] Implement `GenericOracleProvider<TResponse, TItem>` abstract base
- [ ] Implement `NullContextEnrichmentProcessor` (no-op) for local dev; wire `IContextEnrichmentProcessor` into `IngestionService`
- [ ] Refactor `FederalRegisterIngestionProvider` to extend `GenericOracleProvider` with typed `IElementBinding` implementations as the reference
- [ ] Implement `ProviderBindingValidator`; register and run against all providers at startup

**Step 3 — Domain Model Fields**

- [ ] Add `public string Jurisdiction { get; set; } = "federal";` to `PoliSnap`
- [ ] Add `public bool IsRetracted { get; set; } = false;` and `public DateTimeOffset? RetractedAt { get; set; }` to `PoliSnap`
- [ ] Add `RunProviderAsync(string providerName)` overload to `IngestionService` and `IIngestionService`

**Step 4 — API Surface**

- [ ] `POST /ingestion/run/{providerName}` — targeted single-provider ingest
- [ ] `GET /ingestion/status` — last run time, snap counts, `ProviderReadinessReport` per provider
- [ ] `GET /api/snaps/delta?since={iso8601}` — returns snaps where `Max(createdAt, updatedAt) > since`, including `isRetracted: true` tombstones
- [ ] `LocalFileSnapRepository.GetDeltaAsync(DateTimeOffset since)` — filter from in-memory index

**Step 5 — Mobile**

- [ ] Mirror `jurisdiction` and `isRetracted` in `apps/mobile/types/polisnap.ts`
- [ ] `polisnap-renderer.tsx`: skip rendering if `snap.isRetracted === true`
- [ ] Wire `canonical-model.ts` types into renderer element handlers (replace `any` / loose object types)

---

### 14.6 Start Command

The correct first step for a new implementation session:

```
Read this document in full (especially §8.3 DCM, §8.4 Oracle Binding Validation,
and §14.5 Phase A checklist), then begin Phase A Step 0 — author
PoliTickIt.Domain/CanonicalModel/ElementAttributes.cs first.
Every subsequent step depends on the DCM existing.
Confirm each step with a build before moving to the next.
Solution root: C:\Projects\Alithix\Products\PoliTickIt\
Build command: dotnet build apps/services/PoliTickIt.Ingestion/PoliTickIt.Ingestion.csproj --no-restore
```
