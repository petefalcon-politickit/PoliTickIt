# **Omni-OS Analysis: Donor-Oracle Indexing (EVO-012)**

- **Context**: /documentation/Analysis/
- **Subject**: Mapping FEC Contributor Sectors to Legislative Impact Zones
- **Standard**: Omni Analysis Standard (Meta-Engine v1.1.0)
- **Author**: GitHub Copilot (Visionary Protocol)
- **Status**: DRAFT / IDEATION

---

## 📄 1. Overview: The Influence Gap

While the current `FECVoteNormalizer` identifies temporal correlations between donations and votes, it lacks a deep understanding of **Structural Influence**. A donation from a "Health" sector PAC to a representative on the "Energy and Commerce" committee (which oversees health) is more significant than a general donation.

**EVO-012** implements the **Donor-Oracle Indexing** system to bridge this gap by mapping contributor sectors to specific **Legislative Impact Zones** (Committees and Policy Areas).

---

## 🏛️ 2. The Impact Zone Taxonomy

We define "Impact Zones" derived from the platform's **Interest Areas** and standard Congressional Committee jurisdictions.

| FEC Sector (CRP Code)  | Impact Zone (Committee/Policy)           | Interest Area (Mobile)    |
| :--------------------- | :--------------------------------------- | :------------------------ |
| **Agribusiness (A)**   | Agriculture, Nutrition, Forestry         | Economics                 |
| **Communications (C)** | Energy & Commerce (Telecom), Judiciary   | Infrastructure (Digital)  |
| **Construction (E)**   | Transportation & Infrastructure          | Infrastructure (Physical) |
| **Defense (D)**        | Armed Services, Foreign Relations        | Accountability            |
| **Energy (N)**         | Energy & Natural Resources, Environment  | Infrastructure (Energy)   |
| **Finance (F)**        | Banking, Housing, Finance, Ways & Means  | Economics                 |
| **Health (H)**         | HELP (Health, Education, Labor, Pension) | Civic Dividend            |
| **Lawyers/Lobby (K)**  | Judiciary, Rules                         | Ethics                    |

---

## 🔬 3. The Indexing Algorithm (Forensic Weighting)

The **Donor-Oracle** will provide a refined `StrategicSignificance` score based on the following logic:

$$S_{strategic} = \text{BaseSignificance} \times (1 + \text{JurisdictionMultiplier})$$

- **BaseSignificance**: Current `FECVoteNormalizer` score (Timing + Magnitude).
- **JurisdictionMultiplier**:
  - **1.5x**: Donor sector matches the Representative's **Seniority Committee** jurisdiction.
  - **1.2x**: Donor sector matches a **Sub-Committee** or active **Legislative Bill Area**.
  - **1.0x**: General interest donation (No direct jurisdictional link).

---

## 🏗️ 4. Implementation Blueprint

### **A. The Donor Oracle Service**

A new singleton service responsible for:

1. Maintaining the mapping between FEC Sector codes and House/Senate Committee IDs.
2. Indexing representatives by their committee assignments (provided by `MockRepresentativeProvider`).
3. Providing a "Significance Multiplier" lookup for the `FECVoteNormalizer`.

### **B. Enhanced Snap Metadata**

Snaps generated via the Oracle will include:

- `metadata.impactZone`: The specific policy area of the influence.
- `metadata.jurisdictionMatch`: Boolean indicating if the donation hit a committee seat.
- `elements.auditElement`: A detailed breakdown of the sector-to-committee link.

---

## 🧪 5. Verification Test (The "Casar" Audit)

Using the Greg Casar sample data:

- **Sector**: "Health" (Pharma-Plus PAC).
- **Committee Match**: Does Rep. Casar sit on a Health-related committee?
- **Result**: If yes, the `Influence Correlation` score for `H.R. 291` (Generic Drug Access) should jump from ~60 to ~90.

---

_Donor-Oracle Analysis: Mapping the DNA of Political Influence._
