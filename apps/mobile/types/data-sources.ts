export interface FECDonation {
  id: string;
  contributorName: string;
  contributorType: "PAC" | "Individual" | "Corporate";
  amount: number;
  date: string;
  recipientId: string;
  sector?: string;
}

export interface LegislativeVote {
  id: string;
  billId: string;
  billTitle: string;
  vote: "YEA" | "NAY" | "PRESENT" | "NOT VOTING";
  date: string;
  representativeId: string;
  actionDescription: string;
}

export interface ImpactZone {
  sectorCode: string; // FEC Sector Code (e.g., 'H' for Health)
  sectorName: string;
  associatedCommittees: string[]; // Committee IDs (e.g., 'SSHR' for Senate HELP)
  interestArea:
    | "Economics"
    | "Infrastructure"
    | "Accountability"
    | "Ethics"
    | "Civic Dividend";
}

export interface DonorOracleResult {
  jurisdictionMatch: boolean;
  multiplier: number;
  impactZone: ImpactZone;
  explanation: string;
}

export interface CorrelationResult {
  donation: FECDonation;
  vote: LegislativeVote;
  timeGapDays: number;
  significanceScore: number; // 0-100
  correlationType: "Proximity" | "Volume" | "HistoricalPattern";
  oracleResult?: DonorOracleResult;
}
