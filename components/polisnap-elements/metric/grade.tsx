import ElementFactory from "@/components/factories/element-factory";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface GradeData {
  label: string;
  grade: string;
  color?: string;
  description?: string;
}

const GradeMetric = (element: { data: GradeData }) => {
  const { label, grade, color, description } = element.data;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
      <View style={styles.gradeCircle}>
        <View
          style={[
            styles.outerRing,
            { borderColor: color || Colors.light.tint },
          ]}
        >
          <ThemedText
            style={[styles.gradeText, { color: color || Colors.light.tint }]}
          >
            {grade}
          </ThemedText>
        </View>
      </View>
      {description && (
        <ThemedText style={styles.description}>{description}</ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 12,
  },
  header: {
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    letterSpacing: 1,
    opacity: 0.6,
    textTransform: "uppercase",
  },
  gradeCircle: {
    marginBottom: 8,
  },
  outerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  gradeText: {
    fontSize: 24,
    fontFamily: "Inter-Heavy",
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
    maxWidth: "80%",
  },
});

ElementFactory.register("Metric.Grade", GradeMetric);
