import { Colors, Spacing, Typography } from "@/constants/theme";
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
    backgroundColor: Colors.light.border,
    borderRadius: 22,
    padding: 2,
    alignSelf: "flex-start", // Default to sizing to content width
  },
  segment: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  activeSegment: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  segmentText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textSlate,
  },
  activeSegmentText: {
    color: Colors.light.text,
  },
});
