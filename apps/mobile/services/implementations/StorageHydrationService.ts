import { interests, representatives } from "@/constants/mockData";
import {
    accountabilitySnaps,
    allCandidateSnaps,
    auditSnaps,
    committeeSnaps,
    congressionalRecordSnaps,
    dashboardSnaps,
    economicsSnaps,
    institutionalSnaps,
    knowledgeReferenceSnaps,
    knowledgeSnaps,
    participationSnaps,
    productivitySnaps,
    representativeSnaps,
    sponsoredSnaps,
    trendingSnaps,
} from "@/constants/snapLibrary";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import { IForensicSignalCoordinator } from "../interfaces/IForensicSignalCoordinator";
import { SqliteAgencyRepository } from "./SqliteAgencyRepository";
import { SqliteRepresentativeRepository } from "./SqliteRepresentativeRepository";
import { SqliteSnapRepository } from "./SqliteSnapRepository";

export class StorageHydrationService {
  private db: IDatabaseService;
  private sqliteRepo: SqliteSnapRepository;
  private repRepo: SqliteRepresentativeRepository;
  private agencyRepo: SqliteAgencyRepository;
  private forensicCoordinator: IForensicSignalCoordinator;

  constructor({
    databaseService,
    sqliteSnapRepository,
    representativeRepository,
    agencyRepository,
    forensicSignalCoordinator,
  }: {
    databaseService: IDatabaseService;
    sqliteSnapRepository: SqliteSnapRepository;
    representativeRepository: SqliteRepresentativeRepository;
    agencyRepository: SqliteAgencyRepository;
    forensicSignalCoordinator: IForensicSignalCoordinator;
  }) {
    this.db = databaseService;
    this.sqliteRepo = sqliteSnapRepository;
    this.repRepo = representativeRepository;
    this.agencyRepo = agencyRepository;
    this.forensicCoordinator = forensicSignalCoordinator;
  }

  /**
   * Performs the hydration/synchronization of the local database from mock data.
   * This ensures that any new or updated mock data in the code is reflected in the local DB.
   */
  async hydrateIfNeeded(): Promise<void> {
    try {
      console.log(
        "[StorageHydrationService] Synchronizing local storage with SnapLibrary mocks...",
      );

      // Combine all library snaps
      const allSnaps = [
        ...accountabilitySnaps,
        ...congressionalRecordSnaps,
        ...knowledgeSnaps,
        ...committeeSnaps,
        ...representativeSnaps,
        ...trendingSnaps,
        ...dashboardSnaps,
        ...sponsoredSnaps,
        ...economicsSnaps,
        ...auditSnaps,
        ...participationSnaps,
        ...productivitySnaps,
        ...institutionalSnaps,
        ...knowledgeReferenceSnaps,
        ...allCandidateSnaps,
      ];

      // Perform Idempotent Sync (INSERT OR REPLACE)
      for (const snap of allSnaps) {
        await this.sqliteRepo.saveSnap(snap as any);
      }

      console.log(
        `[StorageHydrationService] Sync complete. Verified ${allSnaps.length} snaps in local SQLite storage.`,
      );

      // --- NEW: Sync System Entities ---
      console.log("[StorageHydrationService] Synchronizing System Entities...");

      for (const rep of representatives) {
        try {
          await this.repRepo.saveRepresentative(rep);
        } catch (e) {
          console.error(
            `[StorageHydrationService] Failed to save representative ${rep.id}:`,
            e,
          );
        }
      }

      for (const interest of interests) {
        try {
          await this.agencyRepo.saveAgency({
            id: interest.id,
            name: interest.name,
            description: interest.description || "",
            image_url: interest.image,
            is_following: (interest as any).isSelected || false,
            metadata: {
              constituentCount: Math.floor(Math.random() * 5000) + 1000,
              activityPulse: Math.floor(Math.random() * 100),
              lastAuditDate: "2026-01-29",
            },
          });
        } catch (e) {
          console.error(
            `[StorageHydrationService] Failed to save agency ${interest.id}:`,
            e,
          );
        }
      }

      console.log(
        `[StorageHydrationService] System Entity Sync complete. (${representatives.length} Reps, ${interests.length} Policy Areas)`,
      );

      // --- NEW: Seed Participation History if empty ---
      const historyCheck = await this.db.execute(
        "SELECT COUNT(*) as count FROM participation_log",
      );
      if (!historyCheck || !historyCheck[0] || historyCheck[0].count === 0) {
        console.log(
          "[StorageHydrationService] Seeding mock participation history...",
        );
        const mockHistory = [
          {
            type: "sentiment",
            resource_id: "sentiment:audit-1:grade-a",
            credits_earned: 25,
            metadata: { snapId: "audit-1", elementId: "grade-a" },
          },
          {
            type: "action",
            resource_id: "action:trending-2:share",
            credits_earned: 100,
            metadata: { snapId: "trending-2", action: "share" },
          },
        ];

        for (const item of mockHistory) {
          await this.db.execute(
            "INSERT INTO participation_log (type, resource_id, credits_earned, metadata_json) VALUES (?, ?, ?, ?)",
            [
              item.type,
              item.resource_id,
              item.credits_earned,
              JSON.stringify(item.metadata),
            ],
          );
        }
      }

      // --- NEW: Hydrate Mock Sovereignty Pulses (Forensic seeding) ---
      // We force a clearing of old signals to ensure our new IDs match the logic
      await this.db.execute("DELETE FROM pulse_log");
      await this.db.execute(
        "DELETE FROM participation_log WHERE type = 'sentiment'",
      );
      await this.seedMockPulses(allSnaps);
    } catch (error) {
      console.error(
        "[StorageHydrationService] Critical Failure during hydration:",
        error,
      );
    }
  }

  /**
   * Seeds the ForensicSignalCoordinator with mock sentiment to enable the ROI Alignment Report.
   */
  private async seedMockPulses(snaps: any[]): Promise<void> {
    try {
      console.log(
        "[StorageHydrationService] Seeding mock Sovereignty pulses...",
      );

      // 1. Find the specific 'institutional-voting-record-001' which has AOC (O000172)
      const specificAOCSnap = snaps.find(
        (s) => s.id === "institutional-voting-record-001",
      );
      if (specificAOCSnap) {
        await this.forensicCoordinator.emitSignal({
          id: specificAOCSnap.id,
          type: "sentiment",
          value: 0.9, // Support (Aligns with AOC's 'Yea' on HR 8070)
          metadata: {
            snapId: specificAOCSnap.id,
            note: "PoliProof ROI Seeding",
          },
        });
      }

      // 2. Find Schumer (S000148) snaps
      const schumerSnaps = snaps.filter(
        (s) => s.metadata?.representativeId === "S000148",
      );
      for (const snap of schumerSnaps.slice(0, 3)) {
        await this.forensicCoordinator.emitSignal({
          id: snap.id,
          type: "sentiment",
          value: 0.85, // General support
          metadata: { snapId: snap.id, note: "PoliProof ROI Seeding" },
        });
      }

      // 3. General pool for diverse testing
      const votingSnaps = snaps.filter(
        (s) =>
          s.id !== "institutional-voting-record-001" &&
          s.elements?.some(
            (el: any) =>
              el.type === "data/voting-record" ||
              el.type === "Data.Legislative.VotingRecord",
          ),
      );

      for (const snap of votingSnaps.slice(0, 5)) {
        await this.forensicCoordinator.emitSignal({
          id: snap.id,
          type: "sentiment",
          value: 0.9,
          metadata: { snapId: snap.id, note: "Mock seeding for ROI Report" },
        });
      }
    } catch (e) {
      console.error("[StorageHydrationService] Mock pulse seeding failed:", e);
    }
  }
}
