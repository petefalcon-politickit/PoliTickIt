import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { IDatabaseService } from "../interfaces/IDatabaseService";

const DB_NAME = "politickit.db";

// On web, expo-sqlite uses wa-sqlite internally. The persistent backend (AccessHandlePoolVFS)
// uses OPFS SyncAccessHandles which require Cross-Origin isolation headers that the Expo
// dev server does not provide. Passing ':memory:' routes expo-sqlite's worker to MemoryVFS
// instead — no OPFS, no lock errors. Data resets on refresh, but web is a preview/dev
// target and all data is hydrated from the API on startup anyway.
const EFFECTIVE_DB_NAME = Platform.OS === "web" ? ":memory:" : DB_NAME;

// Module-level singletons: ensures only one SQLiteDatabase connection is ever opened
// regardless of how many SqliteDatabaseService instances exist (React StrictMode, DI
// container re-resolution, etc.).
let _db: SQLite.SQLiteDatabase | null = null;
let _initPromise: Promise<void> | null = null;

export class SqliteDatabaseService implements IDatabaseService {
  private get db(): SQLite.SQLiteDatabase | null {
    return _db;
  }
  private set db(value: SQLite.SQLiteDatabase | null) {
    _db = value;
  }
  private get initPromise(): Promise<void> | null {
    return _initPromise;
  }
  private set initPromise(value: Promise<void> | null) {
    _initPromise = value;
  }

  async initialize(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const database = await SQLite.openDatabaseAsync(EFFECTIVE_DB_NAME);

        // Execute Foreign Key pragma separately - Use runAsync for single statements for better stability
        await database.runAsync("PRAGMA foreign_keys = ON");

        // Handle Schema Migrations using user_version.
        // expo-sqlite web (wa-sqlite) can return the PRAGMA row with a different
        // column key depending on the backend. We read any numeric value from the
        // first column as a fallback so migrations don't re-run on every load.
        const versionRow = await database.getFirstAsync<any>(
          "PRAGMA user_version",
        );
        const currentVersion: number =
          versionRow != null
            ? Number(
                versionRow.user_version ?? Object.values(versionRow)[0] ?? 0,
              )
            : 0;

        // Wrap migrations in withTransactionAsync to ensure native stability and atomicity
        await database.withTransactionAsync(async () => {
          // Migration 1: Initial Schema
          if (currentVersion < 1) {
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS snaps (
                id TEXT PRIMARY KEY,
                sku TEXT,
                title TEXT,
                type TEXT,
                createdAt TEXT,
                metadata_json TEXT,
                sources_json TEXT
              );
              CREATE TABLE IF NOT EXISTS snap_elements (
                id TEXT PRIMARY KEY,
                snap_id TEXT,
                type TEXT,
                data_json TEXT,
                presentation_json TEXT,
                sort_index INTEGER,
                FOREIGN KEY (snap_id) REFERENCES snaps(id) ON DELETE CASCADE
              );
              CREATE TABLE IF NOT EXISTS user_ledger (
                key TEXT PRIMARY KEY,
                value TEXT,
                updatedAt TEXT
              );
              CREATE TABLE IF NOT EXISTS feedback_ledger (
                snap_id TEXT,
                user_id TEXT,
                value INTEGER,
                synced INTEGER DEFAULT 0,
                PRIMARY KEY (snap_id, user_id)
              );
              CREATE TABLE IF NOT EXISTS watchlist (
                snap_id TEXT PRIMARY KEY,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP
              );
            `);
            await database.runAsync("PRAGMA user_version = 1");
          }

          // Migration 2: Fix snap_elements UNIQUE constraint conflict (removed id as PK)
          if (currentVersion < 2) {
            console.log(
              "[SqliteDatabaseService] Appling Migration 2: Rebuilding snap_elements...",
            );
            await database.execAsync(`
              DROP TABLE IF EXISTS snap_elements;
              CREATE TABLE snap_elements (
                rowid INTEGER PRIMARY KEY AUTOINCREMENT,
                id TEXT,
                snap_id TEXT,
                type TEXT,
                data_json TEXT,
                presentation_json TEXT,
                sort_index INTEGER,
                FOREIGN KEY (snap_id) REFERENCES snaps(id) ON DELETE CASCADE
              );
              CREATE INDEX IF NOT EXISTS idx_snap_elements_snap_id ON snap_elements(snap_id);
            `);
            await database.runAsync("PRAGMA user_version = 2");
          }

          // Migration 3: Add System Entities (Representatives and Policy Areas)
          if (currentVersion < 3) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 3: Adding System Entities...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS representatives (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                position TEXT,
                party TEXT,
                state TEXT,
                district TEXT,
                profile_image TEXT,
                biography TEXT,
                is_following INTEGER DEFAULT 0,
                metadata_json TEXT
              );
              CREATE TABLE IF NOT EXISTS policy_areas (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                image_url TEXT
              );
            `);
            await database.runAsync("PRAGMA user_version = 3");
          }

          // Migration 4: Participation Sovereignty Ledger
          if (currentVersion < 4) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 4: Adding Participation Log...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS participation_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                resource_id TEXT,
                credits_earned INTEGER DEFAULT 0,
                timestamp TEXT DEFAULT (datetime('now')),
                metadata_json TEXT
              );
              CREATE INDEX IF NOT EXISTS idx_participation_resource ON participation_log(resource_id);
            `);
            await database.runAsync("PRAGMA user_version = 4");
          }
        });
        // Wrap remaining migrations in withTransactionAsync for stability
        await database.withTransactionAsync(async () => {
          // Migration 5: Pulse Engagement Log (High-Frequency Activity)
          if (currentVersion < 5) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 5: Adding Pulse Log...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS pulse_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pulse_type TEXT NOT NULL,
                screen_slug TEXT,
                resource_id TEXT,
                intensity REAL DEFAULT 1.0,
                timestamp TEXT DEFAULT (datetime('now')),
                context_json TEXT
              );
              CREATE INDEX IF NOT EXISTS idx_pulse_type ON pulse_log(pulse_type);
              CREATE INDEX IF NOT EXISTS idx_pulse_screen ON pulse_log(screen_slug);
            `);
            await database.runAsync("PRAGMA user_version = 5");
          }

          // Migration 6/7: Combined System Entity Hardening
          if (currentVersion < 7) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 6/7: Hardening System Entities...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS representatives (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                position TEXT,
                party TEXT,
                state TEXT,
                district TEXT,
                profile_image TEXT,
                biography TEXT,
                is_following INTEGER DEFAULT 0,
                metadata_json TEXT
              );
              CREATE TABLE IF NOT EXISTS policy_areas (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                image_url TEXT
              );
            `);
            await database.runAsync("PRAGMA user_version = 7");
          }

          // Migration 8: Cache Purge
          if (currentVersion < 8) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 8: Purging system entities for hydration...",
            );
            await database.execAsync(`
              DELETE FROM representatives;
              DELETE FROM policy_areas;
            `);
            await database.runAsync("PRAGMA user_version = 8");
          }

          // Migration 9: Policy Area Hardening - Add is_following column
          if (currentVersion < 9) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 9: Adding follow state to policy areas...",
            );
            try {
              await database.runAsync(
                "ALTER TABLE policy_areas ADD COLUMN is_following INTEGER DEFAULT 0",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] Column might already exist, skipping...",
              );
            }
            await database.runAsync("PRAGMA user_version = 9");
          }

          // Migration 10: High-Density Agency Metrics
          if (currentVersion < 10) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 10: Adding metadata support to policy areas...",
            );
            try {
              await database.runAsync(
                "ALTER TABLE policy_areas ADD COLUMN metadata_json TEXT",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] Column might already exist, skipping...",
              );
            }
            await database.runAsync("PRAGMA user_version = 10");
          }

          // Migration 11-14: Force Re-hydration for All Accountability Content
          if (currentVersion < 14) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 14: Polishing Accountability Feed...",
            );
            await database.execAsync(`
              DELETE FROM snap_elements WHERE snap_id IN (SELECT id FROM snaps WHERE type = 'Accountability' OR type = 'Productivity');
              DELETE FROM snaps WHERE type = 'Accountability' OR type = 'Productivity';
            `);
            await database.runAsync("PRAGMA user_version = 14");
          }

          // Migration 15: Consensus Ripple Ledger (EVO-013)
          if (currentVersion < 15) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 15: Adding Consensus Ripples...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS consensus_ripples (
                ripple_id TEXT PRIMARY KEY,
                district TEXT NOT NULL,
                user_state TEXT DEFAULT 'Unset',
                consensus_score REAL,
                is_synced INTEGER DEFAULT 0,
                updated_at TEXT DEFAULT (datetime('now'))
              );
            `);
            await database.runAsync("PRAGMA user_version = 15");
          }

          // Migration 16: Rational Sentiment upgrade
          if (currentVersion < 16) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 16: Adding Rational Sentiment to Ripples...",
            );
            await database.execAsync(`
              ALTER TABLE consensus_ripples ADD COLUMN rational_sentiment REAL DEFAULT 0;
            `);
            await database.runAsync("PRAGMA user_version = 16");
          }

          // Migration 17: Forensic Signal Hardening
          if (currentVersion < 17) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 17: Adding Rational Sentiment to Participation Log...",
            );
            try {
              await database.runAsync(
                "ALTER TABLE participation_log ADD COLUMN rational_sentiment REAL DEFAULT 0",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] Column might already exist, skipping...",
              );
            }
            await database.runAsync("PRAGMA user_version = 17");
          }

          // Migration 18: Financial Pulse Protocol (FPP) - Correlation Intelligence
          if (currentVersion < 18) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 18: Adding Correlation Intelligence...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS correlations (
                id TEXT PRIMARY KEY,
                representative_id TEXT NOT NULL,
                bill_id TEXT NOT NULL,
                score REAL,
                confidence REAL,
                donor_json TEXT,
                vote_json TEXT,
                insight TEXT,
                timestamp TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (representative_id) REFERENCES representatives(id) ON DELETE CASCADE
              );
              CREATE INDEX IF NOT EXISTS idx_correlation_rep ON correlations(representative_id);
              CREATE INDEX IF NOT EXISTS idx_correlation_bill ON correlations(bill_id);
            `);
            await database.runAsync("PRAGMA user_version = 18");
          }

          // Migration 19: CPAP (Civic Participation Audit Protocol) - Syncing Participation
          if (currentVersion < 19) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 19: Hardening Participation Log for CPAP...",
            );
            try {
              // Add is_synced to track upload state
              await database.runAsync(
                "ALTER TABLE participation_log ADD COLUMN is_synced INTEGER DEFAULT 0",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] is_synced might already exist, skipping...",
              );
            }
            await database.runAsync("PRAGMA user_version = 19");
          }

          // Migration 20: ZKTP (Zero-Knowledge Trust Protocol) - Identity Proofs
          if (currentVersion < 20) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 20: Adding ZK-Verification Ledger...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS verification_proofs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tier TEXT NOT NULL,
                attestation_token TEXT,
                verified_at TEXT DEFAULT (datetime('now')),
                metadata_json TEXT
              );
            `);
            await database.runAsync("PRAGMA user_version = 20");
          }

          // Migration 21: CDP (Constituent Data Protocol) - Profile Layer
          if (currentVersion < 21) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 21: Adding Constituent Profile...",
            );
            await database.execAsync(`
              CREATE TABLE IF NOT EXISTS constituent_profile (
                id INTEGER PRIMARY KEY CHECK (id = 1), -- Singleton pattern
                district_id TEXT,
                state_code TEXT,
                interests_json TEXT,
                agencies_json TEXT,
                biometry_enabled INTEGER DEFAULT 0,
                notification_level TEXT DEFAULT 'medium',
                updated_at TEXT DEFAULT (datetime('now'))
              );
              -- Seed initial profile if not exists
              INSERT OR IGNORE INTO constituent_profile (id, interests_json, agencies_json)
              VALUES (1, '[]', '[]');
            `);
            await database.runAsync("PRAGMA user_version = 21");
          }

          // Migration 22: RSP Chamber Column — enables House/Senate filter in settings
          if (currentVersion < 22) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 22: Adding chamber column to representatives...",
            );
            try {
              await database.runAsync(
                "ALTER TABLE representatives ADD COLUMN chamber TEXT",
              );
            } catch (e) {
              // Column may already exist if schema was created fresh with chamber
              console.log(
                "[SqliteDatabaseService] chamber column might already exist, skipping...",
              );
            }
            try {
              await database.runAsync(
                "CREATE INDEX IF NOT EXISTS idx_representatives_chamber ON representatives(chamber)",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] chamber index already exists.",
              );
            }
            await database.runAsync("PRAGMA user_version = 22");
          }

          // Migration 23: Watchlist Sync Tracking — enables cloud sync state per item
          if (currentVersion < 23) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 23: Adding synced/syncedAt to watchlist...",
            );
            try {
              await database.runAsync(
                "ALTER TABLE watchlist ADD COLUMN synced INTEGER DEFAULT 0",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] watchlist.synced column already exists, skipping...",
              );
            }
            try {
              await database.runAsync(
                "ALTER TABLE watchlist ADD COLUMN syncedAt TEXT",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] watchlist.syncedAt column already exists, skipping...",
              );
            }
            await database.runAsync("PRAGMA user_version = 23");
          }

          // Migration 24: Branch Type — distinguishes legislative vs. executive representatives
          if (currentVersion < 24) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 24: Adding branch_type to representatives...",
            );
            try {
              await database.runAsync(
                "ALTER TABLE representatives ADD COLUMN branch_type TEXT DEFAULT 'legislative'",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] representatives.branch_type column already exists, skipping...",
              );
            }
            try {
              await database.runAsync(
                "CREATE INDEX IF NOT EXISTS idx_rep_branch ON representatives(branch_type)",
              );
            } catch (e) {
              // index may already exist
            }
            await database.runAsync("PRAGMA user_version = 24");
          }

          // Migration 25: Snap TTL — cached_at column for delta-sync cache eviction
          if (currentVersion < 25) {
            console.log(
              "[SqliteDatabaseService] Applying Migration 25: Adding cached_at to snaps...",
            );
            try {
              await database.runAsync(
                "ALTER TABLE snaps ADD COLUMN cached_at TEXT DEFAULT (datetime('now'))",
              );
            } catch (e) {
              console.log(
                "[SqliteDatabaseService] snaps.cached_at column already exists, skipping...",
              );
            }
            await database.runAsync("PRAGMA user_version = 25");
          }
        });

        // TTL eviction: remove stale snaps that were cached more than SNAP_CACHE_TTL_HOURS ago.
        // Runs after all migrations to avoid operating on a schema that may not yet have cached_at.
        const ttlHours = 24;
        await database.runAsync(
          `DELETE FROM snaps WHERE cached_at IS NOT NULL AND cached_at < datetime('now', '-${ttlHours} hours')`,
        );
        console.log(
          `[SqliteDatabaseService] TTL eviction complete (threshold: ${ttlHours}h).`,
        );

        this.db = database;

        const finalVersionRow = await database.getFirstAsync<any>(
          "PRAGMA user_version",
        );
        const finalVersion =
          finalVersionRow != null
            ? Number(
                finalVersionRow.user_version ??
                  Object.values(finalVersionRow)[0] ??
                  0,
              )
            : 0;
        console.log(
          `[SqliteDatabaseService] Database Initialized Successfully (Version: ${finalVersion}, Backend: ${Platform.OS === "web" ? "MemoryVFS" : "OPFS"})`,
        );
      } catch (error) {
        console.error(
          "[SqliteDatabaseService] Failed to initialize database:",
          error,
        );
        this.initPromise = null; // Reset promise so we can try again
        throw error;
      }
    })();

    return this.initPromise;
  }

  async reset(): Promise<void> {
    await this.initialize();
    const database = this.db!;

    // Drop tables individually to ensure native stability
    await database.execAsync("DROP TABLE IF EXISTS snap_elements;");
    await database.execAsync("DROP TABLE IF EXISTS snaps;");
    await database.execAsync("DROP TABLE IF EXISTS user_ledger;");
    await database.execAsync("DROP TABLE IF EXISTS feedback_ledger;");
    await database.execAsync("DROP TABLE IF EXISTS watchlist;");
    await database.execAsync("DROP TABLE IF EXISTS representatives;");
    await database.execAsync("DROP TABLE IF EXISTS policy_areas;");
    await database.execAsync("DROP TABLE IF EXISTS participation_log;");
    await database.execAsync("DROP TABLE IF EXISTS pulse_log;");
    await database.execAsync("PRAGMA user_version = 0;");

    this.db = null;
    this.initPromise = null;
    await this.initialize();
  }

  async execute(sql: string, params: any[] = [], retryCount = 0): Promise<any> {
    const trimmedSql = sql.trim();
    if (!trimmedSql) return null;

    try {
      await this.initialize();
      const database = this.db;

      if (!database) {
        throw new Error("Database not initialized after calling initialize()");
      }

      // Ensure all parameters are cast to strings or numbers to avoid Expo SQLite "rejected" errors
      // and prevent java.lang.NullPointerException on the native side
      const sanitizedParams = params.map((p) => {
        if (p === undefined) return null;
        if (typeof p === "boolean") return p ? 1 : 0;
        if (typeof p === "object" && p !== null) return JSON.stringify(p);
        return p;
      });

      // The new expo-sqlite API (v16+) expects the parameters as an array
      if (trimmedSql.toUpperCase().startsWith("SELECT")) {
        return await database.getAllAsync(trimmedSql, sanitizedParams);
      }

      return await database.runAsync(trimmedSql, sanitizedParams);
    } catch (error: any) {
      const errorMessage = error.message || "";
      // If the shared object was released (common on hot-reloads) or NullPointerException occurs
      if (
        (errorMessage.includes("released") ||
          errorMessage.includes("NullPointerException")) &&
        retryCount < 1
      ) {
        console.warn(
          `[SqliteDatabaseService] Database error (${errorMessage}), re-initializing...`,
        );
        this.db = null;
        this.initPromise = null;
        return this.execute(sql, params, retryCount + 1);
      }
      throw error;
    }
  }
}
