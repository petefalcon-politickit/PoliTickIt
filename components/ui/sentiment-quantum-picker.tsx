import { Colors, Typography } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "./icon-symbol";

export type SentimentType = "negative" | "neutral" | "positive";

export interface SentimentOption {
  id: string;
  label: string;
  sentiment: SentimentType;
}

interface SentimentQuantumPickerProps {
  options?: SentimentOption[];
  onSelect: (option: SentimentOption) => void;
  selectedId?: string | null;
}

const DEFAULT_OPTIONS: SentimentOption[] = [
  { id: "oppose", label: "OPPOSE", sentiment: "negative" },
  { id: "neutral", label: "NEUTRAL", sentiment: "neutral" },
  { id: "support", label: "SUPPORT", sentiment: "positive" },
];

export const SentimentQuantumPicker: React.FC<SentimentQuantumPickerProps> = ({
  options = DEFAULT_OPTIONS,
  onSelect,
  selectedId,
}) => {
  const handlePress = (option: SentimentOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(option);
  };

  const getOptionColors = (index: number, total: number) => {
    const secondaryRgb = "34, 113, 186";
    const neutralLine = "rgba(74, 85, 104, 0.5)";
    const neutralLight = "rgba(0, 0, 0, 0.04)";

    let opacity = 0;

    if (total === 3) {
      if (index === 0) opacity = 0.2;
      if (index === 1) return { line: neutralLine, light: neutralLight };
      if (index === 2) opacity = 0.5;
    } else if (total === 4) {
      opacity = (index + 1) * 0.2; // 0.2, 0.4, 0.6, 0.8
    } else if (total === 2) {
      opacity = index === 0 ? 0.2 : 0.6;
    } else {
      // Default fallback
      opacity = 0.3;
    }

    return {
      line: `rgba(${secondaryRgb}, ${opacity})`,
      light: `rgba(${secondaryRgb}, ${opacity * 0.2})`, // Tint proportional to opacity
    };
  };

  const getIconName = (sentiment: SentimentType) => {
    switch (sentiment) {
      case "positive":
        return "hand.thumbsup.fill";
      case "negative":
        return "hand.thumbsdown.fill";
      case "neutral":
        return "minus";
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsRow}>
        {options.map((option, index) => {
          const isActive = selectedId === option.id;
          const isNeutral = option.sentiment === "neutral";
          const { line, light } = getOptionColors(index, options.length);

          const bgColor = isActive ? light : "#FFFFFF"; // Standardized to white
          const borderColor = isActive ? line : Colors.light.border;
          const textColor = isActive
            ? Colors.light.primary
            : Colors.light.textSecondary;
          const iconColor = textColor; // Match icon color to text color

          const isThreeOptions = options.length === 3;

          // Layout scaling: Neutral is smaller (22%), Others are larger (36% approx)
          const flexBasisValue = isThreeOptions
            ? isNeutral
              ? "22%"
              : "36.5%"
            : "48%";

          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.7}
              onPress={() => handlePress(option)}
              style={[
                styles.option,
                {
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  flexBasis: flexBasisValue,
                  borderWidth: 1, // Use standard Pulse border instead of shadow
                },
              ]}
            >
              {getIconName(option.sentiment) && (
                <IconSymbol
                  name={getIconName(option.sentiment) as any}
                  size={14}
                  color={iconColor as any}
                />
              )}
              <Text style={[styles.optionText, { color: textColor }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 0, // Removed to allow container padding to control layout
  },
  optionsRow: {
    flexDirection: "row",
    gap: 5,
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  option: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 38,
    borderRadius: 4, // Mechanical Sharpness
    alignItems: "center" as any,
    justifyContent: "center" as any,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.light.border, // Standardized Pulse border
    flexDirection: "row" as any,
    gap: 4,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.sizes.xs, // Increased from 10
    fontWeight: Typography.weights.bold as any, // Standardized to Bold
    fontFamily: Typography.fonts.sans,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5, // Increased from 0.2
    textAlign: "center" as any,
  },
});
