export const PARTICIPATION_TIERS = [
  {
    level: 1,
    name: "Standard",
    requirement: 0,
    benefit: "Live legislative tracking",
    icon: "eye-outline",
  },
  {
    level: 2,
    name: "Intelligence",
    requirement: 500,
    benefit: "FEC Donor correlation maps",
    icon: "flash-outline",
  },
  {
    level: 3,
    name: "ROI Auditor",
    requirement: 1200,
    benefit: "Full Accountability Scorecards",
    icon: "shield-checkmark-outline",
  },
  {
    level: 4,
    name: "Institutional",
    requirement: 2500,
    benefit: "AI-Powered B2B Analytics",
    icon: "diamond-outline",
  },
];

export type ParticipationTier = (typeof PARTICIPATION_TIERS)[number];
