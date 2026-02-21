# Residency & Bot Verification Analysis

**Protecting the Integrity of the Consensus Ripple™**

## 1. The Threat Model

- **Astroturfing**: Automated bots simulating groundswell support for policies.
- **Outside Influence**: Non-resident users influencing local district sentiment.

## 2. Multi-Tier Verification

PoliTickIt uses a tiered trust model to ensure the "Truth" is verifiable:

- **Tier 1 (Surface)**: Device attestation (ensures the client is a real mobile device).
- **Tier 2 (Location)**: Geo-fenced IP verification (limits interaction to specific districts).
- **Tier 3 (Residency)**: Zero-Knowledge proof of residency (via third-party verification providers).

## 3. ZK-Residency Proofs (The TargetSmart Handshake)

We leverage ZK-SNARKs to verify that a user is a resident of a district without storing their actual address in our database.

1. **The Voter-File Handshake**: The mobile device hashes the user's name/zip locally.
2. **Third-Party Oracle**: A request is sent to an oracle (e.g., TargetSmart or L2) to verify if that hash exists in the active voter roll.
3. **ZK-Receipt**: The oracle returns a boolean "True/False" along with a cryptographic signature.
4. **Relational Sovereignty**: The actual identity stays on the device; only the "Verified Resident" status is transmitted to the PoliTickIt Nexus.

## 4. Hardware-Ledger Lock

Utilizing **iOS App Attest** and **Android Play Integrity**, we verify that the user's locally signed transaction originated from a physical, secure enclave. This makes brute-force bot attacks cost-prohibitive.
