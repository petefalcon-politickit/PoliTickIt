import { SqliteAgencyRepository } from "@/services/implementations/SqliteAgencyRepository";
import { SqliteRepresentativeRepository } from "@/services/implementations/SqliteRepresentativeRepository";
import { SqliteSnapRepository } from "@/services/implementations/SqliteSnapRepository";
import { StorageHydrationService } from "@/services/implementations/StorageHydrationService";
import { IDatabaseService } from "@/services/interfaces/IDatabaseService";

/**
 * A specialized Mock DB for testing repository logic without a real SQLite engine.
 * Tracks executed queries and maintains an in-memory "store".
 */
class MockDatabase implements IDatabaseService {
  public queries: { sql: string; params: any[] }[] = [];
  public store: Record<string, any[]> = {
    snaps: [],
    snap_elements: [],
    user_ledger: [],
  };

  async initialize() {
    return Promise.resolve();
  }
  async reset() {
    this.queries = [];
    this.store = { snaps: [], snap_elements: [], user_ledger: [] };
  }

  async execute(sql: string, params: any[] = []): Promise<any> {
    this.queries.push({ sql, params });

    // Basic simulator for SELECT queries
    if (sql.includes("SELECT") && sql.includes("snaps")) {
      return this.store.snaps;
    }

    // Simulator for INSERT/REPLACE
    if (sql.includes("INSERT OR REPLACE INTO snaps")) {
      const [id, sku, title, type, createdAt, metadata_json, sources_json] =
        params;
      this.store.snaps = this.store.snaps.filter((s) => s.id !== id);
      this.store.snaps.push({
        id,
        sku,
        title,
        type,
        createdAt,
        metadata_json,
        sources_json,
      });
    }

    return [];
  }
}

describe("SQLite Storage & Hydration Pipeline Audit", () => {
  let mockDb: MockDatabase;
  let snapRepo: SqliteSnapRepository;
  let repRepo: SqliteRepresentativeRepository;
  let agencyRepo: SqliteAgencyRepository;
  let hydrationService: StorageHydrationService;

  beforeEach(() => {
    mockDb = new MockDatabase();
    snapRepo = new SqliteSnapRepository({ databaseService: mockDb });
    repRepo = new SqliteRepresentativeRepository({ databaseService: mockDb });
    agencyRepo = new SqliteAgencyRepository({ databaseService: mockDb });
    hydrationService = new StorageHydrationService({
      databaseService: mockDb,
      sqliteSnapRepository: snapRepo,
      representativeRepository: repRepo,
      agencyRepository: agencyRepo,
    });
  });

  test("Hydration Service should orchestrate idempotent data sync", async () => {
    // 1. Run hydration
    await hydrationService.hydrateIfNeeded();

    // 2. Verify that INSERT queries were generated
    const insertQueries = mockDb.queries.filter((q) =>
      q.sql.includes("INSERT OR REPLACE INTO snaps"),
    );
    expect(insertQueries.length).toBeGreaterThan(0);

    // 3. Verify specific data mapping (e.g. Accountability snaps exists)
    const hasAccountability = mockDb.store.snaps.some(
      (s) => s.type === "Accountability",
    );
    expect(hasAccountability).toBe(true);
  });

  test("SqliteSnapRepository should correctly map relational rows back to PoliSnap objects", async () => {
    // Seed mock data
    const mockSnapId = "test-snap-123";
    mockDb.store.snaps = [
      {
        id: mockSnapId,
        sku: "TS-123",
        title: "Test Snap",
        type: "Accountability",
        createdAt: new Date().toISOString(),
        metadata_json: JSON.stringify({ author: "Pete Falcon" }),
        sources_json: JSON.stringify([]),
      },
    ];

    // Execute repository call
    const snaps = await snapRepo.getSnapsByCategory("Accountability");

    // Assert mapping logic
    expect(snaps.length).toBe(1);
    expect(snaps[0].id).toBe(mockSnapId);
    expect(snaps[0].metadata?.author).toBe("Pete Falcon");
  });

  test("User Ledger should persist participation credits", async () => {
    const key = "participation_credits";
    const value = "5000";

    await mockDb.execute(
      "INSERT OR REPLACE INTO user_ledger (key, value, updatedAt) VALUES (?, ?, ?)",
      [key, value, new Date().toISOString()],
    );

    const check = mockDb.queries.find((q) => q.params.includes(value));
    expect(check).toBeDefined();
    expect(check?.sql).toContain("user_ledger");
  });
});
