import { ThemedText } from "@/components/themed-text";
import { Typography } from "@/constants/theme";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CollectiveSignalLogoProps {
  showText?: boolean;
  size?: number;
  variant?: "primary" | "outline" | "solid";
}

export const CollectiveSignalLogo: React.FC<CollectiveSignalLogoProps> = ({
  showText = true,
  size = 14,
  variant = "primary",
}) => {
  const isSolid = variant === "primary" || variant === "solid";

  return (
    <View style={[styles.container, isSolid ? styles.primary : styles.outline]}>
      <Image
        source={require("@/assets/images/empty-flag.png")}
        style={{ width: size, height: size }}
        contentFit="contain"
        tintColor={isSolid ? "#FFFFFF" : "#E53E3E"}
      />
      {showText && (
        <ThemedText
          style={[
            styles.text,
            isSolid ? styles.primaryText : styles.outlineText,
          ]}
        >
          COLLECTIVE
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  primary: {
    backgroundColor: "#E53E3E", // Crimson Red
  },
  outline: {
    backgroundColor: "rgba(229, 62, 62, 0.05)",
    borderWidth: 1,
    borderColor: "#E53E3E", // Solid border to avoid "incomplete" look
  },
  text: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy as any,
    letterSpacing: 0.5,
  },
  primaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#E53E3E",
  },
});
