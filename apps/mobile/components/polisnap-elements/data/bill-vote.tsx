import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const DataBillVote = ({ data, presentation, extraProps }: any) => {
  const { billName, vote, representativeName } = data || {};

  const getVoteStyle = () => {
    if (vote === "Yea") return styles.yea;
    if (vote === "Nay") return styles.nay;
    return styles.abstained;
  };

  const getVoteTextColor = () => {
    if (vote === "Yea") return Colors.light.success;
    if (vote === "Nay") return Colors.light.danger;
    return Colors.light.textSecondary;
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.billName}>{billName}</ThemedText>
      <View style={styles.voteContainer}>
        <ThemedText style={styles.repName}>
          {representativeName ? `${representativeName}'s vote:` : "Vote:"}
        </ThemedText>
        <View style={[styles.voteBubble, getVoteStyle()]}>
          <ThemedText style={[styles.voteText, { color: getVoteTextColor() }]}>
            {vote || "Yea"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.metricContainer,
    borderRadius: 4,
  },
  billName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  voteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  repName: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
  },
  voteBubble: {
    paddingHorizontal: Spacing.md,
    borderRadius: 4,
  },
  yea: {
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  nay: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
  },
  abstained: {
    backgroundColor: "rgba(149, 165, 166, 0.1)",
  },
  voteText: {
    fontWeight: "bold",
    fontSize: Typography.sizes.sm,
  },
});

// Register the cohesive element
ComponentFactory.register(
  "Data.BillVote",
  ({ value, presentation, extraProps }) => (
    <DataBillVote
      data={value}
      presentation={presentation}
      extraProps={extraProps}
    />
  ),
);
