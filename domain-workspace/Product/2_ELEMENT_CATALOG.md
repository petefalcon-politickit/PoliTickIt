# PoliTickIt Element Catalog & Registry Specification

This document defines the visual dictionary of **Molecules** (Elements) that form the building blocks of a PoliSnap, along with their data requirements and registry patterns.

---

## 🏛️ 1. Element Catalog (The Molecules)

Elements are cohesive, reusable UI blocks registered in a central factory.

### **Identity Molecules**

- **Identity.Rep.Header**: Standardized profile (Photo, Name, District, Party).
- **Identity.Rep.Brief**: Scaled-down header for secondary contexts.

### **Metric Molecules**

- **Metric.Dual.Comparison**: Two metrics compared side-by-side (e.g., Support vs. Oppose).
- **Metric.Progress.Stepper**: Sequential status tracking (e.g., Bill through Congress).
- **Metric.Alignment.Gauge**: Visual spectrum for high-level ideological or local-interest positioning.
- **Metric.Simple.Data**: A single data point with label and unit.
- **Metric.Group**: A grid of related metrics with a shared category title.
- **Metric.CorruptionIndex**: High-Audit molecule for donor influence (Bold Uppercase titles).
- **Metric.Achievement.List**: Tracking legislative milestones (laws, amendments, cosponsorships).
- **Metric.Attendance.Grid**: High-density grid visualizing session participation consistency.
- **Metric.Congressional.WeeklySummary**: Multi-dimensional weekly performance (participation pulse, sentiment ratio, floor metrics).

### **Visual & Chart Molecules**

- **Visual.Chart.Bar**: Standard bar charts for comparative volumes.
- **Visual.Chart.SentimentTrend**: Multi-day sentiment momentum lines.
- **Visual.Chart.FEC.CorrelationGrid**: Heatmaps linking money to timing.

### **Interaction Molecules**

- **Interaction.Sentiment.Slider**: 21-point spectrum slider for nuanced feedback.
- **Interaction.Pulse.Button**: Binary or Multi-state sentiment capture.
- **Interaction.Action.Card**: Pathway for user agency (e.g., "Add to Watchlist").
- **Interaction.Provenance.Receipt**: (Global/Element) "View Forensic Proof" button linked to authoritative sources.

### **Educational & Guide Molecules**

- **Education.Guide.TieredContinuum**: Visual mapping of the 4-tier intelligence pipeline.
- **Education.Guide.ParticipationEconomy**: Explaining Sovereignty Credits and Reward Vault mechanics.
- **Education.Guide.ForensicAudit**: Methodology guides for FEC and Congressional metadata.

---

## 📊 2. Specialized Spec: Accountability Scorecard

The **Accountability Scorecard** is the flagship ROI Audit molecule (Tier 3).

- **Data Structure**:
  - `grade`: Character (A-F).
  - `alignmentScore`: Percentage (Constituent vs. Rep).
  - `corruptionIndex`: Percentage (Donor influence rating).
  - `financialData`: Breakdown of top donor sectors and amounts.

---

## ⚙️ 3. PoliSnap Registry

The **Registry** defines how element types map to React components.

- **Type String**: (e.g., `Data.Table.Grouped`)
- **Factory Route**: Handled by `ComponentFactory`.
- **Styling**: Consumes **Severed Styles** (e.g., `snapTitle`, `pulseProTitle`) to maintain category independence.

### **Visual Standards**

- **Zero-Margin Policy**: Molecules must have no outer margin.
- **Grid Synchronization Standard**: Titles, summaries, and element containers must maintain a **15px** vertical gap to ensure horizontal parity across different snap types in the feed.
- **Vertical Rhythm**: Managed by a 12px `elementGutter` in the renderer for atomic block spacing.
- **Flush Navigation Architecture**: Navigation bars are flush with the content area (no gutters) and use a strict **No-Shadow policy** (elevation: 0) for a minimalist industrial look.
- **High-Contrast Selection**: Interactive filters and 3-column policy grids use a **4px** border highlight for immediate visual feedback.
- **The Institutional Track**: Slate 50 background for dashboards and summary summaries, solid white for snap cards and metric boxes to provide visual lift.
- **Standardized Productivity Titling**: Molecule titles in the Productivity tab (e.g., Attendance, Weekly Summary) use the `metricCardTitleLeft` standard: **13pt, Semibold, Uppercase, 0.8 Letter-Spacing**.

---

_This document integrates ELEMENT_CATALOG, POLISNAP_REGISTRY, and ACCOUNTABILITY_SCORECARD_SPEC._
