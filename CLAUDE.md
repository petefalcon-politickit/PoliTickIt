# PoliTickIt — Claude Code Project Context

## What This Is
PoliTickIt is a civic intelligence platform. A React Native mobile app + ASP.NET Core 9.0 API that surfaces political accountability data to constituents as structured "PoliSnaps" — metadata-driven content cards.

**GitHub**: `https://github.com/petefalcon-politickit/PoliTickIt.git`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | Expo React Native SDK 54, TypeScript, expo-sqlite |
| API | ASP.NET Core 9.0, C#, minimal-API style controllers |
| Local persistence | SQLite (mobile), JSON file store (API dev mode) |
| DI (mobile) | Awilix |
| Auth | JWT Bearer (API), AsyncStorage (mobile) |

---

## Project Layout

```
apps/
  mobile/                  React Native app
    app/                   Expo Router screens
    components/            UI components + polisnap-elements/
    services/              DI container, service interfaces + implementations
    types/                 TypeScript domain types
    constants/             snapLibrary.ts (static snap data), theme.ts
  services/
    PoliTickIt.Domain/     C# domain models + interfaces
    PoliTickIt.Ingestion/  Snap ingestion pipeline (providers, builders, schema)
    PoliTickIt.Infrastructure/ Persistence implementations
    PoliTickIt.Api/        ASP.NET Core controllers + background services
    PoliTickIt.Api.Tests/  xUnit tests
  skill-execution/
    PoliSnaps/             Pipeline working folders: spawn/ normalized/ constructed/ distributed/

.claude/
  skills/                  PoliSnap generation pipeline skills (see below)
  commands/                Custom Claude slash commands (future)

documentation/             Analysis docs, initiative plans, methodology
```

---

## Key Architectural Concepts

**PoliSnap** — the core data unit. A structured content card with typed elements, metadata, and provenance. Defined in `apps/mobile/types/polisnap.ts` (mobile) and `PoliTickIt.Domain/Models/PoliSnap.cs` (API).

**CorrelationKey** — groups all snaps in the same political process. Format: `{processType}:{stableId}` (e.g. `bill:H.R.1041`, `eo:14110`). Set deterministically by mappers at ingest time — never inferred.

**SnapBuilder** — fluent builder in `PoliTickIt.Ingestion/Schema/SnapBuilder.cs` for constructing snaps from source data.

**SQLite migrations** — versioned via `PRAGMA user_version`. Migrations 25-27 run outside `withTransactionAsync` to avoid Android split-state. Always use individual `runAsync()` calls — never `execAsync()` inside a transaction on Android.

---

## Active Initiatives

| Initiative | Doc | Status |
|---|---|---|
| Watchlist Evolution (Process Trackers) | `documentation/Analysis/WATCHLIST_EVOLUTION_ANALYSIS.md` | W1 complete, W2 next |
| My Representation + Executive Branch | `documentation/Analysis/MY_REPRESENTATION_AND_EXECUTIVE_BRANCH_ANALYSIS.md` | Pre-implementation |

---

## PoliSnap Generation Pipeline (Manual Snap Creation)

Four skills chain: **Mine → Normalize → Generate → Distribute**

| Step | Skill | Input → Output |
|---|---|---|
| 1 | Mine | User prompt → `skill-execution/PoliSnaps/spawn/SPAWN-*.json` |
| 2 | Normalize | SPAWN → `skill-execution/PoliSnaps/normalized/NORM-*.json` |
| 3 | Generate | NORM → `skill-execution/PoliSnaps/constructed/SNAP-*.json` |
| 4 | Distribute | SNAP → `apps/mobile/constants/snapLibrary.ts` + `apps/services/PoliTickIt.Api/Data/snaps/{id}.json` |

**Skill files**: `.claude/skills/{skill-name}/SKILL.md`
**Reference data**: `.claude/skills/_polisnap-data/`
**Catalog** (13 snap type patterns): `.claude/skills/_polisnaps-generation-catalog/README.md`

When asked to Mine, Normalize, Generate, or Distribute — read the corresponding SKILL.md before acting.

---

## Key Conventions

- All `ALTER TABLE` migrations: wrap each in individual `try { await runAsync(...) } catch(e) {}` — never batch inside `execAsync` or `withTransactionAsync`
- Schema repair block runs on every boot in `SqliteDatabaseService.ts` before user_version check
- `CorrelationKey` is always a deterministic function of source DTO fields — never AI-inferred
- Snap distributor dual-writes: `snapLibrary.ts` (mobile offline) + `Data/snaps/{id}.json` (API)
- Only `polisnap-distributor` writes to `snapLibrary.ts`
