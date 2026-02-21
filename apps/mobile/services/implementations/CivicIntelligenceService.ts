import {
    AlignmentReport,
    ICivicIntelligenceService,
} from "../interfaces/ICivicIntelligenceService";
import { IForensicSignalCoordinator } from "../interfaces/IForensicSignalCoordinator";
import { ISnapRepository } from "../interfaces/ISnapRepository";

export class CivicIntelligenceService implements ICivicIntelligenceService {
  private coordinator: IForensicSignalCoordinator;
  private snapRepository: ISnapRepository;

  constructor({
    forensicSignalCoordinator,
    snapRepository,
  }: {
    forensicSignalCoordinator: IForensicSignalCoordinator;
    snapRepository: ISnapRepository;
  }) {
    this.coordinator = forensicSignalCoordinator;
    this.snapRepository = snapRepository;
  }

  async getAlignmentReport(representativeId: string): Promise<AlignmentReport> {
    try {
      // 1. Fetch user signals
      const signals = await this.coordinator.getRecentSignals(500);
      const sentimentSignals = signals.filter(
        (p) => p.type === "sentiment" || p.type === "SENTIMENT_PULSE",
      );

      // 2. Fetch representative snaps
      const snaps =
        await this.snapRepository.getSnapsByRepresentativeId(representativeId);

      // 3. Identify snaps with voting records
      const votingSnaps = snaps.filter((snap) =>
        snap.elements.some(
          (el) =>
            el.type === "data/voting-record" ||
            el.type === "Data.Legislative.VotingRecord" ||
            el.type === "metric/scorecard",
        ),
      );

      if (votingSnaps.length === 0) {
        // Fallback: If no direct voting snaps for this rep found by ID search, try searching the general library
        // for snaps tagged with this representative ID.
        console.log(
          `[CivicIntelligenceService] No direct voting snaps for rep ${representativeId}. Checking global library.`,
        );
        const allSnaps = await this.snapRepository.getRecentActivity(); // Or a more comprehensive search
        const repSpecificSnaps = allSnaps.filter(
          (s) => s.metadata?.representativeId === representativeId,
        );
        const moreVotingSnaps = repSpecificSnaps.filter((snap) =>
          snap.elements.some(
            (el) =>
              el.type === "data/voting-record" ||
              el.type === "Data.Legislative.VotingRecord",
          ),
        );

        if (moreVotingSnaps.length === 0) {
          return this.generateEmptyReport(representativeId);
        }
        votingSnaps.push(...moreVotingSnaps);
      }

      let matchedCount = 0;
      let divergedCount = 0;
      let unclearCount = 0;
      let totalCorrelated = 0;

      const policyScores: Record<string, { total: number; count: number }> = {};

      for (const snap of votingSnaps) {
        const voteElement = snap.elements.find(
          (el) =>
            el.type === "data/voting-record" ||
            el.type === "Data.Legislative.VotingRecord",
        );
        // Fallback for Scorecards
        const scorecardElement = snap.elements.find(
          (el) => el.type === "metric/scorecard",
        );

        if (!voteElement && !scorecardElement) continue;

        const data = voteElement ? voteElement.data : scorecardElement?.data;
        if (!data) continue;

        const repVote = (
          data.vote ||
          data.position ||
          data.grade
        )?.toLowerCase();
        if (!repVote) continue;

        // Try to find a user signal for this snap
        // We match by resource_id (which should be snapId) or by searching metadata
        const userSignal = sentimentSignals.find(
          (p) =>
            p.resource_id.includes(snap.id) ||
            (p.metadata &&
              (p.metadata.snapId === snap.id || p.metadata.id === snap.id)),
        );

        if (!userSignal) {
          continue; // Don't count in alignment if user hasn't pulsed on it
        }

        console.log(
          `[CivicIntelligenceService] Correlation matched for snap ${snap.id}. Rep: ${repVote}, User: ${userSignal.rational_sentiment}`,
        );
        totalCorrelated++;

        // Rational Sentiment is usually -1.0 to 1.0
        // If RS > 0.2 -> Support
        // If RS < -0.2 -> Oppose
        const userSentiment = userSignal.rational_sentiment;
        const isUserSupport = userSentiment > 0.2;
        const isUserOppose = userSentiment < -0.2;

        const isRepSupport =
          repVote === "yea" ||
          repVote === "aye" ||
          repVote === "yes" ||
          repVote === "support" ||
          repVote === "a";
        const isRepOppose =
          repVote === "nay" ||
          repVote === "no" ||
          repVote === "oppose" ||
          repVote === "f";

        const policy = snap.metadata?.policyArea || "General";
        if (!policyScores[policy])
          policyScores[policy] = { total: 0, count: 0 };

        if ((isUserSupport && isRepSupport) || (isUserOppose && isRepOppose)) {
          matchedCount++;
          policyScores[policy].total += 100;
        } else if (
          (isUserSupport && isRepOppose) ||
          (isUserOppose && isRepSupport)
        ) {
          divergedCount++;
          policyScores[policy].total += 0;
        } else {
          unclearCount++;
          policyScores[policy].total += 50;
        }
        policyScores[policy].count++;
      }

      const alignmentScore =
        totalCorrelated > 0
          ? Math.round((matchedCount / totalCorrelated) * 100)
          : 0;

      // If we have no correlations, return "Insufficient Data" rather than 0%
      if (totalCorrelated === 0) {
        return this.generateEmptyReport(representativeId);
      }

      const topPolicyAlignments = Object.entries(policyScores)
        .map(([policy, data]) => ({
          policy,
          score: Math.round(data.total / data.count),
        }))
        .sort((a, b) => b.score - a.score);

      let verdict: any = "Moderate Alignment";
      if (totalCorrelated < 3) verdict = "Insufficient Data";
      else if (alignmentScore > 80) verdict = "Strong Alignment";
      else if (alignmentScore < 40) verdict = "Divergent";

      return {
        representativeId,
        alignmentScore,
        totalCorrelatedSnaps: votingSnaps.length,
        matchedCount,
        divergedCount,
        unclearCount,
        period: "JAN 2026 - PRESENT",
        topPolicyAlignments,
        verdict,
      };
    } catch (error) {
      console.error(
        "[CivicIntelligenceService] Failed to generate report:",
        error,
      );
      return this.generateEmptyReport(representativeId);
    }
  }

  private generateEmptyReport(representativeId: string): AlignmentReport {
    return {
      representativeId,
      alignmentScore: 0,
      totalCorrelatedSnaps: 0,
      matchedCount: 0,
      divergedCount: 0,
      unclearCount: 0,
      period: "JAN 2026 - PRESENT",
      topPolicyAlignments: [],
      verdict: "Insufficient Data",
    };
  }
}
