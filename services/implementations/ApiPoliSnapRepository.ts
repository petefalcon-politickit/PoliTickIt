import { PoliSnap } from "@/types/polisnap";
import { IPoliSnapRepository } from "../interfaces/IPoliSnapRepository";

/**
 * Real API implementation of the PoliSnap Repository.
 * This will eventually use fetch/axios to communicate with the C# backend.
 */
export class ApiPoliSnapRepository implements IPoliSnapRepository {
  private readonly baseUrl = "https://api.politickit.com/v1"; // Placeholder

  async getSnapsByCategory(category: string): Promise<PoliSnap[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/snaps?category=${category}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("API Error fetching snaps:", error);
      // Fallback or rethrow
      return [];
    }
  }

  async getSnapById(id: string): Promise<PoliSnap | null> {
    try {
      const response = await fetch(`${this.baseUrl}/snaps/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async getRecentActivity(): Promise<PoliSnap[]> {
    try {
      const response = await fetch(`${this.baseUrl}/snaps/recent`);
      return await response.json();
    } catch (error) {
      return [];
    }
  }
}
