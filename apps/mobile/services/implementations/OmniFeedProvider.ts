import { PoliSnap } from "@/types/polisnap";
import {
    FeedFilter,
    FeedResult,
    IOmniFeedProvider,
} from "../interfaces/IOmniFeedProvider";
import { IRepresentativeRepository } from "../interfaces/IRepresentativeRepository";
import { ISnapRepository } from "../interfaces/ISnapRepository";
import { IUserLedgerService } from "../interfaces/IUserLedgerService";

export class OmniFeedProvider implements IOmniFeedProvider {
  private snapRepository: ISnapRepository;
  private representativeRepository?: IRepresentativeRepository;
  private userLedgerService: IUserLedgerService;

  constructor({
    snapRepository,
    representativeRepository,
    userLedgerService,
  }: {
    snapRepository: ISnapRepository;
    representativeRepository?: IRepresentativeRepository;
    userLedgerService: IUserLedgerService;
  }) {
    this.snapRepository = snapRepository;
    this.representativeRepository = representativeRepository;
    this.userLedgerService = userLedgerService;
  }

  async getSnaps(filter: FeedFilter): Promise<FeedResult> {
    const {
      category,
      representativeId,
      query,
      followingOnly,
      tab,
      credits = 0,
    } = filter;

    let snaps: PoliSnap[] = [];
    let lockedTiers: number[] = [];

    if (representativeId) {
      snaps =
        await this.snapRepository.getSnapsByRepresentativeId(representativeId);

      if (tab) {
        return this.handleRepresentativeTab(
          snaps,
          tab,
          credits,
          representativeId,
        );
      }
    } else if (category === "accountability") {
      // Aggregates accountability, economics and trending as per legacy MockAccountabilityProvider
      const [acc, econ, trend] = await Promise.all([
        this.snapRepository.getSnapsByCategory("accountability"),
        this.snapRepository.getSnapsByCategory("economics"),
        this.snapRepository.getSnapsByCategory("trending"),
      ]);
      const combined = [...acc, ...econ, ...trend];
      const map = new Map<string, PoliSnap>();
      combined.forEach((s) => map.set(s.id, s));
      snaps = Array.from(map.values());
    } else if (category) {
      snaps = await this.snapRepository.getSnapsByCategory(category);
    } else {
      snaps = await this.snapRepository.getRecentActivity();
    }

    // Post-ingestion filters
    if (query) {
      const lowerQuery = query.toLowerCase();
      snaps = snaps.filter(
        (s) =>
          s.title.toLowerCase().includes(lowerQuery) ||
          s.metadata?.description?.toLowerCase().includes(lowerQuery),
      );
    }

    const sortedSnaps = snaps.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return { snaps: sortedSnaps, lockedTiers };
  }

  private async handleRepresentativeTab(
    snaps: PoliSnap[],
    tab: string,
    credits: number,
    representativeId: string,
  ): Promise<FeedResult> {
    const isAuditRelated = (s: PoliSnap) =>
      s.metadata?.insightType === "ROI Audit" ||
      s.metadata?.insightType === "Financial Correlation" ||
      s.metadata?.insightType === "Financial Correlation Audit" ||
      s.metadata?.insightType === "Financial Intelligence" ||
      s.metadata?.insightType === "Audit Summary" ||
      s.metadata?.insightType === "Campaign Audit" ||
      s.elements.some((e) =>
        String(e.type).includes("Accountability.Scorecard"),
      );

    const getTierForSnap = (s: PoliSnap): number => {
      if (
        s.metadata?.insightType === "Financial Correlation" ||
        s.metadata?.insightType === "Financial Correlation Audit" ||
        s.metadata?.insightType === "Financial Intelligence"
      )
        return 1;
      if (
        s.metadata?.insightType === "ROI Audit" ||
        s.elements.some((e) =>
          String(e.type).includes("Accountability.Scorecard"),
        )
      )
        return 2;
      if (
        s.metadata?.applicationTier === "Institutional" ||
        s.metadata?.insightType === "Campaign Audit"
      )
        return 3;
      return 0;
    };

    const TIER_REQUIREMENTS: Record<number, number> = {
      1: 500,
      2: 1200,
      3: 2500,
    };

    let filteredSnaps = snaps;
    let lockedTiers: number[] = [];

    if (tab === "Audit") {
      filteredSnaps = snaps.filter((s) => {
        if (!isAuditRelated(s)) return false;
        const tier = getTierForSnap(s);
        return credits >= (TIER_REQUIREMENTS[tier] || 0);
      });

      if (credits < TIER_REQUIREMENTS[1]) lockedTiers.push(1);
      if (credits < TIER_REQUIREMENTS[2]) lockedTiers.push(2);
      if (credits < TIER_REQUIREMENTS[3]) lockedTiers.push(3);
    } else if (tab === "Voting") {
      filteredSnaps = snaps.filter(
        (s) =>
          !isAuditRelated(s) &&
          (s.metadata?.insightType === "Legislative" ||
            s.metadata?.insightType === "Debate Summary" ||
            s.elements.some((e) => e.type === "Metric.Dual.Comparison")),
      );
    } else if (tab === "Community") {
      const directSnaps = snaps.filter(
        (s) =>
          !isAuditRelated(s) &&
          (s.type === "Community" || s.type === "community"),
      );

      let contextSnaps: PoliSnap[] = [];
      if (this.representativeRepository) {
        const rep =
          await this.representativeRepository.getRepresentativeById(
            representativeId,
          );
        if (rep) {
          // If we have a rep, let's also pull in snaps for their district/state to populate the pulse
          const communityPool =
            await this.snapRepository.getSnapsByCategory("community");
          contextSnaps = communityPool.filter((s) => {
            const meta = s.metadata || {};
            // Match by district code (e.g. TX-33)
            if (rep.district && rep.state && meta.districtId) {
              const districtCode = `${rep.state}-${rep.district}`;
              if (meta.districtId === districtCode) return true;
            }
            // Match by state mention in metadata or title
            if (
              rep.state &&
              (s.title.includes(rep.state) ||
                meta.policyArea?.includes(rep.state))
            ) {
              return true;
            }
            return false;
          });
        }
      }

      const combined = [...directSnaps, ...contextSnaps];
      const unique = new Map<string, PoliSnap>();
      combined.forEach((s) => unique.set(s.id, s));
      filteredSnaps = Array.from(unique.values());
    } else if (tab === "Productivity") {
      filteredSnaps = snaps.filter(
        (s) =>
          !isAuditRelated(s) &&
          (s.id.includes("productivity") ||
            s.metadata?.insightType === "Weekly Summary" ||
            s.metadata?.insightType === "Attendance Tracking" ||
            s.metadata?.insightType === "Achievement Tracking" ||
            s.metadata?.insightType === "Activity Reporting" ||
            s.elements.some((e) => e.type === "Metric.Progress.Stepper")),
      );
    } else if (tab === "Activity") {
      filteredSnaps = snaps.filter((s) => !isAuditRelated(s));
    }

    return { snaps: filteredSnaps, lockedTiers };
  }

  async getFocusSnap(filter: FeedFilter): Promise<PoliSnap | null> {
    const { category, representativeId, districtId, termId, mechanismType } =
      filter;

    if (representativeId && category === "representative") {
      const snaps =
        await this.snapRepository.getSnapsByCategory("representative");
      return (
        snaps.find((s) => s.metadata?.representativeId === representativeId) ||
        null
      );
    }

    if (districtId && category === "community") {
      const snaps = await this.snapRepository.getSnapsByCategory("community");
      // Simple mock matching districtId in metadata or description
      return (
        snaps.find(
          (s) =>
            s.metadata?.districtId === districtId ||
            s.metadata?.description?.includes(districtId),
        ) || null
      );
    }

    if (category === "accountability" && representativeId) {
      const snaps =
        await this.snapRepository.getSnapsByCategory("accountability");
      return (
        snaps.find((s) => s.id.includes("audit") || s.id.includes("roi")) ||
        null
      );
    }

    if (category === "knowledge") {
      if (filter.termId) {
        const snaps = await this.snapRepository.getSnapsByCategory("knowledge");
        return snaps.find((s) => s.id === filter.termId) || null;
      }
      if (filter.mechanismType) {
        const snaps = await this.snapRepository.getSnapsByCategory("knowledge");
        return (
          snaps.find(
            (s) => s.metadata?.mechanismType === filter.mechanismType,
          ) || null
        );
      }
    }

    return null;
  }

  async getParticipationHistory(limit: number, offset: number): Promise<any[]> {
    // This logic replaces the legacy MockParticipationProvider.getParticipationHistory
    // In a real app, this would query the local Sovereignty Ledger (participation_log table)
    const mockHistory = [
      {
        id: "h1",
        label: "Voted: National Defense Authorization Act",
        date: "2026-02-15T14:30:00Z",
        credits: 100,
        type: "vote",
        impact: "+5 RS",
      },
      {
        id: "h2",
        label: "Signed Civic Resolution #42",
        date: "2026-02-14T09:15:00Z",
        credits: 250,
        type: "signature",
        impact: "+12 RS",
      },
      {
        id: "h3",
        label: "Pulse Check: Economic Policy Review",
        date: "2026-02-12T18:45:00Z",
        credits: 25,
        type: "pulse",
        impact: "+1 RS",
      },
      {
        id: "h4",
        label: "Verified Identity (ZK-Residency)",
        date: "2026-02-10T11:00:00Z",
        credits: 1000,
        type: "verification",
        impact: "+50 RS",
      },
      {
        id: "h5",
        label: "Analyzed ROI Audit: Infrastructure Bill",
        date: "2026-02-08T16:20:00Z",
        credits: 50,
        type: "audit",
        impact: "+3 RS",
      },
    ];

    // Return a sliced portion based on limit/offset for pagination
    return mockHistory.slice(offset, offset + limit);
  }

  async executeAction<T = any>(actionType: string, params: any): Promise<T> {
    console.log(`[OmniFeedProvider] Executing action: ${actionType}`, params);

    // Legacy mapping of specialized actions
    switch (actionType) {
      case "REQUEST_DEEP_AUDIT":
        return true as any;
      case "VERIFY_POLICY_SIGNAL":
        return true as any;
      default:
        return { success: true } as any;
    }
  }

  async getRelatedSnaps(
    parentId: string,
    relationType: string = "drill-down",
  ): Promise<PoliSnap[]> {
    console.log(
      `[OmniFeedProvider] Fetching related snaps for ${parentId} (type: ${relationType})`,
    );

    const parent = await this.snapRepository.getSnapById(parentId);
    if (!parent) return [];

    const repId = parent.metadata?.representativeId;
    const allSnaps = await this.snapRepository.getRecentActivity(); // Or a more comprehensive search

    if (relationType === "debates" || relationType === "statements") {
      const debateId = parent.metadata?.debateId;
      return allSnaps.filter((s) => {
        const matchesDebate = debateId && s.metadata?.debateId === debateId;
        const matchesRep = repId && s.metadata?.representativeId === repId;
        const isCorrectType =
          relationType === "debates"
            ? s.metadata?.insightType === "Debate Summary"
            : s.metadata?.insightType === "Congressional Statement" ||
              s.metadata?.insightType === "Transcript Statement";

        return (matchesDebate || matchesRep) && isCorrectType;
      });
    }

    // Default drill-down logic: find items with same rep or that mention the parent in metadata
    return allSnaps.filter(
      (s) =>
        s.id !== parentId &&
        (s.metadata?.parentId === parentId ||
          (repId && s.metadata?.representativeId === repId)),
    );
  }
}
