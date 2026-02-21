import { Agency, Interest } from "@/types/user";

/**
 * Capability: Settings
 * Manages user identity, tracked agencies, policy interest areas, and app preferences.
 */
export interface ISettingsProvider {
  /**
   * Retrieves the user's tracked agencies.
   */
  getTrackedAgencies(): Promise<Agency[]>;

  /**
   * Retrieves the user's primary policy interest areas.
   */
  getInterestAreas(): Promise<Interest[]>;

  /**
   * Updates user preferences regarding data intensity and notification frequency.
   */
  updateGlobalPreference(key: string, value: any): Promise<boolean>;

  /**
   * Toggles tracking for an agency or interest area.
   */
  toggleTracking(type: "agency" | "interest", id: string): Promise<boolean>;
}
