# Database Schema: The Sovereignty Ledger (Nexus v2.1)

**Relational Sovereignty Strategy**

## 1. Core Principles

1. **Local-First**: The mobile device is the "Truth Hub." All critical civic data must be locally persistent.
2. **Deterministic Sovereignty**: No PII (Personally Identifiable Information) is stored in the central cloud. Verified actions are cryptographically summarized before transmission.

## 2. Mobile Database (SQLite)

### `snaps` & `snap_elements`

- **Purpose**: A local mirror of the Distribution Tier data.
- **Optimization**: Normalized relational structure to support high-speed rendering of complex Vertical Blocks.

### `participation_ledger`

- **Fields**: `type`, `resource_id`, `credits_earned`, `tier_level`, `timestamp`.
- **Purpose**: The immutable record of a user's civic capital.

### `pulse_log`

- **Fields**: `intensity`, `resource_id`, `action_slug`, `timestamp`.
- **Purpose**: High-frequency tracking of interest levels to drive the **Consensus Ripple™** heatmaps.

### `sovereignty_identity`

- **Fields**: `district_id`, `verified_tier`, `residency_hash`, `hardware_attestation_key`.
- **Security**: This table is protected by the device's secure enclave and is never transmitted in its raw state.

## 3. Backend Database (SQL Server/EF Core)

### `Snaps` & `SnapElements`

- **Primary keys**: GUIDs mapped to SKU strings.
- **Relational Integrity**: Foreign keys enforce the connection between a Snap and its constitutive Visual Atoms.

### `Providers` & `IngestionLog`

- Tracks the health and frequency of extraction from FEC, Congress.gov, and local agencies.

## 4. Migration Continuity

We use a **Strict Versioning Protocol** (`PRAGMA user_version` on mobile, EF Migrations on backend).

- **Migration 1-9**: Initial scaffolding, Participation hardening, and Pulse logging.
- **Migration 10+**: Hardware-Ledger Lock integration and multi-device identity reconciliation.
