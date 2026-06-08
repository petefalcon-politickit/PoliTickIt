# Category 12 — Constituent Voter Audit

**Snap Type:** `Voter Audit`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-demand — triggered by user eligibility confirmation, not by content harvesting
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Enables a verified constituent to formally audit their representative's voting record using a **Zero-Knowledge Proof (ZK-Proof) bridge** to validate that the user lives in the district they claim. This is the most technically sophisticated snap type — and the most personal.

The snap does NOT show vote data or policy content. Its job is to: (1) confirm the user is a verified constituent of the audited rep, and (2) link them to the specific audit action (e.g., comparing how their rep voted vs. how they would have voted on a specific bill).

Unlike all other accountability snaps, this snap is **generated once per rep per district** and is personalized to the user's eligibility status at render time.

---

## How ZK-Proof Works in This Context

1. User claims they live in District X
2. TargetSmart (voter file data provider) holds the ground truth: address → district mapping
3. A ZK-Proof is generated server-side proving the user's address is in the district **without revealing the actual address** to PoliTickIt
4. The snap only activates for verified constituents — non-residents see a "not eligible" state
5. `verificationLevel: "ZK_VERIFIED"` is set when the proof passes

This is a **privacy-preserving accountability mechanism** — citizens can audit their reps without exposing their home address.

---

## Element Stack

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Interaction.VoterAudit` | Core audit UI — displays rep name, district, audit target, eligibility status | Required |
| 2 | `Trust.Thread` | ZK-Proof verification provenance — TargetSmart source, proof metadata | Required |

Note: **No `Header.Representative`** — the VoterAudit element IS the rep reference. Adding a rep header would be redundant.

No sentiment pulse, no narrative insight — this snap type's interface is entirely the audit element.

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **TargetSmart** | Voter file — address to district mapping (verified residency) | Internal API via ZK-Proof bridge |
| **Congress.gov** | District boundaries, current rep for district | `https://api.congress.gov/v3/member/{bioguideId}` |
| **PoliTickIt ZK-Bridge** | Generates the ZK-Proof from TargetSmart data | Internal service |

---

## Snap ID Pattern

```
audit-{repIdSlug}-{districtSlug}
```

Examples:
- `audit-casar-tx35`
- `audit-johnson-la04`
- `audit-schumer-ny`

---

## `Interaction.VoterAudit` Structure

```typescript
{
  id: "voter-audit",
  type: "Interaction.VoterAudit",
  data: {
    repId: "[BIOGUIDE_ID]",               // e.g., "C001131"
    repName: "[FULL NAME]",               // e.g., "Rep. Greg Casar"
    district: "[DISTRICT LABEL]",         // e.g., "Texas 35th District"
    auditTargetId: "[VOTE/BILL ID]"       // e.g., "vote-hr-445" or "hr-2616"
  }
}
```

**`auditTargetId` format:**
- For a specific vote: `"vote-{chamber}-{billId}"` → e.g., `"vote-hr-445"`
- For a bill: `"bill-{billIdSlug}"` → e.g., `"bill-hr2616"`
- For a broad session audit: `"session-{congress}-{chamber}"` → e.g., `"session-119-house"`

---

## `Trust.Thread` Structure for Voter Audit

```typescript
{
  id: "trust-thread",
  type: "Trust.Thread",
  data: {
    sources: [
      {
        label: "Verified Residency",
        type: "TargetSmart Verified Residency",
        url: "https://targetsmart.com"
      }
    ],
    verificationLevel: "ZK_VERIFIED",     // "ZK_VERIFIED" | "Tier 3" | "Unverified"
    auditDate: "YYYY-MM-DD",
    notes: "ZK-Proof bridge validates district residency without exposing home address"
  }
}
```

**`verificationLevel` for Voter Audit snaps:**
- `"ZK_VERIFIED"`: ZK-Proof successfully validated for the current user
- `"Tier 3"`: Congressional district data sourced from Congress.gov (always baseline)
- `"Unverified"`: ZK-Proof not yet run (snap shown pre-verification)

---

## Recurring Generation Procedure

### When to Generate

This snap type is generated **once per rep, on-demand** — not on a schedule. It is triggered by:

1. A user explicitly taps "Audit My Rep" in the PoliTickIt UI
2. A new rep takes office (new district snap needed)
3. An audit target bill/vote is added to the active tracking list

**This is NOT a content generation pipeline snap** — it does not go through the Mine → Normalize → Generate → Distribute skill chain in the same way as other types. The snap structure is nearly static; only `auditTargetId` changes per event.

### Stage 1 — Define

- Identify the rep and district (from user's verified district or from new rep onboarding)
- Define the `auditTargetId` — what bill or vote is being audited
- Verify the bioguide ID against `representatives.md`

### Stage 2 — Validate

- Confirm `auditTargetId` exists in Congress.gov
- Confirm rep is current (not retired, not redistricted)
- Flag for ZK-Proof bridge integration

### Stage 3 — Construct

- Use `Interaction.VoterAudit` structure above
- `Trust.Thread.verificationLevel`: set to `"Unverified"` at generation time; the ZK-bridge upgrades it to `"ZK_VERIFIED"` at render time when the user passes the proof
- No other elements needed

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Add to array (position is less important than for content snaps)

---

## Existing Production Examples

| Snap ID | Rep | District | Audit Target |
|---|---|---|---|
| `audit-casar-001` | Rep. Greg Casar (C001131) | Texas 35th District (TX-35) | `vote-hr-445` |

---

## Prompt Invocation

```
Generate a constituent voter audit PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [STATE/DISTRICT]
District: [e.g., "Texas 35th District" / "New York" (for Senators)]
Audit target: [BILL_ID or VOTE_ID — e.g., "hr-2616" or "vote-hr-445"]
District slug: [e.g., "tx35" / "ny"]

Note: This snap uses ZK-Proof via TargetSmart bridge.
Trust.Thread.verificationLevel = "Unverified" at generation time.
ZK-Bridge upgrades to "ZK_VERIFIED" at render time.

Use: polisnap-generator and polisnap-distributor skills.
(Mining + normalization are minimal — snap is structurally static.)
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: audit-[repIdSlug]-[districtSlug]
No Header.Representative — VoterAudit IS the rep reference.
```

---

## Content Quality Rules

- **Never expose constituent address data** — the entire design principle of this snap is ZK-Proof privacy; no address, partial address, or geo data should appear in snap content
- **`auditTargetId` must be real** — verify the bill/vote ID against Congress.gov before generating
- **One snap per rep per district** — do not create multiple audit snaps for the same rep; update the existing snap's `auditTargetId` when a new audit event occurs
- **verificationLevel at generation time is always `"Unverified"`** — the ZK-bridge handles runtime verification; do not pre-set `"ZK_VERIFIED"` in the static snap data

---

## Known Limitations

- ZK-Proof bridge is an internal PoliTickIt service — this snap type only functions with backend integration active
- TargetSmart voter file data has a ~30-60 day lag for new voter registrations
- Snap is not useful for users who have not registered with PoliTickIt's verification flow
- Senators represent entire states — the district audit concept is less precise for state-level constituents
