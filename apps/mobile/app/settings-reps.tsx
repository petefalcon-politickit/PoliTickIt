import PoliTickItHeader from "@/components/navigation/header";
import { HeaderRepresentative } from "@/components/polisnap-elements/identity/headers";
import {
    RepFilters,
    RepSearchBottomSheet,
} from "@/components/ui/rep-search-bottom-sheet";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { Representative } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PAGE_SIZE = 20;

const DEFAULT_FILTERS: RepFilters = {
  searchQuery: "",
  region: "All",
  chamber: "All",
  party: "All",
  selectedStates: ["All"],
  followingOnly: false,
  sortBy: "firstName",
};

export default function SettingsRepsScreen() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [allReps, setAllReps] = useState<Representative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState<RepFilters>(DEFAULT_FILTERS);

  const { representativeRepository, apiRepresentativeRepository } =
    useServices();

  // â”€â”€ Load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const loadReps = async () => {
      setIsLoading(true);
      try {
        const [apiReps, localReps] = await Promise.all([
          apiRepresentativeRepository.getAllRepresentatives(),
          representativeRepository.getAllRepresentatives(),
        ]);
        const followMap = new Map(localReps.map((r) => [r.id, r.isFollowing]));
        const merged = apiReps.map((r) => ({
          ...r,
          isFollowing: followMap.get(r.id) ?? false,
        }));
        setAllReps(merged.length > 0 ? merged : localReps);
      } catch {
        const localReps =
          await representativeRepository.getAllRepresentatives();
        setAllReps(localReps);
      } finally {
        setIsLoading(false);
      }
    };
    loadReps();
  }, [representativeRepository, apiRepresentativeRepository]);

  // â”€â”€ Reset page on filter change â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [filters]);

  // â”€â”€ Filter + sort (memoised) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredAndSorted = useMemo(() => {
    const q = filters.searchQuery.toLowerCase();
    const filtered = allReps.filter((rep) => {
      if (q && !rep.name.toLowerCase().includes(q)) return false;
      if (
        !filters.selectedStates.includes("All") &&
        !filters.selectedStates.includes(rep.state)
      )
        return false;
      if (
        filters.region !== "All" &&
        (rep.level ?? "Federal") !== filters.region
      )
        return false;
      if (filters.chamber !== "All" && rep.chamber !== filters.chamber)
        return false;
      if (filters.party !== "All" && rep.party !== filters.party) return false;
      if (filters.followingOnly && !rep.isFollowing) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const key = (name: string) =>
        filters.sortBy === "lastName"
          ? (name.trim().split(/\s+/).pop() ?? name)
          : (name.trim().split(/\s+/)[0] ?? name);
      return key(a.name).localeCompare(key(b.name));
    });
  }, [allReps, filters]);

  const pagedReps = filteredAndSorted.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSorted.length;

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleLoadMore = useCallback(() => {
    if (hasMore) setDisplayCount((c) => c + PAGE_SIZE);
  }, [hasMore]);

  const toggleRep = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setAllReps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFollowing: newStatus } : r)),
    );
    try {
      await Promise.all([
        representativeRepository.toggleFollow(id, newStatus),
        apiRepresentativeRepository.toggleFollow(id, newStatus),
      ]);
    } catch (error) {
      console.error("Failed to toggle representative follow:", error);
      setAllReps((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isFollowing: !newStatus } : r)),
      );
    }
  };

  const removeFilter = (type: string, value?: string) => {
    setFilters((prev) => {
      switch (type) {
        case "search":
          return { ...prev, searchQuery: "" };
        case "region":
          return { ...prev, region: "All" };
        case "chamber":
          return { ...prev, chamber: "All" };
        case "party":
          return { ...prev, party: "All" };
        case "following":
          return { ...prev, followingOnly: false };
        case "state": {
          const next = prev.selectedStates.filter((s) => s !== value);
          return {
            ...prev,
            selectedStates: next.length === 0 ? ["All"] : next,
          };
        }
        default:
          return prev;
      }
    });
  };

  // â”€â”€ Render helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderItem = ({ item }: { item: Representative }) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerWrapper}>
        <HeaderRepresentative
          data={{
            name: item.name,
            imgUri: item.profileImage,
            position: item.chamber ?? item.position,
            party: item.party,
            location: item.district
              ? `${item.state}, ${item.district}`
              : item.state,
          }}
        />
      </View>
      <Switch
        value={!!item.isFollowing}
        onValueChange={() => toggleRep(item.id, !!item.isFollowing)}
        trackColor={{ false: "#D1D1D6", true: Colors.light.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const renderFilterFeedback = () => (
    <View style={styles.activeFiltersContainer}>
      <View style={styles.activeFiltersRow}>
        <Text style={styles.resultsCount}>
          {filteredAndSorted.length} Results Found
        </Text>
        <TouchableOpacity
          onPress={() => setFilters(DEFAULT_FILTERS)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.clearFilters}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chipContainer}>
        {/* Search chip */}
        {filters.searchQuery ? (
          <FilterChip
            label={`Search: ${filters.searchQuery}`}
            onRemove={() => removeFilter("search")}
          />
        ) : null}

        {/* Watchlist chip */}
        <FilterChip
          label={filters.followingOnly ? "Following Only" : "All Reps"}
          onRemove={
            filters.followingOnly ? () => removeFilter("following") : undefined
          }
        />

        {/* Region chip */}
        <FilterChip
          label={filters.region === "All" ? "All Levels" : filters.region}
          onRemove={
            filters.region !== "All" ? () => removeFilter("region") : undefined
          }
        />

        {/* Chamber chip */}
        <FilterChip
          label={filters.chamber === "All" ? "All Chambers" : filters.chamber}
          onRemove={
            filters.chamber !== "All"
              ? () => removeFilter("chamber")
              : undefined
          }
        />

        {/* Party chip */}
        <FilterChip
          label={filters.party === "All" ? "All Parties" : filters.party}
          onRemove={
            filters.party !== "All" ? () => removeFilter("party") : undefined
          }
        />

        {/* Sort chip */}
        <FilterChip
          label={
            filters.sortBy === "lastName"
              ? "Sort: Last Name"
              : "Sort: First Name"
          }
        />

        {/* State chips */}
        {filters.selectedStates.map((st) => (
          <FilterChip
            key={st}
            label={st === "All" ? "All States" : st}
            onRemove={
              st !== "All" ? () => removeFilter("state", st) : undefined
            }
          />
        ))}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
        <Text style={styles.footerText}>
          {pagedReps.length} of {filteredAndSorted.length}
        </Text>
      </View>
    );
  };

  // â”€â”€ Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader
        title="Representatives"
        onSearchPress={() => setIsSearchVisible(true)}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading representatives…</Text>
        </View>
      ) : (
        <FlatList
          data={pagedReps}
          ListHeaderComponent={renderFilterFeedback}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No representatives match your filters.
              </Text>
            </View>
          }
        />
      )}

      <RepSearchBottomSheet
        isVisible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        initialFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </View>
  );
}

// â”€â”€ FilterChip helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <View style={[chipStyles.chip, !onRemove && { paddingRight: 10 }]}>
      <Text style={chipStyles.text}>{label}</Text>
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={chipStyles.button}
        >
          <Ionicons name="close-circle" size={16} color="#718096" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  text: {
    fontSize: 12,
    color: "#4A5568",
    fontWeight: "500",
  },
  button: {
    padding: 2,
  },
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  activeFiltersContainer: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.light.subtleSecondaryTint,
    padding: Spacing.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
  },
  clearFilters: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "700",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    ...GlobalStyles.shadowSmall,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerWrapper: {
    flex: 1,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#718096",
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: Spacing.md,
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
