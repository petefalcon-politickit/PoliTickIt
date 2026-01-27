import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { FeatureGate } from "@/components/ui/feature-gate";
import { ProLogo } from "@/components/ui/pro-logo";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface PredictiveItem {
  id: string;
  name: string;
  probability: number;
  trend: "up" | "down" | "stable";
  category: string;
}

interface PredictiveScoringProps {
  data: {
    title: string;
    items: PredictiveItem[];
  };
}

export const PredictiveScoringMolecule: React.FC<PredictiveScoringProps> = ({
  data,
}) => {
  const { title, items } = data || {};

  const renderContent = () => (
    <View style={GlobalStyles.predictiveScoringContainer}>
      <ThemedText style={GlobalStyles.metricTitle}>{title}</ThemedText>
      <View style={styles.list}>
        {items?.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.infoCol}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemCategory}>
                {item.category}
              </ThemedText>
            </View>
            <View style={styles.scoreCol}>
              <View style={styles.probabilityWrapper}>
                <ThemedText style={styles.probabilityValue}>
                  {item.probability}%
                </ThemedText>
                <Ionicons
                  name={
                    item.trend === "up"
                      ? "trending-up"
                      : item.trend === "down"
                        ? "trending-down"
                        : "remove"
                  }
                  size={14}
                  color={
                    item.trend === "up"
                      ? Colors.light.success
                      : item.trend === "down"
                        ? Colors.light.error
                        : Colors.light.textMuted
                  }
                />
              </View>
              <ThemedText style={styles.oddsLabel}>PASSAGE ODDS</ThemedText>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <ThemedText style={styles.footerSubtext}>
          ML-DRIVEN FORECASTING
        </ThemedText>
        <ProLogo variant="primary" size={12} showText={false} />
      </View>
    </View>
  );

  return <FeatureGate level={4}>{renderContent()}</FeatureGate>;
};

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 90, 213, 0.1)",
  },
  footerSubtext: {
    fontSize: 9,
    fontWeight: Typography.weights.bold as any,
    color: "#6B46C1",
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 90, 213, 0.1)",
  },
  infoCol: {
    flex: 1,
  },
  itemName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold as any,
    color: "#44337A", // Deep Purple
  },
  itemCategory: {
    fontSize: Typography.sizes.xs,
    color: "#6B46C1",
    textTransform: "uppercase" as any,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  scoreCol: {
    alignItems: "flex-end",
  },
  probabilityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  probabilityValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy as any,
    color: "#553C9A",
  },
  oddsLabel: {
    fontSize: 9,
    fontWeight: "900" as any,
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
  },
});

ComponentFactory.register("Metric.Predictive.Scoring", ({ value }) => (
  <PredictiveScoringMolecule data={value} />
));
