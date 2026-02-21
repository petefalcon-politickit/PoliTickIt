# **AI Command Specification: OMNI-LEDGER**

- **Name**: Sovereignty Ledger Manager
- **Trigger**: `OMNI-LEDGER`
- **Version**: 1.0.0
- **Status**: Operational

## 🎯 Purpose

The `OMNI-LEDGER` command manages the core data layer of the "Relational Sovereignty" model. It ensures the platform's immutable record remains scientifically accurate and legally defensible.

## 📜 Execution Rules

### 1. Global Inheritance

- **Baseline**: Inherits all safety and precision standards from [Global AI Command Guardrails](global-command-guardrails.md).

### 2. Relational Integrity

- **AsyncStorage Deprecation**: NO new feature may use `AsyncStorage` for state that impacts the user's civic record.
- **SQLite Prime**: The Sovereignty Moat is anchored in SQLite. All schema migrations must be transactionally safe.

### 3. Privacy Standards

- **Forensic Masking**: Any audit trail referencing a "Representative Interaction" must be masked to prevent deanonymization of the user within the voter file.

## 🛠️ Specialized Tasks

- [ ] **Discovery Extraction**: Reference `SESSION_LOG.md` for ledger breakthroughs.
- [ ] **Schema Drift Audit**: Check for divergence between `SqlitePulseService` and the architecture docs.
- [ ] **Handshake Review**: Audit the `VoterFileService` integration progress.

---

_OMNI-LEDGER Command Specification initialized._
