import { UserLedgerService } from "@/services/implementations/UserLedgerService";
import { IDatabaseService } from "@/services/interfaces/IDatabaseService";

/**
 * Mock database for testing UserLedgerService.
 */
class MockDatabase implements IDatabaseService {
  public store: Record<string, string> = {};

  async initialize() {
    return Promise.resolve();
  }
  async reset() {
    this.store = {};
  }

  async execute(sql: string, params: any[] = []): Promise<any> {
    // getString implementation
    if (sql.includes("SELECT value FROM user_ledger WHERE key = ?")) {
      const key = params[0];
      return this.store[key] ? [{ value: this.store[key] }] : [];
    }

    // set implementation (simplified for testing)
    if (sql.includes("INSERT INTO user_ledger")) {
      const [key, value] = params;
      this.store[key] = value;
      return { rowsAffected: 1 };
    }

    // remove implementation
    if (sql.includes("DELETE FROM user_ledger WHERE key = ?")) {
      const key = params[0];
      delete this.store[key];
      return { rowsAffected: 1 };
    }

    // clear implementation
    if (sql.includes("DELETE FROM user_ledger")) {
      this.store = {};
      return { rowsAffected: 1 };
    }

    return [];
  }
}

describe("UserLedgerService Forensic Audit", () => {
  let mockDb: MockDatabase;
  let userLedger: UserLedgerService;

  beforeEach(() => {
    mockDb = new MockDatabase();
    userLedger = new UserLedgerService({ databaseService: mockDb });
  });

  test("should persist and retrieve string values correctly", async () => {
    await userLedger.set("test_key", "test_value");
    const val = await userLedger.getString("test_key");
    expect(val).toBe("test_value");
  });

  test("should handle numeric values with type safety", async () => {
    await userLedger.set("voter_score", 85);
    const val = await userLedger.getNumber("voter_score");
    expect(val).toBe(85);
    expect(typeof val).toBe("number");
  });

  test("should handle boolean values as relational flags", async () => {
    await userLedger.set("is_verified", true);
    let val = await userLedger.getBoolean("is_verified");
    expect(val).toBe(true);

    await userLedger.set("is_verified", false);
    val = await userLedger.getBoolean("is_verified");
    expect(val).toBe(false);
  });

  test("should handle missing keys gracefully by returning null", async () => {
    const val = await userLedger.getString("non_existent_key");
    expect(val).toBeNull();
  });

  test("should remove keys from the sovereignty ledger", async () => {
    await userLedger.set("temp_signal", "to_be_deleted");
    await userLedger.remove("temp_signal");
    const val = await userLedger.getString("temp_signal");
    expect(val).toBeNull();
  });

  test("should clear the ledger for fresh sessions", async () => {
    await userLedger.set("key1", "val1");
    await userLedger.set("key2", "val2");
    await userLedger.clear();

    expect(await userLedger.getString("key1")).toBeNull();
    expect(await userLedger.getString("key2")).toBeNull();
  });

  test("should perform upserts on key conflicts", async () => {
    await userLedger.set("participation_credits", 100);
    await userLedger.set("participation_credits", 250);
    const val = await userLedger.getNumber("participation_credits");
    expect(val).toBe(250);
  });
});
