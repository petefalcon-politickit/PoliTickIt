import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Data.FloorDebate
 * Displays a structured floor-debate record: vote tally, speaker positions (For / Against),
 * and optional quoted floor statements. Designed for Accountability PoliSnaps that capture
 * a specific legislative debate moment.
 */
export const DataFloorDebate = ({ data }: any) => {
  const { voteFor, voteAgainst, voteAbstain, speakers } = data || {};

  const total = (voteFor ?? 0) + (voteAgainst ?? 0) + (voteAbstain ?? 0);
  const forPct = total > 0 ? Math.round(((voteFor ?? 0) / total) * 100) : 0;

  const forSpeakers: any[] = (speakers ?? []).filter(
    (s: any) => s.position === "For",
  );
  const againstSpeakers: any[] = (speakers ?? []).filter(
    (s: any) => s.position === "Against",
  );

  return (
    <View style={styles.container}>
      {/* Vote Tally Bar */}
      {total > 0 && (
        <View style={styles.tallySection}>
          <View style={styles.tallyRow}>
            <ThemedText style={styles.tallyFor}>{voteFor ?? 0} FOR</ThemedText>
            <ThemedText style={styles.tallyAgainst}>
              {voteAgainst ?? 0} AGAINST
            </ThemedText>
            {(voteAbstain ?? 0) > 0 && (
              <ThemedText style={styles.tallyAbstain}>
                {voteAbstain} NV
              </ThemedText>
            )}
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFor, { flex: voteFor ?? 0 }]} />
            <View style={[styles.barAgainst, { flex: voteAgainst ?? 0 }]} />
          </View>
          <ThemedText style={styles.pctNote}>
            {forPct}% voted in favor
          </ThemedText>
        </View>
      )}

      {/* Speaker Positions */}
      {(forSpeakers.length > 0 || againstSpeakers.length > 0) && (
        <View style={styles.speakersSection}>
          {forSpeakers.length > 0 && (
            <View style={styles.speakerGroup}>
              <View style={styles.positionLabel}>
                <ThemedText style={[styles.positionText, { color: "#15803D" }]}>
                  IN SUPPORT
                </ThemedText>
              </View>
              {forSpeakers.map((s: any, i: number) => (
                <SpeakerCard key={i} speaker={s} position="For" />
              ))}
            </View>
          )}
          {againstSpeakers.length > 0 && (
            <View style={[styles.speakerGroup, { marginTop: Spacing.sm }]}>
              <View style={styles.positionLabel}>
                <ThemedText style={[styles.positionText, { color: "#B91C1C" }]}>
                  IN OPPOSITION
                </ThemedText>
              </View>
              {againstSpeakers.map((s: any, i: number) => (
                <SpeakerCard key={i} speaker={s} position="Against" />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

/**
 * Individual speaker card with quote
 */
const SpeakerCard = ({
  speaker,
  position,
}: {
  speaker: any;
  position: "For" | "Against";
}) => {
  const { name, title, quote, party } = speaker || {};
  const accentColor = position === "For" ? "#15803D" : "#B91C1C";

  return (
    <View style={styles.speakerCard}>
      <View style={styles.speakerHeader}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.speakerName}>{name}</ThemedText>
          {title && (
            <ThemedText style={styles.speakerTitle}>{title}</ThemedText>
          )}
        </View>
      </View>
      {quote && (
        <View style={[styles.quoteBlock, { borderLeftColor: accentColor }]}>
          <ThemedText style={styles.quoteText}>"{quote}"</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
  tallySection: {
    marginBottom: Spacing.sm,
  },
  tallyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 10,
  },
  tallyFor: {
    fontSize: 11,
    fontFamily: Typography.fonts.mono,
    fontWeight: "900" as any,
    color: "#15803D",
    letterSpacing: 0.6,
  },
  tallyAgainst: {
    fontSize: 11,
    fontFamily: Typography.fonts.mono,
    fontWeight: "900" as any,
    color: "#B91C1C",
    letterSpacing: 0.6,
  },
  tallyAbstain: {
    fontSize: 10,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
  },
  barTrack: {
    flexDirection: "row",
    height: 5,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: Colors.light.border,
  },
  barFor: {
    backgroundColor: "#15803D",
  },
  barAgainst: {
    backgroundColor: "#B91C1C",
  },
  pctNote: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    marginTop: 3,
    fontWeight: Typography.weights.semibold as any,
  },
  speakersSection: {
    marginTop: Spacing.xs,
  },
  speakerGroup: {},
  positionLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  positionText: {
    fontSize: 9,
    fontFamily: Typography.fonts.mono,
    fontWeight: "900" as any,
    letterSpacing: 1,
    textTransform: "uppercase" as any,
  },
  speakerCard: {
    marginBottom: Spacing.md,
  },
  speakerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  partyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  speakerName: {
    fontSize: 12,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.text,
    lineHeight: 16,
  },
  speakerTitle: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    fontWeight: Typography.weights.medium as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.4,
  },
  quoteBlock: {
    marginTop: 4,
    paddingLeft: 8,
    borderLeftWidth: 2,
  },
  quoteText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontStyle: "italic" as any,
    lineHeight: 16,
  },
});

// Component Registration
ComponentFactory.register("Data.FloorDebate", ({ value }) => (
  <DataFloorDebate data={value} />
));
