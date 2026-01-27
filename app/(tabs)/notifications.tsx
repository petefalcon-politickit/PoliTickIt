import {
    NotificationAllFilter,
    NotificationUnreadFilter,
} from "@/components/filters/notification-filters";
import PoliTickItHeader from "@/components/navigation/header";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { notifications } from "@/constants/mockData";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotificationsScreen() {
  const [filterVisible, setFilterVisible] = useState(false);

  const handleNotificationPress = (item: any) => {
    if (item.snap?.id) {
      router.push({
        pathname: "/snap-viewer",
        params: { id: item.snap.id },
      });
    }
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <Text style={styles.notificationTitle}>
          {item.title || "Notification"}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp || item.date}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      {item.snap && (
        <View style={styles.snapBadge}>
          <Text style={styles.snapBadgeText}>View Details</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader
        title="Notifications"
        onSearchPress={() => setFilterVisible(true)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>

      <DualTabBottomSheet
        isVisible={filterVisible}
        onClose={() => setFilterVisible(false)}
        tabOneLabel="Unread"
        tabTwoLabel="All"
        renderTabOne={() => <NotificationUnreadFilter />}
        renderTabTwo={() => <NotificationAllFilter />}
        onApply={() => setFilterVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing["2xl"],
  },
  listContent: {
    paddingTop: Spacing.sm,
  },
  notificationItem: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1A202C",
  },
  timestamp: {
    fontSize: 12,
    color: "#A0AEC0",
  },
  message: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  snapBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  snapBadgeText: {
    fontSize: 11,
    color: Colors.light.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
