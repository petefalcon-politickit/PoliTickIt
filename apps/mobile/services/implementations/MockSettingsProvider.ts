import { agencies, interests } from "@/constants/mockData";
import { Agency, Interest } from "@/types/user";
import { ISettingsProvider } from "../interfaces/ISettingsProvider";

export class MockSettingsProvider implements ISettingsProvider {
  async getTrackedAgencies(): Promise<Agency[]> {
    return agencies || [];
  }

  async getInterestAreas(): Promise<Interest[]> {
    return interests || [];
  }

  async updateGlobalPreference(key: string, value: any): Promise<boolean> {
    console.log(`[MockSettingsProvider] Updated preference ${key} to ${value}`);
    return true;
  }

  async toggleTracking(
    type: "agency" | "interest",
    id: string,
  ): Promise<boolean> {
    console.log(`[MockSettingsProvider] Toggled tracking for ${type}: ${id}`);
    return true;
  }
}
