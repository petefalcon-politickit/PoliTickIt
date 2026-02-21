import { PoliSnap } from "@/types/polisnap";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import { ISnapRepository } from "../interfaces/ISnapRepository";
import { SqliteEntityRepository } from "./SqliteEntityRepository";

export class SqliteSnapRepository
  extends SqliteEntityRepository<PoliSnap>
  implements ISnapRepository
{
  constructor({ databaseService }: { databaseService: IDatabaseService }) {
    super({
      databaseService,
      entityDef: {
        tableName: "snaps",
        mapper: (row: any) => ({
          id: row.id,
          sku: row.sku,
          title: row.title,
          type: row.type,
          createdAt: row.createdAt,
          sources: JSON.parse(row.sources_json || "[]"),
          metadata: JSON.parse(row.metadata_json || "{}"),
        }),
        saver: (snap: PoliSnap) => ({
          query: `INSERT OR REPLACE INTO snaps (id, sku, title, type, createdAt, metadata_json, sources_json) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
          params: [
            snap.id,
            snap.sku,
            snap.title,
            snap.type,
            snap.createdAt,
            JSON.stringify(snap.metadata || {}),
            JSON.stringify(snap.sources || []),
          ],
        }),
      },
    });
  }

  async getSnapsByCategory(category: string): Promise<PoliSnap[]> {
    const lowerCategory = category.toLowerCase();
    const pattern = `%${category}%`;

    // Hybrid category logic: "Accountability" category includes Productivity snaps
    const typeFilter =
      lowerCategory === "accountability"
        ? "(LOWER(s.type) = 'accountability' OR LOWER(s.type) = 'productivity')"
        : "LOWER(s.type) = LOWER(?)";

    const queryParams =
      lowerCategory === "accountability"
        ? [pattern, pattern]
        : [category, pattern, pattern];

    const rows = await this.db.execute(
      `SELECT DISTINCT s.* FROM snaps s
       LEFT JOIN snap_elements e ON s.id = e.snap_id
       WHERE ${typeFilter} 
          OR s.metadata_json LIKE ? 
          OR e.data_json LIKE ?`,
      queryParams,
    );
    return Promise.all(rows.map((row: any) => this.mapRowToSnap(row)));
  }

  async getSnapById(id: string): Promise<PoliSnap | null> {
    const rows = await this.db.execute(`SELECT * FROM snaps WHERE id = ?`, [
      id,
    ]);
    if (rows.length === 0) return null;
    return this.mapRowToSnap(rows[0]);
  }

  async getRecentActivity(): Promise<PoliSnap[]> {
    const rows = await this.db.execute(
      `SELECT * FROM snaps ORDER BY createdAt DESC LIMIT 50`,
    );
    const snaps = await Promise.all(
      rows.map((row: any) => this.mapRowToSnap(row)),
    );
    return this.applyVarietyHeuristics(snaps);
  }

  /**
   * Forensic Variety Heuristic:
   * Prevents "Representative Clumping" and prioritizes content diversity in the Home Feed.
   * Ensures high-intensity or new sources aren't drowned out by bulk ingestion.
   */
  private applyVarietyHeuristics(snaps: PoliSnap[]): PoliSnap[] {
    if (snaps.length < 5) return snaps;

    const result: PoliSnap[] = [];
    const pool = [...snaps];
    const recentTypes = new Set<string>();
    const recentReps = new Set<string>();

    const REPETITION_THRESHOLD = 2; // Allow max 2 similar items in a row

    while (pool.length > 0) {
      // Find the best next candidate
      let candidateIdx = pool.findIndex((s) => {
        const repId = s.metadata?.representativeId;
        const type = s.type;

        const isRepRepeat = repId && recentReps.has(repId);
        const isTypeRepeat = recentTypes.has(type);

        return !isRepRepeat && !isTypeRepeat;
      });

      // Fallback: If no perfect candidate, take the first one
      if (candidateIdx === -1) candidateIdx = 0;

      const [selected] = pool.splice(candidateIdx, 1);
      result.push(selected);

      // Update recent memory
      const repId = selected.metadata?.representativeId;
      if (repId) {
        recentReps.add(repId);
        if (recentReps.size > REPETITION_THRESHOLD) {
          // Keep memory short to allow repetition after buffer
          const oldestRep = Array.from(recentReps)[0];
          recentReps.delete(oldestRep);
        }
      }

      recentTypes.add(selected.type);
      if (recentTypes.size > REPETITION_THRESHOLD) {
        const oldestType = Array.from(recentTypes)[0];
        recentTypes.delete(oldestType);
      }
    }

    return result;
  }

  async getSnapsByIds(ids: string[]): Promise<PoliSnap[]> {
    if (ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(",");
    const rows = await this.db.execute(
      `SELECT * FROM snaps WHERE id IN (${placeholders})`,
      ids,
    );
    return Promise.all(rows.map((row: any) => this.mapRowToSnap(row)));
  }

  async getSnapsByRepresentativeId(repId: string): Promise<PoliSnap[]> {
    const pattern = `%${repId}%`;
    const rows = await this.db.execute(
      `SELECT * FROM snaps WHERE metadata_json LIKE ?`,
      [pattern],
    );
    return Promise.all(rows.map((row: any) => this.mapRowToSnap(row)));
  }

  /**
   * Helper to persist a snap and its elements
   */
  async saveSnap(snap: PoliSnap): Promise<void> {
    // Uses the generic saver defined in the constructor for the main 'snaps' table
    await this.save(snap);

    if (snap.elements) {
      // Clear existing elements for this snap to allow idempotent synchronization without ID conflicts
      await this.db.execute(`DELETE FROM snap_elements WHERE snap_id = ?`, [
        snap.id,
      ]);

      for (let i = 0; i < snap.elements.length; i++) {
        const el = snap.elements[i];
        await this.db.execute(
          `INSERT INTO snap_elements (id, snap_id, type, data_json, presentation_json, sort_index) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            el.id,
            snap.id,
            el.type,
            JSON.stringify(el.data || {}),
            JSON.stringify(el.presentation || {}),
            i,
          ],
        );
      }
    }
  }

  private async mapRowToSnap(row: any): Promise<PoliSnap> {
    const elementsRows = await this.db.execute(
      `SELECT * FROM snap_elements WHERE snap_id = ? ORDER BY sort_index ASC`,
      [row.id],
    );

    return {
      id: row.id,
      sku: row.sku,
      title: row.title,
      type: row.type,
      createdAt: row.createdAt,
      sources: JSON.parse(row.sources_json || "[]"),
      metadata: JSON.parse(row.metadata_json || "{}"),
      elements: elementsRows.map((el: any) => ({
        id: el.id,
        type: el.type,
        data: JSON.parse(el.data_json || "{}"),
        presentation: JSON.parse(el.presentation_json || "{}"),
      })),
    } as PoliSnap;
  }
}
