import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const NarrativeSentimentSummary = ({
  data,
  presentation,
  extraProps,
}: any) => {
  const { sentiment, summary } = data || {};

  const getSentimentColor = () => {
    if (sentiment === "Positive") return Colors.light.success;
    if (sentiment === "Negative") return Colors.light.danger;
    return Colors.light.textSecondary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Public Sentiment</ThemedText>
        <ThemedText style={[styles.sentiment, { color: getSentimentColor() }]}>
          {sentiment || "Largely Positive"}
        </ThemedText>
      </View>
      <ThemedText style={styles.summary}>
        {summary ||
          "A majority of constituents view the infrastructure bill as a critical investment in the region's future."}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: "bold",
  },
  sentiment: {
    fontSize: Typography.sizes.sm,
    fontWeight: "bold",
  },
  summary: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});

// Register the cohesive element
ComponentFactory.register(
  "Narrative.SentimentSummary",
  ({ value, presentation, extraProps }) => (
    <NarrativeSentimentSummary
      data={value}
      presentation={presentation}
      extraProps={extraProps}
    />
  ),
);
