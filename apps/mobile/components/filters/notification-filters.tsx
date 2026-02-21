import { Colors, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const NotificationUnreadFilter = () => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>Unread Only</Text>
    <View style={styles.optionRow}>
      <Ionicons name="eye-off-outline" size={20} color={Colors.light.primary} />
      <Text style={styles.optionText}>Hide Read Notifications</Text>
      <Ionicons
        name="checkmark-circle"
        size={20}
        color={Colors.light.primary}
        style={styles.check}
      />
    </View>
  </View>
);

export const NotificationAllFilter = () => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>Filter by Type</Text>
    <View style={styles.optionRow}>
      <Ionicons
        name="megaphone-outline"
        size={20}
        color={Colors.light.textGray}
      />
      <Text style={styles.optionText}>Announcements</Text>
    </View>
    <View style={styles.optionRow}>
      <Ionicons
        name="chatbubble-outline"
        size={20}
        color={Colors.light.textGray}
      />
      <Text style={styles.optionText}>Replies</Text>
    </View>
    <View style={styles.optionRow}>
      <Ionicons
        name="alert-circle-outline"
        size={20}
        color={Colors.light.textGray}
      />
      <Text style={styles.optionText}>Urgent Updates</Text>
    </View>
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
  check: {
    marginLeft: "auto",
  },
});
