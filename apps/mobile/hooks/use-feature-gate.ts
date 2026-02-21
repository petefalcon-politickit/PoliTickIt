import { PARTICIPATION_TIERS } from "@/constants/participation";
import { useActivity } from "@/contexts/activity-context";

/**
 * Hook to check if a specific participation tier is unlocked based on user credits.
 * @param requiredLevel The level number (1-4) to check against.
 * @returns { isLocked: boolean, requirement: number, tierName: string }
 */
export const useFeatureGate = (requiredLevel: number) => {
  const { contributionCredits } = useActivity();

  const targetTier = PARTICIPATION_TIERS.find((t) => t.level === requiredLevel);

  if (!targetTier) {
    return { isLocked: false, requirement: 0, tierName: "Unknown" };
  }

  const isLocked = contributionCredits < targetTier.requirement;

  return {
    isLocked,
    requirement: targetTier.requirement,
    tierName: targetTier.name,
  };
};
