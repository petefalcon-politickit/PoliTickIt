import { PoliSnap } from "@/types/polisnap";
import { fetchWithTimeout } from "../fetch-utils";
import { ISnapRepository } from "../interfaces/ISnapRepository";

/**
 * Real API implementation of the Snap Repository.
 * This will eventually use fetch/axios to communicate with the C# backend.
 */
export class ApiSnapRepository implements ISnapRepository {
  // Pointing to your verified machine IP for physical device testing
  // Defaulting to 5000 for local C# development
  private readonly baseUrl = "http://10.0.0.252:5000/api";

  async getAllSnaps(): Promise<PoliSnap[]> {
    const url = `${this.baseUrl}/snaps?limit=200`;
    try {
      // Increased timeout to 10s to account for backend cold-starts/rebuilds
      const response = await fetchWithTimeout(url, { timeout: 10000 });
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      const data = await response.json();
      // API returns SnapFeedResponse { snaps: [...], total, mode, syncTimestamp }
      return Array.isArray(data) ? data : (data.snaps ?? []);
    } catch (error: any) {
      console.error(
        `[ApiSnapRepository] Failed to fetch snaps from ${url}:`,
        error.message,
      );
      return [];
    }
  }

  async getSnapsByCategory(category: string): Promise<PoliSnap[]> {
    try {
      // In the minimal API approach, we might just filter all snaps locally if the API doesn't support it yet
      // but let's assume we want to call the registry for now or a filtered endpoint if we add it later.
      const snaps = await this.getAllSnaps();
      return snaps.filter((s) => s.type === category);
    } catch (error) {
      console.error("API Error fetching snaps by category:", error);
      return [];
    }
  }

  async getSnapById(id: string): Promise<PoliSnap | null> {
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/snaps/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async getRecentActivity(): Promise<PoliSnap[]> {
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/snaps/recent`);
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  async getSnapsByIds(ids: string[]): Promise<PoliSnap[]> {
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/snaps/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  async getSnapsByRepresentativeId(repId: string): Promise<PoliSnap[]> {
    const url = `${this.baseUrl}/snaps?channels=${encodeURIComponent(`Representative:${repId}`)}&limit=100`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 10000 });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : (data.snaps ?? []);
    } catch (error) {
      console.warn(
        `[ApiSnapRepository] getSnapsByRepresentativeId failed for ${repId}:`,
        error,
      );
      return [];
    }
  }

  /**
   * Fetches only snaps updated after `since` (ISO-8601 string).
   * Includes retracted tombstones so callers can evict them locally.
   * Returns the server-stamped syncTimestamp alongside the snaps.
   */
  async getDeltaSnaps(
    since: string,
  ): Promise<{ snaps: PoliSnap[]; syncTimestamp: string }> {
    const url = `${this.baseUrl}/snaps/delta?since=${encodeURIComponent(since)}`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 10000 });
      if (!response.ok)
        throw new Error(`Delta fetch failed: ${response.status}`);
      const data = await response.json();
      return {
        snaps: data.snaps ?? [],
        syncTimestamp: data.syncTimestamp ?? new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(`[ApiSnapRepository] getDeltaSnaps failed:`, error.message);
      return { snaps: [], syncTimestamp: since };
    }
  }

  /**
   * Fetches snaps for a specific channel with a configurable limit.
   * Used for proactive cache hydration (e.g. on representative follow).
   */
  async getSnapsByChannel(channel: string, limit = 50): Promise<PoliSnap[]> {
    const url = `${this.baseUrl}/snaps?channels=${encodeURIComponent(channel)}&limit=${limit}`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 10000 });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : (data.snaps ?? []);
    } catch (error) {
      console.warn(
        `[ApiSnapRepository] getSnapsByChannel failed for ${channel}:`,
        error,
      );
      return [];
    }
  }
}
