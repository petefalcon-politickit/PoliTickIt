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
    const url = `${this.baseUrl}/snaps/registry`;
    try {
      // Increased timeout to 10s to account for backend cold-starts/rebuilds
      const response = await fetchWithTimeout(url, { timeout: 10000 });
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      return await response.json();
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
}
