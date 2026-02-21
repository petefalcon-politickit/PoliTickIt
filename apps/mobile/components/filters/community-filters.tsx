import { Colors, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export const CommunityFollowingFilter = () => {
  const [notifyNewPosts, setNotifyNewPosts] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Following Preferences</Text>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Notify on new posts</Text>
          <Text style={styles.description}>
            Get alerts from people you follow
          </Text>
        </View>
        <Switch
          value={notifyNewPosts}
          onValueChange={setNotifyNewPosts}
          trackColor={{ true: Colors.light.primary }}
        />
      </View>
    </View>
  );
};

export const CommunityAllPostsFilter = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Feed Sort</Text>
      <View style={styles.optionRow}>
        <Ionicons name="flame-outline" size={20} color={Colors.light.primary} />
        <Text style={styles.optionText}>Trending Posts</Text>
        <Ionicons
          name="checkmark"
          size={20}
          color={Colors.light.primary}
          style={styles.check}
        />
      </View>
      <View style={styles.optionRow}>
        <Ionicons name="time-outline" size={20} color={Colors.light.textGray} />
        <Text style={styles.optionText}>Recent Posts</Text>
      </View>
    </View>
  );
};

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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: Typography.weights.medium,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textGray,
    marginTop: 2,
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
