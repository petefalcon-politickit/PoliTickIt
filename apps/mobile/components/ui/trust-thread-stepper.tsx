import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

interface TrustThreadStepperProps {
  currentLevel: 1 | 2 | 3;
}

/**
 * TrustThreadStepper
 * Visualizes the "1-2-3 Punch" of the PoliTickIt Trust Thread™:
 * 1. ACCOUNTABILITY (High-level ROI/Grade)
 * 2. NARRATIVE (Contextual debate/summary)
 * 3. POLIPROOF™ (Verified individual evidence)
 */
export const TrustThreadStepper: React.FC<TrustThreadStepperProps> = ({
  currentLevel,
}) => {
  const steps = [
    { label: "ACCOUNTABILITY", id: 1, icon: "analytics-outline" as const },
    { label: "NARRATIVE", id: 2, icon: "document-text-outline" as const },
    { label: "POLIPROOF™", id: 3, icon: "shield-checkmark-outline" as const },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepperRow}>
        {steps.map((step, index) => {
          const isActive = step.id === currentLevel;
          const isCompleted = step.id < currentLevel;

          return (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.circleContainer}>
                {/* Connector Line (Behind) */}
                {index > 0 && (
                  <View
                    style={[
                      styles.connector,
                      isCompleted && styles.connectorActive,
                    ]}
                  />
                )}
                {/* Connector Line (Forward) */}
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.connector,
                      { left: "50%", right: 0 },
                      currentLevel > step.id && styles.connectorActive,
                    ]}
                  />
                )}

                <View
                  style={[
                    styles.circle,
                    isActive && styles.circleActive,
                    isCompleted && styles.circleCompleted,
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={12}
                    color={
                      isActive
                        ? "#FFFFFF"
                        : isCompleted
                          ? Colors.light.primary
                          : Colors.light.textTertiary
                    }
                  />
                </View>
              </View>
              <ThemedText
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  isCompleted && styles.stepLabelCompleted,
                ]}
              >
                {step.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs + 5, // Increased by 5px per user request
    paddingBottom: Spacing.xs,
    backgroundColor: "rgba(22, 69, 112, 0.03)", // Subtle primary tint
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    minHeight: 65,
    justifyContent: "center",
  },
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  circleContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.backgroundSecondary,
    zIndex: 2,
  },
  circleActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  circleCompleted: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  stepNumber: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  stepNumberActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  stepNumberCompleted: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  connector: {
    height: 1,
    backgroundColor: Colors.light.border,
    position: "absolute",
    left: 0,
    right: "50%",
    zIndex: 1,
  },
  connectorActive: {
    backgroundColor: Colors.light.primary,
  },
  stepLabel: {
    fontSize: 9, // Increased from 8
    fontFamily: Typography.fonts?.mono,
    color: Colors.light.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  stepLabelActive: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
  },
  stepLabelCompleted: {
    color: Colors.light.textSecondary,
  },
});
