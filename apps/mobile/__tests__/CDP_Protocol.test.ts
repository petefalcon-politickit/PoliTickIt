import * as SQLite from "expo-sqlite";
import { SqliteCDPProvider } from "../services/implementations/SqliteCDPProvider";
import { SqliteDatabaseService } from "../services/implementations/SqliteDatabaseService";

// Mock expo-sqlite
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn().mockResolvedValue({
    execAsync: jest.fn().mockResolvedValue(undefined),
    runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    getAllAsync: jest.fn().mockResolvedValue([]),
    withTransactionAsync: jest.fn(async (cb) => await cb()),
  }),
}));

describe("CDP Protocol (Constituent Data Protocol)", () => {
  let dbService: SqliteDatabaseService;
  let cdpProvider: SqliteCDPProvider;
  let mockDb: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    dbService = new SqliteDatabaseService();
    await dbService.initialize();
    mockDb = await SQLite.openDatabaseAsync("politickit.db");
    cdpProvider = new SqliteCDPProvider({ databaseService: dbService } as any);
  });

  it("should initialize default profile if none exists", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]); // No profile in DB

    const profile = await cdpProvider.getProfile();

    expect(profile).toBeDefined();
    expect(profile.notificationLevel).toBe("medium");
    expect(profile.trackedAgencies).toEqual([]);
    expect(profile.interests).toEqual([]);
  });

  it("should persist and retrieve profile updates", async () => {
    const existingProfile = {
      id: 1,
      district_id: "CA-12",
      state_code: "CA",
      notification_level: "high",
      agencies_json: JSON.stringify(["agency-1"]),
      interests_json: JSON.stringify(["interest-1"]),
      biometry_enabled: 0,
      updated_at: "2023-01-01T00:00:00Z",
    };

    mockDb.getAllAsync.mockResolvedValueOnce([existingProfile]);

    const profile = await cdpProvider.getProfile();
    expect(profile.districtId).toBe("CA-12");
    expect(profile.trackedAgencies).toContain("agency-1");

    // Update profile
    await cdpProvider.updateProfile({ districtId: "CA-13" });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE constituent_profile SET"),
      expect.arrayContaining(["CA-13"]),
    );
  });

  it("should handle global preferences as ISettingsProvider", async () => {
    const existingProfile = {
      id: 1,
      notification_level: "medium",
      agencies_json: "[]",
      interests_json: "[]",
      biometry_enabled: 0,
    };

    mockDb.getAllAsync.mockResolvedValue([existingProfile]);

    // Set preference
    await cdpProvider.updateGlobalPreference("notificationLevel", "high");

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE constituent_profile SET"),
      expect.arrayContaining(["high"]),
    );
  });

  it("should toggle agency tracking sovereignly", async () => {
    const existingProfile = {
      id: 1,
      agencies_json: JSON.stringify(["agency-1"]),
      interests_json: "[]",
      notification_level: "medium",
    };

    mockDb.getAllAsync.mockResolvedValue([existingProfile]);

    // Toggle off agency-1
    await cdpProvider.toggleTracking("agency", "agency-1");

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE constituent_profile SET"),
      expect.arrayContaining([JSON.stringify([])]),
    );
  });
});
