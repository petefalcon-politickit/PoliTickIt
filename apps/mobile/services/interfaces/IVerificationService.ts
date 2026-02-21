/**
 * Verification Tier
 */
export enum VerificationTier {
  Tier1_DeviceAttestation = "Tier 1: Device Attestation",
  Tier2_GeoVerification = "Tier 2: Geo-Fenced Residency",
  Tier3_ZKResidency = "Tier 3: ZK-Residency Proof",
}

/**
 * Verification Status
 */
export interface VerificationStatus {
  isVerified: boolean;
  tier: VerificationTier;
  attestationToken?: string;
  lastVerifiedAt: string;
}

/**
 * IVerificationService
 * Manages the Hardware-Ledger Lock and ZK-Residency proofs.
 */
export interface IVerificationService {
  /**
   * Performs the multi-tier verification process.
   */
  verifyIdentity(): Promise<VerificationStatus>;

  /**
   * Returns the current verification status cached on the device.
   */
  getCurrentStatus(): Promise<VerificationStatus>;

  /**
   * Resets the verification state (for testing).
   */
  resetVerification(): Promise<void>;
}
