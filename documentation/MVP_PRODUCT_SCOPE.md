# PoliSnap Content: MVP Product Scope & Master Catalog

This document serves as the high-fidelity source of truth for the **PoliSnap Content Strategy**. It defines the definitive scope for the MVP (Minimum Viable Product) and acts as the strategic guide for feature prioritization across all tiers (UI, Application, and Data).

## 🎯 The MVP "Line in the Sand"

The goal for MVP is to deliver **Daily High-Frequency Content** at the Federal level combined with **Multi-Dimensional Audits** that treat "Pro" features as high-fidelity engagement rewards.

### **The Gold Standard for MVP**

- **Home Feed**: Must feel "Alive," with updates reflecting the last 24–48 hours of Congressional, Financial, and Ethical activity.
- **Audit Pro Layer**: High-value "Pro" insights (ROI Audit, Predictive Scoring) are **Earnt, not Bought**. Participation via "Pulse" actions unlocks the next dimension of visibility.

---

## 🏛️ 1. Core Content Domains (MVP Scope)

### **A. Congressional Record & Floor Activity**

_Focus: Capturing the "Pulse" of the floor on a daily cycle._

- **Daily Summary Snaps**: High-density summaries of House/Senate floor proceedings.
- **Debate Highlights**: Capturing key exchanges or "Clips" (represented as Narrative elements).
- **Floor Votes (Rapid)**: Immediate rendering of vote results with user "Pulse" agreement capture.

### **B. Legislation Status & The Docket**

_Focus: Forward-looking awareness and tracking._

- **Upcoming Votes**: Snaps for bills scheduled for the floor in the next 72 hours.
- **Legislation Steppers**: Tracking a bill from Committee -> Floor -> Desk (using `Metric.Progress.Stepper`).
- **Position Summaries**: Layman-level breakdown of complex Continuing Resolutions (CRs).

### **C. The "Accountability" Finance Engine (FEC)**

_Focus: Ethics, Transparency, and "Follow the Money."_

- **Campaign Finance Snaps**: Quarterly and Monthly FEC filing summaries.
- **Influence Correlations**: (Hardened MVP feature) Linking donation spikes to specific legislative milestones.
- **PAC & Corporate Trace**: Visualizing which industrial sectors are powering a representative's war chest.

### **D. Committee Intelligence**

_Focus: Deep-dive specialty content._

- **Hearing Schedules**: Forward-looking calendar of high-profile hearings (e.g., AI Oversight, Ethics).
- **Member Insights**: Who is playing the "Prosecutor" vs "Defender" in committee hearings.
- **Transcript Highlights**: AI-synthesized summaries of 4-hour hearings into 3-minute reads.

### **E. Representative Productivity & Identity**

_Focus: The "Individual Audit" results._

- **Attendance Records**: Simple daily/weekly metrics on presence.
- **The Achievement Log**: Documenting sponsored bills or floor wins.
- **Representative Profiles**: Standardized headers and bio-data.

---

## 💎 2. The Engagement-to-Insight Loop (MVP Priority)

Instead of a traditional subscription, the MVP focuses on **Gamifying Accountability**.

- **Contribution Credits**: Every "Pulse" interaction (Snap voting, Sentiment Sliders) earns the user "Participation Capital."
- **Insight Unlocks**: Reaching engagement milestones unlocks "Audit Pro" features:
  - **Tier 1**: Deep-dive FEC Correlations.
  - **Tier 2**: Full Representation ROI Audit Scorecards.
  - **Tier 3**: Predictive Legislative Scoring & Passage Odds.
- **District Rewards**: Highly engaged users reap rewards through higher visibility and "Verified Constituent" status within their district's pulse mapping.

---

## ⚖️ 3. Monetization: The Two-Wave Strategy

### **Wave 1: User Engagement (Current Focus)**

- Focus on building a massive, verified constituent base.
- Monetization is secondary; **Retention and Data Density** are the primary KPIs.

### **Wave 2: Institutional Interaction (Revenue Phase)**

- Representatives, Campaigns, and PACs pay for **Verified Pulse Readings**.
- Monetization comes from the "Demand Side" to understand district, state, and demographic sentiment trends.

---

## 🏛️ 4. Secondary Domains (Post-MVP / Roadmap)

### **F. Public Statements (Social & Press)**

- **Cross-Platform Social Feed**: Merging Twitter/X and Threads posts into a "Public Record" snap.
- **Press Release Analysis**: Contrasting official PR narratives against actual voting records.

### **G. Judicial & Docket**

- **Supreme Court Opinions**: Narrative breakdowns of high-impact judgments.
- **Case Tracking**: Forward-looking tracking of federal dockets with significant public interest.

### **H. Events & Community**

- **Town Hall Schedules**: Locally-targeted snaps for constituent meetings.
- **Local Preference Mapping**: Showing how a Rep's vote impacts specific district projects.

---

## 🛠️ 5. Strategic MVP Priorities (The "Epic" Level)

### **[EPIC] The PoliSnap "Completion" Cycle**

1.  **UI/UX Hardening**: Finalize the look and feel of every molecule in the domains above (Data Tables, High-Density Lists, Steppers).
2.  **Mocking the Daily Cycle**: Update `snapLibrary.ts` to simulate a "Live" 24-hour cycle of Federal activity.
3.  **Pulse Integration**: Ensure every content type has a tactical "Agree/Disagree" or "Support/Oppose" surface.

### **[EPIC] The Representative Audit (Finalization)**

- Hardening the "Audit" tab to ensure it is the most valuable "Pro" payoff for the MVP.

---

## 📅 Maintenance & Review

This document is a "living" registry. During every session, the AI and User will review the "Definitive MVP Line" to ensure technical efforts (like Persistence or API optimization) are serving the Content Goal.
