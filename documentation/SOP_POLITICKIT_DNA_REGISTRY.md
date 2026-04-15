# 🧬 POLITICKIT DNA REGISTRY (PDS-015)

/**
 * [GENOTYPE]: Omni-OS
 * [SYSTEM]: Vanguard Core
 * [FIDELITY]: High
 * [PURPOSE]: Rapid identification and micro-editing of Politickit-distilled DNA.
 * [STATUS]: Phase 2 Complete - Zero-Shorthand Regime Enforcement (D478)
 * [LATEST]: D478 - Zero-Shorthand Regime Enforcement (2026-02-22)
 */

---

## 🔄 RECENT CHANGES

- **D478** (2026-02-22): Zero-Shorthand Regime Enforcement (Infrastructure)
  - Fixed React rerender warnings by eliminating shorthand/longhand property conflicts
  - ElementPreviewRenderer nullifies shorthand properties after spread
  - AtomRenderers converted all border shorthands to individual properties
  - Applies to all phenotypes including Politickit

- **D477** (2026-02-22): OmniRegime Spacing/Radius Reference Enforcement (Architecture)
  - ThemePlasmidService now references OmniRegime.Spacing and OmniRegime.Radius directly
  - Eliminates hardcoded token duplication
  - Ensures all phenotypes use same spacing/radius scales
  - PoliTickIt inherits complete spacing scale (nano, xs, sm, md, lg, xl, xxl, etc.)

- **D476** (2026-02-26): OmniRegime Framework Hardening (Architecture)
  - All phenotypes now reference OmniRegime as single source of truth
  - VanguardTheme consolidated: removed duplication, references OmniRegime for framework tokens
  - Per-Phenotype Pattern established: OmniRegime → VanguardTheme → Plasmid DNA
  - Spacing, Typography, Radius, Weights, Shadows unified in OmniRegime
  - Phenotype-specific extensions documented and isolated

- **D455** (2026-02-21): Options Registry Migration (Phase 2 - Aggressive)
  - Synchronized with Vanguard Core optionsRef refactor
  - All Politickit-relevant atoms/molecules now use `optionsRef` pattern
  - DNA Inspector resolver updated to handle both Theme and Component registries

---

## 🏗️ CORE INVENTORY

### 🧪 ATOMS (Basic Elements)
| ID | Display Name | Function | Feature Group |
| :--- | :--- | :--- | :--- |
| `badge-001` | Badge | Status Indicator | Identity |
| `bar-001` | Chart Bar | Visual Metric | Analytics |
| `btn-001` | Button | Primary Action | Navigation |
| `currency-001` | Currency | Monetary Display | Fiscal |
| `identity-avatar-001`| Avatar | Entity Image | Identity |
| `inst-ribbon-001` | Ribbon | Level Indicator | Identity |
| `lbl-001` | Label Core | Data Label (Refactored) | Typography |
| `m3-icon-001` | Icon Core | Agnostic Icon Element | Visuals |
| `m3-shape-001` | Geometric Core | Agnostic Shape Element | Structural |
| `m3-text-001` | Text Core | Agnostic Type Element | Typography |
| `marker-001` | Marker | Political Party | Identity |
| `strip-001` | Status Strip | Health/State | Monitoring |
| `tag-001` | Tag | Metadata Label | Categorization |
| `verified-mark-001` | Verified Mark | Trust Badge | Identity |

### 🧬 MOLECULES (Composite DNA)
| ID | Display Name | Function | Feature Group |
| :--- | :--- | :--- | :--- |
| `achievement-list-001`| Milestones List | Progress Tracking | Achievement |
| `action-card-001` | Action Card | CTA Surface | Engagement |
| `allegation-001` | Allegation Card | Ethics Reporting | Accountability |
| `analyst-insight-001` | Analyst Insight | Narrative Commentary | Intelligence |
| `bar-chart-001` | Bar Chart | Distribution Chart | Analytics |
| `corruption-index-001`| Corruption Index | Forensic Audit | Accountability |
| `friction-001` | Universal Gauge | Alignment/Friction | Analytics |
| `gutter-wisdom-001` | Gutter: Wisdom | Forensic insight / Community motto | Cultural |
| `identity-header-001`| Identity Header | Profile Summary | Identity |
| `liquidity-summary-001`| Liquidity Summary | Financial Overview | Fiscal |
| `locus-aggregate-001` | Locus Aggregate | District Overview | Geography |
| `metric-block-001` | Metric Block | Multi-metric Summary | Analytics |
| `metric-grid-001` | Metric Grid | 3x3 Metric Pulse | Analytics |
| `participation-grid-001`| Participation Grid | Attendance Visualization| Analytics |
| `process-stepper-001` | Process Stepper | High-fidelity process timeline | Analytics |
| `range-bar-score-001`| Range Bar Score | Dual-variant friction/drift bar | Analytics |
| `range-score-001` | Forensic Range Score | High-fidelity scoring bar | Analytics |
| `roi-card-001` | ROI Card | Civic Dividend | Fiscal |
| `section-header-001` | Section Header | Layout Grouping | Structural |
| `sentiment-pulse-001` | Sentiment Pulse | Community Reaction | Resonance |
| `sentiment-slider-001`| Sentiment Slider | Input Collection | Resonance |
| `snap-title-001` | Snap Title | Context Branding | Structural |
| `stat-block-001` | Statistic Block | Single Data Point | Analytics |
| `support-velocity-001`| Support Velocity | Forensic Sentiment Tracking | Resonance |
| `trend-line-001` | Trend Sparkline | Historical Trajectory | Analytics |
| `trust-thread-001` | Trust Thread | ZK-Verification | Security |

### 📸 SNAPS (Compositional Layouts)
| ID | Display Name | Function | Ratio/Density |
| :--- | :--- | :--- | :--- |
| `grid-001` | Forensic Grid | 3-Column Aggregate | High Density |
| `timeline-001` | Sentinel Log | Event Flow | Vertical |
| `layout-70-30` | Sovereign Split | Dashboard Layout | 70:30 Split |

---

## 📂 FILE REFERENCE MAP

| Resource Type | File Path | Purpose |
| :--- | :--- | :--- |
| **Definitions** | [VP-001-VANGUARD-CORE.plasmid.json](genotype/modules/theme-plasmids/VP-001-VANGUARD-CORE.plasmid.json) | JSON Metadata & Styles |
| **Renderer** | [ElementPreviewRenderer.tsx](apps/creator/src/app/vanguard/theme-manager/ElementPreviewRenderer.tsx) | React rendering logic |
| **Toolkit** | [DNAEncoderComponents.tsx](apps/creator/src/app/vanguard/theme-manager/DNAEncoderComponents.tsx) | UI Shared Components |
| **Service** | [ThemePlasmidService.ts](apps/services/Vanguard.Api/Services/ThemePlasmidService.ts) | Persistence & Retrieval |

---

## 📜 SOPs: MICRO-EDITING PROTOCOL

1. **Verify ID**: Consult the `🏗️ CORE INVENTORY` before editing to ensure ID match.
2. **Locate Metadata**: Edits to properties (labels, defaults, types) occur in `plasmid.json`.
3. **Locate Visuals**: Edits to layout/rendering occur in `ElementPreviewRenderer.tsx`.
4. **DNA Sync**: Ensure property keys in `plasmid.json` match `props` destructured in `RenderRegistry`.
5. **Zero-Shadow**: Never introduce "bold" or "box-shadow" during micro-edits. Use weights (500) and borders.
6. **Hyper-Atomic Parity**: All Molecules MUST be decomposed into independently configurable Hyper-Atoms. See [OMNI_HYPER_ATOMIC_SOP.md](genotype/operations/OMNI_HYPER_ATOMIC_SOP.md).
