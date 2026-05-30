import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const MetricDistrictFunding = ({
  data,
  presentation,
  extraProps,
}: any) => {
  const { amount, district } = data || {};

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>
        Projected Funding for {district || "Your District"}
      </ThemedText>
      <ThemedText style={styles.amount}>${amount || "1.2B"}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    marginVertical: Spacing.sm,
    alignItems: "center",
  },
  title: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginTop: Spacing.xs,
  },
});

// Register the cohesive element
ComponentFactory.register(
  "Metric.DistrictFunding",
  ({ value, presentation, extraProps }) => (
    <MetricDistrictFunding
      data={value}
      presentation={presentation}
      extraProps={extraProps}
    />
  ),
);
