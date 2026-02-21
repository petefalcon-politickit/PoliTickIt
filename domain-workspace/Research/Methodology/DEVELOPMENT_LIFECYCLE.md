# Development Lifecycle: The Nexus Path (HVDF)

**High-Velocity Execution Strategy**

## Stage 1: Design Molecule Definition (The Blueprint)

1. **Constraint Mapping**: Identify the cognitive load (Miller's Law) for the specific political dataset.
2. **Visual Synthesis**: Draft the **Forensic Aesthetic** layout.
3. **Nexus Contract**: Update `polisnap.schema.json` in `libs/contracts/` to codify the new visual elements.

## Stage 2: The Truth Bridge (Backend Implementation)

1. **Source Discovery**: Implement the `IDataSourceProvider` in the .NET 9 Ingestion Engine.
2. **Persistence Hardening**: Map the new entity to the SQL Server schema via EF Core.
3. **Distribution Endpoint**: Expose the new metadata via the `SnapsController`.

## Stage 3: Sovereign Hydration (Mobile Implementation)

1. **Element Scaffolding**: Register new components in the `ComponentFactory`.
2. **Ledger Migration**: Update the local SQLite schema if the interaction requires new sovereign logging (e.g., `participation_log`).
3. **Sync Activation**: Verify the `ApiSyncService` pulls the molecule from the .NET 9 engine.

## Stage 4: Continuous Forensic Audit

1. **Checkpoint Validation**: Verify against `ARCHITECTURAL_GUARDRAILS.md`.
2. **Telemetry Verification**: Ensure sentiment ripples are correctly anchored via ZK-receipts.
3. **Session Logging**: Update the `SESSION_LOG.md` indices to preserve the development history for the AI orchestration layer.
