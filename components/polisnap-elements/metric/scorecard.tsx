import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ColumnarListMolecule } from "../data/columnar-list";
import { MetricGroup } from "./metric-group";

interface ScorecardProps {
  data: {
    representativeId: string;
    overallGrade: string;
    summaryText?: string;
    metrics: {
      alignment: { value: number; label: string };
      corruptionIndex: { value: number; label: string; status: string };
      sentimentGap: { value: number; label: string };
    };
    topAlignedTopics: string[];
    topConflictTopics: string[];
    asOfDate: string;
    sources: string[];
  };
}

export const AccountabilityScorecardMolecule: React.FC<ScorecardProps> = ({
  data,
}) => {
  const {
    overallGrade,
    summaryText,
    metrics,
    topAlignedTopics,
    topConflictTopics,
  } = data || {};

  const getGradeColor = (grade: string) => {
    const base = grade.charAt(0);
    switch (base) {
      case "A":
        return "#38A169"; // Green
      case "B":
        return "#3182CE"; // Blue
      case "C":
        return "#DD6B20"; // Orange
      case "D":
      case "F":
        return "#E53E3E"; // Crimson
      default:
        return Colors.light.textTertiary;
    }
  };

  const gradeColor = getGradeColor(overallGrade);

  return (
    <View style={GlobalStyles.corruptionIndexContainer}>
      <ThemedText style={GlobalStyles.metricCardTitleLeft}>
        Representation ROI Audit
      </ThemedText>

      <View style={styles.heroSection}>
        <View
          style={[
            GlobalStyles.scorecardGradeCircle,
            { backgroundColor: gradeColor }, // SOLID FILL
          ]}
        >
          <ThemedText style={GlobalStyles.scorecardGradeText}>
            {overallGrade}
          </ThemedText>
        </View>
        <View style={styles.heroMeta}>
          <ThemedText style={styles.roiLabel}>OVERALL ROI GRADE</ThemedText>
          <ThemedText style={styles.roiSubtext}>
            {summaryText ||
              "Based on district alignment and integrity metrics."}
          </ThemedText>
        </View>
      </View>

      <MetricGroup
        data={{
          items: [
            {
              label: metrics.alignment.label,
              value: `${metrics.alignment.value}%`,
              color: "#38A169",
            },
            {
              label: metrics.corruptionIndex.label,
              value: metrics.corruptionIndex.value,
              subtext: metrics.corruptionIndex.status,
            },
            {
              label: metrics.sentimentGap.label,
              value: `${metrics.sentimentGap.value}%`,
              subtext: "Delta",
            },
          ],
        }}
        containerStyle={{
          backgroundColor: "transparent",
          borderWidth: 0,
          paddingHorizontal: 0,
          paddingTop: 0,
          paddingBottom: 10, // 10px padding above separator
        }}
      />

      <ColumnarListMolecule
        data={{
          columns: [
            {
              title: "TOP ALIGNMENT",
              items: topAlignedTopics,
              defaultIcon: "checkmark-circle",
              defaultColor: "#38A169",
            },
            {
              title: "TOP CONFLICT",
              items: topConflictTopics,
              defaultIcon: "alert-circle",
              defaultColor: "#E53E3E",
            },
          ],
        }}
        containerStyle={styles.topicSection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5, // 5px more vertical padding between title and score
    marginBottom: Spacing.md + 10, // Added 10px before metric group
    gap: Spacing.sm,
  },
  heroMeta: {
    flex: 1,
  },
  roiLabel: {
    fontSize: 10, // BUMPED 1 unit
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    letterSpacing: 1,
    textTransform: "uppercase", // ALL CAPS
  },
  roiSubtext: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 1,
    lineHeight: 12, // Reduced to 110%
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: Typography.weights.medium as any,
    color: Colors.light.textTertiary,
  },
  topicSection: {
    flexDirection: "row",
    alignItems: "flex-start", // Top align the columns
    gap: Spacing.md,
    marginBottom: 0, // Reduced bottom padding per user request
    paddingTop: 10, // 10px padding below separator
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: Spacing.xs,
  },
  footerLeft: {
    flex: 1,
    gap: 0,
  },
  footerSubtext: {
    fontSize: 9,
    color: Colors.light.textTertiary,
    letterSpacing: 0.5,
    lineHeight: 11,
    includeFontPadding: false,
  },
  footerLabel: {
    fontSize: 9, // Synced with footerSubtext
    fontWeight: Typography.weights.semibold as any,
  },
});

ComponentFactory.register("Metric.Accountability.Scorecard", ({ value }) => (
  <AccountabilityScorecardMolecule data={value} />
));
