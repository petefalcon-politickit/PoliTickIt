import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.0.0.252:5000/api/auth";
const DISTRICT_URL = "http://10.0.0.252:5000/api/district";
const SNAPS_URL = "http://10.0.0.252:5000/api/snaps";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "@politickit:accessToken",
  REFRESH_TOKEN: "@politickit:refreshToken",
  USER: "@politickit:user",
} as const;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  party: string;
  zip: string;
  state: string;
  district: string;
  interests: string[];
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  zip: string;
  interests: string[];
  party: string;
}

export interface RegisterResult {
  requiresVerification: true;
  email: string;
}

export type EmailAvailabilityResult =
  | { available: true }
  | { available: false; error: string };

export type ZipValidationResult =
  | { valid: true; state: string; district: string; memberCount: number }
  | { valid: false; error: string };

export type SnapFeedMode = "national" | "myFeed" | "trending";

export interface SnapFeedParams {
  mode?: SnapFeedMode;
  /** Comma-separated channel prefixes, e.g. "Representative:D000622,PolicyArea:ArmedForces" */
  channels?: string;
  type?: string;
  /** ISO-8601 UTC — only return snaps created after this date (delta sync). */
  sinceDate?: string;
  limit?: number;
  offset?: number;
}

export interface SnapFeedResponse {
  snaps: PoliSnapRaw[];
  total: number;
  mode: string;
  /** Store as `lastSyncedAt` in AsyncStorage; pass as `sinceDate` on next pull. */
  syncTimestamp: string;
}

/** Minimal shape of a snap as returned by /api/snaps. */
export interface PoliSnapRaw {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  channels: string[];
  metadata: {
    policyArea?: string;
    insightType?: string;
    representativeId?: string;
    laymanSummary?: string;
    keywords?: string[];
    [key: string]: unknown;
  };
  sources: { name: string; url?: string }[];
  elements: unknown[];
  theme?: string;
}

export interface RepresentativeInfo {
  bioguideId: string;
  name: string;
  party: string;
  state: string;
  district: string | null;
  chamber: "House" | "Senate";
  imageUrl: string | null;
  congressGovUrl: string | null;
}

interface AuthApiResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    state: string;
    district: string;
  };
}

export class ApiAuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async initialize(): Promise<AuthUser | null> {
    this.accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  }

  async register(payload: RegisterPayload): Promise<RegisterResult> {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).error ?? `Register failed (${res.status})`);
    }

    const data = await res.json();
    return { requiresVerification: true, email: data.email ?? payload.email };
  }

  async verifyEmail(email: string, code: string): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as any).error ?? `Verification failed (${res.status})`,
      );
    }

    const data: AuthApiResponse = await res.json();
    return this._persist(data);
  }

  async resendVerification(email: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).error ?? `Resend failed (${res.status})`);
    }
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).error ?? `Login failed (${res.status})`);
    }

    const data: AuthApiResponse = await res.json();
    return this._persist(data);
  }

  async refreshSession(): Promise<AuthUser | null> {
    if (!this.accessToken || !this.refreshToken) return null;

    const res = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      }),
    });

    if (!res.ok) {
      await this.logout();
      return null;
    }

    const data: AuthApiResponse = await res.json();
    return this._persist(data);
  }

  async getMe(): Promise<AuthUser | null> {
    if (!this.accessToken) return null;

    const res = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (res.status === 401) {
      return this.refreshSession();
    }

    if (!res.ok) return null;

    const profile = await res.json();
    const user: AuthUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      party: profile.party,
      zip: profile.zip,
      state: profile.state,
      district: profile.district,
      interests: profile.interests ?? [],
    };

    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  async updateProfile(patch: {
    firstName?: string;
    lastName?: string;
    party?: string;
    zip?: string;
    interests?: string[];
  }): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        firstName: patch.firstName,
        lastName: patch.lastName,
        party: patch.party,
        zip: patch.zip,
        interests: patch.interests,
      }),
    });

    if (res.status === 401) {
      await this.refreshSession();
      return this.updateProfile(patch);
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Failed to update profile.");
    }

    const profile = await res.json();
    const user: AuthUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      party: profile.party,
      zip: profile.zip,
      state: profile.state,
      district: profile.district,
      interests: profile.interests ?? [],
    };

    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    // Always resolves — server never reveals if email exists
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Invalid or expired reset code.");
    }
  }

  async getRepresentatives(
    state: string,
    district: string,
  ): Promise<RepresentativeInfo[]> {
    const res = await fetch(
      `${BASE_URL.replace("/auth", "")}/representatives?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`,
    );
    if (!res.ok) return [];
    return res.json();
  }

  /**
   * Fetch snaps from the server.
   *
   * Delta sync pattern:
   *   const lastSync = await AsyncStorage.getItem('@politickit:lastSyncedAt');
   *   const feed = await apiAuthService.getSnaps({ sinceDate: lastSync ?? undefined });
   *   await AsyncStorage.setItem('@politickit:lastSyncedAt', feed.syncTimestamp);
   */
  async getSnaps(params: SnapFeedParams = {}): Promise<SnapFeedResponse> {
    const query = new URLSearchParams();
    if (params.mode) query.set("mode", params.mode);
    if (params.channels) query.set("channels", params.channels);
    if (params.type) query.set("type", params.type);
    if (params.sinceDate) query.set("sinceDate", params.sinceDate);
    if (params.limit != null) query.set("limit", String(params.limit));
    if (params.offset != null) query.set("offset", String(params.offset));

    const url = query.size > 0 ? `${SNAPS_URL}?${query}` : SNAPS_URL;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Snaps fetch failed: ${res.status}`);
    }
    return res.json();
  }

  async logout(): Promise<void> {
    if (this.accessToken) {
      // Best-effort — don't block logout if the call fails
      fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: this.accessToken }),
      }).catch(() => {});
    }
    this.accessToken = null;
    this.refreshToken = null;
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async checkEmailAvailable(email: string): Promise<EmailAvailabilityResult> {
    try {
      const res = await fetch(
        `${BASE_URL}/check-email?email=${encodeURIComponent(email)}`,
      );
      const data = await res.json();
      if (data.available === false) {
        return { available: false, error: "This email is already registered." };
      }
      return { available: true };
    } catch {
      return {
        available: false,
        error: "Could not verify email. Please try again.",
      };
    }
  }

  async validateZip(zip: string): Promise<ZipValidationResult> {
    const res = await fetch(
      `${DISTRICT_URL}/lookup?zip=${encodeURIComponent(zip)}`,
    );
    const data = await res.json();
    if (!res.ok || !data.valid) {
      return { valid: false, error: data.error ?? "Invalid zip code." };
    }
    return {
      valid: true,
      state: data.state,
      district: data.district,
      memberCount: data.memberCount,
    };
  }

  private async _persist(data: AuthApiResponse): Promise<AuthUser> {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;

    const user: AuthUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      firstName: data.user.name.split(" ")[0] ?? "",
      lastName: data.user.name.split(" ").slice(1).join(" ") ?? "",
      party: "",
      zip: "",
      state: data.user.state,
      district: data.user.district,
      interests: [],
    };

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, data.accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken],
      [STORAGE_KEYS.USER, JSON.stringify(user)],
    ]);

    // Fetch full profile to populate firstName, lastName, party, etc.
    const full = await this.getMe();
    return full ?? user;
  }
}

export const apiAuthService = new ApiAuthService();
