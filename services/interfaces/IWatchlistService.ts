/**
 * IWatchlistService
 * Interface for managing a user's watched PoliSnaps.
 */
export interface IWatchlistService {
  /**
   * getWatchedIds
   * Retrieves all snap IDs currently in the watchlist.
   */
  getWatchedIds(): Promise<string[]>;

  /**
   * addToWatchlist
   * Adds a snap to the watchlist.
   * @param snapId The ID of the snap to watch.
   */
  addToWatchlist(snapId: string): Promise<boolean>;

  /**
   * removeFromWatchlist
   * Removes a snap from the watchlist.
   * @param snapId The ID of the snap to unwatch.
   */
  removeFromWatchlist(snapId: string): Promise<boolean>;

  /**
   * isWatched
   * Checks if a snap is currently in the watchlist.
   * @param snapId The ID of the snap to check.
   */
  isWatched(snapId: string): Promise<boolean>;
}
