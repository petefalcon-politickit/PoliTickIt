import {
    CorrelationResult,
    FECDonation,
    LegislativeVote,
} from "@/types/data-sources";
import { PoliSnap } from "@/types/polisnap";
import { IFECVoteNormalizer } from "../interfaces/IFECVoteNormalizer";

export class FECVoteNormalizer implements IFECVoteNormalizer {
  findCorrelations(
    donations: FECDonation[],
    votes: LegislativeVote[],
    config: { maxDaysGap?: number; minAmount?: number } = {
      maxDaysGap: 7,
      minAmount: 1000,
    },
  ): CorrelationResult[] {
    const correlations: CorrelationResult[] = [];
    const maxGap = config.maxDaysGap || 7;
    const minAmt = config.minAmount || 1000;

    for (const donation of donations) {
      if (donation.amount < minAmt) continue;

      const donationDate = new Date(donation.date);

      for (const vote of votes) {
        if (donation.recipientId !== vote.representativeId) continue;

        const voteDate = new Date(vote.date);
        const diffTime = Math.abs(voteDate.getTime() - donationDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= maxGap) {
          correlations.push({
            donation,
            vote,
            timeGapDays: diffDays,
            significanceScore: this.calculateSignificance(donation, diffDays),
            correlationType: "Proximity",
          });
        }
      }
    }

    return correlations.sort(
      (a, b) => b.significanceScore - a.significanceScore,
    );
  }

  private calculateSignificance(
    donation: FECDonation,
    gapDays: number,
  ): number {
    // UPDATED LOGIC per CAPABILITY_CORRUPTION_INDEX.md

    // 1. Temporal Proximity (Max 30 points)
    let timingScore = 0;
    if (gapDays <= 7) {
      timingScore = 30;
    } else if (gapDays <= 30) {
      timingScore = 15;
    } else {
      timingScore = Math.max(0, 15 - (gapDays - 30) * 0.5);
    }

    // 2. Financial Magnitude (Max 70 points)
    // Individual limit is ~3300-5000 depending on cycle/entity
    // We treat 5000 as the 100% magnitude mark for this index
    const magnitudeScore = Math.min((donation.amount / 5000) * 70, 70);

    return Math.round(timingScore + magnitudeScore);
  }

  generateCorrelationSnap(correlation: CorrelationResult): PoliSnap {
    const { donation, vote, timeGapDays } = correlation;

    return {
      id: `corr-${donation.id}-${vote.id}`,
      sku: `PTS-CORR-${donation.id}`,
      title: `Influence Correlation: ${vote.billId}`,
      type: "Accountability",
      createdAt: new Date().toISOString(),
      sources: [
        { name: "FEC.gov", url: "https://www.fec.gov" },
        { name: "Congress.gov", url: "https://www.congress.gov" },
      ],
      metadata: {
        policyArea: "Accountability",
        insightType: "Financial Correlation",
        headerElementId: "rep-header",
      },
      elements: [
        {
          id: "rep-header",
          type: "Header.Representative",
          data:
            vote.representativeId === "C001131"
              ? {
                  id: "C001131",
                  name: "Greg Casar",
                  party: "Democrat",
                  location: "Texas, District 35",
                  position: "Representative",
                  imgUri:
                    "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
                  tags: [{ name: "Progressive Caucus", type: "primary" }],
                }
              : {
                  id: vote.representativeId,
                  name: "Representative", // This should be looked up from a rep service in real app
                  party: "Unknown",
                  location: "Unknown",
                  position: "Representative",
                  imgUri: `https://unitedstates.github.io/images/congress/225x275/${vote.representativeId}.jpg`,
                },
        },
        {
          id: "corruption-index",
          type: "Metric.CorruptionIndex",
          data: {
            title:
              correlation.significanceScore >= 90
                ? "CRITICAL CORRELATION"
                : "HIGH ALERT: FINANCIAL PROXIMITY",
            score: correlation.significanceScore,
            donor: donation.contributorName,
            industry: donation.sector || "General Industry",
            amount: `$${donation.amount.toLocaleString()}`,
            voteAction: `${vote.vote} (${vote.billId})`,
            insight: `Critical Correlation Detected: Large PAC donation arrived ${timeGapDays} days ${new Date(donation.date) < new Date(vote.date) ? "before" : "after"} the vote on ${vote.billId}. This score accounts for the weighted temporal proximity multiplier and financial magnitude.`,
            confidence: 0.98,
            asOfDate: "JAN 26, 2026",
            sources: ["FEC.gov", "Congress.gov"],
          },
        },
        {
          id: "insight",
          type: "Narrative.Insight.Summary",
          data: {
            text: `A $${donation.amount.toLocaleString()} contribution from '${donation.contributorName}' was received ${timeGapDays === 0 ? "on the same day as" : timeGapDays + " days " + (new Date(donation.date) < new Date(vote.date) ? "before" : "after")} the vote on ${vote.billId} (${vote.billTitle}). ${vote.actionDescription ? "The representative voted " + vote.vote + " to " + (vote.actionDescription.toLowerCase().startsWith("vote to") ? vote.actionDescription.substring(8) : vote.actionDescription) + "." : ""}`,
            accentColor:
              correlation.significanceScore > 60 ? "#D0021B" : "#DD6B20",
          },
        },
        {
          id: "fec-grid",
          type: "Data.Grid.Grouped",
          data: {
            title: "Direct Contribution Impact",
            totalAmount: donation.amount,
            pacs: [{ name: donation.contributorName, amount: donation.amount }],
            corporateTrace: `Sector: ${donation.sector || "General Industry"}`,
          },
        },
        {
          id: "vote-comparison",
          type: "Metric.Dual.Comparison",
          data: {
            title: "Action Timeline",
            leftEntity: {
              name: "Donation Received",
              value: `$${donation.amount.toLocaleString()}`,
              label: donation.date,
            },
            rightEntity: {
              name: "Legislative Vote",
              value: vote.vote,
              label: vote.date,
            },
          },
        },
      ],
    };
  }

  /**
   * Mock data implementation for Representative Greg Casar
   */
  getGregCasarSampleData(): {
    donations: FECDonation[];
    votes: LegislativeVote[];
  } {
    return {
      donations: [
        {
          id: "fec-fm-001",
          contributorName: "Pharma-Plus PAC",
          contributorType: "PAC",
          amount: 250000,
          date: "2026-01-05",
          recipientId: "C001131",
          sector: "Health",
        },
        {
          id: "fec-fm-002",
          contributorName: "Energy Solutions Corp",
          contributorType: "Corporate",
          amount: 50000,
          date: "2026-01-25",
          recipientId: "C001131",
          sector: "Energy",
        },
      ],
      votes: [
        {
          id: "vote-fm-001",
          billId: "H.R. 291",
          billTitle: "Generic Drug Access Bill",
          vote: "NAY",
          date: "2026-01-07",
          representativeId: "C001131",
          actionDescription: "Vote to strike Section 4 (Cost Caps)",
        },
        {
          id: "vote-fm-002",
          billId: "S. 542",
          billTitle: "Green Energy Act",
          vote: "YEA",
          date: "2026-01-27",
          representativeId: "C001131",
          actionDescription: "Vote to approve renewable subsidies",
        },
      ],
    };
  }
}
