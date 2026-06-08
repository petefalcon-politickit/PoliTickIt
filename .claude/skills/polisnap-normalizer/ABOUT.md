# polisnap-normalizer — Stream Deck Quick Reference

**Chain Step:** 2 of 4
**What it does:** Validates rep IDs, policy areas, cross-references bill numbers via Congress.gov, maps content to element types, evaluates sentiment eligibility. Produces a validated PoliSnapNormalized JSON.
**Input folder:** `apps/skill-execution/PoliSnaps/spawn/`
**Output folder:** `apps/skill-execution/PoliSnaps/normalized/`

---

## Prerequisites

- A `SPAWN-{id}.json` file must exist in `apps/skill-execution/PoliSnaps/spawn/`
- Congress.gov API access (for bill cross-reference)

---

## Stream Deck Prompts

### Button: Normalize Latest Spawn
```
Normalize the latest spawn file in apps/skill-execution/PoliSnaps/spawn/
```

### Button: Normalize Specific Spawn
```
Normalize SPAWN-[paste-spawn-id-here]
```
*(Replace `[paste-spawn-id-here]` with the actual spawn ID shown after mining)*

### Button: Normalize and Review
```
Normalize the latest spawn file and show me all warnings before proceeding
```

---

## Expected Output

- `NORM-{timestamp}-{slug}.json` in `apps/skill-execution/PoliSnaps/normalized/`
- Contains: validated `representativeId`, `policyArea`, `suggestedElements[]`, `sentimentEligible`, `warnings[]`

## Common Warnings

| Warning code | Meaning | Action |
|---|---|---|
| `NEW_ELEMENT_DEPENDENCY` | Suggested element not in catalog | Note it — snap still generates. App shows placeholder. |
| `UNKNOWN_REPRESENTATIVE` | Rep name not in `representatives.md` | Add rep to data file before distributing. |
| `UNKNOWN_POLICY_AREA` | No matching label found | Check `policy-areas.md` for closest match. |
| `BILL_NOT_FOUND` | Congress.gov returned 404 | Verify bill number format. Snap still generates. |

## Next Step

After normalizing: paste `Generate [normId]` or use the **Generator** Stream Deck button.
