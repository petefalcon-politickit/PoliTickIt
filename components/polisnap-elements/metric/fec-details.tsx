import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const FECContributionBlock = ({ data }: any) => {
  const { title, totalAmount, pacs, corporateTrace } = data || {};

  return (
    <View style={GlobalStyles.groupedGridContainer}>
      <ThemedText style={GlobalStyles.metricCardTitleLeft}>
        {title || "Campaign Finance"}
      </ThemedText>
      <View style={styles.amountRow}>
        <ThemedText style={styles.amountLabel}>Total Raised</ThemedText>
        <ThemedText style={styles.amountValue}>
          ${totalAmount?.toLocaleString() || "0"}
        </ThemedText>
      </View>

      {pacs && (
        <View style={styles.section}>
          <ThemedText style={GlobalStyles.metricCardTitleLeft}>
            Top PAC Contributors
          </ThemedText>
          {pacs.map((pac: any, i: number) => (
            <View
              key={i}
              style={[
                styles.row,
                i === pacs.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <ThemedText style={styles.pacName}>{pac.name}</ThemedText>
              <ThemedText style={styles.pacVal}>
                ${pac.amount?.toLocaleString()}
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      {corporateTrace && (
        <View style={styles.traceContainer}>
          <ThemedText
            style={[
              GlobalStyles.metricCardTitleLeft,
              { color: Colors.light.accent, marginBottom: 4 }, // Maintenance of semantic red warning
            ]}
          >
            Corporation Traceability
          </ThemedText>
          <ThemedText style={styles.traceText}>{corporateTrace}</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  amountRow: {
    flexDirection: "row" as any,
    justifyContent: "space-between" as any,
    alignItems: "center" as any,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingBottom: 4,
  },
  amountLabel: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
  },
  amountValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.primary,
  },
  section: {
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: "row" as any,
    justifyContent: "space-between" as any,
    marginBottom: 4,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  pacName: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
  },
  pacVal: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
  },
  traceContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
  },
  traceText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
    lineHeight: 20,
    fontStyle: "italic" as any,
  },
});

ComponentFactory.register("Data.Grid.Grouped", ({ value }) => (
  <FECContributionBlock data={value} />
));
