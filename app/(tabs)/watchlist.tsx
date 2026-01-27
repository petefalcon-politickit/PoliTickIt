import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { ProLogo } from "@/components/ui/pro-logo";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function WatchlistScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [watchedSnaps, setWatchedSnaps] = useState<PoliSnap[]>([]);
  const [dashboardSnaps, setDashboardSnaps] = useState<PoliSnap[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { watchlistService, poliSnapRepository } = useServices();

  const loadWatchlist = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Load Dashboard Summaries
      const dashIds = [
        "dash-watchlist-core-001",
        "dash-predictive-pro-001",
        "corr-casar-pro-001",
        "dash-community-pulse-001",
      ];
      const dashes = await poliSnapRepository.getSnapsByIds(dashIds);
      setDashboardSnaps(dashes);

      // Load Individual Items
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
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            watchedSnaps.length === 0 &&
              dashboardSnaps.length === 0 &&
              styles.emptyScroll,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={loadWatchlist}
              tintColor={Colors.light.primary}
            />
          }
        >
          {dashboardSnaps.length > 0 && (
            <View style={styles.dashboardContainer}>
              <View style={styles.headerRow}>
                <ThemedText style={styles.sectionHeader}>
                  INSIGHT DASHBOARD
                </ThemedText>
                <ProLogo />
              </View>
              <PoliSnapCollection poliSnaps={dashboardSnaps} />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>
                  WATCHED ITEMS
                </ThemedText>
                <View style={styles.dividerLine} />
              </View>
            </View>
          )}

          {watchedSnaps.length > 0 ? (
            <PoliSnapCollection poliSnaps={watchedSnaps} />
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="bookmark-outline"
                  size={48}
                  color={Colors.light.textMuted}
                />
              </View>
              <ThemedText style={styles.emptyTitle}>
                Your Watchlist is Empty
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Bookmark insights from the Accountability or Knowledge screens
                to track them here.
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
  scrollContent: {
    paddingBottom: Spacing["2xl"],
  },
  dashboardContainer: {
    paddingTop: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionHeader: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  proBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
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
