import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const NarrativeInsightSummary = ({ data }: any) => {
  const [expanded, setExpanded] = useState(false);
  const {
    title,
    text,
    content,
    summary,
    sourceLink,
    isExpandable,
    accentColor,
  } = data || {};

  const bodyText = text || content || summary || "";
  const displayLimit = 250;
  const buffer = 30; // Only truncate if expansion provides significant value
  const shouldTruncate =
    isExpandable && bodyText?.length > displayLimit + buffer;
  const displayText =
    !shouldTruncate || expanded
      ? bodyText
      : `${bodyText.slice(0, displayLimit)}...`;

  return (
    <View style={GlobalStyles.narrativeContainer}>
      {title && (
        <View style={styles.titleWrapper}>
          <SeveredTitle title={title} textAlign="left" style={styles.title} />
        </View>
      )}
      <View style={[styles.layout, title && { marginTop: 15 }]}>
        <View
          style={[
            styles.accentBar,
            { backgroundColor: accentColor || Colors.light.primary },
          ]}
        />
        <View style={styles.content}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    marginBottom: 0,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.text, // Standard visibility
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  layout: {
    flexDirection: "row" as any,
    alignItems: "flex-start",
  },
  accentBar: {
    width: 4,
    borderRadius: 2,
    alignSelf: "stretch",
    marginVertical: 2, // Tiny inset for visual air
  },
  content: {
    flex: 1,
    paddingLeft: Spacing.md,
  },
  text: {
    fontSize: Typography.sizes.base,
    lineHeight: 22,
    color: Colors.light.textSlate,
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
