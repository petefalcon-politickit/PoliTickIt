import React, { createContext, useContext, useEffect, useState } from "react";
import container from "../services/container";
import { IAgencyRepository } from "../services/interfaces/IAgencyRepository";
import { ICivicIntelligenceService } from "../services/interfaces/ICivicIntelligenceService";
import { IFeedEnricher } from "../services/interfaces/IFeedEnricher";
import { IForensicSignalCoordinator } from "../services/interfaces/IForensicSignalCoordinator";
import { IHapticService } from "../services/interfaces/IHapticService";
import { INavigationService } from "../services/interfaces/INavigationService";
import { IOmniFeedProvider } from "../services/interfaces/IOmniFeedProvider";
import { IRepresentativeRepository } from "../services/interfaces/IRepresentativeRepository";
import { ISettingsProvider } from "../services/interfaces/ISettingsProvider";
import { ISnapRepository } from "../services/interfaces/ISnapRepository";
import { IUserLedgerService } from "../services/interfaces/IUserLedgerService";
import { IWatchlistService } from "../services/interfaces/IWatchlistService";

interface ServiceContextType {
  snapRepository: ISnapRepository;
  representativeRepository: IRepresentativeRepository;
  agencyRepository: IAgencyRepository;
  omniFeedProvider: IOmniFeedProvider;
  settingsProvider: ISettingsProvider;
  userLedgerService: IUserLedgerService;
  forensicSignalCoordinator: IForensicSignalCoordinator;
  civicIntelligenceService: ICivicIntelligenceService;
  watchlistService: IWatchlistService;
  navigationService: INavigationService;
  verificationService: any;
  sentimentRepository: any;
  hapticService: IHapticService;
  feedEnricher: IFeedEnricher;
  apiSyncService: any;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Resolve services from the container
  const services: ServiceContextType = {
    snapRepository: container.resolve("snapRepository"),
    representativeRepository: container.resolve("representativeRepository"),
    agencyRepository: container.resolve("agencyRepository"),
    omniFeedProvider: container.resolve("omniFeedProvider"),
    settingsProvider: container.resolve("settingsProvider"),
    userLedgerService: container.resolve("userLedgerService"),
    forensicSignalCoordinator: container.resolve("forensicSignalCoordinator"),
    civicIntelligenceService: container.resolve("civicIntelligenceService"),
    watchlistService: container.resolve("watchlistService"),
    navigationService: container.resolve("navigationService"),
    verificationService: container.resolve("verificationService"),
    sentimentRepository: container.resolve("sentimentRepository"),
    hapticService: container.resolve("hapticService"),
    feedEnricher: container.resolve("feedEnricher"),
    apiSyncService: container.resolve("apiSyncService"),
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        const db = container.resolve("databaseService");
        const hydration = container.resolve("storageHydrationService");
        const syncService = container.resolve("apiSyncService");

        await db.initialize();
        await hydration.hydrateIfNeeded();

        // Mark UI as initialized once local/mock data is ready
        setIsInitialized(true);

        // TRIGGER BACKGROUND SYNC
        // We do not await this, as we want the user to interact with local data immediately
        syncService.syncWithBackend().catch((error: any) => {
          console.warn(
            "[ServiceProvider] Background sync failed (backend might be down):",
            error,
          );
        });
      } catch (error) {
        console.error("Critical Failure during App Initialization:", error);
        // Fallback to allow app to run even if DB fails for some reason
        setIsInitialized(true);
      }
    };

    initApp();
  }, []);

  if (!isInitialized) {
    return null; // Suppression of UI until core infrastructure is ready
  }

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};
