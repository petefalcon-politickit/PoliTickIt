import * as MockData from "@/constants/mockData";
import * as SnapLibrary from "@/constants/snapLibrary";
import { PoliSnap } from "@/types/polisnap";
import { IFECVoteNormalizer } from "../interfaces/IFECVoteNormalizer";
import { ISnapRepository } from "../interfaces/ISnapRepository";

export class MockSnapRepository implements ISnapRepository {
  private fecVoteNormalizer: IFECVoteNormalizer;
  private masterListCache: PoliSnap[] | null = null;

  constructor({
    fecVoteNormalizer,
  }: {
    fecVoteNormalizer: IFECVoteNormalizer;
  }) {
    this.fecVoteNormalizer = fecVoteNormalizer;
  }

  private async delay(ms: number = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getMasterList(): PoliSnap[] {
    if (this.masterListCache) return this.masterListCache;

    // Direct access to all exported arrays from both libraries
    // We use the full library because it's the most comprehensive source
    const sources = [
      SnapLibrary.allCandidateSnaps,
      SnapLibrary.accountabilitySnaps,
      SnapLibrary.knowledgeSnaps,
      SnapLibrary.committeeSnaps,
      SnapLibrary.representativeSnaps,
      SnapLibrary.trendingSnaps,
      SnapLibrary.dashboardSnaps,
      SnapLibrary.sponsoredSnaps,
      SnapLibrary.economicsSnaps,
      SnapLibrary.auditSnaps,
      SnapLibrary.participationSnaps,
      SnapLibrary.institutionalSnaps,
      SnapLibrary.knowledgeReferenceSnaps,
      SnapLibrary.congressionalRecordSnaps,
      MockData.allIdeationSnaps,
      MockData.accountabilityPoliSnaps,
      MockData.communityPoliSnaps,
      MockData.economicsPoliSnaps,
      MockData.knowledgePoliSnaps,
      MockData.representativePoliSnaps,
      MockData.trendingPoliSnaps,
    ];

    const map = new Map<string, PoliSnap>();

    sources.forEach((source) => {
      if (Array.isArray(source)) {
        source.forEach((snap) => {
          if (snap && snap.id) {
            map.set(snap.id, snap as PoliSnap);
          }
        });
      }
    });

    this.masterListCache = Array.from(map.values());
    console.log(
      `[MockSnapRepository] Master list initialized with ${this.masterListCache.length} snaps`,
    );
    return this.masterListCache;
  }

  async getSnapsByCategory(category: string): Promise<PoliSnap[]> {
    await this.delay();
    const masterList = this.getMasterList();
    let source: PoliSnap[] = [];

    // Process dynamic normalized snaps
    const { donations, votes } =
      this.fecVoteNormalizer.getGregCasarSampleData();
    const correlations = await this.fecVoteNormalizer.findCorrelations(
      donations,
      votes,
    );
    const normalizedSnaps = await Promise.all(
      correlations.map((c) =>
        this.fecVoteNormalizer.generateCorrelationSnap(c),
      ),
    );

    const lowerCategory = category.toLowerCase();

    if (lowerCategory === "accountability") {
      source = [
        ...masterList.filter(
          (s) => s.type === "Accountability" || s.type === "Productivity",
        ),
        ...normalizedSnaps,
        ...(SnapLibrary.institutionalSnaps as PoliSnap[]),
      ];
    } else if (lowerCategory === "representative") {
      source = [
        ...masterList.filter(
          (s) => s.type === "Representative" || s.metadata?.representativeId,
        ),
        ...normalizedSnaps,
      ];
    } else if (lowerCategory === "notifications") {
      return MockData.notifications as any;
    } else if (lowerCategory === "community") {
      source = masterList.filter(
        (s) =>
          s.type === "Community" ||
          s.type === "CommunityContribution" ||
          s.type === "Reward",
      );
    } else if (lowerCategory === "knowledge") {
      source = [
        ...masterList.filter((s) => s.type === "Knowledge"),
        ...(SnapLibrary.knowledgeReferenceSnaps as PoliSnap[]),
      ];
    } else if (lowerCategory === "economics") {
      source = masterList.filter((s) => s.type === "Economics");
    } else if (lowerCategory === "trending") {
      source = masterList.filter(
        (s) => s.id.includes("trending") || s.type === "trends",
      );
    } else if (lowerCategory === "dashboard") {
      source = masterList.filter(
        (s) =>
          s.type === "Dashboard" ||
          s.elements.some((e) => e.type.startsWith("Metric.")),
      );
    } else {
      source = masterList.filter((s) => s.type.toLowerCase() === lowerCategory);
    }

    // Individual category source can also have overlap if mock data filters are broad
    const uniqueSource = Array.from(
      new Map(source.filter(Boolean).map((s) => [s.id, s])).values(),
    );

    return uniqueSource.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getSnapsByIds(ids: string[]): Promise<PoliSnap[]> {
    await this.delay(100);
    if (!ids || ids.length === 0) return [];

    const masterList = this.getMasterList();
    const staticSnaps = masterList.filter(
      (s) => s && s.id && ids.includes(s.id),
    );

    // Handle dynamic correlation snaps if any IDs match the pattern
    const correlationIds = ids.filter((id) => id && id.startsWith("corr-"));
    let dynamicSnaps: PoliSnap[] = [];

    if (correlationIds.length > 0) {
      const { donations, votes } =
        this.fecVoteNormalizer.getGregCasarSampleData();
      const correlations = await this.fecVoteNormalizer.findCorrelations(
        donations,
        votes,
      );
      dynamicSnaps = (
        await Promise.all(
          correlations.map((c) =>
            this.fecVoteNormalizer.generateCorrelationSnap(c),
          ),
        )
      ).filter((s) => s && correlationIds.includes(s.id));
    }

    return [...staticSnaps, ...dynamicSnaps];
  }

  async getSnapsByRepresentativeId(repId: string): Promise<PoliSnap[]> {
    await this.delay(100);
    const masterList = this.getMasterList();

    // Process dynamic normalized snaps
    const { donations, votes } =
      this.fecVoteNormalizer.getGregCasarSampleData();
    const correlations = await this.fecVoteNormalizer.findCorrelations(
      donations,
      votes,
    );
    const normalizedSnaps = await Promise.all(
      correlations.map((c) =>
        this.fecVoteNormalizer.generateCorrelationSnap(c),
      ),
    );

    const staticSnaps = masterList.filter(
      (s) =>
        s.metadata?.representativeId === repId ||
        s.elements.some((e: any) => e.data?.id === repId),
    );
    const filteredDynamic = normalizedSnaps.filter(
      (s) =>
        s.metadata?.representativeId === repId ||
        s.elements.some((e: any) => e.data?.id === repId),
    );

    return [...staticSnaps, ...filteredDynamic];
  }

  async getSnapById(id: string): Promise<PoliSnap | null> {
    await this.delay();

    if (id && id.startsWith("corr-")) {
      const { donations, votes } =
        this.fecVoteNormalizer.getGregCasarSampleData();
      const correlations = await this.fecVoteNormalizer.findCorrelations(
        donations,
        votes,
      );
      const snaps = await Promise.all(
        correlations.map((c) =>
          this.fecVoteNormalizer.generateCorrelationSnap(c),
        ),
      );
      return snaps.find((s) => s.id === id) || null;
    }

    const masterList = this.getMasterList();
    return masterList.find((s) => s && s.id === id) || null;
  }

  async getRecentActivity(): Promise<PoliSnap[]> {
    await this.delay();
    const masterList = this.getMasterList();
    return masterList
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  }
}
