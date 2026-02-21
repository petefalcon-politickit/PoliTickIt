import { SqliteCorrelationRepository } from "@/services/implementations/SqliteCorrelationRepository";
import { CorrelationIntelligence } from "@/services/interfaces/ICorrelationRepository";
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
    if (sql.includes("MAX(timestamp)")) {
      return [{ max_ts: "2026-01-31 12:00:00" }];
    }
    return [];
  }
}

describe("FPP (Financial Pulse Protocol) Audit", () => {
  let mockDb: MockDatabase;
  let correlationRepo: SqliteCorrelationRepository;

  beforeEach(() => {
    mockDb = new MockDatabase();
    correlationRepo = new SqliteCorrelationRepository({
      databaseService: mockDb,
    });
  });

  test("upsertCorrelation should generate SQL with JSON serialization", async () => {
    const mockCorrelation: CorrelationIntelligence = {
      id: "C123",
      representativeId: "S000148",
      billId: "H.R.1",
      score: 85,
      confidence: 0.9,
      donor: {
        name: "Big Tech PAC",
        industry: "Technology",
        amount: 50000,
        date: "2025-12-01",
      },
      vote: {
        action: "YEA",
        date: "2025-12-15",
        result: "Passed",
      },
      insight:
        "Significant alignment between donor interests and voting record.",
    };

    await correlationRepo.upsertCorrelation(mockCorrelation);

    const upsertQuery = mockDb.queries.find((q) =>
      q.sql.includes("INSERT INTO correlations"),
    );

    expect(upsertQuery).toBeDefined();
    // Verify JSON serialization
    expect(typeof upsertQuery?.params[5]).toBe("string"); // donor_json
    expect(upsertQuery?.params[5]).toContain("Big Tech PAC");
    expect(typeof upsertQuery?.params[6]).toBe("string"); // vote_json
    expect(upsertQuery?.params[6]).toContain("YEA");
  });

  test("getLatestSyncTime should return millisecond timestamp", async () => {
    const timestamp = await correlationRepo.getLatestSyncTime();
    expect(timestamp).toBeGreaterThan(0);
    expect(new Date(timestamp).getFullYear()).toBe(2026);
  });
});
