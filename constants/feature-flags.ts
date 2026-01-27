/**
 * Global Feature Flags for PoliTickIt
 * Use these to toggle high-level functionality or experimental tiers.
 */

export const FEATURE_FLAGS = {
  // Intelligence Tier 4 (Predictive Forecasting)
  ENABLE_TIER_4: false, // Set to false to hide Tier 4 components from the UI for now

  // B2B/Institutional features (Consensus Ripple)
  ENABLE_B2B_FEATURES: false,

  // Feature Locking Presentation
  SHOW_LOCKED_OVERLAYS: false, // If false, locked features are hidden entirely instead of showing the "Locked" UI
  USE_PARTICIPATION_SLUGS: false, // If true, replaces locked content with a small horizontal slug

  // Feed Injection Slugs
  RANDOM_SLUGS_IN_FEED: true, // Set to true to occasionally show participation nudges in the main scroll
  SLUG_FREQUENCY: 3, // Shows a slug approximately every X items
};
