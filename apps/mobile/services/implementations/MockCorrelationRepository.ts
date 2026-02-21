import {
    CorrelationIntelligence,
    ICorrelationRepository,
} from "../interfaces/ICorrelationRepository";

export class MockCorrelationRepository implements ICorrelationRepository {
  private mockData: CorrelationIntelligence[] = [
    {
      id: "corr-001",
      representativeId: "C001131",
      billId: "hr-882",
      score: 88,
      confidence: 0.95,
      donor: {
        name: "Global Energy PAC",
        industry: "Energy & Natural Resources",
        amount: 5000,
        date: "2024-11-20",
      },
      vote: {
        action: "YEA",
        date: "2024-11-24",
        result: "Passed",
      },
      insight:
        "A maximum individual donation was received from Global Energy PAC just 4 days prior to the 'YEA' vote on H.R. 882 (Infrastructure). This aligns with a significant trend of Energy Sector support for recent legislative expansion.",
    },
    {
      id: "corr-003",
      representativeId: "C001131",
      billId: "hr-1050",
      score: 94,
      confidence: 0.98,
      donor: {
        name: "PharmaAction Group",
        industry: "Pharmaceuticals/Health",
        amount: 3300,
        date: "2025-01-15",
      },
      vote: {
        action: "NAY",
        date: "2025-01-16",
        result: "Failed",
      },
      insight:
        "Critical Correlation Detected: Large Pharma PAC donation arrived exactly 24 hours before the 'NAY' vote on the Prescription Transparency Act. The score reflects extreme temporal proximity and donor magnitude.",
    },
    {
      id: "corr-004",
      representativeId: "C001131",
      billId: "s-22",
      score: 62,
      confidence: 0.85,
      donor: {
        name: "Tech-Forward Coalition",
        industry: "Electronic Manufacturing",
        amount: 2500,
        date: "2024-03-12",
      },
      vote: {
        action: "YEA",
        date: "2024-03-24",
        result: "Passed",
      },
      insight:
        "Financial support from Tech-Forward Coalition preceded the S.22 vote by 12 days. While significant, the delay reduces the index score compared to immediate-proximity alerts.",
    },
    {
      id: "corr-002",
      representativeId: "C001131",
      billId: "hr-102",
      score: 12,
      confidence: 0.4,
      donor: {
        name: "Local Library Foundation",
        industry: "Non-Profit",
        amount: 250,
        date: "2023-05-10",
      },
      vote: {
        action: "YEA",
        date: "2023-11-24",
        result: "Passed",
      },
      insight:
        "Small-scale donation received months prior to vote. Low significance correlation.",
    },
  ];

  async getCorruptionIndex(repId: string): Promise<CorrelationIntelligence[]> {
    return this.mockData.filter((d) => d.representativeId === repId);
  }

  async getBillCorrelations(
    billId: string,
  ): Promise<CorrelationIntelligence[]> {
    return this.mockData.filter((d) => d.billId === billId);
  }

  async getTopInfluencers(
    policyArea: string,
  ): Promise<CorrelationIntelligence[]> {
    // Basic mock logic: return everything as influencers for this prototype
    return this.mockData;
  }
}
