import { representatives } from "@/constants/mockData";
import { Representative } from "@/types/user";
import { IRepresentativeRepository } from "../interfaces/IRepresentativeRepository";

export class MockRepresentativeRepository implements IRepresentativeRepository {
  private async delay(ms: number = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllRepresentatives(): Promise<Representative[]> {
    await this.delay(200);
    return representatives;
  }

  async getRepresentativeById(id: string): Promise<Representative | null> {
    await this.delay(300);
    return representatives.find((r) => r.id === id) || null;
  }

  async saveRepresentative(rep: Representative): Promise<void> {
    // No-op for mock
  }

  async toggleFollow(id: string, isFollowing: boolean): Promise<void> {
    // No-op for mock
  }
}
