# **AI Command**

## 🤖 Meta Tasks

- **Standard SOP**: Execute all boilerplate tasks defined in [Global Guardrails](../documentation/AI%20Commands/global-command-guardrails.md).

## 🎯 Outcome

- **Name**: **Oracle Ingestion Orchestrator**
- **Scope**: **PoliTickIt.Ingestion** C# Providers (Treasury, FEC, Ethics, Congress).
- **Triggers**: `OMNI-ORACLE`

### Goal

- To standardize federal data ingestion, ensuring every provider emits high-density forensic metadata and adheres to the `BaseOracleProvider` architecture.

### Command Tasks

- **Provider Audit**: Audit C# providers in `PoliTickIt.Ingestion/Providers` for inheritance consistency.
- **Visual Metadata Injection**: Ensure all `PresentationMetadata` payloads include `fontSizeOffset: 5` and `v-rhythm-tight-1`.
- **Schema Mapping**: Reconcile oracle JSON outputs with the `2_ELEMENT_CATALOG.md` definitions.

### Requirements

- Strictly use C# 12 features for provider logic.
- Maintain 100% mock parity in `InMemorySnapRepository.cs` for every live provider change.
- [Reference Global Standards for Naming, Formatting, and Safety]

### Background

- [Standard baseline: Always read the latest SESSION_LOG.md]

### Terms

- **Severed Attributes**: The visual configuration (offsets/gutters) that defines the forensic UI.
- **Oracle Handset**: The data contract between a federal API and the mobile renderer.
