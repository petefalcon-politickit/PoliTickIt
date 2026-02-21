import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Narrative.Congressional.Debate
 *
 * A high-fidelity molecule for summarizing floor debates.
 * Persona-driven: Uses simple terms for novice community members.
 */
export const NarrativeCongressionalDebate = ({ data, snapId }: any) => {
  const {
    id,
    title,
    date,
    chamber,
    crMetadata, // { volume, number, billOrResolution }
    result,
    summary,
    classification,
    policyAreas, // Array of strings (top 3)
    representatives, // Array of { name, state, party, arguments: [{ text, position: 'for' | 'against' }] }
    references, // Array of { id, type }
  } = data || {};

  const router = useRouter();

  const handleVerifyTranscripts = () => {
    router.push({
      pathname: "/snap-viewer",
      params: { parentId: snapId, type: "statements" },
    });
  };

  return (
    <View style={GlobalStyles.congressionalDebateContainer}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.metaTop}>
          <ThemedText style={styles.idLabel}>ID: {id}</ThemedText>
          <View style={styles.chamberBadge}>
            <ThemedText style={styles.chamberText}>
              {chamber?.toUpperCase()}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {crMetadata?.billOrResolution && (
          <ThemedText style={styles.billNumber}>
            {crMetadata.billOrResolution}
          </ThemedText>
        )}
        <View style={styles.metaBottom}>
          <ThemedText style={styles.dateText}>{date}</ThemedText>
          <ThemedText style={styles.dot}>•</ThemedText>
          <ThemedText style={styles.classificationText}>
            {classification}
          </ThemedText>
        </View>
      </View>

      {/* SUMMARY SECTION */}
      <View style={styles.summaryContainer}>
        <ThemedText style={styles.sectionLabel}>WHAT'S HAPPENING</ThemedText>
        <ThemedText style={styles.summaryText}>{summary}</ThemedText>
      </View>

      {/* REPRESENTATIVES & ARGUMENTS */}
      <View style={styles.positionsContainer}>
        <ThemedText style={styles.sectionLabel}>WHO SAID WHAT</ThemedText>
        {representatives?.map((rep: any, i: number) => (
          <View key={i} style={styles.repBlock}>
            <View style={styles.repHeader}>
              <ThemedText style={styles.repName}>
                {rep.name} ({rep.party}-{rep.state})
              </ThemedText>
            </View>
            <View style={styles.argumentsList}>
              {rep.arguments?.map((arg: any, j: number) => (
                <View key={j} style={styles.argumentItem}>
                  <Ionicons
                    name={
                      arg.position === "for"
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={14}
                    color={
                      arg.position === "for"
                        ? Colors.light.success
                        : Colors.light.error
                    }
                    style={styles.argIcon}
                  />
                  <ThemedText style={styles.argumentText}>
                    <ThemedText
                      style={[
                        styles.posLabel,
                        {
                          color:
                            arg.position === "for"
                              ? Colors.light.success
                              : Colors.light.error,
                        },
                      ]}
                    >
                      {arg.position === "for" ? "SUPPORTING: " : "OPPOSING: "}
                    </ThemedText>
                    {arg.text}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* REFERENCES & METADATA */}
      <View style={styles.footer}>
        <View style={styles.metadataRow}>
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaLabel}>RESULT</ThemedText>
            <ThemedText style={styles.metaValue}>{result}</ThemedText>
          </View>
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaLabel}>OFFICIAL RECORD</ThemedText>
            <ThemedText style={styles.metaValue}>
              Vol {crMetadata?.volume}, No {crMetadata?.number}
            </ThemedText>
          </View>
        </View>

        {references?.length > 0 && (
          <View style={styles.referencesContainer}>
            <ThemedText style={styles.metaLabel}>
              RELATED BILLS & AMENDMENTS
            </ThemedText>
            <View style={styles.refList}>
              {references.map((ref: any, i: number) => (
                <View key={i} style={styles.refBadge}>
                  <ThemedText style={styles.refBadgeText}>{ref.id}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.policyRow}>
          {policyAreas?.slice(0, 3).map((area: string, i: number) => (
            <ThemedText key={i} style={styles.policyTag}>
              #{area.replace(/\s+/g, "")}
            </ThemedText>
          ))}
        </View>

        <TouchableOpacity
          style={GlobalStyles.continuumFooter}
          activeOpacity={0.7}
          onPress={handleVerifyTranscripts}
        >
          <View style={styles.drillDownContent}>
            <ThemedText style={GlobalStyles.continuumLabel}>
              TRUST THREAD™
            </ThemedText>
            <ThemedText style={GlobalStyles.continuumSubtext}>
              Verbatim floor transcripts & procedural logs
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.md,
  },
  metaTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
  },
  chamberBadge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chamberText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.textSecondary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
    lineHeight: 20,
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  billNumber: {
    fontSize: 15,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  metaBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  dot: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  classificationText: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    fontStyle: "italic",
  },
  summaryContainer: {
    backgroundColor: "rgba(34, 113, 186, 0.04)",
    padding: Spacing.sm,
    borderRadius: 6,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.textSlate,
  },
  positionsContainer: {
    marginBottom: Spacing.lg,
  },
  repBlock: {
    marginBottom: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(0,0,0,0.05)",
    paddingLeft: Spacing.sm,
  },
  repHeader: {
    marginBottom: 4,
  },
  repName: {
    fontSize: 13,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
  },
  argumentsList: {
    gap: 6,
  },
  argumentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  argIcon: {
    marginTop: 2,
  },
  argumentText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.light.textSecondary,
  },
  posLabel: {
    fontSize: 11,
    fontWeight: Typography.weights.heavy as any,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: Spacing.md,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.textSecondary,
  },
  referencesContainer: {
    marginBottom: Spacing.md,
  },
  refList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  refBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  refBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.primary,
  },
  policyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  policyTag: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
  },
  drillDownContent: {
    flex: 1,
  },
});

ComponentFactory.register(
  "Narrative.Congressional.Debate",
  ({ value, extraProps }) => (
    <NarrativeCongressionalDebate data={value} snapId={extraProps?.snapId} />
  ),
);
