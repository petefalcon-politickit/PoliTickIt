import AsyncStorage from "@react-native-async-storage/async-storage";
import { IWatchlistService } from "../interfaces/IWatchlistService";

const WATCHLIST_STORAGE_KEY = "@PoliTickIt:Watchlist";

/**
 * WatchlistService
 * Implementation of IWatchlistService using AsyncStorage for persistence.
 */
export class WatchlistService implements IWatchlistService {
  async getWatchedIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to retrieve watchlist:", error);
      return [];
    }
  }

  async addToWatchlist(snapId: string): Promise<boolean> {
    try {
      const current = await this.getWatchedIds();
      if (!current.includes(snapId)) {
        const updated = [...current, snapId];
        await AsyncStorage.setItem(
          WATCHLIST_STORAGE_KEY,
          JSON.stringify(updated),
        );
      }
      return true;
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      return false;
    }
  }

  async removeFromWatchlist(snapId: string): Promise<boolean> {
    try {
      const current = await this.getWatchedIds();
      if (current.includes(snapId)) {
        const updated = current.filter((id) => id !== snapId);
        await AsyncStorage.setItem(
          WATCHLIST_STORAGE_KEY,
          JSON.stringify(updated),
        );
      }
      return true;
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      return false;
    }
  }

  async isWatched(snapId: string): Promise<boolean> {
    const current = await this.getWatchedIds();
    return current.includes(snapId);
  }
}
