export interface CorrelationIntelligence {
  id: string;
  representativeId: string;
  billId: string;
  score: number; // 0-100 (The Corruption Index)
  confidence: number; // 0-1 (Quality of the available data)
  donor: {
    name: string;
    industry: string;
    amount: number;
    date: string;
  };
  vote: {
    action: "YEA" | "NAY" | "PRESENT";
    date: string;
    result: "Passed" | "Failed";
  };
  insight: string; // The AI-generated "Connect-the-dots" narrative
}

export interface ICorrelationRepository {
  getCorruptionIndex(repId: string): Promise<CorrelationIntelligence[]>;
  getBillCorrelations(billId: string): Promise<CorrelationIntelligence[]>;
  getTopInfluencers(policyArea: string): Promise<CorrelationIntelligence[]>;

  // FPP (Financial Pulse Protocol)
  upsertCorrelation(correlation: CorrelationIntelligence): Promise<void>;
  getLatestSyncTime(): Promise<number>;
}
