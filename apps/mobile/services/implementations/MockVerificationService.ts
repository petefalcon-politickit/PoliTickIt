import {
    IVerificationService,
    VerificationStatus,
    VerificationTier,
} from "../interfaces/IVerificationService";

/**
 * MockVerificationService
 * Simulates Hardware Attestation and ZK-Residency proofs for the PoliTickIt platform.
 */
export class MockVerificationService implements IVerificationService {
  private currentStatus: VerificationStatus = {
    isVerified: false,
    tier: VerificationTier.Tier1_DeviceAttestation,
    lastVerifiedAt: new Date(0).toISOString(),
  };

  /**
   * Simulates the multi-step verification process with non-deterministic success.
   */
  async verifyIdentity(): Promise<VerificationStatus> {
    console.log(
      "[MockVerificationService] Initializing Multi-Tier Handshake...",
    );

    // Step 1: Simulate Device Attestation (iOS App Attest / Android Play Integrity)
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(
      "[MockVerificationService] Device Attestation: SUCCESS (Hardware-Ledger Lock Active)",
    );

    // Step 2: Simulate ZK-Residency Proof (TargetSmart Handshake)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log(
      "[MockVerificationService] ZK-Residency: SUCCESS (Resident of District 4)",
    );

    this.currentStatus = {
      isVerified: true,
      tier: VerificationTier.Tier3_ZKResidency,
      attestationToken: `ATTEST-${Math.random().toString(36).substring(7).toUpperCase()}`,
      lastVerifiedAt: new Date().toISOString(),
    };

    return this.currentStatus;
  }

  async getCurrentStatus(): Promise<VerificationStatus> {
    return this.currentStatus;
  }

  async resetVerification(): Promise<void> {
    this.currentStatus = {
      isVerified: false,
      tier: VerificationTier.Tier1_DeviceAttestation,
      lastVerifiedAt: new Date(0).toISOString(),
    };
  }
}
