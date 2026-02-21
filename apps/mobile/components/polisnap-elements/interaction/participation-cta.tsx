import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { useTelemetry } from "@/hooks/use-telemetry";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Interaction.Participation.CTA
 * A reward-linked call to action for the participation economy.
 */
export const ParticipationCTA = ({ value: data, extraProps }: any) => {
  const { label, actionLabel, creditValue, economyType, actionType } =
    data || {};

  const { hapticService, forensicSignalCoordinator } = useServices();
  const { trackAction } = useTelemetry();

  const handlePress = async () => {
    // 1. Trigger Haptic Feedback
    hapticService?.triggerMediumImpact();

    // 2. Log Action to Telemetry
    await trackAction(extraProps?.snapId || "unknown", "participation_pulse", {
      type: actionType,
      value: creditValue,
      label: label,
    });

    // 3. Log Pulse to Data Service (via Coordinator)
    if (forensicSignalCoordinator) {
      await forensicSignalCoordinator.emitSignal({
        type: "pulse",
        id: extraProps?.snapId || "unknown",
        value: 1.0,
        metadata: {
          pulse_type: actionType || "participation",
          credits_earned: creditValue,
          economy: economyType,
        },
      });
    }

    console.log(
      `[Participation] Participating in ${actionType || "general pulse"} for ${creditValue} credits`,
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          <View style={styles.iconContainer}>
            <Ionicons name="flash" size={16} color="#FFFFFF" />
          </View>
          <View>
            <ThemedText style={styles.label}>
              {label || "Participation Required"}
            </ThemedText>
            <ThemedText style={styles.economy}>
              {economyType || "Sovereignty Credits"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.valueRow}>
            <ThemedText style={styles.value}>+{creditValue || 10}</ThemedText>
            <Ionicons
              name="plus-circle"
              size={10}
              color="#0EA5E9"
              style={{ marginLeft: 2 }}
            />
          </View>
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>
              {actionLabel || "PULSE"}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  economy: {
    fontSize: 10,
    color: "#60A5FA",
    fontWeight: "500",
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0EA5E9",
    fontFamily: Typography.fonts.mono,
  },
  button: {
    backgroundColor: "#1E40AF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});

ComponentFactory.register("Interaction.Participation.CTA", ParticipationCTA);
