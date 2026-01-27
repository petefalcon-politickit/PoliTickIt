import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CapitalLogoProps {
  credits?: number;
  tier?: number;
  size?: number;
}

export const CapitalLogo: React.FC<CapitalLogoProps> = ({
  credits,
  tier,
  size = 24,
}) => {
  // Tier Logic aligned with participation.tsx
  const getTierInfo = (credits?: number, forcedTier?: number) => {
    if (forcedTier === 4 || (credits !== undefined && credits >= 2500))
      return { icon: "diamond", color: "#8B5CF6", level: 4 };
    if (forcedTier === 3 || (credits !== undefined && credits >= 1200))
      return {
        icon: "shield-checkmark",
        color: Colors.light.secondary,
        level: 3,
      };
    if (forcedTier === 2 || (credits !== undefined && credits >= 500))
      return { icon: "flash", color: Colors.light.primary, level: 2 };
    return { icon: "flash-outline", color: "#94A3B8", level: 1 };
  };

  const { icon, color } = getTierInfo(credits, tier);

  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
