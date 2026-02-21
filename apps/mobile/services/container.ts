import { asClass, createContainer, InjectionMode } from "awilix";
import { ApiCorrelationRepository } from "./implementations/ApiCorrelationRepository";
import { ApiParticipationRepository } from "./implementations/ApiParticipationRepository";
import { ApiRepresentativeRepository } from "./implementations/ApiRepresentativeRepository";
import { ApiSnapRepository } from "./implementations/ApiSnapRepository";
import { ApiSyncService } from "./implementations/ApiSyncService";
import { ApiVerificationRepository } from "./implementations/ApiVerificationRepository";
import { AsyncSentimentRepository } from "./implementations/AsyncSentimentRepository";
import { CivicIntelligenceService } from "./implementations/CivicIntelligenceService";
import { DonorOracleService } from "./implementations/DonorOracleService";
import { FECVoteNormalizer } from "./implementations/FECVoteNormalizer";
import { FeedEnricher } from "./implementations/FeedEnricher";
import { ForensicSignalCoordinator } from "./implementations/ForensicSignalCoordinator";
import { HapticService } from "./implementations/HapticService";
import { HybridSnapRepository } from "./implementations/HybridSnapRepository";
import { MockCorrelationRepository } from "./implementations/MockCorrelationRepository";
import { MockSnapRepository } from "./implementations/MockSnapRepository";
import { MockVerificationService } from "./implementations/MockVerificationService";
import { NavigationService } from "./implementations/NavigationService";
import { OmniFeedProvider } from "./implementations/OmniFeedProvider";
import { SqliteAgencyRepository } from "./implementations/SqliteAgencyRepository";
import { SqliteCorrelationRepository } from "./implementations/SqliteCorrelationRepository";
import { SqliteDatabaseService } from "./implementations/SqliteDatabaseService";
import { SqliteParticipationRepository } from "./implementations/SqliteParticipationRepository";
import { SqliteRepresentativeRepository } from "./implementations/SqliteRepresentativeRepository";
import { SqliteSnapRepository } from "./implementations/SqliteSnapRepository";
import { StorageHydrationService } from "./implementations/StorageHydrationService";
import { UserLedgerService } from "./implementations/UserLedgerService";
import { WatchlistService } from "./implementations/WatchlistService";
import { ZkVerificationService } from "./implementations/ZkVerificationService";

import { SqliteCDPProvider } from "./implementations/SqliteCDPProvider";

// Define the schema for the container
export interface IServices {
  databaseService: SqliteDatabaseService;
  userLedgerService: UserLedgerService;
  storageHydrationService: StorageHydrationService;
  snapRepository: any;
  representativeRepository: SqliteRepresentativeRepository;
  correlationRepository: any;
  sqliteCorrelationRepository: SqliteCorrelationRepository;
  apiCorrelationRepository: ApiCorrelationRepository;
  participationRepository: SqliteParticipationRepository;
  sqliteParticipationRepository: SqliteParticipationRepository;
  apiParticipationRepository: ApiParticipationRepository;
  verificationService: any;
  zkVerificationService: ZkVerificationService;
  apiVerificationRepository: ApiVerificationRepository;
  agencyRepository: SqliteAgencyRepository;
  omniFeedProvider: OmniFeedProvider;
  settingsProvider: any;
  cdpProvider: SqliteCDPProvider;
  navigationService: NavigationService;
  forensicSignalCoordinator: ForensicSignalCoordinator;
  civicIntelligenceService: CivicIntelligenceService;
  donorOracleService: DonorOracleService;
  fecVoteNormalizer: FECVoteNormalizer;
  watchlistService: WatchlistService;
  sentimentRepository: AsyncSentimentRepository;
  hapticService: HapticService;
  feedEnricher: FeedEnricher;
  apiSyncService: ApiSyncService;
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

  // Register specific repo implementations for the Hybrid orchestrator
  mockSnapRepository: asClass(MockSnapRepository).singleton(),
  sqliteSnapRepository: asClass(SqliteSnapRepository).singleton(),
  apiSnapRepository: asClass(ApiSnapRepository).singleton(),
  apiRepresentativeRepository: asClass(ApiRepresentativeRepository).singleton(),
  sqliteRepresentativeRepository: asClass(
    SqliteRepresentativeRepository,
  ).singleton(),

  apiCorrelationRepository: asClass(ApiCorrelationRepository).singleton(),
  sqliteCorrelationRepository: asClass(SqliteCorrelationRepository).singleton(),

  apiParticipationRepository: asClass(ApiParticipationRepository).singleton(),
  sqliteParticipationRepository: asClass(
    SqliteParticipationRepository,
  ).singleton(),

  apiVerificationRepository: asClass(ApiVerificationRepository).singleton(),
  zkVerificationService: asClass(ZkVerificationService).singleton(),
  sqliteCDPProvider: asClass(SqliteCDPProvider).singleton(),

  // The primary snapRepository used by the app is now the Hybrid one
  snapRepository: asClass(HybridSnapRepository).singleton(),

  representativeRepository: asClass(SqliteRepresentativeRepository).singleton(),
  correlationRepository: USE_MOCK
    ? asClass(MockCorrelationRepository).singleton()
    : asClass(SqliteCorrelationRepository).singleton(),
  participationRepository: asClass(SqliteParticipationRepository).singleton(),
  verificationService: USE_MOCK
    ? asClass(MockVerificationService).singleton()
    : asClass(ZkVerificationService).singleton(),
  agencyRepository: asClass(SqliteAgencyRepository).singleton(),
  omniFeedProvider: asClass(OmniFeedProvider).singleton(),
  settingsProvider: asClass(SqliteCDPProvider).singleton(),
  cdpProvider: asClass(SqliteCDPProvider).singleton(),
  navigationService: asClass(NavigationService).singleton(),
  forensicSignalCoordinator: asClass(ForensicSignalCoordinator).singleton(),
  civicIntelligenceService: asClass(CivicIntelligenceService).singleton(),
  donorOracleService: asClass(DonorOracleService).singleton(),
  fecVoteNormalizer: asClass(FECVoteNormalizer).singleton(),
  watchlistService: asClass(WatchlistService).singleton(),
  sentimentRepository: asClass(AsyncSentimentRepository).singleton(),
  hapticService: asClass(HapticService).singleton(),
  feedEnricher: asClass(FeedEnricher).singleton(),
  apiSyncService: asClass(ApiSyncService).singleton(),
});

export default container;
