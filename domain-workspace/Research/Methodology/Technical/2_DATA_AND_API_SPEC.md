# Data & API Specification (Nexus v2.1)

**The Contract of Truth**

## 1. The PoliSnap Nexus (Shared Contracts)

All data exchanges must strictly follow the `libs/contracts/polisnap.schema.json`. This schema is the language-agnostic source of truth for all three tiers.

### Core Structure

- **SKU**: Unique identifier (e.g., `cr-debate-hr882-2026`).
- **Elements**: A collection of `VisualElements` (Metric, Narrative, Identity, Interaction).
- **Metadata**: Layman summaries, significance scores (0-100), and provenance links.

## 2. Platform API Endpoints (C# .NET 9)

### `GET /api/snaps`

- **Purpose**: Returns the active feed for the user's cohort/district.
- **Parameters**: `districtId` (Required), `minSignificance` (Optional, 0-100).
- **Response**: `PoliSnap[]`

### `POST /api/telemetry/sentiment`

- **Purpose**: Pushes ZK-verified sentiment to the central aggregator.
- **Payload**: `{ snapId: string, sentimentValue: number, zkReceipt: string }`

### `POST /api/telemetry/engagement`

- **Purpose**: Tracks participant credits and task completions.
- **Payload**: `{ resourceId: string, actionType: string, credits: number }`

### `GET /api/representatives/{id}`

- **Purpose**: Retrieves the full forensic voting profile and alignment score.

## 3. Signal Intensity™ Logic

The API filters content based on a **Significance Threshold**.

- **Tier 1 (High Intensity)**: Urgent votes, floor shifts.
- **Tier 4 (Low Intensity)**: Commemorative bills, general updates.

## 4. The Ingestion Engine Pipeline

1. **Extract**: `IDataSourceProvider` (e.g., `FecProvider`, `CongressProvider`) fetches raw XML/JSON.
2. **Normalize**: Data is mapped to the `PoliSnap` C# class.
3. **Hydrate**: Secondary details (Provenance, Trust Thread) are added via the `ProvenanceService`.
4. **Mirror**: Data is persisted to SQL Server and flagged for distribution.

## 5. Metadata Resilience (The Shadow Registry)

If a mobile client encounters an element type not yet in its local library, the `PoliSnapRenderer` activates the **Shadow Registry**, rendering a reactive placeholder to prevent breaking the UI while ensuring the data remains visible.
