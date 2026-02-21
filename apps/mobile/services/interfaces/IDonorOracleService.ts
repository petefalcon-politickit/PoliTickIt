import { DonorOracleResult, ImpactZone } from "@/types/data-sources";

export { DonorOracleResult, ImpactZone };

export interface IDonorOracleService {
  /**
   * Evaluates the strategic significance of a donation to a specific representative.
   * @param sector The FEC sector of the donor.
   * @param representativeId The ID of the recipient representative.
   */
  evaluateInfluence(
    sector: string,
    representativeId: string,
  ): Promise<DonorOracleResult>;

  /**
   * Retrieves all committees associated with a specific sector.
   */
  getAssociatedCommittees(sector: string): string[];
}
