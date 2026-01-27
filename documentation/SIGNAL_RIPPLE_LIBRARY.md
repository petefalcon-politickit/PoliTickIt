# Signal Ripple™ Library

This document defines the specific interaction types, data capture points, and monetization strategies for the "Signal Ripple" system within PoliTickIt. Signal Ripples (formerly Pulses) are the primary mechanism for transforming passive content consumption into actionable constituent data.

## Overview

A **Signal Ripple** is a lightweight, interactive element standard across all PoliSnaps. It captures user sentiment, priority, and verification, creating a real-time feedback loop between legislative data and constituent reaction using the **Quantum Feedback™** interaction model.

## Visual Identity: The Flag-in-Action Standards

The Signal Ripple™ system is visually anchored by the **Patriotic Wave System**, designed to communicate momentum, transparency, and accountability through a high-fidelity "Signal Capture" aesthetic.

### 1. The Ripple Motif

- **Primary Asset**: `PoliTickIt-Red-Wave.svg`
- **Configuration**: Four parallel, solid red stripes.
- **Placement**:
  - **Auth/Onboarding**: Used as the primary background pattern in `AuthBackground` with a 10% top offset and 60% vertical screen coverage.
  - **Interactive States**: Interactive elements (like the `SentimentQuantumPicker`) are visually locked to the Ripple logo (2px precise gap) to maintain brand cohesion during user engagement.

### 2. Branding Anchors

- **Logo Configuration**: Horizontal lockup with the `logo.svg` icon and `politickit-text.svg` brandmark.
- **Welcome String**: All high-level entry points (Login, Signup, Forgot Password) utilize the "WELCOME TO" sub-header (`size: 12`, `weight: 900`, `letter-spacing: 2`) above the primary brandmark.

### 3. Surface Standards

- **Interactive Container**: The `AuthCard` serves as the primary interaction surface for onboarding and critical auth flows, standardized with a **22px border radius**.
- **Metadata Pillboxes**: To preview the "Signal Capture" nature of the app, interactive selection chips (like Policy Interests) are styled as low-profile metadata pillboxes (8px radius, 1px border) to distinguish them from standard consumer app "bubbles."

---

## Signal Ripple Categories

### 1. Sentiment Ripple (The "Quantum React")

- **Purpose**: To gather low-friction, immediate feedback using the `SentimentQuantumPicker`.
- **Capture**: Discrete sentiment (Support / Oppose / Concerned) and basic "Agree/Disagree" with the AI-generated summary.
- **Monetization**:
  - **Public Opinion Data Feeds**: Anonymized, real-time sentiment streams licensed to newsrooms and advocacy groups.
  - **Ripple Heatmaps**: A "Pro" feature for institutional subscribers to visualize how sentiment on a specific bill is shifting across different demographics in real-time.

### 2. Alignment Ripple (The "District Match")

- **Purpose**: To quantify the "Representation Gap"—the delta between a Representative's vote and their constituents' stated values.
- **Capture**: A -10 to +10 alignment score indicating how well a specific action represents the user's personal priorities.
- **Monetization**:
  - **The Accountability Scorecard**: A premium dashboard for users to track their "Personal Representation ROI."
  - **Consulting Services**: Aggregate "Constituent Friction" reports sold to campaign consultants to identify messaging vulnerabilities before election cycles.

### 3. Intensity Pulse (The "Priority Weight")

- **Purpose**: To distinguish between "casual interest" and "single-issue voting" triggers.
- **Capture**: Magnitude of feeling (Low / Medium / High / "Dealbreaker").
- **Monetization**:
  - **High-Signal Alerting**: Users pay for a "Priority Filter" that only sends push notifications for issues they've flagged with high intensity.
  - **Voter Salience Modeling**: Selling "Issue Intensity" maps to PACs to help them prioritize resource allocation for GOTV (Get Out The Vote) efforts.

### 4. Verification Pulse (The "Ground-Truth")

- **Purpose**: To crowd-source the verification of local impacts mentioned in legislation (e.g., a local infrastructure project).
- **Capture**: Binary verification ("Seeing this locally" / "Not seeing this locally") and narrative "Evidence" (images or text).
- **Monetization**:
  - **Ground-Truth API**: A data endpoint for investigative journalists to find "voter-verified" leads on infrastructure waste or local corruption.
  - **Premium Curator Status**: Trusted users (verified by a high Verification Pulse history) can earn tokens or subscription discounts.

### 5. Correlation Pulse (The "Influence Filter")

- **Purpose**: To gauge the public's perception of "Pay-to-Play" scenarios once donor data is linked to floor votes.
- **Capture**: Perception of "Conflict of Interest" (Clear Conflict / Potential Conflict / Unrelated).
- **Monetization**:
  - **Lobbying Risk Ratings**: Brands and Corporations pay for "Political Sentiment Risk" audits to understand how their PAC donations are impacting their consumer brand perception.
  - **The Corruption Index**: A proprietary metric derived from user Correlation Pulses, licensed to financial services for ESG (Environmental, Social, and Governance) reporting.

### 6. Credibility Pulse (The "Truth-Meter")

- **Purpose**: To measure trust in specific statements, quotes, or data sources cited within a Snap.
- **Capture**: Binary "Trust" vs. "Doubt" or a confidence slider (0-100%).
- **Monetization**:
  - **Source Reliability Index**: Media outlets pay to see which specific data points or "Expert Witness" testimonies the public finds most/least credible.

### 7. Economic Impact Pulse (The "Wallet-Watch")

- **Purpose**: To capture how a user believes a specific bill will personally affect their financial situation.
- **Capture**: Qualitative impact (Savings / Cost / Neutral) and categorical impact (Taxes, Healthcare, Grocery Prices, etc.).
- **Monetization**:
  - **Consumer Sentiment Forecasting**: Retailers and financial institutions license raw constituent data on "Predicted Economic Anxiety" linked to specific legislation.

### 8. Predictive Pulse (The "Whip-Counter")

- **Purpose**: To crowd-source predictions on the passage of a bill or the outcome of a hearing.
- **Capture**: Binary "Will Pass" / "Will Fail" and estimated vote margin.
- **Monetization**:
  - **The Wisdom-of-Crowds API**: Institutional investors use crowd-sourced legislative passage odds as a signal for market volatility bets.

### 9. Mobilization Pulse (The "Turnout-Trigger")

- **Purpose**: To measure the "Voter Motivation" level a specific insight creates.
- **Capture**: Likelihood to vote (Increases / Decreases / No Change) or likelihood to attend a town hall.
- **Monetization**:
  - **GOTV Prioritization Data**: Political campaigns buy "High-Motivation Insight" data to know exactly which issue "Snaps" are actually converting non-voters into active voters.

### 10. Partisanship Pulse (The "Bipartisan-Check")

- **Purpose**: To gauge if a user perceives a specific investigation or legislative text as "Partisan Grandstanding" vs "Good Faith Governance."
- **Capture**: 5-point scale from "Pure Partisanship" to "Bipartisan Cooperation."
- **Monetization**:
  - **Neutrality Audits**: Think tanks and primary challengers license this data to identify when an incumbent has drifted too far into "Toxic Partisanship" for their own district.

### 11. Timeline Pulse (The "Urgency-Dial")

- **Purpose**: To capture whether constituents think a bill should be fast-tracked or if it needs more committee vetting.
- **Capture**: Choice of Action (Pass Today / More Study / Pause Indefinitely).
- **Monetization**:
  - **Legislative Priority Reports**: Sold to House/Senate leadership offices to help them manage their floor schedule based on constituent urgency.

### 12. Pivot Pulse (The "Alternative-Choice")

- **Purpose**: To identify "The Lesser of Two Evils" or preferred alternative solutions when a primary bill is unpopular.
- **Capture**: Preference between current Bill A and a proposed Amendment B or C.
- **Monetization**:
  - **Policy Pivot Analysis**: Advocacy groups use this to test which "compromise" language generates the most broad-based support before drafting counter-proposals.

### 13. Literacy Pulse (The "Civic-Check")

- **Purpose**: To assess if a user understood a complex legislative mechanism (e.g. Cloture, Reconciliation).
- **Capture**: Micro-quiz results or self-reported "I understand this fully" vs "I need more context."
- **Monetization**:
  - **Education ROI Reports**: Non-profits and educational foundations pay to see which "Snaps" are most effective at increasing civic literacy on specific topics.

### 14. Nuance Pulse (The "Secondary-Effect")

- **Purpose**: To capture "Unintended Consequence" fears—what the user thinks the _next_ thing to happen will be.
- **Capture**: Selection from a list of potential ripples (e.g., "Will lead to job loss," "Will lead to more innovation").
- **Monetization**:
  - **Risk Assessment Data**: Corporate risk officers use this to find "Contagion Sentiment" mapping how one bill's failure might trigger anger in unrelated sectors.

### 15. Activation Pulse (The "Micro-Pledge")

- **Purpose**: To convert "digital sentiment" into a tangible commitment.
- **Capture**: Pledge to call a rep, sign a specific petition, or donate $1.00 directly to an investigative fund.
- **Monetization**:
  - **Conversion-as-a-Service**: Third-party advocacy platforms pay a referral fee for every user who clicks through from a Pulse to take a "Real World Action."

---

## Integration with PoliSnaps

Every PoliSnap is required to have at least one **Sentiment Pulse**. More complex snaps, such as "Influence Pivot" or "Regional Peer" snaps, will typically include **Alignment** or **Correlation** pulses to maximize data value.

See [POLISNAP_REGISTRY.md](POLISNAP_REGISTRY.md) for how these are implemented in layout templates.
