import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const {{componentName}} = ({ data, presentation, extraProps }: any) => {
  // Your component logic here
  return (
    <View style={styles.container}>
      <ThemedText>Hello from {{componentName}}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
});

// Register the cohesive element
ComponentFactory.register(
  "{{componentType}}",
  ({ value, presentation, extraProps }) => (
    <{{componentName}}
      data={value}
      presentation={presentation}
      extraProps={extraProps}
    />
  ),
);
