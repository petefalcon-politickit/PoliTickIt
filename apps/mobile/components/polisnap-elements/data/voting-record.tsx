import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Data.Legislative.VotingRecord
 *
 * An Institutional molecule for tracking specific floor votes.
 * Prevents layout truncation of alphanumeric IDs (e.g. H.R. 8821).
 */
export const DataLegislativeVotingRecord = ({ data }: any) => {
  const {
    billId,
    billTitle,
    vote,
    outcome,
    date,
    chamber = "HOUSE",
    sponsor,
    tags,
  } = data || {};

  // Color mapping based on vote
  const getVoteStyles = (v: string) => {
    const normalized = v?.toLowerCase();
    if (normalized === "yea" || normalized === "aye" || normalized === "yes") {
      return { color: Colors.light.success, bg: Colors.light.successSubtle };
    }
    if (normalized === "nay" || normalized === "no") {
      return { color: Colors.light.error, bg: "rgba(197, 48, 48, 0.1)" };
    }
    return { color: Colors.light.textMuted, bg: Colors.light.background };
  };

  const voteStyles = getVoteStyles(vote);

  return (
    <View style={styles.container}>
      {/* Bill identifier Header */}
      <View style={styles.header}>
        <View style={styles.billIdContainer}>
          <ThemedText style={styles.billIdText}>{billId}</ThemedText>
        </View>
        <View style={styles.chamberBadge}>
          <ThemedText style={styles.chamberText}>{chamber}</ThemedText>
        </View>
      </View>

      {/* Bill Title */}
      <ThemedText style={styles.title} numberOfLines={2}>
        {billTitle}
      </ThemedText>

      {/* Vote & Outcome Row */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <ThemedText style={styles.label}>VOTE</ThemedText>
          <View style={[styles.voteBadge, { backgroundColor: voteStyles.bg }]}>
            <ThemedText style={[styles.voteText, { color: voteStyles.color }]}>
              {vote?.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.statusItem, styles.divider]}>
          <ThemedText style={styles.label}>OUTCOME</ThemedText>
          <ThemedText style={styles.outcomeText}>
            {outcome?.toUpperCase() || "PENDING"}
          </ThemedText>
        </View>

        <View style={[styles.statusItem, styles.divider]}>
          <ThemedText style={styles.label}>DATE</ThemedText>
          <ThemedText style={styles.dateText}>{date || "JAN 28"}</ThemedText>
        </View>
      </View>

      {/* Meta/Sponsor Info */}
      <View style={styles.footer}>
        {sponsor && (
          <View style={styles.sponsor}>
            <Ionicons
              name="person-outline"
              size={10}
              color={Colors.light.textTertiary}
            />
            <ThemedText style={styles.footerLabel}>
              SPONSOR: {sponsor}
            </ThemedText>
          </View>
        )}
        <View style={styles.tags}>
          {tags?.map((tag: string, i: number) => (
            <View key={i} style={styles.tag}>
              <ThemedText style={styles.tagText}>
                {tag.toUpperCase()}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// Register with ComponentFactory
ComponentFactory.register("data.legislative.votingrecord", (props) => (
  <DataLegislativeVotingRecord data={props.value} />
));

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    padding: 12,
    marginVertical: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  billIdContainer: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  billIdText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  chamberBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.light.separator,
    borderRadius: 2,
  },
  chamberText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.light.textTertiary,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    borderRadius: 2,
    padding: 8,
    marginBottom: 12,
  },
  statusItem: {
    flex: 1,
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.separator,
    paddingLeft: 12,
  },
  label: {
    fontSize: 8,
    fontWeight: "800",
    color: Colors.light.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  voteBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  voteText: {
    fontSize: 10,
    fontWeight: "900",
  },
  outcomeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light.textSecondary,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.textTertiary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sponsor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: Colors.light.textTertiary,
  },
  tags: {
    flexDirection: "row",
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.light.separator,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  tagText: {
    fontSize: 8,
    fontWeight: "700",
    color: Colors.light.textSlate,
  },
});
