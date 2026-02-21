import { asClass, createContainer, InjectionMode } from "awilix";
import { ApiSnapRepository } from "./implementations/ApiSnapRepository";
import { ApiSyncService } from "./implementations/ApiSyncService";
import { ApiTelemetryService } from "./implementations/ApiTelemetryService";
import { AsyncSentimentRepository } from "./implementations/AsyncSentimentRepository";
import { CivicIntelligenceService } from "./implementations/CivicIntelligenceService";
import { FECVoteNormalizer } from "./implementations/FECVoteNormalizer";
import { FeedEnricher } from "./implementations/FeedEnricher";
import { HapticService } from "./implementations/HapticService";
import { HybridSnapRepository } from "./implementations/HybridSnapRepository";
import { MockAccountabilityProvider } from "./implementations/MockAccountabilityProvider";
import { MockActivityService } from "./implementations/MockActivityService";
import { MockCommunityProvider } from "./implementations/MockCommunityProvider";
import { MockCorrelationRepository } from "./implementations/MockCorrelationRepository";
import { MockKnowledgeProvider } from "./implementations/MockKnowledgeProvider";
import { MockNotificationProvider } from "./implementations/MockNotificationProvider";
import { MockParticipationProvider } from "./implementations/MockParticipationProvider";
import { MockRepresentativeProvider } from "./implementations/MockRepresentativeProvider";
import { MockSettingsProvider } from "./implementations/MockSettingsProvider";
import { MockSnapContinuumProvider } from "./implementations/MockSnapContinuumProvider";
import { MockSnapRepository } from "./implementations/MockSnapRepository";
import { MockTelemetryService } from "./implementations/MockTelemetryService";
import { MockVerificationService } from "./implementations/MockVerificationService";
import { MockWatchlistProvider } from "./implementations/MockWatchlistProvider";
import { NavigationService } from "./implementations/NavigationService";
import { SqliteAgencyRepository } from "./implementations/SqliteAgencyRepository";
import { SqliteDatabaseService } from "./implementations/SqliteDatabaseService";
import { SqlitePulseService } from "./implementations/SqlitePulseService";
import { SqliteRepresentativeRepository } from "./implementations/SqliteRepresentativeRepository";
import { SqliteSnapRepository } from "./implementations/SqliteSnapRepository";
import { StorageHydrationService } from "./implementations/StorageHydrationService";
import { UserLedgerService } from "./implementations/UserLedgerService";
import { WatchlistService } from "./implementations/WatchlistService";

// Define the schema for the container
export interface IServices {
  databaseService: SqliteDatabaseService;
  userLedgerService: UserLedgerService;
  storageHydrationService: StorageHydrationService;
  apiSyncService: ApiSyncService;
  snapRepository: any;
  representativeRepository: SqliteRepresentativeRepository;
  agencyRepository: SqliteAgencyRepository;
  snapContinuumProvider: any;
  watchlistProvider: any;
  accountabilityProvider: any;
  communityProvider: any;
  knowledgeProvider: any;
  participationProvider: any;
  representativeProvider: any;
  notificationProvider: any;
  settingsProvider: any;
  navigationService: NavigationService;
  activityService: MockActivityService;
  pulseService: SqlitePulseService;
  civicIntelligenceService: CivicIntelligenceService;
  fecVoteNormalizer: FECVoteNormalizer;
  telemetryService: any; // Allow for Mock or API implementation
  verificationService: any; // Hardware Attestation & ZK-Residency
  watchlistService: WatchlistService;
  sentimentRepository: AsyncSentimentRepository;
  correlationRepository: MockCorrelationRepository;
  hapticService: HapticService;
  feedEnricher: FeedEnricher;
}

const container = createContainer<IServices>({
  injectionMode: InjectionMode.PROXY,
});

// Switch this flag to toggle between Mock and API
const USE_MOCK = true;

container.register({
  databaseService: asClass(SqliteDatabaseService).singleton(),
  userLedgerService: asClass(UserLedgerService).singleton(),
  storageHydrationService: asClass(StorageHydrationService).singleton(),
  apiSyncService: asClass(ApiSyncService).singleton(),

  // Register specific repo implementations for the Hybrid orchestrator
  mockSnapRepository: asClass(MockSnapRepository).singleton(),
  sqliteSnapRepository: asClass(SqliteSnapRepository).singleton(),
  apiSnapRepository: asClass(ApiSnapRepository).singleton(),

  // The primary snapRepository used by the app is now the Hybrid one
  snapRepository: asClass(HybridSnapRepository).singleton(),

  representativeRepository: asClass(SqliteRepresentativeRepository).singleton(),
  agencyRepository: asClass(SqliteAgencyRepository).singleton(),
  snapContinuumProvider: asClass(MockSnapContinuumProvider).singleton(),
  watchlistProvider: asClass(MockWatchlistProvider).singleton(),
  accountabilityProvider: asClass(MockAccountabilityProvider).singleton(),
  communityProvider: asClass(MockCommunityProvider).singleton(),
  knowledgeProvider: asClass(MockKnowledgeProvider).singleton(),
  participationProvider: asClass(MockParticipationProvider).singleton(),
  representativeProvider: asClass(MockRepresentativeProvider).singleton(),
  notificationProvider: asClass(MockNotificationProvider).singleton(),
  settingsProvider: asClass(MockSettingsProvider).singleton(),
  navigationService: asClass(NavigationService).singleton(),
  activityService: asClass(MockActivityService).singleton(),
  pulseService: asClass(SqlitePulseService).singleton(),
  civicIntelligenceService: asClass(CivicIntelligenceService).singleton(),
  fecVoteNormalizer: asClass(FECVoteNormalizer).singleton(),
  telemetryService: asClass(
    (USE_MOCK ? MockTelemetryService : ApiTelemetryService) as any,
  ).singleton(),
  verificationService: asClass(MockVerificationService).singleton(),
  watchlistService: asClass(WatchlistService).singleton(),
  sentimentRepository: asClass(AsyncSentimentRepository).singleton(),
  correlationRepository: asClass(MockCorrelationRepository).singleton(),
  hapticService: asClass(HapticService).singleton(),
  feedEnricher: asClass(FeedEnricher).singleton(),
});

export default container;
