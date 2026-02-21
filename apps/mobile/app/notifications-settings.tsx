import PoliTickItHeader from "@/components/navigation/header";
import { ToggleListItem } from "@/components/settings/toggle-list-item";
import { ThemedText } from "@/components/themed-text";
import { MultiToggle } from "@/components/ui/multi-toggle";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function NotificationsSettingsScreen() {
  const { intensitySettings, updateIntensitySettings, counts } = useActivity();
  const { hapticService } = useServices();

  const thresholdOptions = [
    { label: "RAW", value: "0" },
    { label: "LOW", value: "30" },
    { label: "MED", value: "60" },
    { label: "ENG", value: "75" },
    { label: "CRT", value: "90" },
  ];

  const handleThresholdChange = async (value: string) => {
    hapticService.triggerLightImpact();
    await updateIntensitySettings({ threshold: parseInt(value, 10) });
  };

  const handleToggleEnable = async (id: string, enabled: boolean) => {
    hapticService.triggerMediumImpact();
    await updateIntensitySettings({ isEnabled: enabled });
  };

  const handleAreaToggle = async (id: string, enabled: boolean) => {
    hapticService.triggerLightImpact();
    await updateIntensitySettings({
      areas: { [id]: enabled } as any,
    });
  };

  // Calculate "Signal Impact" - how many notifications are being filtered
  const totalRaw = 431; // Sum of base counts in MockActivityService
  const filteredSum = useMemo(() => {
    return (
      counts.accountability +
      counts.community +
      counts.knowledge +
      counts.representative +
      counts.watchlist
    );
  }, [counts]);

  const reductionPercent = Math.round(
    ((totalRaw - filteredSum) / totalRaw) * 100,
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <PoliTickItHeader title="Intelligence Gating" />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            SYSTEM: INTENSITY GATEWAY
          </ThemedText>
          <View style={styles.card}>
            <ToggleListItem
              id="master-switch"
              name="Enable Intensity Gating"
              description="Filter Low-Signal Updates To Reduce Notification Fatigue."
              isSelected={intensitySettings.isEnabled}
              onToggle={handleToggleEnable}
            />
          </View>
        </View>

        {intensitySettings.isEnabled && (
          <>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                SIGNAL INTENSITY CALIBRATION
              </ThemedText>
              <View style={[styles.card, { padding: Spacing.lg }]}>
                <ThemedText style={styles.label}>
                  Significance Requirement
                </ThemedText>
                <MultiToggle
                  options={thresholdOptions}
                  currentValue={intensitySettings.threshold.toString()}
                  onChange={handleThresholdChange}
                  style={styles.thresholdToggle}
                />
                <View style={styles.previewBox}>
                  <ThemedText style={styles.previewText}>
                    Impact:{" "}
                    <ThemedText
                      style={{
                        color: Colors.light.accent,
                        fontFamily: Typography.fonts.mono,
                        fontWeight: "700",
                      }}
                    >
                      {reductionPercent}%
                    </ThemedText>{" "}
                    Noise Reduction
                  </ThemedText>
                  <ThemedText style={styles.previewSubtext}>
                    Status: {filteredSum}/{totalRaw} Signals Passed
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                DOMAIN SPECIFIC GATING (SIG-REQ)
              </ThemedText>
              <View style={styles.card}>
                <ToggleListItem
                  id="accountability"
                  name="Accountability Alerts"
                  description="Only Show Scores With Significant Drifts."
                  isSelected={intensitySettings.areas.accountability}
                  onToggle={handleAreaToggle}
                />
                <ToggleListItem
                  id="watchlist"
                  name="Watchlist Updates"
                  description="Focus On High-Significance Bill Movements."
                  isSelected={intensitySettings.areas.watchlist}
                  onToggle={handleAreaToggle}
                />
                <ToggleListItem
                  id="community"
                  name="Community Activity"
                  description="Filter For High-Velocity Discussions."
                  isSelected={intensitySettings.areas.community}
                  onToggle={handleAreaToggle}
                />
                <ToggleListItem
                  id="knowledge"
                  name="Knowledge Baseline"
                  description="Filter Routine Educational Briefing Updates."
                  isSelected={intensitySettings.areas.knowledge}
                  onToggle={handleAreaToggle}
                />
                <ToggleListItem
                  id="representative"
                  name="Representative Feed"
                  description="Suppress Routine Congressional Status Updates."
                  isSelected={intensitySettings.areas.representative}
                  onToggle={handleAreaToggle}
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Intelligence Gating Uses The Signal Intensity™ Algorithm To Protect
            Your Attention While Ensuring Critical Legislative Events Are Never
            Missed.
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.heavy,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textTertiary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  label: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  thresholdToggle: {
    marginBottom: Spacing.lg,
  },
  previewBox: {
    backgroundColor: "#F1F5F9",
    padding: Spacing.md,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: "dashed",
    alignItems: "center",
  },
  previewText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  previewSubtext: {
    fontSize: 12,
    color: Colors.light.textGray,
    marginTop: 4,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: 60,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.textMuted,
    lineHeight: 18,
    textAlign: "center",
  },
});
