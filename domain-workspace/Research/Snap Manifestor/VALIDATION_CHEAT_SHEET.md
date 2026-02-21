# PoliManifestor™: Validation Cheatsheet

This cheatsheet provides the physical and aesthetic standards required to validate a **PoliFest** (Manifestation). Use these "Call-outs" to ensure every snap adheres to the **Institutional Framework**.

---

## 📐 1. Vertical Rhythm & Spacing

_The "Pulse" of the layout. Inconsistency here breaks the user's focus._

- **Base Unit**: All spacing must be multiples of **4px**.
- **Default Gutter**: 12px (`Spacing.md`) for inner elements.
- **Section Separation**: 16px (`Spacing.lg`) between primary molecules.
- **Vertical Padding**: 8px (`Spacing.sm`) for internal card elements.

---

## 🎨 2. The "Severed" Style Architecture

_Standardized typography and weights for high-density forensic analysis._

- **Weights over Sizes**: Use font weights (`bold`, `heavy`) to create hierarchy instead of excessively large font sizes.
- **Bold Primary Labels**: Titles should use `Typography.weights.bold`.
- **Heavy Metrics**: Numeric values and high-signal metrics must use `Typography.weights.heavy`.
- **Muted Meta-Data**: Secondary info (dates, source labels) uses `textMuted` (Slate 400) and `all-caps` when appropriate.

---

## 🏗️ 3. Alignments & Mechanicals

_Ensuring the "Mechanical" feel of a forensic audit._

- **Rectilinear Patterns**: No excessive rounded corners unless it's an Avatar. Standard cards use `BorderRadius.md` (8px).
- **Header Consistency**:
  - **Avatars**: Must be 36px circular (full radius).
  - **Position Line**: Use Slate/Gray position badges with strictly aligned secondary text.
- **Indicator Strips**: Identity and Category markers (e.g., Party color strips) must be 4px wide and vertically centered.

---

## 🔦 4. Color Contrast (Institutional Palette)

_Predictability is the prerequisite for Trust._

- **Background**: Use `Slate 50` (#F8FAFC) for grid contrast and `White` (#FFFFFF) for interactive surfaces.
- **Status Tints**:
  - **Intelligence (AI/ML)**: Purple (#6B46C1) with 10% alpha for borders.
  - **Truth (Accuracy)**: Success Green (#38A169) - strictly dulled, no neon.
  - **Alerts**: Rose Crimson (#E11D48) for high-intensity pivots.

---

## 🏛️ 6. Specific Oracle Overrides & Exceptions

### **US Treasury: National Debt Velocity**

- **Vertical Rhythm**: Strictly enforced at 4px intervals for the `Metric.Financial.Velocity` group. Vertical spacing _above_ the Trust Thread card must be set to `v-rhythm-tight-1` (4px).
- **Alignments & Mechanicals**: Card containing the **Tier 2 pillbox** (Trust.Thread) must use `card-verification-mechanical` styling and be **collapsed by default**. The "SECURE TRUST THREAD™" branding must be coupled directly with the Serial Number in the header (stacked), removing all horizontal line footers to maximize vertical economy.
- **Font Size Bump**: When expanded, increase the base font size by **+5** for the `Trust.Thread` card text fields. The **Tier 2 pillbox** and **Serial Group** remain at institutional scale.
- **Contrast Standards**: The **Serial Number / Reference ID** must use a high-contrast Slate (e.g., Slate 600) to ensure legibility on light backgrounds. No "Placeholder" grays for forensic anchors.

---

## ✅ 5. The Visionary's Validation Checklist

1.  [ ] **Grid Test**: Does the snap align with the vertical rhythm of the feed?
2.  [ ] **Weight Check**: Are metrics "Heavy" and context "Regular"?
3.  [ ] **Contrast Check**: Is the text readable on the card background (Slate 900 on White)?
4.  [ ] **Molecule Integrity**: Did the Manifestor use an existing component (e.g., `Metric.Group`) instead of creating a new one?
5.  [ ] **Trust Thread**: Is the source visible and formatted as a forensic anchor?

---

**"Visual Truth is found in Precision."**
