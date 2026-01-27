import PoliTickItHeader from "@/components/navigation/header";
import { HeaderRepresentative } from "@/components/polisnap-elements/identity/headers";
import { RepSearchBottomSheet } from "@/components/ui/rep-search-bottom-sheet";
import { representatives } from "@/constants/mockData";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsRepsScreen() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    govLevel: "All",
    selectedStates: ["All"],
    followingOnly: false,
  });
  const [selected, setSelected] = useState<Set<string>>(
    new Set(representatives.slice(0, 2).map((r) => r.id)),
  );

  const toggleRep = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const filteredReps = representatives.filter((rep) => {
    const matchesSearch = rep.name
      .toLowerCase()
      .includes(filters.searchQuery.toLowerCase());
    const matchesState =
      filters.selectedStates.includes("All") ||
      filters.selectedStates.includes(rep.state);

    let matchesLevel = true;
    if (filters.govLevel === "Federal") {
      matchesLevel =
        rep.position.includes("U.S.") || rep.position.includes("House");
    } else if (filters.govLevel === "State") {
      matchesLevel = rep.position.includes("State");
    } else if (filters.govLevel === "County") {
      matchesLevel =
        rep.position.includes("County") || rep.position.includes("Local");
    }

    const matchesFollowing = !filters.followingOnly || selected.has(rep.id);

    return matchesSearch && matchesState && matchesLevel && matchesFollowing;
  });

  const removeFilter = (type: string, value?: string) => {
    setFilters((prev) => {
      if (type === "search") return { ...prev, searchQuery: "" };
      if (type === "gov") return { ...prev, govLevel: "All" };
      if (type === "following") return { ...prev, followingOnly: false };
      if (type === "state" && value) {
        const newStates = prev.selectedStates.filter((s) => s !== value);
        return {
          ...prev,
          selectedStates: newStates.length === 0 ? ["All"] : newStates,
        };
      }
      return prev;
    });
  };

  const renderItem = ({ item }: any) => {
    const headerData = {
      name: item.name,
      imgUri: item.profileImage,
      position: item.position,
      party: item.party,
      location: item.district ? `${item.state}, ${item.district}` : item.state,
    };

    return (
      <View style={styles.itemContainer}>
        <View style={styles.headerWrapper}>
          <HeaderRepresentative data={headerData} />
        </View>
        <Switch
          value={selected.has(item.id)}
          onValueChange={() => toggleRep(item.id)}
          trackColor={{ false: "#D1D1D6", true: Colors.light.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
    );
  };

  const renderFilterFeedback = () => {
    return (
      <View style={styles.activeFiltersContainer}>
        <View style={styles.activeFiltersRow}>
          <Text style={styles.resultsCount}>
            {filteredReps.length} Results Found
          </Text>
          <TouchableOpacity
            onPress={() =>
              setFilters({
                searchQuery: "",
                govLevel: "All",
                selectedStates: ["All"],
                followingOnly: false,
              })
            }
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearFilters}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chipContainer}>
          {filters.searchQuery ? (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Search: {filters.searchQuery}
              </Text>
              <TouchableOpacity
                onPress={() => removeFilter("search")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
              >
                <Ionicons name="close-circle" size={16} color="#718096" />
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={[
              styles.filterChip,
              !filters.followingOnly && { paddingRight: 10 },
            ]}
          >
            <Text style={styles.filterChipText}>
              {filters.followingOnly ? "Following Only" : "All Reps"}
            </Text>
            {filters.followingOnly && (
              <TouchableOpacity
                onPress={() => removeFilter("following")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
              >
                <Ionicons name="close-circle" size={16} color="#718096" />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={[
              styles.filterChip,
              filters.govLevel === "All" && { paddingRight: 10 },
            ]}
          >
            <Text style={styles.filterChipText}>
              {filters.govLevel === "All" ? "All Branches" : filters.govLevel}
            </Text>
            {filters.govLevel !== "All" && (
              <TouchableOpacity
                onPress={() => removeFilter("gov")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
              >
                <Ionicons name="close-circle" size={16} color="#718096" />
              </TouchableOpacity>
            )}
          </View>

          {filters.selectedStates.map((st) => {
            return (
              <View
                key={st}
                style={[
                  styles.filterChip,
                  st === "All" && { paddingRight: 10 },
                ]}
              >
                <Text style={styles.filterChipText}>
                  {st === "All" ? "All States" : st}
                </Text>
                {st !== "All" && (
                  <TouchableOpacity
                    onPress={() => removeFilter("state", st)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close-circle" size={16} color="#718096" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader
        title="Representatives"
        onSearchPress={() => setIsSearchVisible(true)}
      />
      <FlatList
        data={filteredReps}
        ListHeaderComponent={renderFilterFeedback}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No representatives match your filters.
            </Text>
          </View>
        }
      />

      <RepSearchBottomSheet
        isVisible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        initialFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  activeFiltersContainer: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.light.subtleSecondaryTint,
    padding: Spacing.sm,
    borderRadius: 4, // Mechanical consistency
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
  filterChip: {
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
  deleteButton: {
    padding: 2,
  },
  filterChipText: {
    fontSize: 12,
    color: "#4A5568",
    fontWeight: "500",
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
    marginTop: 100,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#718096",
    fontSize: 16,
  },
});
