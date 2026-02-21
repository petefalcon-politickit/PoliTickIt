# PoliSnap Class Registry

This directory contains the generalized templates for all PoliSnaps. Every manifestation must attempt to leverage or extend an existing class before creating a one-off.

## 🏛️ Core Classes

### 1. `RepAudit`

- **Description**: High-fidelity audit of a representative's actions.
- **Dimensions**: Cross-Rep, Cross-Party.
- **Data Requirement**: `RepresentativeId`, `InstitutionalOracle`.

### 2. `PolicyPulse`

- **Description**: Analysis of specific policy impacts across regions.
- **Dimensions**: Cross-Policy, Cross-Region.
- **Data Requirement**: `PolicyTag`, `GeospatialBoundaries`.

### 3. `FiscalSovereignty`

- **Description**: Tracking tax allocation and ROI for constituents.
- **Dimensions**: Cross-Level (City, State, Federal).
- **Data Requirement**: `TaxRecord`, `BudgetLineItems`.

### 4. `ProductivityBench`

- **Description**: Comparative efficiency of a representative's legislative output.
- **Dimensions**: Cross-Institutional, Cross-Session.
- **Data Requirement**: `SponsorshipVelocity`, `FloorActivityLog`, `ResolutionEfficiency`.

### 5. `InstitutionalPresence`

- **Description**: High-density audit of physical presence and participation consistency.
- **Dimensions**: Cross-Session, Cross-Chamber.
- **Data Requirement**: `AttendanceLog`, `FloorActivityLog`.

### 6. `DarkMoneyMirror`

- **Description**: Correlates ethics referrals with campaign finance influence.
- **Dimensions**: Cross-Rep, Cross-Committee.
- **Data Requirement**: `EthicsReferralLog`, `FECCorrelationData`.

### 7. `CommitteeRecordPivot`

- **Description**: High-intensity pivot based on formal Ethics Committee releases.
- **Dimensions**: Cross-Rep, Institutional.
- **Data Requirement**: `CommitteeReportPDF`, `PressReleaseMetadata`.

---

## 🔧 Template Logic

Templates use dynamic hydration (e.g., `{{RepresentativeName}}`) to ensure "Idea to Production" speed across all institutional branches.
