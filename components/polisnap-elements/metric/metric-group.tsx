import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Metric.Group (Unified Metric Component)
 *
 * Consolidates Dual Comparison, Triple Column, and Economic Highlights into a
 * single meta-driven component that adapts to the number of items.
 */
export const MetricGroup = ({ data, containerStyle, titleStyle }: any) => {
  const {
    title,
    items, // Primary collection format: [{ label, value, subtext, unit, color }]
    metrics, // Alternative: used by Triple Column
    left,
    right, // Alternative: used by Dual Comparison
    leftEntity,
    rightEntity, // Alternative: used by Action Timeline
    primary,
    secondary, // Alternative: used by Economic Highlight
  } = data || {};

  // 1. Normalize items into a standard array
  let normalizedItems: any[] = [];

  if (Array.isArray(items)) {
    normalizedItems = items;
  } else if (Array.isArray(metrics)) {
    normalizedItems = metrics;
  } else {
    // Check for pairs
    const item1 = left || leftEntity || primary;
    const item2 = right || rightEntity || secondary;

    if (item1) normalizedItems.push(item1);
    if (item2) normalizedItems.push(item2);
  }

  if (normalizedItems.length === 0 && !title) return null;

  return (
    <View style={containerStyle || GlobalStyles.metricGroupContainer}>
      {title && (
        <ThemedText style={titleStyle || GlobalStyles.metricGroupTitle}>
          {title}
        </ThemedText>
      )}

      <View style={styles.row}>
        {normalizedItems.map((item, index) => {
          // Resolve labels and values based on different schema possibilities
          const label = item?.name || item?.label || "Metric";
          const value = item?.value ?? item?.val ?? item?.amount ?? "-";
          const subtext =
            item?.name && item?.label ? item.label : item?.subtext;
          const unit = item?.unit;
          const color = item?.color || Colors.light.primary;

          return (
            <React.Fragment key={index}>
              <View style={styles.column}>
                <ThemedText style={GlobalStyles.metricLabel}>
                  {label}
                </ThemedText>

                <View style={styles.valueRow}>
                  <ThemedText style={[GlobalStyles.metricValue, { color }]}>
                    {value}
                  </ThemedText>
                  {unit && <ThemedText style={styles.unit}>{unit}</ThemedText>}
                </View>

                {subtext && (
                  <ThemedText style={GlobalStyles.metricSubtext}>
                    {subtext}
                  </ThemedText>
                )}
              </View>

              {/* Add vertical divider between columns */}
              {index < normalizedItems.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start", // Top align items to prevent wrapping labels from pushing others down
    justifyContent: "space-around",
  },
  column: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  divider: {
    width: 1,
    height: "100%",
    minHeight: 32,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  unit: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textTertiary,
    marginLeft: 2,
    fontWeight: Typography.weights.medium as any,
  },
});

// Register all variations to use this unified component
const registerMetric = (alias: string) => {
  ComponentFactory.register(alias, ({ value }) => <MetricGroup data={value} />);
};

registerMetric("Metric.Group");
registerMetric("Metric.Column.Triple");
registerMetric("Metric.Dual.Highlight");
registerMetric("Metric.Comparison.Horizontal");
registerMetric("Metric.TwoCol.Comparison"); // Legacy alias found in economic-metrics.tsx

// Special Registration for Severed Comparison style
ComponentFactory.register("Metric.Dual.Comparison", ({ value }) => (
  <MetricGroup
    data={value}
    containerStyle={GlobalStyles.dualComparisonContainer}
    titleStyle={GlobalStyles.dualComparisonTitle}
  />
));
