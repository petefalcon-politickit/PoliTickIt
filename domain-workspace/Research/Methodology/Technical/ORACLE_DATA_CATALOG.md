# PoliTickIt: Oracle Data & Genre Catalog (ODGC)

This catalog bridges the gap between **Institutional Truth (Oracles)** and **User Discovery (PoliGenre/PoliFest)**. It defines the "Logical Schema" available for manifestation, ensuring that AI-generated blueprints are grounded in forensic data availability.

## 1. Genre-to-Oracle Mapping

| Genre (PoliGenre) | Primary Oracle     | Interest Area mapping      | Granularity (LGP)     | Core Data Points                                          |
| :---------------- | :----------------- | :------------------------- | :-------------------- | :-------------------------------------------------------- |
| **Fiscal**        | TREAS-01           | Economics & Public Finance | National              | Total Debt, Interest Expense, Cash Balance                |
| **Ethics**        | ETH-H-01, ETH-S-01 | Ethics & Accountability    | Representative        | Allegations, Finding Intensity, Report URL                |
| **Finance**       | FEC-01             | Campaign Finance           | State / Candidate     | Contribution Amount, Contributor Occupation, Receipt Date |
| **Legislative**   | CONG-01            | Government Operations      | Bill / Representative | Bill Title, Sponsor, Voting Record, Floor Velocity        |
| **Grants**        | GRN-01             | Infrastructure / Education | District / County     | Grant Amount, Eligibility, Agency, Project Goal           |
| **Contracts**     | SAM-01             | Government Contracts       | Vendor / Agency       | Award Value, Contractor Name, Funding Agency              |
| **Audits**        | GAO-01             | Accountability             | Agency / Program      | Audit Score, Key Findings, Recommendation Status          |

---

## 2. Capability Enrichment (ACD Patterns)

When a `POLIGENRE` or `POLIFEST` call is initiated, the Manifestor uses this catalog to determine the **Refinement Ceiling**.

### A. The "Refinement Ceiling" Rule

If a `POLIFEST` requests a "District" level view for the **Fiscal** genre, the system MUST flag that the Oracle (TREAS-01) only provides **National** level data, and will suggest a "Narrative Thread-Down" rather than a hard data pivot.

### B. Truth-to-Molecule Mapping

Each Oracle data point is pre-mapped to a specific **UI Molecule** in the `Element Catalog`:

| Oracle Data Point   | Recommended Molecule      | Logic / Trigger             |
| :------------------ | :------------------------ | :-------------------------- |
| `Total Debt`        | `Metric.CurrencyLarge`    | Value > $1B                 |
| `Allegations`       | `Metric.Achievement.List` | Array of Strings            |
| `Finding Intensity` | `Metric.CorruptionIndex`  | Scalar (0-100)              |
| `Floor Velocity`    | `Metric.Attendance.Grid`  | 12-month trend              |
| `Grant ROI`         | `Metric.ROI.Calculator`   | (Grant / Pop) \* Multiplier |

---

## 3. Real-Time Availability (Heartbeat Integration)

The catalog is dynamically updated by the `IngestionService`. If an Oracle's heartbeat fails, the genre is marked as **"LOCKED: Source Offline"** in the `PoliGenre` response to prevent hallucinated manifestations.

## 4. Genre Expansion Protocol

To add a new genre (e.g., `POLIGENRE Climate`):

1. Identify the **Primary Oracle** (e.g., NOAA, EPA).
2. Validate **Institutional Status** (must be Tier 1/2).
3. Map to **Interest Area** (e.g., "Energy and Environment").
4. Define the **Lowest Granular Point (LGP)**.
5. Register in this `ORACLE_DATA_CATALOG.md`.

---

## 5. Maintenance & Stability Protocol (Drift Minimization)

To ensure this catalog remains the "Single Source of Truth" for manifestation logic, the following automated synchronization rules are in effect:

1.  **Atomic Ingestion Audit**: Every `IngestionService` cycle triggers a `DetectOracleDrift` check. If an Oracle provides data points not listed in this catalog, the engine flags a **Documentation-Code Desync**.
2.  **Manifestor Backup (AMM)**: This catalog is backed up alongside the AI instructions in `infra/backups/mic/` before every sync. This allows for a full logical rollback of the platform's "Genretic Understanding" if a data source change causes corruption.
3.  **Cross-Reference Journaling**: All updates to this catalog are logged in the `MANIFESTOR_JOURNAL.md` to provide a forensic timeline of how the platform's truth-mapping has evolved.
4.  **SLA Calibration**: Any variance in Oracle release windows (detected via Heartbeat) triggers an update to the [Ingestion SLA](INGESTION_SLA.md) via the `ManifestorMaintenanceService`.
