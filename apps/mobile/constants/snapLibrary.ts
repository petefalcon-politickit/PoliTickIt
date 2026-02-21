/**
 * PoliSnap Ideation Library
 *
 * This collection represents production-ready candidates for various political
 * transparency and accountability snapshots.
 */

// 1. ACCOUNTABILITY SNAPS
export const accountabilitySnaps = [
  {
    id: "audit-casar-001",
    sku: "SENTINEL-AUDIT-CASAR-001",
    title: "Constituent Accountability: Audit Ready",
    type: "Accountability",
    createdAt: new Date().toISOString(),
    sources: [{ name: "TargetSmart Verified Residency", url: "#" }],
    metadata: {
      policyArea: "Constituent Services",
      insightType: "Voter Audit",
      representativeId: "C001131",
      laymanSummary:
        "As a resident of Texas District 35, you are eligible to perform a high-integrity audit on Rep. Greg Casar's legislative alignment.",
    },
    elements: [
      {
        id: "voter-audit-bridge",
        type: "Interaction.VoterAudit",
        data: {
          representativeId: "C001131",
          representativeName: "Greg Casar",
          auditTargetId: "vote-hr-445",
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          oracleSource: "ZK-Proof TargetSmart Bridge",
          verificationLevel: "Tier 3",
          analysisMode: "Constituent Privacy Safeguard",
        },
      },
    ],
  },
  {
    id: "qa-stagnation-sentinel-001",
    sku: "PTS-QA-STAGNATION-001",
    title: "QA: Stagnation Sentinel",
    type: "Accountability",
    createdAt: "2026-01-31T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Forensic Audit",
      insightType: "Legislative Friction",
      representativeId: "S000148",
    },
    elements: [
      {
        id: "stagnation-gauge",
        type: "Universal.Gauge",
        data: {
          title: "Legislative Friction (μf)",
          value: 0.85,
          mode: "Friction",
          leftLabel: "Velocity",
          rightLabel: "Stagnant",
          intensity: "Critical",
          insight:
            "This bill has been held in committee for 124 days without a hearing despite a 92% district consensus ripple.",
        },
      },
    ],
  },
  {
    id: "community-org-001",
    sku: "INIT-TX-FOOD-001",
    title: "Central Texas: Regional Food Bank Mobilization",
    type: "Community",
    createdAt: "2023-10-10T10:00:00Z",
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
      representativeId: "C001131",
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
          text: "We are expanding our mobile pantry operations to reach 15 additional rural zip codes in the next quarter. This requires a 20% increase in volunteer staffing and logistics support.",
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
  },
  {
    id: "acc-pulse-cyber-security",
    sku: "PTS-ACC-PULSE-034",
    title: "Quantum Cybersecurity Initiative",
    type: "Accountability",
    createdAt: "2026-01-26T10:00:00Z",
    sources: [
      { name: "Cybersecurity & Infrastructure Security Agency", url: "#" },
    ],
    metadata: {
      policyArea: "Cybersecurity",
      insightType: "Legislative Sentiment",
      representativeId: "S000148",
      applicationTier: "Intelligence",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          location: "New York",
          position: "U.S. Senator",
          party: "Democratic",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
        },
      },
      {
        id: "insight-cyber",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Proposed framework for securing national quantum-computing research labs. Focuses on encryption standards and international cooperation.",
          accentColor: "#805AD5",
        },
      },
      {
        id: "cyber-sentiment",
        type: "Interaction.Sentiment.Slider",
        data: {
          title: "Protect Federal Infrastructure?",
          leftLabel: "PRIVACY CONCERNS",
          rightLabel: "STRENGTHEN SECURITY",
        },
      },
    ],
  },
  {
    id: "acc-pulse-veterans-bill",
    sku: "PTS-ACC-PULSE-032",
    title: "Veteran Health Access Act",
    type: "Accountability",
    createdAt: "2026-01-26T09:00:00Z",
    sources: [{ name: "Department of Veterans Affairs", url: "#" }],
    metadata: {
      policyArea: "Veterans",
      insightType: "Legislative Sentiment",
      representativeId: "T000250",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "T000250",
          name: "John Thune",
          location: "South Dakota",
          position: "U.S. Senator",
          party: "Republican",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/T000250.jpg",
        },
      },
      {
        id: "insight-vets",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Expansion of rural health clinics for veterans. This bill aims to reduce wait times for mental health services in underserved regions.",
          accentColor: "#E53E3E",
        },
      },
      {
        id: "vets-action",
        type: "Interaction.Action.Card",
        data: {
          label: "COLLECTIVE IMPACT",
          title: "Advocate for Rural Vets",
          icon: "heart",
          actionType: "advocate",
          publisherImage:
            "https://www.va.gov/img/design/logo/va-logo-white.png",
        },
      },
    ],
  },
  {
    id: "acc-pulse-small-biz-incentive",
    sku: "PTS-ACC-PULSE-033",
    title: "Main Street Revitalization Grant",
    type: "Accountability",
    createdAt: "2026-01-26T08:00:00Z",
    sources: [{ name: "Small Business Administration", url: "#" }],
    metadata: {
      policyArea: "Small Business",
      insightType: "Strategic Policy Pulse",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          location: "Texas, District 35",
          position: "U.S. Representative",
          party: "Democratic",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "insight-biz",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Interest-free loans for minority-owned small businesses in urban corridors. Aims to offset rising commercial rents and utilities.",
          accentColor: "#38A169",
        },
      },
      {
        id: "biz-trend",
        type: "Visual.Chart.SentimentTrend",
        data: {
          title: "Small Biz Growth Projection",
          points: [
            { label: "Q1", support: 20, oppose: 5 },
            { label: "Q2", support: 35, oppose: 10 },
            { label: "Q3", support: 50, oppose: 15 },
            { label: "Q4", support: 75, oppose: 5 },
          ],
        },
      },
    ],
  },
  {
    id: "acc-sandbox-collective-001",
    sku: "PTS-ACC-COL-001",
    title: "Interactive Sandbox: Pulse Actions",
    type: "Accountability",
    createdAt: "2026-01-25T16:00:00Z",
    sources: [{ name: "PoliTickIt Collective Insight", url: "#" }],
    metadata: {
      policyArea: "Strategic Intelligence",
      insightType: "Collective Interactive Block",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "T000250",
          name: "John Thune",
          location: "South Dakota",
          position: "U.S. Senator",
          party: "Republican",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/T000250.jpg",
        },
      },
      {
        id: "sentiment-trend",
        type: "Visual.Chart.SentimentTrend",
        data: {
          title: "District Support Velocity",
          points: [
            { label: "Intro", support: 10, oppose: 20 },
            { label: "Comm.", support: 25, oppose: 40 },
            { label: "Floor", support: 45, oppose: 15 },
            { label: "Alert", support: 75, oppose: 5 },
          ],
        },
      },
      {
        id: "sentiment-slider",
        type: "Interaction.Sentiment.Slider",
        data: {
          title: "Capture your Sentiment",
          leftLabel: "OPPOSE STRONGLY",
          rightLabel: "SUPPORT STRONGLY",
        },
      },
      {
        id: "action-contact",
        type: "Interaction.Action.Card",
        data: {
          label: "CONSTITUENT ACTION",
          title: "Contact Representative Office",
          icon: "call",
          actionType: "contact",
          actionPayload: { repId: "T000250" },
        },
      },
    ],
  },
  {
    id: "TOP-CORRELATION-COLLECTIVE",
    sku: "PTS-CORR-COL-001",
    title: "INTELLIGENCE ALERT: H.R. 882 CORRELATION",
    type: "Accountability",
    createdAt: "2026-01-26T23:59:59Z",
    sources: [
      { name: "FEC.gov", url: "https://www.fec.gov" },
      { name: "Congress.gov", url: "https://www.congress.gov" },
    ],
    metadata: {
      policyArea: "Accountability",
      insightType: "Corruption Index Intelligence",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
          tags: [{ name: "Progressive Caucus", type: "primary" }],
        },
      },
      {
        id: "corr-index-casar",
        type: "Metric.CorruptionIndex",
        data: {
          title: "CORRUPTION INDEX",
          score: 88,
          donor: "Global Energy PAC",
          industry: "Energy & Natural Resources",
          amount: "$5,000",
          voteAction: "YEA (H.R. 882)",
          insight:
            "A maximum individual donation was received from Global Energy PAC just 4 days prior to the 'YEA' vote on H.R. 882 (Infrastructure). This aligns with a significant trend of Energy Sector support for recent legislative expansion.",
          confidence: 0.95,
          auditId: "FEC-TX35-CASAR-2026",
          asOfDate: "JAN 26, 2026",
          sources: ["FEC.gov", "Congress.gov"],
        },
      },
      {
        id: "fec-heat-casar",
        type: "Data.Correlation.Heatmap",
        data: {
          totalInfluence: 4250000,
          donors: [
            { industry: "Technology", amount: 1250000, correlation: 0.85 },
            { industry: "Energy", amount: 950000, correlation: 0.72 },
            { industry: "Healthcare", amount: 800000, correlation: 0.45 },
            { industry: "Finance", amount: 750000, correlation: 0.92 },
            { industry: "Agri-Business", amount: 500000, correlation: 0.15 },
          ],
        },
        presentation: {
          title: "INDUSTRY CORRELATION",
        },
      },
    ],
  },
  {
    id: "cr-corruption-johnson-2026",
    sku: "PTS-CR-JOHNSON-005",
    title: "CORRUPTION AUDIT: MIKE JOHNSON (LA-04)",
    type: "Accountability",
    createdAt: "2026-01-25T20:00:00Z",
    sources: [
      { name: "OpenSecrets", url: "#" },
      { name: "FEC.gov", url: "#" },
    ],
    metadata: {
      policyArea: "Accountability",
      insightType: "Corruption Index Intelligence",
      representativeId: "J000299",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "J000299",
          name: "Mike Johnson",
          party: "Republican",
          location: "Louisiana, District 4",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/J000299.jpg",
        },
      },
      {
        id: "corr-index-johnson",
        type: "Metric.CorruptionIndex",
        data: {
          title: "CORRUPTION INDEX",
          score: 78,
          donor: "Legacy Energy Alliance",
          industry: "Oil & Gas",
          amount: "$250,000",
          voteAction: "YEA (H.Res 104)",
          insight:
            "Significant contributions from Oil & Gas lobbyists coincide with legislative priorities favoring traditional energy subsidies. Corruption score remains 'SEVERE' due to high donor concentration.",
          confidence: 0.89,
          auditId: "cr-summary-johnson-week3-2026",
          asOfDate: "JAN 25, 2026",
          sources: ["FEC.gov", "OpenSecrets"],
        },
      },
    ],
  },
  {
    id: "acc-pulse-arctic-res",
    sku: "PTS-ACC-PULSE-001",
    title: "S. Res 45: Arctic Wilderness Protection",
    type: "Accountability",
    createdAt: "2026-01-25T15:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Environmental Protection",
      insightType: "Legislative Sentiment",
      representativeId: "T000250",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "T000250",
          name: "John Thune",
          location: "South Dakota",
          position: "U.S. Senator",
          party: "Republican",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/T000250.jpg",
        },
      },
      {
        id: "insight-arctic",
        type: "Narrative.Insight.Summary",
        data: {
          text: "S. Res 45 proposes a permanent ban on exploratory drilling within the Arctic National Wildlife Refuge. Proponents cite ecosystem preservation, while critics point to potential impacts on domestic energy independence.",
          accentColor: "#3182CE",
          isExpandable: true,
        },
      },
      {
        id: "status-arctic",
        type: "Metric.Progress.Stepper",
        data: {
          title: "Legislative Status",
          stages: [
            { label: "Intro" },
            { label: "Comm." },
            { label: "Floor" },
            { label: "Passed" },
          ],
          currentStageIndex: 1,
        },
      },
      {
        id: "pulse-arctic",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Public Support for S. Res 45",
          options: [
            { id: "support", label: "Support", sentiment: "positive" },
            { id: "oppose", label: "Oppose", sentiment: "negative" },
          ],
          stats: { agree: 1200, disagree: 800 },
        },
      },
      {
        id: "source-arctic",
        type: "Identity.Source.Tag",
        data: {
          source: "Congress.gov / EPA",
          date: "Jan 24, 2026",
          reliability: "High",
        },
      },
    ],
  },
  {
    id: "acc-pulse-energy-roadmap",
    sku: "PTS-ACC-PULSE-002",
    title: "National Energy Roadmap 2026",
    type: "Accountability",
    createdAt: "2026-01-25T14:45:00Z",
    sources: [{ name: "Department of Energy", url: "#" }],
    metadata: {
      policyArea: "Energy",
      insightType: "Strategic Policy Pulse",
      representativeId: "S000148",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          location: "New York",
          position: "U.S. Senator",
          party: "Democratic",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
        },
      },
      {
        id: "insight-energy",
        type: "Narrative.Insight.Summary",
        data: {
          text: "The 2026 Energy Roadmap outlines the federal strategy for decarbonizing the national grid. The plan balances renewable expansion with nuclear grid stability and legacy equipment phase-outs.",
          accentColor: "#38A169",
        },
      },
      {
        id: "energy-mix",
        type: "Visual.Chart.Bar",
        data: {
          title: "Projected Energy Mix Shift (2026 vs 2030)",
          data: [
            { label: "Solar/Wind", value: 22, value2: 45 },
            { label: "Nuclear", value: 19, value2: 25 },
            { label: "Natural Gas", value: 38, value2: 20 },
            { label: "Coal", value: 11, value2: 2 },
          ],
          legend: "D. Blue: Current | L. Blue: 2030 Target",
        },
      },
      {
        id: "pulse-energy-velocity",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Net-Zero Transition Target",
          options: [
            { id: "opt1", label: "Aggressive (2030)", sentiment: "positive" },
            { id: "opt2", label: "Standard (2035)", sentiment: "neutral" },
            { id: "opt3", label: "Cautious (2045)", sentiment: "neutral" },
            { id: "opt4", label: "Oppose Targets", sentiment: "negative" },
          ],
          stats: { agree: 320, disagree: 480 },
        },
      },
      {
        id: "source-energy",
        type: "Identity.Source.Tag",
        data: {
          source: "Department of Energy / IEA",
          date: "Jan 18, 2026",
          reliability: "High",
        },
      },
    ],
  },
  {
    id: "acc-leg-001",
    sku: "PTS-ACC-LEG-001",
    title: "S.312: Affordable Housing Act",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Housing and Community Development",
      insightType: "Legislative Bottleneck",
      laymanSummary:
        "This bill aims to increase federal funding for low-income housing developments and provides tax incentives for builders who dedicate 20% of new projects to affordable units.",
    },
    elements: [
      {
        id: "status",
        type: "Metric.Progress.Stepper",
        data: {
          title: "Path to Law: Affordable Housing Act",
          stages: [
            { label: "Intro" },
            { label: "Comm." },
            { label: "Passed" },
            { label: "Senate" },
            { label: "Law" },
          ],
          currentStageIndex: 1,
        },
      },
      {
        id: "bottleneck-insight",
        type: "Narrative.Insight.Summary",
        data: {
          text: "S.312 has been stalled in the Finance Committee for 45 days. Chair remains non-committal on scheduling a markup despite bipartisan sponsorship.",
          accentColor: "#D0021B",
          isExpandable: true,
        },
      },
      {
        id: "source-001",
        type: "Identity.Source.Tag",
        data: {
          source: "Congress.gov / OpenSecrets",
          date: "Jan 15, 2026",
          reliability: "High",
          url: "https://www.congress.gov/bill/119th-congress/senate-bill/312",
        },
      },
    ],
  },
  {
    id: "acc-district-align-001",
    sku: "PTS-ACC-DISTRICT-ALIGN-001",
    title: "Representative Alignment",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Government Operations and Politics",
      insightType: "Regional vs. Party Focus",
      representativeId: "S000148",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          context: "Sponsor",
          name: "Chuck Schumer",
          party: "Democratic",
          location: "New York",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
          tags: [], // Trimmed tags for local focus
        },
      },
      {
        id: "gauge",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Aggregate Voting Alignment",
          value: 78,
          leftLabel: "District Focus",
          rightLabel: "Party Line",
          insight:
            "Current session shows a significant shift toward national party priorities over local regional economic interests.",
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "District Opinion",
          agreeLabel: "Aligned",
          disagreeLabel: "Misaligned",
          stats: {
            agree: 4200,
            disagree: 5800,
          },
        },
      },
      {
        id: "source-002",
        type: "Identity.Source.Tag",
        data: {
          source: "PoliTickIt Analytics",
          date: "Jan 20, 2026",
          reliability: "Medium",
        },
      },
    ],
  },
  {
    id: "accountability-high-fi-001",
    sku: "PTS-ACCOUNTABILITY-HIGH-FI-001",
    title: "Representative Deep-Dive",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Finance and Financial Sector",
      insightType: "Stock Activity Deep-Dive",
      representativeId: "S000148",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          party: "Democratic",
          location: "New York",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
          tags: [], // Reduced tags as requested for this view
        },
      },
      {
        id: "stock-narrative",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Recent filings show a pattern of high-frequency trading in pharmaceutical stocks shortly before a committee vote on drug price caps. This activity deviates from his 3-year historical baseline by over 240%.",
          accentColor: "#DD6B20",
        },
      },
      {
        id: "stock-chart",
        type: "Visual.Chart.Bar",
        data: {
          title: "Trading Volume vs. History",
          data: [
            { label: "Q1 '23", value: 120000, value2: 45000 },
            { label: "Q2 '23", value: 150000, value2: 42000 },
            { label: "Q3 '23", value: 850000, value2: 38000 },
            { label: "Q4 '24", value: 110000, value2: 52000 },
          ],
          legend: "Dark Blue: Actual Volume | Light Blue: 3-Year Avg",
        },
      },
      {
        id: "transaction-table",
        type: "Data.Table.Expandable",
        data: {
          title: "Recent High-Value Disclosures",
          headers: ["Ticker", "Amount"],
          data: [
            {
              col1: "PFE",
              col2: "$150K - $250K",
              details: [
                "Purchased 10 days before hearing",
                "Broker: Independent Trust",
                "Link: SEC Filing #XJ992",
              ],
            },
            {
              col1: "JNJ",
              col2: "$50K - $100K",
              details: [
                "Purchased 15 days before hearing",
                "Portfolio: Joint Spousal",
              ],
            },
          ],
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Ethics Pulse",
          agreeLabel: "Acceptable",
          disagreeLabel: "Conflict of Interest",
          stats: {
            agree: 1200,
            disagree: 8800,
          },
        },
      },
    ],
  },
  {
    id: "accountability-fec-001",
    sku: "PTS-ACCOUNTABILITY-FEC-001",
    title: "Campaign Finance: High-Interest Donors",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Energy",
      insightType: "Campaign Finance",
      representativeId: "M000355",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "M000355",
          name: "Mitch McConnell",
          party: "Republican",
          location: "Kentucky",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/M000355.jpg",
          tags: [],
        },
      },
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Senator Mitch McConnell's recent campaign audit reveals a 15% increase in funding from energy sector PACs. While his base remains localized, 40% of his total funds now originate from non-resident corporate entities.",
          accentColor: "#E53E3E",
          isExpandable: true,
        },
      },
      {
        id: "fec-grid",
        type: "Data.Grid.Grouped",
        data: {
          title: "Energy & Infrastructure Focus",
          totalAmount: 2450000,
          pacs: [
            { name: "CleanCoal PAC", amount: 450000 },
            { name: "Global Logistics Inc", amount: 280000 },
            { name: "Renew Grid Holdings", amount: 150000 },
          ],
          corporateTrace:
            "Funding linked to parent company 'Apex Global' currently undergoing environmental review.",
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "INFLUENCE CORRELATION",
          agreeLabel: "Fair Funding",
          disagreeLabel: "Too Much Industry Influence",
          stats: {
            agree: 3100,
            disagree: 6900,
          },
        },
      },
    ],
  },
  {
    id: "accountability-votes-001",
    sku: "PTS-ACCOUNTABILITY-VOTES-001",
    title: "Key Vote Alert: S.Res 542",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Environmental Protection",
      insightType: "Key Vote Divergence",
      headerElementId: "rep-header",
      laymanSummary:
        "S.Res 542 establishes new environmental standards for public land usage, addressing how local commerce and conservation efforts should coexist.",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "J000299",
          name: "Mike Johnson",
          context: "Key Voter",
          party: "Republican",
          location: "Louisiana",
          district: "District 4",
          position: "U.S. Representative",
          tags: [], // Trimmed redundant representative pill
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/J000299.jpg",
        },
      },
      {
        id: "comparison",
        type: "Metric.Dual.Comparison",
        data: {
          left: {
            label: "Constituent Support",
            val: 42,
            unit: "%",
            color: "#ED8936",
          },
          right: {
            label: "Party Alignment",
            val: 98,
            unit: "%",
            color: "#3182CE",
          },
        },
      },
      {
        id: "insight",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Representative Davis voted 'Yea' on S.Res 542 despite local polling indicating a preference for further amendments. This marks the 5th time this quarter he has aligned with a national party platform over district-specific survey results.",
          isExpandable: false,
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Vote Alignment Pulse",
          agreeLabel: "Support Vote",
          disagreeLabel: "Oppose Vote",
          stats: {
            agree: 3800,
            disagree: 6200,
          },
        },
      },
    ],
  },
  {
    id: "acc-judicial-001",
    sku: "PTS-ACC-JUDICIAL-001",
    title: "Judicial Opinion: Environmental Rights",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Environmental Protection",
    },
    elements: [
      {
        id: "judicial-summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "The State Supreme Court issued a landmark opinion (Docket #2026-EN-44) regarding groundwater contamination liability. This judgment effectively shifts the burden of proof to industrial operators in Tier 1 zones.",
          accentColor: "#3182CE",
          sourceLink: "judicial.records.state.gov",
        },
      },
    ],
  },
  {
    id: "acc-vote-reversal-001",
    sku: "PTS-ACC-VOTE-REVERSAL-001",
    title: "Vote Pivot: Infrastructure Bill",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Commerce",
    },
    elements: [
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Representative Miller changed her 'Nay' vote in committee to a 'Yea' during the floor session for H.R. 882. This change occurred after a $5M local transit amendment was added.",
          accentColor: "#38A169",
        },
      },
      {
        id: "dual",
        type: "Metric.Dual.Comparison",
        data: {
          title: "Voting Timeline",
          leftEntity: { name: "Committee", value: "NAY", label: "June 12" },
          rightEntity: { name: "Floor", value: "YEA", label: "June 28" },
        },
      },
      {
        id: "source",
        type: "Identity.Source.Tag",
        data: { source: "House Clerk Records", date: "Jan 20, 2026" },
      },
    ],
  },
  {
    id: "acc-industry-contrast-001",
    sku: "PTS-ACC-INDUSTRY-CONTRAST-001",
    title: "Sector Contrast: California Senators",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Funding Divergence",
      laymanSummary:
        "Comparison of primary funding sectors between Senator Jenkins and Senator Miller during the 2024-2026 cycle.",
    },
    elements: [
      {
        id: "comparison-metrics",
        type: "Metric.Dual.Comparison",
        data: {
          left: {
            label: "Jenkins (Tech)",
            val: 8.2,
            unit: "M",
            color: "#3182CE",
          },
          right: {
            label: "Miller (Agri)",
            val: 1.4,
            unit: "M",
            color: "#38A169",
          },
        },
      },
      {
        id: "sector-breakdown",
        type: "Visual.Chart.Bar",
        data: {
          title: "Top 3 Contributing Sectors",
          data: [
            { label: "Tech", value: 4500000, value2: 200000 },
            { label: "Agri", value: 150000, value2: 1200000 },
            { label: "Energy", value: 800000, value2: 900000 },
          ],
          legend: "D. Blue: Jenkins | L. Blue: Miller",
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Representation Preference",
          agreeLabel: "Support Tech-Focus",
          disagreeLabel: "Support Agri-Focus",
          stats: {
            agree: 5500,
            disagree: 4500,
          },
        },
      },
      {
        id: "source",
        type: "Identity.Source.Tag",
        data: {
          source: "PoliTickIt Aggregator",
          date: "Jan 24, 2026",
          reliability: "High",
        },
      },
    ],
  },
];

// 2. KNOWLEDGE SNAPS
export const knowledgeSnaps = [
  {
    id: "fiscal-pulse-debt-20260130",
    sku: "FIS-PUL-DEBT-202601",
    title: "U.S. Treasury: National Debt Velocity Update",
    type: "Knowledge",
    createdAt: "2026-01-30T10:00:00Z",
    sources: [
      {
        name: "U.S. Treasury Fiscal Data",
        url: "https://fiscaldata.treasury.gov",
      },
    ],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "Fiscal Pulse",
      applicationTier: "Sovereign Utility",
      laymanSummary:
        "Automated analysis of National Debt Velocity shows a 0.36% change as reported by the U.S. Treasury.",
    },
    elements: [
      {
        id: "fiscal-pulse-debt-summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "The U.S. Treasury has updated the National Debt Velocity. Current total stands at $34,123,456,789,012. This represents a velocity shift of 0.36% over the last reporting period.",
          accentColor: "#E53E3E",
        },
      },
      {
        id: "fiscal-pulse-debt-metric",
        type: "Metric.Financial.Velocity",
        data: {
          title: "National Debt Velocity",
          value: 34123456789012,
          valueLabel: "$34.12 Trillion",
          changePct: 0.36,
          trend: "up",
          unit: "USD",
        },
      },
      {
        id: "fiscal-pulse-debt-chart",
        type: "Visual.Chart.TreasuryFlow",
        data: {
          title: "12-Month Trajectory",
          points: [
            { label: "Jan", value: 31.0 },
            { label: "Apr", value: 32.5 },
            { label: "Jul", value: 33.2 },
            { label: "Oct", value: 34.1 },
          ],
        },
      },
      {
        id: "fiscal-pulse-debt-trust",
        type: "Trust.Thread",
        data: {
          referenceId: "2026-01-30-1000",
          verificationLevel: "Tier 2",
          oracleSource: "U.S. Treasury (Bureau of the Fiscal Service)",
        },
        presentation: {
          styling: "card-verification-mechanical",
          attributes: {
            spacing: "v-rhythm-tight-1",
            fontSizeOffset: 5,
            mechanicalAlignment: true,
            preservePillboxScale: true,
          },
        },
      },
    ],
  },
  {
    id: "knw-cr-001",
    sku: "PTS-KNW-CR-001",
    title: "Understanding Shutdown Risks",
    type: "Knowledge",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Continuing Resolutions",
      headerElementId: "knw-profile",
      laymanSummary:
        "A 'CR' provides short-term funding for federal agencies at current levels, preventing government shutdowns while longer budget negotiations continue.",
    },
    elements: [
      {
        id: "knw-profile",
        type: "Header.Profile",
        data: {
          context: "Political Analyst",
          name: "Susan James",
          imgUri:
            "https://ui-avatars.com/api/?name=Susan+James&background=E2E8F0&color=475569",
          tags: [{ name: "Top contributor", type: "secondary" }],
          timestamp: "1d",
        },
      },
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "A 'Continuing Resolution' (CR) is a short-term funding bill that keeps the government open when Congress hasn't passed standard spending bills. It essentially 'copies and pastes' previous budget levels into a temporary extension.",
          accentColor: "#4299E1",
        },
      },
      {
        id: "stepper",
        type: "Metric.Progress.Stepper",
        data: {
          title: "Typical CR Lifespan",
          stages: [
            { label: "Budget Fail" },
            { label: "Emergency Bill" },
            { label: "Extension" },
            { label: "Final Budget" },
          ],
          currentStageIndex: 2,
        },
      },
      {
        id: "source-knw",
        type: "Identity.Source.Tag",
        data: { source: "Congressional Research Service", reliability: "High" },
      },
    ],
  },
  {
    id: "knowledge-congress-001",
    sku: "PTS-KNOWLEDGE-CONGRESS-001",
    title: "How Bills Become Law",
    type: "Knowledge",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    elements: [
      {
        id: "intro",
        type: "Narrative.Insight.Summary",
        data: {
          text: "The path from an idea to a signed law involves multiple committee reviews, floor debates, and potential reconciliation between House and Senate versions. Currently, only 2% of introduced bills reach a final vote.",
          isExpandable: true,
        },
      },
    ],
  },
  {
    id: "knowledge-fec-101",
    sku: "PTS-KNOWLEDGE-FEC-101",
    title: "PACs vs Super PACs",
    type: "Knowledge",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    elements: [
      {
        id: "breakdown",
        type: "Metric.Dual.Comparison",
        data: {
          left: {
            label: "PAC Limit",
            val: 5000,
            unit: "/Year",
            color: "#4A5568",
          },
          right: { label: "Super PAC", val: "∞", color: "#E53E3E" },
        },
      },
      {
        id: "explanation",
        type: "Narrative.Insight.Summary",
        data: {
          text: "The primary difference lies in contribution limits and spending rules. Traditional PACs can give directly to candidates, while Super PACs can raise unlimited funds but must spend them independently.",
          isExpandable: false,
        },
      },
    ],
  },
  {
    id: "knw-rules-001",
    sku: "PTS-KNW-RULES-001",
    title: "Knowledge: Cloture Voting",
    type: "Knowledge",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Congress",
      insightType: "Legislative Procedure",
    },
    elements: [
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Cloture is the only procedure by which the Senate can vote to place a time limit on consideration of a bill or other matter, and thereby overcome a filibuster. It requires a 3/5ths vote (typically 60 senators).",
          accentColor: "#805AD5",
        },
      },
      {
        id: "stepper",
        type: "Metric.Progress.Stepper",
        data: {
          title: "Overcoming a Filibuster",
          stages: [
            { label: "Motion Filed" },
            { label: "Wait (2 Days)" },
            { label: "Vote (60 Req)" },
            { label: "Vote (Final)" },
          ],
          currentStageIndex: 2,
        },
      },
      {
        id: "source",
        type: "Identity.Source.Tag",
        data: { source: "Senate Rules Committee", reliability: "High" },
      },
    ],
  },
  {
    id: "knw-markup-001",
    sku: "PTS-KNW-MARKUP-001",
    title: "Context: The Markup Phase",
    type: "Knowledge",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Congress",
      insightType: "Legislative Procedure",
    },
    elements: [
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Committee 'Markup' is where the legislative sausage is actually made. Members debate, amend, and rewrite proposed legislation line-by-line before it ever sees the floor.",
          accentColor: "#718096",
        },
      },
      {
        id: "table",
        type: "Data.Table.Expandable",
        data: {
          title: "Markup Actions",
          headers: ["Action", "Description"],
          data: [
            {
              col1: "Amendment",
              col2: "Add/Remove language",
              details: ["Must be germane to bill topic"],
            },
            {
              col1: "Table",
              col2: "Kill the bill",
              details: ["Prevents it from reaching floor"],
            },
          ],
        },
      },
    ],
  },
  {
    id: "knw-layout-001",
    sku: "PTS-KNW-LAYOUT-001",
    title: "Structural Breakdown",
    type: "Knowledge",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Strategic Intelligence",
      insightType: "Platform Mechanics",
    },
    elements: [
      {
        id: "grouped-block",
        type: "Visual.Card.Base",
        data: {
          elements: [
            {
              id: "inner-nar",
              type: "Narrative.Insight.Summary",
              data: {
                text: "This card container wraps multiple elements to show complex structural layout capabilities within the PoliSnap system.",
                accentColor: "#718096",
              },
            },
            {
              id: "inner-metrics",
              type: "Metric.Dual.Comparison",
              data: {
                left: {
                  label: "Complexity",
                  val: 8,
                  unit: "/10",
                  color: "#3182CE",
                },
                right: {
                  label: "Utility",
                  val: 10,
                  unit: "/10",
                  color: "#38A169",
                },
              },
            },
          ],
        },
      },
      {
        id: "source",
        type: "Identity.Source.Tag",
        data: { source: "PoliTickIt UI Framework", reliability: "Verbatim" },
      },
    ],
  },
];

// 3. COMMITTEE SNAPS
export const committeeSnaps = [
  {
    id: "committee-hearing-001",
    sku: "PTS-COMMITTEE-HEARING-001",
    title: "Hearing: AI Safety Ethics",
    type: "Committee",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    elements: [
      {
        id: "detail",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Upcoming hearing in the House Committee on Science, Space, and Technology. Discussion will focus on traceability of AI-generated content in political advertising.",
          accentColor: "#805AD5",
        },
      },
      {
        id: "source",
        type: "Identity.Source.Tag",
        data: { source: "House Digital Resources", date: "Jan 25, 2026" },
      },
    ],
  },
  {
    id: "comm-velocity-001",
    sku: "PTS-COMM-VELOCITY-001",
    title: "Metrics: Committee Output",
    type: "Committee",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    elements: [
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "The Ways and Means Committee has processed 24% more bills this quarter than the 3-year average, primarily driven by expedited trade reviews.",
          accentColor: "#38A169",
        },
      },
      {
        id: "chart",
        type: "Visual.Chart.Bar",
        data: {
          title: "Bills Reported to Floor",
          data: [
            { label: "Energy", value: 12, value2: 15 },
            { label: "Finance", value: 45, value2: 38 },
            { label: "Ethics", value: 2, value2: 4 },
          ],
          legend: "D. Blue: Current | L. Blue: Avg",
        },
      },
    ],
  },
  {
    id: "comm-attendance-001",
    sku: "PTS-COMM-ATTENDANCE-001",
    title: "Attendance: Oversight Committee",
    type: "Committee",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    elements: [
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Average member attendance at full committee hearings dropped to 62% in December, the lowest level recorded this session.",
          accentColor: "#DD6B20",
        },
      },
      {
        id: "chart",
        type: "Visual.Chart.Line",
        data: {
          title: "Hearing Attendance (%)",
          data: [
            { label: "Aug", value: 92 },
            { label: "Sep", value: 85 },
            { label: "Oct", value: 78 },
            { label: "Nov", value: 80 },
            { label: "Dec", value: 62 },
          ],
        },
      },
    ],
  },
];

// 4. REPRESENTATIVE SNAPS (Profile & Productivity)
export const representativeSnaps = [
  {
    id: "rep-leg-focus-001",
    sku: "PTS-REP-LEG-FOCUS-001",
    title: "Rep Focus: Local Infrastructure",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Legislative Alignment",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "J000294",
          name: "Hakeem Jeffries",
          location: "New York",
          district: "District 8",
          party: "Democratic",
          position: "U.S. Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/J000294.jpg",
          tags: [{ name: "Minority Leader", type: "secondary" }],
        },
      },
    ],
  },
  {
    id: "rep-leg-focus-mcconnell",
    sku: "PTS-REP-LEG-FOCUS-MCCONNELL",
    title: "Rep Focus: Regional Energy",
    type: "Accountability",
    createdAt: "2026-01-24T12:10:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Legislative Alignment",
      representativeId: "M000355",
      headerElementId: "rep-header-mcconnell",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "M000355",
          name: "Mitch McConnell",
          location: "Kentucky",
          party: "Republican",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/M000355.jpg",
          tags: [{ name: "Minority Leader", type: "secondary" }],
        },
      },
      {
        id: "alignment",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Legislative Alignment",
          value: 85,
          leftLabel: "District Needs",
          rightLabel: "Party Line",
          insight:
            "McConnell remains a key architect of GOP legislative strategy, maintaining high alignment with national party goals.",
        },
      },
    ],
  },
  {
    id: "rep-leg-focus-schumer",
    sku: "PTS-REP-LEG-FOCUS-SCHUMER",
    title: "Rep Focus: Tech Innovation",
    type: "Accountability",
    createdAt: "2026-01-24T12:20:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Legislative Alignment",
      representativeId: "S000148",
      headerElementId: "rep-header-schumer",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          location: "New York",
          party: "Democratic",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
          tags: [{ name: "Majority Leader", type: "primary" }],
        },
      },
      {
        id: "alignment",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Legislative Alignment",
          value: 90,
          leftLabel: "District Needs",
          rightLabel: "Party Line",
          insight:
            "Schumer's focus on CHIPS Act implementation reflects deep alignment with both NY tech hubs and national strategy.",
        },
      },
    ],
  },
  {
    id: "rep-leg-focus-johnson",
    sku: "PTS-REP-LEG-FOCUS-JOHNSON",
    title: "Rep Focus: Defense Spending",
    type: "Accountability",
    createdAt: "2026-01-24T12:30:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Legislative Alignment",
      headerElementId: "rep-header-johnson",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "J000299",
          name: "Mike Johnson",
          location: "Louisiana",
          district: "District 4",
          party: "Republican",
          position: "U.S. Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/J000299.jpg",
          tags: [{ name: "Speaker", type: "primary" }],
        },
      },
      {
        id: "alignment",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Legislative Alignment",
          value: 75,
          leftLabel: "District Needs",
          rightLabel: "Party Line",
          insight:
            "Speaker Johnson balances district defense manufacturing interests with overall caucus budget priorities.",
        },
      },
    ],
  },
  {
    id: "rep-compare-001",
    sku: "PTS-REP-COMPARE-001",
    title: "Comparison: Bipartisan Overlap",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    elements: [
      {
        id: "comparison",
        type: "Metric.Dual.Comparison",
        data: {
          title: "Legislative Style",
          leftEntity: {
            name: "Jenkins",
            value: "82",
            label: "Party Loyalty",
          },
          rightEntity: {
            name: "Miller",
            value: "45",
            label: "Party Loyalty",
          },
          insight:
            "Jenkins maintains high party discipline, while Miller frequently crosses the aisle on budget votes.",
        },
      },
      {
        id: "trend-line",
        type: "Visual.Chart.Line",
        data: {
          title: "Bipartisanship Over Time (Index)",
          data: [
            { label: "2020", value: 30 },
            { label: "2021", value: 45 },
            { label: "2022", value: 42 },
            { label: "2023", value: 65 },
          ],
          legend: "Higher index indicates more bipartisan sponsorship.",
        },
      },
    ],
  },
  {
    id: "rep-townhall-001",
    sku: "PTS-REP-TOWNHALL-001",
    title: "Town Hall: District 12 Sentiment",
    type: "Representative",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    elements: [
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Sentiment analysis of the Jan 12th Town Hall indicates high frustration regarding property tax increases, accounting for 65% of attendee questions.",
          accentColor: "#E53E3E",
        },
      },
      {
        id: "gauge",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Constituent Alignment",
          value: 40,
          leftLabel: "Supportive",
          rightLabel: "Frustrated",
          insight:
            "Engagement levels are 2x higher than previous session, indicating high volatility in voter sentiment.",
        },
      },
      {
        id: "source",
        type: "Identity.Source.Tag",
        data: {
          source: "Local Press / Meeting Transcript",
          reliability: "Medium",
        },
      },
    ],
  },
  {
    id: "rep-prod-long-001",
    sku: "PTS-REP-PROD-LONG-001",
    title: "Profile: Sponsorship Depth",
    type: "Representative",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Legislative Sponsorship",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "O000172",
          name: "Alexandria Ocasio-Cortez",
          location: "New York",
          party: "Democratic",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/O000172.jpg",
          tags: [{ name: "Progressive Caucus", type: "primary" }],
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Sponsorship Effectiveness",
          agreeLabel: "Effective",
          disagreeLabel: "Underperforming",
          stats: {
            agree: 8200,
            disagree: 1800,
          },
        },
      },
      {
        id: "table",
        type: "Data.Table.Expandable",
        data: {
          title: "Primary Legislative Wins",
          headers: ["Bill Name", "Status"],
          data: [
            {
              col1: "H.R. 401 (Dock Bill)",
              col2: "Passed",
              details: [
                "Secured $12M for port automation",
                "Directly impacts 12k local jobs",
              ],
            },
            {
              col1: "S. 22 (Water Safety)",
              col2: "In Committee",
              details: ["Co-sponsored with Rep. Thompson"],
            },
          ],
        },
      },
    ],
  },
  {
    id: "rep-productivity-001",
    sku: "PTS-REP-PRODUCTIVITY-001",
    title: "Productivity: Mitt Romney",
    type: "Representative",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Legislative Footprint",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "R000615",
          name: "Mitt Romney",
          location: "Utah",
          party: "Republican",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/R000615.jpg",
        },
      },
      {
        id: "metrics",
        type: "Metric.Dual.Comparison",
        data: {
          left: { label: "Bills Authored", val: 14, color: "#38A169" },
          right: {
            label: "Floor Attendance",
            val: 99,
            unit: "%",
            color: "#38A169",
          },
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Productivity Score",
          agreeLabel: "Exceeds Expectations",
          disagreeLabel: "Needs Improvement",
          stats: {
            agree: 9500,
            disagree: 500,
          },
        },
      },
    ],
  },
  {
    id: "rep-discovery-001",
    sku: "PTS-REP-DISCOVERY-001",
    title: "Suggested for You",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Regional Peers",
      laymanSummary:
        "Representatives from neighboring districts with similar voting patterns on healthcare.",
    },
    elements: [
      {
        id: "rep-brief-1",
        type: "Identity.Rep.Brief",
        data: {
          id: "J000308",
          name: "Jeff Jackson",
          location: "North Carolina, District 14",
          position: "U.S. Representative",
          party: "Democratic",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/J000308.jpg",
          status: { isFollowing: false },
        },
      },
      {
        id: "rep-brief-2",
        type: "Identity.Rep.Brief",
        data: {
          id: "N000193",
          name: "Wiley Nickel",
          location: "North Carolina, District 13",
          position: "U.S. Representative",
          party: "Democratic",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/N000193.jpg",
          status: { isFollowing: true },
        },
      },
    ],
  },
];

// 5. TRENDING SNAPS
export const trendingSnaps = [
  {
    id: "trending-velocity-001",
    sku: "PTS-TRENDING-VELOCITY-001",
    title: "Trending: Legislative Velocity",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Trends",
      insightType: "Trends",
    },
    elements: [
      {
        id: "intro",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Bills related to 'Digital Privacy' are moving through committee 3x faster than the historical baseline for tech legislation.",
          accentColor: "#3182CE",
        },
      },
      {
        id: "velocity-chart",
        type: "Visual.Chart.Bar",
        data: {
          title: "Days in Committee (Avg)",
          data: [
            { label: "Privacy", value: 12, value2: 45 },
            { label: "AI Safety", value: 18, value2: 42 },
            { label: "Telecom", value: 55, value2: 48 },
          ],
          legend: "D. Blue: Current Session | L. Blue: 5-Year Avg",
        },
      },
      {
        id: "source",
        type: "Identity.Source.Tag",
        data: { source: "GovTrack Analytics", reliability: "High" },
      },
    ],
  },
  {
    id: "trending-sentiment-001",
    sku: "PTS-TRENDING-SENTIMENT-001",
    title: "Buzz Meter: Gas Tax Proposal",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Trends",
      insightType: "Trends",
    },
    elements: [
      {
        id: "summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Social sentiment for the proposed state gas tax has plummeted following the latest inflation reports. Negative mentions up 80% this week.",
          accentColor: "#E53E3E",
        },
      },
      {
        id: "gauge",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Public Sentiment Index",
          value: 12,
          leftLabel: "Positive",
          rightLabel: "Negative",
          insight:
            "Strong correlation between regional gas price spikes and negative sentiment spikes in rural districts.",
        },
      },
    ],
  },
  {
    id: "trending-topics-001",
    sku: "PTS-TRENDING-TOPICS-001",
    title: "Trending in Policy",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }], // Still goes in accountability feed
    metadata: {
      policyArea: "Trends",
      insightType: "Trends",
    },
    elements: [
      {
        id: "trend-list",
        type: "Narrative.Insight.Summary",
        data: {
          text: "#HealthcareReform is trending with 12k discussions. #CleanEnergy initiative gaining traction in committees.",
          accentColor: "#38A169",
        },
      },
    ],
  },
];

// 6. DASHBOARD SNAPS (Collective Accountability Dashboard)
export const dashboardSnaps = [
  {
    id: "dash-watchlist-core-001",
    sku: "PTS-DASH-WATCHLIST-CORE-001",
    title: "Your Accountability Watchlist",
    type: "Dashboard",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Watchlist Status",
      laymanSummary:
        "Real-time status of the 4 bills and 3 representatives you are currently tracking.",
    },
    elements: [
      {
        id: "leg-status",
        type: "Metric.Status.Grid",
        data: {
          title: "Legislation Tracking",
          items: [
            {
              id: "S.312",
              name: "Affordable Housing",
              status: "In Committee",
              color: "#ED8936",
              progress: 0.25,
            },
            {
              id: "H.R. 882",
              name: "Transit Auth.",
              status: "Floor Vote",
              color: "#38A169",
              progress: 0.75,
            },
            {
              id: "B.441",
              name: "Clean Air Act",
              status: "Introduced",
              color: "#4299E1",
              progress: 0.1,
            },
            {
              id: "S.Res 542",
              name: "Land Usage",
              status: "Stalled",
              color: "#D0021B",
              progress: 0.45,
            },
          ],
        },
      },
      {
        id: "rep-status",
        type: "Metric.Status.Grid",
        data: {
          title: "Representative Alignment",
          items: [
            {
              id: "dr-01",
              name: "David Rouzer",
              status: "78% Aligned",
              color: "#3182CE",
              type: "rep",
              party: "Republican",
            },
            {
              id: "sj-01",
              name: "Sarah Jenkins",
              status: "92% Aligned",
              color: "#38A169",
              type: "rep",
              party: "Democratic",
            },
            {
              id: "rc-01",
              name: "Robert Chen",
              status: "15% Aligned",
              color: "#D0021B",
              type: "rep",
              party: "Independent",
            },
          ],
        },
      },
    ],
  },
  {
    id: "dash-predictive-collective-001",
    sku: "PTS-DASH-PREDICTIVE-COL-001",
    title: "Collective Strategic Intelligence",
    type: "Dashboard",
    createdAt: "2026-01-26T08:00:00Z",
    sources: [{ name: "Predictive Analytics Engine", url: "#" }],
    metadata: {
      insightType: "Legislative Foresight",
      laymanSummary:
        "ML-driven passage probabilities for your core watchlist items.",
    },
    elements: [
      {
        id: "predictive-hits",
        type: "Metric.Predictive.Scoring",
        data: {
          title: "Upcoming Passage Odds",
          items: [
            {
              id: "S.312",
              name: "Affordable Housing",
              probability: 82,
              trend: "up",
              category: "Core Watchlist",
            },
            {
              id: "H.R. 882",
              name: "Transit Auth.",
              probability: 44,
              trend: "down",
              category: "Core Watchlist",
            },
            {
              id: "B.441",
              name: "Clean Air Act",
              probability: 12,
              trend: "stable",
              category: "Second Tier",
            },
          ],
        },
      },
      {
        id: "local-impact",
        type: "Metric.Local.Preference",
        data: {
          title: "Your District Impact (CA-12)",
          metrics: [
            {
              label: "Local Funding",
              value: "$1.2",
              suffix: "BN",
              subLabel: "Allocated this cycle",
            },
            {
              label: "Constituent Sentiment",
              value: "74",
              suffix: "%",
              subLabel: "Match your vote",
            },
            {
              label: "Job Creation",
              value: "+12k",
              subLabel: "Projected annual",
            },
            {
              label: "Active Projects",
              value: "8",
              subLabel: "In your zipcode",
            },
          ],
        },
      },
    ],
  },
  {
    id: "dash-community-pulse-001",
    sku: "PTS-DASH-COMMUNITY-PULSE-001",
    title: "Watchlist Community Pulse",
    type: "Dashboard",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Collective Sentiment",
      laymanSummary:
        "Aggregate sentiment from 12k constituents tracking the same items in your watchlist.",
    },
    elements: [
      {
        id: "sentiment-agg",
        type: "Visual.Aggregate.Pulse",
        data: {
          title: "Overall Watchlist Support",
          aggregateScore: 68,
          trend: "up",
          sectors: [
            { name: "Housing", score: 42 },
            { name: "Transit", score: 88 },
            { name: "Environment", score: 74 },
          ],
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Daily Pulse: General Direction",
          agreeLabel: "Satisfied",
          disagreeLabel: "Concerned",
          stats: {
            agree: 6400,
            disagree: 3600,
          },
        },
      },
    ],
  },
];

// 7. SPONSORED & SPECIAL CONTENT
export const sponsoredSnaps = [
  {
    id: "sponsored-001",
    sku: "PTS-SPONSORED-001",
    title: "Community Initiative: River Protection",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [
      { name: "Clean Water Action", url: "https://www.cleanwateraction.org" },
    ],
    metadata: {
      insightType: "Sponsored Awareness",
      laymanSummary:
        "Join Clean Water Action in advocating for stricter wastewater standards to protect the Cape Fear River from industrial runoff.",
    },
    elements: [
      {
        id: "sponsor-header",
        type: "Header.Sponsor",
        data: {
          sponsorName: "Clean Water Action",
          promotionTitle: "Protecting the Cape Fear River",
          isVerified: true,
          organizationType: "501(c)(3)",
          imgUri:
            "https://ui-avatars.com/api/?name=Clean+Water+Action&background=E0F2FE&color=0369A1",
          tags: [
            { name: "Environment", type: "primary" },
            { name: "Local", type: "secondary" },
          ],
        },
      },
      {
        id: "advocacy-summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "A recent study shows a 15% increase in runoff pollution. We need 5,000 signatures to trigger a local oversight hearing.",
          accentColor: "#3182CE",
        },
      },
      {
        id: "volunteer-cta",
        type: "Interaction.Action.Card",
        data: {
          title: "URGENT ACTION REQUIRED",
          label: "VOLUNTEER FOR RIVER CLEANUP",
          actionType: "external_link",
          actionPayload: "https://cleanwater.org/volunteer",
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Public Support for Oversight Hearing",
          agreeLabel: "Support Hearing",
          disagreeLabel: "Need More Data",
          stats: {
            agree: 2840,
            disagree: 320,
          },
        },
      },
    ],
  },
];

// 8. ECONOMICS SNAPS
export const economicsSnaps = [
  {
    id: "econ-inflation-001",
    sku: "PTS-ECON-INFLATION-001",
    title: "Inflation: The Path to 2%",
    type: "Economics",
    createdAt: "2026-01-24T09:00:00Z",
    sources: [{ name: "Bureau of Labor Statistics", url: "https://bls.gov" }],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "National Trend",
      laymanSummary:
        "Tracking the Consumer Price Index (CPI) against the Federal Reserve's long-term target of 2%. Current data shows persistent core inflation in service sectors.",
    },
    elements: [
      {
        id: "inflation-dual",
        type: "Metric.Comparison.Horizontal",
        data: {
          items: [
            {
              label: "Current CPI (Dec 2025)",
              value: "3.2%",
              subtext: "Down from 4.1%",
            },
            { label: "Fed Target", value: "2.0%", subtext: "Long-term goal" },
          ],
        },
      },
      {
        id: "econ-insight",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Housing and Insurance costs remain the primary drivers of inflation. Energy prices have stabilized, but core services remain sticky above 3%.",
          accentColor: "#4299E1",
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Cost of Living Sentiment",
          agreeLabel: "Improving",
          disagreeLabel: "Worsening",
          stats: { agree: 340, disagree: 820 },
        },
      },
    ],
  },
  {
    id: "econ-employment-001",
    sku: "PTS-ECON-EMPLOYMENT-001",
    title: "Labor Market Resilience",
    type: "Economics",
    createdAt: "2026-01-24T09:15:00Z",
    sources: [
      { name: "Department of Labor", url: "https://dol.gov" },
      { name: "ADP Research Institute", url: "https://adp.com" },
    ],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "Employment Mix",
      laymanSummary:
        "The economy added 185k jobs last month. While hiring in Tech has slowed, Healthcare and Hospitality continue to show strong demand for workers.",
    },
    elements: [
      {
        id: "jobs-metrics",
        type: "Metric.Column.Triple",
        data: {
          metrics: [
            { label: "Unemployment", value: "3.7%", subtext: "Steady" },
            { label: "Wage Growth", value: "4.1%", subtext: "Annualized" },
            { label: "Labor Base", value: "168M", subtext: "Total Workforce" },
          ],
        },
      },
      {
        id: "jobs-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Personal Job Security",
          agreeLabel: "Feeling Secure",
          disagreeLabel: "Concerned",
          stats: { agree: 520, disagree: 410 },
        },
      },
    ],
  },
  {
    id: "econ-fed-001",
    sku: "PTS-ECON-FED-001",
    title: "The Federal Reserve Watch",
    type: "Economics",
    createdAt: "2026-01-24T10:00:00Z",
    sources: [
      { name: "Federal Reserve Board", url: "https://federalreserve.gov" },
    ],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "Interest Rate Outlook",
      laymanSummary:
        "The Fed maintains the Federal Funds Rate at 'Restrictive' levels to ensure inflation returns to target. Markets are pricing in the first potential cut by mid-year.",
    },
    elements: [
      {
        id: "fed-stepper",
        type: "Metric.Progress.Stepper",
        data: {
          title: "Monetary Policy Cycle",
          stages: [
            { label: "Hiking" },
            { label: "The Peak" },
            { label: "The Pivot" },
            { label: "Easing" },
          ],
          currentStageIndex: 1,
        },
      },
      {
        id: "rate-metric",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Fed Stance Alignment",
          value: 85,
          leftLabel: "Dovish",
          rightLabel: "Hawkish",
          insight:
            "Fed governors remain unified on 'higher for longer' messaging despite slowing economic growth.",
        },
      },
      {
        id: "fed-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Rate Impact Sentiment",
          agreeLabel: "Support High Rates",
          disagreeLabel: "Time to Cut",
          stats: { agree: 180, disagree: 640 },
        },
      },
    ],
  },
  {
    id: "econ-housing-001",
    sku: "PTS-ECON-HOUSING-001",
    title: "National Housing Affordability",
    type: "Economics",
    createdAt: "2026-01-24T10:30:00Z",
    sources: [
      { name: "NAR (National Assoc. Realtors)", url: "https://realtor.org" },
      { name: "Zillow Research", url: "https://zillow.com" },
    ],
    metadata: {
      policyArea: "Housing and Community Development",
      insightType: "Market Access",
      laymanSummary:
        "Housing affordability has hit an 18-year low. High mortgage rates combined with decade-low inventory levels are creating a significant barrier for first-time buyers.",
    },
    elements: [
      {
        id: "mortgage-metric",
        type: "Metric.Dual.Highlight",
        data: {
          title: "30-Year Fixed Mortgage",
          primary: { label: "Current Avg", value: "6.8%" },
          secondary: { label: "2-Year Avg", value: "3.5%" },
        },
      },
      {
        id: "housing-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Market Outlook",
          agreeLabel: "Buying Soon",
          disagreeLabel: "Waiting",
          stats: { agree: 120, disagree: 1100 },
        },
      },
    ],
  },
  {
    id: "econ-gdp-001",
    sku: "PTS-ECON-GDP-001",
    title: "GDP Growth & Economic Output",
    type: "Economics",
    createdAt: "2026-01-24T11:00:00Z",
    sources: [{ name: "Bureau of Economic Analysis", url: "https://bea.gov" }],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "Growth Metric",
      laymanSummary:
        "The U.S. economy grew at a 2.4% annualized rate in the last quarter, outperforming expectations despite higher interest rates.",
    },
    elements: [
      {
        id: "gdp-gauge",
        type: "Metric.Alignment.Gauge",
        data: {
          title: "Economic Momentum",
          value: 65,
          leftLabel: "Contraction",
          rightLabel: "Expansion",
          insight:
            "Consumer spending remains the primary engine of growth, though private investment has cooled slightly.",
        },
      },
      {
        id: "gdp-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Growth Perception",
          agreeLabel: "Feeling Growth",
          disagreeLabel: "Feeling Stagnant",
          stats: { agree: 450, disagree: 680 },
        },
      },
    ],
  },
  {
    id: "econ-energy-001",
    sku: "PTS-ECON-ENERGY-001",
    title: "Gas Prices & Energy Costs",
    type: "Economics",
    createdAt: "2026-01-24T11:30:00Z",
    sources: [{ name: "EIA (Energy Info Admin)", url: "https://eia.gov" }],
    metadata: {
      policyArea: "Energy",
      insightType: "Household Expense",
      laymanSummary:
        "National average gas prices have decreased by $0.15 over the last 30 days due to increased domestic production and stabilizing global crude prices.",
    },
    elements: [
      {
        id: "gas-dual",
        type: "Metric.Comparison.Horizontal",
        data: {
          items: [
            {
              label: "National Avg",
              value: "$3.12",
              subtext: "Regular Unleaded",
            },
            { label: "One Year Ago", value: "$3.45", subtext: "-9.5% YoY" },
          ],
        },
      },
      {
        id: "gas-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Energy Cost Relief",
          agreeLabel: "Feeling Relief",
          disagreeLabel: "Still Too High",
          stats: { agree: 890, disagree: 1200 },
        },
      },
    ],
  },
  {
    id: "econ-debt-001",
    sku: "PTS-ECON-DEBT-001",
    title: "The National Debt & Deficit",
    type: "Economics",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [
      {
        name: "Treasury Dept (Fiscal Service)",
        url: "https://fiscal.treasury.gov",
      },
    ],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "Long-term Fiscal Health",
      laymanSummary:
        "Total public debt has surpassed $34 trillion. Interest payments on the debt now exceed the annual budget for many major federal departments.",
    },
    elements: [
      {
        id: "debt-metrics",
        type: "Metric.Dual.Highlight",
        data: {
          title: "Fiscal Pressure",
          primary: { label: "Daily Interest", value: "$2.1B" },
          secondary: { label: "Debt/GDP", value: "123%" },
        },
      },
      {
        id: "debt-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Fiscal Priority",
          agreeLabel: "Cut Spending",
          disagreeLabel: "Invest in Growth",
          stats: { agree: 2400, disagree: 1800 },
        },
      },
    ],
  },
  {
    id: "econ-retail-001",
    sku: "PTS-ECON-RETAIL-001",
    title: "Consumer Confidence & Retail",
    type: "Economics",
    createdAt: "2026-01-24T12:30:00Z",
    sources: [{ name: "Census Bureau", url: "https://census.gov" }],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "Spending Habits",
      laymanSummary:
        "Retail sales showed a surprise 0.6% increase in December, as consumer spending held up despite higher borrowing costs.",
    },
    elements: [
      {
        id: "retail-triple",
        type: "Metric.Column.Triple",
        data: {
          metrics: [
            { label: "E-Commerce", value: "+1.2%", subtext: "MoM" },
            { label: "Dining Out", value: "+0.8%", subtext: "MoM" },
            { label: "Electronics", value: "-1.5%", subtext: "Seasonal" },
          ],
        },
      },
      {
        id: "spending-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Personal Spending",
          agreeLabel: "Spending More",
          disagreeLabel: "Cutting Back",
          stats: { agree: 670, disagree: 1540 },
        },
      },
    ],
  },
  {
    id: "econ-cpi-audit-001",
    sku: "PTS-ECON-CPI-AUDIT-001",
    title: "CPI Breakdown: Service Sector Audit",
    type: "Economics",
    createdAt: "2026-01-24T13:00:00Z",
    sources: [{ name: "Bureau of Labor Statistics", url: "https://bls.gov" }],
    metadata: {
      policyArea: "Economics and Public Finance",
      insightType: "Detailed Category Audit",
      laymanSummary:
        "Intelligence Tier: A granular look at the components driving persistent service-sector inflation. While energy has cooled, shelter and insurance costs remain the primary friction points.",
    },
    elements: [
      {
        id: "cpi-table",
        type: "Data.Table.Expandable",
        data: {
          title: "Inflation by Category (YoY)",
          headers: ["Category", "Rate"],
          data: [
            {
              col1: "Shelter",
              col2: "+6.2%",
              details: [
                "Primary driver of core CPI",
                "Rent equivalent up 5.8%",
                "Persistent supply-side pressure",
              ],
            },
            {
              col1: "Transportation",
              col2: "+9.4%",
              details: [
                "Driven by auto insurance premiums",
                "Repair costs up 12% YoY",
                "Gasoline actually down 1.2%",
              ],
            },
            {
              col1: "Food Away from Home",
              col2: "+5.1%",
              details: [
                "Labor costs for restaurants increasing",
                "Ingredients (Commodities) stabilizing",
              ],
            },
            {
              col1: "Medical Services",
              col2: "+2.1%",
              details: [
                "Health insurance indexing lagged",
                "Hospital outpatient care surging",
              ],
            },
          ],
        },
      },
      {
        id: "cpi-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Personal Cost Pressure",
          agreeLabel: "Housing is Worst",
          disagreeLabel: "Transpo/Food Worst",
          stats: { agree: 1540, disagree: 1120 },
        },
      },
    ],
  },
];
// 9. COLLECTIVE AUDIT SNAPS
export const auditSnaps = [
  {
    id: "ethics-dark-money-mirror-001",
    sku: "ETH-AUD-DMM-001",
    title: "Ethics Audit: The Dark Money Mirror",
    type: "Accountability",
    createdAt: "2026-01-29T10:00:00Z",
    sources: [
      { name: "Office of Congressional Ethics", url: "https://oce.house.gov" },
      { name: "FEC Forensic API", url: "https://www.fec.gov/data/" },
    ],
    metadata: {
      policyArea: "Ethics",
      insightType: "Corruption Correlation",
      applicationTier: "ROI Auditor",
      laymanSummary:
        "A forensic audit correlating ethics referrals with campaign finance velocity to detect lobbyist influence.",
    },
    elements: [
      {
        id: "rep-header-ethics",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          location: "New York",
          position: "U.S. Senator",
          party: "Democratic",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
        },
      },
      {
        id: "corruption-index",
        type: "Metric.CorruptionIndex",
        data: {
          title: "CORRUPTION INDEX",
          score: 84,
          donor: "Sovereign Tech PAC",
          industry: "Technology",
          amount: "$250,000",
          voteAction: "Against H.B. 402",
          insight: "Referral linked to donation spike.",
          confidence: 0.92,
        },
      },
      {
        id: "fec-correlation",
        type: "Data.Correlation.Heatmap",
        data: {
          donors: [
            { industry: "Tech", amount: 250000, correlation: 0.92 },
            { industry: "Energy", amount: 150000, correlation: 0.45 },
          ],
          totalInfluence: 0.84,
        },
      },
      {
        id: "ethics-provenance",
        type: "Trust.Thread",
        presentation: {
          attributes: {
            spacing: "v-rhythm-tight-1",
            fontSizeOffset: 5,
            preservePillboxScale: true,
          },
        },
        data: {
          referenceId: "OCE-23-4901",
          serialNumber: "TX-4902-TRUTH",
          verificationLevel: "Tier 3",
          oracleSource: "Office of Congressional Ethics",
        },
      },
    ],
  },
  {
    id: "ethics-committee-pivot-generic",
    sku: "ETH-AUD-CRP-001",
    title: "Ethics Finding: Institutional Pivot",
    type: "Accountability",
    createdAt: "2026-01-30T12:00:00Z",
    sources: [
      { name: "House Ethics Committee", url: "https://ethics.house.gov" },
    ],
    metadata: {
      policyArea: "Ethics",
      insightType: "Committee Finding",
      applicationTier: "ROI Auditor",
      laymanSummary:
        "A high-intensity snap class mapping 'Substantial Evidence' findings directly to the representative's record.",
    },
    elements: [
      {
        id: "rep-header-generic",
        type: "Header.Representative",
        data: {
          id: "GENERIC_REP",
          name: "Representative Template",
          location: "District Registry",
          position: "Member of Congress",
          party: "Unassigned",
          imgUri: "https://via.placeholder.com/225x275",
        },
      },
      {
        id: "finding-summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "The committee has released a report regarding alleged violations of institutional rules. This snap will be updated as forensic details are serialized.",
        },
      },
      {
        id: "corruption-index-high",
        type: "Metric.CorruptionIndex",
        data: {
          title: "PIVOT INTENSITY",
          score: 92,
          donor: "Multiple Oracles",
          industry: "Varies",
          amount: "Analysis Pending",
          voteAction: "Institutional Review",
          insight: "High-intensity finding detected in formal release.",
          confidence: 0.95,
        },
      },
      {
        id: "allegation-list",
        type: "Metric.Achievement.List",
        data: {
          title: "Formal Allegations",
          items: [
            "Violation of House Rule XXIII",
            "Conduct Unbecoming",
            "Financial Disclosure Omission",
          ],
        },
      },
      {
        id: "institutional-proof",
        type: "Trust.Thread",
        presentation: {
          attributes: {
            spacing: "v-rhythm-tight-1",
            fontSizeOffset: 5,
            preservePillboxScale: true,
          },
        },
        data: {
          referenceId: "ETHICS-FINDING-001",
          serialNumber: "INSTITUTIONAL-101",
          verificationLevel: "Tier 3",
          oracleSource: "House Committee on Ethics",
        },
      },
    ],
  },
  {
    id: "ethics-florida-fraud-001",
    sku: "ETH-AUD-CRP-FL-001",
    title: "Ethics Finding: Substantial Evidence of Fraud",
    type: "Accountability",
    createdAt: "2026-01-29T10:00:00Z",
    sources: [
      { name: "House Ethics Committee", url: "https://ethics.house.gov" },
    ],
    metadata: {
      policyArea: "Ethics",
      insightType: "Committee Finding",
      applicationTier: "ROI Auditor",
      representativeId: "FL-DEM-001",
      laymanSummary:
        "The House Ethics Committee has announced findings of substantial evidence regarding fraud charges against a Florida representative.",
    },
    elements: [
      {
        id: "rep-header-fl",
        type: "Header.Representative",
        data: {
          id: "FL-DEM-001",
          name: "Florida Representative",
          location: "Florida",
          position: "Member of Congress",
          party: "Democratic",
          imgUri: "https://via.placeholder.com/225x275",
        },
      },
      {
        id: "fraud-summary",
        type: "Narrative.Insight.Summary",
        data: {
          text: "A special subcommittee has concluded there is 'substantial evidence' that the representative engaged in a scheme to defraud a venture capital firm and diverted campaign funds for personal use.",
        },
      },
      {
        id: "corruption-index-fl",
        type: "Metric.CorruptionIndex",
        data: {
          title: "PIVOT INTENSITY",
          score: 95,
          donor: "Multiple Oracles",
          industry: "Venture Capital / Campaign Funds",
          amount: "$150,000+",
          voteAction: "Fraud Investigation",
          insight:
            "Institutional finding of 'Substantial Evidence' triggers maximum pivot intensity.",
          confidence: 0.98,
        },
      },
      {
        id: "fraud-allegations",
        type: "Metric.Achievement.List",
        data: {
          title: "Documented Allegations",
          items: [
            "Wire Fraud",
            "Campaign Finance Diversion",
            "False Statements to Ethics Committee",
          ],
        },
      },
      {
        id: "ethics-proof-fl",
        type: "Trust.Thread",
        presentation: {
          attributes: {
            spacing: "v-rhythm-tight-1",
            fontSizeOffset: 5,
            preservePillboxScale: true,
          },
        },
        data: {
          referenceId: "FL-ETH-2026-042",
          serialNumber: "INST-FL-402",
          verificationLevel: "Tier 3",
          oracleSource: "House Committee on Ethics",
        },
      },
    ],
  },
  {
    id: "audit-schumer-2026",
    sku: "PTS-AUDIT-SCHUMER-001",
    title: "Representation ROI: 2026 Accountability Audit",
    type: "Accountability",
    createdAt: "2026-01-26T12:00:00Z",
    sources: [
      { name: "FEC.gov", url: "#" },
      { name: "Congress.gov", url: "#" },
      { name: "PoliTickIt Pulse", url: "#" },
    ],
    metadata: {
      policyArea: "Accountability",
      insightType: "ROI Audit",
      representativeId: "S000148",
      laymanSummary:
        "A comprehensive review of Senator Chuck Schumer's session metrics, providing transparency into his ROI for New York constituents.",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          party: "Democratic",
          location: "New York, Senator",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
        },
      },
      {
        id: "schumer-scorecard",
        type: "Metric.Accountability.Scorecard",
        data: {
          representativeId: "S000148",
          overallGrade: "A-",
          metrics: {
            alignment: { value: 89, label: "User Alignment" },
            corruptionIndex: {
              value: 8,
              label: "Corruption Risk",
              status: "Low",
            },
            sentimentGap: { value: 3, label: "Constituent Delta" },
          },
          topAlignedTopics: ["Labor", "Technology", "Healthcare"],
          topConflictTopics: ["Crypto Regulation", "Agriculture"],
          asOfDate: "JAN 25, 2026",
          sources: ["FEC.gov", "Congress.gov", "PoliTickIt Pulse"],
          drillDownSnapId: "cr-schumer-tech-2026",
        },
      },
    ],
  },
  {
    id: "audit-casar-2026",
    sku: "PTS-AUDIT-CASAR-001",
    title: "Representation ROI: 2026 Accountability Audit",
    type: "Accountability",
    createdAt: "2026-01-26T12:00:00Z",
    sources: [
      { name: "FEC.gov", url: "#" },
      { name: "Congress.gov", url: "#" },
      { name: "PoliTickIt Pulse", url: "#" },
    ],
    metadata: {
      policyArea: "Accountability",
      insightType: "ROI Audit",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
          tags: [{ name: "Progressive Caucus", type: "primary" }],
        },
      },
      {
        id: "casar-scorecard",
        type: "Metric.Accountability.Scorecard",
        data: {
          representativeId: "C001131",
          overallGrade: "B+",
          metrics: {
            alignment: { value: 82, label: "User Alignment" },
            corruptionIndex: {
              value: 14,
              label: "Corruption Risk",
              status: "Low",
            },
            sentimentGap: { value: 5, label: "Constituent Delta" },
          },
          topAlignedTopics: ["Infrastructure", "Housing", "Labor Rights"],
          topConflictTopics: ["Military Spending", "Silicon Valley PACs"],
          asOfDate: "JAN 26, 2026",
          sources: ["FEC.gov", "Congress.gov", "PoliTickIt Pulse"],
          drillDownSnapId: "cr-summary-casar-week3-2026",
        },
      },
    ],
  },
  {
    id: "audit-casar-free-2026",
    sku: "PTS-AUDIT-CASAR-FREE",
    title: "Public Audit Overview",
    type: "Accountability",
    createdAt: "2026-01-26T12:00:00Z",
    sources: [{ name: "OpenSecrets", url: "#" }],
    metadata: {
      policyArea: "Accountability",
      insightType: "Audit Summary",
      representativeId: "C001131",
      laymanSummary:
        "This public audit provides a transparent overview of Representative Greg Casar's legislative engagement and fiscal responsibility metrics, derived from open-source parliamentary records and FEC filings.",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
          tags: [{ name: "Progressive Caucus", type: "primary" }],
        },
      },
      {
        id: "public-metrics",
        type: "Metric.Group",
        data: {
          title: "PUBLIC PERFORMANCE OVERVIEW",
          metrics: [
            { label: "FLOOR ATTENDANCE", value: "98%" },
            { label: "BILLS SPONSORED", value: "42" },
            { label: "VOTING FREQUENCY", value: "99.2%" },
          ],
        },
      },
      {
        id: "casar-audit-summary",
        type: "Narrative.Insight.Summary",
        data: {
          title: "Public Accountability Summary",
          text: "Representative Casar maintains high floor attendance and legislative activity relative to his peer group in the current session. His focus remains on labor rights and infrastructure development within the 35th district of Texas.",
        },
      },
    ],
  },
  {
    id: "audit-johnson-2026",
    sku: "PTS-AUDIT-JOHNSON-001",
    title: "Representative Audit: 2026 Performance Metrics",
    type: "Accountability",
    createdAt: "2026-01-25T14:00:00Z",
    sources: [
      { name: "FEC.gov", url: "#" },
      { name: "Congress.gov", url: "#" },
      { name: "PoliTickIt Pulse", url: "#" },
    ],
    metadata: {
      policyArea: "Accountability",
      insightType: "ROI Audit",
      representativeId: "J000299",
      laymanSummary:
        "This high-fidelity performance audit tracks Representative Mike Johnson's alignment with institutional standards and constituent ROI.",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "J000299",
          name: "Mike Johnson",
          party: "Republican",
          location: "Louisiana, District 4",
          position: "U.S. Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/J000299.jpg",
        },
      },
      {
        id: "johnson-scorecard",
        type: "Metric.Accountability.Scorecard",
        data: {
          representativeId: "J000299",
          overallGrade: "D-",
          metrics: {
            alignment: { value: 12, label: "User Alignment" },
            corruptionIndex: {
              value: 78,
              label: "Corruption Risk",
              status: "Severe",
            },
            sentimentGap: { value: 42, label: "Constituent Delta" },
          },
          topAlignedTopics: ["National Defense", "Energy"],
          topConflictTopics: [
            "Climate Integrity",
            "Public Transparency",
            "PAC Proximity",
          ],
          asOfDate: "jan 25, 2026",
          sources: ["FEC.gov", "Congress.gov", "PoliTickIt Pulse"],
          drillDownSnapId: "cr-summary-johnson-week3-2026",
        },
      },
    ],
  },
  {
    id: "FEC-TX35-CASAR-2026",
    sku: "PTS-LI-TX35-CASAR-2026",
    title: "FORENSIC LINEAGE: H.R. 882 CORRUPTION AUDIT",
    type: "Representative",
    createdAt: "2026-01-26T23:59:59Z",
    sources: [
      { name: "FEC.gov", url: "https://www.fec.gov" },
      { name: "Congress.gov", url: "https://www.congress.gov" },
    ],
    metadata: {
      policyArea: "Accountability",
      insightType: "Forensic Audit",
      representativeId: "C001131",
      laymanSummary:
        "This forensic audit establishes the causal link between Global Energy PAC contributions and the YEA vote on H.R. 882 (Infrastructure Expansion Bill).",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
          tags: [{ name: "Progressive Caucus", type: "primary" }],
        },
      },
      {
        id: "lin-1",
        type: "Narrative.Insight.Summary",
        data: {
          title: "ESTABLISHING LINEAGE",
          summary:
            "On January 22, 2026, Global Energy PAC recorded a maximum individual donation of $5,000 to the Casar for Congress committee. On January 26, Representative Casar cast a decisive 'YEA' vote on H.R. 882, which includes a $40B carve-out for sub-critical energy infrastructure projects.",
        },
      },
      {
        id: "lin-2",
        type: "Data.Correlation.Heatmap",
        data: {
          totalInfluence: 5000,
          donors: [
            {
              industry: "Energy & Natural Resources",
              amount: 5000,
              correlation: 0.95,
            },
          ],
        },
        presentation: {
          title: "PRIMARY SECTOR CORRELATION",
        },
      },
      {
        id: "lin-3",
        type: "Metric.FEC.Details",
        data: {
          transactionId: "FEC-88219-X",
          donor: "Global Energy PAC",
          amount: "$5,000.00",
          date: "JAN 22, 2026",
          status: "Hardened Ledger Entry",
          drillDownSnapId: "cr-debate-hr882-2026",
        },
      },
    ],
  },
];

// 4. PARTICIPATION & GAMIFICATION SNAPS
export const participationSnaps = [
  {
    id: "part-milestone-001",
    sku: "PTS-PART-MILESTONE-001",
    title: "Participation Milestone Reached!",
    type: "Reward",
    createdAt: "2026-01-26T12:00:00Z",
    sources: [{ name: "PoliTickIt Rewards", url: "#" }],
    metadata: {
      policyArea: "Community",
      insightType: "Collective Signal Bonus",
    },
    elements: [
      {
        id: "reward-badge",
        type: "Metric.Grade",
        data: {
          label: "CONSTITUENT SCORE",
          grade: "A+",
          color: "#38A169",
          description: "Top 5% Engaged in District 35",
        },
      },
      {
        id: "reward-text",
        type: "Narrative.Insight.Summary",
        data: {
          text: "You've earned 500 Participation Credits! Tier 1 Unlocked: You can now view FEC Correlation Intelligence for all your followed representatives.",
          accentColor: "#38A169",
        },
      },
      {
        id: "reward-action",
        type: "Interaction.Action.Card",
        data: {
          label: "CLAIM REWARD",
          title: "View Unlocked FEC Insights",
          icon: "unlock",
          actionType: "view_pro",
        },
      },
    ],
  },
  {
    id: "part-pulse-001",
    sku: "PTS-PART-PULSE-001",
    title: "The Pulse: Infrastructure Priorities",
    type: "Knowledge",
    createdAt: "2026-01-26T11:00:00Z",
    sources: [{ name: "Community Voting", url: "#" }],
    metadata: {
      policyArea: "Infrastructure",
      insightType: "Strategic Pulse",
    },
    elements: [
      {
        id: "pulse-header",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Help us determine which infrastructure projects matter most to your neighborhood. Your vote counts towards unlocking the 'Local ROI' audit for Greg Casar.",
          accentColor: "#3182CE",
        },
      },
      {
        id: "pulse-slider-1",
        type: "Interaction.Sentiment.Slider",
        data: {
          title: "Public Transit vs. Road Repair",
          leftLabel: "TRANSIT",
          rightLabel: "ROADS",
        },
      },
      {
        id: "pulse-slider-2",
        type: "Interaction.Sentiment.Slider",
        data: {
          title: "Focus: New Construction vs. Maintenance",
          leftLabel: "NEW",
          rightLabel: "MAINTAIN",
        },
      },
    ],
  },
  {
    id: "part-leaderboard-001",
    sku: "PTS-PART-LEAD-001",
    title: "Regional Sovereignty Rank",
    type: "Reward",
    createdAt: "2026-01-27T08:00:00Z",
    sources: [{ name: "PoliTickIt Collective", url: "#" }],
    metadata: {
      policyArea: "Community",
      insightType: "Collective Leaderboard",
      headerElementId: "leaderboard-main",
    },
    elements: [
      {
        id: "leaderboard-main",
        type: "Metric.Leaderboard.Regional",
        data: {
          title: "Top Contributors",
          region: "Texas District 35",
          totalParticipants: 12450,
          entries: [
            {
              rank: 1,
              name: "CivicGuru_42",
              credits: 15400,
              district: "Austin, TX",
            },
            {
              rank: 2,
              name: "JusticeSeeker",
              credits: 12100,
              district: "San Antonio, TX",
            },
            {
              rank: 3,
              name: "PolicyPulse_ATX",
              credits: 11850,
              district: "Austin, TX",
            },
            {
              rank: 42,
              name: "YOU",
              credits: 3500,
              district: "Austin, TX",
              isCurrentUser: true,
            },
          ],
        },
      },
    ],
  },
];

// 12. INSTITUTIONAL B2B POC SNAPS
export const institutionalSnaps = [
  {
    id: "sentinel-hr-1234-manual",
    sku: "SENTINEL-STAGNATION-HR-1234",
    title: "Stagnation Sentinel: HR 1234",
    type: "Accountability",
    createdAt: new Date().toISOString(),
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      policyArea: "Legislative Oversight",
      insightType: "Committee Stagnation",
      keywords: ["Stagnation", "Friction", "Bureaucracy", "Sentinel"],
      laymanSummary:
        "CRITICAL STAGNATION: This bill (HR 1234) has been dormant for 242 days. Our forensic analysis indicates high institutional resistance in the House Committee.",
    },
    elements: [
      {
        id: "stagnation-gauge",
        type: "Universal.Gauge",
        data: {
          mode: "Friction",
          value: 78,
          label: "Committee Friction",
          subLabel: "242 Days Dormant",
        },
      },
      {
        id: "impact-indicator",
        type: "Universal.Gauge",
        data: {
          mode: "Linear",
          value: 65,
          label: "Accountability Delta",
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          oracleSource: "Congress.gov API v3",
          verificationLevel: "Tier 2",
          analysisMode: "Forensic Stagnation Check",
        },
      },
    ],
  },
  {
    id: "b2b-consensus-001",
    sku: "PTS-B2B-CON-001",
    title: "Institutional Consensus",
    type: "Accountability",
    createdAt: "2026-01-26T14:00:00Z",
    sources: [{ name: "PoliTickIt B2B Data Engine", url: "#" }],
    metadata: {
      policyArea: "Accountability",
      insightType: "Constituent Capital",
      representativeId: "C001131",
      applicationTier: "Institutional",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          location: "Texas",
          district: "District 35",
          position: "U.S. Representative",
          party: "Democratic",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "predictive-passage",
        type: "Metric.Predictive.Forecasting",
        data: {
          billTitle: "HR 445: Artificial Intelligence Safety Act",
          passageProbability: 78,
          sentimentRipple: 0.85,
          momentum: "surging",
          predictionSource: "PoliTickIt AI Engine",
        },
      },
      {
        id: "ripple-tx-35",
        type: "Data.Consensus.Ripple",
        data: {
          district: "TX District 35",
          consensusScore: 62,
          respondents: 14500,
          capitalVolume: "HIGH",
          trend: "rising",
          clusters: [
            { name: "Labor", sentiment: 82, size: 0.8 },
            { name: "Tech", sentiment: 45, size: 0.5 },
            { name: "Verified Residents", sentiment: 71, size: 0.9 },
          ],
        },
      },
      {
        id: "ripple-ny-14",
        type: "Data.Consensus.Ripple",
        data: {
          district: "NY District 14",
          consensusScore: 89,
          respondents: 22100,
          capitalVolume: "CRITICAL",
          trend: "stable",
          clusters: [
            { name: "Transit", sentiment: 92, size: 0.95 },
            { name: "Housing", sentiment: 88, size: 0.9 },
            { name: "Healthcare", sentiment: 95, size: 0.85 },
          ],
        },
      },
    ],
  },
  {
    id: "institutional-fec-audit-001",
    sku: "PTS-INST-FEC-001",
    title: "Institutional FEC Audit",
    type: "Accountability",
    createdAt: "2026-01-28T09:00:00Z",
    sources: [{ name: "FEC.gov", url: "https://fec.gov" }],
    metadata: {
      policyArea: "Finance & Ethics",
      insightType: "Campaign Audit",
      representativeId: "O000172",
      applicationTier: "Institutional",
      headerElementId: "rep-header",
      provenance: {
        url: "https://www.fec.gov/data/candidate/H8NY15148/",
        label: "View Forensic Proof (FEC Record)",
        type: "official",
        provider: "FEC.gov",
        isVerified: true,
        timestamp: "2026-01-28T09:00:00Z",
      },
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "O000172",
          name: "Alexandria Ocasio-Cortez",
          party: "Democratic",
          location: "New York",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/O000172.jpg",
          tags: [{ name: "Progressive Caucus", type: "primary" }],
        },
      },
      {
        id: "fec-analysis",
        type: "Metric.FEC.ContributionAnalysis",
        provenance: {
          url: "https://www.fec.gov/data/candidate/H8NY15148/?tab=raising",
          label: "View Forensic Proof (Auth Records)",
          type: "official",
          provider: "FEC.gov",
        },
        data: {
          totalRaised: 8420000,
          cycle: "2024 HOUSE CYCLE",
          alignmentScore: 0.82,
          sectors: [
            { name: "Tech & Telecom", percent: 38 },
            { name: "Education", percent: 24 },
            { name: "Non-Profit/Advocacy", percent: 18 },
            { name: "Retail & Services", percent: 12 },
          ],
          topDonors: [
            {
              name: "MoveOn.org PAC",
              amount: 154000,
              type: "Political Action Committee",
            },
            {
              name: "Justice Democrats PAC",
              amount: 125000,
              type: "Political Action Committee",
            },
            {
              name: "Alphabet (Employee Aggregate)",
              amount: 82000,
              type: "Corporate Aggregate",
            },
          ],
          stats: {
            refId: "FEC-NY14-88293",
          },
        },
      },
    ],
  },
  {
    id: "institutional-voting-record-001",
    sku: "PTS-INST-VOTE-001",
    title: "Legislative Voting Audit",
    type: "Accountability",
    createdAt: "2026-01-28T10:30:00Z",
    sources: [{ name: "Congress.gov", url: "https://congress.gov" }],
    metadata: {
      policyArea: "Military",
      insightType: "Voting Record",
      representativeId: "O000172",
      applicationTier: "Standard",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "O000172",
          name: "Alexandria Ocasio-Cortez",
          party: "Democratic",
          location: "New York",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/O000172.jpg",
          tags: [{ name: "Progressive Caucus", type: "primary" }],
        },
      },
      {
        id: "vote-hr8070",
        type: "Data.Legislative.VotingRecord",
        data: {
          billId: "H.R. 8070",
          billTitle:
            "Servicemember Quality of Life Improvement and National Defense Authorization Act for Fiscal Year 2025",
          vote: "Yea",
          outcome: "Passed",
          date: "JUN 14, 2024",
          chamber: "HOUSE",
          sponsor: "Rep. Rogers (R-AL)",
          tags: ["Military", "Finance", "Infrastructure"],
        },
      },
    ],
  },
];

// 13. KNOWLEDGE REFERENCE GUIDE (B2B/TIER 4)
export const knowledgeReferenceSnaps = [
  {
    id: "kn-guide-tier4-b2b",
    sku: "PTS-KN-GUIDE-001",
    title: "Reference Guide: Predictive & B2B",
    type: "Knowledge",
    createdAt: "2026-01-26T15:00:00Z",
    sources: [{ name: "PoliTickIt Methodology Lab", url: "#" }],
    metadata: {
      policyArea: "Strategic Analytics",
      insightType: "Reference Guide",
    },
    elements: [
      {
        id: "intro-guide",
        type: "Narrative.Insight.Summary",
        data: {
          text: "This guide decodes the attributes of Tier 4 Predictive models and B2B Consensus Ripple visualizations used for institutional advocacy.",
          accentColor: "#6B46C1",
        },
      },
      {
        id: "attr-forecasting",
        type: "Metric.Group",
        data: {
          title: "AI FORECASTING ATTRIBUTES",
          metrics: [
            {
              label: "PASSAGE ODDS",
              value: "Real-time ML probability of bill becoming law.",
            },
            {
              label: "SENTIMENT RIPPLE",
              value: "The velocity and volume of constituent feedback.",
            },
            {
              label: "MOMENTUM",
              value: "Directional trend (Surging, Stalling, or Stable).",
            },
          ],
        },
      },
      {
        id: "attr-b2b",
        type: "Metric.Group",
        data: {
          title: "CONSTITUENT CAPITAL ATTRIBUTES",
          metrics: [
            {
              label: "AGGREGATE CONSENSUS",
              value: "Merged sentiment score across the district.",
            },
            {
              label: "REPORTERS",
              value: "Verified active unique constituent data points.",
            },
            {
              label: "CAPITAL VOLUME",
              value: "Strategic weight of the district's collective intent.",
            },
          ],
        },
      },
    ],
  },
];

// 11. CONGRESSIONAL RECORD SNAPS
export const congressionalRecordSnaps = [
  {
    id: "cr-statement-casar-hr882-1",
    sku: "PTS-CR-STMT-882-001",
    title: "Floor Statement: H.R. 882 Support",
    type: "Representative",
    createdAt: "2026-01-26T11:24:00Z",
    sources: [{ name: "House Record", url: "#" }],
    metadata: {
      policyArea: "Infrastructure",
      insightType: "Congressional Statement",
      representativeId: "C001131",
      debateId: "cr-debate-hr882-2026",
    },
    elements: [
      {
        id: "stmt-hr882-analysis",
        type: "Narrative.Insight.Summary",
        data: {
          title: "Legislative Intent",
          text: "Rep. Casar highlights transit-oriented development and renewable energy resilience as core pillars of his support for H.R. 882, aligning with his district's climate goals.",
        },
      },
      {
        id: "stmt-hr882-1",
        type: "Narrative.Congressional.Statement",
        data: {
          id: "CR-172-14-H882-CASAR",
          representative: {
            name: "Greg Casar",
            location: "Texas",
            party: "Democratic",
          },
          chamber: "House of Representatives",
          date: "JAN 26, 2026",
          timestamp: "11:24 AM",
          text: "The infrastructure needs of our district are immense. This bill represents a compromise that prioritizes transit-oriented development and energy resilience. I am proud to support it.",
          context: "Final Debate on H.R. 882",
          fullTranscriptId: "cr-transcript-casar-hr882-1",
        },
      },
      {
        id: "stmt-hr882-sentiment",
        type: "Interaction.Sentiment.Slider",
        data: {
          title: "Align with this position?",
          leftLabel: "OPPOSE",
          rightLabel: "SUPPORT",
        },
      },
    ],
  },
  {
    id: "cr-transcript-casar-hr882-1",
    sku: "PTS-CR-TRANS-882-001",
    title: "Official Transcript: Casar H.R. 882",
    type: "Representative",
    createdAt: "2026-01-26T11:24:00Z",
    sources: [
      {
        name: "House Record",
        url: "https://www.congress.gov/congressional-record",
      },
    ],
    metadata: {
      policyArea: "Infrastructure",
      insightType: "Transcript Statement",
      representativeId: "C001131",
      debateId: "cr-debate-hr882-2026",
    },
    elements: [
      {
        id: "trans-hr882-1",
        type: "Narrative.Congressional.Transcript",
        data: {
          id: "CR-172-14-H882-CASAR-TRANS",
          representative: {
            name: "Greg Casar",
            location: "Texas",
            party: "Democratic",
          },
          chamber: "House of Representatives",
          date: "JAN 26, 2026",
          timestamp: "11:24 AM",
          volume: "172",
          number: "14",
          page: "H882",
          text: "Mr. Speaker, I rise today in strong support of H.R. 882. For too long, our infrastructure policy has neglected the core transit needs of working families in Austin and San Antonio. This bill, while a product of compromise, takes historic steps toward transit-oriented development. It ensures that as we build new bridges and roads, we are also building the climate resilience our communities desperately need. The energy carve-outs for renewable grid integration are not just preferred; they are essential for the survival of the Texas energy market. I yield back.\n\n[PROCEEDING CONTINUES]\n\nThe infrastructure needs of our district are immense, and they are not just limited to transport. When we speak of resilience, we must speak of the people's power—not just electrical, but political. This legislation represents a synthesis of interests that, while not perfect, moves the needle for the 35th District. We have seen record heatwaves and grid instability that threaten the very lives of our constituents. By prioritizing these energy resilience carve-outs, we are essentially building a firewall between our families and the unpredictable volatility of a changing climate. Furthermore, the transit-oriented development focus within this bill ensures that housing and mobility are linked at the chromosomal level of our urban planning. We cannot continue to build highways that displace while ignoring the veins of transit that connect. This is about equity. This is about the future. I urge my colleagues on both sides of the aisle to look beyond the immediate political friction and see the generational impact this investment will secure. Our children will not ask if we balanced the partisan ledger; they will ask if they can breathe the air and if they can safely travel to work. Today, with this vote, we answer those questions with a resounding yes.",
          context: "House Floor Proceeding - Final Reading",
        },
      },
      {
        id: "audit-link-trans",
        type: "Interaction.Action.Card",
        data: {
          title: "Audit This Event",
          description:
            "Download the original machine-readable XML from Congress.gov",
          actionLabel: "DOWNLOAD RECORD",
          icon: "download-outline",
        },
      },
    ],
  },
  {
    id: "cr-summary-casar-week3-2026",
    sku: "PTS-CR-WEEKLY-001",
    title: "Weekly Performance Summary: Greg Casar",
    type: "Representative",
    createdAt: "2026-01-25T18:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Congressional Performance",
      insightType: "Weekly Summary",
      representativeId: "C001131",
      headerElementId: "rep-header",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "weekly-metric",
        type: "Metric.Congressional.WeeklySummary",
        data: {
          period: "JAN 19 - JAN 25, 2026",
          topPolicyArea: "Housing & Labor",
          stats: {
            debatesJoined: 6,
            amendmentsOffered: 3,
            floorTimeMinutes: 142,
          },
          participationPulse: 88,
          sentimentRatio: { support: 5, oppose: 1 },
          drillDownSnapId: "LIST",
        },
      },
    ],
  },
  {
    id: "cr-summary-johnson-week3-2026",
    sku: "PTS-CR-WEEKLY-002",
    title: "Weekly Performance Audit",
    type: "Representative",
    createdAt: "2026-01-25T19:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Congressional Performance",
      insightType: "Weekly Summary",
      representativeId: "J000299",
      headerElementId: "weekly-summary-header-johnson",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "J000299",
          name: "Mike Johnson",
          party: "Republican",
          location: "Louisiana, District 4",
          position: "U.S. Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/J000299.jpg",
        },
      },
      {
        id: "weekly-metric-johnson",
        type: "Metric.Congressional.WeeklySummary",
        data: {
          period: "JAN 19 - JAN 25, 2026",
          topPolicyArea: "Defense & Budget",
          stats: {
            debatesJoined: 2,
            amendmentsOffered: 0,
            floorTimeMinutes: 45,
          },
          participationPulse: 42,
          sentimentRatio: { support: 1, oppose: 4 },
          drillDownSnapId: "LIST",
        },
      },
    ],
  },
  {
    id: "cr-debate-hr882-2026",
    sku: "PTS-CR-DEBATE-882",
    title: "FLOOR RECORD: H.R. 882 INFRASTRUCTURE VOTE",
    type: "Representative",
    createdAt: "2026-01-26T18:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Infrastructure",
      insightType: "Floor Activity",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "debate-block-882",
        type: "Narrative.Congressional.Debate",
        data: {
          id: "CR-172-14-H-882",
          title: "Final Floor Vote on H.R. 882",
          date: "JAN 26, 2026",
          chamber: "House of Representatives",
          crMetadata: {
            volume: "172",
            number: "14",
            billOrResolution: "H.R. 882",
          },
          result: "PASSED (224-211)",
          summary:
            "Final debate and vote on the Infrastructure Expansion Bill. The legislation includes significant energy carve-outs. Representative Casar voted 'YEA' after expressing support for local job creation.",
          classification: "Roll Call Vote",
          policyAreas: ["Infrastructure", "Energy", "Labor"],
          representatives: [
            {
              name: "Greg Casar",
              location: "Texas",
              party: "Democratic",
              arguments: [
                {
                  text: "This bill brings $400M in transit improvements directly to San Antonio and Austin.",
                  position: "for",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "cr-debate-energy-2026",
    sku: "PTS-CR-DEBATE-002",
    title: "Discussion on Renewable Energy Incentives",
    type: "Representative",
    createdAt: "2026-01-22T14:30:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Energy",
      insightType: "Debate Summary",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "debate-block-energy",
        type: "Narrative.Congressional.Debate",
        data: {
          id: "CR-172-10-H-ENERGY",
          title: "Discussion on the Clean Power Act",
          date: "JAN 22, 2026",
          chamber: "House of Representatives",
          crMetadata: {
            volume: "172",
            number: "10",
            billOrResolution: "H.R. 950",
          },
          result: "Referred to Committee",
          summary:
            "A heated debate on transitioning coal-heavy districts to renewable energy. Some members argue for faster transition via subsidies, while others stress the need for a 'Bridge Fuel' approach.",
          classification: "Legislative Debate",
          policyAreas: ["Energy", "Environment", "Jobs"],
          representatives: [
            {
              name: "Greg Casar",
              location: "Texas",
              party: "Democratic",
              arguments: [
                {
                  text: "The sun shines in Texas, and we can lead the world in solar energy jobs.",
                  position: "for",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "cr-statement-casar-housing-1",
    sku: "PTS-CR-STMT-001",
    title: "Statement on H.R. 802",
    type: "Representative",
    createdAt: "2026-01-26T11:20:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Housing",
      insightType: "Transcript Statement",
      representativeId: "C001131",
      debateId: "cr-debate-housing-2026",
    },
    elements: [
      {
        id: "stmt-1",
        type: "Narrative.Congressional.Statement",
        data: {
          id: "CR-H1234",
          representative: {
            name: "Greg Casar",
            location: "Texas",
            party: "Democratic",
          },
          chamber: "House of Representatives",
          date: "JAN 26, 2026",
          timestamp: "11:24 AM",
          text: "I rise today in support of the Housing Affordability Act. My constituents in Austin and San Antonio are seeing rents skyrocket. We cannot wait any longer for federal action to support local housing grants.",
          context: "Floor Debate on H.R. 802",
        },
      },
    ],
  },
  {
    id: "cr-statement-casar-energy-1",
    sku: "PTS-CR-STMT-002",
    title: "Statement on Clean Power Act",
    type: "Representative",
    createdAt: "2026-01-22T14:45:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Energy",
      insightType: "Transcript Statement",
      representativeId: "C001131",
      debateId: "cr-debate-energy-2026",
    },
    elements: [
      {
        id: "stmt-energy-1",
        type: "Narrative.Congressional.Statement",
        data: {
          id: "CR-H950",
          representative: {
            name: "Greg Casar",
            location: "Texas",
            party: "Democratic",
          },
          chamber: "House of Representatives",
          date: "JAN 22, 2026",
          timestamp: "2:45 PM",
          text: "The sun shines in Texas, and we can lead the world in solar energy jobs. Transitioning to clean power isn't just about the climate; it's about the economic future of our state.",
          context: "Floor Debate on H.R. 950",
        },
      },
    ],
  },
  {
    id: "cr-debate-housing-2026",
    sku: "PTS-CR-DEBATE-001",
    title: "Congress.gov: Affordable Housing Debate",
    type: "Representative",
    createdAt: "2026-01-27T10:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Housing",
      insightType: "Debate Summary",
      representativeId: "C001131", // Greg Casar
    },
    elements: [
      {
        id: "debate-block-1",
        type: "Narrative.Congressional.Debate",
        data: {
          id: "CR-172-14-H-HOUSING",
          title: "Discussion on the Housing Affordability Act",
          date: "JAN 26, 2026",
          chamber: "House of Representatives",
          crMetadata: {
            volume: "172",
            number: "14",
            billOrResolution: "H.R. 802",
          },
          result: "Pending further debate",
          summary:
            "Lawmakers are discussing a new plan to help more people afford homes by giving grants to local communities. The debate focuses on whether this is the best use of federal money or if it will cause more problems than it fixes.",
          classification: "Legislative Debate",
          policyAreas: ["Housing", "Community Development", "Economy"],
          representatives: [
            {
              name: "Greg Casar",
              location: "Texas",
              party: "Democratic",
              arguments: [
                {
                  text: "Helping people afford rent is a matter of basic human dignity.",
                  position: "for",
                },
                {
                  text: "Local cities know best where to build, so we should trust them with these grants.",
                  position: "for",
                },
              ],
            },
            {
              name: "Mike Johnson",
              location: "Louisiana",
              party: "Republican",
              arguments: [
                {
                  text: "Spending more money right now might make national debt problems worse.",
                  position: "against",
                },
                {
                  text: "We should focus on making it easier for private companies to build, not just government spending.",
                  position: "against",
                },
              ],
            },
          ],
          references: [
            { id: "H.R. 802", type: "Bill" },
            { id: "H.Amdt. 112", type: "Amendment" },
          ],
        },
      },
    ],
  },
  {
    id: "cr-casar-min-wage-2026",
    sku: "PTS-CR-CASAR-001",
    title: "Congress.gov: Floor Debate",
    type: "Representative",
    createdAt: "2026-01-26T14:30:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Labor",
      insightType: "Transcript Statement",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "casar-statement-1",
        type: "Narrative.Congressional.Statement",
        data: {
          quote:
            "The reality for families in District 35 is that the cost of living has far outpaced the federal minimum wage. We are not just debating numbers; we are debating the dignity of work.",
          speaker: "Greg Casar",
          date: "JAN 26, 2026",
          context: "House Floor: Fair Wage Act Debate",
        },
      },
      {
        id: "sentiment-slider-cr",
        type: "Interaction.Sentiment.Slider",
        data: {
          title: "Align with this statement?",
          leftLabel: "STRONGLY DISAGREE",
          rightLabel: "STRONGLY AGREE",
        },
      },
    ],
  },
  {
    id: "cr-schumer-tech-2026",
    sku: "PTS-CR-SCHUMER-001",
    title: "Congress.gov: AI Regulation",
    type: "Representative",
    createdAt: "2026-01-25T10:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Technology",
      insightType: "Transcript Statement",
      representativeId: "S000148",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          party: "Democratic",
          location: "New York, Senator",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
        },
      },
      {
        id: "schumer-statement-1",
        type: "Narrative.Congressional.Statement",
        data: {
          quote:
            "Innovation without guardrails is a recipe for instability. Our responsibility is to ensure that AI serves the public interest, not just corporate margins.",
          speaker: "Chuck Schumer",
          date: "JAN 25, 2026",
          context: "Senate Session: AI Safety Framework",
        },
      },
      {
        id: "sentiment-pulse-cr",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Capture Pulse",
        },
      },
    ],
  },
  {
    id: "cr-weekly-performance-casar-2026",
    sku: "PTS-CR-CASAR-004",
    title: "Weekly Performance Audit",
    type: "Representative",
    createdAt: "2026-01-26T18:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Accountability",
      insightType: "Weekly Summary",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "casar-weekly-summary",
        type: "Metric.Congressional.WeeklySummary",
        data: {
          title: "Weekly Performance Review",
          period: "JAN 19 - JAN 25, 2026",
          topPolicyArea: "Labor & Economy",
          participationPulse: 92,
          sentimentRatio: { support: 12, oppose: 3 },
          stats: {
            debatesJoined: 15,
            amendmentsOffered: 3,
            floorTimeMinutes: 45,
          },
          drillDownSnapId: "cr-casar-min-wage-2026",
        },
      },
    ],
  },
  {
    id: "cr-attendance-casar-2026",
    sku: "PTS-CR-CASAR-002",
    title: "Session Attendance Audit",
    type: "Representative",
    createdAt: "2026-01-25T09:00:00Z",
    sources: [{ name: "House Clerk", url: "#" }],
    metadata: {
      policyArea: "Accountability",
      insightType: "Attendance Tracking",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "casar-attendance",
        type: "Metric.Attendance.Grid",
        data: {
          title: "119th Congress Attendance",
          summary: "96.5%",
          sessionData: Array.from({ length: 90 }).map((_, i) =>
            i === 12 || i === 45 || i === 78 ? "absent" : "present",
          ),
        },
      },
    ],
  },
  {
    id: "cr-achievements-casar-2026",
    sku: "PTS-CR-CASAR-003",
    title: "Legislative Milestone Report",
    type: "Representative",
    createdAt: "2026-01-24T16:00:00Z",
    sources: [{ name: "Congress.gov", url: "#" }],
    metadata: {
      policyArea: "Accountability",
      insightType: "Achievement Tracking",
      representativeId: "C001131",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democratic",
          location: "Texas, District 35",
          position: "Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
        },
      },
      {
        id: "casar-achievements",
        type: "Metric.Achievement.List",
        data: {
          title: "Key Legislative Milestones",
          auditId: "audit-casar-2026",
          achievements: [
            {
              title: "Community Resilience Act",
              type: "law",
              date: "DEC 2025",
            },
            {
              title: "Fair Housing Amendment #42",
              type: "amendment",
              date: "OCT 2025",
            },
            {
              title: "Green Energy Jobs Initiative",
              type: "cosponsor",
              date: "SEP 2025",
            },
          ],
        },
      },
    ],
  },
  {
    id: "cr-weekly-performance-schumer-2026",
    sku: "PTS-CR-SCHUMER-002",
    title: "Weekly Performance Audit",
    type: "Representative",
    createdAt: "2026-01-26T19:00:00Z",
    sources: [{ name: "Senate Record", url: "#" }],
    metadata: {
      policyArea: "Accountability",
      insightType: "Weekly Summary",
      representativeId: "S000148",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          party: "Democratic",
          location: "New York, Senator",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
        },
      },
      {
        id: "schumer-weekly-summary",
        type: "Metric.Congressional.WeeklySummary",
        data: {
          title: "Weekly Performance Review",
          period: "JAN 19 - JAN 25, 2026",
          topPolicyArea: "Policy Strategy",
          participationPulse: 98,
          sentimentRatio: { support: 42, oppose: 2 },
          stats: {
            debatesJoined: 28,
            amendmentsOffered: 12,
            floorTimeMinutes: 120,
          },
          drillDownSnapId: "cr-schumer-tech-2026",
        },
      },
    ],
  },
];

// 14. PRODUCTIVITY SNAPS (Institutional Presence & Velocity)
export const productivitySnaps = [
  {
    id: "schumer-presence-pulse-prod",
    sku: "PRODUCTIVITY-PRESENCE-LOG-CH-001",
    title: "Institutional Presence Pulse",
    type: "Accountability",
    createdAt: "2026-01-30T09:00:00Z",
    sources: [{ name: "Congressional Activity Log", url: "#" }],
    metadata: {
      policyArea: "Government Operations and Politics",
      insightType: "Efficiency Audit",
      representativeId: "S000148",
      applicationTier: "Intelligence",
      headerElementId: "schumer-header",
      keywords: ["Accountability", "Attendance", "Productivity"],
    },
    elements: [
      {
        id: "schumer-header",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          party: "Democratic",
          location: "New York, Senator",
          position: "U.S. Senator",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
        },
      },
      {
        id: "schumer-attendance",
        type: "Metric.Attendance.Grid",
        data: {
          title: "12-Month Floor Participation",
          targetYear: 2026,
          attendanceData: [
            { date: "2026-01-05", status: "present" },
            { date: "2026-01-06", status: "present" },
            { date: "2026-01-07", status: "absent" },
            { date: "2026-01-12", status: "present" },
            { date: "2026-01-14", status: "present" },
            { date: "2026-01-15", status: "present" },
            { date: "2026-01-19", status: "present" },
            { date: "2026-01-20", status: "present" },
            { date: "2026-01-21", status: "present" },
            { date: "2026-01-25", status: "present" },
            { date: "2026-01-26", status: "present" },
            { date: "2026-01-27", status: "present" },
          ],
        },
      },
      {
        id: "schumer-achievements",
        type: "Metric.Achievement.List",
        data: {
          title: "Legislative Milestones",
          achievements: [
            {
              title: "CHIPS Act Expansion",
              type: "law",
              date: "DEC 2025",
            },
            {
              title: "AI Safety Framework v2",
              type: "amendment",
              date: "JAN 2026",
            },
            {
              title: "Infrastructure Bond #12",
              type: "cosponsor",
              date: "NOV 2025",
            },
          ],
        },
      },
      {
        id: "schumer-weekly-summary",
        type: "Metric.Congressional.WeeklySummary",
        data: {
          title: "Weekly Performance Review",
          period: "JAN 19 - JAN 25, 2026",
          participationPulse: 98,
          stats: {
            debatesJoined: 28,
            amendmentsOffered: 12,
            floorTimeMinutes: 120,
          },
        },
      },
      {
        id: "schumer-trust-thread",
        type: "Trust.Thread",
        presentation: {
          attributes: {
            spacing: "v-rhythm-tight-1",
            fontSizeOffset: 5,
            preservePillboxScale: true,
          },
        },
        data: {
          referenceId: "REF: PS-PROD-SCHUMER-001",
          serialNumber: "SN: 2026-01-30-X15",
          verificationLevel: "ZK-Verified",
          oracleSource: "GovTrack Activity Feed",
          auditDate: "2026-01-30",
        },
      },
      {
        id: "schumer-participation-cta",
        type: "Interaction.Participation.CTA",
        data: {
          label: "Verify Participation Data",
          actionLabel: "PULSE TO EARN",
          creditValue: 15,
          economyType: "Sovereignty Credits",
          actionType: "sentiment_pulse",
        },
      },
    ],
  },
];

// EXPORT ALL FOR GENERATOR USE
export const allCandidateSnaps = [
  ...accountabilitySnaps,
  ...knowledgeSnaps,
  ...committeeSnaps,
  ...representativeSnaps,
  ...trendingSnaps,
  ...dashboardSnaps,
  ...sponsoredSnaps,
  ...economicsSnaps,
  ...auditSnaps,
  ...participationSnaps,
  ...institutionalSnaps,
  ...knowledgeReferenceSnaps,
  ...congressionalRecordSnaps,
  ...productivitySnaps,
];
