import { Agency, Interest, Representative, User } from "@/types/user";
import { allCandidateSnaps } from "./snapLibrary";

// Helper function to return snaps for ideation and stress testing
const generateSnaps = (baseSnaps: any[], count: number) => {
  // We no longer artificially inflate to 100 to avoid duplicate content confusion
  return baseSnaps.map((base) => ({
    ...base,
    id: base.id, // Keep original IDs
  }));
};

// All simulated snaps
export const allIdeationSnaps = generateSnaps(
  allCandidateSnaps,
  allCandidateSnaps.length,
);

// Section-specific split
export const accountabilityPoliSnaps = [
  ...allIdeationSnaps.filter((s) => s.type === "Accountability"),
];
export const knowledgePoliSnaps = allIdeationSnaps.filter(
  (s) => s.type === "Knowledge",
);
export const representativePoliSnaps = [
  ...allIdeationSnaps.filter(
    (s) =>
      s.type === "Representative" ||
      s.type === "Accountability" ||
      s.metadata?.insightType === "ROI Audit",
  ),
];
export const committeePoliSnaps = allIdeationSnaps.filter(
  (s) => s.type === "Committee",
);
export const economicsPoliSnaps = allIdeationSnaps.filter(
  (s) => s.type === "Economics",
);
export const trendingPoliSnaps = allIdeationSnaps.filter(
  (s) => s.id.includes("trending") || s.type === "trends",
);

// Current logged-in user
export const currentUser: User = {
  id: "user-001",
  name: "Alex Johnson",
  state: "California",
  district: "District 12",
  profileImage: "https://i.pravatar.cc/150?u=politickit-alex",
};

// Real-world representative data
export const representatives: Representative[] = [
  {
    id: "S000148",
    name: "Chuck Schumer",
    position: "U.S. Senator",
    state: "New York",
    party: "Democratic",
    isFollowing: true,
    profileImage:
      "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
    contact: "https://www.schumer.senate.gov/contact",
  },
  {
    id: "M000355",
    name: "Mitch McConnell",
    position: "U.S. Senator",
    state: "Kentucky",
    party: "Republican",
    isFollowing: true,
    profileImage:
      "https://unitedstates.github.io/images/congress/225x275/M000355.jpg",
    contact: "https://www.mcconnell.senate.gov/public/index.cfm/contactform",
  },
  {
    id: "J000299",
    name: "Mike Johnson",
    position: "U.S. Representative",
    state: "Louisiana",
    district: "District 4",
    party: "Republican",
    isFollowing: false,
    profileImage:
      "https://unitedstates.github.io/images/congress/225x275/J000299.jpg",
    contact: "https://mikejohnson.house.gov/contact/",
  },
  {
    id: "J000294",
    name: "Hakeem Jeffries",
    position: "U.S. Representative",
    state: "New York",
    district: "District 8",
    party: "Democratic",
    isFollowing: true,
    profileImage:
      "https://unitedstates.github.io/images/congress/225x275/J000294.jpg",
    contact: "https://jeffries.house.gov/contact/",
  },
  {
    id: "O000172",
    name: "Alexandria Ocasio-Cortez",
    position: "U.S. Representative",
    state: "New York",
    district: "District 14",
    party: "Democratic",
    profileImage:
      "https://unitedstates.github.io/images/congress/225x275/O000172.jpg",
    contact: "https://ocasio-cortez.house.gov/contact",
  },
  {
    id: "C001131",
    name: "Greg Casar",
    position: "U.S. Representative",
    state: "Texas",
    district: "District 35",
    party: "Democratic",
    isFollowing: true,
    profileImage:
      "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
    contact: "https://casar.house.gov/contact",
    biography:
      "Greg Casar is a community organizer and clean energy advocate representing Texas's 35th District. He has focused on expanding workers' rights, defending civil liberties, and promoting affordable housing.",
    committees: ["Agriculture", "Oversight and Accountability"],
    recentEvents: [
      {
        title: "Community Town Hall",
        date: "2026-02-15",
        description: "Discussing local infrastructure and housing initiatives.",
      },
      {
        title: "Labor Rights Rally",
        date: "2026-03-01",
        description: "Supporting local workers' negotiation for fair wages.",
      },
    ],
    stats: {
      productivityScore: 85,
      attendanceRate: 98,
      bipartisanIndex: 42,
    },
  },
];

// Sample interests based on Policy Areas
export const interests: Interest[] = [
  {
    id: "1",
    name: "Agriculture and Food",
    description:
      "Policies related to farming, livestock, food safety, and nutrition assistance.",
    image: "https://picsum.photos/id/11/100/100",
  },
  {
    id: "2",
    name: "Animals",
    description:
      "Legislation concerning animal welfare, wildlife protection, and veterinary services.",
    image: "https://picsum.photos/id/2/100/100",
  },
  {
    id: "3",
    name: "Armed Forces and National Security",
    description:
      "Defense spending, military operations, and intelligence community oversight.",
    image: "https://picsum.photos/id/10/100/100",
  },
  {
    id: "4",
    name: "Arts, Culture, Religion",
    description:
      "Funding for the arts, historic preservation, and protection of religious freedom.",
    image: "https://picsum.photos/id/15/100/100",
  },
  {
    id: "5",
    name: "Civil Rights and Liberties, Minority Issues",
    description:
      "Protection of constitutional rights, voting rights, and anti-discrimination laws.",
    image: "https://picsum.photos/id/19/100/100",
  },
  {
    id: "6",
    name: "Commerce",
    description:
      "Regulation of business, interstate commerce, and consumer protection.",
    image: "https://picsum.photos/id/20/100/100",
  },
  {
    id: "7",
    name: "Congress",
    description:
      "Internal operations, rules, and ethics oversight of the legislative branch.",
    image: "https://picsum.photos/id/24/100/100",
  },
  {
    id: "8",
    name: "Crime and Law Enforcement",
    description:
      "Federal criminal law, policing, and administration of justice.",
    image: "https://picsum.photos/id/26/100/100",
  },
  {
    id: "9",
    name: "Economics and Public Finance",
    description:
      "Budgeting, public debt, and general economic policy analysis.",
    image: "https://picsum.photos/id/30/100/100",
  },
  {
    id: "10",
    name: "Education",
    description: "Federal aid for primary, secondary, and higher education.",
    image: "https://picsum.photos/id/17/100/100",
  },
  {
    id: "11",
    name: "Emergency Management",
    description: "Disaster relief, preparedness, and FEMA oversight.",
    image: "https://picsum.photos/id/35/100/100",
  },
  {
    id: "12",
    name: "Energy",
    description:
      "Fossil fuels, renewables, nuclear energy, and utility regulation.",
    image: "https://picsum.photos/id/37/100/100",
  },
  {
    id: "13",
    name: "Environmental Protection",
    description:
      "Air and water quality, climate change, and pollution control.",
    image: "https://picsum.photos/id/40/100/100",
  },
  {
    id: "14",
    name: "Families",
    description: "Child care, domestic violence, and family law issues.",
    image: "https://picsum.photos/id/44/100/100",
  },
  {
    id: "15",
    name: "Finance and Financial Sector",
    description:
      "Banking regulation, securities, and financial services oversight.",
    image: "https://picsum.photos/id/48/100/100",
  },
  {
    id: "16",
    name: "Foreign Trade and International Finance",
    description:
      "Trade agreements, tariffs, and global financial institutions.",
    image: "https://picsum.photos/id/50/100/100",
  },
  {
    id: "17",
    name: "Government Operations and Politics",
    description: "Federal workforce, elections, and government transparency.",
    image: "https://picsum.photos/id/55/100/100",
  },
  {
    id: "18",
    name: "Health",
    description:
      "Medicare, Medicaid, drug regulation, and public health initiatives.",
    image: "https://picsum.photos/id/60/100/100",
  },
  {
    id: "19",
    name: "Housing and Community Development",
    description:
      "Low-income housing, urban development, and mortgage assistance.",
    image: "https://picsum.photos/id/65/100/100",
  },
  {
    id: "20",
    name: "Immigration",
    description: "Border security, citizenship, and refugee assistance.",
    image: "https://picsum.photos/id/70/100/100",
  },
  {
    id: "21",
    name: "International Affairs",
    description: "Diplomacy, foreign aid, and international organizations.",
    image: "https://picsum.photos/id/75/100/100",
  },
  {
    id: "22",
    name: "Labor and Employment",
    description: "Worker safety, wages, and organized labor protections.",
    image: "https://picsum.photos/id/80/100/100",
  },
  {
    id: "23",
    name: "Law",
    description: "Judicial proceedings, legal professionals, and tort reform.",
    image: "https://picsum.photos/id/85/100/100",
  },
  {
    id: "24",
    name: "Native Americans",
    description:
      "Tribal sovereignty, land rights, and federal-tribal relations.",
    image: "https://picsum.photos/id/90/100/100",
  },
  {
    id: "25",
    name: "Public Lands and Natural Resources",
    description:
      "National parks, wilderness areas, and natural resource extraction.",
    image: "https://picsum.photos/id/95/100/100",
  },
  {
    id: "26",
    name: "Science, Technology, Communications",
    description: "Research funding, broadband access, and space exploration.",
    image: "https://picsum.photos/id/100/100/100",
  },
  {
    id: "27",
    name: "Social Welfare",
    description: "Poverty assistance programs and social safety net policies.",
    image: "https://picsum.photos/id/105/100/100",
  },
  {
    id: "28",
    name: "Sports and Recreation",
    description:
      "Amateur and professional sports regulation and leisure activities.",
    image: "https://picsum.photos/id/110/100/100",
  },
  {
    id: "29",
    name: "Taxation",
    description: "Income tax, corporate tax, and IRS administration.",
    image: "https://picsum.photos/id/115/100/100",
  },
  {
    id: "30",
    name: "Transportation and Public Works",
    description:
      "Highways, aviation, railways, and infrastructure construction.",
    image: "https://picsum.photos/id/120/100/100",
  },
  {
    id: "31",
    name: "Water Resources Development",
    description: "Management of dams, waterways, and water supply protection.",
    image: "https://picsum.photos/id/125/100/100",
  },
  {
    id: "32",
    name: "Veterans",
    description: "Support programs and services for military veterans.",
    image: "https://picsum.photos/id/130/100/100",
  },
  {
    id: "33",
    name: "Small Business",
    description: "Grants, loans, and support for independent businesses.",
    image: "https://picsum.photos/id/131/100/100",
  },
  {
    id: "34",
    name: "Cybersecurity",
    description: "National digital infrastructure and data privacy protection.",
    image: "https://picsum.photos/id/132/100/100",
  },
];

// Sample agencies
export const agencies: Agency[] = [
  { id: "ag-001", name: "Department of Health", level: "federal" },
  { id: "ag-002", name: "California Health & Human Services", level: "state" },
  { id: "ag-003", name: "County Health Office", level: "county" },
  { id: "ag-004", name: "City Planning Department", level: "city" },
  { id: "ag-005", name: "Local Community Board", level: "neighborhood" },
];

// LEGACY DATA REMOVED TO FIX DUPLICATE DECLARATIONS
// The following variables are now defined at the top of the file
// using generateSnaps(allCandidateSnaps, 100)

// export const accountabilityPoliSnaps = ...
// export const knowledgePoliSnaps = ...
// export const representativePoliSnaps = ...

// Sample community PoliSnaps (with discussions)
export const communityPoliSnaps = [
  {
    id: "snap-c1",
    title: "Education Funding Debate",
    type: "Community",
    elements: [
      {
        id: "c1-header",
        type: "Identity.Rep.Brief",
        data: {
          name: "Education Funding Debate",
          state: "California",
          party: "Community Discussion",
          imgUri: "https://placekitten.com/304/300",
        },
      },
      {
        id: "c1-insight",
        type: "Narrative.Insight.Summary",
        data: {
          text: "Ongoing debate regarding K-12 budget allocation. Participants are currently discussing the impact of Prop 13 on local school districts.",
          accentColor: "#805AD5",
        },
      },
    ],
    discussion: {
      id: "disc-1",
      title: "Education Funding Debate",
      comments: [
        {
          id: "c1",
          userId: "u1",
          userName: "User1",
          text: "We need more funding for schools",
          timestamp: "2 hours ago",
          likes: 42,
        },
        {
          id: "c2",
          userId: "u2",
          userName: "User2",
          text: "Budget constraints limit options",
          timestamp: "1 hour ago",
          likes: 28,
        },
      ],
      participants: 156,
    },
  },
];

// Sample notifications
export const notifications = [
  {
    id: "notif-1",
    message: "Jane Smith voted on Healthcare Reform",
    timestamp: "1 hour ago",
    snap: accountabilityPoliSnaps[0],
  },
  {
    id: "notif-2",
    message: "New discussion started: Education Funding",
    timestamp: "3 hours ago",
    snap: communityPoliSnaps[0],
  },
  {
    id: "notif-3",
    message: "Infrastructure bill passed committee",
    timestamp: "5 hours ago",
    snap: accountabilityPoliSnaps[0],
  },
];

// Sample watchlist PoliSnaps (favorites)
export const watchlistPoliSnaps = [
  accountabilityPoliSnaps[0],
  knowledgePoliSnaps[0],
];
