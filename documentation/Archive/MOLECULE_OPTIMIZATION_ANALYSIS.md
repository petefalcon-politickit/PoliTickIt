# **Omni-OS Analysis: Molecule Optimization & De-Proliferation**

- **Context**: /documentation/Analysis/
- **Subject**: Architectural Review of UI Molecules
- **Standard**: Omni Analysis Standard (Meta-Engine v1.1.0)
- **Status**: IDEATION (Pete Falcon / Visionary)

---

## 📄 Overview

This analysis addresses the potential for "Component Bloat" and feature overlap within the PoliTickIt platform. As the system evolves from Alpha to Beta, we must transition from bespoke, scenario-specific molecules toward a **Polymorphic Molecule Registry** that prioritizes reuse and configuration-driven rendering.

---

## 🛠️ 1. Redundancy Review (The "Sieve")

The current element catalog shows signs of duplication where specialized components perform similar logic.

### **A. The Gauge Cluster**

- **Existing**: `AlignmentGauge` (Radial), `FrictionGauge` (Proposed).
- **Proposal**: Deprecate specific gauge components. Create **`Universal.Gauge`**.
- **Mode Logic**: Use metadata to toggle between `Radial`, `Linear`, and `Heatmap` modes while sharing color interpolation logic.

### **B. The Institutional ROI / Financial Track**

- **Existing**: `CorruptionIndex`, `ContributionAnalysis`, `FecDetails`, `Scorecard`.
- **Proposal**: Consolidate into **`Audit.Financial`**.
- **Mode Logic**:
  - `Summary`: (Scorecard / CorruptionIndex)
  - `Detailed`: (FecDetails / ContributionAnalysis)
  - `Provenance`: (Links to Official Oracles)

### **C. The Predictive Logic Layer**

- **Existing**: `PredictiveScoring`, `PredictiveForecasting`.
- **Proposal**: Unified **`Logic.Predictive`**.
- **Shared Molecule**: Both components should share a `ProbabilityTicker` sub-component to ensure visual consistency in how $P(x)$ is displayed.

### **D. Grid & List Parity**

- **Existing**: `DataTable`, `ColumnarList`, `AttendanceGrid`.
- **Proposal**: **`Universal.Grid`**. Use a Flex-Wrap configuration to handle both columnar lists and high-density grids.

---

## ✂️ 2. Culling Strategy (De-Proliferation)

To ensure the "Complexity Ceiling" is never breached, we will execute the following culling actions:

1.  **The "One-In, One-Out" Rule**: Before introducing a new molecule (e.g., `SNP-004`), it must be proven that existing molecules (e.g., `AlignmentGauge`) cannot be extended to fulfill the requirement.
2.  **Logic Extraction**: Move non-UI logic (Friction calculations, Probability weighting) out of `.tsx` files and into `libs/intelligence`.
3.  **Template-Driven Refactoring**:
    - Convert `PredictiveForecasting` into a **Metadata Template** for the `Universal.Grid`.
    - Convert `FecDetails` into a sub-module of `Audit.Financial`.

---

## ⚖️ 3. Forensic Integration

Every molecule remaining in the "Hardened Registry" must adhere to:

- **DNA Serialization**: Every element must be traceable to a specific Forensic Oracle.
- **Severed Style Standardization**: Strictly use `theme.ts` typography (e.g., `metricCardTitleLeft`).
- **Zero-Margin Enforcement**: Outer padding is handled solely by the `PoliSnapRenderer`.

---

## 🏁 Recommended Next Actions

1.  **Refactor Mission**: Embark on a new mission **EVO-014: Molecule Normalization** to merge the Gauge and Financial clusters.
2.  **Registry Freeze**: Stop creation of `Visual.FrictionGauge` and instead implement its logic within a polymorphic update to the existing gauge architecture.

---

_Omni-OS: Engineering Deterministic Reuse._
