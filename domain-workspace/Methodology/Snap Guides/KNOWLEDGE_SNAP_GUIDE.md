# Snap Guide: Knowledge Snaps

**Category**: Civic Intelligence (Tier 1)
**Primary Goal**: Educate the user on the "rules of the game" and provide non-partisan context for institutional processes.

---

## 📋 User Use Cases

### 1. The Process Explainer

- **Scenario**: A user is confused about why a bill is "stalled in committee."
- **Action**: User views a **Forensic Audit** Knowledge snap linked from an Accountability snap.
- **Interaction**: User views a `Metric.Progress.Stepper` that explains the 5 stages a bill must pass, highlighting precisely where the current bottleneck exists and which chairperson controls the schedule.

### 2. The Methodological Deep-Dive

- **Scenario**: A user wonders how the "Corruption Index" is actually calculated.
- **Action**: User navigates to the Knowledge tab.
- **Interaction**: User reads the **Forensic Audit Methodology** guide, which describes the weighting between "Temporal Proximity" (30%) and "Contribution Amount" (70%), as well as the **Rational Sentiment ($RS$)** formula that weights constituent feedback at $1.5x$ based on ZK-Residency proofs.

---

## 🔬 Forensic Methodology: The "Signal of Truth"

Knowledge snaps serve as the primary documentation for the platform's core algorithms:

### 1. The Rational Sentiment ($RS$) Formula

The platform ensures that signal density is proportional to residency and participation:
$$RS = S \times (R_w + P_w)$$
Providing users with a transparent view of how their voice is amplified within the system.

### 2. ZK-Residency Handshake

The protocol for privacy-preserving verification:

- **Phase A**: Device Attestation (Hardware ID Lock).
- **Phase B**: Blind Oracle Handshake (TargetSmart District Check).
- **Phase C**: Forensic Signal Activation (Tier 3 unlocking).

---

## 💎 Value Realization

### Value for the User

- **Civic Literacy**: Empowers the user with the knowledge required to navigate the political landscape effectively.
- **Trust Building**: By explaining the "how" and "why" behind the data, the platform eliminates the "black box" feeling of modern news.
- **Empowerment**: Reduces the intimidation of complex government processes, making civic participation feel achievable.

### Value for the Representative

- **Educated Constituency**: Reduces the volume of "frequently asked process questions" directed at local offices, allowing staff to focus on constituent services.
- **Standardized Expectations**: When constituents understand the legislative process (e.g., that a bill takes time to pass), it creates more realistic expectations for change.
- **Neutral Terrain**: Provides a non-partisan educational buffer that helps de-escalate partisan tension through factual procedural clarity.

---

## 🧬 Recommended Molecules

- `Education.Guide.TieredContinuum`
- `Metric.Progress.Stepper`
- `Narrative.Insight.Summary`
- `Education.Guide.ForensicAudit`

---

_Documented for HVDF Compliance - January 30, 2026_
