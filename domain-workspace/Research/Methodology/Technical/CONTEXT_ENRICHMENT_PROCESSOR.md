# Context Enrichment Processor (CEP) Specification

> **Part of Capability:** [AUTONOMOUS CONTEXTUAL DISCOVERY (ACD)](CAPABILITY_AUTONOMOUS_CONTEXTUAL_DISCOVERY.md)

## OVERVIEW

The **Context Enrichment Processor (CEP)** is a self-guiding logic layer within the **PoliManifestor™**. Its primary function is to determine the "Refinement Depth" for any given Snap Class or Engine, ensuring a balanced depth and breadth of context without neighborhood-level over-extension.

## CORE LOGIC: THE THREAD-DOWN HEURISTIC

The CEP calculates a **Refinement Score (RS)** to decide where to stop the Context Thread.

### 1. Variables

- **I (Intensity)**: The raw significance of the data (0.0 - 1.0).
- **G (Geographic Density)**: How localized the oracle data is (e.g., USAspending is highly localized, Treasury Fiscal is National).
- **V (Velocity)**: How often the data updates (Daily, Monthly, Quarterly).
- **R (ROI Potential)**: The direct fiscal impact on a citizen's wallet or sovereignty.

### 2. The Formula

$$ RS = (I \times 0.4) + (G \times 0.3) + (R \times 0.3) $$

### 3. Depth Thresholds

| RS Range      | Output Depth | Context Level                                          |
| :------------ | :----------- | :----------------------------------------------------- |
| **0.0 - 0.4** | **National** | Broad trends, high-level summaries.                    |
| **0.4 - 0.7** | **State**    | Comparative analysis between states, regional impacts. |
| **0.7 - 1.0** | **District** | Representative-specific correlations, local ROI.       |

## THE CONTEXT.THREAD MOLECULE

Every refined Snap must include a `Context.Thread` molecule in its metadata or elements:

```json
{
  "id": "context-thread-001",
  "type": "Context.Thread",
  "data": {
    "lineage": ["National", "State", "District"],
    "derivationSummary": "This national budget shift translates to a $42M reduction in bridge maintenance for your specific district.",
    "contextScore": 0.85,
    "refinedBy": "PoliManifestor.CEP"
  }
}
```

## GUIDANCE INCORPORATION TIMELINE

1.  **Design-Time Guidance**: During the `POLIFEST` stage, the Manifestor checks the **Lowest Granular Point (LGP)** defined in the [Oracle Data & Genre Catalog](ORACLE_DATA_CATALOG.md) to set the "Refinement Ceiling."
2.  **Ingestion-Time Guidance**: During the live Ingestion Cycle, the CEP evaluates the current data's **Intensity ($I$)** and **ROI impact ($R$)** to decide if the "Thread-Down" should be executed for that specific update.

## IMPLEMENTATION IN THE MANIFESTOR

When a `POLIFEST` or `POLIGENRE` command is triggered (see [META_PROMPT.md](../Snap%20Manifestor/META_PROMPT.md)):

1. The Manifestor passes the Oracle data through the **CEP**.
2. The CEP returns the **RS** and recommended **Depth**.
3. The Manifestor generates the `Context.Thread` and refines the narrative elements accordingly.
