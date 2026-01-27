# PoliSnap Registry

This document catalogues the high-level templates and pre-distributed snapshots available in the system.

## Overview

The system currently supports 100+ generated snaps across several core domains. These are defined in `constants/snapLibrary.ts` and managed by the `MockPoliSnapRepository`.

## Categorization

### 1. Accountability Snaps

_Targeting corruption, finance, and voting records._

- **Representation ROI Audit**: (High-Fidelity) A "Pro" tier scorecard providing an A-F grade based on Alignment, Corruption Risk, and Sentiment Gap.
- **Action Timeline**: (Dual Comparison) A high-intensity comparison of voting metrics and financial influence with precision vertical padding.
- **Dynamic Correlation: FEC-to-Vote**: (New) Automatically links significant PAC donations to legislative floor votes occurring within a tight temporal window.
- **Corruption Index**: (Metric) High-density breakdown of donor PACs and industry contributions with top-aligned iconography.
- **Deep Dive: Congressional Stock Activity**: (High-Fidelity) Uses Bar Charts and Expandable Tables to show trading volume against history.
- **Campaign Finance: High-Interest Donors**: Focuses on FEC data and corporate tracing.
- **Key Vote Alerts**: Dynamic layouts for specific legislative resolutions.

### 2. Knowledge Snaps

_Educational content explaining how government works._

- **The Pocket Veto**: Explains legislative mechanisms.
- **Committee Hierarchy**: Visualizes the power structure of the House/Senate.

### 3. Representative Snaps

_Profile-centric data for individual incumbents._

- **Comparison: Bipartisan Overlap**: Side-by-side analysis of two reps.
- **Legislative Productivity**: Metrics on bills introduced vs. passed.

### 4. Committee Snaps

_Tracking the activity of specific congressional committees._

- **Hearing Insights**: Summaries of upcoming or past hearings (e.g., AI Safety, Ethics).

### 5. Economics Snaps

_Tracking legislative impact on national and local economic indicators._

- **Inflation & Jobs**: Visualizing the correlation between federal spending and employment rates.
- **Interest Rate Insights**: Explaining the impact of debt-ceiling legislation on consumer borrowing.
- **National Metrics**: (New) High-fidelity tracking of Consumer Confidence, Retail Spending, and the National Debt/Deficit Ratio.

## Scaling Logic

Snaps are generated for the mock environment using a factory in `constants/mockData.ts`. This allows us to simulate large datasets for performance testing while ensuring every user category (Accountability, Knowledge, etc.) has rich content.

## How to Add New Snaps

1. Define the spec in `constants/snapLibrary.ts`.
2. Ensure all `type` strings used in `elements` are documented in the [Element Catalog](ELEMENT_CATALOG.md).
3. The mock repository will automatically pick up new items added to the domain arrays.
