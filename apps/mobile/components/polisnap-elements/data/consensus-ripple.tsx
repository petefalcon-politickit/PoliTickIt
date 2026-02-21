import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { CollectiveSignalLogo } from "@/components/ui/collective-signal-logo";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { useTelemetry } from "@/hooks/use-telemetry";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ConsensusRippleProps {
  element: {
    id: string;
    data: {
      district: string;
      consensusScore: number;
      respondents: number;
      capitalVolume: string;
      trend: "rising" | "falling" | "stable";
      clusters?: {
        name: string;
        sentiment: number; // 0-100
        size: number; // 0-1
      }[];
    };
  };
}

export const ConsensusRippleMolecule: React.FC<ConsensusRippleProps> = ({
  element,
}) => {
  const { hapticService } = useServices();
  const { trackAction } = useTelemetry();
  const [hasSigned, setHasSigned] = useState(false);
  const [localRespondents, setLocalRespondents] = useState(
    element.data?.respondents || 0,
  );

  const {
    district,
    consensusScore,
    respondents,
    capitalVolume,
    trend,
    clusters,
  } = element.data || {};

  const handleSignConsensus = async () => {
    if (hasSigned) return;

    hapticService.triggerMediumImpact();
    setHasSigned(true);
    setLocalRespondents((prev) => prev + 1);

    // Track the ZK-participation event
    await trackAction(element.id, "sign_consensus", {
      district,
      type: "ZK_VERIFIED_SIGNATURE",
    });
  };

  const trendColor =
    trend === "rising"
      ? Colors.light.success
      : trend === "falling"
        ? Colors.light.error
        : Colors.light.textMuted;

  // Internal component for the "Ripple Map"
  const RippleMap = () => {
    // Fixed positions for up to 4 clusters to ensure they stay in bounds (140x140)
    // Format: [top, left]
    const positions = [
      [30, 25],
      [75, 80],
      [85, 20],
      [20, 90],
    ];

    const displayClusters = (
      clusters || [
        { name: "Labor", sentiment: 82, size: 0.8 },
        { name: "Tech", sentiment: 45, size: 0.5 },
        { name: "Verified Residents", sentiment: 71, size: 0.9 },
      ]
    ).slice(0, 4);

    return (
      <View style={styles.rippleMapContainer}>
        {/* Background ripples */}
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.rippleCircle,
              {
                width: 100 + i * 40,
                height: 100 + i * 40,
                borderRadius: (100 + i * 40) / 2,
                opacity: 0.1 - i * 0.02,
                borderColor: Colors.light.primary,
              },
            ]}
          />
        ))}

        {/* Sentiment Clusters (the "Heat" in the map) */}
        {displayClusters.map((cluster, idx) => {
          const size = cluster.size * 30 + 15;
          const [top, left] = positions[idx % positions.length];

          return (
            <View
              key={idx}
              style={[
                styles.clusterNode,
                {
                  top,
                  left,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor:
                    cluster.sentiment > 60
                      ? Colors.light.success
                      : Colors.light.primary,
                  opacity: 0.8,
                },
              ]}
            >
              <ThemedText style={styles.clusterLabel}>
                {cluster.name[0]}
              </ThemedText>
            </View>
          );
        })}
      </View>
    );
  };

  const renderContent = () => (
    <View style={GlobalStyles.consensusRippleContainer}>
      {/* Forensic Watermark / Trust Thread */}
      <View style={styles.trustThreadLayer}>
        <ThemedText style={styles.serialId}>
          REF: PS-{Math.random().toString(36).substring(2, 9).toUpperCase()}
        </ThemedText>
        <ThemedText
          style={styles.watermark}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          SOVEREIGNTY LEDGER PROOF
        </ThemedText>
      </View>

      <View style={GlobalStyles.rowBetween}>
        <View style={GlobalStyles.row}>
          <Ionicons
            name="map-outline"
            size={16}
            color={Colors.light.primary}
            style={{ marginRight: 6 }}
          />
          <ThemedText style={GlobalStyles.consensusRippleTitle}>
            {district || "DISTRICT VIEW: AGGREGATE"}
          </ThemedText>
        </View>
        <CollectiveSignalLogo variant="solid" size={14} />
      </View>

      <View style={styles.mainVisualRow}>
        <View style={styles.statsColumn}>
          <View style={styles.metricItem}>
            <ThemedText style={GlobalStyles.consensusRippleMetricLabel}>
              AGGREGATE CONSENSUS
            </ThemedText>
            <ThemedText style={GlobalStyles.consensusRippleMetricValue}>
              {consensusScore ?? 0}%
            </ThemedText>
          </View>

          <View style={[styles.metricItem, { marginTop: 12 }]}>
            <ThemedText style={GlobalStyles.consensusRippleMetricLabel}>
              CONSTITUENT CAPITAL
            </ThemedText>
            <ThemedText
              style={[
                GlobalStyles.consensusRippleMetricValue,
                { color: Colors.light.textSecondary, fontSize: 18 },
              ]}
            >
              {capitalVolume}
            </ThemedText>
          </View>
        </View>

        <RippleMap />
      </View>

      <View style={styles.divider} />

      <View style={GlobalStyles.rowBetween}>
        <TouchableOpacity
          style={GlobalStyles.row}
          onPress={handleSignConsensus}
          activeOpacity={hasSigned ? 1 : 0.7}
        >
          <Ionicons
            name={hasSigned ? "shield-checkmark" : "shield-outline"}
            size={12}
            color={hasSigned ? Colors.light.success : Colors.light.primary}
            style={{ marginRight: 6 }}
          />
          <ThemedText
            style={[
              styles.statText,
              hasSigned && { color: Colors.light.success },
            ]}
          >
            {localRespondents?.toLocaleString()} VERIFIED REPORTERS (ZK){" "}
            {hasSigned && "• SIGNED"}
          </ThemedText>
        </TouchableOpacity>
        <View style={GlobalStyles.row}>
          <Ionicons
            name={
              trend === "rising"
                ? "caret-up"
                : trend === "falling"
                  ? "caret-down"
                  : "remove"
            }
            size={14}
            color={trendColor}
            style={{ marginRight: 4 }}
          />
          <ThemedText style={[styles.trendText, { color: trendColor }]}>
            {trend?.toUpperCase()}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return renderContent();
};

const styles = StyleSheet.create({
  mainVisualRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
    height: 140,
  },
  statsColumn: {
    flex: 1,
  },
  rippleMapContainer: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  rippleCircle: {
    position: "absolute",
    borderWidth: 1,
  },
  trustThreadLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.03,
    pointerEvents: "none",
    overflow: "hidden",
  },
  watermark: {
    fontSize: 40,
    fontWeight: "900",
    color: Colors.light.text,
    transform: [{ rotate: "-45deg" }],
    lineHeight: 50,
  },
  serialId: {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 6,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textMuted,
    opacity: 0.5,
  },
  clusterNode: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  clusterLabel: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  metricItem: {
    gap: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.md,
  },
  statText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
  },
  trendText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy as any,
    letterSpacing: 0.5,
  },
});

ComponentFactory.register("Data.Consensus.Ripple", (props) => (
  <ConsensusRippleMolecule element={props} />
));
