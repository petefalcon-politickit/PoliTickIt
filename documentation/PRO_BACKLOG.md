# PoliTickIt Platform Roadmap: The "Pro" Interactive Evolution

This roadmap outlines the transition from a static, metadata-driven UI to an interactive, predictive, and personalized accountability platform, organized by architectural layers as per the **Prompt to Channel Content Presentation** workflow.

## 🏗️ Architectural Layers

### 1. Application Layer (C# / Backend)

Focuses on the lifecycle of content: from raw data ingestion to metadata-enriched PoliSnap construction.

- **PoliSnap Generator Processor**: AI-driven synthesis of hearings, floor debates, and news into structured `PoliSnapSpawned` data.
- **PoliSnap Normalizer Processor**: Validation, cleansing, and cross-referencing (connecting Reps to PACs and Bills).
- **PoliSnap Metadata Orchestrator**: Preparing the final JSON payload, including UI configurations and predictive scoring.
- **PoliSnap Distributor Processor**: Event-driven distribution to specific channels (Accountability, Representative, Knowledge).

### 2. UI/UX Layer (React Native / Mobile)

Focuses on the presentation, interaction, and user-centric features.

- **Interactive Rendering**: Processing the metadata-driven "Vertical Blocks".
- **Actionable Insights**: Handling deep-links, external sources, and entity navigation.
- **User Feedback Loop**: Capturing constituent sentiment and social signals.

---

## 📋 RoadMap Items & Feature Backlog

### [Infrastructure] Dynamic Element Registry & Cohort Failsafes

- **Status**: [PROPOSED / ARCHITECTURE DEFINED]
- **Requirement**: Decouple element registration from the release cycle to allow for canary deployments and "Pro" early-access features.
- **Goal**: Transition to a hybrid registry where the backend drives mapping of new data types to existing (or fallback) molecules.
- **Architectural Effort**:
  - Implement a "Shadow Registry" for failsafe rendering of unregistered types.
  - Integrate Cohort/User Group metadata into the `PoliSnapRenderer`.
  - Establish a metadata-driven "hint" system for dynamic aliasing.

### [UI Layer] High-Priority Font & Weight Standardization

- **Status**: [COMPLETED]
- **Requirement**: Address persistent inconsistencies in font sizes and weights across Pulses, Charts, and Metrics.
- **Outcome**: Established the "Severed Style" architecture in `theme.ts`, isolating styles by component category (e.g., `snapTitle`, `pulseProTitle`, `metricCardTitle`). Standardized weights using `Typography.weights.bold/heavy` across FEC and Data Table domains.

### [Application Layer] AI-Generated Narrative Generation

- **Workflow Stage**: Generator Processor.
- **Requirement**: Dynamically generate `Narrative.Insight.Summary` from raw factual inputs.
- **Stakeholder Value**: Massive cost-saving in content generation and hyper-relevance.
- **Architectural Effort (C#)**: Implement prompt-engineering pipelines and safety filters.

### [Application Layer] Predictive Legislative Scoring

- **Workflow Stage**: Metadata Orchestrator.
- **Requirement**: Enrich snaps with "Success Probability" for Bills using ML models.
- **Stakeholder Value**: High-value "Pro" intelligence.
- **Architectural Effort (C#)**: Integration with ML inference endpoints and data historicals.

### [UI Layer] Constituent Sentiment Feedback Loop

- **Status**: [COMPLETED - UI ARCHITECTURE]
- **Requirement**: Enable users to rate, verify, or dispute specific snap insights via PoliPulse.
- **Progress**:
  - **The Signal Ripple™ branding**: Unified central identity logo.
  - **Pulse Pro Engagement Zones**: Card-based containers (`#F8FAFC` background, 1px border) for all interaction molecules.
  - **Quantum Feedback Slider**: 21-point bilateral spectrum slider for nuanced sentiment.
  - **High-Density Quantum Picker**: Multi-tab sentiment picker with asymmetrical "Neutral" weighting and optimized wrapping.
- **Next Stage**: [Telemetry Backend] - Implement persistence for user sentiment and aggregation logic.

### [UI Layer] Representative Header Identity

- **Status**: [COMPLETED]
- **Requirement**: Refine the visual profile of representatives in shared navigation and detail headers.
- **Progress**:
  - **Standardized Identity Pattern**: 36px circular avatars, rectilinear position badges (Gray/Slate), and secondary position metadata lines.
  - **Micro-Refinement**: Precision alignment of brand logos, restricted font weights (Regular for names), and normalized gutter spacing.

### [UI Layer] Unified Poly-Metric Domain

- **Status**: [COMPLETED]
- **Requirement**: Consolidate disparate metric elements (Dual, Triple, Legislative, FEC) into a single meta-driven component.
- **Progress**:
  - Implemented `Metric.Group` in `components/polisnap-elements/metric/metric-group.tsx`.
  - Centralized metric styling in `GlobalStyles`.
  - Normalized legacy data schemas into a single grid-based renderer.

### [UI Layer] Dark Mode Brand Palette

- **Status**: [COMPLETED]
- **Requirement**: Define a high-contrast dark mode palette derived from light mode brand colors.
- **Progress**:
  - Calculated `DarkPrimary` (#4DA3FF), `DarkSecondary` (#79B6F2), and `DarkAccent` (#EF6374).
  - Updated `constants/theme.ts`.

### [UI Layer] Personalized Accountability Dashboard

---

## ✅ Completed Session Milestones (Jan 26, 2026 - The Institutional Foundation)

### [UI Layer] Institutional Feed Architecture
- **Status**: [COMPLETED]
- **Value**: Establishes a professional, high-density "mechanical" feed.
- **Work**: 
  - Implemented `FeedGutter` component for standardized gray "tracks" between snaps.
  - Refactored `PoliSnapCollection` / `polisnap-renderer.tsx` to interleave gutters and snap cells in a flat list.
  - Reduced "visual vibration" by shifting from separate card margins to a unified feed cell architecture.

### [UI Layer] Status Color Professionalization
- **Status**: [COMPLETED]
- **Work**: Updated `theme.ts` to use muted, sophisticated tones for Success (`#38A169`), Error (`#E53E3E`), and Warning (`#D69E2E`), aligning with institutional design standards.

### [UI Layer] Navigation Icon Standardization
- **Status**: [COMPLETED]
- **Work**: Shifted "Watchlist" iconography from stars to "Bookmarks" across the App Drawer, Header, and Snap footer buttons for categorical clarity.

### [UI Layer] Element Alignment & Padding (Micro-Refinements)
- **Status**: [COMPLETED]
- **Work**: 
  - Top-aligned icons in `Corruption Index` to match multi-line PAC labels.
  - Added 8px additional padding (15px total) to `Action Timeline` titles for better breathing room.
  - Drop font weight to **Regular (400)** on `Participation Slugs` for a cleaner look.

### Participation Capital & Intelligence Gating

- **Local-First Sovereignty Ledger**: Implemented `AsyncStorage` persistence for user engagement credits, ensuring privacy-first meritocracy.
- **Feature Gate (Lockbox)**: Developed the "Lockbox" UI pattern to blur high-value content until meritocratic thresholds are met.
- **Tier 2 FEC Integration**: Launched the `Data.Correlation.Heatmap` for visualizing financial influence on voting records.

### Tier 4 Predictive & B2B Strategy

- **AI Legislative Forecasting (Tier 4)**: Launched the `Metric.Predictive.Forecasting` molecule, visualizing bill passage odds driven by real-time "Sentiment Ripples."
- **Constituent Capital (B2B POC)**: Developed the `Data.Consensus.Ripple` molecule, aggregating district-level sentiment for institutional stakeholders.
- **Haptic Texture Branding**: Categorized haptic signatures into "Democratic Wins" (Success) and "Accountability Warnings" (Alerts) to grounding the physical user experience.
- **Haptic Service Architecture**: Centralized tactile feedback into a disposable service abstraction (`IHapticService`).

- **Functional Gating Core**: Implemented the `useFeatureGate` hook and `FeatureGate` UI component for content-level credit checks.
- **Intelligence Roadmap Tiering**: Defined and implemented the 4-tier benefit system (Standard, Intelligence, ROI Auditor, Predictive).
- **Tier 2 Content Scaffolding**: Created the `Data.Correlation.Heatmap` element, providing the first tangible reward for Tier 2 (Intelligence) users.
- **Persistence & Sovereignty**: Implemented `AsyncStorage` persistence in `MockTelemetryService` to ensure user credits survive app restarts.
- **Credit Telemetry Wiring**: Integrated `Participation Credit` earning into Watchlist actions and Sentiment interactions.
- **B2B Strategy**: Drafted the "Campaign & Institution Dashboard" concept for B2B monetization and district sentiment visualization.
- **ParticipationStatusModal**: Created a rich, app-wide marketing surface triggered from the header to communicate feature value and progress.
- **Cross-Platform Compatibility**: Verified high-fidelity rendering and haptic feedback on both iOS and Android platforms.
- **Design System Mechanization**: "Severed" the Heatmap molecule into `theme.ts` to adhere to zero-margin and mechanical styling guidelines.
- **Navigation Refinement**:
  - Moved Participation dashboard to the base of the Settings menu in the Drawer.
  - Implemented cross-platform navigation logic (Android Drawer focus).
  - Added header context awareness to prevent navigational recursion.

### UI Architecture Refinement

- **Themed Modal System**: Established the pattern for branded, scrollable status overlays with progress tracking.
- **Participation Screen Overhaul**: Compressed hero metrics and implemented the 2x2 Intelligence Tier grid for high-density status communication.

## ✅ Completed Session Milestones (Jan 25, 2026 - Interactive Functional Layer)

### Persistence & Service Tier

- **Mock Telemetry Service**: Implemented `MockTelemetryService` with console logging and `expo-haptics` integration.
- **Watchlist Persistence**: Created `WatchlistService` using `AsyncStorage` to persist user-tracked snaps across sessions.
- **Functional Action Cards**: Upgraded `ActionCardMolecule` to dynamically toggle watchlist status, update UI labels ("Add" vs "Remove"), and switch icons (Chevron vs Bookmark).
- **Dynamic Watchlist Screen**: Resolved the `WatchlistScreen` to fetch real data from the user's `AsyncStorage` via the `PoliSnapRepository`.

### Pulse Pro Interactive Suite & Telemetry (Jan 25, 2026 - Morning)

### Pro Accountability Dashboard & Monetization (Jan 25, 2026 - Afternoon)

- **Pro Monetization Master Book**: Established `PRO_FEATURES_MONETIZATION.md` to track B2C/B2B/B2G revenue strategies and weekly priority logs.
- **Intellectual Intelligence Molecules**: Created `Metric.Predictive.Scoring` (Purple Tint) and `Metric.Local.Preference` (Green Tint) as primary high-value "Pro" components.
- **Accountability Dashboard Convergence**: Refactored `app/(tabs)/watchlist.tsx` to always render the Pro Insight Dashboard regardless of individual watchlist state.
- **Severed Style Extension**: Extended the design system to support "Intelligence" (Purple) and "Local/Community" (Green) domain-specific styles.
- **Vertical Rhythm Synchronization**: Standardized all component headers (`metricTitle`, `snapTitle`) to a uniform 7px bottom margin to ensure a consistent lead-in to data fields.

### Signal Ripple™ Branding & Auth Convergence (Previous)

## ✅ Completed Session Milestones (Jan 25, 2026 - Morning)

### Standardized Layout & Gutter System

- **Gutter Modernization**: Replaced element-level margins with a **Container-Managed Gutter** (12px) in `polisnap-renderer.tsx`. This ensures identical spacing between any two elements regardless of their index or type.
- **Zero-Margin Sweep**: Performed an exhaustive sweep across 15+ visual molecules (Charts, Steppers, Gauges, Tables, and Briefs) to strip legacy hardcoded margins, resulting in a cleaner, more predictable layout engine.
- **Managed Content Sequence**: Unified the vertical flow of Snaps. The renderer now treats Titles, Metadata, Summaries, and Vertical Blocks as a single logical sequence with consistent 12px offsets.

### Performance & Flicker Mitigation

- **Stable Representative View**: Refactored `app/representative.tsx` into a stable 3-slot rendering architecture (Header Slot -> Control Slot -> Content Slot).
- **Navigation Optimization**: Fixed the "Representative Flicker" by resolving routes directly in the `DrawerContent` and using `router.replace` for internal representative switches.
- **Persistent Header State**: The Representative view now maintains its header and tab structure during data transitions, providing a "Native App" feel even during deep-content reloads.

### Signal Ripple™ Convergence

- **Precision Alignment**: Refined the `Sentiment.Pulse` layout to lock the title to a precise 2px gap from the Signal Ripple logo.
- **Quantum Feedback Integration**: Verified the visual consistency of the monochromatic discrete sentiment selection across all Accountability snaps.

## ✅ Completed Session Milestones (Jan 24, 2026)

### Brand Identity & UI Convergence (Session Highlight)

- **System-wide Branding**: Established a comprehensive `BRANDING.md` defining the PoliTickIt visual language, TMs, and design philosophy.
- **Typography Unification**: Standardized project-wide "Entity Titles" to `size: md` and `weight: medium` (500) to ensure the representative's name, snap headers, and metric card titles share exactly the same visual hierarchy.
- **Atomic Consolidation**: Refactored the Metric domain into a single `Metric.Group` component. This unified element now handles "Triple Columns," "Dual Comparisons," and "Economic highlights" through a centralized normalization layer, ensuring zero style drift across Financial, Economic, and Political snaps.
- **Economic UI Implementation**: Fully implemented missing UI layouts for high-density economic snaps (Consumer Confidence, National Debt, Retail Spending).

### Navigation & Routing Unity

- **Achievement**: Unified the Side Drawer and Feed Header navigation into a single intelligent route (`/representative`).
- **Persistence**: Implemented `AsyncStorage` to track and restore the `lastViewedRepresentativeId` across app restarts.
- **Fallbacks**: Intelligent redirection logic (Last Viewed → First Followed → First Visible).

### Design System Standardization

- **Pillboxes/Tags**: Standardized metadata tags with a low-profile outlined design (`borderWidth: 1`, `borderRadius: 8`, color: `#4A5568`). Updated with 4px top padding for vertical optical balance.
- **Branding**: Integrated the new `favicon.svg` and `politickit-text.svg` assets across the platform configuration and UI.
- **Signal Ripple™ Refinement**: Transitioned to the "Signal Ripple" feedback model with Quantum Sentiment (monochromatic discrete selection).
- **Pixel-Perfect Stabilization**: Unified horizontal alignment rules (16px padded internal dividers vs 4px full-width card breaks) and vertical element stack ordering logic.

### User Identity & Onboarding

- **Feature**: Implemented a comprehensive multi-step onboarding workflow.
- **Workflow**:
  1.  Login (Email/Password).
  2.  Signup (Personal Info, Zip Code District identification, Policy Interests, Party Affiliation).
  3.  Review & Confirmation.
- **Validation**: Enforced strict entry requirements on the "Let's get started" page and improved accessibility with password visibility toggles.

### [UI Layer] Personalized Accountability Dashboard

- **Status**: [COMPLETED - UI LAYER]
- **Requirement**: A unified view for Pro users to track their "Watchlist" of bills and reps.
- **Outcome**: Implemented the "Insight Dashboard" at the top of the Watchlist screen. Created `Metric.Predictive.Scoring` and `Metric.Local.Preference` molecules. Integrated ML-driven passage odds and district-specific impact data into mocking layer.

### [UI Layer] Representation ROI Audit (Accountability Scorecard)

- **Status**: [COMPLETED - UI/UX HARDENING]
- **Requirement**: High-fidelity constituent grade based on Alignment, Corruption, and Pulse.
- **Outcome**:
  - Implementation of the `AccountabilityScorecardMolecule` with scaled-down 34px grade badges and solid fill inversion.
  - Refactoring of "Alignment/Conflict" into a reusable `Data.List.Columnar` molecule.
  - Establishment of the "Audit" tab isolation logic in the Representative Profile.
  - Fine-tuned 110% line-height vertical rhythm for high-density labels.

---

## 🏗️ Active Epics & Product Goal

### [EPIC] PoliSnap Content Mastery (MVP Scope)

- **Goal**: Round off the "PoliSnap" experience from a user perspective by defining and hardening the UI for all primary Federal content domains (Congressional Record, FEC, Legislative Dockets).
- **Strategy**: Define the MVP line at the UI/UX level first to stabilize the technical requirements for the Application and Data tiers.

### [EPIC] Telemetry Persistence & Real-time Aggregation (TABLED / ON DECK)

- **Goal**: Technical plumbing for sentiment storage and ROI recalculation.
- **Status**: Tabled until MVP Content Scope is finalized in the UI.

---

## 📈 Planning Matrix

| Feature                   | Stakeholder Priority | PO Complexity | Architect Complexity |
| :------------------------ | :------------------: | :-----------: | :------------------: |
| **MVP Content Hardening** |      ⭐⭐⭐⭐⭐      |    Medium     |        Medium        |
| **Telemetry Persistence** |       ⭐⭐⭐⭐       |    Medium     |        Medium        |
| **Dynamic Registry**      |       ⭐⭐⭐⭐       |    Medium     |         High         |
| **AI Narrative Pipeline** |        ⭐⭐⭐        |    Medium     |        Medium        |

---

## 🔧 Infrastructure Readiness

- **Awilix DI**: Ready to host new `NotificationService` and `AIClient`.
- **Vertical Block System**: Flexible enough to host new interactive elements with zero refactoring of core layout logic.
- **Dynamic Element Blueprint**: Architecture defined for backend-driven UI aliases and failsafes.

---

## 📅 Next Session: MVP Content Strategy & Catalog Hardening

Following the successful hardening of the **Accountability Scorecard UI**, we are shifting focus up-stream to the **MVP Content Strategy** to define the final feature set for launch.

### PoliSnap Content Refinement (Product Layer)

- **Domain Cataloging**: Finalize the UI requirements for "Daily Federal Cycles" (Congressional Record, Vote Summaries, Committee Dockets).
- **Interactive Consistency**: Ensure all new content domains leverage the "Pulse" participation features.
- **MVP Scope Definition**: Use the new [MVP_PRODUCT_SCOPE.md](documentation/MVP_PRODUCT_SCOPE.md) as the source of truth for daily priorities.

### UI/UX Implementation (UI Layer)

- **Scenario Mocking**: Update the `snapLibrary.ts` to reflect the full breadth of the MVP Content domains.
- **Molecule Polish**: Hardening any missing elements identified during the content audit (e.g., Attendance Grids, Achievement Lists).
- **Payload Validation**: Ensure the UI renders correctly from hardcoded mock responses before backend logic is written.

### Intelligence Orchestration (Application Tier)

- **Service Decoupling**: Ensure all logic, analysis, and AI synthesis remain in the Application Tier (API layer).
- **AI Synthesis Coordinator**: Plan the backend logic that transforms raw data into the JSON blocks discovered in the UI phase.
- **Stateless UI**: Strictly enforce the rule that the UI performs zero business logic or synthesis.
