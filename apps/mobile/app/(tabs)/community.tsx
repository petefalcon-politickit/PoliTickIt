import {
    CommunityAllPostsFilter,
    CommunityFollowingFilter,
} from "@/components/filters/community-filters";
import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

export default function CommunityScreen() {
  const { omniFeedProvider, hapticService } = useServices();
  const { refreshCounts } = useActivity();
  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const fetchSnaps = useCallback(async () => {
    try {
      const { snaps: data } = await omniFeedProvider.getSnaps({
        category: "community",
      });
      setSnaps(data);
    } catch (error) {
      console.error("Failed to fetch community snaps:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [omniFeedProvider]);

  useEffect(() => {
    fetchSnaps();
  }, [fetchSnaps]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    hapticService.triggerLightImpact();
    await Promise.all([fetchSnaps(), refreshCounts()]);
  }, [fetchSnaps, refreshCounts, hapticService]);

  if (loading && !isRefreshing) {
    return (
      <View
        style={[GlobalStyles.screenContainer, { justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader
        title="Community"
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
        {snaps.length > 0 ? (
          <PoliSnapCollection poliSnaps={snaps as any} />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={48}
              color={Colors.light.textMuted}
            />
            <ThemedText style={styles.emptyText}>
              No community posts yet.
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <DualTabBottomSheet
        isVisible={filterVisible}
        onClose={() => setFilterVisible(false)}
        tabOneLabel="Following"
        tabTwoLabel="All Posts"
        renderTabOne={() => <CommunityFollowingFilter />}
        renderTabTwo={() => <CommunityAllPostsFilter />}
        onApply={() => {
          setFilterVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing["2xl"],
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
