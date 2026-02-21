# **AI Command**

## 🤖 Meta Tasks

- **Standard SOP**: Execute all boilerplate tasks defined in [Global Guardrails](../documentation/AI%20Commands/global-command-guardrails.md).

## 🎯 Outcome

- **Name**: **Command Factory**
- **Scope**: **PoliTickIt** AI Command orchestration and scaffolding.
- **Triggers**: `OMNI-COMMAND`
- **Parameters**:
  - `ideation-mode`: (Optional) Boolean. If `true`, the command enters a collaborative refinement phase before file generation.

### Goal

- To provide a high-velocity mechanism for translating Visionary use cases into operational **Omni-Commands** through a **Constitutional Verification (CoVe)** loop.

### Command Tasks

- **Ideation Protocol**: If `ideation-mode=true`, present the proposed Command Name, Trigger, and a draft SOP for Visionary feedback.
- **Ground-Truth Attestation (FCP)**: Before generation, explicitly summarize the **Status Matrix**, **Strategic Blueprint**, and **Constitutional Grade** of the new command.
- **CoVe Verification Pass**: Audit the draft against [The Omni Constitution](../documentation/AI%20Commands/global-command-guardrails.md).
  - Verify alignment with **Section 1: Systemic Foundations** (Universal OMNI Governance).
  - Verify alignment with **Section 2: Domain-Specific Enforcements** (Project-Specific Moat, e.g., PoliTickIt's Zero-PII).
  - Ensure $C_{max} \le 7$.
  - Insert the **Forensic DNA** header.
- **Prompt Scaffolding**: Generate a new prompt file in `Coding Prompts/` following the [AI Command Prompt Template](command-template.md) based on the provided use case.
- **SOP Generation**: Author a production-grade SOP in `documentation/AI Commands/[trigger-name]-command.md` that guides the execution of the new command.
- **Registry Integration**: Automatically link the new command and its SOP in the [Core README](../documentation/README.md).

### Requirements

- Every generated command MUST have a unique trigger prefixed with `OMNI-`.
- Commands MUST explicitly inherit from the [Global AI Command Guardrails](../documentation/AI%20Commands/global-command-guardrails.md).
- If the SOP exceeds 7 tasks ($C_{max}$), it must be flagged for subdivision.
- Filenames must strictly follow the `lower-case-kebab-split.md` convention.

### Background

- **Visionary Intent**: We need to scale the platform's intelligence by making it easy to define new specialized "Managers" (Orchestrators) for every business and technical niche.
- **Constitutional Logic**: We are building a "Self-Expanding Operational Intelligence" that is self-limiting and self-policing. The CoVe protocol and FCP attestation ensure the factory never generates a sub-manager that violates the root sovereignty of the platform.
- [Standard baseline: Always read the latest SESSION_LOG.md]

### Terms

- **Command Prompt**: The instructions located in `Coding Prompts/` that activate the AI for a specific domain.
- **Command SOP**: The formal rules and execution check-lists located in `documentation/AI Commands/`.
