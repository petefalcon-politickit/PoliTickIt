import { PoliSnap } from "@/types/polisnap";
import { Representative } from "@/types/user";

export interface IPoliSnapRepository {
  /**
   * Retrieves a set of PoliSnaps for a specific feed/section
   * @param category The category of snaps (e.g., 'accountability', 'community', 'knowledge')
   */
  getSnapsByCategory(category: string): Promise<PoliSnap[]>;

  /**
   * Retrieves a single PoliSnap by its ID
   * @param id The unique identifier of the PoliSnap
   */
  getSnapById(id: string): Promise<PoliSnap | null>;

  /**
   * Retrieves profile data for a specific representative
   * @param id The Bioguide ID or unique ID of the representative
   */
  getRepresentativeById(id: string): Promise<Representative | null>;

  /**
   * Retrieves a list of all managed representatives
   */
  getAllRepresentatives(): Promise<Representative[]>;

  /**
   * Retrieves recent notifications converted to PoliSnaps or simple notification objects
   */
  getRecentActivity(): Promise<PoliSnap[]>;

  /**
   * Retrieves multiple PoliSnaps by their IDs
   */
  getSnapsByIds(ids: string[]): Promise<PoliSnap[]>;
}
