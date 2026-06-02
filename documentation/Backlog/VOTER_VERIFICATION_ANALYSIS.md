# **Analysis: Voter Verification — ZK-Residency Protocol**

- **Subject**: End-to-end Voter Verification from device attestation to ZK-Residency proof
- **Status**: ANALYSIS — Ready for Implementation Planning
- **Date**: 2026-06-01
- **References**: `IVerificationService.ts`, `ZkVerificationService.ts`, `settings-voter-verification.tsx`, `CONSENSUS_RIPPLE_PRIVACY_STRATEGY.md`, `6_RESIDENCY_VERIFICATION_ANALYSIS.md`

---

## 1. Overview

Voter Verification is the trust anchor of PoliTickIt. It answers one question:

> _"Does this user actually live in the district they are voting on?"_

The system uses a **3-tier progressive verification model**. Each tier unlocks higher-fidelity participation actions (e.g., Voter Audit Gate, full RS multiplier). The architecture is already scaffolded — Tier 1–3 interfaces exist. The gap is wiring Tiers 2 and 3 to real external data sources.

---

## 2. Current State

### What Exists (Scaffolded)

| Component                         | Location                                                   | Status                                      |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| `IVerificationService`            | `services/interfaces/IVerificationService.ts`              | ✅ Interface defined                        |
| `ZkVerificationService`           | `services/implementations/ZkVerificationService.ts`        | ✅ Wired, calls `ApiVerificationRepository` |
| `MockVerificationService`         | `services/implementations/MockVerificationService.ts`      | ✅ Used in dev/test                         |
| `settings-voter-verification.tsx` | `app/settings-voter-verification.tsx`                      | ✅ UI complete                              |
| `VoterAuditMolecule`              | `components/polisnap-elements/interaction/voter-audit.tsx` | ✅ Requires Tier 3 to unlock                |
| `ApiVerificationRepository`       | `services/implementations/ApiVerificationRepository.ts`    | ⚠️ Stubbed — calls mock endpoints           |

### Verification Tiers (Defined)

```typescript
enum VerificationTier {
  Tier1_DeviceAttestation = "Tier 1: Device Attestation",
  Tier2_GeoVerification = "Tier 2: Geo-Fenced Residency",
  Tier3_ZKResidency = "Tier 3: ZK-Residency Proof",
}
```

| Tier | Description                                                           | Unlocks                                         | Real Service Required                           |
| ---- | --------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| 1    | Device hardware attestation (iOS App Attest / Android Play Integrity) | Basic verified badge                            | Apple DeviceCheck / Google Play Integrity API   |
| 2    | Geo-fence: device location within state/district boundary             | RS 1.1x multiplier                              | Google Maps Geocoding + Census shapefiles       |
| 3    | ZK-Residency: voter roll hash match                                   | Full RS 1.5x, Voter Audit Gate, PoliProof badge | L2 Political Data or TargetSmart voter file API |

---

## 3. Implementation Plan

### Phase 1 — Tier 1: Device Attestation (Low Effort)

**Goal**: Confirm the app is running on a real, unmodified device.

**Mobile**:

- iOS: Call `AppAttest.generateAssertion()` via Expo bare workflow or `expo-device` attestation shim
- Android: Call Play Integrity API via `react-native-device-info` or Google Play Integrity SDK

**API**:

- `POST /api/verification/device-attest` — receives assertion token, validates against Apple/Google, returns `{ success: bool, nonce: string }`
- Store result in `verification_proofs` table with `tier = "Tier 1"`

**Effort**: ~1–2 days

---

### Phase 2 — Tier 2: Geo-Fenced Residency (Medium Effort)

**Goal**: Confirm the device is physically located within the user's registered district at verification time.

**Mobile**:

- Request location permission (already partially in signup flow for ZIP lookup)
- Call `expo-location` → get lat/lng
- Send to API: `POST /api/verification/geo-verify` with `{ lat, lng, claimedState, claimedDistrict }`

**API**:

- Use Census Bureau TIGER shapefiles or Google Maps Geocoding Reverse API to determine district from lat/lng
- Compare against user's registered district in Cosmos DB
- Return `{ success: bool, resolvedDistrict: string }`

**Effort**: ~2–3 days

---

### Phase 3 — Tier 3: ZK-Residency Proof (High Effort — Core Feature)

**Goal**: Cryptographically prove the user is a registered voter in their district without exposing their identity.

**Protocol** (ZK-Handshake):

1. Mobile hashes `Name + DOB + ZIP` locally → sends hash to API
2. API sends hash to voter file provider (L2 Political Data or TargetSmart)
3. Provider returns boolean: _"hash exists in active voter roll"_ + a ZK receipt signature
4. API issues a signed attestation token — no PII stored on server
5. Mobile stores token in `UserLedgerService` under `ZKTP_VERIFICATION_STATUS`

```
Mobile → hash(Name+DOB+ZIP) → API → VoterFileOracle → bool + ZK Receipt
                                                              ↓
                                              Attestation Token issued
                                              No PII stored on backend
```

**Vendor Options**:

| Vendor                       | Coverage                          | API            | Cost Model               |
| ---------------------------- | --------------------------------- | -------------- | ------------------------ |
| **L2 Political Data**        | 190M+ registered voters, full US  | REST           | Per-lookup (~$0.01–0.05) |
| **TargetSmart**              | 260M+ records, commercial-grade   | REST           | Enterprise contract      |
| **Catalist**                 | Non-profit oriented               | API (limited)  | Partnership              |
| **DIY via NVRA state files** | Public state voter rolls (varies) | State CSV bulk | Free but manual          |

**Recommended for MVP**: L2 Political Data — easiest API integration, good coverage, reasonable per-lookup pricing.

**Effort**: ~5–7 days (API integration + mobile flow + legal/privacy review)

---

## 4. Backend API Endpoints Required

```
POST /api/verification/device-attest
  Body: { attestationToken: string, nonce: string, platform: "ios"|"android" }
  Returns: { success: bool, tier: "Tier 1" }

POST /api/verification/geo-verify
  Body: { lat: number, lng: number, claimedState: string, claimedDistrict: string }
  Returns: { success: bool, resolvedDistrict: string, tier: "Tier 2" }

POST /api/verification/zk-handshake
  Body: { identityHash: string }   // SHA-256(name+dob+zip) — no PII
  Returns: { success: bool, zkReceipt: string, tier: "Tier 3", attestationToken: string }

GET /api/verification/status
  Returns: { tier: VerificationTier, isVerified: bool, lastVerifiedAt: string }
```

---

## 5. Privacy & Legal Considerations

- **PII never leaves the device in plaintext** — only the hash is sent to the API
- **No voter data is stored** on PoliTickIt servers — only the boolean result + ZK receipt
- **Consent screen required** before ZK-Handshake initiation (already present in UI: "INITIALIZE ZK-HANDSHAKE" button)
- **CCPA/GDPR alignment**: The ZK model is inherently privacy-preserving — the identity hash cannot be reverse-engineered without the original data
- **Voter file access agreements**: L2/TargetSmart require a commercial data use agreement — must be signed before MVP launch
- **App store policies**: Location and identity verification flows require explicit disclosure in privacy policy

---

## 6. Mobile UX Flow (Current → Target)

**Current**: Button calls `ZkVerificationService.verifyIdentity()` → mocked success → stores Tier 3 status locally.

**Target**:

```
Profile → "Verify Residency"
  └── Tier 1: Tap "Verify Device" → App Attest call → Tier 1 badge
  └── Tier 2: "Allow Location" → Geo-fence check → Tier 2 badge
  └── Tier 3: "Enter Name / DOB / ZIP" → ZK-Handshake → Tier 3 badge + RS 1.5x
```

Each tier is additive. Users must complete Tier 1 before Tier 2, and Tier 2 before Tier 3.

---

## 7. Tasks

- [ ] **Phase 1**: Implement `POST /api/verification/device-attest` — integrate Apple DeviceCheck + Google Play Integrity
- [ ] **Phase 1**: Wire `ZkVerificationService.verifyIdentity()` to call real API endpoint for Tier 1
- [ ] **Phase 2**: Implement `POST /api/verification/geo-verify` using Census TIGER/Google Maps
- [ ] **Phase 2**: Add `expo-location` call on Tier 2 step in `settings-voter-verification.tsx`
- [ ] **Phase 3**: Sign data agreement with L2 Political Data (or TargetSmart)
- [ ] **Phase 3**: Implement `POST /api/verification/zk-handshake` with voter file oracle call
- [ ] **Phase 3**: Update mobile Tier 3 step to collect Name/DOB/ZIP and hash before sending
- [ ] **All**: Replace mock returns in `ApiVerificationRepository` with real endpoints
- [ ] **All**: Add consent screen before each tier's data collection
- [ ] **All**: Write unit tests for each tier in `ZKTP_Protocol.test.ts`
