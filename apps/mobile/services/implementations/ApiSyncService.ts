import { IRepresentativeRepository } from "../interfaces/IRepresentativeRepository";
import { ISnapRepository } from "../interfaces/ISnapRepository";
import { ApiCorrelationRepository } from "./ApiCorrelationRepository";
import { ApiParticipationRepository } from "./ApiParticipationRepository";
import { SqliteCorrelationRepository } from "./SqliteCorrelationRepository";
import { SqliteParticipationRepository } from "./SqliteParticipationRepository";
import { SqliteRepresentativeRepository } from "./SqliteRepresentativeRepository";
import { SqliteSnapRepository } from "./SqliteSnapRepository";

export class ApiSyncService {
  private apiSnapRepo: ISnapRepository;
  private sqliteSnapRepo: SqliteSnapRepository;
  private apiRepRepo: IRepresentativeRepository;
  private sqliteRepRepo: SqliteRepresentativeRepository;
  private apiCorrelationRepo: ApiCorrelationRepository;
  private sqliteCorrelationRepo: SqliteCorrelationRepository;
  private apiParticipationRepo: ApiParticipationRepository;
  private sqliteParticipationRepo: SqliteParticipationRepository;

  constructor({
    apiSnapRepository,
    sqliteSnapRepository,
    apiRepresentativeRepository,
    sqliteRepresentativeRepository,
    apiCorrelationRepository,
    sqliteCorrelationRepository,
    apiParticipationRepository,
    sqliteParticipationRepository,
  }: {
    apiSnapRepository: ISnapRepository;
    sqliteSnapRepository: SqliteSnapRepository;
    apiRepresentativeRepository: IRepresentativeRepository;
    sqliteRepresentativeRepository: SqliteRepresentativeRepository;
    apiCorrelationRepository: ApiCorrelationRepository;
    sqliteCorrelationRepository: SqliteCorrelationRepository;
    apiParticipationRepository: ApiParticipationRepository;
    sqliteParticipationRepository: SqliteParticipationRepository;
  }) {
    this.apiSnapRepo = apiSnapRepository;
    this.sqliteSnapRepo = sqliteSnapRepository;
    this.apiRepRepo = apiRepresentativeRepository;
    this.sqliteRepRepo = sqliteRepresentativeRepository;
    this.apiCorrelationRepo = apiCorrelationRepository;
    this.sqliteCorrelationRepo = sqliteCorrelationRepository;
    this.apiParticipationRepo = apiParticipationRepository;
    this.sqliteParticipationRepo = sqliteParticipationRepository;
  }

  /**
   * Performs an automated "Auto-Sync" of backend snaps and representatives into local SQLite.
   * This is the "Truth Mirror" synchronization flow.
   */
  async syncWithBackend(): Promise<{ success: boolean; count: number }> {
    try {
      console.log("[ApiSyncService] Starting Auto-Sync with C# Backend...");
      let totalCount = 0;

      // 1. Sync Snaps
      const remoteSnaps = await this.apiSnapRepo.getAllSnaps();
      if (remoteSnaps.length > 0) {
        console.log(
          `[ApiSyncService] Found ${remoteSnaps.length} snaps on backend. Syncing...`,
        );
        for (const snap of remoteSnaps) {
          await this.sqliteSnapRepo.saveSnap(snap);
        }
        totalCount += remoteSnaps.length;
      }

      // 2. Sync Representatives (RSP Protocol)
      const remoteReps = await this.apiRepRepo.getAllRepresentatives();
      if (remoteReps.length > 0) {
        console.log(
          `[ApiSyncService] Found ${remoteReps.length} representatives on backend. Syncing via RSP...`,
        );
        for (const rep of remoteReps) {
          // upsertSovereign ensures local isFollowing state is PRESERVED
          await this.sqliteRepRepo.upsertSovereign(rep);
        }
        totalCount += remoteReps.length;
      }

      // 3. Sync Financial Pulse Correlations (FPP Protocol)
      const lastFppSync = await this.sqliteCorrelationRepo.getLatestSyncTime();
      const remoteCorrelations =
        await this.apiCorrelationRepo.fetchRegistry(lastFppSync);
      if (remoteCorrelations.length > 0) {
        console.log(
          `[ApiSyncService] Found ${remoteCorrelations.length} financial correlations on backend. Syncing via FPP...`,
        );
        for (const correlation of remoteCorrelations) {
          await this.sqliteCorrelationRepo.upsertCorrelation(correlation);
        }
        totalCount += remoteCorrelations.length;
      }

      // 4. Upload Civic Participation Log (CPAP Protocol)
      const unsyncedActions =
        await this.sqliteParticipationRepo.getUnsyncedActions();
      if (unsyncedActions.length > 0) {
        console.log(
          `[ApiSyncService] Found ${unsyncedActions.length} unsynced participations. Auditing via CPAP...`,
        );
        const syncedIds =
          await this.apiParticipationRepo.uploadActions(unsyncedActions);
        if (syncedIds.length > 0) {
          await this.sqliteParticipationRepo.markAsSynced(syncedIds);
          console.log(
            `[ApiSyncService] Successfully audited ${syncedIds.length} actions with backend.`,
          );
        }
      }

      console.log(
        `[ApiSyncService] Auto-Sync completed. Total entities: ${totalCount}`,
      );
      return { success: true, count: totalCount };
    } catch (error) {
      console.error("[ApiSyncService] Sync failed:", error);
      return { success: false, count: 0 };
    }
  }
}
