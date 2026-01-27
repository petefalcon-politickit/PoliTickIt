import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Metric.Progress.Stepper
 * Visualizes stages of a process (e.g., Legislative path from Bill to Law).
 */
export const ProgressStepperMolecule = ({ data }: any) => {
  const { title, stages, currentStageIndex } = data || {};
  if (!stages) return null;

  return (
    <View style={GlobalStyles.stepperContainer}>
      {title && (
        <ThemedText style={GlobalStyles.stepperTitle}>{title}</ThemedText>
      )}

      <View style={styles.stepperRow}>
        {stages.map((stage: any, index: number) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <View key={index} style={styles.stageContainer}>
              <View style={styles.nodeWrapper}>
                {/* Line Connectors */}
                {index !== 0 && (
                  <View
                    style={[
                      styles.connector,
                      isCompleted && styles.connectorActive,
                    ]}
                  />
                )}

                {/* Circle Node */}
                <View
                  style={[
                    styles.node,
                    isCompleted && styles.nodeActive,
                    isCurrent && styles.nodeCurrent,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  ) : (
                    <ThemedText
                      style={[
                        styles.nodeText,
                        isCurrent && styles.nodeTextCurrent,
                      ]}
                    >
                      {index + 1}
                    </ThemedText>
                  )}
                </View>
              </View>
              <ThemedText
                style={[
                  styles.stageLabel,
                  (isCurrent || isCompleted) && styles.stageLabelActive,
                ]}
              >
                {stage.label}
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
    paddingVertical: Spacing.xs,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  stageContainer: {
    flex: 1,
    alignItems: "center",
  },
  nodeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  connector: {
    position: "absolute",
    right: "50%",
    width: "100%",
    height: 2,
    backgroundColor: "#E2E8F0",
    zIndex: -1,
  },
  connectorActive: {
    backgroundColor: Colors.light.secondary,
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  nodeActive: {
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.secondary,
  },
  nodeCurrent: {
    borderColor: Colors.light.primary,
    borderWidth: 3,
  },
  nodeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "700",
    color: Colors.light.textGray,
  },
  nodeTextCurrent: {
    color: Colors.light.primary,
  },
  stageLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.textGray,
    textAlign: "center",
    fontWeight: "500",
  },
  stageLabelActive: {
    color: Colors.light.textSlate,
    fontWeight: "700",
  },
});

ComponentFactory.register("Metric.Progress.Stepper", ({ value }) => (
  <ProgressStepperMolecule data={value} />
));
