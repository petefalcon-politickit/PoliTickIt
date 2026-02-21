# Politickit: Manifestor Maintenance Journal

This journal tracks the structural evolution of the Politickit ingestion pipeline, oracle mappings, and logical schema updates. It serves as the forensic timeline for AMM (Autonomous Manifestor Maintenance).

---

## [2026-01-30] - Logic Tier Foundation & Oracle Live Transition

### 🔄 Ingestion Lifecycle Updates

- **Standardized BaseOracleProvider**: All providers (Treasury, FEC, Congress, Grants) now inherit from the `BaseOracleProvider`.
- **Hybrid Ingestion System (HIS)**: Implemented ETag and `If-Modified-Since` heartbeat logic to replace legacy blind polling.
- **Refinement Heuristic Implementation**: Standardized the $RS$ score mapping for Geographic Drill-Down.

### 📜 Technical Catalog Sync

- **Established ORACLE_DATA_CATALOG.md**: Mapped raw institutional data points (e.g., `Finding Intensity`) to UI Molecules (e.g., `Metric.CorruptionIndex`).
- **Established BENEFICIARY_CORRELATION_STRATEGY.md**: Defined the taxonomic hierarchy for Constituent vs. Candidate consumer alignment.
- **Defined INGESTION_SLA.md**: Scheduled precision pulses for Tier 1 Federal Oracles.

### 🛠️ Maintenance & Stability

- **AMM Rolling Backups**: Configured a 5-state backup window for `/infra/ai-prompts` and `/documentation/Technical`.
- **Test Integrity**: Validated full pipeline execution in `PoliTickIt.Api.Tests` (16/16 Pass).

### 🔍 Active Drift Monitoring

- **FecProvider**: Transitioned from Mock to `api.open.fec.gov` compatibility logic.
- **GrantPulseProvider**: Successfully verified Sector-to-District mapping for Infrastructure (ROI 1.0).

---

## [2026-01-20] - Initial Monorepo Scaffolding

- Establishment of `apps/services` and `infra/` folder structures.
- Resolution of initial SQLite wasm and Metro bundler conflicts.
