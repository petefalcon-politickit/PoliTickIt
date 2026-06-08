# polisnap-distributor — Stream Deck Quick Reference

**Chain Step:** 4 of 4
**What it does:** Prepends the constructed snap to the correct category array in `snapLibrary.ts`, assigns channel partitions, and writes a distribution audit record. This is the only step that writes to the app's live data.
**Input folder:** `apps/skill-execution/PoliSnaps/constructed/`
**Output:** `apps/mobile/constants/snapLibrary.ts` updated

---

## Prerequisites

- A `SNAP-{id}.json` file must exist in `apps/skill-execution/PoliSnaps/constructed/`
- Review any `NEW_ELEMENT_DEPENDENCY` warnings from the generator step before distributing

---

## Stream Deck Prompts

### Button: Distribute Latest Snap
```
Distribute the latest constructed snap from apps/skill-execution/PoliSnaps/constructed/
```

### Button: Distribute Specific Snap
```
Distribute SNAP-[paste-snap-id-here]
```
*(Replace `[paste-snap-id-here]` with the snap ID from the generator output)*

### Button: Distribute and Confirm
```
Distribute the latest constructed snap and confirm which array it was prepended to
```

---

## Expected Output

- `snapLibrary.ts` updated — snap prepended to the correct category array
- `DIST-{timestamp}-{snapId}.json` audit record in `apps/skill-execution/PoliSnaps/distributed/`
- Snap immediately visible in the mobile app feed (top of feed)

## Verification

After distributing, check the mobile app (Expo Go or simulator) — the snap should appear at the top of its category feed. If it does not appear:
1. Confirm it was **prepended** (not appended) to the array
2. Confirm `createdAt` is a valid ISO timestamp
3. Confirm `type` matches one of: `Accountability`, `Knowledge`, `Economics`, `Community`
4. Check that the rep filter (`metadata.representativeId`) and policy filter (`metadata.policyArea`) match values in the active filter settings

---

## Full Chain Reference

| Step | Skill | Button label suggestion |
|---|---|---|
| 1 | `polisnap-miner` | "Mine Daily" / "Mine Floor Vote" / "Mine Bill" |
| 2 | `polisnap-normalizer` | "Normalize" |
| 3 | `polisnap-generator` | "Generate Snap" |
| 4 | `polisnap-distributor` | "Distribute" |
