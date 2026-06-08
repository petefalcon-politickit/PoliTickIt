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
            bioguideId: row.id,
            name: row.name,
            chamber: row.chamber ?? row.position ?? undefined,
            position: row.position ?? row.chamber ?? undefined,
            party: row.party,
            state: row.state,
            district: row.district,
            profileImage: row.profile_image,
            biography: row.biography,
            isFollowing: !!row.is_following,
            branchType:
              (row.branch_type as "legislative" | "executive") ?? "legislative",
            ...meta,
          };
        },
        saver: (rep: Representative) => {
          const {
            id,
            name,
            chamber,
            position,
            party,
            state,
            district,
            profileImage,
            biography,
            isFollowing,
            bioguideId,
            imageUrl,
            branchType,
            ...meta
          } = rep;
          const effectiveChamber = chamber ?? position ?? null;
          const effectiveBranch = branchType ?? "legislative";
          return {
            query: `INSERT OR REPLACE INTO representatives (
              id, name, position, chamber, party, state, district,
              profile_image, biography, is_following, branch_type, metadata_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              id,
              name,
              effectiveChamber,
              effectiveChamber,
              party,
              state,
              district || null,
              profileImage || null,
              biography || null,
              isFollowing ? 1 : 0,
              effectiveBranch,
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
   * Updates core representative data from the backend but PRESERVES local `is_following` state.
   */
  async upsertSovereign(rep: Representative): Promise<void> {
    const {
      id,
      name,
      chamber,
      position,
      party,
      state,
      district,
      profileImage,
      biography,
      isFollowing, // intentionally NOT written — sovereignty rule
      bioguideId,
      imageUrl,
      branchType,
      ...meta
    } = rep;
    const effectiveChamber = chamber ?? position ?? null;
    const effectiveBranch = branchType ?? "legislative";

    await this.db.execute(
      `INSERT INTO representatives (
        id, name, position, chamber, party, state, district, profile_image, biography, branch_type, metadata_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        position = excluded.position,
        chamber = excluded.chamber,
        party = excluded.party,
        state = excluded.state,
        district = excluded.district,
        profile_image = excluded.profile_image,
        biography = excluded.biography,
        branch_type = excluded.branch_type,
        metadata_json = excluded.metadata_json;`,
      [
        id,
        name,
        effectiveChamber,
        effectiveChamber,
        party,
        state,
        district || null,
        profileImage || null,
        biography || null,
        effectiveBranch,
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

  /**
   * RSP Follow Restore — sets is_following=1 for each id in `followedIds` and
   * is_following=0 for all others. Used after reinstall to restore follow state
   * from the user's Cosmos-backed follow list.
   */
  async bulkSetFollowing(followedIds: string[]): Promise<void> {
    if (followedIds.length === 0) {
      await this.db.execute("UPDATE representatives SET is_following = 0", []);
      return;
    }
    const placeholders = followedIds.map(() => "?").join(", ");
    await this.db.execute(
      `UPDATE representatives
         SET is_following = CASE WHEN id IN (${placeholders}) THEN 1 ELSE 0 END`,
      followedIds,
    );
  }

  async syncFollowingFromBackend(): Promise<void> {
    // No-op on the SQLite repo: ApiSyncService coordinates the full restore flow.
  }
}
