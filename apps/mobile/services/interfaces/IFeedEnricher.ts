import { PoliSnap } from "@/types/polisnap";
import { SlugConfig } from "@/types/slug";

export type FeedCellType = "snap" | "gutter";

export interface FeedCell {
  type: FeedCellType;
  id: string;
  data?: PoliSnap;
  config?: SlugConfig;
  isFirst?: boolean;
}

export interface IFeedEnricher {
  /**
   * Transforms a raw list of snaps into a structured list of feed cells.
   */
  enrich(
    snaps: PoliSnap[],
    options: { contributionCredits: number },
  ): FeedCell[];
}
