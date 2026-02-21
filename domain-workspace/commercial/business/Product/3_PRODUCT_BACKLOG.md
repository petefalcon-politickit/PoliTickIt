# PoliTickIt Product Backlog & Planning Matrix

This document is the high-fidelity source of truth for **Technical Planning**, **Sprint Prioritization**, and **Roadmap Execution**. It tracks the transition from the metadata-driven prototype to a production-grade accountability platform.

---

## 🏗️ 1. Architectural Readiness

| Layer                     | Status       | Focus                                                                   |
| :------------------------ | :----------- | :---------------------------------------------------------------------- |
| **Application (Backend)** | **Ready**    | 3-Tier Layered Architecture (Repository -> Provider -> Service).        |
| **UI/UX (Mobile)**        | **Hardened** | Vertical Block System & Signal Ripple™ interaction zones.               |
| **Infrastructure**        | **Ready**    | Awilix DI, Haptic Service, and local Sovereignty Ledger (AsyncStorage). |

---

## 📈 2. Planning Matrix

| Feature                       |  Priority  | PO Complexity | Architect Complexity | Status               |
| :---------------------------- | :--------: | :-----------: | :------------------: | :------------------- |
| **Institutional Track**       | ⭐⭐⭐⭐⭐ |     High      |        Medium        | **COMPLETED**        |
| **Snap Ingestion Engine**     | ⭐⭐⭐⭐⭐ |    Medium     |         High         | **PROPOSED**         |
| **MVP Content Hardening**     | ⭐⭐⭐⭐⭐ |    Medium     |        Medium        | **COMPLETED**        |
| **Provenance Wiring**         | ⭐⭐⭐⭐⭐ |    Medium     |        Medium        | **COMPLETED**        |
| **Dynamic Element Registry**  | ⭐⭐⭐⭐⭐ |    Medium     |         High         | **COMPLETED**        |
| **Strategic Pitch & Vision**  | ⭐⭐⭐⭐⭐ |     High      |         Low          | **COMPLETED**        |
| **Predictive Scoring (ML)**   |   ⭐⭐⭐   |     High      |         High         | **PROPOSED**         |
| **Collective Leaderboards**   |  ⭐⭐⭐⭐  |    Medium     |        Medium        | **COMPLETED**        |
| **Pulldown Refresh**          |   ⭐⭐⭐   |      Low      |         Low          | **COMPLETED**        |
| **Community Initiative Snap** |     ⭐     |      Low      |        Medium        | **IMPLEMENTED (UI)** |
| **Civic Event Resolution**    |  ⭐⭐⭐⭐  |     High      |        Medium        | **PROPOSED**         |

---

## 📋 3. Detailed Roadmap Items

### **[UI Layer] Pulldown Refresh Capability**

- **Status**: [COMPLETED]
- **Goal**: Implement standard "Pull-to-Refresh" functionality across all major feed screens.
- **Outcome**:
  - Integrated `RefreshControl` into `Accountability`, `Community`, and `Knowledge` screens.
  - Refresh action triggers synchronized re-fetch of content and the global activity/notification pulse.
  - Tactile feedback (Haptic Light Impact) integrated into the pull gesture.

### **[Epic] Institutional Track: FEC & Congressional Integration**

- **Goal**: Translate authoritative federal data into high-fidelity "Constituent Insights."
- **Requirement**: Build a comprehensive library of molecules for high-density federal reporting.
- **Key Deliverables**:
  - **Financial Accountability**: `Metric.FEC.ContributionAnalysis` (mapping PAC donations to voting trends).
  - **Legislative Pulse**: `Narrative.Congressional.FloorStatement` & `Data.Legislative.VotingRecord`.
  - **Atomic Hardening**: Precise rendering for legislative IDs (e.g., "H.R. 1234", "S.Res. 542") to prevent layout truncation.

### **[Epic] Snap Distribution & Ingestion Orchestration**

- **Goal**: Hardening the "Thin-Client" pipeline for the distribution of fully formed Snaps.
- **Requirement**: Transition from local mock data to the "Distribution Engine" (API).
- **Key Deliverables**:
  - **The Distribution Service**: Implement the `SnapDistributionService` (Production API Layer).
  - **Metadata Consumption**: Finalize the client-side ingestion of `metadata.laymanSummary` (Pre-synthesized).
  - **Schema Durability**: Implement version-checking and element failsafes (Shadow Registry) to handle evolving Snap schemas without breaking the UI.

### **[Epic] Local Persistence & Hybrid Data Hydration**

- **Goal**: Implement a production-grade local storage layer to support offline access, feed caching, and user data persistence.
- **Requirement**: Maintain the "Mock-First" capability to allow frontend testing while the backend pipeline is under construction.
- **Iterative Units**:
  - **Local Persistence Layer**: Integrate Expo SQLite with a schema optimized for Snap element relationships and user engagement (bookmarks/credits).
  - **Hybrid Repository Pattern**: Refactor `SnapRepository` to support a "Repository Switch" (Mock vs. Live vs. Local Cache).
  - **Hydration Engine**: Implement logic to background-seed the local DB with new Snaps from the API (or mock library) without blocking the UI.
  - **Sovereignty Ledger Relational Migration**: Move performance-critical user data (Contribution Credits, Participation Tiers) from `AsyncStorage` to relational SQLite tables for better reporting.

### **[Epic] Hardening the Truth Continuum: Liquid Logic & Forensic Provenance**

- **Status**: [COMPLETED]
- **Goal**: Implement the core relational logic for accountability and provide forensic proof of data source.
- **Outcome**:
  - **Liquid Logic Engine**: Developed `CivicIntelligenceService` to correlate user pulses with legislative records, calculating personalized "ROI" (Alignment) scores.
  - **The District View**: Built the `ConsensusRipple` molecule to visualize aggregated district sentiment with ZK-verification markers.
  - **Trust Thread™**: Implemented deterministic Serial IDs and forensic watermarking across the Snap library to signify "Sovereignty Ledger" provenance.
  - **Local-First Persistence**: Hardened the SQL-backend to support relational user data and hydrated representative activity.

### **[Infrastructure] Dynamic Element Registry & Cohort Failsafes**

- **Goal**: Decouple element registration from the release cycle.
- **Requirement**: Allow the backend to drive mapping of new data types to existing (or fallback) molecules.
- **Architectural Effort**:
  - Implement a "Shadow Registry" for failsafe rendering.
  - Integrate Cohort metadata into the `PoliSnapRenderer`.

### **[UI Layer] Participation Economy & Gated Intelligence**

- **Status**: [COMPLETED]
- **Requirement**: Link interactions to credits and gate high-tier audits.
- **Outcome**: Credits (+25/+50/+100) are persisted; `FeatureGate` slugs drive value discovery.

### **[Strategy] The Founder's Pitch & "Intelligence is Earned"**

- **Status**: [COMPLETED]
- **Goal**: Codify the business logic and philosophical foundation for the Participation Economy.
- **Outcome**:
  - Developed `PITCH_DECK.md` for executive alignment.
  - Drafted `FOUNDERS_SPEECH.md` to define the "Visbility Gap" and "Participation Arbitrage."
  - Strategic Shift: "Signal Integrity" as a B2B product powered by forensic crowdsourcing.

### **[UI Layer] Constituent Sentiment Feedback Loop**

- **Status**: [COMPLETED - UI ARCHITECTURE]
- **Requirement**: Enable users to rate/verify insights via Signal Ripple™.
- **Progress**: Quantum Feedback Sliders, Unified Identity, and Engage Zones are implemented.

### **[System] Intensity Gating™ & Signal Intelligence**

- **Status**: [COMPLETED]
- **Goal**: Implement high-fidelity noise reduction for legislative and community feeds.
- **Requirement**: Mathematically prioritize notifications based on "Significance Scores" (0-100).
- **Outcome**:
  - Global `IntensitySettings` implemented in `ActivityContext`.
  - Signal Intensity™ Algorithm integrated into notification filtering logic.
  - Mechanical high-density UI for configuration in `notifications-settings.tsx`.
  - **Hardening**: Participation Capital (Credits) persistence fixed via `AsyncStorage` hydration to ensure "Intelligence Earned" status remains stable across sessions.
  - **UI Refinement**: "Participation Capital" screen redesigned with high-density forensic layouts, top-aligned merit rows, and perfect vertical rhythm.

### **[Hardening] Participation Milestone Rendering**

- **Status**: [COMPLETED]
- **Requirement**: Rewards/Milestones should not be styled as standard data snaps.
- **Outcome**:
  - Wrapped in card-like containers with 8px radius sync.
  - Suppressed "Snap Type" and Insight Labels for `Reward` snaps.
  - De-interacted: Removed Watchlist/Bookmark capability for internal rewards.
  - Visual: Integrated brand-tinted background and shadowless "Gutter" aesthetic.

### **[Infrastructure] Telemetry Persistence & Real-time Aggregation**

- **Status**: [COMPLETED]
- **Goal**: Transition from local `AsyncStorage` to a centralized consensus engine.
- **Outcome**:
  - **Phase 1 (Isolated API Layer)**: Implemented `ApiTelemetryService` with network-ready push logic.
  - **Phase 2 (UI Handshake)**: Integrated API service into the Awilix container and verified in-app responsiveness for both Sentiment and Actions.
  - Optimized for optimistic updates: Local credit state remains immediate while telemetry is pushed asynchronously.

### **[UI Layer] Global Parity & High-Density Stabilization**

- **Status**: [COMPLETED]
- **Requirement**: Unify tab design, bottom sheet physics, and metric vertical rhythm.
- **Outcome**: 15px Grid synchronization, **Flush Navigation Architecture** (gutter removal), 4px selection contrast, and Productivity Molecule hardening implemented globally.
- **Responder Reliability**: Hardened the Representative profile by decoupling tab navigation from the sticky scroll hierarchy, ensuring 100% interactivity.

### **[Epic] High-Signal Navigation: The Intensity Badge System**

- **Status**: [COMPLETED]
- **Goal**: Implement a high-fidelity notification and navigation discovery system that uses **Intensity Gating** to highlight critical intelligence without contributing to notification fatigue.
- **Requirement**: Move beyond simple "Unread" counts and into "Significance-Based" alerting.
- **Outcome**:
  - **Intensity Gating Logic**: Implemented in `MockActivityService` with significance-based reduction logic.
  - **Global Sync Engine**: `ActivityProvider` synchronizes gated counts between the **Side Drawer** and the **Tab Bar**.
  - **User Calibration**: Built the **Intelligence Gating** configurator with "Mechanical High-Density" design for user-defined thresholds (0-100%).
  - **Visual Polish**:
    - **Typography**: Precision 10px Bold Mono numbers in red circles.
    - **Mechanical Layout**: Unified the Navigation Drawer density and settings typography.

### **[UI Layer] Collective Leaderboards & Reward Geometry**

- **Status**: [COMPLETED]
- **Goal**: Implement regional participation rankings to drive competitive civic engagement.
- **Outcome**:
  - **Zero-Gutter Grid**: Implemented a specialized 1px-border grid for Reward and Milestone snaps.
  - **Collapsible Architecture**: Unified the leaderboard layout with the "Mechanical" design system.
  - **Content Restoration**: Stabilized horizontal padding for institutional data snaps while preserving full-width reward layouts.

### **[Epic] The Sovereignty Dossier & Signal Ripple (Participation Identity)**

- **Status**: [ACTIVE - JAN 28]
- **Goal**: Transform the user identity from a passive consumer to an institutional "Sovereign Participant."
- **Key Modules**:
  - **Sovereignty Dossier (UI)**: A technical, monospaced dashboard replacing the generic Profile. Features include "Chain of Trust" streaks, technical Tier-up progress, and a "PoliProof™ Storage" vault for verified actions.
  - **Signal Ripple Integration**: Automated system for broadcasting significant user milestones (Tier Upgrade, Verified Attendance) as high-value community snaps.
  - **Topic Mastery Badges**: Functional badges (e.g., Fiscal Watchdog) that modify the UI aesthetic (font/color) once earned.
- **Strategic Impact**:
  - Validates the **Participation Economy**.
  - Provides "Social Proof" within the Community feed without diluting the forensic focus.

### **[Epic] Community Trust & Impact: Closing the Civic Loop**

- **Status**: [PROPOSED]
- **Goal**: Address the "Measurement Gap" by enabling users to commit to and verify attendance at physical civic events using the **Trust Thread™** model.
- **Requirement**: Build the infrastructure for post-engagement verification and long-term event scheduling.
- **Key Deliverables**:
  - **Commitment Registry**: A persistent list of community events (Volunteer gigs, Town Halls, Protests) that the user has committed to.
  - **Attendance PoliProof™**: A "Close the Loop" action trigger which rewards the user (Sovereignty Credits) upon verifying physical attendance via geo-location or QR-attestation.
  - **Partner Impact Dashboard**: High-fidelity dashboard for non-profits to visualize the conversion funnel: Snap Impression -> Event Commitment -> **Verified Attendance**.
  - **The Community Vibe**: Implement social signals that show "Friend X is attending" or "100 neighbors are on the Trust Thread™ for this event."

### **[Epic] Community Initiative Snap (Social Impact & Awareness)**

- **Status**: [COMPLETED - UI LAYER]
- **Goal**: Establish a bridge between digital legislative tracking and physical community action.
- **Priority**: Low (Exploratory/Strategic)
- **Implemented Functionality**:
  - **Organization Identity**: High-fidelity headers with "Verified 501(c)(3)" badge rendering.
  - **Event Mechanics**: Standardized event detail molecules with native Maps deep-linking.
  - **CTA Pipelines**: "Volunteer" and "Donate" action cards integrated into the snap workflow.
  - **Mechanical Styling**: Unified 4px radius, shadowless aesthetic for non-profit entities.
- **Next-Gen Deliverables (Mitigation Strategy)**:
  - **Relevance Routing (Content Fatigue)**: Logic to match initiative "Policy Focus" tags to user interest profiles.
  - **The Community Events Portal (Resource Constraints)**: Development of the B2B template engine for rapid snap generation by non-profit partners.
- **Strategic Value**:
  - Connects "The Pulse" (sentiment) with "The Action" (participation).
  - Enhances PoliTickIt’s footprint as a civic utility rather than just an accountability monitor.
  - Potential onboarding funnel for high-engagement "Super-Constituents."

### **[Epic] Identity & Relationship Management (The Follow Pipeline)**

- **Status**: [BACKLOGGED]
- **Goal**: Implement a robust "Follow" ecosystem across all entity headers.
- **Requirement**: Define global state management for following status and its impact on the consensus engine.
- **Work Items**:
  - Restore "Follow" CTA to `Identity.Rep.Brief` and `Header.Representative` once the backend relationship logic is defined.
  - Implement Follow indicators in the header info area (e.g., "Following" context vs prominent CTA).
  - Anchor Follow actions to the Participation Economy (rewarding users for following their specific representatives).

### **[Infrastructure] Telemetry Persistence & Real-time Aggregation**

- **Goal**: Transition from local `AsyncStorage` to a centralized consensus engine.
- **Phased Implementation**:
  - **Phase 1 (Isolated API Layer)**: Implement `ApiTelemetryService` and test in separation to verify network contracts (REST/WebSockets), headers, and auth durability without impacting UI state.
  - **Phase 2 (UI Handshake)**: Switch the service container registration and verify real-time "District Pulse" updates in the active feed.
- **Architectural Effort**: Medium (Isolated testing minimizes regression risk).

### **[UX Philosophy] The Trust Thread™ (Drill-Down Continuum)**

1.  **Accountability (The Grade)**: High-level ROI scores.
2.  **Representative Summary (The Narrative)**: Aggregated period-based performance.
3.  **Individual Details (The Proof)**: Atomic snapshots of specific actions/votes—the **PoliProof™** layer.

---

## 🏁 4. Next Steps (Post-Checkpoint)

### **[Epic] Verification API (Phase 1): The Chain of Trust**

- **Goal**: Design and implement the "Verified Constituent" handshake to link local participation to official voter registration (mocked).
- **Requirement**: Establish the `VoterFileService` interface for interaction with forensic providers.
- **Key Deliverables**:
  - **VoterFileService Handshake**: Protocol for matching Name/DOB/ZIP against external files (L2/TargetSmart).
  - **District Binding**: Logic to map verified addresses to specific legislative shapefiles.
  - **ZK-Signature Scaffold**: Prototype the "Accountable Anonymity" proof generation.

### **[Epic] Attendance PoliProof™: Closing the Civic Loop**

- **Goal**: Verify physical attendance at civic events to award high-intensity Sovereignty Credits.
- **Requirement**: Use device-level hardware signals (GPS/QR) to confirm presence.
- **Key Deliverables**:
  - **GPS Radius Check**: Verified check-in within 100m of a physical event.
  - **QR-Attestation**: Peer-to-peer or Organizer-to-User verification codes.
  - **Inertial Participation**: Reward users for the "Long Walk"—sustained physical attendance.

### **[Epic] B2B Community Dashboard: Institutional Visibility**

- **Goal**: Develop the portal for non-profits and representatives to visualize district-wide engagement.
- **Requirement**: Aggregate and filter anonymized constituent pulses.
- **Key Deliverables**:
  - **Engagement Filter Engine**: Tooling to segment pulses by "Verified" vs "General" status.
  - **Forensic Heatmapping**: Visualizing the "Intensity of Need" across district maps.
  - **Impact Dashboard**: Conversion tracking from digital snaps to physical participation.

### **[Hardening] Predictive Scoring Implementation**

- Integrate ML-ready metadata for "Likelihood to Pass" and "Constituent Alignment Forecast," adding an extra layer of **Strategic Verifiability**.

---

_This document maintains the high-fidelity planning details previously stored in COLLECTIVE_BACKLOG._
