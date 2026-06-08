export interface WatchedProcess {
  id: string;
  correlationKey: string;
  displayName: string;
  processType: string;
  watchedSince: string;       // ISO-8601
  notifyOnUpdate: boolean;
  lastViewedAt?: string;      // ISO-8601 — null until user opens the tracker
}
