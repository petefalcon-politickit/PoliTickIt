# polisnap-generator — Stream Deck Quick Reference

**Chain Step:** 3 of 4
**What it does:** Receives a PoliSnapNormalized document. If any `NEW_ELEMENT_DEPENDENCY` warnings are present, creates the required `.tsx` element files first. Then constructs the complete PoliSnap JSON with all elements, SR rules applied, and sentiment section if eligible.
**Input folder:** `apps/skill-execution/PoliSnaps/normalized/`
**Output folder:** `apps/skill-execution/PoliSnaps/constructed/`

---

## Prerequisites

- A `NORM-{id}.json` file must exist in `apps/skill-execution/PoliSnaps/normalized/`
- If `warnings` contains `NEW_ELEMENT_DEPENDENCY`: the generator will create new `.tsx` files — a mobile app build and release will be required before those elements render fully

---

## Stream Deck Prompts

### Button: Generate from Latest Norm
```
Generate snap from the latest normalized file in apps/skill-execution/PoliSnaps/normalized/
```

### Button: Generate Specific Norm
```
Generate snap from NORM-[paste-norm-id-here]
```
*(Replace `[paste-norm-id-here]` with the actual norm ID shown after normalizing)*

### Button: Generate and Preview
```
Generate snap from the latest normalized file and show me the full element JSON before writing any files
```

### Button: Generate with New Element
```
Generate snap from NORM-[paste-norm-id-here]. If there are NEW_ELEMENT_DEPENDENCY warnings, create the new element files as part of this run.
```

---

## Expected Output

- `SNAP-{id}.json` in `apps/skill-execution/PoliSnaps/constructed/`
- If new elements were created: new `.tsx` files in `apps/mobile/components/polisnap-elements/{category}/` + `index.ts` updated

## If New Elements Were Created

1. A **mobile app build and release is required** before the new elements render fully
2. Until released, the app shows `ShadowFallbackMolecule` ("UNSUPPORTED MOLECULE") for the new element type
3. Distribute the snap now — it will be visible with a placeholder, and render correctly after the next release
4. Add the new element type to `_polisnap-data/element-catalog.md`

## Next Step

After generating: paste `Distribute [snapId]` or use the **Distributor** Stream Deck button.
