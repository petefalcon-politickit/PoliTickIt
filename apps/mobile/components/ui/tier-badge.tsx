import { Colors, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

interface TierBadgeProps {
  credits: number;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ credits }) => {
  let tier = "TIER 1";
  let label = "CITIZEN MONITOR";

  if (credits > 5000) {
    tier = "TIER 4";
    label = "SOVEREIGNTY COUNCIL";
  } else if (credits > 1500) {
    tier = "TIER 3";
    label = "ACCOUNTABILITY LEAD";
  } else if (credits > 500) {
    tier = "TIER 2";
    label = "FORENSIC AUDITOR";
  }

  return (
    <View style={styles.container}>
      <View style={styles.tierContainer}>
        <ThemedText style={styles.tierText}>{tier}</ThemedText>
      </View>
      <View style={styles.labelContainer}>
        <ThemedText style={styles.labelText}>{label}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.light.primary,
    height: 16,
    borderRadius: 2,
    overflow: "hidden",
  },
  tierContainer: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  tierText: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: Typography.weights.heavy,
  },
  labelContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: 4,
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.primary,
  },
  labelText: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 8,
    color: Colors.light.primary,
    fontWeight: Typography.weights.medium,
  },
});
