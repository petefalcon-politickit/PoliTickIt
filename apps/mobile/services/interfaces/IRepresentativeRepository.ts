import { Representative } from "@/types/user";

export interface IRepresentativeRepository {
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
   * Persists a representative to the local database
   */
  saveRepresentative(rep: Representative): Promise<void>;

  /**
   * Sovereign Sync: Upserts a representative without overwriting local-only user state
   * (like 'isFollowing'). Part of the RSP (Representative Sync Protocol).
   */
  upsertSovereign(rep: Representative): Promise<void>;

  /**
   * Toggles the following status of a representative
   */
  toggleFollow(id: string, isFollowing: boolean): Promise<void>;
}
