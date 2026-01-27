# PoliTickIt: AI Technical Specification & Implementation Context

**Version:** 1.0 (January 2026)  
**Objective:** provide a comprehensive architectural and design context for AI-driven development. Use this document to maintain consistency across all feature implementations, drill-down pages, and API integrations.

---

## 🏗️ 1. Architecture: Vertical Block Architecture

The core of the PoliTickIt interface is the **PoliSnap**. The UI is not hardcoded but **metadata-driven**.

### Component Hierarchy:

- **Atoms (Intrinsics)**: Basic UI primitives (`Text`, `Image`, `Button`). These are used _inside_ elements but are rarely referenced directly in metadata.
- **Elements (Molecules)**: Cohesive functional blocks with a single responsibility (e.g., `Identity.Rep.Brief`, `Metric.Dual.Comparison`). This is the primary unit of the API contract.
  - **Zero-Margin Policy**: Molecules must have NO outer margins. Vertical spacing is managed exclusively by the parent renderer.
- **PoliSnaps (Organisms)**: A vertical assembly of multiple Elements.

### Core Framework:

- **Rendering Engine**: `PoliSnapCollection` accepts an array of `PoliSnap` objects.
- **Dynamic Elements**: Each Snap consists of `elements` rendered by the `ComponentFactory` and `ElementFactory`.
- **Managed Vertical Flow**: The `PoliSnapItem` renderer implements a **Container-Managed Gutter** (12px) for every element in the vertical block, ensuring absolute spacing consistency.
- **PoliSnap Header Ordering**:
  - If a **Representative Header** exists: `Rep Header` -> `Type Pillbox` -> `Snap Title`.
  - If NO Representative exists: `Snap Title` -> `Type Pillbox`.
- **Component Registry**: Elements must self-register with `ComponentFactory` using the `Domain.Template.Variant` naming convention.
- **Interactive Syncing**: Elements within a Snap can share state (e.g., a `MultiToggle` controlling the visibility of a `data-table`).

**Golden Rule for implementation**: Elements must never be a single intrinsic type (no standalone textboxes). They must be cohesive functional sets that maximize reuse across different Snaps.

---

## 🎨 2. Design System & Global Styles

We enforce a high-density, professional visual language.

### Theme Constants (`constants/theme.ts`):

- **Colors**: Use `Colors.light.primary` (#164570 Deep Navy) for branding. Use `Colors.light.textSlate` (#4A5568) for narrative summary text.
- **Spacing**: Follow the 4px grid. We standardise vertical element spacing at 12px.
- **Separators**:
  - **PoliSnap Separator**: Full-width 4px border using `Colors.light.border` (#E2E8F0).
  - **Internal Dividers**: 1px thickness with 16px horizontal padding to align with narrative text.
- **Typography Standards**:
  - **Molecule Titles**: Use `GlobalStyles.metricTitle` (14px, Medium/500). Default is **centered**.
  - **FEC Titles**: Must override to **left-aligned** for financial density.
  - **Narrative Text**: 14px (Base) font size with **22px line-height** to ensure maximum readability in dense political context blocks.
  - **Branding Precision**: Signal Ripple™ Pulse titles must maintain a precise 2px gap from the pulse logo.
  - **Theming**: Use `ThemedText` for all visible content to ensure font-family and dynamic color support.

### Global UI Patterns:

- **Pillboxes**: Metadata tags (e.g., `tagPill`) use 4px top padding and 3px bottom padding for vertical balance.
- **Standard Header**: Hamburger (left), Section Title (left-aligned text), Search & Ellipsis icons (right).
- **Filter Bar**: A consistent row directly under the header.
  - _Standard_: Filter Icon (`options-outline`) triggers a `DualTabBottomSheet`.
  - _Advanced_: Includes a `MultiToggle` for switching high-level views (e.g., "Focus" vs "Trending").
- **Bottom Sheets**:
  - **Overlay**: Must use a subtle gray background (`Colors.light.overlay` / `Colors.dark.overlay`) to provide visual separation while maintaining dark mode support.
  - **Border**: Enforce a 1px border on the bottom sheet container using `Colors.light.border` and a 1px divider below the tab bar using `Colors.light.primary`.
  - **State**: MUTUALLY EXCLUSIVE toggle states between tabs (e.g., "Following" on Reps tab does not affect Policy Area tab).
  - **Stability**: Content areas should have a fixed height (e.g., 475px) to prevent layout shifts or "jumping" when switching tabs.
  - **Grid Density**: Multi-row grids (like Policy Areas) must use `rowGap: 8` and `columnGap: 8` with 12px font size for items.

### Naming Conventions:

- **No Suffixes**: Never include counts or brackets after entity names in lists or filters (e.g., "Healthcare", NOT "Healthcare (12)"). Use a separate pill/badge component if counts are required.
- **Title Alignment**: Drawer menu items and headers must be left-aligned with a fixed icon container width (32px).

---

## ⚡ 3. Interaction Architecture: Signal Ripple™

The engagement model uses the **Signal Ripple** ecosystem, powered by **Quantum Feedback™**.

### Design Principles:

1. **Discrete Sentiment**: Avoid sliders or free-text for primary feedback. Use the `SentimentQuantumPicker` for high-signal 3-state or 4-state selection.
2. **Haptic Loops**: Every selection must trigger a subtle haptic response to confirm the "Quantum state" has been captured.
3. **Monochromatic Scales**: Use monochromatic blue/gray scales rather than traditional Red/Green to maintain professional neutrality and reduce visual heat.
4. **Contextual Pulses**: Every Snap should include an `Interaction.Sentiment.Pulse` at the bottom (Engagement Zone) to link sentiment directly to the insight.

---

## 📊 4. Data Strategy: "Mock First, API Ready"

We prioritize rapid UI iteration by leveraging a **Service/Repository Pattern**.

### Contracts:

- All data must flow through **Repositories** (e.g., `poliSnapRepository`).
- Repositories are registered in the DI **Container** (`services/container.js`).
- Screens shouldn't fetch data directly; they should use repository methods like `getSnapsByCategory`.

### Mock Data (`constants/mockData.ts`):

- Mock data should perfectly mirror the expected JSON payload from the future production API.
- **Benefit**: Once the UI is complete, switching to a live backend only requires swapping the repository implementation, not changing the screen logic.

---

## 🔄 5. Synchronized Global State

- **ActivityContext**: Centrally manages pillbox counts for the Navigation Drawer.
- **DrawerContext**: Manages global navigation visibility.
- **ServiceContext**: Provides access to repositories throughout the tree.

---

## 🛠️ 5. Implementation Checklist for New Sections

When implementing a new feature or drill-down page, ensure:

1. [ ] **Screen Structure**: Uses `GlobalStyles.screenContainer` and `PoliTickItHeader`.
2. [ ] **Data Source**: Define the new data in `mockData.ts` and add a repository method.
3. [ ] **Elements**: Check if element types exist in `ComponentFactory`. If not, create a reusable component first.
4. [ ] **Interaction**: Ensure all chevrons and buttons follow the standardized navigation intent (e.g., right-aligned in Drawer, 20px padding at bottom of sheets).
5. [ ] **Density Check**: Is the vertical rhythm too loose? Reduce margins by 4-8px if needed.

---

_This document is intended to be appended to the system prompt of any AI assistant working on the PoliTickIt codebase._
