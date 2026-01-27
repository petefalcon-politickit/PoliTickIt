import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Visual.Chart.SentimentTrend
 * Visualizes how constituent sentiment has shifted over time (e.g., Intro -> Comm -> Floor).
 * High-fidelity monochromatic line/area sparkline.
 */
export const SentimentTrendMolecule = ({ data }: any) => {
  const { title, points = [], legend } = data || {};

  // Normalized height based on 0-100 scale
  const CHART_HEIGHT = 80;

  // Legend parsing helper (Consolidated from charts.tsx)
  const renderLegendItems = (legendStr: string) => {
    if (!legendStr) return null;
    const items = legendStr.split("|").map((s) => s.trim());

    return (
      <View style={styles.legendContainer}>
        {items.map((item, idx) => {
          const parts = item.split(":").map((s) => s.trim());
          if (parts.length < 2) {
            return (
              <ThemedText key={idx} style={styles.chartLegendText}>
                {String(item)}
              </ThemedText>
            );
          }

          const [colorPart, labelPart] = parts;
          let color = Colors.light.textMuted;

          const lowerColor = colorPart.toLowerCase();
          if (
            lowerColor.includes("support") ||
            lowerColor.startsWith("s.") ||
            lowerColor.includes("primary")
          ) {
            color = Colors.light.primary;
          } else if (
            lowerColor.includes("oppose") ||
            lowerColor.startsWith("o.") ||
            lowerColor.includes("accent")
          ) {
            color = Colors.light.accent;
          }

          return (
            <View key={idx} style={styles.legendItem}>
              <View style={[styles.legendRect, { backgroundColor: color }]} />
              <ThemedText style={styles.legendLabel}>
                {String(labelPart)}
              </ThemedText>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={GlobalStyles.sentimentTrendContainer}>
      {title && (
        <View style={styles.chartHeader}>
          <ThemedText style={styles.titleText}>{title}</ThemedText>
        </View>
      )}

      <View style={[styles.chartWrapper, { height: CHART_HEIGHT }]}>
        {/* Simple vertical bars representing "Sentiment Strength" at each timeline vertex */}
        {points.map((p: any, i: number) => {
          const supportHeight = (p.support / 100) * CHART_HEIGHT;
          const opposeHeight = (p.oppose / 100) * CHART_HEIGHT;

          return (
            <View key={i} style={styles.dataPoint}>
              <View style={styles.trendBarContainer}>
                {/* Oppose (Red) - Bottom-aligned negative sentiment */}
                <View style={[styles.opposeBar, { height: opposeHeight }]} />
                {/* Support (Blue) - Top-aligned positive sentiment */}
                <View style={[styles.supportBar, { height: supportHeight }]} />
              </View>
              <ThemedText style={styles.pointLabel}>{p.label}</ThemedText>
            </View>
          );
        })}
      </View>

      {legend
        ? renderLegendItems(legend)
        : /* Default legend if none provided */
          renderLegendItems("Primary: Support | Accent: Oppose")}
    </View>
  );
};

const styles = StyleSheet.create({
  chartHeader: {
    flexDirection: "row" as any,
    justifyContent: "center" as any, // Center title
    alignItems: "center" as any,
    marginBottom: Spacing.sm,
  },
  titleText: {
    ...GlobalStyles.metricCardTitle,
    textAlign: "center" as any,
    paddingHorizontal: 0,
    marginBottom: 0,
    flex: 1,
  },
  chartWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 20,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  dataPoint: {
    flex: 1,
    alignItems: "center",
  },
  trendBarContainer: {
    width: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  supportBar: {
    width: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  opposeBar: {
    width: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 2,
    opacity: 0.6,
  },
  pointLabel: {
    position: "absolute" as any,
    bottom: -20,
    fontSize: 10,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.textMuted,
    textTransform: "uppercase" as any,
  },
  legendContainer: {
    flexDirection: "row" as any,
    flexWrap: "wrap" as any,
    justifyContent: "center" as any,
    gap: 12,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  legendItem: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    gap: 6,
  },
  legendRect: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  chartLegendText: {
    fontSize: 11,
    color: Colors.light.textMuted,
    fontStyle: "italic" as any,
    textAlign: "center" as any,
    marginTop: Spacing.md,
  },
});

ComponentFactory.register("Visual.Chart.SentimentTrend", ({ value }) => (
  <SentimentTrendMolecule data={value} />
));
