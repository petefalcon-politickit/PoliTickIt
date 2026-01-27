# PoliTickIt Architecture: Vertical Block System

This document outlines the design patterns and architectural decisions for the PoliTickIt mobile application.

## Overview

The application uses a **Vertical Block Architecture** for rendering dynamic content known as "PoliSnaps". This system allows the backend (or repository layer) to drive the UI layout through metadata, rather than hardcoding specific screens for every data type.

## Key Concepts

### 1. PoliSnap

A **PoliSnap** is a high-level container for a specific political insight or data set.

- **Spec-Driven**: Defined by a JSON object containing a `title`, `type`, and an array of `elements`.
- **Stateless**: Snaps describe _what_ to show; the layout engine handles _how_ to show it.
- **Visual Hierarchy**:
  - **Inverted Field Priority**: Main dashboard grids use a **Slate 50 (#F8FAFC)** background, while individual `snapCard` containers use a solid **White (#FFFFFF)** background. Individual elements within a snap use **Severed Backgrounds** (2% to 8% tints) to establish structural depth.
  - **Primary Breaks**: Full-width 4px `snapCard` borders separate individual Snaps using the `flatSeparator` style.
  - **Managed Vertical Flow**: Every element is wrapped in an `elementGutter` (12px) handled by the `PoliSnapItem` renderer.
  - **Metadata Toning**: The PoliSnap Type pill is muted using **Slate 500 (#64748B)** borders and text (`textTertiary`) to ensure the Title remains the primary focus.
  - **High-Density Typography**: The snap title is governed by a **Severed Style (snapTitle)** which utilizes a **Left Alignment** and reduced letter-spacing (**0.5**) to increase visual density and authority compared to subordinate metrics.
  - **Element Stack Order**: The renderer enforces a consistent hierarchy: `[Rep Header]` -> `[PoliSnap Type Pill]` -> `[Snap Title]`. If the Representative header is omitted or hidden, the Type Pill shifts to the top with reduced margins.

### 2. Elements (Molecules)

Elements are cohesive, reusable UI blocks registered in a central factory.

- **Zero-Margin Policy**: Individual molecules MUST have zero outer margins (`marginTop`, `marginBottom`, `marginVertical`). Vertical sequence is managed exclusively by the container gutter.
- **Image Performance**: Uses `expo-image` for high-performance rendering, disk caching, and smooth transitions (blurhash-ready).
- **Typography Standards**: Strict adherence to the **Severed Title** patterns. Components share a 13pt/Bold baseline, and most follow the **Centered Blueprint** for titles to maintain a symmetric visual rhythm across the vertical stack.
- **Signal Ripple™ Alignment**: Title alignment for interactive pulses is locked to a precise 2px gap from the Pulse Logo to ensure brand consistency.
- **Onboarding Branding**: Authentication and Onboarding screens utilize the high-fidelity `AuthBackground` (4 parallel red stripes, 10% offset, 60% coverage) and `AuthCard` (22px border radius) to establish the brand identity immediately upon first launch.
- **Element Stack Order**: The renderer enforces a logical sequence: `[Header]` -> `[Metadata Pill]` -> `[Title]` -> `[Content]`. The Title moves above the Metadata Pill only if no Representative header is present.
- **Theming Strategy**: Built using `ThemedText` to bridge React Native's base components with the application's design tokens.
- **Registered Types**: Every element has a type string (e.g., `Visual.Chart.Bar`, `Identity.Rep.Brief`).
- **Isolation**: Each molecule is responsible for its own internal layout, styling, and data handling.
- **Factory Pattern**: The `ComponentFactory` and `ElementFactory` handle the routing of data specs to React components.

### 3. Style Isolation (The Severing)

To maintain absolute independence between different component categories, the application uses **Severed Styles**. Instead of a generic `cardStyle` or `titleStyle`, every major component category relies on its own dedicated style object in `theme.ts`.

- **Atomic Design Consistency**: Changing the alignment of a `Metric.Group` title will not affect the alignment of a `Data.Table` title.
- **Background Orchestration**: Different categories can use specific tints (e.g., 2% Gray for Grouped Grids, 5% Gray for Metric Groups, Slate 50 for Data Tables) to create a subtle visual rhythm without code duplication.
- **Molecular Registration**: Components are registered in the `ComponentFactory` with their associated severed styles injected as props or consumed directly from `GlobalStyles`.

### 4. Interactive Discovery & Telemetry (Pro)

The application introduces a high-fidelity interaction layer designed for "Pro" tier features, focusing on constituent sentiment and direct accountability.

- **Engagement Zone Pattern**: Interactive elements (Sliders, Action Cards) utilize a distinct visual framework:
  - **Separator**: A 1px top border with consistent 16px horizontal offsets.
  - **Bleed Layout**: Negative horizontal margins apply a slight visual "bleed" to the background field, creating a focused interaction zone.
  - **High-Density Padding**: 32px inner horizontal padding ensures touch safety and accommodates complex UI headers (e.g., Pulse logos).
- **Quantum Feedback Model**: Unlike binary "Like/Dislike" systems, PoliTickIt uses a monochromatic spectrum slider (`Interaction.Sentiment.Slider`) to capture nuanced constituent sentiment.
- **Bilateral Scale (10—0—10)**: Interactions use a 21-point bilateral scale. While UI labels are often hidden for a cleaner feel, the logic calculates values from -10 (Oppose) to +10 (Support) with a neutral 0 center.
- **Haptic Tactile Signature**: The interface uses `expo-haptics` (via a centralized `HapticService`) to provide physical confirmation of interactions.
  - **Democratic Wins (Success)**: A crisp, positive triple-pulse triggered during successful participation, consensus achievements, or intelligence tier unlocks.
  - **Accountability Warnings (Alerts)**: A distinct double-pulse warning for corruption alerts or negative data trends.
  - **Mechanical Impact**: Light to Medium impacts triggered at interaction thresholds or standard navigation to establish "Mechanical Density."
- **Telemetry & Persistence Architecture**: Interactive components are "State-Aware but Stateless Providers."
  - They maintain local UI state for fluid animations via Reanimated 3.
  - **Local Persistence**: Sentiment values are persisted across sessions via `AsyncStorage` through a dedicated `SentimentRepository`. This ensures that a constituent's "Oppose/Support" position on a specific Snap is restored immediately upon app refresh.
  - **Restorative Mounting**: Molecules use `useEffect` hooks to query the repository for previously saved states keyed by `snapId` and `elementId`.
  - **Watchlist Persistence**: The `WatchlistService` manages a persistent collection of "Bookmarked" Snap IDs using `AsyncStorage`. The `PoliSnapItem` renderer provides a global bookmark toggle in the footer, allowing users to build a personalized dashboard of high-priority insights.
  - **Telemetry Pipeline**: Values are normalized to a $0.0-1.0$ float range (where 0.5 is neutral) for API transmission.
  - Final values are dispatched via a standardized `onTelemetryUpdate` contract, which the `PoliSnapRenderer` routes to the appropriate tracking service.
- **Actionable Surfaces**: `Interaction.Action.Card` molecules provide direct pathways for user agency, such as adding policies to a "Watchlist" or initiating contact with a representative.
  - **Success Transitions**: Upon interaction, cards transition to a "Confirmed" state with scale-pop animations and checkmark UI to provide definitive closure for user actions.

### 4b. Institutional & B2B Consensus Ripple™

Designed for high-impact advocacy and institutional strategy, the B2B layer introduces **Aggregate Sentiment Pooling**.

- **Molecular Aggregation**: `Data.Consensus.Ripple` molecules bypass individual sentiment to show merged district intent.
- **Constituent Capital**: A new strategic metric representing the weighted "Volume" of verified resident engagement.
- **Predictive Deep-Linking**: Tier 4 components (Predictive Forecasting) include "Knowledge Pillar" hooks, allowing users to cross-reference AI methodologies directly from the insight block.

### 5. Visual Domain & Charting Standards

PoliTickIt utilizes a unified visualization system to ensure that complex data is digestible and stylistically consistent across different snap types.

- **Unified Container**: All charts (`Bar`, `Line`, `StackedTrend`) share a common background field, 1px border, and 12px padding.
- **Dynamic Legend Logic**: Legends are driven by pipes-separated strings (e.g., `"Primary:Support | Accent:Oppose"`) which the renderer automatically maps to brand colors.
- **Information Density**: Charts include a standardized header with a `help-circle` icon, providing contextual tooltips or documentation paths.

### 6. Registry Governance

- **Location**: `components/polisnap-elements/`
- **Entry Point**: `components/polisnap-elements/index.ts`
  All new visual components must be registered with `ComponentFactory.register(type, Component)` to be usable in a PoliSnap.

## 7. Intelligent Filtering & Tab Isolation

To support specialized domains like **Accountability Audits**, the application implements "Semantic Tab Isolation":

- **Segmented Views**: The Representative Profile utilizes a dynamic tab system (`Activity`, `Audit`, `Voting`, etc.).
- **Strict Filters**: High-fidelity scorecards and financial correlation snaps are restricted to the `Audit` tab via the `isAuditRelated` predicate, preventing high-density data from cluttering the primary narrative feed.

## Service Tier & Dependency Injection

The application uses **Awilix** for dependency injection, ensuring that services like data normalizers and repositories are easily swapped or mocked.

- **Injection Mode**: Uses `InjectionMode.PROXY`. This is critical for React Native compatibility to avoid issues with parameter name minification.
- **Container**: The central container is defined in `services/container.ts`.
- **Key Services**:
  - `FECVoteNormalizer`: Handles the complex correlation of campaign finance data with legislative voting records.
  - `poliSnapRepository`: The primary data access point for all PoliSnap content.

## Rendering Flow

1. **Repository**: Returns a `PoliSnap` object.
2. **PoliSnapRenderer**: Receives the object and iterates over the `elements` array.
3. **ElementFactory**: Resolves the `type` of each element and retrieves the corresponding React component from the registry.
4. **Layout**: Elements are rendered vertically in the order they appear in the array.

## Benefits

- **Agility**: New layouts can be created by simply rearranging the JSON elements in the `snapLibrary.ts`.
- **Consistency**: Standardized headers, charts, and tables ensure a unified design system.
- **Predictability**: Complex UI is decomposed into small, testable molecules.

## 8. The Participation Economy & Status Orchestration

The application utilizes a **Meritocratic Intelligence Model** where high-value features are unlocked through user engagement.

- **Local-First Credit Ledger**: Participation Credits are persisted exclusively on the user's device via `AsyncStorage`. This ensures zero-latency unlocks, mechanical reliability during offline use, and constituent privacy by decapitating the dependency on a central user credit database.
- **Participation Capital (Credits)**: A persistent value managed via the `ActivityContext` that tracks user contributions (Sentiment, Watchlist, Sharing).
- **ParticipationStatusModal**: A global status orchestrator triggered from the primary application header. It serves as a marketing and educational surface for the "Intelligence Roadmap."
- **Feature Gating (The Lockbox Pattern)**: High-value components (Tier 2-4) utilize the `FeatureGate` component. This component provides a visual "blur" and lock overlay, effectively communicating value while preventing data access for users with insufficient "Participation Capital."
- **Conditional Visibility**: The header's "Impact" button is context-aware, automatically hiding itself (via the `hideImpact` prop) when the user is already on the main `Participation` dashboard to prevent navigation loops.
- **Drawer Hierarchy**: In Android-first navigation, the **Participation Capital** dashboard is positioned as the final item in the **Settings** section, emphasizing its role as a configuration and progression hub.
- **Roadmap Tiering**:
  - _Tier 1 (Standard)_: Live legislative tracking.
  - _Tier 2 (Intelligence)_: FEC Donor correlation maps.
  - _Tier 3 (ROI Auditor)_: Full Accountability Scorecards.
  - _Tier 4 (Predictive)_: AI Legislative Forecasting.
