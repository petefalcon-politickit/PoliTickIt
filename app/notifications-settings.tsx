import PoliTickItHeader from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function NotificationsSettingsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <PoliTickItHeader />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Notification Settings</ThemedText>
        <ThemedText style={styles.placeholder}>
          Notification settings screen coming soon
        </ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  placeholder: {
    marginTop: 16,
    color: "#999999",
  },
});
