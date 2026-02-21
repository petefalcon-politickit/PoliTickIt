/**
 * Omni-OS Intelligence: Forensic-Signal Logic
 *
 * This library contains the core mathematical models for
 * Rational Sentiment (RS) used across the Omni-OS ecosystem.
 */

export interface RationalSentimentParams {
  baseSentiment: number; // -1.0 to 1.0
  isVerifiedConstituent: boolean;
  participationCredits: number;
}

/**
 * Calculates the Rational Sentiment (RS) score.
 * Formula: RS = S * (ResidencyWeight + ParticipationWeight)
 */
export function calculateRationalSentiment({
  baseSentiment,
  isVerifiedConstituent,
  participationCredits,
}: RationalSentimentParams): number {
  // R_w: Resident multiplier (1.5) or baseline (1.0)
  const residencyWeight = isVerifiedConstituent ? 1.5 : 1.0;

  // P_w: Participation weight (0.1 per 1000 credits, max 0.5)
  const participationWeight = Math.min(
    (participationCredits / 1000) * 0.1,
    0.5,
  );

  const rsValue = baseSentiment * (residencyWeight + participationWeight);

  // Round to 2 decimal places for consistent display
  return Math.round((rsValue + Number.EPSILON) * 100) / 100;
}
