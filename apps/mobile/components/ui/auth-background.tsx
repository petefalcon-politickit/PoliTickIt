import { Colors } from "@/constants/theme";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export const AuthBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      {/* Blue Background Base */}
      <View style={styles.blueBackground} />

      {/* Flag Ripple Pattern (Parallel Red Stripes) */}
      <View style={styles.patternContainer}>
        {[0, 1, 2, 3].map((i) => (
          <Image
            key={i}
            source={require("@/assets/images/PoliTickIt-Red-Wave.svg")}
            style={[
              styles.stripe,
              {
                top: height * 0.1 + i * (height / 6.25),
                transform: [{ rotate: "-8deg" }],
              },
            ]}
            contentFit="cover"
          />
        ))}
      </View>

      <View style={styles.overlay}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  blueBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#164570",
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1.0,
  },
  stripe: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 120,
  },
  overlay: {
    flex: 1,
  },
});
