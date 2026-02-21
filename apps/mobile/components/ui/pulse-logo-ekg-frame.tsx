import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * PoliPulse Logo Design 2: The EKG Frame
 *
 * A sharp pulse line breaking through the boundaries of a square frame.
 * Symbolizes the "Voice of the People" breaking institutional barriers.
 */
export const PulseLogoEKGFrame = ({ size = 48 }: { size?: number }) => {
  const frameSize = size * 0.75;
  const strokeWidth = Math.max(size * 0.1, 1.2);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* The Institutional Frame */}
      <View
        style={[
          styles.frame,
          {
            width: frameSize,
            height: frameSize,
            borderWidth: strokeWidth,
            borderColor: "#000000",
            backgroundColor: "transparent",
            borderRadius: 2,
          },
        ]}
      />

      {/* The Pulse Line (Centered and Breaking) */}
      <View style={[styles.pulseContainer, { width: size, height: size }]}>
        {/* Lead-in */}
        <View
          style={[
            styles.lineSegment,
            {
              width: size * 0.35,
              height: strokeWidth,
              backgroundColor: "#000000",
              top: size * 0.5 - strokeWidth / 2,
              left: 0,
            },
          ]}
        />
        {/* High Spike */}
        <View
          style={[
            styles.spikeUp,
            {
              width: strokeWidth,
              height: size * 0.8,
              backgroundColor: "#000000",
              left: size * 0.45,
              top: size * 0.1,
              position: "absolute",
            },
          ]}
        />
        {/* Lead-out */}
        <View
          style={[
            styles.lineSegment,
            {
              width: size * 0.35,
              height: strokeWidth,
              backgroundColor: "#000000",
              top: size * 0.5 - strokeWidth / 2,
              right: 0,
            },
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
  frame: {
    position: "absolute",
  },
  pulseContainer: {
    position: "absolute",
    flexDirection: "row",
  },
  lineSegment: {
    position: "absolute",
  },
  spikeUp: {
    zIndex: 10,
  },
});
