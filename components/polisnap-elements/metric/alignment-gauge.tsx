import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Metric.Alignment.Gauge
 * Visualizes where a representative stands on a spectrum (e.g., District Focus vs. Party Line).
 */
export const AlignmentGaugeMolecule = ({ data }: any) => {
  const { title, value, leftLabel, rightLabel, insight } = data || {};

  // Normalized position (0 to 100)
  const position = Math.min(Math.max(value || 50, 0), 100);

  return (
    <View style={GlobalStyles.gaugeContainer}>
      {title && (
        <ThemedText style={GlobalStyles.gaugeTitle}>{title}</ThemedText>
      )}

      <View style={styles.trackContainer}>
        <View style={styles.track}>
          {/* Midpoint marker */}
          <View style={styles.midpoint} />

          {/* Active Indicator */}
          <View style={[styles.indicator, { left: `${position}%` }]}>
            <View style={styles.indicatorPin} />
          </View>
        </View>

        <View style={styles.labels}>
          <ThemedText style={styles.labelText}>
            {leftLabel || "District"}
          </ThemedText>
          <ThemedText style={styles.labelText}>
            {rightLabel || "Party"}
          </ThemedText>
        </View>
      </View>

      {insight && (
        <View style={styles.insightBox}>
          <ThemedText style={styles.insightText}>{insight}</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    marginBottom: Spacing.md,
  },
  track: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    position: "relative",
    justifyContent: "center",
  },
  midpoint: {
    position: "absolute",
    left: "50%",
    width: 2,
    height: 12,
    backgroundColor: "#CBD5E0",
  },
  indicator: {
    position: "absolute",
    width: 20,
    height: 20,
    marginLeft: -10, // Center the indicator on the point
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorPin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  labelText: {
    fontSize: 11, // Standard metadata size
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textSecondary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  insightBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  insightText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
    lineHeight: 20,
    fontStyle: "italic" as any,
  },
});

ComponentFactory.register("Metric.Alignment.Gauge", ({ value }) => (
  <AlignmentGaugeMolecule data={value} />
));
