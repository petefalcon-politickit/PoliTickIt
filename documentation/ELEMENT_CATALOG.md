# PoliSnap Element Catalog

This catalog documents the available molecules that can be used to construct PoliSnaps.

## Layout Standard (Critical)

Every element listed below must adhere to the **Zero-Margin Policy**. To ensure consistent vertical spacing within the `PoliSnapItem` renderer, all molecules must have `marginTop: 0` and `marginBottom: 0` on their outermost container. 

### Feed Gutter (The Institutional Track)

- **Purpose**: Managing the visual space and interstitial content (Slugs) between PoliSnaps.
- **Visuals**: Solid Slate background (`#F1F5F9`) or custom backgrounds for branded slugs.
- **Mechanism**: The `FeedGutter` is interleaved as a distinct cell type in the feed, ensuring a mechanical, rhythmic grid.
- **File**: `components/ui/feed-gutter.tsx`

### Participation Slug (Intellectual Capital)

- **Purpose**: Encouraging civic engagement through rhythmic interstitials.
- **Visuals**: Card-based (White), `minHeight: 48`, dashed border, using Regular (400) weight text.
- **Mechanism**: Rendered via `SlugFactory` within a `FeedGutter`.
- **File**: `components/ui/participation-slug.tsx`

### `Auth.Background` (Global Branding)

- **Purpose**: The foundational "Signal Ripple™" field for all authentication and high-level onboarding screens.
- **Visuals**: Solid navy background with four parallel red stripes (Flag Wave) starting at 10% from the top.
- **File**: `components/ui/auth-background.tsx`

### `Auth.Card` (Global Branding)

- **Purpose**: The primary content container for authentication forms and interactive onboarding.
- **Visuals**: 22px border radius, white field, optional corner star badge.
- **File**: `components/ui/auth-card.tsx`

## The Severed Style Architecture

To allow for surgical micro-tuning of every component in the design system, PoliTickIt uses a "Severed Style" architecture. This replaces the generic `card` pattern with dedicated style keys in `theme.ts` for every element category.

| Element Type                   | Style Key                    | Background         | Title Alignment | Primary Capability                                            |
| :----------------------------- | :--------------------------- | :----------------- | :-------------- | :------------------------------------------------------------ |
| **`Metric.Group`**             | `metricGroupContainer`       | 5% Gray (#F2F2F2)  | Centered        | Adaptive 1, 2, or 3 column metric layouts.                    |
| **`Metric.Dual.Comparison`**   | `dualComparisonContainer`    | 5% Gray (#F2F2F2)  | Centered        | High-contrast comparison between two distinct entities.       |
| **`Metric.Alignment.Gauge`**   | `gaugeContainer`             | White (#FFFFFF)    | Centered        | Spectrum visualization (e.g., District vs Party line).        |
| **`Metric.Progress.Stepper`**  | `stepperContainer`           | White (#FFFFFF)    | Centered        | Legislative path tracking with stage-based progress.          |
| **`Metric.Status.Grid`**       | `statusGridContainer`        | White (#FFFFFF)    | Centered        | Dense grid of status indicators or mini-metrics.              |
| **`Data.Grid.Grouped`**        | `groupedGridContainer`       | 2% Gray (#FAFAFA)  | Centered        | Financial aggregate followed by nested PAC/Contributor lists. |
| **`Data.Correlation.Heatmap`** | `fecHeatmapContainer`        | SurfaceSecondary   | Left            | Gated Intelligence visualization of Donor/Vote correlation.   |
| **`Data.Table.Expandable`**    | `dataTableContainer`         | Slate 50 (#F8FAFC) | Centered        | Dense multi-column tables with nested bullet expansion.       |
| **`Visual.Chart.*`**           | `visualContainer`            | 8% Blue Tint       | Centered        | Graphical trend analysis and sentiment velocity.              |
| **`Interaction.*`**            | `interactionContainer`       | Accent Tint (2%)   | Centered        | Tactile feedback capture (Sliders, Pulses, Actions).          |
| **`Metric.Predictive.*`**      | `predictiveScoringContainer` | Purple Tint (5%)   | Centered        | ML-driven passage odds and legislative forecasting.           |
| **`Metric.Local.*`**           | `localPreferenceContainer`   | Green Tint (5%)    | Centered        | District-specific metrics and local impact data.              |
| **`Narrative.Insight`**        | `narrativeContainer`         | Transparent        | N/A             | Expandable narrative analysis with semantic accent bars.      |
| **`PoliSnap` (Shell)**         | `snapCard`                   | White (#FFFFFF)    | N/A             | The top-level container for all assembly elements.            |
| **`PoliSnap Title`**           | `snapTitle`                  | N/A                | Left            | High-density semantic header for the PoliSnap.                |

## Identity Domain

Components used to identify political figures or entities.

### `Header.Representative`

- **Purpose**: A high-fidelity card for political figures showing name, position, party, and state.
- **Style Key**: `identityHeaderContainer` (White)
- **Features**: Automatic name cleaning (removes "Sen./Rep." and " (CA)"), party color badges.
- **File**: `components/polisnap-elements/identity/headers.tsx`

### `Header.Profile`

- **Purpose**: Header for user or contributor profiles.
- **Style Key**: `identityHeaderContainer`
- **File**: `components/polisnap-elements/identity/headers.tsx`

### `Identity.Rep.Brief`

- **Purpose**: Displays representative name, photo, party, and a short bio. Used in lists and summaries.
- **Style Key**: `identityBriefContainer`
- **Fields**: `name`, `state`, `party`, `imgUri`, `status`.
- **File**: `components/polisnap-elements/identity/rep-brief.tsx`

### `Identity.Source.Tag`

- **Purpose**: Minimalist attribution line for citing data sources and validity dates.
- **Style Key**: `sourceTagContainer`
- **Fields**: `source`, `date`, `reliability` (Low/Medium/High).
- **File**: `components/polisnap-elements/identity/source-tag.tsx`

## Metric Domain

Components used for quantitative data, scoring, and forecasting.

### `Metric.Predictive.Forecasting`

- **Purpose**: A high-fidelity "Tier 4 Intelligence" visualization for machine-learning-driven legislative forecasting.
- **Tier**: 4 (Predictive)
- **Features**: Passage probability odds, Sentiment Ripple (Momentum), and help icon deep-linking to the Knowledge Reference Guide.
- **Fields**: `billTitle`, `passageOdds`, `momentum`, `predictionSource`.
- **File**: `components/polisnap-elements/metric/predictive-forecasting.tsx`

## Data Domain

Components used for data-heavy visualizations and institutional aggregations.

### `Data.Consensus.Ripple`

- **Purpose**: A B2B molecular component for visualizing district-level intent aggregation and constituent capital volume.
- **Tier**: Institutional / B2B
- **Features**: Aggregate consensus scoring, verified reporter counts, and capital volume tracking.
- **Fields**: `title`, `consensusScore`, `reporters`, `volume`.
- **File**: `components/polisnap-elements/data/consensus-ripple.tsx`

### `Data.Correlation.Heatmap`

- **Purpose**: A high-fidelity "Intelligence Tier" visualization that correlates FEC donor industry contributions with legislative voting patterns.
- **Tier**: 2 (Intelligence)
- **Features**: Automatic "Lockbox" gating via `FeatureGate`, Industry contribution bars, and alignment scoring.
- **Fields**: `totalInfluence`, `donors` (Array of industry, amount, correlation).
- **File**: `components/polisnap-elements/data/fec-correlation-heatmap.tsx`

### `Interaction.Sentiment.Slider`

- **Purpose**: A high-fidelity "Quantum Feedback" slider for capturing sentiment on a continuous spectrum.
- **Style Key**: `interactionContainer`
- **Features**: 21-point bilateral snapping logic, high-contrast Slate 400 track.
- **Fields**: `title`, `leftLabel`, `rightLabel`, `snapId`.
- **File**: `components/polisnap-elements/interaction/sentiment-slider.tsx`

### `Interaction.Action.Card`

- **Purpose**: A tactile card for "Pulse Pro" features like Watchlisting or Contact.
- **Style Key**: `pulseProContainer` / `snapCard`
- **Design**: Elevated white card background with subtle shadow to promote pressability.
- **Fields**: `label`, `title`, `icon`, `publisherImage`, `actionType`, `actionPayload`.
- **File**: `components/polisnap-elements/interaction/action-card.tsx`

### `Interaction.Sentiment.Pulse`

- **Purpose**: Discrete sentiment capture (Oppose / Neutral / Support).
- **Style Key**: `interactionContainer`
- **Features**: Optimized layout with asymmetrical button weighting (Neutral is 22% width, Primary actions are 36.5%).
- **File**: `components/polisnap-elements/interaction/sentiment-pulse.tsx`

## Visual Domain (Charts)

Components used for data visualization and trend analysis.

### `Visual.Chart.Bar`

- **Purpose**: Vertical bar charts for comparative data.
- **Style Key**: `visualContainer` (8% Blue Tint)
- **Features**: Dynamic legends, container borders, and multi-color support via brand tokens.
- **File**: `components/polisnap-elements/visual/charts.tsx`

### `Visual.Chart.SentimentTrend`

- **Purpose**: A specialized stacked-bar visualization showing sentiment shifts over legislative stages.
- **Style Key**: `sentimentTrendContainer` (Severed 6% blue tint)
- **File**: `components/polisnap-elements/visual/sentiment-trend.tsx`

## Metric Domain

Components for displaying comparative or specific data points.

### `Metric.Alignment.Gauge`

- **Purpose**: Visualizes a "Spectrum" of behavior (e.g., District vs. Party line).
- **Style Key**: `gaugeContainer`
- **Fields**: `title`, `value` (0-100), `leftLabel`, `rightLabel`, `insight`.
- **File**: `components/polisnap-elements/metric/alignment-gauge.tsx`

### `Metric.Predictive.Scoring`

- **Purpose**: ML-driven passage probabilities and legislative forecasting.
- **Tier**: 4 (Predictive)
- **Style Key**: `predictiveScoringContainer` (Purple Tint)
- **Features**: Visual trend indicators (Up/Down) for passage odds.
- **Fields**: `title`, `items` (id, name, probability, trend, category).
- **File**: `components/polisnap-elements/metric/predictive-scoring.tsx`

### `Metric.Predictive.Forecasting`

- **Purpose**: High-fidelity single-item forecasting for bill passage.
- **Tier**: 4 (Predictive)
- **Style Key**: `predictiveScoringContainer` (Purple Tint)
- **Features**: Sentiment Ripple visualization and momentum tracking.
- **Fields**: `billTitle`, `passageProbability`, `sentimentRipple`, `momentum`, `predictionSource`.
- **File**: `components/polisnap-elements/metric/predictive-forecasting.tsx`

### `Metric.Local.Preference`

- **Purpose**: District-specific metrics and local impact data.
- **Style Key**: `localPreferenceContainer` (Green Tint)
- **Features**: High-density grid of local funding, sentiment, and project metrics.
- **Fields**: `title`, `metrics` (label, value, suffix, subLabel).
- **File**: `components/polisnap-elements/metric/local-preference.tsx`

### `Metric.Progress.Stepper`

- **Purpose**: Tracks multi-stage processes (e.g., Bill -> Committee -> Floor -> Law).
- **Style Key**: `stepperContainer`
- **Fields**: `title`, `stages` (array of `{label}`), `currentStageIndex`.
- **File**: `components/polisnap-elements/metric/progress-stepper.tsx`

### `Metric.Group` (Unified)

- **Purpose**: A universal meta-driven container that automatically adapts its layout (1, 2, or 3 columns).
- **Style Key**: `metricGroupContainer` (5% Gray)
- **Aliases**: `Metric.Column.Triple`, `Metric.Dual.Highlight`, `Metric.Comparison.Horizontal`.
- **File**: `components/polisnap-elements/metric/metric-group.tsx`

### `Metric.Dual.Comparison`

- **Purpose**: Specialized version of the Metric Group for detailed entity-to-entity comparisons.
- **Style Key**: `dualComparisonContainer` (5% Gray, Centered)
- **File**: `components/polisnap-elements/metric/metric-group.tsx` (Logic)

## Narrative Domain

Text-heavy components for providing context and analysis.

### `Narrative.Insight.Summary`

- **Purpose**: An expandable text block with a color-coded accent bar.
- **Style Key**: `narrativeContainer` (Transparent)
- **Features**: "Read More" logic (250char + 30char buffer), Source links.
- **File**: `components/polisnap-elements/narrative/insight-summary.tsx`

## Data Domain

Structured data presentation.

### `Data.Grid.Grouped`

- **Purpose**: Specialized grid layout for showing campaign contributions and PAC details.
- **Style Key**: `groupedGridContainer` (2% Gray)
- **Fields**: `title`, `totalAmount`, `pacs` (Array), `corporateTrace`.
- **File**: `components/polisnap-elements/metric/fec-details.tsx`

### `Data.Correlation.Heatmap`

- **Purpose**: A high-fidelity "Intelligence Tier" visualization that correlates FEC donor industry contributions with legislative voting patterns.
- **Tier**: 2 (Intelligence)
- **Style Key**: `fecHeatmapContainer` (White/Secondary)
- **Features**: Automatic "Lockbox" gating via `FeatureGate`, Industry contribution bars, and alignment scoring.

### `Data.Consensus.Ripple`

- **Purpose**: District-level sentiment aggregate molecule for "Constituent Capital" views.
- **B2B Proof of Concept**: Designed for institutional stakeholders to measure collective district intent.
- **Style Key**: `consensusRippleContainer`
- **Fields**: `district`, `consensusScore`, `respondents`, `capitalVolume`, `trend`.
- **File**: `components/polisnap-elements/data/consensus-ripple.tsx`
- **Fields**: `totalInfluence`, `donors` (Array of industry, amount, correlation).
- **File**: `components/polisnap-elements/data/fec-correlation-heatmap.tsx`

### `Data.Table.Expandable`

- **Purpose**: A table where rows can be expanded to show nested bullet points.
- **Style Key**: `dataTableContainer` (Slate 50)
- **Fields**: `headers`, `data` (rows with `details` array).
- **File**: `components/polisnap-elements/data/data-table.tsx`

### `Data.List.Columnar`

- **Purpose**: An adaptive 2 or 3 column bullet list for comparisons or highlights.
- **Style Key**: `metricContainer` (Transparent/White)
- **Fields**: `title`, `columns` (array of `{title, items, defaultIcon, defaultColor}`).
- **File**: `components/polisnap-elements/data/columnar-list.tsx`

## Design Standardization

All elements in this catalog follow the unified **Signal Ripple Design System**:

- **Titles**: All molecular headers use `GlobalStyles.metricTitle` (14px, Medium). Alignment follows the "Severed Style Key" table.
- **Body**: Narrative text uses `base` size (14px) with a `22px` line height and `textSlate` color for maximum readability.
- **Visual Dividers**: Horizontal lines within elements have 16px horizontal padding. The main Snap separator is full-width (4px).
- **Theming**: Strict usage of `ThemedText` and `ThemedView` to ensure font and color consistency across Light and Dark modes.
