import { IDatabaseService } from "../interfaces/IDatabaseService";
import { IUserLedgerService } from "../interfaces/IUserLedgerService";

/**
 * UserLedgerService
 * Implementation of IUserLedgerService using the SQLite Sovereignty Ledger.
 */
export class UserLedgerService implements IUserLedgerService {
  private db: IDatabaseService;

  constructor(opts: { databaseService: IDatabaseService }) {
    this.db = opts.databaseService;
  }

  async getString(key: string): Promise<string | null> {
    const result = await this.db.execute(
      "SELECT value FROM user_ledger WHERE key = ?;",
      [key],
    );

    if (result && result.length > 0) {
      return result[0].value;
    }

    return null;
  }

  async getNumber(key: string): Promise<number | null> {
    const value = await this.getString(key);
    if (value === null) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  async getBoolean(key: string): Promise<boolean | null> {
    const value = await this.getString(key);
    if (value === null) return null;
    return value === "true" || value === "1";
  }

  async set(key: string, value: string | number | boolean): Promise<void> {
    const stringValue = value.toString();
    const now = new Date().toISOString();

    await this.db.execute(
      `INSERT INTO user_ledger (key, value, updatedAt) 
       VALUES (?, ?, ?) 
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt;`,
      [key, stringValue, now],
    );
  }

  async remove(key: string): Promise<void> {
    await this.db.execute("DELETE FROM user_ledger WHERE key = ?;", [key]);
  }

  async clear(): Promise<void> {
    await this.db.execute("DELETE FROM user_ledger;");
  }
}
