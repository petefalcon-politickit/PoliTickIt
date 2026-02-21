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

export interface ActivityStats {
  streak: number;
  proofs: number;
}

export interface IntensitySettings {
  isEnabled: boolean; // Global toggle: Standard vs. Gated counts
  threshold: number; // 0-100 (Significance Score requirement)
  areas: {
    // Granular toggles for each domain
    accountability: boolean;
    watchlist: boolean;
    community: boolean;
    knowledge: boolean;
    representative: boolean;
  };
}

interface ActivityContextType {
  counts: ActivityCounts;
  dossierStats: ActivityStats;
  contributionCredits: number;
  intensitySettings: IntensitySettings;
  updateCounts: (newCounts: Partial<ActivityCounts>) => void;
  updateIntensitySettings: (
    settings: Partial<IntensitySettings>,
  ) => Promise<void>;
  refreshCounts: () => Promise<void>;
  refreshDossierStats: () => Promise<void>;
  isLoading: boolean;
  lastViewedRepresentativeId: string | null;
  setLastViewedRepresentativeId: (id: string) => void;
}

const defaultIntensitySettings: IntensitySettings = {
  isEnabled: true,
  threshold: 70,
  areas: {
    accountability: true,
    watchlist: true,
    community: true,
    knowledge: true,
    representative: true,
  },
};

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
  const { forensicSignalCoordinator, userLedgerService } = useServices();
  const [counts, setCounts] = useState<ActivityCounts>(defaultCounts);
  const [dossierStats, setDossierStats] = useState<ActivityStats>({
    streak: 0,
    proofs: 0,
  });
  const [contributionCredits, setContributionCredits] = useState(0);
  const [intensitySettings, setIntensitySettings] = useState<IntensitySettings>(
    defaultIntensitySettings,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastViewedRepresentativeId, setLastViewedId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Sync with Coordinator for impact metrics (credits + tier)
    forensicSignalCoordinator.onImpactUpdated((metrics) => {
      setContributionCredits(metrics.credits);
    });
  }, [forensicSignalCoordinator]);

  const updateCounts = (newCounts: Partial<ActivityCounts>) => {
    setCounts((prev) => ({ ...prev, ...newCounts }));
  };

  const updateIntensitySettings = async (
    newSettings: Partial<IntensitySettings>,
  ) => {
    const updated = {
      ...intensitySettings,
      ...newSettings,
      // If areas is being updated, merge deep
      areas: newSettings.areas
        ? { ...intensitySettings.areas, ...newSettings.areas }
        : intensitySettings.areas,
    };
    setIntensitySettings(updated);
    await userLedgerService.set("intensity_settings", JSON.stringify(updated));
    // Re-fetch counts with new settings
    await refreshCounts(updated);
  };

  const setLastViewedRepresentativeId = (id: string) => {
    setLastViewedId(id);
    userLedgerService
      .set("last_viewed_representative_id", id)
      .catch((err) =>
        console.error("Failed to save last_viewed_representative_id:", err),
      );
  };

  const refreshCounts = async (settingsToUse?: IntensitySettings) => {
    setIsLoading(true);
    try {
      // Pass the current or provided intensity settings to the coordinator
      const data = await forensicSignalCoordinator.getActivityCounts(
        settingsToUse || intensitySettings,
      );
      setCounts(data);
    } catch (error) {
      console.error("Failed to refresh activity counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDossierStats = async () => {
    try {
      const stats = await forensicSignalCoordinator.getDossierStats();
      setDossierStats(stats);
    } catch (error) {
      console.error("Failed to refresh dossier stats:", error);
    }
  };

  useEffect(() => {
    // Initial fetch when app opens
    const initializeData = async () => {
      try {
        const [savedId, savedSettingsString, savedCredits] = await Promise.all([
          userLedgerService.getString("last_viewed_representative_id"),
          userLedgerService.getString("intensity_settings"),
          userLedgerService.getNumber("participation_credits"),
        ]);

        if (savedId) {
          setLastViewedId(savedId);
        }

        if (savedSettingsString) {
          try {
            setIntensitySettings(JSON.parse(savedSettingsString));
          } catch (e) {
            console.warn("Failed to parse saved intensity settings:", e);
          }
        }

        if (savedCredits !== null) {
          setContributionCredits(savedCredits);
        }
      } catch (err) {
        console.error("Failed to load initial activity data:", err);
      }
    };

    initializeData();
    refreshCounts();
    refreshDossierStats();
  }, [userLedgerService]);

  return (
    <ActivityContext.Provider
      value={{
        counts,
        dossierStats,
        contributionCredits,
        intensitySettings,
        updateCounts,
        updateIntensitySettings,
        refreshCounts,
        refreshDossierStats,
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
