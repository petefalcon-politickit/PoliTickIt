# PoliTickIt Capability: Autonomous Manifestor Maintenance (AMM)

## Executive Summary

**Autonomous Manifestor Maintenance (AMM)** is the "Self-Correction" layer of the PoliTickIt ecosystem. It ensures that the instructions, taxonomies, and personas stored in `infra/ai-prompts` do not become stale as the political and fiscal landscape evolves. The **PoliManifestor™** acts as both a content creator and a librarian, periodically auditing its own logic against "Ground Truth" performance.

---

## 1. The Refinement Loop (Nexus-Update)

The AMM capability operates on a three-stage heartbeat:

### Phase 1: The Performance Audit (Post-Ingestion)

After every major ingestion cycle (e.g., 100+ Snaps generated), the Manifestor performs a sampling audit:

- **Consistency Check**: Did the `FiscalPulse` Snaps align with the **MIC** translation formula?
- **Ambiguity Detection**: Identified terms or categories (Genres) that the AI struggled to map to **Interest Areas**.
- **User Signal (Future)**: Incorporating high/low engagement metrics to refine the "ROI Potential" scoring logic.

### Phase 2: Oracle Evolution Monitoring

The Manifestor monitors the **30 Verified Data Oracles** for structural shifts:

- **Schema Drift**: If the House Ethics Committee changes their report format, the AMM identifies the drift and proposes an update to the `EthicsCommitteeProvider` mapping logic or instructions.
- **Velocity Shifts**: If a "Knowledge" source becomes high-velocity (e.g., election season), the AMM adjusts the "Intensity" coefficients in the **CEP** instructions.

### Phase 3: Instruction Patching (The Living Library)

The Manifestor autonomously generates updates to the following "Living Documents":

- **`MANIFESTOR_INTELLIGENCE_CONTEXT.md`**: Updates to the Persona or Translation Formula.
- **`IDataSourceProvider` Instructions**: Per-engine guidelines on how to handle specific source nuances.
- **Feature Lexicon**: Adding new political terms or fiscal concepts to the shared vocabulary.

---

## 2. The Manifestor's Journal (Provenance of Logic)

To maintain transparency, the AMM maintains a `MANIFESTOR_JOURNAL.md`. This log preserves the _Reasoning_ behind context changes:

- _Example Entry_: "Adjusting ROI coefficient for 'Infrastructure Grants' from 0.8 to 0.9. Reason: Recent DOT updates indicate higher direct local matching requirements."

---

## 3. Technical Implementation: The Maintenance Engine

The Backend includes a `ManifestorMaintenanceService` that:

1. **Reads** the current instruction set from `infra/ai-prompts/`.
2. **Aggregates** metadata from the last `N` ingestion runs.
3. **Calls** the LLM with a "Maintenance Mode" prompt to identify optimizations.
4. **Writes** the refinements back to the filesystem (facilitated by the AI Toolkit or CI/CD pipelines).

---

## 4. Stability Insurance: Rolling Backups

To prevent logical corruption or "instruction degradation" where AI-generated refinements drift too far from forensic standards, the AMM implements a **Rolling Stability Window**:

1. **Pre-Patch Backup**: Before any write operation to `infra/ai-prompts/`, the system creates a full snapshot in `/infra/backups/mic/{timestamp}/`.
2. **Rolling Window**: The system maintains the last 5 stable states. As the 6th backup is created, the oldest is purged.
3. **Rollback Trigger**: If validation tests fail (e.g., `CapabilityValidationTest`) or if the Manifestor Journal indicates an anomaly, the system performs an atomic rollback to the previous timestamp.

---

## 5. Guardrails (The Immutable Core)

While the Manifestor can refine "Context," specific **Architectural Guardrails** remain immutable and require manual PR approval:

- **Non-Partisanship Rule**: The requirement for neutral language cannot be modified by the AMM.
- **Source Verification**: The list of "Verified Data Oracles" can only be expanded via human review.
- **Formula Foundation**: The $RS$ formula structure is fixed, though the _weights_ may be refined.
