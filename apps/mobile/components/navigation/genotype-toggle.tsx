import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { usePresentation } from "../../contexts/PresentationContext";
import { ThemedText } from "../themed-text";
import { IconSymbol } from "../ui/icon-symbol";

export const GenotypeToggle = () => {
  const { isGenotypeMode, toggleMode } = usePresentation();

  return (
    <Pressable
      onPress={toggleMode}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: isGenotypeMode ? "#2D3748" : "#164570" },
        pressed && { opacity: 0.7 },
      ]}
    >
      <IconSymbol
        name={isGenotypeMode ? "dna.fill" : "app.fill"}
        size={16}
        color="#FFFFFF"
      />
      <View style={styles.textContainer}>
        <ThemedText style={styles.text}>
          {isGenotypeMode ? "GENOTYPE" : "PHENOTYPE"}
        </ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  textContainer: {
    marginLeft: 6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
