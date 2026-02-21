import { Colors, Typography } from "@/constants/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface Option {
  label: string;
  value: string;
}

interface MultiToggleProps {
  options: string[] | Option[];
  currentValue: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
}

/**
 * Reusable multi-toggle (segmented control) component.
 * Sized to text width with consistent rounded corners.
 */
export const MultiToggle = ({
  options,
  currentValue,
  onChange,
  style,
}: MultiToggleProps) => {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  return (
    <View style={[styles.segmentedControl, style]}>
      {normalizedOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.segment,
            currentValue === option.value && styles.activeSegment,
          ]}
          onPress={() => onChange(option.value)}
        >
          <Text
            style={[
              styles.segmentText,
              currentValue === option.value && styles.activeSegmentText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0", // Recessed track for better contrast against white cards
    borderRadius: 8,
    padding: 2,
    alignSelf: "stretch", // Span full width of card
  },
  segment: {
    flex: 1, // Distribute evenly
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeSegment: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    // Strengthened shadow for mechanical depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  segmentText: {
    fontSize: 10,
    fontFamily: Typography.fonts.mono,
    fontWeight: "700",
    color: "#64748B", // Slate 500 for inactive
  },
  activeSegmentText: {
    color: Colors.light.primary,
    fontWeight: "800",
  },
});
