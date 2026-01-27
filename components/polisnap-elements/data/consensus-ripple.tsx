import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { FeatureGate } from "@/components/ui/feature-gate";
import { ProLogo } from "@/components/ui/pro-logo";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ConsensusRippleProps {
  data: {
    district: string;
    consensusScore: number;
    respondents: number;
    capitalVolume: string;
    trend: "rising" | "falling" | "stable";
  };
}

export const ConsensusRippleMolecule: React.FC<ConsensusRippleProps> = ({
  data,
}) => {
  const { district, consensusScore, respondents, capitalVolume, trend } =
    data || {};

  const trendColor =
    trend === "rising"
      ? Colors.light.success
      : trend === "falling"
        ? Colors.light.error
        : Colors.light.textMuted;

  const renderContent = () => (
    <View style={GlobalStyles.consensusRippleContainer}>
      <View style={GlobalStyles.rowBetween}>
        <ThemedText style={GlobalStyles.consensusRippleTitle}>
          {district}
        </ThemedText>
        <ProLogo variant="solid" size={14} />
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricItem}>
          <ThemedText style={GlobalStyles.consensusRippleMetricLabel}>
            AGGREGATE CONSENSUS
          </ThemedText>
          <ThemedText style={GlobalStyles.consensusRippleMetricValue}>
            {consensusScore}%
          </ThemedText>
        </View>

        <View style={styles.metricItem}>
          <ThemedText style={GlobalStyles.consensusRippleMetricLabel}>
            CONSTITUENT CAPITAL
          </ThemedText>
          <ThemedText
            style={[
              GlobalStyles.consensusRippleMetricValue,
              { color: Colors.light.textSecondary }, // Toned down from accent
            ]}
          >
            {capitalVolume}
          </ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={GlobalStyles.rowBetween}>
        <View style={GlobalStyles.row}>
          <Ionicons
            name="people"
            size={14}
            color={Colors.light.textTertiary}
            style={{ marginRight: 6 }}
          />
          <ThemedText style={styles.statText}>
            {respondents.toLocaleString()} REPORTERS
          </ThemedText>
        </View>
        <View style={GlobalStyles.row}>
          <Ionicons
            name={
              trend === "rising"
                ? "caret-up"
                : trend === "falling"
                  ? "caret-down"
                  : "remove"
            }
            size={16}
            color={trendColor}
            style={{ marginRight: 4 }}
          />
          <ThemedText style={[styles.trendText, { color: trendColor }]}>
            {trend.toUpperCase()}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return <FeatureGate level={4}>{renderContent()}</FeatureGate>;
};

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.xl,
  },
  metricItem: {
    flex: 1,
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.md,
  },
  statText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
  },
  trendText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy as any,
    letterSpacing: 0.5,
  },
});

ComponentFactory.register("Data.Consensus.Ripple", (props) => (
  <ConsensusRippleMolecule data={props.value} />
));
