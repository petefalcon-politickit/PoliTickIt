import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

export const AuthCard = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  return (
    <View style={[styles.card, style]}>
      {/* Blue Corner Star Badge */}
      <View style={styles.badgeWrapper}>
        <Image
          source={require("@/assets/images/PoliTickIt-Corner-Star.svg")}
          style={styles.badgeImage}
          contentFit="contain"
        />
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden", // Important for the badge clipping
    position: "relative",
  },
  badgeWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    zIndex: 10,
  },
  badgeImage: {
    width: "100%",
    height: "100%",
  },
});
