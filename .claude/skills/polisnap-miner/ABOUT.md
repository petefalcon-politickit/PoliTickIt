# polisnap-miner — Stream Deck Quick Reference

**Chain Step:** 1 of 4
**What it does:** Mines real-world political events and content from public sources. Produces a raw PoliSnapSpawn JSON file. Does NOT validate or map elements.
**Output folder:** `apps/skill-execution/PoliSnaps/spawn/`

---

## Prerequisites

None — this is the entry point of the chain.

---

## Stream Deck Prompts

### Button: Daily Congressional Mine
```
Mine DailyCongressionalRecord for today
```

### Button: Floor Vote Mine
```
Mine FloorVote for today
```

### Button: Rep Statement Mine
```
Mine RepStatement for today — focus on recent press releases
```

### Button: Bill Activity Mine
```
Mine BillActivity for today
```

### Button: Committee Hearings Mine
```
Mine CommitteeHearing for this week
```

### Button: Specific Bill
```
topic: Arctic ANWR drilling ban
bill: S.Res.45
rep: John Thune
source-hint: congress.gov
```

### Button: Freeform
```
What significant political events happened today in Congress?
```

---

## Expected Output

- One or more `SPAWN-{timestamp}-{slug}.json` files in `apps/skill-execution/PoliSnaps/spawn/`
- Each file contains: `rawTitle`, `rawSummary`, `contentSignal`, `copyrightFlag`, `sourceUrl`

## Next Step

After mining: paste `Normalize [spawnId]` or use the **Normalizer** Stream Deck button.
