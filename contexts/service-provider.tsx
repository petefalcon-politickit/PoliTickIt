import React, { createContext, useContext } from "react";
import container from "../services/container";
import { INavigationService } from "../services/interfaces/INavigationService";
import { IPoliSnapRepository } from "../services/interfaces/IPoliSnapRepository";
import { ITelemetryService } from "../services/interfaces/ITelemetryService";
import { IWatchlistService } from "../services/interfaces/IWatchlistService";

interface ServiceContextType {
  poliSnapRepository: IPoliSnapRepository;
  telemetryService: ITelemetryService;
  watchlistService: IWatchlistService;
  navigationService: INavigationService;
  sentimentRepository: any;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Resolve services from the container
  const services: ServiceContextType = {
    poliSnapRepository: container.resolve("poliSnapRepository"),
    telemetryService: container.resolve("telemetryService"),
    watchlistService: container.resolve("watchlistService"),
    navigationService: container.resolve("navigationService"),
    sentimentRepository: container.resolve("sentimentRepository"),
  };

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
