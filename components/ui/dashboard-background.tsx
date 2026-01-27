import { Colors } from "@/constants/theme";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

/**
 * DashboardBackground
 * A more subtle version of the Signal Ripple™ for main application screens.
 * Uses transparency and positioning to maintain brand identity without distracting.
 */
export const DashboardBackground = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <View style={styles.container}>
      {/* Subtle background base */}
      <View style={styles.whiteBackground} />

      {/* Signal Ripple (Single subtle stripe at the top) */}
      <View style={styles.patternContainer}>
        <Image
          source={require("@/assets/images/PoliTickIt-Red-Wave.svg")}
          style={[
            styles.stripe,
            {
              top: -OFFSET,
              opacity: 0.05, // Very subtle
              transform: [{ rotate: "-5deg" }],
            },
          ]}
          contentFit="cover"
        />
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const OFFSET = height * 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  whiteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.background,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  stripe: {
    position: "absolute",
    width: width * 1.5,
    height: height * 0.25,
    left: -width * 0.2,
  },
  content: {
    flex: 1,
  },
});
