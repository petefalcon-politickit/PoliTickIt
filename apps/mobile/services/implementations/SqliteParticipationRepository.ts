import { IDatabaseService } from "../interfaces/IDatabaseService";
import {
    IParticipationRepository,
    ParticipationAction,
} from "../interfaces/IParticipationRepository";

export class SqliteParticipationRepository implements IParticipationRepository {
  private db: IDatabaseService;

  constructor({ databaseService }: { databaseService: IDatabaseService }) {
    this.db = databaseService;
  }

  async logAction(
    action: Omit<ParticipationAction, "id" | "timestamp" | "isSynced">,
  ): Promise<number> {
    const timestamp = new Date().toISOString();
    const result = await this.db.execute(
      `INSERT INTO participation_log (type, resource_id, credits_earned, timestamp, metadata_json, rational_sentiment, is_synced)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [
        action.type,
        action.resourceId,
        action.creditsEarned,
        timestamp,
        JSON.stringify(action.metadata),
        action.rationalSentiment,
      ],
    );
    // Note: Assuming the DB service or implementation returns something that can give us the last insert ID if needed.
    // For now, we return 0 as placeholder or implement a SELECT last_insert_rowid() if critical.
    return 0;
  }

  async getUnsyncedActions(): Promise<ParticipationAction[]> {
    const rows = await this.db.execute(
      "SELECT * FROM participation_log WHERE is_synced = 0 ORDER BY timestamp ASC",
    );
    return rows.map((row) => this.mapRow(row));
  }

  async markAsSynced(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    const placeholders = ids.map(() => "?").join(",");
    await this.db.execute(
      `UPDATE participation_log SET is_synced = 1 WHERE id IN (${placeholders})`,
      ids,
    );
  }

  async getTotalCredits(): Promise<number> {
    const rows = await this.db.execute(
      "SELECT SUM(credits_earned) as total FROM participation_log",
    );
    return rows[0]?.total || 0;
  }

  async getActionsForResource(
    resourceId: string,
  ): Promise<ParticipationAction[]> {
    const rows = await this.db.execute(
      "SELECT * FROM participation_log WHERE resource_id = ? ORDER BY timestamp DESC",
      [resourceId],
    );
    return rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: any): ParticipationAction {
    return {
      id: row.id,
      type: row.type,
      resourceId: row.resource_id,
      creditsEarned: row.credits_earned,
      timestamp: row.timestamp,
      metadata: row.metadata_json ? JSON.parse(row.metadata_json) : {},
      rationalSentiment: row.rational_sentiment,
      isSynced: row.is_synced === 1,
    };
  }
}
