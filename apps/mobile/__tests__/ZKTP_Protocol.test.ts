import { ZkVerificationService } from "@/services/implementations/ZkVerificationService";
import { IDatabaseService } from "@/services/interfaces/IDatabaseService";
import { IUserLedgerService } from "@/services/interfaces/IUserLedgerService";
import { VerificationTier } from "@/services/interfaces/IVerificationService";

class MockDatabase implements IDatabaseService {
  public queries: { sql: string; params: any[] }[] = [];
  async initialize() {
    return Promise.resolve();
  }
  async reset() {
    this.queries = [];
  }
  async execute(sql: string, params: any[] = []): Promise<any> {
    this.queries.push({ sql, params });
    return [];
  }
}

class MockLedger implements IUserLedgerService {
  public data: Record<string, string> = {};
  async getString(key: string) {
    return this.data[key] || null;
  }
  async getNumber(key: string) {
    return null;
  }
  async getBoolean(key: string) {
    return null;
  }
  async set(key: string, value: any) {
    this.data[key] = value.toString();
  }
  async remove(key: string) {
    delete this.data[key];
  }
  async clear() {
    this.data = {};
  }
}

class MockApiRepo {
  async validateHardwareAttestation() {
    return true;
  }
  async validateZkProof() {
    return { success: true, tier: VerificationTier.Tier3_ZKResidency };
  }
}

describe("ZKTP (Zero-Knowledge Trust Protocol) Audit", () => {
  let mockDb: MockDatabase;
  let mockLedger: MockLedger;
  let mockApi: any;
  let zkService: ZkVerificationService;

  beforeEach(() => {
    mockDb = new MockDatabase();
    mockLedger = new MockLedger();
    mockApi = new MockApiRepo();
    zkService = new ZkVerificationService({
      databaseService: mockDb,
      userLedgerService: mockLedger,
      apiVerificationRepository: mockApi,
    });
  });

  test("verifyIdentity should persist status to ledger and proofs table", async () => {
    const status = await zkService.verifyIdentity();

    expect(status.isVerified).toBe(true);
    expect(status.tier).toBe(VerificationTier.Tier3_ZKResidency);

    // Check Ledger
    const cached = await mockLedger.getString("ZKTP_VERIFICATION_STATUS");
    expect(cached).toContain("Tier 3");

    // Check Sovereign Proofs Table
    const insertQuery = mockDb.queries.find((q) =>
      q.sql.includes("INSERT INTO verification_proofs"),
    );
    expect(insertQuery).toBeDefined();
    expect(insertQuery?.params[0]).toBe(VerificationTier.Tier3_ZKResidency);
  });

  test("getCurrentStatus should retrieve from ledger", async () => {
    mockLedger.data["ZKTP_VERIFICATION_STATUS"] = JSON.stringify({
      isVerified: true,
      tier: VerificationTier.Tier2_GeoVerification,
      lastVerifiedAt: "2026-01-01",
    });

    const status = await zkService.getCurrentStatus();
    expect(status.tier).toBe(VerificationTier.Tier2_GeoVerification);
  });
});
