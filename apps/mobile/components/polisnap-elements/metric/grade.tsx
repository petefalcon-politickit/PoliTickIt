import ElementFactory from "@/components/factories/element-factory";
import { ThemedText } from "@/components/themed-text";
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
  const gradeColor = color || Colors.light.tint;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.info}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          <ThemedText style={styles.description} numberOfLines={1}>
            {description}
          </ThemedText>
        </View>

        <View style={[styles.gradeBadge, { backgroundColor: gradeColor }]}>
          <ThemedText style={styles.gradeText}>{grade}</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.separator,
    width: "100%",
    // Sync with heroSection shadow from participation.tsx
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 0,
  },
  description: {
    fontSize: 12,
    color: Colors.light.textMuted,
    fontWeight: "600",
    marginTop: -2,
  },
  gradeBadge: {
    width: 48,
    height: 40,
    borderRadius: 6, // Refined rectilinear badge for "Standard" look
    justifyContent: "center",
    alignItems: "center",
  },
  gradeText: {
    fontSize: 18,
    fontWeight: "900", // Heavy weights for inverted grades
    color: Colors.light.backgroundSecondary,
  },
});

ElementFactory.register("Metric.Grade", GradeMetric);
