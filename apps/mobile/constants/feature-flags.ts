/**
 * Global Feature Flags for PoliTickIt
 * Use these to toggle high-level functionality or experimental tiers.
 */

export const FEATURE_FLAGS = {
  // Intelligence Tier 4 (Predictive Forecasting)
  ENABLE_TIER_4: true, // Set to false to hide Tier 4 components from the UI for now

  // B2B/Institutional features (Consensus Ripple)
  ENABLE_B2B_FEATURES: true,

  // Feature Locking
  USE_EXTENSIBLE_SLUGS: true, // Slugs are the primary gating mechanism

  // Feed Injection Slugs
  RANDOM_SLUGS_IN_FEED: true, // Occasionally show participation nudges in the main scroll
  SLUG_FREQUENCY: 8, // Shows a slug approximately every X items
};
