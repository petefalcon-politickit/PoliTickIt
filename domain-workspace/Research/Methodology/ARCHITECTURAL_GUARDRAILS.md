# Architectural Guardrails: High-Velocity, Design-First (HVDF)

**Version**: 2.1 (Nexus)

## 1. The Nexus Loop (Development Strategy)

HVDF rotates the standard development lifecycle. We do not build "features"; we build **Design Molecules** that are then codified into metadata.

1. **Design Molecule**: Define the visual and cognitive high-density layout.
2. **Metadata Contract**: Codify the molecule into `polisnap.schema.json`.
3. **Implementation Sync**: Auto-generate or scaffold the .NET Ingestion and TS Rendering layers.

## 2. SOLID Foundation & Orchestration

All codebases must adhere to SOLID principles to maintain high-velocity iteration.

- **Dependency Inversion**: Use Awilix (TS) and .NET Core DI. Implementations are always injected via interfaces (e.g., `IPoliSnapService`).
- **Provider Pattern**: The Ingestion Engine must be plugin-based (`IDataSourceProvider`). Adding a new data source (e.g., Local School Board) should require zero changes to the core engine.

## 3. Relational Sovereignty (Truth Continuity)

"Truth" must be local, persistent, and verifiable.

- **The Sovereign Ledger**: The mobile app is a local-first SQLite terminal. It mirrors the distribution tier to ensure 100% offline functionality.
- **Idempotency**: All sync events must use deterministic `INSERT OR REPLACE` logic to prevent data duplication and ensure lineage integrity.

## 4. Forensic Aesthetics & Cognitive Load

- **Miller's Law (7±2 elements)**: UI components must never exceed the cognitive processing threshold.
- **Forensic Geometry**: Use serif-driven, archival layouts (**PoliProof™**) to signify primary-source authority.
- **Dynamic Orchestration**: Use the `PoliSnapRenderer` to compose UI elements at runtime based on metadata, allowing "Hot-Updates" to the visual library without binary releases.

## 5. Security Guardrails

- **Hardware-Ledger Lock**: Critical actions require iOS App Attest or Android Play Integrity verification.
- **ZK-Anonymity**: User sentiment is transmitted via Zero-Knowledge receipts to protect identity while proving residency.
