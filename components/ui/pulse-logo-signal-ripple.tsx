import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * PoliPulse Logo Design 3: The Signal Ripple
 *
 * Concentric arcs expanding from a central dot.
 * Represents the "Ripple Effect" of constituent sentiment.
 */
export const PulseLogoSignalRipple = ({
  size = 48,
  color = "#000000",
}: {
  size?: number;
  color?: string;
}) => {
  const dotSize = size * 0.25;
  const strokeWidth = Math.max(size * 0.1, 1.2);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Central Dot (The User) */}
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
            position: "absolute",
            left: size * 0.1,
          },
        ]}
      />

      {/* Ripple 1 */}
      <View
        style={[
          styles.ripple,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: size * 0.3,
            borderWidth: strokeWidth,
            borderColor: "#333333",
            borderLeftColor: "transparent",
            borderBottomColor: "transparent",
            transform: [{ rotate: "45deg" }],
            left: size * -0.1,
          },
        ]}
      />

      {/* Ripple 2 */}
      <View
        style={[
          styles.ripple,
          {
            width: size * 1.0,
            height: size * 1.0,
            borderRadius: size * 0.5,
            borderWidth: strokeWidth,
            borderColor: "#888888",
            borderLeftColor: "transparent",
            borderBottomColor: "transparent",
            transform: [{ rotate: "45deg" }],
            left: size * -0.3,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    zIndex: 10,
  },
  ripple: {
    position: "absolute",
    backgroundColor: "transparent",
  },
});
