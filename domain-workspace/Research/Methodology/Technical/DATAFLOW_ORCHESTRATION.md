# Dataflow Orchestration: The Truth Distribution Pipeline (Nexus v2.1)

**Source Description**: This document formalizes the **"Prompt to Channel Content Presentation"** workflow, mapping the transition from raw AI prompts to high-fidelity PoliSnap molecules as defined in the HVDF v2.1 strategic vision.

---

## 🏗️ 1. Pipeline Architecture Overview

The pipeline is an asynchronous, event-driven backend system (C# / .NET 9) designed to gather institutional content, leverage AI for synthesis, and distribute verified intelligence to the Sovereign Ledger (Mobile).

### The Five Pillars of the Pipeline:

1.  **AI Generation**: Automated synthesis of raw government data.
2.  **Normalization**: Forensic cleansing and entity cross-referencing.
3.  **Metadata Orchestration**: Presentation and navigation mapping.
4.  **Maverick Audit (Proposed)**: AI-hardening and bias verification.
5.  **Event Distribution**: Targeted delivery to district/representative channels.

---

## 🔄 2. Stage-by-Stage Forensic Breakdown

### Stage A: Universal Ingestion Engine (The Dynamic Provider)

- **Role**: Scalable Data Acquisition.
- **Concept**: Instead of creating specialized C# classes for every data source (e.g., `VoteProvider`, `DonationProvider`), the pipeline leverages a **Universal Ingestion Engine**.
- **Process**:
  - **Metadata Manifest**: Defines the endpoint, data shape, and mapping logic via configuration.
  - **Universal Ingestor**: Executes the manifest, applying common normalization and trust-check rules.
- **Goal**: Support 1,000+ data sources without a corresponding increase in the backend codebase size.

### Stage B: PoliSnap Generator Processor

- **Role**: Content Synthesis.
- **Inputs**: Curated meta-prompts, Congressional records, FEC filings, judicial results.
- **Process**: Leverages LLMs (Intelligence Tier) to summarize complex hearings and debates into structured `PoliSnapSpawned` data.
- **Events**:
  - Subscribes: `PoliSnapSagaCompleted`.
  - Publishes: `PoliSnapGenerated`.

### Stage B: PoliSnap Normalizer Processor

- **Role**: Entity Alignment.
- **Process**: Validates and cleanses the generated content. This stage focuses on **Cross-Referencing**: connecting a "Statement" to a specific `RepresentativeId` or a "Contribution" to a `PAC_SKU`.
- **Outcome**: Creation of unified Summary and Detail data objects.
- **Events**:
  - Subscribes: `PoliSnapSpawned`.
  - Publishes: `PoliSnapNormalized`.

### Stage C: PoliSnap Metadata Processor (The Orchestrator)

- **Role**: UI/UX Mapping.
- **Process**: Uses the internal **UI Configuration Registry** to establish how the data should be presented (e.g., choosing `Visual.Chart.Bar` vs `Metric.Value.Display`). It attaches navigation metadata (deep-links) and significance scores.
- **Outcome**: A "Constructed Snap" that adheres to the `polisnap.schema.json`.
- **Events**:
  - Subscribes: `PoliSnapCorrelated`.
  - Publishes: `PoliSnapConstructed`.

### Stage D: PoliSnap Distributor Processor

- **Role**: Targeted Delivery.
- **Process**: Partitions content into channels: **Accountability**, **Representative**, **Knowledge**, and **Community**.
- **Logic**: Filters content by State, District, or Policy Area based on user subscription models.
- **Events**:
  - Subscribes: `PoliSnapConstructed`.
  - Publishes: `PoliSnapDistributed`.

---

## 🎯 3. HVDF Process Alignment

This dataflow is the mechanical implementation of the **Nexus Loop**:

1.  **Design-First**: The `Metadata Processor` ensures that UI constraints (Miller's Law) are enforced before distribution.
2.  **Verifiable Truth**: The `Normalizer` ensures that the **Trust Thread™** is anchored to official records.
3.  **High-Velocity**: The event-driven model allows for near-real-time updates of the mobile feed as Congressional activity occurs.

---

## 🏛️ 4. Formalized Nexus v2.1 Improvements

The following epics have been formalized into the [COLLECTIVE_BACKLOG.md](../Product/COLLECTIVE_BACKLOG.md) to further steer the HVDF process toward the "Post-Grad" level:

### 1. The Maverick Shield (Audit Layer)

- **Location**: Between _Normalizer_ and _Metadata_ processors.
- **Protocol**: Automated **AI-Audit Stage** that checks for partisan bias in the AI-generated summaries. If the "Neutrality Score" is below a threshold, it flags the snap for human review before distribution.

### 2. The Sovereign Signal Feedback Loop

- **Path**: Bi-directional relay from the _Mobile App_ back to the _Generator Processor_.
- **Protocol**: Use aggregated (ZK-verified) sentiment intensity from the mobile app to tune future meta-prompts. If users express high intensity on a specific policy area, the Generator increases the frequency and depth of snaps for that topic.

### 3. Multi-Oracle Normalization Protocol

- **Logic**: Redundancy requirement at the _Normalizer_ stage.
- **Protocol**: Requires agreement between two independent data sources (e.g., matching a Congress.gov voting record with an OpenSecrets financial filing) before the Snap is "Normalized" and signed.

### 4. Temporal Intensity Weighting (Liquid Logic Sync)

- **Location**: _Metadata Processor_.
- **Protocol**: Injects higher `significanceScore` and "Flash Proximity" metadata based on real-time event velocity, triggering physical device haptic alerts and priority placement in the Sovereign Ledger.

---

_Documented for HVDF Compliance - January 30, 2026_
