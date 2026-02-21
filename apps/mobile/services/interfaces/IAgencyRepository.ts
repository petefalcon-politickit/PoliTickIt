export interface Agency {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  is_following?: boolean;
  metadata?: {
    constituentCount?: number;
    activityPulse?: number;
    lastAuditDate?: string;
  };
}

/**
 * IAgencyRepository
 * Handles relational persistence for Policy Areas and Government Agencies.
 */
export interface IAgencyRepository {
  /**
   * Retrieves all available agencies/policy areas.
   */
  getAllAgencies(): Promise<Agency[]>;

  /**
   * Retrieves a specific agency by ID.
   */
  getAgencyById(id: string): Promise<Agency | null>;

  /**
   * Persists an agency to the local database.
   */
  saveAgency(agency: Agency): Promise<void>;

  /**
   * Toggles the follow status for an agency.
   */
  toggleFollow(id: string, isFollowing: boolean): Promise<void>;

  /**
   * Deletes an agency from the local database.
   */
  deleteAgency(id: string): Promise<void>;
}
