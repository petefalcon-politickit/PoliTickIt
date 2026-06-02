import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithTimeout } from "../fetch-utils";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import { IWatchlistService } from "../interfaces/IWatchlistService";
import { apiAuthService } from "./ApiAuthService";

const ACCESS_TOKEN_KEY = "@politickit:accessToken";
const BASE_URL = "http://10.0.0.252:5000/api";

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
        "INSERT OR IGNORE INTO watchlist (snap_id, createdAt, synced) VALUES (?, ?, 0)",
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

  async syncToCloud(): Promise<void> {
    // ── Auth check ──────────────────────────────────────────────────────────
    let token =
      apiAuthService.getAccessToken() ??
      (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
    if (!token) {
      console.warn(
        "[WatchlistService] syncToCloud: no access token — skipping",
      );
      return;
    }

    const makeHeaders = (t: string): Record<string, string> => ({
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
    });

    const refreshIfNeeded = async (): Promise<string | null> => {
      const refreshed = await apiAuthService.refreshSession();
      if (!refreshed) return null;
      return (
        apiAuthService.getAccessToken() ??
        (await AsyncStorage.getItem(ACCESS_TOKEN_KEY))
      );
    };

    // ── Step 1: Push unsynced local items to server ──────────────────────────
    let unsynced: Array<{ snap_id: string }> = [];
    try {
      unsynced = await this.db.execute(
        "SELECT snap_id FROM watchlist WHERE synced = 0",
      );
    } catch (err) {
      console.error(
        "[WatchlistService] syncToCloud: failed to query unsynced",
        err,
      );
      return;
    }

    for (const row of unsynced) {
      const snapId = row.snap_id;
      try {
        let res = await fetchWithTimeout(
          `${BASE_URL}/watchlist/${encodeURIComponent(snapId)}`,
          {
            method: "POST",
            headers: makeHeaders(token),
            timeout: 8000,
          },
        );

        if (res.status === 401) {
          const newToken = await refreshIfNeeded();
          if (!newToken) continue;
          token = newToken;
          res = await fetchWithTimeout(
            `${BASE_URL}/watchlist/${encodeURIComponent(snapId)}`,
            {
              method: "POST",
              headers: makeHeaders(token),
              timeout: 8000,
            },
          );
        }

        if (res.ok || res.status === 409) {
          await this.db.execute(
            "UPDATE watchlist SET synced = 1, syncedAt = ? WHERE snap_id = ?",
            [new Date().toISOString(), snapId],
          );
        } else {
          console.warn(
            `[WatchlistService] syncToCloud: POST ${snapId} → ${res.status}`,
          );
        }
      } catch (err: any) {
        console.warn(
          `[WatchlistService] syncToCloud: failed to push ${snapId}:`,
          err.message,
        );
      }
    }

    // ── Step 2: Pull server list and merge any server-only items locally ─────
    try {
      let res = await fetchWithTimeout(`${BASE_URL}/watchlist`, {
        method: "GET",
        headers: makeHeaders(token),
        timeout: 8000,
      });

      if (res.status === 401) {
        const newToken = await refreshIfNeeded();
        if (!newToken) return;
        token = newToken;
        res = await fetchWithTimeout(`${BASE_URL}/watchlist`, {
          method: "GET",
          headers: makeHeaders(token),
          timeout: 8000,
        });
      }

      if (!res.ok) return;

      const data = (await res.json()) as { snapIds: string[] };
      const serverIds: string[] = data.snapIds ?? [];

      for (const snapId of serverIds) {
        await this.db.execute(
          "INSERT OR IGNORE INTO watchlist (snap_id, createdAt, synced, syncedAt) VALUES (?, ?, 1, ?)",
          [snapId, new Date().toISOString(), new Date().toISOString()],
        );
      }
    } catch (err: any) {
      console.warn("[WatchlistService] syncToCloud: pull failed:", err.message);
    }
  }
}
