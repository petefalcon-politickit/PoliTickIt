export interface IHapticService {
  /**
   * Use for "Democratic Wins" (Success) - positive participation or consensus reached.
   */
  triggerSuccess(): Promise<void>;

  /**
   * Use for "Accountability Warnings" (Alerts) - corruption alerts, negative trends, or warnings.
   */
  triggerWarning(): Promise<void>;

  /**
   * Standard light impact for navigation or minor interactions.
   */
  triggerLightImpact(): Promise<void>;

  /**
   * Medium impact for primary user actions.
   */
  triggerMediumImpact(): Promise<void>;

  /**
   * Heavy impact for significant milestones.
   */
  triggerHeavyImpact(): Promise<void>;
}
