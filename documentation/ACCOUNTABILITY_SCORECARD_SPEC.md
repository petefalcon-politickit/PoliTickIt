# Technical Spec: Accountability Scorecard (B2C)

This document defines the UI/UX requirements and mock data schema for the **Accountability Scorecard**, the primary "Representation ROI" tool for PoliTickIt Pro.

---

## 🏛️ 1. Objective

Provide a high-fidelity, aggregate "Grade" for a representative based on three specific data vectors:

1.  **Alignment**: How often they vote in agreement with the user's explicitly selected interests.
2.  **Corruption Index**: The severity and proximity of financial correlations (FEC data).
3.  **Sentiment Gap**: The delta between the "District Pulse" (constituents) and the "Official Vote."

---

## �️ 2. Nomenclature & Marketability

To ensure the feature resonates with both "Pro" users and institutional stakeholders, the following marketable alternative terms and categorical voices have been identified:

### **Financial & Corporate (High-Stakes ROI)**

- **Constituent Dividend Report** (Implies the voter is getting a return on their "political capital")
- **Representation Yield Analysis**
- **Public Accountability Ledger**
- **Governance ROI Scorecard**
- **District Performance Portfolio**

### **Integrity & Security (The "Internal Audit" feel)**

- **Fidelity & Conflict Audit**
- **Public Integrity Index** (PII)
- **Representation Fidelity Report**
- **Ethics & Alignment Audit**
- **Legislative Trace Analysis**

### **Constituent-Centric (Direct Impact)**

- **District Alignment Score**
- **Constituent Impact Audit**
- **Representation Utility Grade**
- **Voter ROI Dashboard**
- **Legislative Reach Score**

### **Technical & Scientific (Data-Heavy)**

- **Efficacy & Sentiment Metrics**
- **Representation Alpha Grade** (Using the finance term for "beating the market")
- **Legislative Coherence Audit**
- **Political ROI Blueprint**
- **Accountability Diagnostic**

### **Short & Punchy (Mechanical Headers)**

- **The Rep Scorecard**
- **Audit: [Name]**
- **ROI Deep Dive**
- **Integrity Scan**
- **Pro Audit**

---

## 🎨 3. The Molecule Catalog

### A. `Metric.Scorecard.GradeBadge`

- **Purpose**: The "Hero" visual. Large A-F grade in a "Severed" circular or square container.
- **Styling**: Color-coded (A=Green, F=Crimson) with a "Pass/Fail" subtext.

### B. `Metric.Scorecard.AlignmentMeter`

- **Purpose**: A horizontal comparison bar showing "User Interests" vs "Rep Votes."
- **Data**: Percentage of alignment across Top 3 categories (e.g., Energy, Education, Tech).

### C. `Metric.Scorecard.CorrelationSummary`

- **Purpose**: A "Roll-up" of the Corruption Index.
- **Data**: Total number of "Critical" correlations in the last 180 days.

### D. `Metric.Scorecard.SentimentGap`

- **Purpose**: Visualizes "Representation Failure."
- **Data**: Delta between (User/District Sentiment) and (Floor Vote).

---

## 📊 3. Mock Data Schema (V1)

```typescript
{
  id: "scorecard-casar-user-001",
  type: "Metric.Accountability.Scorecard",
  data: {
    representativeId: "C001131",
    overallGrade: "B+",
    metrics: {
      alignment: { value: 82, label: "Overall Alignment" },
      corruptionIndex: { value: 14, label: "Corruption Risk", status: "Low" },
      sentimentGap: { value: 5, label: "Constituent Delta" }
    },
    topAlignedTopics: ["Infrastructure", "Tech Regulation"],
    topConflictTopics: ["Military Spending"],
    asOfDate: "JAN 26, 2026",
    sources: ["FEC.gov", "Congress.gov", "PoliTickIt Pulse"]
  }
}
```

---

## 🚀 4. Implementation Roadmap

1.  **UI Scaffolding**: Create the `ScorecardMolecule` in `components/polisnap-elements/metric/scorecard.tsx`.
2.  **Tab Integration**: Update `app/representative.tsx` to include the "Pro Audit" tab.
3.  **Persistence Simulation**: Update `MockPoliSnapRepository` to handle the scorecard generation logic.
4.  **Documentation**: Keep `ARCHITECTURE.md` updated with these new molecule endpoints.
