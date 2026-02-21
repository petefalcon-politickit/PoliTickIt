import { Representative } from "@/types/user";
import { fetchWithTimeout } from "../fetch-utils";
import { IRepresentativeRepository } from "../interfaces/IRepresentativeRepository";

/**
 * Real API implementation of the Representative Repository for RSP.
 */
export class ApiRepresentativeRepository implements IRepresentativeRepository {
  private readonly baseUrl = "http://10.0.0.252:5000/api";

  async getAllRepresentatives(): Promise<Representative[]> {
    const url = `${this.baseUrl}/representatives/registry`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 10000 });
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      console.error(
        `[ApiRepresentativeRepository] Failed to fetch representatives from ${url}:`,
        error.message,
      );
      return [];
    }
  }

  async getRepresentativeById(id: string): Promise<Representative | null> {
    const url = `${this.baseUrl}/representatives/${id}`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 5000 });
      if (!response.ok) return null;
      return await response.json();
    } catch (error: any) {
      console.error(
        `[ApiRepresentativeRepository] Failed to fetch representative ${id}:`,
        error.message,
      );
      return null;
    }
  }

  async saveRepresentative(rep: Representative): Promise<void> {
    throw new Error("Local persistence not supported on API repository");
  }

  async upsertSovereign(rep: Representative): Promise<void> {
    throw new Error("Local persistence not supported on API repository");
  }

  async toggleFollow(id: string, isFollowing: boolean): Promise<void> {
    // This would normally call a POST to the backend, but for RSP sync, it's local sovereignty first
  }
}
