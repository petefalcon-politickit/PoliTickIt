import { IDatabaseService } from "../interfaces/IDatabaseService";
import { IWatchlistService } from "../interfaces/IWatchlistService";

/**
 * WatchlistService
 * Implementation of IWatchlistService using the hardened SQLite Relational Ledger.
 * Migrated from AsyncStorage to support forensic joins and relational integrity.
 */
export class WatchlistService implements IWatchlistService {
  private db: IDatabaseService;

  constructor({ databaseService }: { databaseService: IDatabaseService }) {
    this.db = databaseService;
  }

  async getWatchedIds(): Promise<string[]> {
    try {
      const rows = await this.db.execute(
        "SELECT snap_id FROM watchlist ORDER BY createdAt DESC",
      );
      return rows.map((r: any) => r.snap_id);
    } catch (error) {
      console.error("Failed to retrieve watchlist from SQLite:", error);
      return [];
    }
  }

  async addToWatchlist(snapId: string): Promise<boolean> {
    try {
      await this.db.execute(
        "INSERT OR IGNORE INTO watchlist (snap_id, createdAt) VALUES (?, ?)",
        [snapId, new Date().toISOString()],
      );
      return true;
    } catch (error) {
      console.error("Failed to add to watchlist in SQLite:", error);
      return false;
    }
  }

  async removeFromWatchlist(snapId: string): Promise<boolean> {
    try {
      await this.db.execute("DELETE FROM watchlist WHERE snap_id = ?", [
        snapId,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to remove from watchlist in SQLite:", error);
      return false;
    }
  }

  async isWatched(snapId: string): Promise<boolean> {
    try {
      const rows = await this.db.execute(
        "SELECT 1 FROM watchlist WHERE snap_id = ?",
        [snapId],
      );
      return rows.length > 0;
    } catch (error) {
      return false;
    }
  }
}
