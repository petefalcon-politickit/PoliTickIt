# Snap Guide: Representative Snaps

**Category**: Institutional Productivity (Tier 1-2)
**Primary Goal**: Monitor the day-to-day efficacy, attendance, and legislative output of elected officials.

---

## 📋 User Use Cases

### 1. The Productivity Watchdog

- **Scenario**: A user wants to know if their representative is actually working or just campaigning.
- **Action**: User views the **Attendance Grid** and **Achievement List** snaps.
- **Interaction**: User sees a heat-map of session attendance and a list of bills actually sponsored or co-sponsored in the last 90 days.

### 2. The Narrative Contextualizer

- **Scenario**: A major bill just passed the floor.
- **Action**: User finds the **Congressional Weekly Summary** snap.
- **Interaction**: User reads a non-partisan summary of the representative's floor statements and views a **Sentiment Ratio** showing how the district reacted to the vote. This ratio is calculated using the **Rational Sentiment ($RS$)** engine, which prioritizes the sentiments of verified inhabitants over non-resident signals.

---

## 🛰️ Forensic Guardrails

The validity of "District Feedback" in Representative Snaps is maintained via:

- **Local-Only Feedback**: The "Signal of Truth" badge verifies that sentiment data comes from the representative's actual voting district.
- **Weighted Consensus**: Resident voices carry $1.5x$ the weight of guest observers, ensuring the representative receives an accurate reflection of their constituency.

---

## 💎 Value Realization

### Value for the User

- **Transparency**: Removes the mystery of "what happens behind closed doors." Every floor statement and attendance record is visible.
- **Performance Tracking**: Allows the user to hold the representative accountable for "workhorse" vs "showhorse" behavior.
- **Accessibility**: Translates dense parliamentary jargon into a clear legislative timeline via `Metric.Progress.Stepper`.

### Value for the Representative

- **Proof of Efficacy**: Hard-working representatives can showcase their actual legislative wins and perfect attendance records directly to their constituents' feeds.
- **Unfiltered Narrative**: Allows the representative to reach their district with "Responsive Snaps" that clarify their actual position on complex votes.
- **Direct Feedback**: The representative receives a "Weekly Intelligence Report" based on user pulses, helping them prioritize their legislative focus.

---

## 🧬 Recommended Molecules

- `Identity.Rep.Header`
- `Metric.Attendance.Grid`
- `Metric.Achievement.List`
- `Metric.Progress.Stepper`
- `Narrative.Insight.Summary`

---

_Documented for HVDF Compliance - January 30, 2026_
