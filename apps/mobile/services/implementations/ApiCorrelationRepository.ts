import { fetchWithTimeout } from "../fetch-utils";
import {
    CorrelationIntelligence,
    ICorrelationRepository,
} from "../interfaces/ICorrelationRepository";

export class ApiCorrelationRepository implements ICorrelationRepository {
  private baseUrl = "http://10.0.0.252:5000/api";

  async getCorruptionIndex(repId: string): Promise<CorrelationIntelligence[]> {
    const response = await fetchWithTimeout(
      `${this.baseUrl}/correlations/representative/${repId}`,
    );
    if (!response.ok) return [];
    return await response.json();
  }

  async getBillCorrelations(
    billId: string,
  ): Promise<CorrelationIntelligence[]> {
    const response = await fetchWithTimeout(
      `${this.baseUrl}/correlations/bill/${billId}`,
    );
    if (!response.ok) return [];
    return await response.json();
  }

  async getTopInfluencers(
    policyArea: string,
  ): Promise<CorrelationIntelligence[]> {
    const response = await fetchWithTimeout(
      `${this.baseUrl}/correlations/top?policyArea=${policyArea}`,
    );
    if (!response.ok) return [];
    return await response.json();
  }

  // FPP specific sync method (not part of the standard ICorrelationRepository interface but used for RSP/FPP patterns)
  async fetchRegistry(since: number = 0): Promise<CorrelationIntelligence[]> {
    const response = await fetchWithTimeout(
      `${this.baseUrl}/correlations/sync?since=${since}`,
    );
    if (!response.ok) return [];
    return await response.json();
  }

  async upsertCorrelation(correlation: CorrelationIntelligence): Promise<void> {
    throw new Error(
      "API repository is read-only for correlations in this context.",
    );
  }

  async getLatestSyncTime(): Promise<number> {
    return 0; // Not used in API repo
  }
}
