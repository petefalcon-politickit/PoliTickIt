import {
    CorrelationResult,
    FECDonation,
    LegislativeVote,
} from "@/types/data-sources";
import { PoliSnap } from "@/types/polisnap";

export interface IFECVoteNormalizer {
  findCorrelations(
    donations: FECDonation[],
    votes: LegislativeVote[],
    config?: {
      maxDaysGap?: number;
      minAmount?: number;
    },
  ): CorrelationResult[];

  generateCorrelationSnap(correlation: CorrelationResult): PoliSnap;

  getGregCasarSampleData(): {
    donations: FECDonation[];
    votes: LegislativeVote[];
  };
}
