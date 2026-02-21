import { calculateRationalSentiment } from "../../../../libs/intelligence/forensic-signal";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import {
    ForensicSignal,
    IForensicSignalCoordinator,
    ImpactMetrics,
} from "../interfaces/IForensicSignalCoordinator";
import { IHapticService } from "../interfaces/IHapticService";
import { IUserLedgerService } from "../interfaces/IUserLedgerService";
import { IVerificationService } from "../interfaces/IVerificationService";

const CREDITS_KEY = "participation_credits";

export class ForensicSignalCoordinator implements IForensicSignalCoordinator {
  private credits: number = 0;
  private listeners: ((metrics: ImpactMetrics) => void)[] = [];

  private db: IDatabaseService;
  private verification: IVerificationService;
  private userLedger: IUserLedgerService;
  private haptics: IHapticService;

  constructor({
    databaseService,
    verificationService,
    userLedgerService,
    hapticService,
  }: {
    databaseService: IDatabaseService;
    verificationService: IVerificationService;
    userLedgerService: IUserLedgerService;
    hapticService: IHapticService;
  }) {
    this.db = databaseService;
    this.verification = verificationService;
    this.userLedger = userLedgerService;
    this.haptics = hapticService;
    this.init();
  }

  private async init() {
    const saved = await this.userLedger.getNumber(CREDITS_KEY);
    this.credits = saved ?? 3500; // Default or saved
    this.notify();
  }

  async emitSignal(signal: ForensicSignal): Promise<void> {
    const { type, id, value = 0, metadata = {} } = signal;
    console.log(
      `[ForensicSignalCoordinator] Ingesting signal: ${type} for ${id}`,
    );

    const verificationStatus = await this.verification.getCurrentStatus();

    // 1. Calculate Rational Sentiment (RS)
    const rs = calculateRationalSentiment({
      baseSentiment: value,
      isVerifiedConstituent: verificationStatus.isVerified,
      participationCredits: this.credits,
    });

    // 2. Persist to Unified Participation/Pulse Log
    const sql = `
      INSERT INTO participation_log (type, resource_id, credits_earned, rational_sentiment, metadata_json, timestamp)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `;

    // Simple reward logic: award 10 credits if not already rewarded for this specific resource
    let earned = 0;
    const rewardKey = `${type}:${id}${signal.elementId ? ":" + signal.elementId : ""}`;

    try {
      const existing = await this.db.execute(
        "SELECT id FROM participation_log WHERE resource_id = ?",
        [rewardKey],
      );
      if (existing.length === 0) {
        earned = 10;
        this.credits += earned;
        await this.userLedger.set(CREDITS_KEY, this.credits);
        this.haptics.triggerLightImpact();
        this.notify();
      }

      await this.db.execute(sql, [
        type,
        rewardKey,
        earned,
        rs,
        JSON.stringify({ ...metadata, elementId: signal.elementId }),
      ]);

      // Special case: Ripple syncing (logic absorbed from RippleSyncService)
      if (type === "ripple") {
        await this.updateRippleState(id, metadata.district, metadata.state, rs);
      }
    } catch (error) {
      console.error(
        "[ForensicSignalCoordinator] Failed to emit signal:",
        error,
      );
    }
  }

  private async updateRippleState(
    rippleId: string,
    district: string,
    state: string,
    rs: number,
  ) {
    const sql = `
      INSERT INTO consensus_ripples (ripple_id, district, user_state, rational_sentiment, is_synced, updated_at)
      VALUES (?, ?, ?, ?, 0, datetime('now'))
      ON CONFLICT(ripple_id) DO UPDATE SET
        user_state = excluded.user_state,
        rational_sentiment = excluded.rational_sentiment,
        is_synced = 0,
        updated_at = datetime('now')
    `;
    await this.db.execute(sql, [rippleId, district, state, rs]);
  }

  async getImpactMetrics(): Promise<ImpactMetrics> {
    const tiers = [
      { level: 1, name: "Observation", requirement: 0 },
      { level: 2, name: "Engagement", requirement: 1000 },
      { level: 3, name: "Influence", requirement: 5000 },
      { level: 4, name: "Sovereign", requirement: 20000 },
    ];

    const currentTier =
      [...tiers].reverse().find((t) => this.credits >= t.requirement) ||
      tiers[0];

    return {
      credits: this.credits,
      tierLevel: currentTier.level,
      tierName: currentTier.name,
    };
  }

  async getRecentSignals(limit: number = 50): Promise<any[]> {
    const sql = `SELECT * FROM participation_log ORDER BY timestamp DESC LIMIT ?`;
    const results = await this.db.execute(sql, [limit]);
    return results.map((r: any) => ({
      ...r,
      metadata: r.metadata_json ? JSON.parse(r.metadata_json) : {},
    }));
  }

  async getRipple(rippleId: string): Promise<any> {
    const sql = `SELECT * FROM consensus_ripples WHERE ripple_id = ? LIMIT 1`;
    const results = await this.db.execute(sql, [rippleId]);
    return results.length > 0 ? results[0] : null;
  }

  async getActivityCounts(intensitySettings: any): Promise<any> {
    // In a full implementation, this would query participation_log and entities
    // to determine active counts per domain, applying intensity thresholding.
    console.log(
      "[ForensicSignalCoordinator] Calculating activity counts with intensity:",
      intensitySettings.threshold,
    );

    try {
      // 1. Live counts from the Snaps table
      const rows = await this.db.execute(
        "SELECT id, type, metadata_json FROM snaps",
      );

      const counts = {
        accountability: 0,
        community: 0,
        knowledge: 0,
        representative: 0,
        notification: 0,
        watchlist: 0,
      };

      // 2. Threshold filtering
      // If intensity is enabled, we only count items above the threshold.
      // Since we don't have a 'significance' column, we'll derive it deterministically
      // from the ID hash or look for it in metadata if available.
      rows.forEach((row: any) => {
        const type = String(row.type).toLowerCase();
        const metadata = row.metadata_json ? JSON.parse(row.metadata_json) : {};

        // Derive significance: use metadata.significance or a deterministic hash (0-100)
        const rowId = row.id || "unknown";
        const significance =
          metadata.significance ??
          Math.abs(
            rowId.split("").reduce((a: number, b: string) => {
              a = (a << 5) - a + b.charCodeAt(0);
              return a & a;
            }, 0) % 100,
          );

        if (
          intensitySettings.isEnabled &&
          significance < intensitySettings.threshold
        ) {
          return;
        }

        if (type === "accountability" || type === "productivity")
          counts.accountability++;
        else if (type === "community") counts.community++;
        else if (type === "knowledge") counts.knowledge++;
        else if (type === "representative") counts.representative++;
      });

      // 3. Live Watchlist count
      const watchlistRows = await this.db.execute(
        "SELECT COUNT(*) as count FROM watchlist",
      );
      counts.watchlist = watchlistRows[0]?.count || 0;

      // 4. Live Notifications count (mocked for now as we don't have a notifications table yet)
      counts.notification = 3;

      return counts;
    } catch (error) {
      console.error(
        "[ForensicSignalCoordinator] Failed to get live counts:",
        error,
      );

      // Fallback to normalized mocks if DB fails
      const multiplier = intensitySettings.isEnabled
        ? intensitySettings.threshold / 100
        : 1.0;

      return {
        accountability: Math.floor(12 * multiplier),
        community: Math.floor(45 * multiplier),
        knowledge: Math.floor(8 * multiplier),
        representative: Math.floor(156 * multiplier),
        notification: 3,
        watchlist: 5,
      };
    }
  }

  async getDossierStats(): Promise<any> {
    // Query participation log for streak and proofs
    return {
      streak: 5, // Mock streak
      proofs: 12, // Number of ZK-Attestations or Actions
    };
  }

  onImpactUpdated(callback: (metrics: ImpactMetrics) => void): void {
    this.listeners.push(callback);
    this.getImpactMetrics().then(callback);
  }

  private notify() {
    this.getImpactMetrics().then((metrics) => {
      this.listeners.forEach((l) => l(metrics));
    });
  }
}
