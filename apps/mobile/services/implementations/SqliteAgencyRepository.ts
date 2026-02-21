import { Agency, IAgencyRepository } from "../interfaces/IAgencyRepository";
import { IDatabaseService } from "../interfaces/IDatabaseService";
import { SqliteEntityRepository } from "./SqliteEntityRepository";

export class SqliteAgencyRepository
  extends SqliteEntityRepository<Agency>
  implements IAgencyRepository
{
  constructor({ databaseService }: { databaseService: IDatabaseService }) {
    super({
      databaseService,
      entityDef: {
        tableName: "policy_areas",
        mapper: (row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          image_url: row.image_url,
          is_following: !!row.is_following,
          metadata: row.metadata_json
            ? JSON.parse(row.metadata_json)
            : undefined,
        }),
        saver: (agency: Agency) => ({
          query: `INSERT OR REPLACE INTO policy_areas (id, name, description, image_url, is_following, metadata_json) VALUES (?, ?, ?, ?, ?, ?)`,
          params: [
            agency.id,
            agency.name,
            agency.description,
            agency.image_url || null,
            agency.is_following ? 1 : 0,
            agency.metadata ? JSON.stringify(agency.metadata) : null,
          ],
        }),
      },
    });
  }

  async getAllAgencies(): Promise<Agency[]> {
    return this.getAll();
  }

  async getAgencyById(id: string): Promise<Agency | null> {
    return this.getById(id);
  }

  async saveAgency(agency: Agency): Promise<void> {
    return this.save(agency);
  }

  async deleteAgency(id: string): Promise<void> {
    return this.delete(id);
  }
}
