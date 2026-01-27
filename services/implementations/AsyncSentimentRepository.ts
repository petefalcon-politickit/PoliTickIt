import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    ISentiment,
    ISentimentRepository,
} from "../interfaces/ISentimentRepository";

const STORAGE_KEY = "politickit_user_sentiments";

export class AsyncSentimentRepository implements ISentimentRepository {
  async saveSentiment(sentiment: ISentiment): Promise<void> {
    try {
      const existing = await this.getAllSentiments();
      // Remove existing for this specific element if it exists
      const filtered = existing.filter(
        (s) =>
          !(
            s.snapId === sentiment.snapId && s.elementId === sentiment.elementId
          ),
      );

      const updated = [...filtered, sentiment];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save sentiment:", error);
    }
  }

  async getSentiment(
    snapId: string,
    elementId: string,
  ): Promise<ISentiment | null> {
    const all = await this.getAllSentiments();
    return (
      all.find((s) => s.snapId === snapId && s.elementId === elementId) || null
    );
  }

  async getAllSentiments(): Promise<ISentiment[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to fetch sentiments:", error);
      return [];
    }
  }
}
