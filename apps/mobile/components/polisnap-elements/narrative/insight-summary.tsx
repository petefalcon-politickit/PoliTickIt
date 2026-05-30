import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const NarrativeInsightSummary = ({ data }: any) => {
  const [expanded, setExpanded] = useState(false);
  const { title, text, content, summary, sourceLink, isExpandable } =
    data || {};

  const bodyText = text || content || summary || "";
  const displayLimit = 250;
  const buffer = 30;
  const shouldTruncate =
    isExpandable && bodyText?.length > displayLimit + buffer;
  const displayText =
    !shouldTruncate || expanded
      ? bodyText
      : `${bodyText.slice(0, displayLimit)}...`;

  return (
    <View style={GlobalStyles.narrativeContainer}>
      <View style={styles.insightBox}>
        {title && <ThemedText style={styles.title}>{title}</ThemedText>}
        <ThemedText style={styles.text}>{displayText}</ThemedText>

        {shouldTruncate && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.moreButton}
          >
            <ThemedText style={styles.moreText}>
              {expanded ? "SHOW LESS" : "READ FULL INSIGHT"}
            </ThemedText>
          </TouchableOpacity>
        )}

        {sourceLink && (
          <TouchableOpacity style={styles.sourceContainer}>
            <ThemedText style={styles.sourceText}>
              SOURCE: {sourceLink}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  insightBox: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: Spacing.sm,
    borderRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.textTertiary,
  },
  title: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase" as any,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.light.text,
    fontStyle: "italic" as any,
  },
  moreButton: {
    marginTop: Spacing.sm,
  },
  moreText: {
    color: Colors.light.secondary,
    fontWeight: Typography.weights.heavy as any,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  sourceContainer: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.sm,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
});

ComponentFactory.register("Narrative.Insight.Summary", ({ value }) => (
  <NarrativeInsightSummary data={value} />
));
