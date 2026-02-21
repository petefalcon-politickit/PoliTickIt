import { IDatabaseService } from "../interfaces/IDatabaseService";
import { ISqliteRepository } from "../interfaces/ISqliteRepository";

export interface EntityDef<T> {
  tableName: string;
  mapper: (row: any) => T;
  saver: (entity: T) => { query: string; params: any[] };
}

/**
 * SqliteEntityRepository
 * A generic implementation of ISqliteRepository to reduce boilerplate and de-proliferate services.
 */
export class SqliteEntityRepository<T> implements ISqliteRepository<T> {
  protected db: IDatabaseService;
  protected def: EntityDef<T>;

  constructor({
    databaseService,
    entityDef,
  }: {
    databaseService: IDatabaseService;
    entityDef: EntityDef<T>;
  }) {
    this.db = databaseService;
    this.def = entityDef;
  }

  async getById(id: string): Promise<T | null> {
    const rows = await this.db.execute(
      `SELECT * FROM ${this.def.tableName} WHERE id = ?`,
      [id],
    );
    if (rows.length === 0) return null;
    return this.def.mapper(rows[0]);
  }

  async getAll(): Promise<T[]> {
    const rows = await this.db.execute(
      `SELECT * FROM ${this.def.tableName} ORDER BY name ASC`,
    );
    return rows.map((row: any) => this.def.mapper(row));
  }

  async save(entity: T): Promise<void> {
    const { query, params } = this.def.saver(entity);
    await this.db.execute(query, params);
  }

  async toggleFollow(id: string, isFollowing: boolean): Promise<void> {
    await this.db.execute(
      `UPDATE ${this.def.tableName} SET is_following = ? WHERE id = ?`,
      [isFollowing ? 1 : 0, id],
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(`DELETE FROM ${this.def.tableName} WHERE id = ?`, [
      id,
    ]);
  }
}
