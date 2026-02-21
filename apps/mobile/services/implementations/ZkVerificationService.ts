import { IDatabaseService } from "../interfaces/IDatabaseService";
import { IUserLedgerService } from "../interfaces/IUserLedgerService";
import {
    IVerificationService,
    VerificationStatus,
    VerificationTier,
} from "../interfaces/IVerificationService";
import { ApiVerificationRepository } from "./ApiVerificationRepository";

export class ZkVerificationService implements IVerificationService {
  private db: IDatabaseService;
  private ledger: IUserLedgerService;
  private apiRepo: ApiVerificationRepository;

  private readonly LEDGER_KEY = "ZKTP_VERIFICATION_STATUS";

  constructor({
    databaseService,
    userLedgerService,
    apiVerificationRepository,
  }: {
    databaseService: IDatabaseService;
    userLedgerService: IUserLedgerService;
    apiVerificationRepository: ApiVerificationRepository;
  }) {
    this.db = databaseService;
    this.ledger = userLedgerService;
    this.apiRepo = apiVerificationRepository;
  }

  async verifyIdentity(): Promise<VerificationStatus> {
    console.log(
      "[ZkVerificationService] Initializing ZKTP Multi-Tier Handshake...",
    );

    // 1. Simulate Device Attestation
    const hardwareSuccess = await this.apiRepo.validateHardwareAttestation(
      "nonce",
      "mock-attestation",
    );
    if (!hardwareSuccess) {
      throw new Error("Hardware Attestation Failed");
    }

    // 2. Simulate ZK residency proof generation & validation
    const zkResult = await this.apiRepo.validateZkProof("mock-zk-proof");

    const status: VerificationStatus = {
      isVerified: zkResult.success,
      tier: zkResult.tier,
      attestationToken: `ZK-${Math.random().toString(36).substring(7).toUpperCase()}`,
      lastVerifiedAt: new Date().toISOString(),
    };

    // Persist to quick-access ledger
    await this.ledger.set(this.LEDGER_KEY, JSON.stringify(status));

    // Persist to historical proof ledger
    await this.db.execute(
      "INSERT INTO verification_proofs (tier, attestation_token, verified_at, metadata_json) VALUES (?, ?, ?, ?)",
      [
        status.tier,
        status.attestationToken,
        status.lastVerifiedAt,
        JSON.stringify(zkResult),
      ],
    );

    return status;
  }

  async getCurrentStatus(): Promise<VerificationStatus> {
    const cached = await this.ledger.getString(this.LEDGER_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    return {
      isVerified: false,
      tier: VerificationTier.Tier1_DeviceAttestation,
      lastVerifiedAt: new Date(0).toISOString(),
    };
  }

  async resetVerification(): Promise<void> {
    await this.ledger.remove(this.LEDGER_KEY);
    await this.db.execute("DELETE FROM verification_proofs");
  }
}
