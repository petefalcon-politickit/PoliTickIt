import {
    NotificationAllFilter,
    NotificationUnreadFilter,
} from "@/components/filters/notification-filters";
import PoliTickItHeader from "@/components/navigation/header";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotificationsScreen() {
  const { omniFeedProvider, hapticService } = useServices();
  const { refreshCounts } = useActivity();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const { snaps: data } = await omniFeedProvider.getSnaps({
      category: "notifications",
    });
    setNotifications(data);
    setIsLoading(false);
    setIsRefreshing(false);
  }, [omniFeedProvider]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    hapticService.triggerLightImpact();
    await Promise.all([fetchNotifications(), refreshCounts()]);
  }, [fetchNotifications, refreshCounts, hapticService]);

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.light.primary}
            colors={[Colors.light.primary]}
          />
        }
      >
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={Colors.light.textMuted}
              />
              <Text style={styles.emptyText}>You're all caught up!</Text>
            </View>
          }
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
    paddingTop: 8,
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
  emptyContainer: {
    paddingTop: 80,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.textMuted,
    fontWeight: "500",
  },
});
