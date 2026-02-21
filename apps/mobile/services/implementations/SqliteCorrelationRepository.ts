import {
    CorrelationIntelligence,
    ICorrelationRepository,
} from "../interfaces/ICorrelationRepository";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import { SqliteEntityRepository } from "./SqliteEntityRepository";

export class SqliteCorrelationRepository
  extends SqliteEntityRepository<CorrelationIntelligence>
  implements ICorrelationRepository
{
  constructor({ databaseService }: { databaseService: IDatabaseService }) {
    super({
      databaseService,
      entityDef: {
        tableName: "correlations",
        mapper: (row: any) => ({
          id: row.id,
          representativeId: row.representative_id,
          billId: row.bill_id,
          score: row.score,
          confidence: row.confidence,
          donor: JSON.parse(row.donor_json),
          vote: JSON.parse(row.vote_json),
          insight: row.insight,
        }),
        saver: (c: CorrelationIntelligence) => ({
          query: `
            INSERT INTO correlations (id, representative_id, bill_id, score, confidence, donor_json, vote_json, insight)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              score = excluded.score,
              confidence = excluded.confidence,
              donor_json = excluded.donor_json,
              vote_json = excluded.vote_json,
              insight = excluded.insight
          `,
          params: [
            c.id,
            c.representativeId,
            c.billId,
            c.score,
            c.confidence,
            JSON.stringify(c.donor),
            JSON.stringify(c.vote),
            c.insight,
          ],
        }),
      },
    });
  }

  async getCorruptionIndex(repId: string): Promise<CorrelationIntelligence[]> {
    const rows = await this.db.execute(
      "SELECT * FROM correlations WHERE representative_id = ? ORDER BY score DESC",
      [repId],
    );
    return rows.map(this.def.mapper);
  }

  async getBillCorrelations(
    billId: string,
  ): Promise<CorrelationIntelligence[]> {
    const rows = await this.db.execute(
      "SELECT * FROM correlations WHERE bill_id = ?",
      [billId],
    );
    return rows.map(this.def.mapper);
  }

  async getTopInfluencers(
    policyArea: string,
  ): Promise<CorrelationIntelligence[]> {
    // Note: The schema for correlations doesn't currently link to policyArea.
    // In a real implementation, we would probably query by tags or join table.
    // For now, returning all for simplicity in this protocol phase.
    const rows = await this.db.execute(
      "SELECT * FROM correlations ORDER BY score DESC LIMIT 10",
    );
    return rows.map(this.def.mapper);
  }

  async upsertCorrelation(correlation: CorrelationIntelligence): Promise<void> {
    await this.save(correlation);
  }

  async getLatestSyncTime(): Promise<number> {
    const rows = await this.db.execute(
      "SELECT MAX(timestamp) as max_ts FROM correlations",
    );
    if (!rows[0]?.max_ts) return 0;
    return new Date(rows[0].max_ts).getTime();
  }
}
