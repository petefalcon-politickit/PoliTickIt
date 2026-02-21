import { PoliSnap } from "@/types/polisnap";

export interface ISnapRepository {
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
   * Retrieves recent notifications converted to PoliSnaps or simple notification objects
   */
  getRecentActivity(): Promise<PoliSnap[]>;

  /**
   * Retrieves multiple PoliSnaps by their IDs
   */
  getSnapsByIds(ids: string[]): Promise<PoliSnap[]>;

  /**
   * Retrieves all snaps associated with a specific representative.
   */
  getSnapsByRepresentativeId(repId: string): Promise<PoliSnap[]>;

  /**
   * Fetches all snaps from the data source (backend).
   */
  getAllSnaps?(): Promise<PoliSnap[]>;
}
