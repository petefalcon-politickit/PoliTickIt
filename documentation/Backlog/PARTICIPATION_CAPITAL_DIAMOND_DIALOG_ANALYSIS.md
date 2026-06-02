# **Analysis: Participation Capital & Diamond Dialog**

- **Subject**: Participation Credit economy, RS multiplier system, and Diamond Dialog UX component
- **Status**: ANALYSIS — Diamond Dialog pending design & implementation
- **Date**: 2026-06-01
- **References**: `participation.tsx`, `IParticipationProvider.ts`, `capital-logo.tsx`, `participation-status-modal.tsx`, `UserLedgerService.ts`, `OmniFeedProvider.ts`, `5_CIVIC_DIVIDEND_PROTOCOL.md`, `1_PRODUCT_STRATEGY.md`

---

## 1. Overview

Participation Capital is the **civic engagement economy** of PoliTickIt. Users earn **Participation Credits** for verifiable civic actions. Credits determine tier level, which gates intelligence features and applies RS (Rational Sentiment) multipliers to signal weight.

The **Diamond Dialog** is the premium UX surface for this economy — a modal that presents the user's full capital profile, tier progression, and high-value action paths. It is the entry point for the "Civic Dividend" loop.

---

## 2. Credit Economy

### Credit Actions

| Action                    | Credits | RS Impact | Notes                            |
| ------------------------- | ------- | --------- | -------------------------------- |
| Pulse Sentiment           | +25     | +1 RS     | First interaction per issue only |
| Watchlist Add             | +50     | —         | Bookmarking an insight           |
| Intelligence Share        | +75     | —         | Sharing a snap externally        |
| Direct Action             | +100    | +5 RS     | Town hall, call-to-action        |
| ZK-Signature              | +250    | +12 RS    | Consensus Ripple signature       |
| Vote (direct)             | +100    | +5 RS     | Casting a vote on tracked bill   |
| ZK-Residency Verification | +1000   | +50 RS    | Tier 3 completion bonus          |

### Current Code Values (from `OmniFeedProvider` mock)

```typescript
{ type: "vote",         credits: 100,  impact: "+5 RS"  }
{ type: "signature",    credits: 250,  impact: "+12 RS" }
{ type: "pulse",        credits: 25,   impact: "+1 RS"  }
{ type: "verification", credits: 1000, impact: "+50 RS" }
```

> **Note**: Credit values between product docs and code have minor discrepancies (e.g., Share is +50 in some docs vs +75 in others). Need to **canonize these values** before backend implementation. Recommend the table above as the canonical source.

---

## 3. Tier System

### Tier Definitions (from `participation.tsx`)

| Level | Name        | Requirement | Color                      | Unlock                                       |
| ----- | ----------- | ----------- | -------------------------- | -------------------------------------------- |
| 1     | Observation | 0 Cr        | `#3182CE` (Blue)           | Default access, basic pulse                  |
| 2     | Engagement  | 1,000 Cr    | `#38A169` (Green)          | Pulse Context, FEC heatmap teaser            |
| 3     | Influence   | 5,000 Cr    | `#D69E2E` (Gold)           | Institutional ROI scorecards                 |
| 4     | Sovereign   | 20,000 Cr   | `#805AD5` (Diamond/Purple) | Full forensic intelligence, Voter Audit gate |

### Diamond Logo (Capital Logo)

The `CapitalLogo` component renders an icon + color representing the user's tier:

```typescript
// Tier logic from capital-logo.tsx
if (forcedTier === 4 || credits >= 2500)  → { icon: "diamond", color: "#8B5CF6", level: 4 }
if (forcedTier === 3 || credits >= 1200)  → { icon: "...", color: "gold" }
```

> ⚠️ **Discrepancy**: `capital-logo.tsx` uses 2,500 Cr for Diamond (Tier 4), while `participation.tsx` uses 20,000 Cr. These need to be unified. **Recommend aligning to `participation.tsx` values** (more graduated progression) and updating `capital-logo.tsx`.

---

## 4. RS (Rational Sentiment) Multiplier

RS is the **signal weight** applied to a user's civic actions. It is the measure of how much "voice weight" a constituent's participation carries in the representative's accountability dashboard.

### Multiplier Rules

| Verification Tier   | RS Multiplier | Example                  |
| ------------------- | ------------- | ------------------------ |
| None (unverified)   | 1.0x          | 100 pulse votes = 100 RS |
| Tier 1 Device       | 1.1x          | 100 pulse votes = 110 RS |
| Tier 2 Geo          | 1.2x          | 100 pulse votes = 120 RS |
| Tier 3 ZK-Residency | 1.5x          | 100 pulse votes = 150 RS |

**Civic Capital Tier also amplifies**:

- Sovereign tier (Tier 4, 20,000+ Cr) may warrant an additional 1.1x RS stacking — pending product decision.

### Current Implementation

RS is tracked via `UserLedgerService` with the key `RS_TOTAL`. The `ZkVerificationService` sets the multiplier at verification time. It is not yet applied dynamically to pulse/vote calculations — the multiplier is stored but the downstream calculation in the rep dashboard is not implemented.

---

## 5. Diamond Dialog — UX Design

### What Is Diamond Dialog?

The **Diamond Dialog** is a prominent, action-oriented modal (bottom sheet or centered overlay) that:

1. Shows the user's current Capital tier + credit balance
2. Presents the "next tier" milestone with a progress bar
3. Surfaces high-value earn actions (e.g., "Verify Residency → +1000 Cr")
4. Teases locked features visible from the current tier
5. Can be triggered from any screen as a contextual capital status check

It is named "Diamond" because the Sovereign (Diamond) tier is the aspirational endpoint of the economy — reaching it is the goal the dialog drives the user toward.

### Existing Components

| Component                        | Status    | Notes                                       |
| -------------------------------- | --------- | ------------------------------------------- |
| `participation.tsx` (tab screen) | ✅ Exists | Full participation screen, good baseline    |
| `participation-status-modal.tsx` | ✅ Exists | Lighter-weight modal, shows tiers + teasers |
| `participation-cta.tsx`          | ✅ Exists | Inline snap element — earn credits CTA      |
| `capital-logo.tsx`               | ✅ Exists | Tier icon component                         |

### Gap: Diamond Dialog vs Current Modal

`participation-status-modal.tsx` is functional but passive — it shows status. The **Diamond Dialog** needs to be active and conversion-oriented:

| Feature                       | `participation-status-modal` | Diamond Dialog (Target)       |
| ----------------------------- | ---------------------------- | ----------------------------- |
| Credit balance                | ✅                           | ✅                            |
| Tier progression bar          | ❌                           | ✅                            |
| Contextual earn actions       | ❌                           | ✅ (tailored to user's gap)   |
| Feature unlock preview        | ✅ (basic)                   | ✅ (animated unlock teaser)   |
| Civic Dividend CTA            | ❌                           | ✅                            |
| Verification shortcut         | ❌                           | ✅ (if Tier 3 not yet earned) |
| Triggered from watchlist/feed | ✅ partial                   | ✅ from anywhere              |

---

## 6. Backend Requirements

### Current State

`IParticipationProvider` is implemented by `forensicSignalCoordinator.getImpactMetrics()` — which aggregates local SQLite data. No server-side participation ledger exists yet.

### Required API Endpoints

```
GET /api/participation/status
  Returns: { credits: number, tierLevel: 1|2|3|4, tierName: string, nextTierCredits: number, rsMultiplier: number }

POST /api/participation/record-action
  Body: { actionType: "pulse"|"vote"|"signature"|"share"|"verification", referenceId: string }
  Returns: { creditsAwarded: number, newTotal: number, tierChanged: bool, newTier?: string }

GET /api/participation/history
  Returns: ActionRecord[]  // paginated credit history

GET /api/participation/leaderboard
  Returns: district-level participation rankings (for Civic Capital collective bonuses)
```

### Cosmos DB Schema

```json
// Container: participation-records
{
  "id": "uuid",
  "userId": "string",
  "actionType": "pulse|vote|signature|share|verification",
  "referenceId": "snap-id or issue-id",
  "creditsAwarded": 25,
  "rsImpact": 1,
  "timestamp": "ISO8601",
  "districtId": "string"   // for collective milestones
}

// Container: participation-summary (per user, upserted)
{
  "id": "userId",
  "totalCredits": 1450,
  "tierLevel": 2,
  "rsMultiplier": 1.2,
  "lastActionAt": "ISO8601"
}
```

---

## 7. Civic Dividend Protocol Integration

The **Civic Dividend Protocol** (see `5_CIVIC_DIVIDEND_PROTOCOL.md`) is the monetization layer of Participation Capital:

1. **Sponsor** sets a Civic Goal + Dividend Pool (e.g., $10,000 for a community park)
2. **Constituent** takes verified civic action → earns Credits
3. **Community milestone** hit → Sponsor releases Dividend to the cause

Diamond Dialog is the **primary surface** for surfacing active Civic Dividends to users. It should:

- Show active Sponsored Pulses linked to real-world dividend outcomes
- Display "Community Progress" bar toward a milestone
- Let the user claim their role in the collective impact

This is the **viral loop** and future monetization path — enterprises sponsor pulses, users participate, community benefits.

---

## 8. Tasks

### Immediate

- [ ] **Canonize credit values** — agree on final credit amounts per action type and update both `OmniFeedProvider` mock and `IParticipationProvider` docs
- [ ] **Unify tier thresholds** — align `capital-logo.tsx` and `participation.tsx` tier credit requirements
- [ ] **Build Diamond Dialog component** — `components/ui/diamond-dialog.tsx`, extends `participation-status-modal` with earn actions + progress bar + verification shortcut
- [ ] **Trigger Diamond Dialog** from Watchlist gate and Navigation bar Capital icon

### Backend

- [ ] **Implement `POST /api/participation/record-action`** — persists to `participation-records` Cosmos container
- [ ] **Implement `GET /api/participation/status`** — reads from `participation-summary` container
- [ ] **Wire `ZkVerificationService`** to update `rsMultiplier` in `participation-summary` on Tier 3 completion
- [ ] **Apply RS multiplier** downstream in rep dashboard aggregation queries

### Enhancements

- [ ] **Collective Milestone Tracker** — district-level progress bar toward Civic Dividend threshold
- [ ] **Reward Contract** — "Claim Reward" flow (transition from passive accumulation to active redemption)
- [ ] **Sovereign Tier Bonus** — define whether Tier 4 capital amplifies RS further (product decision needed)
