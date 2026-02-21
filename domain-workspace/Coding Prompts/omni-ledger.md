# **AI Command**

## 🤖 Meta Tasks

- **Standard SOP**: Execute all boilerplate tasks defined in [Global Guardrails](../documentation/AI%20Commands/global-command-guardrails.md).

## 🎯 Outcome

- **Name**: **Sovereignty Ledger Manager**
- **Scope**: **SQLite** Schema, `UserLedgerService`, and `VoterFileService` handover.
- **Triggers**: `OMNI-LEDGER`

### Goal

- To maintain a 100% relational, privacy-first ledger where all user state (credits, sentiments, audits) is immutable and forensic.

### Command Tasks

- **Schema Reconciliation**: Audit the SQLite schema in `PoliTickIt.Infrastructure` against the `4_DATABASE_SCHEMA.md`.
- **Zero-PII Audit**: Ensure no personally identifiable information (PII) is stored in cleartext within the ledger.
- **Handshake Verification**: Validate the `Consensus Ripple` voter-file handshake protocols in the `IVoterFileService`.

### Requirements

- All state transitions must be serialized via the `UserLedgerService`.
- Use relational constraints to maintain the integrity of the Sovereignty Moat.
- [Reference Global Standards for Naming, Formatting, and Safety]

### Background

- [Standard baseline: Always read the latest SESSION_LOG.md]

### Terms

- **Zero-PII**: A storage philosophy where only cryptographic hashes or masked identifiers are stored in relational proximity to sentiments.
- **Handshake**: The verification bridge between a local sovereignty proof and an external voter registry.
