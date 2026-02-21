import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Narrative.Congressional.Statement
 *
 * A specialized narrative block for transcript excerpts from the Congressional Record.
 * Features a quote block layout with speaker attribution and official verification.
 */
export const NarrativeCongressionalStatement = ({ data, snapId }: any) => {
  const {
    quote,
    text,
    speaker,
    representative,
    date,
    context,
    fullTranscriptId,
  } = data || {};

  const displayQuote = quote || text;
  const displaySpeaker = speaker || representative?.name || "Floor Proceeding";
  const displayContext = context || "Legislative Session";

  const router = useRouter();

  const handleViewFullTranscript = () => {
    if (fullTranscriptId) {
      router.push({
        pathname: "/snap-viewer",
        params: { id: fullTranscriptId },
      });
    }
  };

  return (
    <View style={GlobalStyles.congressionalRecordContainer}>
      <View style={styles.header}>
        <View style={styles.sourceBadge}>
          <Ionicons
            name="document-text-outline"
            size={10}
            color={Colors.light.textMuted}
          />
          <ThemedText style={styles.sourceText}>
            CONGRESSIONAL RECORD
          </ThemedText>
        </View>
        <ThemedText style={styles.dateText}>{date || "JAN 2026"}</ThemedText>
      </View>

      <View style={styles.quoteBody}>
        <View style={styles.quoteMarkContainer}>
          <ThemedText style={styles.quoteMark}>“</ThemedText>
        </View>
        <ThemedText style={styles.quoteText}>
          {displayQuote || "No statement available in current record pull."}
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <View style={styles.speakerInfo}>
          <ThemedText style={styles.speakerName}>{displaySpeaker}</ThemedText>
          <ThemedText style={styles.contextText}>{displayContext}</ThemedText>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons
            name="checkmark-circle"
            size={12}
            color={Colors.light.success}
          />
          <ThemedText style={styles.verifiedText}>VERIFIED EXCERPT</ThemedText>
        </View>
      </View>

      {fullTranscriptId && (
        <TouchableOpacity
          style={GlobalStyles.continuumFooter}
          activeOpacity={0.7}
          onPress={handleViewFullTranscript}
        >
          <View style={styles.drillDownContent}>
            <ThemedText style={GlobalStyles.continuumLabel}>
              TRUST THREAD™
            </ThemedText>
            <ThemedText style={GlobalStyles.continuumSubtext}>
              Review the complete unedited floor records
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sourceText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 10,
    color: Colors.light.textTertiary,
  },
  quoteBody: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  quoteMarkContainer: {
    paddingTop: 0,
  },
  quoteMark: {
    fontSize: 32,
    color: "rgba(15, 23, 42, 0.1)", // Slate 900 at 10%
    lineHeight: 32,
    marginTop: -8, // Adjusting for glyph vertical offset
    ...Platform.select({
      ios: { fontFamily: "Georgia" },
      android: { fontFamily: "serif" },
    }),
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.text,
    fontStyle: "italic",
    ...Platform.select({
      ios: { fontFamily: "Georgia" },
      android: { fontFamily: "serif" },
    }),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: Spacing.sm,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 12,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.primary,
  },
  contextText: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(56, 161, 105, 0.05)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: Typography.weights.extrabold as any,
    color: Colors.light.success,
    letterSpacing: 0.5,
  },
  drillDownContent: {
    flex: 1,
  },
});

ComponentFactory.register("Narrative.Congressional.Statement", (props) => (
  <NarrativeCongressionalStatement
    data={props.value}
    snapId={props.extraProps?.snapId}
  />
));

ComponentFactory.register("Narrative.Congressional.FloorStatement", (props) => (
  <NarrativeCongressionalStatement
    data={props.value}
    snapId={props.extraProps?.snapId}
  />
));
