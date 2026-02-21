import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Metric.Congressional.WeeklySummary
 *
 * Aggregates a week of activity for the "Productivity" tab.
 * Part of the Drill-Down Continuum: Summary -> Detail.
 */
export const CongressionalWeeklySummaryMolecule = ({
  data,
  navigationService,
  snapId,
}: any) => {
  const {
    period, // e.g. "JAN 19 - JAN 25, 2026"
    topPolicyArea,
    stats, // { debatesJoined, amendmentsOffered, floorTimeMinutes }
    participationPulse, // 0-100 score
    sentimentRatio, // { support: number, oppose: number }
    drillDownSnapId,
  } = data || {};

  const router = useRouter();

  const handlePress = () => {
    if (drillDownSnapId === "LIST") {
      router.push({
        pathname: "/snap-viewer",
        params: { parentId: snapId, type: "debates" },
      });
      return;
    }

    if (drillDownSnapId) {
      console.log(`[WeeklySummary] Drilling down to snap: ${drillDownSnapId}`);
      if (navigationService) {
        navigationService.navigateToEntity("snap", drillDownSnapId);
      } else {
        router.push({
          pathname: "/snap-viewer",
          params: { id: drillDownSnapId },
        });
      }
    }
  };

  return (
    <View style={GlobalStyles.weeklySummaryContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>
            Weekly Debate Performance
          </ThemedText>
          <ThemedText style={styles.periodText}>{period}</ThemedText>
        </View>
        <View style={styles.policyBadge}>
          <ThemedText style={styles.policyText}>{topPolicyArea}</ThemedText>
        </View>
      </View>

      {/* KEY METRICS GRID */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <ThemedText style={styles.metricValue}>
            {stats?.debatesJoined || 0}
          </ThemedText>
          <ThemedText style={styles.metricLabel}>Debates</ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <ThemedText style={styles.metricValue}>
            {stats?.amendmentsOffered || 0}
          </ThemedText>
          <ThemedText style={styles.metricLabel}>Amendments</ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <ThemedText style={styles.metricValue}>
            {stats?.floorTimeMinutes || 0}m
          </ThemedText>
          <ThemedText style={styles.metricLabel}>Floor Time</ThemedText>
        </View>
      </View>

      {/* PARTICIPATION INTENSITY */}
      <View style={styles.pulseContainer}>
        <View style={styles.pulseHeader}>
          <ThemedText style={styles.sectionLabel}>
            ACTIVITY INTENSITY
          </ThemedText>
          <ThemedText style={styles.pulseValue}>
            {participationPulse}%
          </ThemedText>
        </View>
        <View style={styles.track}>
          <View style={[styles.bar, { width: `${participationPulse}%` }]} />
        </View>
      </View>

      {/* SENTIMENT RATIO */}
      <View style={styles.sentimentContainer}>
        <ThemedText style={styles.sectionLabel}>
          FLOOR POSITION RATIO
        </ThemedText>
        <View style={styles.sentimentTrack}>
          <View
            style={[styles.supportBar, { flex: sentimentRatio?.support || 1 }]}
          />
          <View
            style={[styles.opposeBar, { flex: sentimentRatio?.oppose || 1 }]}
          />
        </View>
        <View style={styles.sentimentLegend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.dot, { backgroundColor: Colors.light.success }]}
            />
            <ThemedText style={styles.legendText}>
              Supportive ({sentimentRatio?.support || 0})
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.dot, { backgroundColor: Colors.light.error }]}
            />
            <ThemedText style={styles.legendText}>
              Opposing ({sentimentRatio?.oppose || 0})
            </ThemedText>
          </View>
        </View>
      </View>

      {/* DRILL-DOWN CTA */}
      <TouchableOpacity
        style={GlobalStyles.continuumFooter}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.drillDownContent}>
          <ThemedText style={GlobalStyles.continuumLabel}>
            TRUST THREAD™
          </ThemedText>
          <ThemedText style={GlobalStyles.continuumSubtext}>
            {drillDownSnapId === "LIST"
              ? "Comprehensive list of all 12 session debates"
              : "Verbatim transcripts and procedural votes"}
          </ThemedText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={14}
          color={Colors.light.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15, // Grid synchronization standard
  },
  periodText: {
    fontSize: 12,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
  },
  title: {
    ...GlobalStyles.metricCardTitleLeft,
    marginBottom: 0, // Header handles spacing with marginBottom: 15
  },
  policyBadge: {
    backgroundColor: "rgba(34, 113, 186, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  policyText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.primary,
  },
  metricsGrid: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: Spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    height: "100%",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.text,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  pulseContainer: {
    marginBottom: Spacing.md,
  },
  pulseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.textMuted,
    letterSpacing: 1,
  },
  pulseValue: {
    fontSize: 14,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.primary,
  },
  track: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: Colors.light.primary,
  },
  sentimentContainer: {
    marginBottom: 0,
  },
  sentimentTrack: {
    height: 6,
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 6,
  },
  supportBar: {
    backgroundColor: Colors.light.success,
  },
  opposeBar: {
    backgroundColor: Colors.light.error,
  },
  sentimentLegend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  drillDownContent: {
    flex: 1,
  },
});

ComponentFactory.register(
  "Metric.Congressional.WeeklySummary",
  ({ value, extraProps }) => (
    <CongressionalWeeklySummaryMolecule
      data={value}
      navigationService={extraProps?.navigationService}
      snapId={extraProps?.snapId}
    />
  ),
);
