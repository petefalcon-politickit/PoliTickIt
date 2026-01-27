import { Colors, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const WatchlistFavoritesFilter = () => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>Filter Favorites</Text>
    <View style={styles.optionRow}>
      <Ionicons name="people-outline" size={20} color={Colors.light.primary} />
      <Text style={styles.optionText}>Representatives Only</Text>
    </View>
    <View style={styles.optionRow}>
      <Ionicons
        name="document-text-outline"
        size={20}
        color={Colors.light.textGray}
      />
      <Text style={styles.optionText}>Policy Areas Only</Text>
    </View>
  </View>
);

export const WatchlistRecentFilter = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="time-outline" size={48} color={Colors.light.textGray} />
    <Text style={styles.emptyText}>
      Track items you recently interacted with.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
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
