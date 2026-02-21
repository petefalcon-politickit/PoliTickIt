import { PoliSnap } from "@/types/polisnap";

export const mockCommunityInitiative: PoliSnap = {
  id: "community-org-001",
  sku: "INIT-TX-FOOD-001",
  title: "Central Texas: Regional Food Bank Mobilization",
  type: "community-initiative",
  createdAt: new Date().toISOString(),
  sources: [
    {
      name: "Central Texas Food Bank",
      url: "https://www.centraltexasfoodbank.org",
    },
  ],
  metadata: {
    policyArea: "Social Welfare",
    insightType: "Collective Initiative",
    applicationTier: "Standard",
    headerElementId: "org-header-001",
    laymanSummary:
      "Local non-profit mobilization to address seasonal food insecurity in the Austin metro area.",
  },
  elements: [
    {
      id: "org-header-001",
      type: "Identity.Organization.Header",
      data: {
        id: "ct-food-bank",
        name: "Central Texas Food Bank",
        imgUri:
          "https://www.centraltexasfoodbank.org/sites/default/files/ctfb_logo.png",
        location: "Austin, Texas",
        isVerified: true,
        tags: ["Hunger Relief", "Disaster Response"],
      },
    },
    {
      id: "initiative-summary",
      type: "Narrative.Insight.Summary",
      data: {
        title: "Initiative: Seasonal Expansion",
        content:
          "We are expanding our mobile pantry operations to reach 15 additional rural zip codes in the next quarter. This requires a 20% increase in volunteer staffing and logistics support.",
      },
    },
    {
      id: "event-details",
      type: "Narrative.Event.Details",
      data: {
        title: "Volunteer Training: Mobile Pantry",
        date: "Saturday, Oct 14, 2023",
        time: "9:00 AM - 12:00 PM",
        location: "6500 Metropolis Dr, Austin, TX 78744",
        requirements: "Background check required (onsite). Must be 18+.",
      },
    },
    {
      id: "volunteer-action",
      type: "Interaction.Action.Card",
      data: {
        title: "Community Action: Volunteer Sign-up",
        label: "Secure your spot",
        actionType: "link",
        actionPayload:
          "https://www.centraltexasfoodbank.org/get-involved/volunteer",
      },
    },
  ],
};
