# **AI Command Specification: OMNI-COMMAND**

- **Name**: Command Factory
- **Trigger**: `OMNI-COMMAND`
- **Version**: 1.0.0
- **Status**: Operational

## 🎯 Purpose

The `OMNI-COMMAND` trigger activates the **Command Factory**. Its mission is to transform a Visionary's high-level requirement into a fully scaffolded, forensic-ready **AI Command Suite** (Prompt + SOP).

## 📜 Execution Rules

### 1. Global Inheritance

- **Baseline**: This command inherits all safety, naming, and precision standards from the [Global AI Command Guardrails](global-command-guardrails.md).

### 2. Manifestation Protocol

- **Phase 0: Ideation (Parametrized)**: If the user provides `ideation-mode: true`, skip straight to "Propose Draft" and wait for "GO" before creating any files.
- **Step 1: Parse Use Case**: Extract the primary Goal, Trigger Name (prefixed with `OMNI-`), and Scope from the user's request.
- **Step 2: Prompt Generation**: Create the prompt file in `Coding Prompts/` using the global `Standard SOP` boilerplate.
- **Step 3: SOP Generation**: Create the matching specification in `documentation/AI Commands/`.
- **Step 4: Registry Update**: Inject the new command into the **AI Commands** table in `documentation/README.md`.

### 3. Verification

- **Validation**: Ensure all links created between the Prompt and the SOP are correct and relative.
- **Consistency**: Verify that the new command does not conflict with existing triggers.

## 🛠️ Specialized Tasks

- [ ] **Parse Visionary Request**: Identify the intent and target domain.
- [ ] **Generate Prompt File**: Save to `Coding Prompts/` with kebab-case name.
- [ ] **Generate SOP File**: Save to `documentation/AI Commands/`.
- [ ] **Update Core README**: Add the new command to the index.
- [ ] **Post-Flight Audit**: Run a quick validation check on the new command's connectivity.

---

_OMNI-COMMAND Command Specification initialized. The platform is now capable of self-expanding its operational intelligence._
