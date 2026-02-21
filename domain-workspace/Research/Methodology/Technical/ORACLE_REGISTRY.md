# PoliTickIt: Verified Data Oracle Registry

This registry tracks the **30 Verified Data Oracles** targeted for autonomous ingestion and monitoring. These sources provide the "National Truth" that the PoliManifestor™ threads down into local context.

## 1. Core Federal Oracles (Active/Targeted)

| Oracle ID    | Name                           | Source URL              | SLA / Update Cycle           | Monitor Method          | Status                 |
| :----------- | :----------------------------- | :---------------------- | :--------------------------- | :---------------------- | :--------------------- |
| **TREAS-01** | U.S. Treasury (Fiscal Data)    | fiscaldata.treasury.gov | Daily ~4PM ET                | ETag / Heartbeat        | **Live (Refactoring)** |
| **CONG-01**  | Congress.gov (Legislative API) | api.congress.gov        | Daily Nightly                | Delta Polling           | **Targeted**           |
| **ETH-H-01** | House Ethics Committee         | ethics.house.gov        | Ad-hoc                       | Scraping / Heartbeat    | **Live (Refactoring)** |
| **ETH-S-01** | Senate Ethics Committee        | ethics.senate.gov       | Ad-hoc                       | Scraping / Heartbeat    | **Targeted**           |
| **GRN-01**   | Grants.gov                     | grants.gov              | Daily                        | RSS / Atom Feed         | **Live (Refactoring)** |
| **FEC-01**   | Federal Election Commission    | fec.gov                 | Nightly / (Real-time e-file) | Nightly Precision Pulse | **Live (Refactoring)** |
| **CENS-01**  | U.S. Census Bureau             | census.gov              | Annual / Monthly             | Historical Sync         | **Planned**            |
| **USA-01**   | USAspending.gov                | usaspending.gov         | Nightly Pipeline             | `last_updated` API      | **Planned**            |

## 2. Ingestion & Capability Mapping

We avoid "Blind Polling" by adhering to the [Hybrid Ingestion Strategy](INGESTION_STRATEGY.md).

For **PoliGenre** and **PoliFest** enrichment, refer to the [Oracle Data & Genre Catalog (ODGC)](ORACLE_DATA_CATALOG.md), which maps raw oracle data points to high-fidelity UI blueprints and autonomous capabilities.

To be admitted to the registry, a source must meet the **Forensic Verification Standard**:

- **Official Status**: Must be an institutional arm of the government or a statutory body.
- **Machine Readability**: Must provide API, JSON, or structured CSV access.
- **Auditability**: Must have a public lineage of data provenance.

## 3. Drift Monitoring (AMM Integration)

The `ManifestorMaintenanceService` periodically polls these endpoints for:

- **Schema Drift**: Changes in field names or JSON structure.
- **Latency Spikes**: Delays in institutional reporting.
- **Velocity Shifts**: Unexpected surges in data volume (e.g., end of fiscal year).

---

_Total Oracles Targeted: 30_
