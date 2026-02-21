export interface AlignmentReport {
  representativeId: string;
  alignmentScore: number; // 0 to 100
  totalCorrelatedSnaps: number;
  matchedCount: number;
  divergedCount: number;
  unclearCount: number;
  period: string;
  topPolicyAlignments: {
    policy: string;
    score: number;
  }[];
  verdict:
    | "Strong Alignment"
    | "Moderate Alignment"
    | "Divergent"
    | "Insufficient Data";
}

/**
 * ICivicIntelligenceService
 * Logic layer for correlating user sentiment pulses with objective institutional data.
 */
export interface ICivicIntelligenceService {
  /**
   * Generates an Alignment Report (ROI Report) for a specific representative.
   * Correlates user's pulse_log with the representative's voting records.
   */
  getAlignmentReport(representativeId: string): Promise<AlignmentReport>;
}
