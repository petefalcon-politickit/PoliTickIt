export interface ISentiment {
  snapId: string;
  elementId: string;
  value: any;
  timestamp: string;
}

export interface ISentimentRepository {
  saveSentiment(sentiment: ISentiment): Promise<void>;
  getSentiment(snapId: string, elementId: string): Promise<ISentiment | null>;
  getAllSentiments(): Promise<ISentiment[]>;
}
