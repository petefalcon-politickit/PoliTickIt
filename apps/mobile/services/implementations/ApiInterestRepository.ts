// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ApiInterestRepository.ts
// PROJECT     : PoliTickIt.Mobile
// LAYER       : Services → Implementations
// PURPOSE     : Fetches the Congress.gov policy area taxonomy from the
//               PoliTickIt API. Each entry is mapped to the Agency interface
//               so existing UI and SQLite follow-state logic works unchanged.
//               Falls back to an empty array on network error — the screen
//               will show a "could not load" message via its own error state.
// ─────────────────────────────────────────────────────────────────────────────

import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithTimeout } from "../fetch-utils";
import { Agency } from "../interfaces/IAgencyRepository";
import { apiAuthService } from "./ApiAuthService";

const ACCESS_TOKEN_KEY = "@politickit:accessToken";

const BASE_URL = "http://10.0.0.252:5000/api";

/** Shape returned by GET /api/policy-areas */
interface ApiPolicyAreaResponse {
  id: string; // slug, e.g. "economics-and-public-finance"
  name: string;
  description: string;
  imageUrl?: string | null;
}

function mapApiInterest(raw: ApiPolicyAreaResponse): Agency {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    image_url: raw.imageUrl ?? undefined,
    is_following: false, // merged with SQLite follow state in the screen
  };
}

export class ApiInterestRepository {
  /**
   * Returns all policy area categories from the backend taxonomy.
   * Returns an empty array on any network or parse error.
   */
  async getAllInterests(): Promise<Agency[]> {
    const url = `${BASE_URL}/policy-areas`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 15000 });
      if (!response.ok) {
        console.error(`[ApiInterestRepo] GET ${url} → ${response.status}`);
        return [];
      }
      const raw: ApiPolicyAreaResponse[] = await response.json();
      return raw.map(mapApiInterest);
    } catch (error: any) {
      console.error("[ApiInterestRepo] getAllInterests:", error.message);
      return [];
    }
  }

  /**
   * Persists a follow/unfollow for a policy area to the backend.
   * isFollowing = true → POST /api/user/interests/follow
   * isFollowing = false → DELETE /api/user/interests/follow/{id}
   * Silently no-ops if unauthenticated.
   */
  async toggleFollow(id: string, isFollowing: boolean): Promise<void> {
    let token =
      apiAuthService.getAccessToken() ??
      (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
    if (!token) {
      console.warn(
        "[ApiInterestRepo] toggleFollow: no access token — skipping API call",
      );
      return;
    }

    const url = isFollowing
      ? `${BASE_URL}/user/interests/follow`
      : `${BASE_URL}/user/interests/follow/${encodeURIComponent(id)}`;
    const method = isFollowing ? "POST" : "DELETE";
    const makeHeaders = (t: string): Record<string, string> => ({
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
    });
    const body = isFollowing ? JSON.stringify({ policyAreaId: id }) : undefined;

    try {
      let response = await fetchWithTimeout(url, {
        method,
        headers: makeHeaders(token),
        body,
        timeout: 8000,
      });

      if (response.status === 401) {
        const refreshed = await apiAuthService.refreshSession();
        if (!refreshed) {
          console.warn(
            "[ApiInterestRepo] toggleFollow: refresh failed — unauthenticated",
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
          `[ApiInterestRepo] toggleFollow(${id}, ${isFollowing}): ${response.status}`,
        );
    } catch (error: any) {
      console.error("[ApiInterestRepo] toggleFollow:", error.message);
    }
  }

  /**
   * Returns the user's followed policy-area IDs from the backend.
   * Returns an empty array if unauthenticated or on error.
   */
  async getFollowingIds(): Promise<string[]> {
    let token =
      apiAuthService.getAccessToken() ??
      (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
    if (!token) return [];

    const url = `${BASE_URL}/user/interests/following`;
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
      console.error("[ApiInterestRepo] getFollowingIds:", error.message);
      return [];
    }
  }

  /**
   * Returns a single policy area by its slug ID.
   * Returns null if not found or on error.
   */
  async getInterestById(id: string): Promise<Agency | null> {
    const url = `${BASE_URL}/policy-areas/${encodeURIComponent(id)}`;
    try {
      const response = await fetchWithTimeout(url, { timeout: 5000 });
      if (!response.ok) return null;
      const raw: ApiPolicyAreaResponse = await response.json();
      return mapApiInterest(raw);
    } catch (error: any) {
      console.error(`[ApiInterestRepo] getInterestById(${id}):`, error.message);
      return null;
    }
  }
}
