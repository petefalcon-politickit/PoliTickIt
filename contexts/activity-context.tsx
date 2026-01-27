import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useServices } from "./service-provider";

export interface ActivityCounts {
  accountability: number;
  community: number;
  knowledge: number;
  representative: number;
  notification: number;
  watchlist: number;
}

interface ActivityContextType {
  counts: ActivityCounts;
  contributionCredits: number;
  updateCounts: (newCounts: Partial<ActivityCounts>) => void;
  refreshCounts: () => Promise<void>;
  isLoading: boolean;
  lastViewedRepresentativeId: string | null;
  setLastViewedRepresentativeId: (id: string) => void;
}

const defaultCounts: ActivityCounts = {
  accountability: 0,
  community: 0,
  knowledge: 0,
  representative: 0,
  notification: 0,
  watchlist: 0,
};

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined,
);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { telemetryService } = useServices();
  const [counts, setCounts] = useState<ActivityCounts>(defaultCounts);
  const [contributionCredits, setContributionCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastViewedRepresentativeId, setLastViewedId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Sync with Telemetry Service for credits
    telemetryService.onCreditsUpdated((credits) => {
      setContributionCredits(credits);
    });
  }, [telemetryService]);

  const updateCounts = (newCounts: Partial<ActivityCounts>) => {
    setCounts((prev) => ({ ...prev, ...newCounts }));
  };

  const setLastViewedRepresentativeId = (id: string) => {
    setLastViewedId(id);
    AsyncStorage.setItem("lastViewedRepresentativeId", id).catch((err) =>
      console.error("Failed to save lastViewedRepresentativeId:", err),
    );
  };

  const refreshCounts = async () => {
    setIsLoading(true);
    try {
      // Mock API call - in a real app, this would be an actual fetch reaching the Distributor Processor
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Strategy: Unviewed Activity & Navigation Badges (Intensity Gating)
      // For Pro users, we gate the watchlist badge display based on "Signal Intensity"
      // to reduce notification fatigue while highlighting critical intelligence.

      const mockData: ActivityCounts = {
        accountability: 247,
        community: 43,
        knowledge: 14,
        representative: 102,
        notification: 2,
        // High Signal Watchlist Intensity:
        // Only 3 of the 17 items in the watchlist meet the "High Significance" threshold (Score > 80).
        watchlist: 3,
      };

      setCounts(mockData);
    } catch (error) {
      console.error("Failed to refresh activity counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch when app opens
    const loadLastViewedId = async () => {
      try {
        const savedId = await AsyncStorage.getItem(
          "lastViewedRepresentativeId",
        );
        if (savedId) {
          setLastViewedId(savedId);
        }
      } catch (err) {
        console.error("Failed to load lastViewedRepresentativeId:", err);
      }
    };

    loadLastViewedId();
    refreshCounts();
  }, []);

  return (
    <ActivityContext.Provider
      value={{
        counts,
        contributionCredits,
        updateCounts,
        refreshCounts,
        isLoading,
        lastViewedRepresentativeId,
        setLastViewedRepresentativeId,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};
