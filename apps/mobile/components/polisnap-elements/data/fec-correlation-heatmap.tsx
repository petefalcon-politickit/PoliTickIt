import { ComponentFactory } from "@/components/factories/component-factory";
import { Colors, GlobalStyles } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../../themed-text";
import { FeatureGate } from "../../ui/feature-gate";

interface FECDonorData {
  industry: string;
  amount: number;
  correlation: number; // 0 to 1
}

interface FECCorrelationHeatmapProps {
  element: {
    data: {
      donors: FECDonorData[];
      totalInfluence: number;
    };
    presentation?: {
      title?: string;
    };
  };
}

export const FECCorrelationHeatmap: React.FC<FECCorrelationHeatmapProps> = ({
  element,
}) => {
  const { donors, totalInfluence } = element.data;
  const primaryColor = useThemeColor({}, "primary");
  const secondaryTextColor = useThemeColor({}, "textSecondary");

  // This is a Tier 2 Intelligence feature
  const REQUIRED_LEVEL = 2;

  const renderContent = () => (
    <View style={GlobalStyles.fecHeatmapContainer}>
      <View style={styles.header}>
        <Ionicons name="flash" size={16} color={primaryColor} />
        <ThemedText
          style={[GlobalStyles.metricCardTitleLeft, { marginBottom: 0 }]}
        >
          {element.presentation?.title || "INDUSTRY CORRELATION"}
        </ThemedText>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={GlobalStyles.fecHeatmapMetricLabel}>
            TOTAL CONTRIBUTIONS
          </Text>
          <Text style={GlobalStyles.fecHeatmapValue}>
            ${(totalInfluence / 1000000).toFixed(1)}M
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={GlobalStyles.fecHeatmapMetricLabel}>
            DATA CONFIDENCE
          </Text>
          <Text
            style={[
              GlobalStyles.fecHeatmapValue,
              { color: Colors.light.success },
            ]}
          >
            HIGH
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        {donors.map((donor, index) => (
          <View key={index} style={GlobalStyles.fecHeatmapRow}>
            <View style={styles.industryCell}>
              <Text style={GlobalStyles.fecHeatmapIndustryText}>
                {donor.industry}
              </Text>
            </View>
            <View style={styles.amountCell}>
              <Text style={GlobalStyles.fecHeatmapAmountText}>
                ${donor.amount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.heatCell}>
              <View style={GlobalStyles.fecHeatmapBarTrack}>
                <View
                  style={[
                    styles.heatBar,
                    {
                      width: `${donor.correlation * 100}%`,
                      backgroundColor:
                        donor.correlation > 0.7
                          ? Colors.light.error
                          : primaryColor,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: secondaryTextColor }]}>
          Correlation indicates alignment between donor industry focus and
          representative voting record over 24 months.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureGate
      level={REQUIRED_LEVEL}
      featureTitle="Financial Correlation Audit"
      featureDescription="Decode the nexus between private interests and legislative results."
    >
      {renderContent()}
    </FeatureGate>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // SYNCED with GlobalStyles.metricCardTitleLeft
    gap: 8,
  },
  metricsRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 24,
  },
  metric: {
    flex: 1,
  },
  table: {
    marginBottom: 16,
  },
  industryCell: {
    flex: 2,
  },
  amountCell: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 12,
  },
  heatCell: {
    flex: 1,
  },
  heatBar: {
    height: "100%",
    borderRadius: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 11,
    lineHeight: 16,
    fontStyle: "italic",
  },
});

// Register the cohesive element
ComponentFactory.register(
  "Data.Correlation.Heatmap",
  ({ value, presentation }) => (
    <FECCorrelationHeatmap element={{ data: value, presentation }} />
  ),
);
