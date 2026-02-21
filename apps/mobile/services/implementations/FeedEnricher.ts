import { FEATURE_FLAGS } from "@/constants/feature-flags";
import { PARTICIPATION_TIERS } from "@/constants/participation";
import { PoliSnap } from "@/types/polisnap";
import { SlugConfig } from "@/types/slug";
import { FeedCell, IFeedEnricher } from "../interfaces/IFeedEnricher";

export interface EnrichmentOptions {
  contributionCredits: number;
}

export type EnrichmentStage = (
  items: any[],
  options: EnrichmentOptions,
) => any[];

/**
 * FeedEnricher
 * Implements a processing pipeline for the Snap feed to ensure visual variety,
 * handle interleaving, and normalize cell structures.
 */
export class FeedEnricher implements IFeedEnricher {
  private pipeline: EnrichmentStage[] = [
    this.deduplicate.bind(this),
    this.applyVisualVariety.bind(this),
    this.interleave.bind(this),
  ];

  enrich(snaps: PoliSnap[], options: EnrichmentOptions): FeedCell[] {
    return this.pipeline.reduce(
      (items, stage) => stage(items, options),
      snaps as any[],
    );
  }

  private deduplicate(snaps: PoliSnap[]): PoliSnap[] {
    const seen = new Set();
    return snaps.filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }

  /**
   * Visual Variety Strategy:
   * Prevents visual fatigue by ensuring consecutive snaps aren't too similar
   * in type or representative focus.
   */
  private applyVisualVariety(snaps: PoliSnap[]): PoliSnap[] {
    if (snaps.length < 3) return snaps;

    const result = [...snaps];
    for (let i = 1; i < result.length; i++) {
      const current = result[i];
      const prev = result[i - 1];

      // Detect similarity (Same Representative + Same Category)
      const isCluttered =
        current.metadata?.representativeId ===
          prev.metadata?.representativeId && current.type === prev.type;

      if (isCluttered) {
        // Look ahead for a snap that breaks the pattern
        for (let j = i + 1; j < result.length; j++) {
          const candidate = result[j];
          if (
            candidate.type !== prev.type ||
            candidate.metadata?.representativeId !==
              prev.metadata?.representativeId
          ) {
            // Swap
            result[i] = candidate;
            result[j] = current;
            break;
          }
        }
      }
    }
    return result;
  }

  private interleave(
    snaps: PoliSnap[],
    options: EnrichmentOptions,
  ): FeedCell[] {
    const { contributionCredits } = options;
    const frequency = FEATURE_FLAGS.SLUG_FREQUENCY || 3;

    return snaps.reduce((acc: FeedCell[], snap, index) => {
      const isLead = index === 0;

      // Logic to determine if this snap will be a gated slug (Tier check)
      const snapTier = snap.metadata?.applicationTier;
      const tierInfo = snapTier
        ? PARTICIPATION_TIERS.find((t) => t.name === snapTier)
        : null;
      const isGatedSlug =
        tierInfo && contributionCredits < tierInfo.requirement;

      // Suppress decorative nudge if we are already showing a functional gated slug
      const showSlug =
        FEATURE_FLAGS.RANDOM_SLUGS_IN_FEED &&
        index > 0 &&
        index % frequency === 0 &&
        !isGatedSlug;

      // Cell Construction
      let slugConfig: SlugConfig | undefined;
      if (showSlug) {
        slugConfig = {
          id: `slug-${snap.id}`,
          type: "participation",
          props: {
            // Logic for lead message could go here or in slug factory
          },
        };
      }

      acc.push({
        type: "gutter",
        id: `gutter-${snap.id}`,
        config: slugConfig,
        isFirst: isLead,
      });

      acc.push({
        type: "snap",
        id: snap.id,
        data: snap,
      });

      return acc;
    }, []);
  }
}
