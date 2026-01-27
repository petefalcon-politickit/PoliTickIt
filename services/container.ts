import { asClass, createContainer, InjectionMode } from "awilix";
import { ApiPoliSnapRepository } from "./implementations/ApiPoliSnapRepository";
import { AsyncSentimentRepository } from "./implementations/AsyncSentimentRepository";
import { FECVoteNormalizer } from "./implementations/FECVoteNormalizer";
import { HapticService } from "./implementations/HapticService";
import { MockAINarrativeService } from "./implementations/MockAINarrativeService";
import { MockCorrelationRepository } from "./implementations/MockCorrelationRepository";
import { MockPoliSnapRepository } from "./implementations/MockPoliSnapRepository";
import { MockTelemetryService } from "./implementations/MockTelemetryService";
import { NavigationService } from "./implementations/NavigationService";
import { WatchlistService } from "./implementations/WatchlistService";

// Define the schema for the container
export interface IServices {
  poliSnapRepository: any;
  navigationService: NavigationService;
  aiNarrativeService: MockAINarrativeService;
  fecVoteNormalizer: FECVoteNormalizer;
  telemetryService: MockTelemetryService;
  watchlistService: WatchlistService;
  sentimentRepository: AsyncSentimentRepository;
  correlationRepository: MockCorrelationRepository;
  hapticService: HapticService;
}

const container = createContainer<IServices>({
  injectionMode: InjectionMode.PROXY,
});

// Switch this flag to toggle between Mock and API
const USE_MOCK = true;

container.register({
  poliSnapRepository: asClass(
    (USE_MOCK ? MockPoliSnapRepository : ApiPoliSnapRepository) as any,
  ).singleton(),
  navigationService: asClass(NavigationService).singleton(),
  aiNarrativeService: asClass(MockAINarrativeService).singleton(),
  fecVoteNormalizer: asClass(FECVoteNormalizer).singleton(),
  telemetryService: asClass(MockTelemetryService).singleton(),
  watchlistService: asClass(WatchlistService).singleton(),
  sentimentRepository: asClass(AsyncSentimentRepository).singleton(),
  correlationRepository: asClass(MockCorrelationRepository).singleton(),
  hapticService: asClass(HapticService).singleton(),
});

export default container;
