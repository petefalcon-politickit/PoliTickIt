import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Context.Thread
 * Visualizes the ACD (Autonomous Contextual Discovery) refinement logic
 * and the resulting geographic drill-down.
 */
export const ContextThread = ({ value: data }: any) => {
  const {
    refinementScore,
    activeTier,
    derivationSummary,
    lineage,
    oracleSource,
  } = data || {};

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "district":
        return "#7C3AED"; // Purple
      case "state":
        return "#2563EB"; // Blue
      default:
        return "#4B5563"; // Gray
    }
  };

  const tierColor = getTierColor(activeTier);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            { borderColor: tierColor, backgroundColor: `${tierColor}10` },
          ]}
        >
          <Ionicons name="git-network-outline" size={10} color={tierColor} />
          <ThemedText style={[styles.badgeText, { color: tierColor }]}>
            {activeTier?.toUpperCase() || "NATIONAL"} TIER
          </ThemedText>
        </View>
        <ThemedText style={styles.scoreText}>
          RS {refinementScore?.toFixed(2) || "0.00"}
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.summaryText}>
          {derivationSummary || "National data refined for regional relevance."}
        </ThemedText>

        <View style={styles.lineageContainer}>
          <ThemedText style={styles.lineageLabel}>CONTEXT LINEAGE</ThemedText>
          <ThemedText style={styles.lineageValue}>
            {lineage || `${oracleSource || "Oracle"} → Context Pillar`}
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.connector} />
        <ThemedText style={styles.footerText}>
          AUTONOMOUS CONTEXT THREAD™
        </ThemedText>
        <View style={styles.connector} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDFCFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 12,
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  scoreText: {
    fontSize: 10,
    fontFamily: Typography.fonts.mono,
    color: "#9CA3AF",
  },
  content: {
    gap: 8,
  },
  summaryText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#4B5563",
    lineHeight: 16,
  },
  lineageContainer: {
    backgroundColor: "#F9FAFB",
    padding: 6,
    borderRadius: 4,
  },
  lineageLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 2,
  },
  lineageValue: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: Typography.fonts.mono,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    opacity: 0.5,
  },
  connector: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 7,
    fontWeight: "800",
    color: "#9CA3AF",
    marginHorizontal: 8,
    letterSpacing: 1,
  },
});

ComponentFactory.register("Context.Thread", ContextThread);
