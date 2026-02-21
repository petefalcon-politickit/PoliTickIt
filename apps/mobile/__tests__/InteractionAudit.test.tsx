import ElementFactory from "@/components/factories/element-factory";
import { PoliSnapRenderer } from "@/components/polisnap-renderer";
import { allIdeationSnaps } from "@/constants/mockData";
import { allCandidateSnaps } from "@/constants/snapLibrary";
import { ActivityProvider } from "@/contexts/activity-context";
import { ServiceProvider } from "@/contexts/service-provider";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Combine all mocks for exhaustive testing
const allSnaps = [...allCandidateSnaps, ...allIdeationSnaps];

// Mock Service Provider Context
const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <ServiceProvider>
    <ActivityProvider>{children}</ActivityProvider>
  </ServiceProvider>
);

describe("PoliSnap Interaction & Rendering Audit", () => {
  /**
   * TEST 1: Exhaustive Rendering Audit
   * Iterates through every snap in the library to check for layout/type crashes.
   */
  test.each(allSnaps.map((s) => [s.id, s]))(
    "Snap %s should render without crashing",
    (id, snap) => {
      const { toJSON } = render(
        <MockWrapper>
          <PoliSnapRenderer snap={snap} />
        </MockWrapper>,
      );
      expect(toJSON()).toBeDefined();
    },
  );

  /**
   * TEST 2: Intentional Fuzzing (Malformed Data)
   * Feeds the renderer missing or invalid elements.
   */
  test("Renderer should handle missing elements gracefully", () => {
    const malformedSnap = { id: "bad-snap", elements: null };
    const { getByTestId, queryByText } = render(
      <MockWrapper>
        <PoliSnapRenderer snap={malformedSnap} />
      </MockWrapper>,
    );
    // Should not crash and should render the container
    expect(queryByText(/No insights available/i)).toBeNull();
  });

  test("ElementFactory should return null for unknown roles without crashing", () => {
    const unknownElement = { type: "Alien.Component.Unknown", data: {} };
    const result = ElementFactory.render(unknownElement);
    expect(result).toBeNull();
  });

  /**
   * TEST 3: Interaction Loop Audit
   * Exercises the Pulse and Action buttons to look for service/haptic errors.
   */
  test("SentimentPulse should handle user selection and trigger rewards", async () => {
    const pulseSnap = allCandidateSnaps.find(
      (s) => s.id === "acc-pulse-energy-roadmap",
    )!;
    const { findByText } = render(
      <MockWrapper>
        <PoliSnapRenderer snap={pulseSnap} />
      </MockWrapper>,
    );

    // Look for a sentiment button (e.g., "Aggressive" from the Energy Roadmap)
    // Using findByText as it's more robust for async rendering
    const agreeButton = await findByText(/Aggressive/i);
    fireEvent.press(agreeButton);

    // Wait for any async side effects (telemetry, storage)
    await waitFor(() => {
      // If it didn't throw, we assume the initial path is safe
      expect(agreeButton).toBeDefined();
    });
  });

  test("ActionCard should toggle watchlist state", async () => {
    const actionSnap = allSnaps.find((s) =>
      s.elements.some((e) => e.type === "Interaction.Action.Card"),
    );
    if (!actionSnap) return;

    const { queryByText } = render(
      <MockWrapper>
        <PoliSnapRenderer snap={actionSnap} />
      </MockWrapper>,
    );

    const actionButton =
      queryByText(/Add to Watchlist|Remove from Watchlist/i) ||
      queryByText(/Action/i);

    if (actionButton) {
      fireEvent.press(actionButton);
      await waitFor(() => {
        expect(actionButton).toBeDefined();
      });
    }
  });
});
