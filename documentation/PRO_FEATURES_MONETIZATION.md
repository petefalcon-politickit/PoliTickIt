# PoliTickIt: Pro Features & Monetization Strategy

This document serves as the "Master Book" for all Pro-tier functionality and monetization initiatives. It is organized into strategic pillars and a prioritized backlog for weekly review.

---

## 💎 The "Pro" Value Proposition

The **PoliTickIt Pro** tier transforms the app from a passive "Civic Newsfeed" into a specialized "Accountability Tool."

- **For Individuals**: Personal Representation ROI, Predictive Intelligence, and Ad-Free Signal Tracking.
- **For Institutions**: Real-time Constituent Sentiment Data, Bipartisan Drift Audits, and Legislative Foresight.

---

## 💰 Monetization Pillars

### 1. B2C: The "Personal Accountability" Subscription

_Target: Policy wonks, activists, and high-net-worth constituents._

- **Model**: Monthly/Annual Subscription ($9.99/mo).
- **Primary Driver**: Personalized "Representation ROI" and Predictive Passage Odds.

### 2. B2B: The "Signal Ripple" Data Feed

_Target: Political campaigns, PACs, Newsrooms, and Corporate Risk Officers._

- **Model**: API Licensing / Seat-based Dashboard ($500+ / mo).
- **Primary Driver**: High-fidelity, real-time constituent sentiment heatmaps.

### 3. B2G: The "Constituent Feedback" Portal

_Target: Congressional and State-level legislative offices._

- **Model**: Enterprise Licensing.
- **Primary Driver**: Cleaned, verified constituent sentiment (The "Verified Voter" Pulse).

---

## 📋 Pro Feature Backlog

| Feature                            | Category       | Target  | Estimated Value | Status      |
| :--------------------------------- | :------------- | :------ | :-------------- | :---------- |
| **Predictive Legislative Scoring** | Intelligence   | B2C/B2B | High            | In-Progress |
| **Personal Representation ROI**    | Accountability | B2C     | Medium          | In-Backlog  |
| **Verified District Heatmaps**     | Data Viz       | B2B/B2G | Very High       | In-Backlog  |
| **"High-Signal" Push Filters**     | UX/Utility     | B2C     | Medium          | In-Backlog  |
| **The "Corruption Index"**         | Transparency   | B2B     | High            | In-Backlog  |
| **Ground-Truth Verification API**  | Data Truth     | B2B     | High            | In-Backlog  |
| **Bipartisan Drift Audit**         | Political ML   | B2G/B2B | Medium          | In-Backlog  |

---

## �️ Current Technical Foundation

These are the existing building blocks already in the codebase that support the Pro roadmap.

| Component                    | Purpose                                                                                  | Location                                        |
| :--------------------------- | :--------------------------------------------------------------------------------------- | :---------------------------------------------- |
| **`FECVoteNormalizer`**      | Calculates `significanceScore` (0-100) based on donation amount vs floor vote proximity. | `services/implementations/FECVoteNormalizer.ts` |
| **`SentimentQuantumPicker`** | High-density capture for nuanced sentiment (Support/Oppose/Neutral).                     | `components/ui/sentiment-quantum-picker.tsx`    |
| **`WatchlistService`**       | Persistent storage for user-tracked legislative items.                                   | `services/implementations/WatchlistService`     |
| **`SentimentSlider`**        | Micro-interaction for continuous sentiment spectrum analysis.                            | `components/interaction/sentiment-slider.tsx`   |

---

## �🗓️ Weekly Review & Priority Log

Use this section to track priority shifts during weekly stakeholder syncs.

### Week of Jan 25, 2026

- **Current Focus**: **Personalized Accountability Dashboard** (UI Layer Implementation).
- **Milestones**:
  - Created `Metric.Predictive.Scoring` molecule for ML-driven passage odds.
  - Created `Metric.Local.Preference` molecule for district-specific impact data.
  - Integrated `PRO` dashboard snaps into the `Watchlist` screen.
  - Standardized font weights and severance styles for high-fidelity metrics.
  - **Watchlist Intensity Logic**: Implemented "Signal Gating" strategy in `ActivityProvider` to highlight only high-score correlations (Score > 80).
- **Top Priority**: **Predictive Legislative Scoring** - Successfully implemented the UI representation; next step is calculation logic integration.

### Proposed Priorities for Next Week

1. **Watchlist Segmentation**: Implement dual-tab navigation on the Watchlist screen to separate "Insight Dashboard" (Pro Metrics) from "Tracked Items" (User Selection).
2. **Scoring Refinement**: Refactor `FECVoteNormalizer` to include time-decay curves and sector-level aggregation for higher veracity.
3. **Accountability Scorecard**: Design the B2C "Representation ROI" (A-F grade) visualization.
4. **Provenance Deep-Link**: Wire up "View Proof" buttons to load raw FEC/Congress.gov source documents.

---

## 🔗 Related Resources

- [SIGNAL_RIPPLE_LIBRARY.md](SIGNAL_RIPPLE_LIBRARY.md) - Deep dive into interaction types.
- [PRO_BACKLOG.md](PRO_BACKLOG.md) - Technical implementation roadmap.
- [ARCHITECTURE.md](ARCHITECTURE.md) - Backend data flow for metadata enrichment.
