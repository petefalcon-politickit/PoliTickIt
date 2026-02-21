# Cold Start Template: Snap & Element Paradigm

**Accelerating Feature Discovery in High-Velocity Contexts**

## 1. The Snap Molecule

A "Snap" is the minimum viable unit of political intelligence. Each snap consists of:

- **Identity**: ID, SKU, and Title.
- **Type**: (Accountability, Knowledge, Representative, Economics).
- **Metadata**: Layman summaries, policy areas, and forensic tags.
- **Elements**: A list of data/visual atoms.

## 2. Element Atoms

Elements are the building blocks of a Snap. They must be reusable and themed:

- **Metric Group**: Gauges, grades, and scores.
- **Data Table**: Columnar representations of financial or voting data.
- **Narrative**: Text-based summaries and transcripts.
- **Interaction**: Sliders, pulses, and action cards.

## 3. The Cold Start Workflow

1.  **Define Schema**: Add the new data contract to `libs/contracts`.
2.  **Seed Mocks**: Populate `snapLibrary.ts` to visualize the UI immediately.
3.  **Implement Provider**: Create the C# Data Provider (e.g., `FecProvider`) to replace the mock with real ingestion logic.
4.  **Mirror Sync**: Use `ApiSyncService` to bridge the data to the mobile device.
