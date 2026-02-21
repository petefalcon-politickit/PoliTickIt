import { Colors, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BadgeProps {
  value: number | string;
  type?: "red" | "blue";
}

export const Badge: React.FC<BadgeProps> = ({ value, type = "red" }) => {
  const backgroundColor =
    type === "red" ? Colors.light.accent : Colors.light.primary;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor },
        type === "blue" && styles.blueBadge,
      ]}
    >
      <Text style={styles.badgeText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 4, // Mechanical Sharpness
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  blueBadge: {
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    textAlign: "center",
  },
});
