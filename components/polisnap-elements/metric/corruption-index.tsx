import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CorruptionIndexProps {
  data: {
    title: string;
    score: number;
    donor: string;
    industry: string;
    amount: string;
    voteAction: string;
    insight: string;
    confidence: number;
    asOfDate?: string;
    sources?: string[];
  };
}

export const CorruptionIndexMolecule: React.FC<CorruptionIndexProps> = ({
  data,
}) => {
  const {
    title,
    score,
    donor,
    industry,
    amount,
    voteAction,
    insight,
    confidence,
  } = data || {};

  const scoreNum = typeof score === "number" ? score : 0;
  const confidenceNum = typeof confidence === "number" ? confidence : 0;

  const getScoreColor = (s: number) => {
    if (s >= 75) return "#E53E3E"; // High - Crimson
    if (s >= 50) return "#DD6B20"; // Medium - Orange
    return "#38A169"; // Low - Green
  };

  const scoreColor = getScoreColor(scoreNum);

  return (
    <View style={GlobalStyles.corruptionIndexContainer}>
      <ThemedText style={GlobalStyles.metricTitle}>{title}</ThemedText>

      <View style={styles.content}>
        <View style={styles.scoreRow}>
          <View style={styles.badgeCol}>
            <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
              <ThemedText style={styles.scoreText}>{scoreNum}</ThemedText>
              <ThemedText style={styles.scoreLabel}>INDEX</ThemedText>
            </View>
            <View style={styles.badgeConfidence}>
              <ThemedText style={GlobalStyles.corruptionIndexConfidenceValue}>
                {(confidenceNum * 100).toFixed(0)}%
              </ThemedText>
              <ThemedText style={GlobalStyles.corruptionIndexConfidenceLabel}>
                CONFIDENCE
              </ThemedText>
            </View>
          </View>

          <View style={styles.metaCol}>
            <View style={styles.metaItem}>
              <View style={styles.iconPadding}>
                <Ionicons
                  name="business"
                  size={21} // 14 * 1.5 = 21
                  color={Colors.light.textTertiary}
                />
              </View>
              <View>
                <ThemedText style={GlobalStyles.corruptionIndexMetaText}>
                  {donor}
                </ThemedText>
                <ThemedText style={GlobalStyles.corruptionIndexIndustryText}>
                  {industry}
                </ThemedText>
              </View>
            </View>
            <View style={styles.metaItem}>
              <View style={styles.iconPadding}>
                <Ionicons
                  name="cash"
                  size={21} // 14 * 1.5 = 21
                  color={Colors.light.textTertiary}
                />
              </View>
              <ThemedText style={GlobalStyles.corruptionIndexMetaText}>
                {amount} Contribution
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <View style={styles.iconPadding}>
                <Ionicons
                  name="checkmark-circle"
                  size={21} // 14 * 1.5 = 21
                  color={Colors.light.textTertiary}
                />
              </View>
              <ThemedText style={GlobalStyles.corruptionIndexMetaText}>
                Vote Action: {voteAction}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.insightBox}>
          <ThemedText style={GlobalStyles.corruptionIndexInsightTitle}>
            ANALYST INSIGHT
          </ThemedText>
          <ThemedText style={GlobalStyles.corruptionIndexInsightText}>
            {insight}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: Spacing.xs,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Top aligned with legend
    marginBottom: Spacing.md,
  },
  badgeCol: {
    alignItems: "center",
    marginRight: Spacing.md,
    gap: 0, // Tightened vertical space above confidence
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center", // Vertically center the score and label
  },
  badgeConfidence: {
    alignItems: "center",
    gap: 0,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: Typography.weights.heavy as any,
    color: "#FFFFFF",
    paddingTop: 4, // Slight top padding for visual centering
    lineHeight: 28, // Controlled vertical rhythm
    includeFontPadding: false, // Prevents Android-specific padding issues
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs, // Bumped from 8
    fontWeight: Typography.weights.bold as any,
    color: "#FFFFFF",
    textTransform: "uppercase" as any,
    includeFontPadding: false,
  },
  metaCol: {
    flex: 1,
    gap: 4, // Slightly increased from 2 for better distinction between items
    paddingLeft: 10, // 10px left padding for legend
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "flex-start", // Top aligned per user request
    gap: 10, // Increased gap for larger icons
    paddingVertical: 1,
  },
  iconPadding: {
    paddingTop: 2, // Fine-tuned alignment with text baseline
  },
  insightBox: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: Spacing.sm,
    borderRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.textTertiary,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Align to bottom to handle multiple lines in footerLeft
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    paddingTop: Spacing.xs, // Reduced from sm (8px to 4px)
  },
  footerLeft: {
    flex: 1,
    gap: 0, // Absolute minimum vertical space
  },
  footerSubtext: {
    fontSize: 9,
    color: Colors.light.textTertiary,
    letterSpacing: 0.5,
    lineHeight: 11, // Tight line height
    includeFontPadding: false,
  },
  footerLabel: {
    fontSize: 9, // Synced with footerSubtext
    fontWeight: Typography.weights.semibold as any,
  },
});

// Register Molecule
ComponentFactory.register("Metric.CorruptionIndex", ({ value }) => (
  <CorruptionIndexMolecule data={value} />
));
