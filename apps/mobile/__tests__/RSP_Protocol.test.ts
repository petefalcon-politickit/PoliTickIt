import { SqliteRepresentativeRepository } from "@/services/implementations/SqliteRepresentativeRepository";
import { IDatabaseService } from "@/services/interfaces/IDatabaseService";
import { Representative } from "@/types/user";

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

describe("RSP (Representative Sync Protocol) Audit", () => {
  let mockDb: MockDatabase;
  let repRepo: SqliteRepresentativeRepository;

  beforeEach(() => {
    mockDb = new MockDatabase();
    repRepo = new SqliteRepresentativeRepository({ databaseService: mockDb });
  });

  test("upsertSovereign should generate correct SQL with ON CONFLICT DO UPDATE SET", async () => {
    const mockRep: Representative = {
      id: "S000148",
      name: "Chuck Schumer",
      position: "U.S. Senator",
      party: "Democratic",
      state: "NY",
      district: "",
      profileImage: "...",
    };

    await repRepo.upsertSovereign(mockRep);

    const upsertQuery = mockDb.queries.find((q) =>
      q.sql.includes("ON CONFLICT(id) DO UPDATE SET"),
    );

    expect(upsertQuery).toBeDefined();
    // Verify it updates name but NOT is_following
    expect(upsertQuery?.sql).toContain("name = excluded.name");
    expect(upsertQuery?.sql).not.toContain(
      "is_following = excluded.is_following",
    );

    // Check parameters
    expect(upsertQuery?.params[0]).toBe("S000148");
    expect(upsertQuery?.params[1]).toBe("Chuck Schumer");
  });

  test("toggleFollow should only update is_following field", async () => {
    await repRepo.toggleFollow("S000148", true);

    const updateQuery = mockDb.queries.find((q) =>
      q.sql.includes("UPDATE representatives SET is_following"),
    );

    expect(updateQuery).toBeDefined();
    expect(updateQuery?.params).toEqual([1, "S000148"]);
  });
});
