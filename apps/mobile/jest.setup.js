import "@testing-library/jest-native/extend-expect";

// Mock Expo Haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock Expo SQLite
jest.mock("expo-sqlite", () => {
  const mockDb = {
    execAsync: jest.fn().mockResolvedValue([]),
    prepareAsync: jest.fn().mockResolvedValue({
      executeAsync: jest.fn().mockResolvedValue({ getAllAsync: () => [] }),
      finalizeAsync: jest.fn(),
    }),
    runAsync: jest.fn().mockResolvedValue({}),
    getFirstAsync: jest.fn().mockResolvedValue({ user_version: 100 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
    withTransactionAsync: jest.fn(async (callback) => await callback()),
    closeAsync: jest.fn().mockResolvedValue(null),
    execute: jest.fn().mockResolvedValue([]), // Fallback for any legacy calls
  };
  return {
    openDatabaseAsync: jest.fn().mockResolvedValue(mockDb),
    useSQLiteContext: jest.fn(() => mockDb),
    SQLiteProvider: ({ children }) => children,
  };
});

// Mock Expo Symbols/Icons if needed
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock Reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock ApiSyncService to prevent background noise during tests
jest.mock("./services/implementations/ApiSyncService", () => {
  return {
    ApiSyncService: jest.fn().mockImplementation(() => ({
      syncWithBackend: jest.fn().mockResolvedValue({ success: true, count: 0 }),
    })),
  };
});

// Mock StorageHydrationService
jest.mock("./services/implementations/StorageHydrationService", () => {
  return {
    StorageHydrationService: jest.fn().mockImplementation(() => ({
      hydrateIfNeeded: jest.fn().mockResolvedValue(true),
    })),
  };
});

// Mock Gesture Handler
jest.mock("react-native-gesture-handler", () => {
  return {
    Gesture: {
      Pan: () => ({
        onUpdate: () => ({
          onEnd: () => ({}),
        }),
      }),
      Tap: () => ({
        onEnd: () => ({}),
      }),
    },
    GestureDetector: ({ children }) => children,
    GestureHandlerRootView: ({ children }) => children,
  };
});

// Add missing globals for Expo 51+ / React 19 test environment
global.__DEV__ = true;
if (typeof global.__ExpoImportMetaRegistry === "undefined") {
  global.__ExpoImportMetaRegistry = new Map();
}

// Polyfill structuredClone if missing or being intercepted by winter
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}
