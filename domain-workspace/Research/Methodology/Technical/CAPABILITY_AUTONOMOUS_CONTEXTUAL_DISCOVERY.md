# PoliTickIt Capability: Autonomous Contextual Discovery (ACD)

## Executive Summary

The **Autonomous Contextual Discovery (ACD)** capability enables the **PoliManifestor™** and its associated engines to evolve from static data transporters into intelligent content curators. It ensures that national "Truth" is not just reported, but refined into localized "Context" through a systematic, multi-tier threading process.

## 1. System Components

### A. The PoliManifestor™ (Discovery Layer)

The Manifestor serves as the strategic architect. It monitors the **30 Verified Data Oracles** to identify correlations between citizen **Interests** (e.g., Taxation) and institutional **Genres** (e.g., Fiscal).

- **Proactive Curation**: Instead of waiting for manual commands, the Manifestor identifies high-velocity data points (Trends) and proposes new **Snap Classes**.

### B. The Context Enrichment Processor (CEP) (Logic Layer)

The CEP is the decision engine for geographical depth. It prevents information overload by applying the **Refinement Heuristic** to determine if a data point warrants a drill-down.

- **Formula**: $RS = (I \times 0.4) + (G \times 0.3) + (R \times 0.3)$
- **Thresholds**:
  - **RS < 0.4**: National Tier (Broad Awareness)
  - **0.4 <= RS < 0.7**: State Tier (Regional Correlation)
  - **RS >= 0.7**: District Tier (Hyper-Local ROI)

### C. The Adaptive Engine Pipeline (Implementation Layer)

Engines (e.g., `FiscalPulseProvider`) utilize the CEP during the ingestion cycle to hydrate Snap templates with contextual data.

---

## 2. Systematic Threading Methodology

### Phase 1: National Anchor

Every discovery begins at the **National** level using a "Truth Oracle" (e.g., U.S. Treasury). This provides the baseline for historical comparison and veracity.

### Phase 2: Contextual Analysis (The Thread-Down)

The system checks the Oracle data for localized markers (Zip, District, State).

- **Lineage Preservation**: The system creates a `Context.Thread` molecule, which acts as a "Geographic Pedigree," explaining precisely how the $34T National Debt (Truth) translates to a $15,000 Local Interest Burden (Context).

### Phase 3: Interest Alignment

The ACD maps the refined data to the user's **Interest List** (e.g., "Small Business" or "Veterans"). If a localized data point has high "Interest Relevancy," the intensity of the Snap is boosted.

---

## 3. Governance and Resource Guardrails

To prevent "Neighborhood Noise" and excessive compute costs:

- **Depth Limit**: Drill-downs are strictly capped at the **Congressional District** level.
- **Value Filter**: Low-intensity data ($RS < 0.4$) is restricted to the National feed to maintain premium content quality in localized feeds.
- **Truth Priority**: A `Context.Thread` is invalid without a corresponding `Trust.Thread`. Narrative context cannot be generated without forensic proof.

## 4. Operational Lifecycle Examples

### Scenario A: National Debt Update (The "Macro-Context" Thread)

1. **Trend Detected**: Treasury announces $34T Debt milestone.
2. **Oracle Queried**: FiscalData.gov provided national debt-by-day.
3. **CEP Evaluation**:
   - Intensity ($I$): 1.0 (Critical)
   - Geo Density ($G$): 0.1 (Broad)
   - ROI Potential ($R$): 0.6 (Taxation correlation)
   - **Result**: $RS = (1.0 \times 0.4) + (0.1 \times 0.3) + (0.6 \times 0.3) = 0.61$
4. **Drill-Down Triggered**: **State Tier** (Florida).
5. **Snap Result**: User sees "Florida's Share of National Debt" with a `Context.Thread` explaining the tax burden calculation.

### Scenario B: Infrastructure Grant (The "Hyper-Local" Thread)

1. **Trend Detected**: Department of Transportation opens a $5B Bridge Grant.
2. **Oracle Queried**: Grants.gov (Opportunity DOT-INFRA-2024-001).
3. **CEP Evaluation**:
   - Intensity ($I$): 0.8 (High)
   - Geo Density ($G$): 0.9 (Specific to physical locations)
   - ROI Potential ($R$): 1.0 (Direct funding injection)
   - **Result**: $RS = (0.8 \times 0.4) + (0.9 \times 0.3) + (1.0 \times 0.3) = 0.89$
4. **Drill-Down Triggered**: **District Tier** (FL-23).
5. **Snap Result**: User sees "Local Bridge Opportunity: $5B National Pool" in their Knowledge feed, mapped to their representative's potential for oversight.

## 5. Technical Implementation Details

- **Service**: `ContextEnrichmentProcessor.cs` in `PoliTickIt.Ingestion`.
- **Interface**: `IContextEnrichmentProcessor.cs` in `PoliTickIt.Domain`.
- **Molecule**: `Context.Thread` (Visualizes the $RS$ logic and lineage).
- **Taxonomy**: National (General Knowledge) -> State (Regional Pivot) -> District (Forensic Audit).
