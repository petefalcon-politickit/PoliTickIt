import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Header.Bill
 * Displays legislative bill identity: bill ID, title, chamber, vote outcome, and date.
 * Used in floor-debate PoliSnaps for the top-of-card bill identification block.
 */
export const HeaderBill = ({ data }: any) => {
  const {
    billId,
    billTitle,
    chamber,
    voteOutcome,
    voteDate,
    congress,
    policyArea,
  } = data || {};

  const outcomeIsPass =
    typeof voteOutcome === "string" &&
    (voteOutcome.toLowerCase().includes("pass") ||
      voteOutcome.toLowerCase().includes("agreed"));

  const outcomeColor = outcomeIsPass
    ? (Colors.light.success ?? "#15803D")
    : (Colors.light.danger ?? "#B91C1C");

  const chamberIcon =
    chamber?.toLowerCase() === "senate" ? "business-outline" : "people-outline";

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.billIdChip}>
          <ThemedText style={styles.billIdText}>{billId}</ThemedText>
        </View>
        {congress && (
          <View style={styles.congressChip}>
            <ThemedText style={styles.congressText}>
              {congress}th Congress
            </ThemedText>
          </View>
        )}
        {voteDate && (
          <ThemedText style={styles.dateText}>{voteDate}</ThemedText>
        )}
      </View>

      <ThemedText style={styles.title} numberOfLines={3}>
        {billTitle}
      </ThemedText>

      <View style={styles.metaRow}>
        {chamber && (
          <View style={styles.chamberRow}>
            <Ionicons
              name={chamberIcon as any}
              size={11}
              color={Colors.light.textTertiary}
              style={{ marginRight: 3 }}
            />
            <ThemedText style={styles.metaText}>
              {chamber.toUpperCase()}
            </ThemedText>
          </View>
        )}
        {policyArea && (
          <ThemedText style={styles.metaText}>
            {" · "}
            {policyArea}
          </ThemedText>
        )}
        {voteOutcome && (
          <View style={[styles.outcomePill, { borderColor: outcomeColor }]}>
            <ThemedText style={[styles.outcomeText, { color: outcomeColor }]}>
              {voteOutcome}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: Spacing.xs,
    gap: 6,
  },
  billIdChip: {
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  billIdText: {
    fontSize: 10,
    fontFamily: Typography.fonts.mono,
    fontWeight: "900" as any,
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  congressChip: {
    backgroundColor: "rgba(30,58,95,0.08)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  congressText: {
    fontSize: 9,
    fontFamily: Typography.fonts.mono,
    fontWeight: "700" as any,
    color: "#1E3A5F",
    letterSpacing: 0.5,
    textTransform: "uppercase" as any,
  },
  dateText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.textTertiary,
    marginLeft: "auto" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 15,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.text,
    lineHeight: 21,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  chamberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  outcomePill: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: "auto" as any,
  },
  outcomeText: {
    fontSize: 9,
    fontFamily: Typography.fonts.mono,
    fontWeight: "900" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.6,
  },
});

// Component Registration
ComponentFactory.register("Header.Bill", ({ value }) => (
  <HeaderBill data={value} />
));
