import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * PoliPulse Logo Design 1: The Oscillating P
 *
 * A geometric 'p' where the vertical stem transitions into a sharp EKG spike.
 * Designed to be grayscale, copyrightable, and minimalist.
 */
export const PulseLogoOscillatingP = ({ size = 48 }: { size?: number }) => {
  const pSize = size * 0.5;
  const loopSize = pSize;
  const strokeWidth = Math.max(size * 0.08, 1.5);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* The 'p' Loop */}
      <View
        style={[
          styles.pLoop,
          {
            width: loopSize,
            height: loopSize,
            borderRadius: loopSize / 2,
            borderWidth: strokeWidth,
            borderColor: "#000000",
            position: "absolute",
            top: size * 0.1,
            left: size * 0.3,
          },
        ]}
      />

      {/* The Oscillating Stem */}
      <View
        style={[
          styles.stemContainer,
          {
            width: strokeWidth,
            height: size * 0.7,
            position: "absolute",
            top: size * 0.1,
            left: size * 0.3,
            backgroundColor: "#000000",
          },
        ]}
      />

      {/* The Pulse Spike (The "Oscillation") */}
      <View
        style={[
          styles.pulseLine,
          {
            position: "absolute",
            bottom: size * 0.1,
            left: size * 0.2,
            width: size * 0.7,
            height: strokeWidth,
            flexDirection: "row",
            alignItems: "flex-end",
          },
        ]}
      >
        <View
          style={[
            styles.spike,
            { height: strokeWidth, backgroundColor: "#000" },
          ]}
        />
        <View
          style={[
            styles.spikeMain,
            {
              height: size * 0.45,
              width: strokeWidth,
              backgroundColor: "#222",
              marginHorizontal: strokeWidth / 2,
            },
          ]}
        />
        <View
          style={[
            styles.spike,
            { height: strokeWidth, backgroundColor: "#666" },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  pLoop: {
    backgroundColor: "transparent",
  },
  stemContainer: {},
  pulseLine: {},
  spike: {
    flex: 1,
  },
  spikeMain: {
    borderRadius: 1,
  },
});
