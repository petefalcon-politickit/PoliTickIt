export interface User {
  id: string;
  name: string;
  state: string;
  district: string;
  profileImage?: string;
  contributionCredits?: number;
}

export interface Representative {
  id: string;
  /** BioguideId (e.g. "M001184"). Same value as `id` when coming from the API. */
  bioguideId?: string;
  name: string;
  /** "House" | "Senate" | legacy position string */
  chamber?: string;
  /** @deprecated Use `chamber` — retained for backward compat with mock/SQLite data */
  position?: string;
  /** Government tier: "Federal" (Congress), "State" (state legislators), "District" (local) */
  level?: "Federal" | "State" | "District";
  state: string;
  district?: string;
  party: string;
  /** Absolute URL to representative photo (GitHub CDN or images.politickit.com). */
  profileImage: string;
  /** Raw imageUrl returned from API — aliased to profileImage during mapping. */
  imageUrl?: string;
  contact?: string;
  biography?: string;
  committees?: string[];
  recentEvents?: { title: string; date: string; description?: string }[];
  stats?: {
    productivityScore?: number;
    attendanceRate?: number;
    bipartisanIndex?: number;
  };
  isFollowing?: boolean;
}

export interface Interest {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
}

export interface Agency {
  id: string;
  name: string;
  level: "federal" | "state" | "county" | "city" | "neighborhood";
  description?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Discussion {
  id: string;
  title: string;
  comments: Comment[];
  participants: number;
}
