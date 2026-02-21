import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { AlignmentReport } from "@/services/interfaces/ICivicIntelligenceService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface ROIReportCardProps {
  report: AlignmentReport;
  onPress?: () => void;
}

export const ROIReportCard: React.FC<ROIReportCardProps> = ({
  report,
  onPress,
}) => {
  const getVerdictColor = () => {
    switch (report.verdict) {
      case "Strong Alignment":
        return Colors.light.success;
      case "Moderate Alignment":
        return Colors.light.primary;
      case "Divergent":
        return Colors.light.error;
      default:
        return Colors.light.textMuted;
    }
  };

  const verdictColor = getVerdictColor();

  return (
    <TouchableOpacity
      style={GlobalStyles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={GlobalStyles.row}>
          <Ionicons
            name="finger-print"
            size={18}
            color={Colors.light.primary}
          />
          <ThemedText style={styles.headerTitle}>
            CONSTITUENT ROI REPORT
          </ThemedText>
        </View>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>
            Sovereignty Ledger v2.1
          </ThemedText>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.scoreContainer}>
          <ThemedText style={styles.scoreValue}>
            {report.alignmentScore}%
          </ThemedText>
          <ThemedText style={styles.scoreLabel}>ALIGNMENT</ThemedText>
        </View>

        <View style={styles.verdictContainer}>
          <ThemedText style={[styles.verdictText, { color: verdictColor }]}>
            {report.verdict.toUpperCase()}
          </ThemedText>
          <ThemedText style={styles.metadataText}>
            Based on {report.totalCorrelatedSnaps} correlated records
          </ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.policyRow}>
        {report.topPolicyAlignments.slice(0, 3).map((policy, idx) => (
          <View key={idx} style={styles.policyItem}>
            <ThemedText style={styles.policyLabel}>{policy.policy}</ThemedText>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${policy.score}%`,
                    backgroundColor:
                      policy.score > 70
                        ? Colors.light.success
                        : Colors.light.primary,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.policyValue}>{policy.score}%</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Ionicons
          name="shield-checkmark"
          size={12}
          color={Colors.light.textTertiary}
        />
        <ThemedText style={styles.footerText}>
          Verified via Local-First Relational Sovereignty
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.primary,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "rgba(0, 87, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "600",
    color: Colors.light.textMuted,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(0, 87, 255, 0.1)",
    backgroundColor: "#fff",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.light.text,
  },
  scoreLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: Colors.light.textMuted,
  },
  verdictContainer: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  verdictText: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  metadataText: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: Spacing.md,
  },
  policyRow: {
    marginBottom: Spacing.sm,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  policyLabel: {
    width: 90,
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.textSecondary,
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  policyValue: {
    width: 30,
    fontSize: 10,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  footerText: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    marginLeft: 4,
    fontStyle: "italic",
  },
});
