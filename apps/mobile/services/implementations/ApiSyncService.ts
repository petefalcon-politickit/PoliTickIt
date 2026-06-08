import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiCorrelationRepository } from "./ApiCorrelationRepository";
import { ApiInterestRepository } from "./ApiInterestRepository";
import { ApiParticipationRepository } from "./ApiParticipationRepository";
import { ApiRepresentativeRepository } from "./ApiRepresentativeRepository";
import { ApiSnapRepository } from "./ApiSnapRepository";
import { SqliteAgencyRepository } from "./SqliteAgencyRepository";
import { SqliteCorrelationRepository } from "./SqliteCorrelationRepository";
import { SqliteParticipationRepository } from "./SqliteParticipationRepository";
import { SqliteRepresentativeRepository } from "./SqliteRepresentativeRepository";
import { SqliteSnapRepository } from "./SqliteSnapRepository";

const LAST_SYNCED_AT_KEY = "@politickit:lastSyncedAt";

export class ApiSyncService {
  private apiSnapRepo: ApiSnapRepository;
  private sqliteSnapRepo: SqliteSnapRepository;
  private apiRepRepo: ApiRepresentativeRepository;
  private sqliteRepRepo: SqliteRepresentativeRepository;
  private apiCorrelationRepo: ApiCorrelationRepository;
  private sqliteCorrelationRepo: SqliteCorrelationRepository;
  private apiParticipationRepo: ApiParticipationRepository;
  private sqliteParticipationRepo: SqliteParticipationRepository;
  private apiInterestRepo: ApiInterestRepository;
  private sqliteAgencyRepo: SqliteAgencyRepository;

  constructor({
    apiSnapRepository,
    sqliteSnapRepository,
    apiRepresentativeRepository,
    sqliteRepresentativeRepository,
    apiCorrelationRepository,
    sqliteCorrelationRepository,
    apiParticipationRepository,
    sqliteParticipationRepository,
    apiInterestRepository,
    agencyRepository,
  }: {
    apiSnapRepository: ApiSnapRepository;
    sqliteSnapRepository: SqliteSnapRepository;
    apiRepresentativeRepository: ApiRepresentativeRepository;
    sqliteRepresentativeRepository: SqliteRepresentativeRepository;
    apiCorrelationRepository: ApiCorrelationRepository;
    sqliteCorrelationRepository: SqliteCorrelationRepository;
    apiParticipationRepository: ApiParticipationRepository;
    sqliteParticipationRepository: SqliteParticipationRepository;
    apiInterestRepository: ApiInterestRepository;
    agencyRepository: SqliteAgencyRepository;
  }) {
    this.apiSnapRepo = apiSnapRepository;
    this.sqliteSnapRepo = sqliteSnapRepository;
    this.apiRepRepo = apiRepresentativeRepository;
    this.sqliteRepRepo = sqliteRepresentativeRepository;
    this.apiCorrelationRepo = apiCorrelationRepository;
    this.sqliteCorrelationRepo = sqliteCorrelationRepository;
    this.apiParticipationRepo = apiParticipationRepository;
    this.sqliteParticipationRepo = sqliteParticipationRepository;
    this.apiInterestRepo = apiInterestRepository;
    this.sqliteAgencyRepo = agencyRepository;
  }

  /**
   * Performs an automated "Auto-Sync" of backend snaps and representatives into local SQLite.
   * This is the "Truth Mirror" synchronization flow.
   */
  async syncWithBackend(): Promise<{ success: boolean; count: number }> {
    try {
      console.log("[ApiSyncService] Starting Auto-Sync with C# Backend...");
      let totalCount = 0;

      // 1. Sync Snaps — delta if we have a cursor, full fetch on first run
      const lastSyncedAt = await AsyncStorage.getItem(LAST_SYNCED_AT_KEY);
      let newSyncTimestamp: string;

      if (lastSyncedAt) {
        console.log(`[ApiSyncService] Delta sync since ${lastSyncedAt}...`);
        const { snaps: deltaSnaps, syncTimestamp } =
          await this.apiSnapRepo.getDeltaSnaps(lastSyncedAt);
        newSyncTimestamp = syncTimestamp;

        for (const snap of deltaSnaps) {
          if (snap.isRetracted) {
            // B3: tombstone — evict from local SQLite
            await this.sqliteSnapRepo.deleteSnap(snap.id);
          } else {
            await this.sqliteSnapRepo.saveSnap(snap);
          }
        }
        totalCount += deltaSnaps.length;
        console.log(
          `[ApiSyncService] Delta sync complete: ${deltaSnaps.length} changes.`,
        );
      } else {
        console.log(`[ApiSyncService] Full snap sync (no cursor)...`);
        const remoteSnaps = await this.apiSnapRepo.getAllSnaps();
        newSyncTimestamp = new Date().toISOString();
        for (const snap of remoteSnaps) {
          await this.sqliteSnapRepo.saveSnap(snap);
        }
        totalCount += remoteSnaps.length;
        console.log(
          `[ApiSyncService] Full sync complete: ${remoteSnaps.length} snaps.`,
        );
      }

      await AsyncStorage.setItem(LAST_SYNCED_AT_KEY, newSyncTimestamp);

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

      // 2b. RSP Follow Restore — pull user's followed-rep list and apply to SQLite.
      //     This ensures that after reinstall, follow state is fully restored from Cosmos.
      try {
        const followedIds = await this.apiRepRepo.getFollowingIds();
        await this.sqliteRepRepo.bulkSetFollowing(followedIds);
        console.log(
          `[ApiSyncService] RSP Follow Restore: applied ${followedIds.length} followed reps.`,
        );
      } catch (followErr) {
        // Non-fatal: user may not be logged in (guest mode). Follow state stays as-is.
        console.warn("[ApiSyncService] RSP Follow Restore skipped:", followErr);
      }

      // 2c. Interest Follow Restore — pull user's followed policy-area IDs from Cosmos.
      try {
        const followedInterestIds =
          await this.apiInterestRepo.getFollowingIds();
        await this.sqliteAgencyRepo.bulkSetFollowing(followedInterestIds);
        console.log(
          `[ApiSyncService] Interest Follow Restore: applied ${followedInterestIds.length} followed interests.`,
        );
      } catch (followErr) {
        console.warn(
          "[ApiSyncService] Interest Follow Restore skipped:",
          followErr,
        );
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

  /**
   * B4 — Proactive cache hydration on representative follow.
   * Immediately fetches the latest snaps for the given rep and upserts them
   * into SQLite so the feed is populated before the user navigates to it.
   * Fire-and-forget safe: errors are swallowed non-fatally.
   */
  async hydrateRepresentativeSnaps(repId: string): Promise<void> {
    try {
      const snaps = await this.apiSnapRepo.getSnapsByChannel(
        `Representative:${repId}`,
        50,
      );
      for (const snap of snaps) {
        await this.sqliteSnapRepo.saveSnap(snap);
      }
      console.log(
        `[ApiSyncService] Hydrated ${snaps.length} snaps for rep ${repId}.`,
      );
    } catch (error) {
      console.warn(
        `[ApiSyncService] hydrateRepresentativeSnaps failed for ${repId}:`,
        error,
      );
    }
  }

  /**
   * Lightweight follow-state restore for reps and interests.
   * Called after login and session restore so reinstalled apps immediately
   * reflect the user's Cosmos-backed follow list without a full data sync.
   * Silently no-ops when unauthenticated (getFollowingIds returns []).
   */
  async syncFollowState(): Promise<void> {
    try {
      const [repIds, interestIds] = await Promise.all([
        this.apiRepRepo.getFollowingIds(),
        this.apiInterestRepo.getFollowingIds(),
      ]);
      await Promise.all([
        this.sqliteRepRepo.bulkSetFollowing(repIds),
        this.sqliteAgencyRepo.bulkSetFollowing(interestIds),
      ]);
      console.log(
        `[ApiSyncService] Follow restore: ${repIds.length} reps, ${interestIds.length} interests.`,
      );
    } catch (error) {
      console.warn("[ApiSyncService] syncFollowState failed:", error);
    }
  }
}
