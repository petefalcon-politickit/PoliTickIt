import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FeatureGate } from "../../ui/feature-gate";
import { ColumnarListMolecule } from "../data/columnar-list";
import { MetricGroup } from "./metric-group";

// --- SUB-MOLECULES (SPEC SECTION 3) ---

/**
 * Metric.Scorecard.GradeBadge
 * The Hero visual. Large A-F grade with status subtext.
 */
export const GradeBadge = ({
  grade,
  summaryText,
}: {
  grade: string;
  summaryText?: string;
}) => {
  const getGradeColor = (g: string) => {
    const base = g.charAt(0);
    switch (base) {
      case "A":
        return "#38A169";
      case "B":
        return "#3182CE";
      case "C":
        return "#DD6B20";
      case "D":
      case "F":
        return "#E53E3E";
      default:
        return Colors.light.textTertiary;
    }
  };

  const gradeColor = getGradeColor(grade);

  return (
    <View style={styles.heroSection}>
      <View
        style={[
          GlobalStyles.scorecardGradeCircle,
          { backgroundColor: gradeColor },
        ]}
      >
        <ThemedText style={GlobalStyles.scorecardGradeText}>{grade}</ThemedText>
      </View>
      <View style={styles.heroMeta}>
        <ThemedText style={styles.roiLabel}>OVERALL ROI GRADE</ThemedText>
        <ThemedText style={styles.roiSubtext}>
          {summaryText || "Based on district alignment and integrity metrics."}
        </ThemedText>
      </View>
    </View>
  );
};

/**
 * Metric.Scorecard.AlignmentMeter
 * Horizontal comparison of alignment percentage.
 */
export const AlignmentMeter = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  return (
    <View style={styles.meterContainer}>
      <View style={styles.meterHeader}>
        <ThemedText style={GlobalStyles.scorecardMetricLabel}>
          {label}
        </ThemedText>
        <ThemedText style={GlobalStyles.scorecardMetricValue}>
          {value}%
        </ThemedText>
      </View>
      <View style={GlobalStyles.scorecardAlignmentTrack}>
        <View
          style={[
            GlobalStyles.scorecardAlignmentFill,
            {
              width: `${value}%`,
              backgroundColor:
                value > 70 ? "#38A169" : value > 40 ? "#DD6B20" : "#E53E3E",
            },
          ]}
        />
      </View>
    </View>
  );
};

/**
 * Metric.Scorecard.SentimentGap
 * Delta between constituent sentiment and official vote.
 */
export const SentimentGap = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  return (
    <View style={styles.meterContainer}>
      <View style={GlobalStyles.scorecardSentimentRow}>
        <ThemedText style={GlobalStyles.scorecardMetricLabel}>
          {label}
        </ThemedText>
        <View style={styles.gapBadge}>
          <Ionicons
            name={value > 20 ? "trending-up" : "remove"}
            size={12}
            color={value > 20 ? "#E53E3E" : Colors.light.textMuted}
          />
          <ThemedText
            style={[styles.gapText, value > 20 && { color: "#E53E3E" }]}
          >
            {value}% DELTA
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.gapDescription}>
        Constituent pulse vs. Floor vote deviation.
      </ThemedText>
    </View>
  );
};

// --- MAIN MOLECULE ---

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
    drillDownSnapId?: string;
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
    drillDownSnapId,
  } = data || {};

  const router = useRouter();

  const handleVerify = () => {
    if (drillDownSnapId) {
      router.push({
        pathname: "/snap-viewer",
        params: { id: drillDownSnapId },
      });
    } else if (data.representativeId) {
      // Fallback: Drill down to all summaries for this representative
      router.push({
        pathname: "/snap-viewer",
        params: { parentId: data.representativeId, type: "summaries" },
      });
    }
  };

  return (
    <FeatureGate
      level={2}
      featureTitle="Representation ROI Scorecard"
      featureDescription="Full performance audit comparing legislative output against donor and constituent alignment."
    >
      <View style={GlobalStyles.corruptionIndexContainer}>
        <ThemedText style={GlobalStyles.metricCardTitleLeft}>
          Representation ROI
        </ThemedText>

        <GradeBadge grade={overallGrade} summaryText={summaryText} />

        <View style={styles.metersRow}>
          <AlignmentMeter
            value={metrics.alignment.value}
            label={metrics.alignment.label}
          />
        </View>

        <MetricGroup
          data={{
            items: [
              {
                label: metrics.corruptionIndex.label,
                value: metrics.corruptionIndex.value,
                subtext: metrics.corruptionIndex.status,
                color:
                  metrics.corruptionIndex.value > 50 ? "#E53E3E" : "#38A169",
              },
              {
                label: "Audit Date",
                value: data.asOfDate || "JAN 2026",
                subtext: "Verified",
              },
            ],
          }}
          containerStyle={styles.compactMetrics}
        />

        <SentimentGap
          value={metrics.sentimentGap.value}
          label={metrics.sentimentGap.label}
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

        {/* VERIFY FOOTER (Drill-Down Continuum Tier 1) */}
        <TouchableOpacity
          style={GlobalStyles.continuumFooter}
          activeOpacity={0.7}
          onPress={handleVerify}
        >
          <View style={styles.verifyContent}>
            <ThemedText style={GlobalStyles.continuumLabel}>
              TRUST THREAD™
            </ThemedText>
            <ThemedText style={GlobalStyles.continuumSubtext}>
              Audit floor transcripts & voting records
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
      </View>
    </FeatureGate>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  heroMeta: {
    flex: 1,
  },
  roiLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  roiSubtext: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 1,
    lineHeight: 12,
  },
  metersRow: {
    marginBottom: Spacing.md,
  },
  meterContainer: {
    marginBottom: Spacing.md,
  },
  meterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  compactMetrics: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  gapBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gapText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
  },
  gapDescription: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  topicSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  verifyContent: {
    flex: 1,
  },
});

// Register individual components if needed by backend
ComponentFactory.register("Metric.Scorecard.GradeBadge", ({ value }) => (
  <GradeBadge grade={value.overallGrade} summaryText={value.summaryText} />
));

ComponentFactory.register("Metric.Scorecard.AlignmentMeter", ({ value }) => (
  <AlignmentMeter value={value.value} label={value.label} />
));

ComponentFactory.register("Metric.Scorecard.SentimentGap", ({ value }) => (
  <SentimentGap value={value.value} label={value.label} />
));

ComponentFactory.register("Metric.Accountability.Scorecard", ({ value }) => (
  <AccountabilityScorecardMolecule data={value} />
));
