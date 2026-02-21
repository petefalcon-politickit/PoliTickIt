export interface ParticipationAction {
  id?: number;
  type:
    | "VOTE_REACTION"
    | "PETITION_SIGN"
    | "DONATION_VERIFIED"
    | "SURVEY_COMPLETE";
  resourceId: string; // Snap ID, Rep ID, or Bill ID
  creditsEarned: number;
  timestamp: string;
  metadata: Record<string, any>;
  rationalSentiment: number;
  isSynced: boolean;
}

export interface IParticipationRepository {
  /**
   * Logs a new civic action to the local sovereign ledger.
   */
  logAction(
    action: Omit<ParticipationAction, "id" | "timestamp" | "isSynced">,
  ): Promise<number>;

  /**
   * Retrieves all unsynced actions for the CPAP upload flow.
   */
  getUnsyncedActions(): Promise<ParticipationAction[]>;

  /**
   * Marks a set of actions as synced after successful backend audit.
   */
  markAsSynced(ids: number[]): Promise<void>;

  /**
   * Retrieves the total participation credits for the user.
   */
  getTotalCredits(): Promise<number>;

  /**
   * Retrieves specific participation history for a resource.
   */
  getActionsForResource(resourceId: string): Promise<ParticipationAction[]>;
}
