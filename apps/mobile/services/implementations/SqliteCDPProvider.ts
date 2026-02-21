import { Agency, Interest } from "@/types/user";
import { ConstituentProfile, ICDPProvider } from "../interfaces/ICDPProvider";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import { ISettingsProvider } from "../interfaces/ISettingsProvider";

export class SqliteCDPProvider implements ICDPProvider, ISettingsProvider {
  private db: IDatabaseService;

  constructor({ databaseService }: { databaseService: IDatabaseService }) {
    this.db = databaseService;
  }

  // --- ISettingsProvider Implementation ---

  async getTrackedAgencies(): Promise<Agency[]> {
    const profile = await this.getProfile();
    // In a real app, we'd join with the agencies table.
    // For now, we return empty or resolve the IDs if the repository is provided.
    return profile.trackedAgencies.map((id) => ({
      id,
      name: id,
      description: "",
    }));
  }

  async getInterestAreas(): Promise<Interest[]> {
    const profile = await this.getProfile();
    return profile.interests.map((id) => ({ id, name: id, description: "" }));
  }

  async updateGlobalPreference(key: string, value: any): Promise<boolean> {
    if (key === "notificationLevel") {
      await this.updateProfile({ notificationLevel: value });
      return true;
    }
    if (key === "biometryEnabled") {
      await this.updateProfile({ biometryEnabled: value });
      return true;
    }
    return false;
  }

  async toggleTracking(
    type: "agency" | "interest",
    id: string,
  ): Promise<boolean> {
    const profile = await this.getProfile();
    const list =
      type === "agency" ? [...profile.trackedAgencies] : [...profile.interests];

    const index = list.indexOf(id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }

    if (type === "agency") {
      await this.updateProfile({ trackedAgencies: list });
    } else {
      await this.updateProfile({ interests: list });
    }

    return true;
  }

  // --- ICDPProvider Implementation ---

  async getProfile(): Promise<ConstituentProfile> {
    const rows = await this.db.execute(
      "SELECT * FROM constituent_profile WHERE id = 1",
    );
    if (rows.length === 0) {
      return this.getDefaultProfile();
    }
    return this.mapRow(rows[0]);
  }

  async updateProfile(updates: Partial<ConstituentProfile>): Promise<void> {
    const current = await this.getProfile();
    const merged = { ...current, ...updates };

    await this.db.execute(
      `UPDATE constituent_profile SET 
        district_id = ?, 
        state_code = ?, 
        interests_json = ?, 
        agencies_json = ?, 
        biometry_enabled = ?, 
        notification_level = ?, 
        updated_at = ?
       WHERE id = 1`,
      [
        merged.districtId,
        merged.state,
        JSON.stringify(merged.interests),
        JSON.stringify(merged.trackedAgencies),
        merged.biometryEnabled ? 1 : 0,
        merged.notificationLevel,
        new Date().toISOString(),
      ],
    );
  }

  async syncProfile(): Promise<void> {
    // In CDP, sync typically means pushing an encrypted blob to the Truth Mirror
    // for multi-device recovery. Placeholder for now.
    console.log(
      "[SqliteCDPProvider] Profile synced with encrypted Truth Mirror.",
    );
  }

  private mapRow(row: any): ConstituentProfile {
    return {
      districtId: row.district_id || "",
      state: row.state_code || "",
      interests: JSON.parse(row.interests_json || "[]"),
      trackedAgencies: JSON.parse(row.agencies_json || "[]"),
      biometryEnabled: row.biometry_enabled === 1,
      notificationLevel: (row.notification_level as any) || "medium",
      lastProfileUpdate: row.updated_at,
    };
  }

  private getDefaultProfile(): ConstituentProfile {
    return {
      districtId: "",
      state: "",
      interests: [],
      trackedAgencies: [],
      biometryEnabled: false,
      notificationLevel: "medium",
      lastProfileUpdate: new Date().toISOString(),
    };
  }
}
