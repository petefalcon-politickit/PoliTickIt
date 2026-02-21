import { fetchWithTimeout } from "../fetch-utils";
import { ParticipationAction } from "../interfaces/IParticipationRepository";

export class ApiParticipationRepository {
  private baseUrl = "http://10.0.0.252:5000/api";

  async uploadActions(actions: ParticipationAction[]): Promise<number[]> {
    if (actions.length === 0) return [];

    const url = `${this.baseUrl}/participation/audit`;
    try {
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions }),
        timeout: 10000,
      });

      if (!response.ok) throw new Error("Audit upload failed");

      // The backend returns the list of IDs that were successfully audited/recorded
      const result = await response.json();
      return result.syncedIds || [];
    } catch (error) {
      console.error("[ApiParticipationRepository] CPAP upload failed:", error);
      return [];
    }
  }
}
