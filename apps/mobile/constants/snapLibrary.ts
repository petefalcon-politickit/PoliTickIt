/**
 * PoliSnap Ideation Library
 *
 * This collection represents production-ready candidates for various political
 * transparency and accountability snapshots.
 */

// 1. ACCOUNTABILITY SNAPS
export const accountabilitySnaps = [
  // ── FLOOR DEBATES · May 19-21 2026 (auto-generated 2026-05-30) ──────────────
  {
    id: "snap-sjres185-floor-debate-20260519",
    title: "Senate Floor Debate",
    subtitle:
      "S.J.Res.185 — Directing Removal of U.S. Forces from Iran Hostilities",
    type: "Accountability",
    createdAt: new Date("2026-05-30T09:01:00Z").toISOString(),
    channels: [
      "Representative:D000622",
      "PolicyArea:ArmedForcesAndNationalSecurity",
      "PoliTickIt:Accountability",
      "FloorDebate:SJRes185",
      "Congress:119th",
    ],
    sources: [
      {
        name: "Senate.gov — Roll Call Vote #130, 119th Congress",
        url: "https://www.senate.gov/legislative/LIS/roll_call_lists/roll_call_vote_cfm.cfm?congress=119&session=2&vote=00130",
      },
    ],
    metadata: {
      policyArea: "Armed Forces and National Security",
      insightType: "Senate Floor Vote",
      representativeId: "D000622",
      billId: "S.J.Res.185",
      chamber: "Senate",
      voteDate: "2026-05-19",
      voteOutcome: "Agreed to (50-47)",
    },
    elements: [
      {
        id: "bill-header",
        type: "Header.Bill",
        data: {
          billId: "S.J.Res.185",
          billTitle:
            "A joint resolution directing the removal of United States Armed Forces from hostilities against the Islamic Republic of Iran",
          chamber: "Senate",
          voteOutcome: "Agreed to (50-47)",
          voteDate: "May 19, 2026",
          congress: "119",
          policyArea: "Armed Forces and National Security",
        },
      },
      {
        id: "floor-debate",
        type: "Data.FloorDebate",
        data: {
          voteFor: 50,
          voteAgainst: 47,
          voteAbstain: 3,
          speakers: [
            {
              name: "Sen. Tammy Duckworth",
              title: "D-IL · Army Combat Veteran",
              party: "Democrat",
              position: "For",
              quote:
                "This resolution invokes the War Powers Act. No president — of either party — should wage war without congressional authorization. I served this country in uniform. I know what it costs. Congress must reclaim its constitutional authority.",
            },
            {
              name: "Sen. Lisa Murkowski",
              title: "R-AK · Senate Appropriations",
              party: "Republican",
              position: "For",
              quote:
                "I support this resolution not because I oppose protecting American forces, but because the Constitution is clear: the power to declare war belongs to Congress. A vote here is a vote for that principle.",
            },
            {
              name: "Sen. Tom Cotton",
              title: "R-AR · Senate Armed Services",
              party: "Republican",
              position: "Against",
              quote:
                "Passing this resolution would signal weakness to our adversaries at a critical moment. Iran must understand that American resolve is absolute. We cannot afford to tie the Commander-in-Chief's hands while missiles are being launched at US assets.",
            },
          ],
        },
      },
      {
        id: "bill-context",
        type: "Narrative.Insight.Summary",
        data: {
          title: "What This Vote Means",
          text: "S.J.Res.185 is a War Powers Resolution requiring the withdrawal of US Armed Forces from hostilities involving Iran within 30 days unless Congress explicitly authorizes continued action. The 50-47 vote passed the Senate, sending it to the House. The resolution has bipartisan support — 3 Republicans crossed party lines to vote with 47 Democrats.",
          isExpandable: true,
          sourceLink:
            "https://www.senate.gov/legislative/LIS/roll_call_lists/roll_call_vote_cfm.cfm?congress=119&session=2&vote=00130",
        },
      },
      {
        id: "sentiment-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title:
            "Should Congress have the final say on military action against Iran?",
          options: [
            {
              id: "congress-authority",
              label: "Yes — Congress must authorize war",
            },
            {
              id: "president-authority",
              label: "No — the President needs flexibility",
            },
            { id: "diplomacy", label: "Pursue diplomacy instead" },
            { id: "unsure", label: "Complicated — not sure" },
          ],
          stats: { agree: 0, disagree: 0 },
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          referenceId: "SPAWN-20260530-090001-sjres185-floor-debate",
          serialNumber: "TT-20260530-D000622-001",
          oracleSource:
            "Senate.gov Roll Call Vote #130 (119th Congress, 2nd Session)",
          verificationLevel: "Tier 1",
          auditDate: "2026-05-30",
        },
      },
    ],
  },
  {
    id: "snap-hr2616-floor-debate-20260520",
    title: "House Floor Debate",
    subtitle: "H.R.2616 — PROTECT Kids Act (Online Child Safety)",
    type: "Accountability",
    createdAt: new Date("2026-05-30T09:01:30Z").toISOString(),
    channels: [
      "Representative:W000798",
      "PolicyArea:ScienceTechnologyCommunications",
      "PoliTickIt:Accountability",
      "FloorDebate:HR2616",
      "Congress:119th",
    ],
    sources: [
      {
        name: "Clerk.House.gov — Roll Call Vote #185 (2026)",
        url: "https://clerk.house.gov/evs/2026/roll185.xml",
      },
    ],
    metadata: {
      policyArea: "Science, Technology, Communications",
      insightType: "House Floor Vote",
      representativeId: "W000798",
      billId: "H.R.2616",
      chamber: "House",
      voteDate: "2026-05-20",
      voteOutcome: "Passed",
    },
    elements: [
      {
        id: "bill-header",
        type: "Header.Bill",
        data: {
          billId: "H.R.2616",
          billTitle:
            "PROTECT Kids Act — Providing Responsible Online Technology and Enhanced Child Transparency",
          chamber: "House",
          voteOutcome: "Passed",
          voteDate: "May 20, 2026",
          congress: "119",
          policyArea: "Science, Technology, Communications",
        },
      },
      {
        id: "floor-debate",
        type: "Data.FloorDebate",
        data: {
          voteFor: 312,
          voteAgainst: 114,
          voteAbstain: 9,
          speakers: [
            {
              name: "Rep. Tim Walberg",
              title: "R-MI · House E&C Committee",
              party: "Republican",
              position: "For",
              quote:
                "This bill gives parents real tools to protect their children online. Big Tech has had every chance to police itself — they haven't. Today we act. We're saying: children's safety comes before corporate profits.",
            },
            {
              name: "Rep. Rosa DeLauro",
              title: "D-CT · House Appropriations",
              party: "Democrat",
              position: "For",
              quote:
                "Children are being exploited, addicted, and harmed by platforms that have no accountability. I'm proud to cross the aisle on this. Every parent in America wants this bill passed.",
            },
            {
              name: "Rep. Andy Harris",
              title: "R-MD · House Freedom Caucus",
              party: "Republican",
              position: "Against",
              quote:
                "This bill creates a massive new federal bureaucracy to monitor online content. Parents — not the federal government — should decide what their children see online. This is government overreach with a feel-good name.",
            },
          ],
        },
      },
      {
        id: "bill-context",
        type: "Narrative.Insight.Summary",
        data: {
          title: "What This Vote Means",
          text: "H.R.2616, the PROTECT Kids Act, passed the House 312-114 with strong bipartisan support. The bill requires social media platforms to verify user ages, restricts algorithmic content targeting for minors, and mandates parental consent for accounts under 16. It now heads to the Senate.",
          isExpandable: true,
          sourceLink: "https://clerk.house.gov/evs/2026/roll185.xml",
        },
      },
      {
        id: "sentiment-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title:
            "Should Congress regulate social media to protect children online?",
          options: [
            { id: "yes-regulate", label: "Yes — stronger rules needed" },
            {
              id: "parents-decide",
              label: "Parents should decide, not government",
            },
            {
              id: "tech-self-regulate",
              label: "Let tech companies self-regulate",
            },
            { id: "more-study", label: "Need more research first" },
          ],
          stats: { agree: 0, disagree: 0 },
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          referenceId: "SPAWN-20260530-090002-hr2616-floor-debate",
          serialNumber: "TT-20260530-W000798-001",
          oracleSource: "Clerk.House.gov Roll Call Vote #185 (2026)",
          verificationLevel: "Tier 1",
          auditDate: "2026-05-30",
        },
      },
    ],
  },
  {
    id: "snap-hr1329-floor-debate-20260521",
    title: "House Floor Debate",
    subtitle: "H.R.1329 — Smithsonian American Women's History Museum Act",
    type: "Accountability",
    createdAt: new Date("2026-05-30T09:02:00Z").toISOString(),
    channels: [
      "Representative:B001285",
      "PolicyArea:ArtsCultureReligion",
      "PoliTickIt:Accountability",
      "FloorDebate:HR1329",
      "Congress:119th",
    ],
    sources: [
      {
        name: "Clerk.House.gov — Roll Call Vote #191 (2026)",
        url: "https://clerk.house.gov/evs/2026/roll191.xml",
      },
    ],
    metadata: {
      policyArea: "Arts, Culture, Religion",
      insightType: "House Floor Vote",
      representativeId: "B001285",
      billId: "H.R.1329",
      chamber: "House",
      voteDate: "2026-05-21",
      voteOutcome: "Failed",
    },
    elements: [
      {
        id: "bill-header",
        type: "Header.Bill",
        data: {
          billId: "H.R.1329",
          billTitle:
            "Smithsonian American Women's History Museum Act — To establish the Smithsonian American Women's History Museum",
          chamber: "House",
          voteOutcome: "Failed",
          voteDate: "May 21, 2026",
          congress: "119",
          policyArea: "Arts, Culture, Religion",
        },
      },
      {
        id: "floor-debate",
        type: "Data.FloorDebate",
        data: {
          voteFor: 201,
          voteAgainst: 218,
          voteAbstain: 16,
          speakers: [
            {
              name: "Rep. Julia Brownley",
              title: "D-CA · Bill Sponsor",
              party: "Democrat",
              position: "For",
              quote:
                "Women have shaped every chapter of American history — in every war, every movement, every scientific breakthrough. They deserve a permanent home on the National Mall. Voting no on this bill is voting to erase half of American history.",
            },
            {
              name: "Rep. Betty McCollum",
              title: "D-MN · House Appropriations",
              party: "Democrat",
              position: "For",
              quote:
                "This is a bipartisan institution that celebrates American achievement. The Smithsonian is the right home for this museum. We owe this to Susan B. Anthony, Harriet Tubman, and every woman who built this nation.",
            },
            {
              name: "Rep. Warren Davidson",
              title: "R-OH · House Freedom Caucus",
              party: "Republican",
              position: "Against",
              quote:
                "The federal government is $36 trillion in debt. Creating a new museum funded by taxpayers is not a priority. We honor women's history through our schools, our existing institutions, and private support — not a new federal monument.",
            },
          ],
        },
      },
      {
        id: "bill-context",
        type: "Narrative.Insight.Summary",
        data: {
          title: "What This Vote Means",
          text: "H.R.1329 failed 201-218, falling short of the 2/3 majority needed under suspension of rules. The bill would have established a new museum dedicated to American women on the National Mall as part of the Smithsonian Institution. The bill had passed the House in multiple prior sessions but never cleared the Senate.",
          isExpandable: true,
          sourceLink: "https://clerk.house.gov/evs/2026/roll191.xml",
        },
      },
      {
        id: "sentiment-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title:
            "Should the US build a Smithsonian museum dedicated to women's history?",
          options: [
            { id: "yes-build", label: "Yes — it's long overdue" },
            { id: "private-funding", label: "Yes, but fund it privately" },
            {
              id: "other-priorities",
              label: "Government has other priorities",
            },
            {
              id: "existing-institutions",
              label: "Existing museums are enough",
            },
          ],
          stats: { agree: 0, disagree: 0 },
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          referenceId: "SPAWN-20260530-090003-hr1329-floor-debate",
          serialNumber: "TT-20260530-B001285-001",
          oracleSource: "Clerk.House.gov Roll Call Vote #191 (2026)",
          verificationLevel: "Tier 1",
          auditDate: "2026-05-30",
        },
      },
    ],
  },
  {
    id: "snap-hr1041-floor-debate-20260521",
    title: "House Floor Debate",
    subtitle: "H.R.1041 — Veterans 2nd Amendment Protection Act",
    type: "Accountability",
    createdAt: new Date("2026-05-30T09:02:30Z").toISOString(),
    channels: [
      "Representative:M001199",
      "PolicyArea:ArmedForcesAndNationalSecurity",
      "PoliTickIt:Accountability",
      "FloorDebate:HR1041",
      "Congress:119th",
    ],
    sources: [
      {
        name: "Clerk.House.gov — Roll Call Vote #189 (2026)",
        url: "https://clerk.house.gov/evs/2026/roll189.xml",
      },
    ],
    metadata: {
      policyArea: "Armed Forces and National Security",
      insightType: "House Floor Vote",
      representativeId: "M001199",
      billId: "H.R.1041",
      chamber: "House",
      voteDate: "2026-05-21",
      voteOutcome: "Passed",
    },
    elements: [
      {
        id: "bill-header",
        type: "Header.Bill",
        data: {
          billId: "H.R.1041",
          billTitle:
            "Veterans 2nd Amendment Protection Act — To restore Second Amendment rights of certain veterans",
          chamber: "House",
          voteOutcome: "Passed",
          voteDate: "May 21, 2026",
          congress: "119",
          policyArea: "Armed Forces and National Security",
        },
      },
      {
        id: "floor-debate",
        type: "Data.FloorDebate",
        data: {
          voteFor: 230,
          voteAgainst: 195,
          voteAbstain: 10,
          speakers: [
            {
              name: "Rep. Brian Mast",
              title: "R-FL · Army Combat Veteran (Amputee)",
              party: "Republican",
              position: "For",
              quote:
                "I left my legs on the battlefield in Afghanistan. The VA should not be able to strip my constitutional rights because I need help managing my finances. Veterans earned their rights. The VA does not get to take them away.",
            },
            {
              name: "Rep. Gus Bilirakis",
              title: "R-FL · House Veterans' Affairs",
              party: "Republican",
              position: "For",
              quote:
                "This is about due process. Right now, the VA can report veterans to the gun registry without a court order, without a hearing, without any judicial review. That is unconstitutional and we must fix it.",
            },
            {
              name: "Rep. Zoe Lofgren",
              title: "D-CA · House Judiciary",
              party: "Democrat",
              position: "Against",
              quote:
                "We owe veterans our deepest respect — and that means protecting them and everyone around them. Veterans with severe PTSD or TBI are at elevated risk. This bill removes the one safeguard in place.",
            },
          ],
        },
      },
      {
        id: "bill-context",
        type: "Narrative.Insight.Summary",
        data: {
          title: "What This Vote Means",
          text: "H.R.1041 passed the House 230-195, largely along party lines. The bill prohibits the VA from reporting veterans to the National Instant Criminal Background Check System (NICS) solely because a fiduciary has been appointed to manage their benefits. The bill now heads to the Senate.",
          isExpandable: true,
          sourceLink: "https://clerk.house.gov/evs/2026/roll189.xml",
        },
      },
      {
        id: "sentiment-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title:
            "Should the VA be able to restrict veterans' gun rights without a court order?",
          options: [
            { id: "court-required", label: "No — a court must decide" },
            { id: "va-authority", label: "Yes — VA should have authority" },
            { id: "case-by-case", label: "Depends on the veteran's condition" },
            { id: "repeal-reporting", label: "End NICS reporting entirely" },
          ],
          stats: { agree: 0, disagree: 0 },
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          referenceId: "SPAWN-20260530-090004-hr1041-floor-debate",
          serialNumber: "TT-20260530-M001199-001",
          oracleSource: "Clerk.House.gov Roll Call Vote #189 (2026)",
          verificationLevel: "Tier 1",
          auditDate: "2026-05-30",
        },
      },
    ],
  },
  {
    id: "snap-hr6644-floor-debate-20260520",
    title: "House Floor Debate",
    subtitle: "H.R.6644 — Housing Supply and Affordability Act",
    type: "Accountability",
    createdAt: new Date("2026-05-30T09:03:00Z").toISOString(),
    channels: [
      "Representative:D000629",
      "PolicyArea:HousingAndCommunityDevelopment",
      "PoliTickIt:Accountability",
      "FloorDebate:HR6644",
      "Congress:119th",
    ],
    sources: [
      {
        name: "Clerk.House.gov — Roll Call Vote #186 (2026)",
        url: "https://clerk.house.gov/evs/2026/roll186.xml",
      },
    ],
    metadata: {
      policyArea: "Housing and Community Development",
      insightType: "House Floor Vote",
      representativeId: "D000629",
      billId: "H.R.6644",
      chamber: "House",
      voteDate: "2026-05-20",
      voteOutcome: "Passed (concurred with Senate amendment)",
    },
    elements: [
      {
        id: "bill-header",
        type: "Header.Bill",
        data: {
          billId: "H.R.6644",
          billTitle:
            "Housing Supply and Affordability Act — To increase the supply of housing in America, and for other purposes",
          chamber: "House",
          voteOutcome: "Passed (concurred with Senate amendment)",
          voteDate: "May 20, 2026",
          congress: "119",
          policyArea: "Housing and Community Development",
        },
      },
      {
        id: "floor-debate",
        type: "Data.FloorDebate",
        data: {
          voteFor: 284,
          voteAgainst: 143,
          voteAbstain: 8,
          speakers: [
            {
              name: "Rep. Sharice Davids",
              title: "D-KS · Co-Sponsor",
              party: "Democrat",
              position: "For",
              quote:
                "Housing is out of reach for millions of working families. This bill removes federal barriers that prevent cities and towns from building more homes. It won't solve the crisis overnight — but it's the most significant federal action on housing supply in a generation.",
            },
            {
              name: "Rep. Ann Wagner",
              title: "R-MO · House Financial Services",
              party: "Republican",
              position: "For",
              quote:
                "The American dream of homeownership is slipping away from young families in Missouri and across the country. Cutting red tape, incentivizing local zoning reform, and freeing up land for construction — that is what this bill does.",
            },
            {
              name: "Rep. Dan Crenshaw",
              title: "R-TX · House Homeland Security",
              party: "Republican",
              position: "Against",
              quote:
                "This bill comes with federal strings attached to local zoning decisions. Local communities should decide how they grow — not Washington bureaucrats. I support housing affordability, but not through federal mandates that override local control.",
            },
          ],
        },
      },
      {
        id: "bill-context",
        type: "Narrative.Insight.Summary",
        data: {
          title: "What This Vote Means",
          text: "H.R.6644 passed the House 284-143 with broad bipartisan support, concurring with a Senate amendment passed 89-10 in March. The bill creates federal incentives for states and localities to reform zoning laws, streamline permitting, and allow higher-density construction near transit corridors. The bill now goes to the President for signature.",
          isExpandable: true,
          sourceLink: "https://clerk.house.gov/evs/2026/roll186.xml",
        },
      },
      {
        id: "sentiment-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title:
            "Should the federal government incentivize cities to build more housing?",
          options: [
            { id: "yes-federal-role", label: "Yes — federal action is needed" },
            {
              id: "local-control",
              label: "No — let cities decide for themselves",
            },
            {
              id: "market-solution",
              label: "Deregulate and let the market build",
            },
            { id: "rent-control", label: "Focus on rent control instead" },
          ],
          stats: { agree: 0, disagree: 0 },
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          referenceId: "SPAWN-20260530-090005-hr6644-floor-debate",
          serialNumber: "TT-20260530-D000629-001",
          oracleSource: "Clerk.House.gov Roll Call Vote #186 (2026)",
          verificationLevel: "Tier 1",
          auditDate: "2026-05-30",
        },
      },
    ],
  },
  // ── END FLOOR DEBATES · May 19-21 2026 ──────────────────────────────────────
  {
    id: "snap-sjres12-thune-iran-senate-vote",
    title: "Senate Vote",
    subtitle: "S.J.Res.12 — Use of Military Force Against Iran",
    type: "Accountability",
    createdAt: new Date("2026-05-30T15:32:00Z").toISOString(),
    sources: [
      {
        name: "Senator Thune Official Press Office (senate.gov)",
        url: "https://www.thune.senate.gov/public/index.cfm/press-releases",
      },
    ],
    metadata: {
      policyArea: "Armed Forces and National Security",
      insightType: "Senate Vote",
      representativeId: "T000250",
    },
    elements: [
      {
        id: "rep-header",
        type: "Header.Representative",
        data: {
          id: "T000250",
          name: "John Thune",
          party: "Republican",
          location: "South Dakota",
          position: "Senate Majority Leader",
          imgUri:
            "https://unitedstates.github.io/images/congress/225x275/T000250.jpg",
          tags: ["Senate Majority Leader"],
        },
      },
      {
        id: "floor-statement",
        type: "Narrative.Congressional.Statement",
        data: {
          quote:
            "This is a measured and constitutionally sound response to unprovoked aggression against American personnel and assets. We have a duty to stand with our troops and make clear that America will not tolerate attacks on its people.",
          speaker: "John Thune",
          date: "2026-05-28",
          context: "Senate floor statement in support of S.J.Res.12",
          fullTranscriptId: null,
        },
      },
      {
        id: "bill-vote",
        type: "Data.BillVote",
        data: {
          billName:
            "Authorization for Use of Military Force Against Iranian Military Targets",
          vote: "Yea",
        },
      },
      {
        id: "bill-context",
        type: "Narrative.Insight.Summary",
        data: {
          title: "About S.J.Res.12",
          text: "S.J.Res.12 authorizes the President to use limited military force against Iranian military targets in response to confirmed Iranian attacks on US naval assets in the Persian Gulf. The resolution passed the Senate 61–37 on May 29, 2026 and is now pending action in the House.",
          isExpandable: true,
          sourceLink:
            "https://www.thune.senate.gov/public/index.cfm/press-releases",
        },
      },
      {
        id: "sentiment-pulse",
        type: "Interaction.Sentiment.Pulse",
        data: {
          title: "Do you support US military action against Iran?",
          options: [
            { id: "support", label: "Yes, protect US interests" },
            { id: "oppose", label: "No, military action is wrong" },
            { id: "congress-first", label: "Congress should decide" },
            { id: "diplomacy", label: "Pursue diplomacy first" },
          ],
          stats: { agree: 0, disagree: 0 },
        },
      },
      {
        id: "trust-thread",
        type: "Trust.Thread",
        data: {
          referenceId: "SPAWN-20260530-153000-thune-iran-aumf-statement",
          serialNumber: "TT-20260530-T000250-001",
          oracleSource: "Senator Thune Official Press Office (senate.gov)",
          verificationLevel: "Tier 3",
          auditDate: "2026-05-30",
        },
      },
    ],
  },
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
