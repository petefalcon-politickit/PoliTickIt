# Dynamic Element Architecture (Backend-Driven UI Expansion)

This document outlines a prospective architecture for decoupling the UI element lifecycle from the mobile application's release cycle. This system enables on-the-fly registration, canary deployments, and failsafe rendering for "Pro" tier features.

## 1. Core Concepts

### Backend-Driven Element Registration

Currently, elements must be hardcoded and registered in `ComponentFactory`. The new approach allows the backend to send a "Registry Supplement" payload containing definitions for new elements or overrides for existing ones.

### Failsafe Component Rendering

When the UI layer encounters an element type it doesn't recognize (e.g., a new "Predictive.Market.Impact" element), it should not crash. Instead, it utilizes a "Shadow Registry" to provide a generalized high-density visualization based on the data schema.

### Canary & Cohort Targeting

Leveraging user metadata (Groups/Cohorts), the backend orchestrates the visibility of experimental or "Dark Deployed" elements. This allows "Pro" users to see advanced models before they are globally released.

---

## 2. Technical Analysis

### Application Tier (Backend/API)

To support this model, the API must evolve from delivering pure data to delivering "Layout Instructions" and "Schema Definitions":

- **Metadata Enrichment**: The `PoliSnap` payload should include an optional `registry_hints` array specifying the expected molecule structure for unknown types.
- **Cohort Management**: A new `CohortService` maps users to feature flags.
- **Dynamic Configuration Endpoint**: A `/config/ui-registry` endpoint returns a mapping of `ElementType` -> `TemplateDefinition`.

### UI Tier (Mobile App)

The React Native application needs a more sophisticated `ComponentFactory`:

- **Hybrid Registry**: Maintains a "Hardcoded Core" and a "Dynamic Overlay." The overlay is populated during the app's hydration phase.
- **Dynamic Module Loading (Future)**: Support for `Lazy` or `Suspense` based loading of complex modules from a remote bundle.
- **Schema-Based Visualization (Generic Molecule)**: A `Generic.Data.Presenter` that uses reflection to render unknown data as a standard grid or list based on property types (e.g., string = text, number = metric).

---

## 3. Results & Implementation Plan

### High-Level Plan

1.  **Phase 1: The Failsafe Barrier**
    - Update `ComponentFactory.render()` to return a `Metric.Group` or `Data.Table` as a fallback instead of a raw string.
    - Implement a "Missing Element" telemetry ping to notify the dev team of unregistered usage.

2.  **Phase 2: Remote Supplementation**
    - Implement the `UIConfigProvider` to fetch remote registry mappings on startup.
    - Add logic to `ComponentFactory` to alias unknown types to existing molecules (e.g., Map `Financial.PAC.DeepDive` to generic `Data.Grid.Grouped`).

3.  **Phase 3: Canary Orchestrator**
    - Integrate a feature flagging library (or custom internal service).
    - Update `PoliSnapRenderer` to filter elements based on user cohort flags extracted from the JWT or Global Context.

4.  **Phase 4: Dark Deployment Notifications**
    - Create a "Pro Discovery" service that detects when a new dynamic registration is active.
    - Notify the user via a subtle "Pulse" animation or "New Capability" badge on the element header.

### Key Considerations & Decision Points

- **Performance vs. Flexibility**: Dynamic aliasing is cheap; remote code loading (OTAs) is complex and potentially violates store policies if not handled carefully. Recommendation: Stick to **Metadata Aliasing** (mapping new types to existing generic components).
- **Versioning**: How do we handle breaking changes in the data schema for a dynamic element? Need a `min_app_version` check in the registry hints.

---

## 4. Backlog Integration

**PBI Item**: `[UI Architecture] Implementation of Dynamic Element Registry & Cohort Failsafes`

- **Goal**: Transition from static code-based registration to a hybrid model that supports backend-driven aliasing.
- **Acceptance Criteria**:
  - Unknown element types render a "Generic Metric Block" fallback.
  - Remote config can map a new element identifier to an existing component.
  - Elements can be hidden/shown based on user cohort metadata.
