import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Metric.Attendance.Grid
 *
 * Visualizes legislative session attendance using a high-density grid.
 * Provides a quick visual audit of consistency.
 */
export const AttendanceGridMolecule = ({ data }: any) => {
  const { title, summary, sessionData } = data || {};

  // Mock data if sessionData is missing
  const squares = sessionData || Array.from({ length: 60 });

  return (
    <View style={GlobalStyles.attendanceContainer}>
      <View style={styles.header}>
        <ThemedText
          style={[GlobalStyles.metricCardTitleLeft, { marginBottom: 0 }]}
        >
          {title || "Session Attendance"}
        </ThemedText>
        <ThemedText style={styles.summaryValue}>{summary || "98%"}</ThemedText>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {squares.map((val: any, i: number) => {
            // Logic to determine color from val or mock it
            let color = Colors.light.success;
            if (val === "absent" || (typeof val !== "string" && i % 15 === 0)) {
              color = Colors.light.error;
            } else if (
              val === "excused" ||
              (typeof val !== "string" && i % 22 === 0)
            ) {
              color = Colors.light.warning;
            }

            return (
              <View
                key={i}
                style={[styles.square, { backgroundColor: color }]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.miniSquare,
              { backgroundColor: Colors.light.success },
            ]}
          />
          <ThemedText style={styles.legendText}>Present</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.miniSquare, { backgroundColor: Colors.light.error }]}
          />
          <ThemedText style={styles.legendText}>Absent</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.miniSquare,
              { backgroundColor: Colors.light.warning },
            ]}
          />
          <ThemedText style={styles.legendText}>Excused</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15, // Grid synchronization standard
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.primary,
  },
  gridContainer: {
    paddingVertical: Spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  square: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legend: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  miniSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

ComponentFactory.register("Metric.Attendance.Grid", ({ value }) => (
  <AttendanceGridMolecule data={value} />
));
