import { ActivityProvider } from "@/contexts/activity-context";
import { DrawerProvider } from "@/contexts/drawer-context";
import { ServiceProvider } from "@/contexts/service-provider";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import VoterVerificationScreen from "../app/settings-voter-verification";

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock safe area insets
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, left: 0, right: 0, bottom: 0 }),
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <ServiceProvider>
      <ActivityProvider>
        <DrawerProvider>{children}</DrawerProvider>
      </ActivityProvider>
    </ServiceProvider>
  </SafeAreaProvider>
);

describe("Voter Verification Flow (ZK-Handshake)", () => {
  test("Transition from Unverified to Verified after ZK-Handshake", async () => {
    const { getByText, queryByText, findByText } = render(
      <MockWrapper>
        <VoterVerificationScreen />
      </MockWrapper>,
    );

    // 1. Initial State
    expect(await findByText("IDENTITY UNVERIFIED")).toBeTruthy();
    const verifyButton = getByText("INITIALIZE ZK-HANDSHAKE");
    expect(verifyButton).toBeTruthy();

    // 2. Action Trigger
    fireEvent.press(verifyButton);

    // 3. Success State Transition (Wait for mock service timeouts)
    // The MockService has ~2000ms total timeout
    await waitFor(() => expect(getByText("IDENTITY SECURED")).toBeTruthy(), {
      timeout: 5000,
    });

    // 4. Persistence of Attestation Details
    expect(getByText("ATTESTATION DETAILS")).toBeTruthy();
    expect(getByText(/VERIFICATION HASH/)).toBeTruthy();

    // 5. Button De-proliferation (Button should be gone)
    expect(queryByText("INITIALIZE ZK-HANDSHAKE")).toBeNull();
  });
});
