import React, { createContext, useContext, useEffect, useState } from "react";
import container from "../services/container";
import { ApiSyncService } from "../services/implementations/ApiSyncService";
import { IAccountabilityProvider } from "../services/interfaces/IAccountabilityProvider";
import { IActivityService } from "../services/interfaces/IActivityService";
import { IAgencyRepository } from "../services/interfaces/IAgencyRepository";
import { ICivicIntelligenceService } from "../services/interfaces/ICivicIntelligenceService";
import { ICommunityProvider } from "../services/interfaces/ICommunityProvider";
import { IFeedEnricher } from "../services/interfaces/IFeedEnricher";
import { IHapticService } from "../services/interfaces/IHapticService";
import { IKnowledgeProvider } from "../services/interfaces/IKnowledgeProvider";
import { INavigationService } from "../services/interfaces/INavigationService";
import { INotificationProvider } from "../services/interfaces/INotificationProvider";
import { IParticipationProvider } from "../services/interfaces/IParticipationProvider";
import { IPulseService } from "../services/interfaces/IPulseService";
import { IRepresentativeProvider } from "../services/interfaces/IRepresentativeProvider";
import { IRepresentativeRepository } from "../services/interfaces/IRepresentativeRepository";
import { ISettingsProvider } from "../services/interfaces/ISettingsProvider";
import { ISnapContinuumProvider } from "../services/interfaces/ISnapContinuumProvider";
import { ISnapRepository } from "../services/interfaces/ISnapRepository";
import { ITelemetryService } from "../services/interfaces/ITelemetryService";
import { IUserLedgerService } from "../services/interfaces/IUserLedgerService";
import { IVerificationService } from "../services/interfaces/IVerificationService";
import { IWatchlistProvider } from "../services/interfaces/IWatchlistProvider";
import { IWatchlistService } from "../services/interfaces/IWatchlistService";

interface ServiceContextType {
  snapRepository: ISnapRepository;
  representativeRepository: IRepresentativeRepository;
  agencyRepository: IAgencyRepository;
  snapContinuumProvider: ISnapContinuumProvider;
  watchlistProvider: IWatchlistProvider;
  accountabilityProvider: IAccountabilityProvider;
  communityProvider: ICommunityProvider;
  knowledgeProvider: IKnowledgeProvider;
  participationProvider: IParticipationProvider;
  representativeProvider: IRepresentativeProvider;
  notificationProvider: INotificationProvider;
  settingsProvider: ISettingsProvider;
  telemetryService: ITelemetryService;
  userLedgerService: IUserLedgerService;
  verificationService: IVerificationService;
  activityService: IActivityService;
  pulseService: IPulseService;
  civicIntelligenceService: ICivicIntelligenceService;
  watchlistService: IWatchlistService;
  navigationService: INavigationService;
  sentimentRepository: any;
  hapticService: IHapticService;
  feedEnricher: IFeedEnricher;
  apiSyncService: ApiSyncService;
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
    snapContinuumProvider: container.resolve("snapContinuumProvider"),
    watchlistProvider: container.resolve("watchlistProvider"),
    accountabilityProvider: container.resolve("accountabilityProvider"),
    communityProvider: container.resolve("communityProvider"),
    knowledgeProvider: container.resolve("knowledgeProvider"),
    participationProvider: container.resolve("participationProvider"),
    representativeProvider: container.resolve("representativeProvider"),
    notificationProvider: container.resolve("notificationProvider"),
    settingsProvider: container.resolve("settingsProvider"),
    telemetryService: container.resolve("telemetryService"),
    userLedgerService: container.resolve("userLedgerService"),
    verificationService: container.resolve("verificationService"),
    activityService: container.resolve("activityService"),
    pulseService: container.resolve("pulseService"),
    civicIntelligenceService: container.resolve("civicIntelligenceService"),
    watchlistService: container.resolve("watchlistService"),
    navigationService: container.resolve("navigationService"),
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
        const apiSync = container.resolve("apiSyncService");

        await db.initialize();
        await hydration.hydrateIfNeeded();

        // --- NEW: Perform Auto-Sync from C# Backend ---
        // This runs in the background to not block the UI initial render path
        apiSync.syncWithBackend().then((result) => {
          if (result.success) {
            console.log(
              `[ServiceProvider] Background Sync Finished: ${result.count} snaps synchronized.`,
            );
          }
        });

        setIsInitialized(true);
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
