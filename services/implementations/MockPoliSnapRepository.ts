import {
    accountabilityPoliSnaps,
    allIdeationSnaps,
    communityPoliSnaps,
    economicsPoliSnaps,
    knowledgePoliSnaps,
    representativePoliSnaps,
    representatives,
    trendingPoliSnaps,
} from "@/constants/mockData";
import {
    institutionalSnaps,
    knowledgeReferenceSnaps,
} from "@/constants/snapLibrary";
import { PoliSnap } from "@/types/polisnap";
import { Representative } from "@/types/user";
import { IFECVoteNormalizer } from "../interfaces/IFECVoteNormalizer";
import { IPoliSnapRepository } from "../interfaces/IPoliSnapRepository";

export class MockPoliSnapRepository implements IPoliSnapRepository {
  private fecVoteNormalizer: IFECVoteNormalizer;

  constructor({
    fecVoteNormalizer,
  }: {
    fecVoteNormalizer: IFECVoteNormalizer;
  }) {
    this.fecVoteNormalizer = fecVoteNormalizer;
  }

  private async delay(ms: number = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllRepresentatives(): Promise<Representative[]> {
    await this.delay(200);
    return representatives;
  }

  async getRepresentativeById(id: string): Promise<Representative | null> {
    await this.delay(300);
    return representatives.find((r) => r.id === id) || null;
  }

  async getSnapsByCategory(category: string): Promise<PoliSnap[]> {
    await this.delay();
    let source: any[] = [];

    if (category.toLowerCase() === "accountability") {
      const { donations, votes } =
        this.fecVoteNormalizer.getGregCasarSampleData();
      const correlations = this.fecVoteNormalizer.findCorrelations(
        donations,
        votes,
      );
      const normalizedSnaps = correlations.map((c) =>
        this.fecVoteNormalizer.generateCorrelationSnap(c),
      );

      source = [
        ...accountabilityPoliSnaps,
        ...normalizedSnaps,
        ...institutionalSnaps,
      ];
    } else if (category.toLowerCase() === "representative") {
      const { donations, votes } =
        this.fecVoteNormalizer.getGregCasarSampleData();
      const correlations = this.fecVoteNormalizer.findCorrelations(
        donations,
        votes,
      );
      const normalizedSnaps = correlations.map((c) =>
        this.fecVoteNormalizer.generateCorrelationSnap(c),
      );

      source = [...representativePoliSnaps, ...normalizedSnaps];
    } else {
      switch (category.toLowerCase()) {
        case "community":
          source = communityPoliSnaps;
          break;
        case "knowledge":
          source = [...knowledgePoliSnaps, ...knowledgeReferenceSnaps];
          break;
        case "economics":
          source = economicsPoliSnaps;
          break;
        case "trending":
          source = trendingPoliSnaps;
          break;
        default:
          source = [];
          break;
      }
    }

    // Individual category source can also have overlap if mock data filters are broad
    const uniqueSource = Array.from(
      new Map(source.map((s) => [s.id, s])).values(),
    );

    return [...uniqueSource].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getSnapsByIds(ids: string[]): Promise<PoliSnap[]> {
    await this.delay(200);

    if (!ids || ids.length === 0) return [];

    // Filter static library snaps
    const masterList = allIdeationSnaps || [];
    const staticSnaps = masterList.filter(
      (s) => s && s.id && ids.includes(s.id),
    );

    // Handle dynamic correlation snaps if any IDs match the pattern
    const correlationIds = ids.filter((id) => id && id.startsWith("corr-"));
    let dynamicSnaps: PoliSnap[] = [];

    if (correlationIds.length > 0 && this.fecVoteNormalizer) {
      const { donations, votes } =
        this.fecVoteNormalizer.getGregCasarSampleData() || {
          donations: [],
          votes: [],
        };
      const correlations = this.fecVoteNormalizer.findCorrelations(
        donations,
        votes,
      );
      dynamicSnaps = correlations
        .map((c) => this.fecVoteNormalizer.generateCorrelationSnap(c))
        .filter((s) => s && correlationIds.includes(s.id));
    }

    return [...staticSnaps, ...dynamicSnaps];
  }

  async getSnapById(id: string): Promise<PoliSnap | null> {
    await this.delay();

    // Check for correlation IDs first (corr-fec-id-vote-id)
    if (id.startsWith("corr-")) {
      const { donations, votes } =
        this.fecVoteNormalizer.getGregCasarSampleData();
      const correlations = this.fecVoteNormalizer.findCorrelations(
        donations,
        votes,
      );
      const snap = correlations
        .map((c) => this.fecVoteNormalizer.generateCorrelationSnap(c))
        .find((s) => s.id === id);

      if (snap) return snap;
    }

    const all = [
      ...accountabilityPoliSnaps,
      ...communityPoliSnaps,
      ...knowledgePoliSnaps,
      ...representativePoliSnaps,
      ...economicsPoliSnaps,
      ...trendingPoliSnaps,
    ];
    // Deduplicate by ID
    const unique = Array.from(new Map(all.map((s) => [s.id, s])).values());
    return unique.find((s) => s.id === id) || null;
  }

  async getRecentActivity(): Promise<PoliSnap[]> {
    await this.delay();
    // For now, return a mix of accountability and knowledge for recent activity
    const all = [...accountabilityPoliSnaps, ...knowledgePoliSnaps];
    // Deduplicate by ID
    const unique = Array.from(new Map(all.map((s) => [s.id, s])).values());
    const sorted = unique.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sorted.slice(0, 5);
  }
}
