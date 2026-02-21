import * as Haptics from "expo-haptics";
import { IHapticService } from "../interfaces/IHapticService";

/**
 * HapticService
 * Categorizes haptic patterns into "Democratic Wins" (Success) and "Accountability Warnings" (Alerts)
 * to enhance physical brand immersion.
 */
export class HapticService implements IHapticService {
  async triggerSuccess(): Promise<void> {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async triggerWarning(): Promise<void> {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  async triggerLightImpact(): Promise<void> {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async triggerMediumImpact(): Promise<void> {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  async triggerHeavyImpact(): Promise<void> {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  async triggerSelection(): Promise<void> {
    await Haptics.selectionAsync();
  }
}
