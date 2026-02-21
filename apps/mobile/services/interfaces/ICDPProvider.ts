
export interface ConstituentProfile {
  districtId: string;
  state: string;
  interests: string[]; // IDs of interest areas
  trackedAgencies: string[]; // IDs of agencies
  biometryEnabled: boolean;
  notificationLevel: "high" | "medium" | "low";
  lastProfileUpdate: string;
}

/**
 * ICDPProvider (Constituent Data Protocol)
 * Manages the sovereign local profile and preferences of the constituent.
 */
export interface ICDPProvider {
  /**
   * Retrieves the full sovereign profile.
   */
  getProfile(): Promise<ConstituentProfile>;

  /**
   * Updates specific fields in the profile.
   */
  updateProfile(updates: Partial<ConstituentProfile>): Promise<void>;

  /**
   * Syncs the profile with the backend "Truth Mirror" (encrypted backup).
   */
  syncProfile(): Promise<void>;

  /**
   * Toggles tracking for an agency or interest area.
   */
  toggleTracking(type: "agency" | "interest", id: string): Promise<void>;
}
