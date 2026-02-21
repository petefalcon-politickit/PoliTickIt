import { SqliteParticipationRepository } from "@/services/implementations/SqliteParticipationRepository";
import { IDatabaseService } from "@/services/interfaces/IDatabaseService";

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
    if (sql.includes("SUM(credits_earned)")) {
      return [{ total: 150 }];
    }
    if (sql.includes("SELECT * FROM participation_log WHERE is_synced = 0")) {
      return [
        {
          id: 1,
          type: "PETITION_SIGN",
          resource_id: "snap_1",
          credits_earned: 50,
          timestamp: "2026-01-31",
          metadata_json: "{}",
          rational_sentiment: 0.8,
          is_synced: 0,
        },
      ];
    }
    return [];
  }
}

describe("CPAP (Civic Participation Audit Protocol) Audit", () => {
  let mockDb: MockDatabase;
  let partRepo: SqliteParticipationRepository;

  beforeEach(() => {
    mockDb = new MockDatabase();
    partRepo = new SqliteParticipationRepository({ databaseService: mockDb });
  });

  test("logAction should record participation in sovereign ledger", async () => {
    await partRepo.logAction({
      type: "PETITION_SIGN",
      resourceId: "snap_123",
      creditsEarned: 10,
      metadata: { method: "biometric" },
      rationalSentiment: 0.9,
    });

    const insertQuery = mockDb.queries.find((q) =>
      q.sql.includes("INSERT INTO participation_log"),
    );
    expect(insertQuery).toBeDefined();
    expect(insertQuery?.params[0]).toBe("PETITION_SIGN");
    expect(insertQuery?.params[4]).toContain("biometric");
  });

  test("getUnsyncedActions should retrieve pending audits", async () => {
    const unsynced = await partRepo.getUnsyncedActions();
    expect(unsynced.length).toBe(1);
    expect(unsynced[0].type).toBe("PETITION_SIGN");
  });

  test("getTotalCredits should aggregate correctly", async () => {
    const total = await partRepo.getTotalCredits();
    expect(total).toBe(150);
  });
});
