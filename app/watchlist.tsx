import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { MultiToggle } from "@/components/ui/multi-toggle";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function WatchlistScreen() {
  const [activeTab, setActiveTab] = useState("insights"); // 'insights' | 'tracked'
  const [filterVisible, setFilterVisible] = useState(false);
  const [watchedSnaps, setWatchedSnaps] = useState<PoliSnap[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { watchlistService, poliSnapRepository } = useServices();

  const loadWatchlist = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const ids = await watchlistService.getWatchedIds();
      if (ids && ids.length > 0) {
        const snaps = await poliSnapRepository.getSnapsByIds(ids);
        setWatchedSnaps(
          snaps.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      } else {
        setWatchedSnaps([]);
      }
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [watchlistService, poliSnapRepository]);

  const filteredSnaps = useMemo(() => {
    if (activeTab === "insights") {
      // Logic: Snaps that are explicitly typed as "Dashboard"
      // OR contain high-fidelity metric elements (Predictive, Scoring, Indexing)
      return watchedSnaps.filter(
        (snap) =>
          snap.type === "Dashboard" ||
          snap.elements.some((el) => el.type.startsWith("Metric.")),
      );
    } else {
      // Tracked Items: The pure user-selected pins (Accountability, Knowledge, Economics)
      return watchedSnaps.filter(
        (snap) =>
          snap.type !== "Dashboard" &&
          !snap.elements.some((el) => el.type.startsWith("Metric.")),
      );
    }
  }, [watchedSnaps, activeTab]);

  // Reload whenever user navigates to this screen
  useFocusEffect(
    useCallback(() => {
      loadWatchlist();
    }, [loadWatchlist]),
  );

  return (
    <DashboardBackground>
      <View style={GlobalStyles.screenContainer}>
        <PoliTickItHeader
          title="Watchlist"
          onSearchPress={() => setFilterVisible(true)}
        />

        <View style={styles.tabContainer}>
          <MultiToggle
            options={[
              { label: "Insight Dashboard", value: "insights" },
              { label: "Tracked Items", value: "tracked" },
            ]}
            currentValue={activeTab}
            onChange={(val) => setActiveTab(val)}
            style={styles.toggle}
          />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            filteredSnaps.length === 0 && styles.emptyScroll,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={loadWatchlist}
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
                  ? "No Active Insights"
                  : "Your Watchlist is Empty"}
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {activeTab === "insights"
                  ? "Pro Intelligence updates will appear here once relevant legislative signals are detected."
                  : "Bookmark insights from the Accountability or Knowledge screens to track them here."}
              </ThemedText>
            </View>
          )}
        </ScrollView>

        <DualTabBottomSheet
          isVisible={filterVisible}
          onClose={() => setFilterVisible(false)}
          tabOneLabel="Watchlist"
          tabTwoLabel="Alerts"
          renderTabOne={() => <View />}
          renderTabTwo={() => <View />}
          onApply={() => setFilterVisible(false)}
        />
      </View>
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "transparent",
    alignItems: "center", // Center the toggle
  },
  toggle: {
    // Width removed to allow auto-sizing to labels
  },
  scrollContent: {
    paddingBottom: Spacing["2xl"],
  },
  emptyScroll: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
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
  },
});
