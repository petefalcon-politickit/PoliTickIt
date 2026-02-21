import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { ParticipationStatusModal } from "@/components/ui/participation-status-modal";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function WatchlistScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("insights"); // 'insights' | 'tracked'
  const [filterVisible, setFilterVisible] = useState(false);
  const [participationModalVisible, setParticipationModalVisible] =
    useState(false);
  const [watchedSnaps, setWatchedSnaps] = useState<PoliSnap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { omniFeedProvider, watchlistService, snapRepository, hapticService } =
    useServices();
  const { refreshCounts } = useActivity();

  const loadWatchlist = useCallback(
    async (isInitial = false) => {
      if (isInitial) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        let snaps: PoliSnap[] = [];
        if (activeTab === "insights") {
          const result = await omniFeedProvider.getSnaps({
            category: "trending",
          });
          snaps = result.snaps;
        } else {
          const ids = await watchlistService.getWatchedIds();
          snaps = await snapRepository.getSnapsByIds(ids);
        }

        setWatchedSnaps(snaps);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [omniFeedProvider, watchlistService, snapRepository, activeTab],
  );

  const onRefresh = useCallback(async () => {
    hapticService.triggerLightImpact();
    await Promise.all([loadWatchlist(false), refreshCounts()]);
  }, [loadWatchlist, refreshCounts, hapticService]);

  const filteredSnaps = useMemo(() => {
    // Categorization logic is now handled by the WatchlistProvider
    return watchedSnaps;
  }, [watchedSnaps]);

  // Reload whenever user navigates to this screen
  useFocusEffect(
    useCallback(() => {
      loadWatchlist(true);
    }, [loadWatchlist]),
  );

  // Reload when tab changes
  React.useEffect(() => {
    loadWatchlist(true);
  }, [activeTab]);

  return (
    <DashboardBackground>
      <View style={GlobalStyles.screenContainer}>
        <PoliTickItHeader
          title="Watchlist"
          onSearchPress={() => setFilterVisible(true)}
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "insights" && styles.activeTab]}
            onPress={() => setActiveTab("insights")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "insights" && styles.activeTabText,
              ]}
            >
              Insight Dashboard{activeTab === "insights" ? " " : ""}
            </ThemedText>
            {activeTab === "insights" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "tracked" && styles.activeTab]}
            onPress={() => setActiveTab("tracked")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "tracked" && styles.activeTabText,
              ]}
            >
              Tracked Items{activeTab === "tracked" ? " " : ""}
            </ThemedText>
            {activeTab === "tracked" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <ThemedText style={styles.loaderText}>
              Syncing Intelligence...
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              filteredSnaps.length === 0 && styles.emptyScroll,
            ]}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={Colors.light.primary}
              />
            }
          >
            {filteredSnaps.length > 0 ? (
              <PoliSnapCollection poliSnaps={filteredSnaps} />
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons
                    name={
                      activeTab === "insights"
                        ? "analytics-outline"
                        : "bookmark-outline"
                    }
                    size={48}
                    color={Colors.light.textMuted}
                  />
                </View>
                <ThemedText style={styles.emptyTitle}>
                  {activeTab === "insights"
                    ? "Limited Signal Volume"
                    : "Your Watchlist is Empty"}
                </ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  {activeTab === "insights"
                    ? "Collective Signal dashboards require higher 'Community Capital' levels. Share insights or participate in audits to boost your Capital and unlock deep-tier legislative forecasting."
                    : "Bookmark insights from the Accountability or Knowledge screens to track them here."}
                </ThemedText>

                {activeTab === "insights" && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setParticipationModalVisible(true)}
                  >
                    <Ionicons name="flash-outline" size={20} color="white" />
                    <ThemedText style={styles.actionButtonText}>
                      Boost Participation Capital
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        )}

        <DualTabBottomSheet
          isVisible={filterVisible}
          onClose={() => setFilterVisible(false)}
          tabOneLabel="Watchlist"
          tabTwoLabel="Alerts"
          renderTabOne={() => <View />}
          renderTabTwo={() => <View />}
          onApply={() => setFilterVisible(false)}
        />

        <ParticipationStatusModal
          isVisible={participationModalVisible}
          onClose={() => setParticipationModalVisible(false)}
        />
      </View>
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.backgroundSecondary,
    borderBottomWidth: Platform.select({
      ios: StyleSheet.hairlineWidth,
      android: 1,
    }),
    borderBottomColor: Colors.light.separator,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeTab: {},
  tabText: {
    fontSize: Typography.sizes.md,
    color: "#718096",
    fontWeight: Typography.weights.medium,
  },
  activeTabText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.semibold,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
    height: 3,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollContent: {
    paddingBottom: Spacing["2xl"],
  },
  emptyScroll: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 80, // Consistent top padding for vertical rhythm
  },
  emptyIconContainer: {
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    gap: Spacing.sm,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "white",
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loaderText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    fontWeight: Typography.weights.medium,
  },
});
