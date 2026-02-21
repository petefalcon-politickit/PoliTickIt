import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import {
    POLICY_AREAS,
    REPRESENTATIVES,
    RepresentativeAndPolicyAreaFilterBottomSheet,
} from "@/components/ui/representative-and-policy-area-filter-bottom-sheet";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Accountability Screen Component
export default function AccountabilityScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { omniFeedProvider, hapticService } = useServices();
  const { refreshCounts } = useActivity();
  const [activeFilters, setActiveFilters] = useState<{
    sortBy: "date-desc" | "date-asc" | "relevancy";
    importance: "all" | "high" | "medium";
    insightType: string;
    reps: string[];
    policies: string[];
    state: string;
    gov: string;
    party: string;
    followingOnly: boolean;
  }>({
    sortBy: "date-desc",
    importance: "all",
    insightType: "All Types",
    reps: REPRESENTATIVES.filter((r) => r.isFollowing).map((r) => r.id),
    policies: POLICY_AREAS.map((p) => p.id),
    state: "Any state",
    gov: "All governments",
    party: "Any party",
    followingOnly: false,
  });

  const [selectedSegment, setSelectedSegment] = useState<"focus" | "trending">(
    "focus",
  );

  const loadSnaps = useCallback(async () => {
    try {
      const { snaps: data } = await omniFeedProvider.getSnaps({
        category: "accountability",
      });
      setSnaps(data);
    } catch (error) {
      console.error("Error loading PoliSnaps:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [omniFeedProvider]);

  useEffect(() => {
    loadSnaps();
  }, [loadSnaps]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    hapticService.triggerLightImpact();
    // Batch refresh both the content and the global activity/notification pulse
    await Promise.all([loadSnaps(), refreshCounts()]);
  }, [loadSnaps, refreshCounts, hapticService]);

  const handleFilterApply = (filters: any) => {
    setActiveFilters(filters);
    setFilterVisible(false);
  };

  const handleSegmentChange = (segment: "focus" | "trending") => {
    setSelectedSegment(segment);
  };

  const displayedSnaps = snaps
    .filter((snap) => {
      // 1. Segment filter
      const isTrending = snap.id.includes("trending") || snap.type === "trends";
      if (selectedSegment === "trending" && !isTrending) return false;
      if (selectedSegment === "focus" && isTrending) return false;

      // 2. Policy Area filter (if any selected and NOT all are selected)
      const isFilteringPolicies =
        activeFilters.policies.length > 0 &&
        activeFilters.policies.length < POLICY_AREAS.length;

      if (isFilteringPolicies) {
        const snapPolicy = snap.metadata?.policyArea;

        // If filtering is active, snaps without a policy area are hidden by default
        if (!snapPolicy) {
          return false;
        }

        const selectedPolicyLabels = activeFilters.policies
          .map((id) => POLICY_AREAS.find((p) => p.id === id)?.label)
          .filter(Boolean);

        if (!selectedPolicyLabels.includes(snapPolicy)) {
          return false;
        }
      }

      // 3. Representative Filter
      if (activeFilters.reps.length > 0) {
        // Optimized: Check metadata first, then fallback to element search
        let repId = snap.metadata?.representativeId;

        if (!repId) {
          const repElement = snap.elements.find(
            (e: any) =>
              e.type === "Header.Representative" ||
              e.type === "Identity.Rep.Brief",
          );
          repId = repElement?.data?.id;
        }

        // If filtering by specific reps, hide any snap that isn't about those reps
        // NEW LOGIC: We allow "Global/National" snaps (those without a repId) to pass through
        // to provide context unless the user is specifically in a following-only mode
        if (repId) {
          if (!activeFilters.reps.includes(repId)) {
            return false;
          }
        }
      } else if (activeFilters.followingOnly) {
        // Strict following mode: hide any snap that has a repId NOT in our follow list
        // (If a snap has no repId, we can decide to show it or not. Usually show it if it's general)
        let repId = snap.metadata?.representativeId;
        if (!repId) {
          const repElement = snap.elements.find(
            (e: any) =>
              e.type === "Header.Representative" ||
              e.type === "Identity.Rep.Brief",
          );
          repId = repElement?.data?.id;
        }

        // If the snap IS about a representative, and we aren't following them, hide it
        // Note: activeFilters.reps is initialized with followed rep IDs in the initial state
        // but here we check against a broader context if needed.
        // For simplicity, we'll use the same logic as specific selection for now
        if (repId && !activeFilters.reps.includes(repId)) {
          return false;
        }
      }

      // 4. Insight Type filter
      if (activeFilters.insightType !== "All Types") {
        const snapInsight = snap.metadata?.insightType || "";
        if (
          !snapInsight
            .toLowerCase()
            .includes(activeFilters.insightType.toLowerCase())
        ) {
          return false;
        }
      }

      // 5. Importance Filter (Mock logic)
      if (activeFilters.importance === "high") {
        const text = JSON.stringify(snap).toLowerCase();
        const highSignals = [
          "urgent",
          "conflict",
          "bottleneck",
          "divergence",
          "reversal",
        ];
        if (!highSignals.some((signal) => text.includes(signal))) return false;
      }

      // 6. Generic Meta Filters (Party, State, Gov) - Mock Logic
      if (activeFilters.party !== "Any party") {
        const text = JSON.stringify(snap).toLowerCase();
        if (!text.includes(activeFilters.party.toLowerCase())) return false;
      }

      if (activeFilters.state !== "Any state") {
        const text = JSON.stringify(snap).toLowerCase();
        if (!text.includes(activeFilters.state.toLowerCase())) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (activeFilters.sortBy === "date-desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (activeFilters.sortBy === "date-asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (activeFilters.sortBy === "relevancy") {
        // Mock relevancy: prioritize based on types
        const getPriority = (s: PoliSnap) => {
          if (s.id.includes("acc-leg")) return 5;
          if (s.id.includes("acc-vote")) return 4;
          if (s.type === "Accountability") return 3;
          return 1;
        };
        return getPriority(b) - getPriority(a);
      }
      return 0;
    });

  return (
    <DashboardBackground>
      <View style={GlobalStyles.screenContainer}>
        <PoliTickItHeader
          title="Accountability"
          onSearchPress={() => setFilterVisible(true)}
        />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedSegment === "focus" && styles.activeTab,
            ]}
            onPress={() => handleSegmentChange("focus")}
          >
            <ThemedText
              style={[
                styles.tabText,
                selectedSegment === "focus" && styles.activeTabText,
              ]}
            >
              Focus{selectedSegment === "focus" ? " " : ""}
            </ThemedText>
            {selectedSegment === "focus" && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedSegment === "trending" && styles.activeTab,
            ]}
            onPress={() => handleSegmentChange("trending")}
          >
            <ThemedText
              style={[
                styles.tabText,
                selectedSegment === "trending" && styles.activeTabText,
              ]}
            >
              Trending{selectedSegment === "trending" ? " " : ""}
            </ThemedText>
            {selectedSegment === "trending" && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        </View>

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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading Accountability...</Text>
            </View>
          ) : displayedSnaps.length > 0 ? (
            <PoliSnapCollection poliSnaps={displayedSnaps} />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="filter-outline"
                size={48}
                color={Colors.light.textTertiary}
              />
              <Text style={styles.emptyText}>
                No snaps found for current filters.
              </Text>
            </View>
          )}
        </ScrollView>

        <RepresentativeAndPolicyAreaFilterBottomSheet
          isVisible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={handleFilterApply}
        />
      </View>
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
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
  // Stat Cards
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    color: Colors.light.textGray,
    fontStyle: "italic",
  },
  emptyContainer: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: 80, // Increased top padding for vertical rhythm
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    color: Colors.light.textTertiary,
    fontSize: 16,
    fontWeight: "500",
  },
});
