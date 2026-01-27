/**
 * PoliSnap Ideation Library
 *
 * This collection represents production-ready candidates for various political
 * transparency and accountability snapshots.
 */

// 1. ACCOUNTABILITY SNAPS
export const accountabilitySnaps = [
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
        id: "rep-schumer-cyber",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          state: "NY",
          position: "U.S. Senator",
          party: "D",
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
    },
    elements: [
      {
        id: "rep-thune-vets",
        type: "Header.Representative",
        data: {
          id: "T000250",
          name: "John Thune",
          state: "SD",
          position: "U.S. Senator",
          party: "R",
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
          label: "PRO FEATURE",
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
    },
    elements: [
      {
        id: "casar-header-biz",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          state: "TX",
          district: "District 35",
          position: "U.S. Representative",
          party: "D",
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
    id: "acc-sandbox-pro-001",
    sku: "PTS-ACC-PRO-001",
    title: "Interactive Sandbox: Pulse Actions",
    type: "Accountability",
    createdAt: "2026-01-25T16:00:00Z",
    sources: [{ name: "PoliTickIt Pro Insight", url: "#" }],
    metadata: {
      policyArea: "Strategic Intelligence",
      insightType: "Pro Interactive Block",
    },
    elements: [
      {
        id: "rep-sandbox",
        type: "Header.Representative",
        data: {
          id: "T000250",
          name: "John Thune",
          state: "SD",
          position: "U.S. Senator",
          party: "R",
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
    id: "TOP-CORRELATION-PRO",
    sku: "PTS-CORR-PRO-001",
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
    },
    elements: [
      {
        id: "rep-casar",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democrat",
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
          title: "Corruption Index Score",
          score: 88,
          donor: "Global Energy PAC",
          industry: "Energy & Natural Resources",
          amount: "$5,000",
          voteAction: "YEA (H.R. 882)",
          insight:
            "A maximum individual donation was received from Global Energy PAC just 4 days prior to the 'YEA' vote on H.R. 882 (Infrastructure). This aligns with a significant trend of Energy Sector support for recent legislative expansion.",
          confidence: 0.95,
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
          title: "District 35 Donor-Vote Alignment",
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
    sources: [{ name: "Congressional Record", url: "#" }],
    metadata: {
      policyArea: "Environmental Protection",
      insightType: "Legislative Sentiment",
    },
    elements: [
      {
        id: "rep-thune",
        type: "Header.Representative",
        data: {
          id: "T000250",
          name: "John Thune",
          state: "SD",
          position: "U.S. Senator",
          party: "R",
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
          source: "Congressional Record / EPA",
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
    },
    elements: [
      {
        id: "rep-schumer",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          state: "NY",
          position: "U.S. Senator",
          party: "D",
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
      headerElementId: "rep-identity-align",
    },
    elements: [
      {
        id: "rep-identity-align",
        type: "Header.Representative",
        data: {
          id: "S000148",
          context: "Sponsor",
          name: "Chuck Schumer",
          party: "Democrat",
          state: "NY",
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
      headerElementId: "rep-identity",
    },
    elements: [
      {
        id: "rep-identity",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          party: "Democrat",
          state: "NY",
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
          text: "Recent filings show a pattern of high-frequency trading in pharmaceutical stocks shortly before a committee vote on drug price caps. This activity deviates from her 3-year historical baseline by over 240%.",
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
      headerElementId: "rep-identity",
    },
    elements: [
      {
        id: "rep-identity",
        type: "Header.Representative",
        data: {
          id: "M000355",
          name: "Mitch McConnell",
          party: "Republican",
          state: "KY",
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
          text: "Senator Jane Smith's recent campaign audit reveals a 15% increase in funding from energy sector PACs following her vote on the Green Energy Act. While her base remains localized, 40% of her total funds now originate from non-resident corporate entities.",
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
          title: "Influence Audit",
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
      headerElementId: "header",
      laymanSummary:
        "S.Res 542 establishes new environmental standards for public land usage, addressing how local commerce and conservation efforts should coexist.",
    },
    elements: [
      {
        id: "header",
        type: "Header.Representative",
        data: {
          id: "J000299",
          name: "Mike Johnson",
          context: "Key Voter",
          party: "Republican",
          state: "LA",
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
          state: "NY",
          district: "District 8",
          party: "Democrat",
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
      headerElementId: "rep-header-mcconnell",
    },
    elements: [
      {
        id: "rep-header-mcconnell",
        type: "Header.Representative",
        data: {
          id: "M000355",
          name: "Mitch McConnell",
          state: "KY",
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
      headerElementId: "rep-header-schumer",
    },
    elements: [
      {
        id: "rep-header-schumer",
        type: "Header.Representative",
        data: {
          id: "S000148",
          name: "Chuck Schumer",
          state: "NY",
          party: "Democrat",
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
        id: "rep-header-johnson",
        type: "Header.Representative",
        data: {
          id: "J000299",
          name: "Mike Johnson",
          state: "LA",
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
          state: "NY",
          district: "District 14",
          party: "Democrat",
          position: "U.S. Representative",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/O000172.jpg",
          tags: [],
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
          state: "UT",
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
          state: "NC",
          district: "District 14",
          position: "U.S. Representative",
          party: "Democrat",
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
          state: "NC",
          district: "District 13",
          position: "U.S. Representative",
          party: "Democrat",
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

// 6. DASHBOARD SNAPS (Pro Accountability Dashboard)
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
              party: "R",
            },
            {
              id: "sj-01",
              name: "Sarah Jenkins",
              status: "92% Aligned",
              color: "#38A169",
              type: "rep",
              party: "D",
            },
            {
              id: "rc-01",
              name: "Robert Chen",
              status: "15% Aligned",
              color: "#D0021B",
              type: "rep",
              party: "I",
            },
          ],
        },
      },
    ],
  },
  {
    id: "dash-predictive-pro-001",
    sku: "PTS-DASH-PREDICTIVE-PRO-001",
    title: "Pro Intellectual Intelligence",
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
    title: "Community Initiative",
    type: "Accountability",
    createdAt: "2026-01-24T12:00:00Z",
    sources: [{ name: "Congress.gov", url: "https://www.congress.gov" }],
    metadata: {
      insightType: "Sponsored Awareness",
    },
    elements: [
      {
        id: "sponsor-header",
        type: "Header.Sponsor",
        data: {
          sponsorName: "Clean Water Action",
          promotionTitle: "Protecting the Cape Fear River",
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
          text: "Help us advocate for stronger wastewater standards. A recent study shows 15% increase in runoff pollution in the last year.",
          accentColor: "#3182CE",
        },
      },
      {
        id: "pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Public Support for Riverside Initiative",
          agreeLabel: "Support",
          disagreeLabel: "Need More Info",
          stats: {
            agree: 2500,
            disagree: 500,
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
];
// 9. PRO AUDIT SNAPS
export const auditSnaps = [
  {
    id: "audit-casar-2026",
    sku: "PTS-AUDIT-CASAR-001",
    title: "Representation ROI Audit: Greg Casar",
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
    },
    elements: [
      {
        id: "audit-header",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          party: "Democrat",
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
        },
      },
    ],
  },
  {
    id: "audit-johnson-2026",
    sku: "PTS-AUDIT-JOHNSON-001",
    title: "Representative Performance Audit",
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
    },
    elements: [
      {
        id: "audit-header-johnson",
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
    type: "Accountability",
    createdAt: "2026-01-26T12:00:00Z",
    sources: [{ name: "PoliTickIt Rewards", url: "#" }],
    metadata: {
      policyArea: "Community",
      insightType: "Engagement Reward",
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
];

// 12. INSTITUTIONAL B2B POC SNAPS
export const institutionalSnaps = [
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
        id: "casar-header-b2b",
        type: "Header.Representative",
        data: {
          id: "C001131",
          name: "Greg Casar",
          state: "TX",
          district: "District 35",
          position: "U.S. Representative",
          party: "D",
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
];
