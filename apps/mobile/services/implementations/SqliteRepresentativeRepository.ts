import { Representative } from "@/types/user";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import { IRepresentativeRepository } from "../interfaces/IRepresentativeRepository";
import { SqliteEntityRepository } from "./SqliteEntityRepository";

export class SqliteRepresentativeRepository
  extends SqliteEntityRepository<Representative>
  implements IRepresentativeRepository
{
  constructor({ databaseService }: { databaseService: IDatabaseService }) {
    super({
      databaseService,
      entityDef: {
        tableName: "representatives",
        mapper: (row: any) => {
          const meta = row.metadata_json ? JSON.parse(row.metadata_json) : {};
          return {
            id: row.id,
            name: row.name,
            position: row.position,
            party: row.party,
            state: row.state,
            district: row.district,
            profileImage: row.profile_image,
            biography: row.biography,
            isFollowing: !!row.is_following,
            ...meta,
          };
        },
        saver: (rep: Representative) => {
          const {
            id,
            name,
            position,
            party,
            state,
            district,
            profileImage,
            biography,
            isFollowing,
            ...meta
          } = rep;
          return {
            query: `INSERT OR REPLACE INTO representatives (
              id, name, position, party, state, district, profile_image, biography, is_following, metadata_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              id,
              name,
              position,
              party,
              state,
              district || null,
              profileImage || null,
              biography || null,
              isFollowing ? 1 : 0,
              JSON.stringify(meta || {}),
            ],
          };
        },
      },
    });
  }

  async getRepresentativeById(id: string): Promise<Representative | null> {
    return this.getById(id);
  }

  async getAllRepresentatives(): Promise<Representative[]> {
    return this.getAll();
  }

  async saveRepresentative(rep: Representative): Promise<void> {
    return this.save(rep);
  }

  /**
   * RSP Implementation: Sovereign Upsert
   * Updates core representative data from backend but PRESERVES local 'is_following' state.
   */
  async upsertSovereign(rep: Representative): Promise<void> {
    const {
      id,
      name,
      position,
      party,
      state,
      district,
      profileImage,
      biography,
      isFollowing, // ignored for update
      ...meta
    } = rep;

    await this.db.execute(
      `INSERT INTO representatives (
        id, name, position, party, state, district, profile_image, biography, metadata_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        position = excluded.position,
        party = excluded.party,
        state = excluded.state,
        district = excluded.district,
        profile_image = excluded.profile_image,
        biography = excluded.biography,
        metadata_json = excluded.metadata_json;`,
      [
        id,
        name,
        position,
        party,
        state,
        district || null,
        profileImage || null,
        biography || null,
        JSON.stringify(meta || {}),
      ],
    );
  }

  async toggleFollow(id: string, isFollowing: boolean): Promise<void> {
    await this.db.execute(
      "UPDATE representatives SET is_following = ? WHERE id = ?",
      [isFollowing ? 1 : 0, id],
    );
  }
}
