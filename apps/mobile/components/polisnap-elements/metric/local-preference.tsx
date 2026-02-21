import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { CollectiveSignalLogo } from "@/components/ui/collective-signal-logo";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface LocalMetric {
  label: string;
  value: string | number;
  suffix?: string;
  subLabel?: string;
}

interface LocalPreferenceProps {
  data: {
    title: string;
    metrics: LocalMetric[];
  };
}

export const LocalPreferenceMolecule: React.FC<LocalPreferenceProps> = ({
  data,
}) => {
  const { title, metrics } = data || {};

  return (
    <View style={GlobalStyles.localPreferenceContainer}>
      <ThemedText style={GlobalStyles.metricCardTitleLeft}>{title}</ThemedText>
      <View style={styles.grid}>
        {metrics?.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <View style={styles.valueRow}>
              <ThemedText style={styles.valueText}>{metric.value}</ThemedText>
              {metric.suffix && (
                <ThemedText style={styles.suffixText}>
                  {metric.suffix}
                </ThemedText>
              )}
            </View>
            <ThemedText style={styles.labelText}>{metric.label}</ThemedText>
            {metric.subLabel && (
              <ThemedText style={styles.subLabelText}>
                {metric.subLabel}
              </ThemedText>
            )}
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <ThemedText style={styles.footerSubtext}>
          DISTRICT IMPACT DATA
        </ThemedText>
        <CollectiveSignalLogo variant="primary" size={12} showText={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(56, 161, 105, 0.1)",
  },
  footerSubtext: {
    fontSize: 9,
    fontWeight: Typography.weights.bold as any,
    color: "#38A169",
    letterSpacing: 0.5,
  },
  metricItem: {
    flexBasis: "47%",
    padding: Spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(56, 161, 105, 0.1)",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  valueText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy as any,
    color: "#276749", // Deep Green
  },
  suffixText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold as any,
    color: "#38A169",
  },
  labelText: {
    fontSize: 10,
    fontWeight: "800" as any,
    color: Colors.light.textSecondary,
    textTransform: "uppercase" as any,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  subLabelText: {
    fontSize: 9,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
});

ComponentFactory.register("Metric.Local.Preference", ({ value }) => (
  <LocalPreferenceMolecule data={value} />
));
