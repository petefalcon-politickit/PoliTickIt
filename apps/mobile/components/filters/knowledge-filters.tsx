import { Colors, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface FilterOption {
  id: string;
  label: string;
}

const TOPICS: FilterOption[] = [
  { id: "1", label: "Financial Systems" },
  { id: "2", label: "Legislative Process" },
  { id: "3", label: "Foreign Policy" },
  { id: "4", label: "Constitutional Law" },
  { id: "5", label: "Environmental Policy" },
  { id: "6", label: "Civil Rights" },
];

export const KnowledgeTopicsFilter = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Select Topics</Text>
      <View style={styles.grid}>
        {TOPICS.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={[
              styles.chip,
              selectedTopics.includes(topic.id) && styles.chipSelected,
            ]}
            onPress={() => toggleTopic(topic.id)}
          >
            <Text
              style={[
                styles.chipText,
                selectedTopics.includes(topic.id) && styles.chipTextSelected,
              ]}
            >
              {topic.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export const KnowledgeSavedFilter = () => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="bookmark-outline"
        size={48}
        color={Colors.light.textGray}
      />
      <Text style={styles.emptyText}>You haven't saved any topics yet.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  chipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.light.textSlate,
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: Typography.weights.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.light.textGray,
    marginTop: 16,
    fontSize: Typography.sizes.base,
  },
});
