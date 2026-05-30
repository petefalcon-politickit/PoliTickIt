/**
 * PoliSnap Ideation Library
 *
 * This collection represents production-ready candidates for various political
 * transparency and accountability snapshots.
 */

// 1. ACCOUNTABILITY SNAPS
export const accountabilitySnaps = [
  {
    id: "infra-bill-vote-001",
    sku: "PTS-INFRA-VOTE-001",
    title: "Bill Vote",
    subtitle: "American Infrastructure and Jobs Act of 2026",
    type: "Accountability",
    createdAt: new Date().toISOString(),
    sources: [
      {
        name: "Congress.gov",
        url: "https://www.congress.gov/search?q=%22American+Infrastructure+and+Jobs+Act%22",
      },
    ],
    metadata: {
      policyArea: "Transportation and Public Works",
      insightType: "Key Vote",
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
          tags: [],
        },
      },
      {
        id: "bill-vote-element",
        type: "Data.BillVote",
        data: {
          billName: "American Infrastructure and Jobs Act of 2026",
          vote: "Yea",
        },
      },
      {
        id: "district-funding-element",
        type: "Metric.DistrictFunding",
        data: {
          amount: "2.5B",
          district: "Louisiana District 4",
        },
      },
      {
        id: "bill-context",
        type: "Narrative.Insight.Summary",
        data: {
          title: "About This Bill",
          text: "The American Infrastructure and Jobs Act of 2026 authorises $2.5B in federal investment for Louisiana's 4th District. The bill covers road rehabilitation, broadband expansion, and port modernisation along the Gulf Coast.",
          isExpandable: true,
        },
      },
      {
        id: "sentiment-summary-element",
        type: "Narrative.SentimentSummary",
        data: {
          sentiment: "Mixed",
          summary:
            "While many support the job creation aspects, some constituents have expressed concerns about the long-term tax implications.",
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          referenceId: "INFRA-JOBS-2026",
          serialNumber: "PS-INFRA-001",
          oracleSource: "Congress.gov",
          verificationLevel: "Tier 3",
          auditDate: "May 30, 2026",
        },
      },
    ],
  },
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

// 2. INFRASTRUCTURE BILL SNAPS
export const infrastructureSnaps: any[] = [];

// 3. KNOWLEDGE SNAPS
export const knowledgeSnaps: any[] = [];

// 4. COMMITTEE SNAPS
export const committeeSnaps: any[] = [];

// 5. REPRESENTATIVE SNAPS
export const representativeSnaps: any[] = [];

// 6. TRENDING SNAPS
export const trendingSnaps: any[] = [];

// 7. DASHBOARD SNAPS
export const dashboardSnaps: any[] = [];

// 8. SPONSORED SNAPS
export const sponsoredSnaps: any[] = [];

// 9. ECONOMICS SNAPS
export const economicsSnaps: any[] = [];

// 10. AUDIT SNAPS
export const auditSnaps: any[] = [];

// 11. PARTICIPATION SNAPS
export const participationSnaps: any[] = [];

// 12. INSTITUTIONAL SNAPS
export const institutionalSnaps: any[] = [];

// 13. KNOWLEDGE REFERENCE SNAPS
export const knowledgeReferenceSnaps: any[] = [];

// 14. CONGRESSIONAL RECORD SNAPS
export const congressionalRecordSnaps: any[] = [];

// 15. PRODUCTIVITY SNAPS
export const productivitySnaps: any[] = [];

// Combine all snaps
export const allCandidateSnaps = [
  ...accountabilitySnaps,
  ...infrastructureSnaps,
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
