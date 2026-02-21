import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Legend parsing helper
 */
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
          lowerColor.includes("dark") ||
          lowerColor.startsWith("d.") ||
          lowerColor.includes("primary")
        ) {
          color = Colors.light.primary;
        } else if (
          lowerColor.includes("light") ||
          lowerColor.startsWith("l.") ||
          lowerColor.includes("secondary")
        ) {
          color = Colors.light.secondary;
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

/**
 * Visual.Chart.Bar
 * A cohesive bar chart molecule.
 */
export const BarChartMolecule = ({ dataField, value, extraProps }: any) => {
  if (!value) return null;
  const activeTab = extraProps?.activeTab;

  // Pivot data if timedData exists
  const chartData = value.timedData
    ? value.timedData[activeTab]
    : value.data || [];
  const { title, legend } = value;

  // Calculate max for normalization
  const maxValue = Math.max(
    ...chartData.map((d: any) => Math.max(d.value || 0, d.value2 || 0)),
    1,
  );
  const CHART_HEIGHT = 100; // Slightly shorter to accommodate labels above
  const MIN_BAR_HEIGHT = 8;

  return (
    <View key={dataField} style={GlobalStyles.barChartContainer}>
      {title && (
        <View style={styles.chartHeader}>
          <SeveredTitle
            title={title}
            style={styles.titleText}
            textAlign="left"
          />
        </View>
      )}

      <View style={[styles.barChartContainer, { height: CHART_HEIGHT + 40 }]}>
        {chartData.map((d: any, i: number) => (
          <View key={i} style={styles.chartBarGroup}>
            <View style={styles.chartBars}>
              <View style={styles.chartBarStack}>
                <ThemedText
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.chartBarValueLabel}
                >
                  {d.value >= 1000
                    ? `${(d.value / 1000).toFixed(0)}k`
                    : d.value}
                </ThemedText>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height:
                        d.value > 0
                          ? Math.max(
                              MIN_BAR_HEIGHT,
                              (d.value / maxValue) * CHART_HEIGHT,
                            )
                          : 0,
                      backgroundColor: Colors.light.primary,
                    },
                  ]}
                />
              </View>
              {d.value2 !== undefined && (
                <View style={styles.chartBarStack}>
                  <ThemedText
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.chartBarValueLabel}
                  >
                    {d.value2 >= 1000
                      ? `${(d.value2 / 1000).toFixed(0)}k`
                      : d.value2}
                  </ThemedText>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height:
                          d.value2 > 0
                            ? Math.max(
                                MIN_BAR_HEIGHT,
                                (d.value2 / maxValue) * CHART_HEIGHT,
                              )
                            : 0,
                        backgroundColor: Colors.light.secondary,
                      },
                    ]}
                  />
                </View>
              )}
            </View>
            <ThemedText style={styles.chartBarCategory}>{d.label}</ThemedText>
          </View>
        ))}
      </View>

      {legend
        ? renderLegendItems(legend)
        : /* Default legend if none provided */
          renderLegendItems(
            chartData.some((d: any) => d.value2 !== undefined)
              ? "Primary: Value A | Secondary: Value B"
              : "Primary: Metric Value",
          )}
    </View>
  );
};

/**
 * Visual.Chart.Line
 * A cohesive line chart molecule.
 */
export const LineChartMolecule = ({ dataField, value }: any) => {
  if (!value || !value.data) return null;
  const { data, title, legend } = value;

  return (
    <View key={dataField} style={GlobalStyles.visualContainer}>
      {title && (
        <View style={styles.chartHeader}>
          <SeveredTitle
            title={title}
            style={styles.titleText}
            textAlign="left"
          />
        </View>
      )}
      <View style={styles.lineChartContainer}>
        <View style={styles.lineChartYAxis}>
          <ThemedText style={styles.chartAxisLabel}>100</ThemedText>
          <ThemedText style={styles.chartAxisLabel}>50</ThemedText>
          <ThemedText style={styles.chartAxisLabel}>0</ThemedText>
        </View>
        <View style={styles.lineChartGrid}>
          {data.map((d: any, i: number) => (
            <View key={i} style={styles.lineChartPointWrapper}>
              <View
                style={[
                  styles.lineChartPoint,
                  { bottom: (d.value / 100) * 120 },
                ]}
              />
              <ThemedText style={styles.chartAxisLabel}>{d.label}</ThemedText>
            </View>
          ))}
        </View>
      </View>
      {legend
        ? renderLegendItems(legend)
        : /* Default legend if none provided */
          renderLegendItems("Primary: Metric Trend")}
    </View>
  );
};

const styles = StyleSheet.create({
  chartHeader: {
    flexDirection: "row" as any,
    justifyContent: "center" as any, // Center title
    alignItems: "center" as any,
    marginBottom: 15, // Standardized 15px Vertical Track
  },
  titleText: {
    ...GlobalStyles.metricCardTitle,
    textAlign: "center" as any,
    paddingHorizontal: 0,
    marginBottom: 0, // Override global margin to use chartHeader spacing
  },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    paddingHorizontal: 4,
  },
  chartBarGroup: {
    alignItems: "center",
    flex: 1,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  chartBarStack: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  chartBar: {
    width: 14,
    borderRadius: 4,
  },
  chartBarValueLabel: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 2,
    width: 32, // Breadth for k suffixes
    textAlign: "center" as any,
  },
  chartBarCategory: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textSlate,
    marginTop: Spacing.sm,
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
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
  // Line Chart
  lineChartContainer: {
    flexDirection: "row" as any,
    height: 150,
    marginTop: Spacing.md,
  },
  lineChartYAxis: {
    width: 40,
    justifyContent: "space-between" as any,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.light.border,
  },
  lineChartGrid: {
    flex: 1,
    flexDirection: "row" as any,
    justifyContent: "space-around" as any,
    alignItems: "flex-end" as any,
    paddingBottom: 20,
  },
  lineChartPointWrapper: {
    alignItems: "center" as any,
    height: "100%",
    justifyContent: "flex-end" as any,
  },
  lineChartPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    position: "absolute" as any,
  },
  chartAxisLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
    textTransform: "uppercase" as any,
  },
});

ComponentFactory.register("Visual.Chart.Bar", (props) => (
  <BarChartMolecule {...props} />
));

ComponentFactory.register("Visual.Chart.Line", (props) => (
  <LineChartMolecule {...props} />
));
