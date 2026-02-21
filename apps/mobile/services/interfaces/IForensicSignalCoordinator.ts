export interface ForensicSignal {
  type: "pulse" | "sentiment" | "action" | "ripple";
  id: string; // snapId or resourceId
  elementId?: string;
  value?: number;
  metadata?: any;
}

export interface ImpactMetrics {
  credits: number;
  tierLevel: number;
  tierName: string;
}

/**
 * IForensicSignalCoordinator
 * The unified coordinator for all user engagement signals in Omni-OS.
 * Merges PulseService, TelemetryService, and RippleSyncService into a single forensic stream.
 */
export interface IForensicSignalCoordinator {
  /**
   * Emits a forensic signal to be normalized and persisted.
   */
  emitSignal(signal: ForensicSignal): Promise<void>;

  /**
   * Retrieves the current impact/participation metrics for the user.
   */
  getImpactMetrics(): Promise<ImpactMetrics>;

  /**
   * Retrieves recent signals (replacing getRecentPulses/History).
   */
  getRecentSignals(limit?: number): Promise<any[]>;

  /**
   * Register a callback for when signals result in credit updates.
   */
  onImpactUpdated(callback: (metrics: ImpactMetrics) => void): void;

  /**
   * Retrieves current activity counts based on domain intensity settings.
   */
  getActivityCounts(intensitySettings: any): Promise<any>;

  /**
   * Retrieves long-term participation stats for the User Dossier.
   */
  getDossierStats(): Promise<any>;

  /**
   * Retrieves a specific ripple state for a user.
   */
  getRipple(rippleId: string): Promise<any>;
}
