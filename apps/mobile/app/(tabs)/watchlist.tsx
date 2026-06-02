import { InsightDashboardView } from "@/components/insight-dashboard-view";
import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { ParticipationStatusModal } from "@/components/ui/participation-status-modal";
import { POLICY_AREAS } from "@/components/ui/representative-and-policy-area-filter-bottom-sheet";
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
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const { watchlistService, snapRepository, hapticService } = useServices();
  const { refreshCounts } = useActivity();

  const loadWatchlist = useCallback(
    async (isInitial = false) => {
      if (isInitial) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const ids = await watchlistService.getWatchedIds();
        const snaps = await snapRepository.getSnapsByIds(ids);
        setWatchedSnaps(snaps);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [watchlistService, snapRepository],
  );

  const onRefresh = useCallback(async () => {
    hapticService.triggerLightImpact();
    await Promise.all([loadWatchlist(false), refreshCounts()]);
  }, [loadWatchlist, refreshCounts, hapticService]);

  const filteredSnaps = useMemo(() => {
    let snaps = watchedSnaps;
    if (selectedCategories.length > 0) {
      snaps = snaps.filter((s) =>
        selectedCategories.includes(s.metadata?.policyArea ?? ""),
      );
    }
    return sortOrder === "asc"
      ? [...snaps].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      : [...snaps].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [watchedSnaps, selectedCategories, sortOrder]);

  // Reload whenever user navigates to this screen
  useFocusEffect(
    useCallback(() => {
      loadWatchlist(true);
    }, [loadWatchlist]),
  );

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSortOrder("desc");
  }, []);

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
        ) : activeTab === "insights" ? (
          <InsightDashboardView
            watchedSnaps={watchedSnaps}
            onBoostPress={() => setParticipationModalVisible(true)}
          />
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
                    name="bookmark-outline"
                    size={48}
                    color={Colors.light.textMuted}
                  />
                </View>
                <ThemedText style={styles.emptyTitle}>
                  Your Watchlist is Empty
                </ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  {selectedCategories.length > 0
                    ? "No tracked items match the active filters."
                    : "Bookmark insights from the Accountability or Knowledge screens to track them here."}
                </ThemedText>
                {selectedCategories.length > 0 && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={clearFilters}
                  >
                    <Ionicons name="close-outline" size={20} color="white" />
                    <ThemedText style={styles.actionButtonText}>
                      Clear Filters
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
          renderTabOne={() => (
            <ScrollView
              contentContainerStyle={filterStyles.sheetContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Sort section */}
              <ThemedText style={filterStyles.sectionLabel}>Sort By</ThemedText>
              <View style={filterStyles.chipContainer}>
                {(
                  [
                    { value: "desc", label: "Newest First" },
                    { value: "asc", label: "Oldest First" },
                  ] as const
                ).map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      filterStyles.chip,
                      sortOrder === opt.value && filterStyles.activeChip,
                    ]}
                    onPress={() => setSortOrder(opt.value)}
                  >
                    <ThemedText
                      style={[
                        filterStyles.chipText,
                        sortOrder === opt.value && filterStyles.activeChipText,
                      ]}
                    >
                      {opt.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Category section */}
              <ThemedText style={filterStyles.sectionLabel}>
                Filter by Category
              </ThemedText>
              <View style={filterStyles.chipContainer}>
                {POLICY_AREAS.map((pa) => {
                  const active = selectedCategories.includes(pa.id);
                  return (
                    <TouchableOpacity
                      key={pa.id}
                      style={[
                        filterStyles.chip,
                        active && filterStyles.activeChip,
                      ]}
                      onPress={() => toggleCategory(pa.id)}
                    >
                      <ThemedText
                        style={[
                          filterStyles.chipText,
                          active && filterStyles.activeChipText,
                        ]}
                      >
                        {pa.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
          renderTabTwo={() => (
            <View style={filterStyles.alertsPlaceholder}>
              <Ionicons
                name="notifications-outline"
                size={40}
                color={Colors.light.textMuted}
              />
              <ThemedText style={filterStyles.alertsTitle}>
                Push Alerts Coming Soon
              </ThemedText>
              <ThemedText style={filterStyles.alertsSubtext}>
                You'll be able to set per-snap and per-representative alerts
                when this feature launches.
              </ThemedText>
            </View>
          )}
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

const filterStyles = StyleSheet.create({
  sheetContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeChip: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  activeChipText: {
    color: "#FFF",
    fontWeight: Typography.weights.bold,
  },
  alertsPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    gap: Spacing.md,
    opacity: 0.6,
  },
  alertsTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    textAlign: "center",
  },
  alertsSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
