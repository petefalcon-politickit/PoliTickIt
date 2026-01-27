import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ComponentFactory } from "../../factories/component-factory";

interface Sector {
  name: string;
  score: number;
}

interface AggregatePulseProps {
  data: {
    title: string;
    aggregateScore: number;
    trend: "up" | "down" | "neutral";
    sectors: Sector[];
  };
}

export const AggregatePulse: React.FC<AggregatePulseProps> = ({ data }) => {
  const { title, aggregateScore, trend, sectors } = data;

  return (
    <View style={GlobalStyles.aggregatePulseContainer}>
      <ThemedText style={GlobalStyles.aggregatePulseTitle}>{title}</ThemedText>

      <View style={styles.mainScoreRow}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{aggregateScore}%</Text>
          <Text style={styles.scoreLabel}>Support</Text>
        </View>

        <View style={styles.trendContainer}>
          <View style={styles.trendHeader}>
            <Ionicons
              name={
                trend === "up"
                  ? "trending-up"
                  : trend === "down"
                    ? "trending-down"
                    : "remove"
              }
              size={24}
              color={
                trend === "up"
                  ? Colors.light.success
                  : trend === "down"
                    ? Colors.light.error
                    : Colors.light.textMuted
              }
            />
            <Text
              style={[
                styles.trendText,
                {
                  color:
                    trend === "up"
                      ? Colors.light.success
                      : trend === "down"
                        ? Colors.light.error
                        : Colors.light.textMuted,
                },
              ]}
            >
              {trend === "up" ? "+4.2%" : trend === "down" ? "-2.1%" : "Steady"}
            </Text>
          </View>
          <Text style={styles.trendSubtext}>Vs last 7 days</Text>
        </View>
      </View>

      <View style={styles.sectorList}>
        {sectors.map((sector, index) => (
          <View key={index} style={styles.sectorItem}>
            <View style={styles.sectorHeader}>
              <Text style={styles.sectorName}>{sector.name}</Text>
              <Text style={styles.sectorScore}>{sector.score}%</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${sector.score}%`,
                    backgroundColor:
                      sector.score > 70
                        ? Colors.light.success
                        : sector.score > 40
                          ? Colors.light.warning
                          : Colors.light.error,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.sans,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  mainScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 4,
    borderColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.primary,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.textMuted,
    textTransform: "uppercase" as any,
    fontWeight: Typography.weights.semibold as any,
  },
  trendContainer: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  trendText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  trendSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  sectorList: {
    gap: Spacing.sm,
  },
  sectorItem: {
    gap: 4,
  },
  sectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectorName: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textSlate,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  sectorScore: {
    fontSize: 12,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.text,
  },
  track: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});

ComponentFactory.register("Visual.Aggregate.Pulse", ({ value }) => (
  <AggregatePulse data={value} />
));
