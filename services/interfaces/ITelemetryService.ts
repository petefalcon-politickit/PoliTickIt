/**
 * ITelemetryService
 * Interface for capturing user interactions and "Quantum Feedback".
 */
export interface ITelemetryService {
  /**
   * trackSentiment
   * Tracks a spectrum-based sentiment value for a specific snap element.
   * @param snapId The unique ID of the PoliSnap.
   * @param elementId The unique ID of the element within the snap.
   * @param value Normalized value between 0.0 and 1.0.
   */
  trackSentiment(
    snapId: string,
    elementId: string,
    value: number,
  ): Promise<boolean>;

  /**
   * trackAction
   * Tracks a discrete action taken by a user.
   * @param snapId The unique ID of the PoliSnap.
   * @param actionType The type of action (e.g., 'watchlist', 'contact', 'share').
   * @param metadata Optional additional context for the action.
   */
  trackAction(
    snapId: string,
    actionType: string,
    metadata?: any,
  ): Promise<boolean>;

  /**
   * getContributionCredits
   * Returns the current user's participation capital.
   */
  getContributionCredits(): Promise<number>;

  /**
   * onCreditsUpdated
   * Register a callback for when credits change (e.g., after an action).
   */
  onCreditsUpdated(callback: (credits: number) => void): void;
}
