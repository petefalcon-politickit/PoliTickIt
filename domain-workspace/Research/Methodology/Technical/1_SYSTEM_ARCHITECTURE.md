# System Architecture: The PoliTickIt Truth Continuum (Nexus v2.1)

**Status**: ACTIVE (Monorepo)

## 1. Overview

PoliTickIt is a full-stack civic infrastructure platform designed for **Relational Sovereignty**. The architecture follows the **HVDF (High-Velocity, Design-First)** methodology, rotating the development lifecycle from serial implementation to a recursive **Nexus Loop**.

## 2. High-Level Topology

The system is organized as a unified monorepo spanning mobile, backend services, and B2B web portals.

### A. The Ingestion Tier (.NET 9 / C#)

- **Role**: Deterministic data extraction and normalization.
- **Components**:
  - `PoliTickIt.Ingestion`: Background workers using a provider pattern (`IDataSourceProvider`).
  - `PoliTickIt.Domain`: Shared business logic and `PoliSnap` entity models.
  - `PoliTickIt.Infrastructure`: Persistence (EF Core / SQL Server) and external API clients.

### B. The Sovereign Tier (Mobile / Expo / SQLite)

- **Role**: Private, local-first intelligence storage.
- **State Management**:
  - **Relational Sovereignty Ledger**: Locally persistent SQLite db for user follows, sentiment, and participation credits.
  - **Awilix DI**: Dependency injection for cross-platform service resolution (Telemetry, Activity, Ledger).
- **Security**: Hardware-Ledger Lock (iOS App Attest / Android Play Integrity).

### C. The Institutional Tier (B2B / Next.js)

- **Role**: Aggregate constituent intelligence for representatives and agencies.
- **Portals**:
  - **The Nexus Dashboard**: Spatial sentiment mapping (Consensus Ripples).
  - **Agency Portal**: High-volume advocacy management.

## 3. The Vertical Block Architecture (VBA)

Instead of traditional page-based navigation, metadata drives "Vertical Blocks" (Snaps):

- **Dynamic Element Registry**: UI atoms (Metric, Narrative, Interaction) are injected into Snaps via a `ComponentFactory`.
- **The Trust Thread™**: Every Snap contains a cryptographically anchored trace to a primary source (e.g., Congressional Record, FEC Filing).
- **Forensic Aesthetics**: Interaction patterns optimized for cognitive load management (**Miller's Law: 7±2 elements**).

## 4. The Truth Continuum (Data Flow)

1. **Extraction**: Federal data is pulled via the `.NET Ingestion Engine`.
2. **Metadata Sync**: Data is mapped to `polisnap.schema.json`.
3. **Distribution**: Snaps are delivered via the `Distribution API` to mobile clients.
4. **Residency Handshake**: Mobile devices verify residency locally via ZK-Proofs (TargetSmart/L2) before pushing sentiment.
5. **Feedback Loop**: Aggregated, verified sentiment is returned to the Institutional Tier as deterministic ROI.

## 5. Directory Mapping

- `/apps/mobile`: React Native (Expo) - The Sovereign Ledger UI.
- `/apps/services`: .NET 9 MVC - The Ingestion and Distribution Engine.
- `/libs/contracts`: The Shared `polisnap.schema.json` and type definitions.
- `/commercial`: Strategic analysis, B2B pricing, and financial projections.
- `/documentation`: Methodology, technical specs, and project history.
