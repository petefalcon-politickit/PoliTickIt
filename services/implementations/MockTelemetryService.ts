import AsyncStorage from "@react-native-async-storage/async-storage";
import { IHapticService } from "../interfaces/IHapticService";
import { ITelemetryService } from "../interfaces/ITelemetryService";

const CREDITS_STORAGE_KEY = "@PoliTickIt:ParticipationCredits";

/**
 * MockTelemetryService
 * A UI-tier mock for telemetry that provides haptic feedback and logs to console.
 * Persists credits locally to support the "Intelligence Earned" meritocracy.
 */
export class MockTelemetryService implements ITelemetryService {
  private credits: number = 425; // Default fallback
  private listeners: ((credits: number) => void)[] = [];
  private hapticService: IHapticService;

  constructor(opts: { hapticService: IHapticService }) {
    this.hapticService = opts.hapticService;
    this.init();
  }

  private async init() {
    try {
      const savedCredits = await AsyncStorage.getItem(CREDITS_STORAGE_KEY);
      if (savedCredits !== null) {
        this.credits = parseInt(savedCredits, 10);
        this.notify();
      }
    } catch (e) {
      console.error("Failed to load credits from storage:", e);
    }
  }

  private async save() {
    try {
      await AsyncStorage.setItem(CREDITS_STORAGE_KEY, this.credits.toString());
    } catch (e) {
      console.error("Failed to save credits to storage:", e);
    }
  }

  private notify() {
    this.listeners.forEach((l) => l(this.credits));
  }

  async trackSentiment(
    snapId: string,
    elementId: string,
    value: number,
  ): Promise<boolean> {
    const payload = {
      type: "sentiment",
      snapId,
      elementId,
      value: value.toFixed(2),
      timestamp: new Date().toISOString(),
    };

    console.log("[TELEMETRY] Sent:", JSON.stringify(payload, null, 2));

    // Increment credits: User "earns" by participating
    this.credits += 25;
    this.notify();
    await this.save();

    // Provide tactile confirmation - Democratic Win (Success)
    await this.hapticService.triggerSuccess();

    return true;
  }

  async trackAction(
    snapId: string,
    actionType: string,
    metadata?: any,
  ): Promise<boolean> {
    const payload = {
      type: "action",
      snapId,
      action: actionType,
      metadata,
      timestamp: new Date().toISOString(),
    };

    console.log("[TELEMETRY] Sent:", JSON.stringify(payload, null, 2));

    // Higher reward for discrete actions
    this.credits += 100;
    this.notify();
    await this.save();

    // Provide tactile confirmation - Primary Action (Medium)
    await this.hapticService.triggerMediumImpact();

    return true;
  }

  async getContributionCredits(): Promise<number> {
    return this.credits;
  }

  onCreditsUpdated(callback: (credits: number) => void): void {
    this.listeners.push(callback);
    // Trigger immediate call with current value
    callback(this.credits);
  }
}
