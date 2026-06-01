import { Representative } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithTimeout } from "../fetch-utils";
import { IRepresentativeRepository } from "../interfaces/IRepresentativeRepository";
import { apiAuthService } from "./ApiAuthService";

const ACCESS_TOKEN_KEY = "@politickit:accessToken";
const IMAGE_CDN_BASE = "https://unitedstates.github.io/images/congress/225x275";

/** Shape returned by /api/representatives/registry and /api/representatives/{id} */
interface ApiRepResponse {
  id: string; // BioguideId
  name: string;
  party: string;
  state: string;
  district?: string;
  chamber: string; // "House" | "Senate"
  imageUrl: string;
  congressGovUrl?: string;
}

function mapApiRep(raw: ApiRepResponse): Representative {
  return {
    id: raw.id,
    bioguideId: raw.id,
    name: raw.name,
    party: raw.party,
    state: raw.state,
    district: raw.district ?? undefined,
    chamber: raw.chamber,
    position: raw.chamber, // backward compat
    level: "Federal",
    profileImage: raw.imageUrl || `${IMAGE_CDN_BASE}/${raw.id}.jpg`,
    imageUrl: raw.imageUrl,
  };
}

/**
 * API implementation of the Representative Repository (RSP Protocol).
 * Reads reps from the Congress member store via the API and syncs follow
 * state with the user's Cosmos-backed follow list.
 */
export class ApiRepresentativeRepository implements IRepresentativeRepository {
  private readonly baseUrl = "http://10.0.0.252:5000/api";

  // ── Read ──────────────────────────────────────────────────────────────────

  async getAllRepresentatives(): Promise<Representative[]> {
    const url = `${this.baseUrl}/representatives/registry`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 15000 });
      if (!response.ok)
        throw new Error(`Registry fetch failed: ${response.status}`);
      const raw: ApiRepResponse[] = await response.json();
      return raw.map(mapApiRep);
    } catch (error: any) {
      console.error("[ApiRepRepo] getAllRepresentatives:", error.message);
      return [];
    }
  }

  async getRepresentativeById(id: string): Promise<Representative | null> {
    const url = `${this.baseUrl}/representatives/${encodeURIComponent(id)}`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 5000 });
      if (!response.ok) return null;
      const raw: ApiRepResponse = await response.json();
      return mapApiRep(raw);
    } catch (error: any) {
      console.error(
        `[ApiRepRepo] getRepresentativeById(${id}):`,
        error.message,
      );
      return null;
    }
  }

  // ── Follow / Unfollow ────────────────────────────────────────────────────

  /**
   * Persists follow/unfollow to the backend. isFollowing = true → POST, false → DELETE.
   */
  async toggleFollow(id: string, isFollowing: boolean): Promise<void> {
    let token =
      apiAuthService.getAccessToken() ??
      (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
    if (!token) {
      console.warn(
        "[ApiRepRepo] toggleFollow: no access token — skipping API call",
      );
      return;
    }

    const url = isFollowing
      ? `${this.baseUrl}/user/representatives/follow`
      : `${this.baseUrl}/user/representatives/follow/${encodeURIComponent(id)}`;

    const method = isFollowing ? "POST" : "DELETE";
    const makeHeaders = (t: string): Record<string, string> => ({
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
    });
    const body = isFollowing ? JSON.stringify({ bioguideId: id }) : undefined;

    try {
      let response = await fetchWithTimeout(url, {
        method,
        headers: makeHeaders(token),
        body,
        timeout: 8000,
      });

      if (response.status === 401) {
        // Token expired — refresh and retry once
        const refreshed = await apiAuthService.refreshSession();
        if (!refreshed) {
          console.warn(
            "[ApiRepRepo] toggleFollow: refresh failed — unauthenticated",
          );
          return;
        }
        token =
          apiAuthService.getAccessToken() ??
          (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
        response = await fetchWithTimeout(url, {
          method,
          headers: makeHeaders(token!),
          body,
          timeout: 8000,
        });
      }

      if (!response.ok)
        console.warn(
          `[ApiRepRepo] toggleFollow(${id}, ${isFollowing}): ${response.status}`,
        );
    } catch (error: any) {
      console.error("[ApiRepRepo] toggleFollow:", error.message);
    }
  }

  /**
   * Fetches the user's followed BioguideIds from the backend and returns them.
   * The caller (ApiSyncService) is responsible for applying these to SQLite.
   */
  async getFollowingIds(): Promise<string[]> {
    let token =
      apiAuthService.getAccessToken() ??
      (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
    if (!token) return [];

    const url = `${this.baseUrl}/user/representatives/following`;
    try {
      let response = await fetchWithTimeout(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000,
      });

      if (response.status === 401) {
        const refreshed = await apiAuthService.refreshSession();
        if (!refreshed) return [];
        token =
          apiAuthService.getAccessToken() ??
          (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
        response = await fetchWithTimeout(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token!}` },
          timeout: 8000,
        });
      }

      if (!response.ok) return [];
      return (await response.json()) as string[];
    } catch (error: any) {
      console.error("[ApiRepRepo] getFollowingIds:", error.message);
      return [];
    }
  }

  /**
   * syncFollowingFromBackend — no-op on the API repo.
   * The SQLite composite repo (ApiSyncService) handles the full sync workflow
   * by calling getFollowingIds() + sqliteRepo.bulkSetFollowing(ids).
   */
  async syncFollowingFromBackend(): Promise<void> {
    // Intentionally empty: the composite sync path in ApiSyncService drives this.
  }

  // ── Local persistence — not supported ────────────────────────────────────

  async saveRepresentative(_rep: Representative): Promise<void> {
    throw new Error("Local persistence not supported on API repository");
  }

  async upsertSovereign(_rep: Representative): Promise<void> {
    throw new Error("Local persistence not supported on API repository");
  }
}
