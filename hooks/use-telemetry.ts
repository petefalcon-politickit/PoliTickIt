import { useServices } from "@/contexts/service-provider";
import { useCallback } from "react";

/**
 * useTelemetry
 * A hook for capturing interactive metadata and "Quantum Feedback" events.
 * Bridges the gap between stateless molecules and the backend telemetry service.
 */
export const useTelemetry = () => {
  const { telemetryService } = useServices();

  /**
   * trackSentiment
   * Captures spectrum-based sentiment values (0.0 to 1.0).
   */
  const trackSentiment = useCallback(
    async (snapId: string, elementId: string, value: number) => {
      return await telemetryService.trackSentiment(snapId, elementId, value);
    },
    [telemetryService],
  );

  /**
   * trackAction
   * Tracks discrete actions like "Watchlist Add" or "Contact Rep".
   */
  const trackAction = useCallback(
    async (snapId: string, actionType: string, metadata?: any) => {
      return await telemetryService.trackAction(snapId, actionType, metadata);
    },
    [telemetryService],
  );

  return {
    trackSentiment,
    trackAction,
  };
};
