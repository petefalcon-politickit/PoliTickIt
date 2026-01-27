import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface InsightUnlockGateProps {
  tier: number;
  requiredCredits: number;
  currentCredits: number;
  title: string;
  description: string;
}

export const InsightUnlockGate: React.FC<InsightUnlockGateProps> = ({
  tier,
  requiredCredits,
  currentCredits,
  title,
  description,
}) => {
  const borderColor = useThemeColor({}, "border");
  const progress = Math.min(currentCredits / requiredCredits, 1);

  return (
    <ThemedView
      style={[
        styles.container,
        { borderColor, backgroundColor: Colors.light.tint + "05" },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.tierBadge}>
          <ThemedText style={styles.tierLabel}>TIER {tier}</ThemedText>
        </View>
        <Ionicons
          name="lock-closed"
          size={16}
          color={Colors.light.tabIconDefault}
        />
      </View>

      <ThemedText style={styles.title} type="defaultSemiBold">
        {title}
      </ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>

      <View style={styles.progressSection}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PARTICIPATION PROGRESS</Text>
          <Text style={styles.progressValue}>
            {currentCredits} / {requiredCredits}
          </Text>
        </View>
        <View
          style={[styles.progressBarBase, { backgroundColor: borderColor }]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: Colors.light.tint,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Earn {requiredCredits - currentCredits} more credits by voting on
          snaps to unlock.
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
    borderRadius: 2,
    borderStyle: "dashed",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tierBadge: {
    backgroundColor: Colors.light.text,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  tierLabel: {
    color: "#FFF",
    fontSize: 9,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 9,
    fontFamily: "Inter-Bold",
    color: Colors.light.tabIconDefault,
  },
  progressValue: {
    fontSize: 10,
    fontFamily: "Inter-Medium",
  },
  progressBarBase: {
    height: 4,
    width: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  footer: {
    marginTop: 4,
  },
  footerText: {
    fontSize: 10,
    fontStyle: "italic",
    opacity: 0.6,
  },
});
