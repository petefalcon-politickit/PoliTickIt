import { PoliSnap } from "@/types/polisnap";
import { ISnapRepository } from "../interfaces/ISnapRepository";
import { SqliteSnapRepository } from "./SqliteSnapRepository";

export enum SnapDataSource {
  MOCK = "MOCK",
  LOCAL = "LOCAL",
  API = "API",
}

export class HybridSnapRepository implements ISnapRepository {
  private mockRepo: ISnapRepository;
  private localRepo: SqliteSnapRepository;
  private apiRepo: ISnapRepository;

  // Set to MOCK by default for local development stability
  // Switch to SnapDataSource.API for physical distribution testing
  public source: SnapDataSource = SnapDataSource.MOCK;

  constructor({
    mockSnapRepository,
    sqliteSnapRepository,
    apiSnapRepository,
  }: {
    mockSnapRepository: ISnapRepository;
    sqliteSnapRepository: SqliteSnapRepository;
    apiSnapRepository: ISnapRepository;
  }) {
    this.mockRepo = mockSnapRepository;
    this.localRepo = sqliteSnapRepository;
    this.apiRepo = apiSnapRepository;
  }

  async getSnapsByCategory(category: string): Promise<PoliSnap[]> {
    console.log(
      `[HybridSnapRepository] Fetching category: ${category} from ${this.source}`,
    );

    if (this.source === SnapDataSource.MOCK) {
      return this.mockRepo.getSnapsByCategory(category);
    }

    // Attempt CACHE-FIRST for immediate responsiveness (especially in Monorepo/Physical Device testing)
    const localSnaps = await this.localRepo.getSnapsByCategory(category);
    if (localSnaps.length > 0) {
      console.log(
        `[HybridSnapRepository] Cache Hit: Returning ${localSnaps.length} local snaps for ${category}`,
      );
      return localSnaps;
    }

    // API Source Logic (Fetching only if cache is empty)
    if (this.source === SnapDataSource.API) {
      try {
        const snaps = await this.apiRepo.getSnapsByCategory(category);

        if (snaps && snaps.length > 0) {
          // Auto-cache to local storage for offline resiliency
          for (const snap of snaps) {
            await this.localRepo.saveSnap(snap);
          }
          return snaps;
        }
      } catch (error) {
        console.warn(
          "[HybridSnapRepository] API failed, falling back to LOCAL/MOCK",
          error,
        );
      }
    }

    // Final fallbacks if even the local cache was empty and API failed
    return this.mockRepo.getSnapsByCategory(category);
  }

  async getSnapById(id: string): Promise<PoliSnap | null> {
    if (this.source === SnapDataSource.MOCK) {
      return this.mockRepo.getSnapById(id);
    }

    // Check Local first
    let localSnap = await this.localRepo.getSnapById(id);
    if (localSnap) return localSnap;

    // Try API if it's the target source
    if (this.source === SnapDataSource.API) {
      try {
        const snap = await this.apiRepo.getSnapById(id);
        if (snap) {
          await this.localRepo.saveSnap(snap); // Auto-cache
          return snap;
        }
      } catch (error) {
        console.warn("[HybridSnapRepository] API GetSnapById failed", error);
      }
    }

    // Mock lookup
    return this.mockRepo.getSnapById(id);
  }

  async getRecentActivity(): Promise<PoliSnap[]> {
    if (this.source === SnapDataSource.MOCK) {
      return this.mockRepo.getRecentActivity();
    }

    const localRecent = await this.localRepo.getRecentActivity();
    if (localRecent.length > 0) return localRecent;

    // Background sync will populate this eventually, for now return mock if empty
    return this.mockRepo.getRecentActivity();
  }

  async getSnapsByIds(ids: string[]): Promise<PoliSnap[]> {
    if (this.source === SnapDataSource.MOCK) {
      return this.mockRepo.getSnapsByIds(ids);
    }
    return this.localRepo.getSnapsByIds(ids);
  }

  async getSnapsByRepresentativeId(repId: string): Promise<PoliSnap[]> {
    if (this.source === SnapDataSource.MOCK) {
      return this.mockRepo.getSnapsByRepresentativeId(repId);
    }
    return this.localRepo.getSnapsByRepresentativeId(repId);
  }

  /**
   * Manual trigger to update source (for testing Unit 2)
   */
  setSource(source: SnapDataSource) {
    this.source = source;
  }
}
