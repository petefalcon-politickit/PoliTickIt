import { PoliSnap } from "@/types/polisnap";

export type SnapCategory =
  | "accountability"
  | "representative"
  | "community"
  | "knowledge"
  | "participation"
  | "trending"
  | "economics"
  | "notifications";

export interface FeedFilter {
  category?: SnapCategory;
  representativeId?: string;
  districtId?: string;
  policyId?: string;
  tab?: string;
  query?: string;
  limit?: number;
  followingOnly?: boolean;
  [key: string]: any;
}

export interface FeedResult {
  snaps: PoliSnap[];
  lockedTiers?: number[];
  [key: string]: any;
}

/**
 * IOmniFeedProvider
 * The unified polymorphic provider for all signal-based feeds in Omni-OS.
 * Replaces specialized providers (Accountability, Community, Knowledge, etc.)
 */
export interface IOmniFeedProvider {
  /**
   * Universal method for retrieving snaps filtered by category/context.
   */
  getSnaps(filter: FeedFilter): Promise<FeedResult>;

  /**
   * Retrieves participation history for the current user.
   */
  getParticipationHistory(limit: number, offset: number): Promise<any[]>;

  /**
   * Retrieves a single focused snapshot for a specific entity or context (Dashboard, Detail, etc.).
   */
  getFocusSnap(filter: FeedFilter): Promise<PoliSnap | null>;

  /**
   * Retrieves snapshots related to a parent snapshot (drill-down, trust threads, etc.).
   */
  getRelatedSnaps(parentId: string, relationType?: string): Promise<PoliSnap[]>;

  /**
   * Executes a domain-specific forensic action (Audit Request, Verification, etc.).
   */
  executeAction<T = any>(actionType: string, params: any): Promise<T>;
}
