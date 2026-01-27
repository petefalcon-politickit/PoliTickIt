import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import { MultiToggle } from "@/components/ui/multi-toggle";
import {
    POLICY_AREAS,
    REPRESENTATIVES,
    RepresentativeAndPolicyAreaFilterBottomSheet,
} from "@/components/ui/representative-and-policy-area-filter-bottom-sheet";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Accountability Screen Component
export default function AccountabilityScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { poliSnapRepository } = useServices();
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

  useEffect(() => {
    const loadSnaps = async () => {
      try {
        // Fetch accountability, economics, and trending to populate the screen
        const [accData, econData, trendData] = await Promise.all([
          poliSnapRepository.getSnapsByCategory("accountability"),
          poliSnapRepository.getSnapsByCategory("economics"),
          poliSnapRepository.getSnapsByCategory("trending"),
        ]);

        const combined = [...accData, ...econData, ...trendData];
        // Deduplicate by ID
        const uniqueSnaps = Array.from(
          new Map(combined.map((snap) => [snap.id, snap])).values(),
        );

        const merged = uniqueSnaps.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setSnaps(merged);
      } catch (error) {
        console.error("Error loading PoliSnaps:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSnaps();
  }, []);

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

      // 2. Policy Area filter (if any selected)
      if (activeFilters.policies.length > 0) {
        const selectedPolicyLabels = activeFilters.policies
          .map((id) => POLICY_AREAS.find((p) => p.id === id)?.label)
          .filter(Boolean);

        // Financial correlation snaps use "Accountability" as a virtual policy area
        // We allow them through if we're on the accountability screen, or if "Accountability" was a selectable policy
        const isAccountabilitySnap =
          snap.metadata?.policyArea === "Accountability";

        if (
          !isAccountabilitySnap &&
          (!snap.metadata?.policyArea ||
            !selectedPolicyLabels.includes(snap.metadata.policyArea))
        ) {
          return false;
        }
      }

      // 3. Representative Filter
      if (activeFilters.reps.length > 0 || activeFilters.followingOnly) {
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

        // If filtering by reps or following only, and this snap has a rep
        if (repId) {
          if (
            activeFilters.reps.length > 0 &&
            !activeFilters.reps.includes(repId)
          ) {
            return false;
          }
        } else if (activeFilters.followingOnly && !activeFilters.reps.length) {
          // If followingOnly is TRUE but no reps are selected/followed,
          // we might want to hide snaps that require a specific rep focus
          // For now, we let general snaps through
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.filterRow}>
            <MultiToggle
              options={[
                { label: "Focus", value: "focus" },
                { label: "Trending", value: "trending" },
              ]}
              currentValue={selectedSegment}
              onChange={(segment) =>
                handleSegmentChange(segment as "focus" | "trending")
              }
            />
          </View>

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
    paddingBottom: Spacing["2xl"],
  },
  // Filter Bar
  filterRow: {
    ...GlobalStyles.filterBar,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  filterIcon: {
    paddingRight: 4,
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
    padding: Spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    color: Colors.light.textTertiary,
    fontSize: 16,
    fontWeight: "500",
  },
});
