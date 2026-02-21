# Snap Guide: Accountability Snaps

**Category**: High-Audit Intelligence (Tier 2-3)
**Primary Goal**: Quantify the relationship between constituent interest, financial influence, and voting behavior.

---

## 📋 User Use Cases

### 1. The Conflict Detector

- **Scenario**: A user hears a rumor that their representative is "bought" by the energy industry.
- **Action**: User opens the Accountability tab and finds the **Corruption Index** snap for their representative.
- **Interaction**: User drills down through the **Trust Thread™** to see the exact timing of a $5,000 PAC donation relative to a "YEA" vote on an energy deregulation bill.

### 2. The ROI Audit

- **Scenario**: A user has been pulsing their sentiment on environmental bills for months.
- **Action**: User checks their personalized **ROI Report Card**.
- **Interaction**: The user sees an **Alignment Score** (e.g., 42%) which mathematically correlates their personal values with the representative’s actual performance. This score is hardened by the **Rational Sentiment ($RS$)** engine, ensuring that constituent-verified signals carry a 1.5x weight in the audit significance.

---

## 🛰️ The Forensic Engine: Rational Sentiment ($RS$)

To ensure high-integrity audits, all accountability snaps are processed through the $RS$ module:

- **Formula**: $RS = S \times (R_w + P_w)$
  - $S$: Base Signal (Support/Oppose)
  - $R_w$: Residency Weight (1.5 for ZK-Verified constituents, 1.0 otherwise)
  - $P_w$: Participation Weight (Up to 0.5 bonus based on Signal Credits)
- **Impact**: This engine prevents "carpetbagger signals" from diluting the representative's local accountability score.

---

## 💎 Value Realization

### Value for the User

- **Objective Certainty**: Replaces "political feeling" with "forensic fact." Users know exactly where they align or diverge from their representation.
- **Time Efficiency**: Condenses thousands of pages of FEC and Congressional filings into a single, high-density character grade (A-F).
- **Agency**: Provides the evidence required to make an informed decision at the ballot box or during a primary challenge.

### Value for the Representative

- **Alignment Awareness**: Honest representatives can identify where they are out of sync with their actual district, allowing for course correction before an election cycle.
- **Defense against Misinformation**: Representatives can point to verified, ZK-signed alignment data to counter "out of context" attacks from political opponents.
- **Quality Engagement**: Filters out "noise" and bots, prioritizing the voices of verified constituents who have high **Participation Capital**.

---

## 🧬 Recommended Molecules

- `Metric.CorruptionIndex`
- `Metric.Alignment.Gauge`
- `Visual.Chart.FEC.CorrelationGrid`
- `Data.Table.Expandable` (for transaction histories)

---

_Documented for HVDF Compliance - January 30, 2026_
