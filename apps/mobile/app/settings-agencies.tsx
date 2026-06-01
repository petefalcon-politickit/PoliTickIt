import { PoliTickItHeader } from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { Agency } from "@/services/interfaces/IAgencyRepository";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PAGE_SIZE = 20;

type SortMode = "az" | "za" | "following";

// chipStyles must be declared before SortChip (no hoisting for const).
const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  chipLabelActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

// SortChip must live at module level — defining it inside the screen component
// creates a new component type on every render, breaking React DOM (web).
type SortChipProps = {
  mode: SortMode;
  label: string;
  active: boolean;
  onPress: (mode: SortMode) => void;
};

const SortChip = ({ mode, label, active, onPress }: SortChipProps) => (
  <TouchableOpacity
    style={[chipStyles.chip, active && chipStyles.chipActive]}
    onPress={() => onPress(mode)}
  >
    <ThemedText
      style={[chipStyles.chipLabel, active && chipStyles.chipLabelActive]}
    >
      {label}
    </ThemedText>
  </TouchableOpacity>
);

const SettingsAgenciesScreen = () => {
  const { apiInterestRepository, agencyRepository, hapticService } =
    useServices();

  // Full source list (merged API + SQLite follow state)
  const [interests, setInterests] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter / sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [followingOnly, setFollowingOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("az");

  // Pagination
  const [page, setPage] = useState(1);
  const loadingMore = useRef(false);

  // â”€â”€ Load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const loadInterests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch taxonomy + server-side follow state in parallel.
      // Server-side follow IDs are the source of truth — SQLite may be empty
      // on a fresh install or before syncFollowState() has finished.
      const [apiItems, serverFollowedIds, savedLocal] = await Promise.all([
        apiInterestRepository.getAllInterests(),
        apiInterestRepository.getFollowingIds(),
        agencyRepository.getAllAgencies(),
      ]);

      // Build follow map: server wins; fall back to local SQLite for offline state.
      const serverSet = new Set(serverFollowedIds);
      const localMap = new Map(savedLocal.map((a) => [a.id, a.is_following]));
      const followMap = (id: string) =>
        serverFollowedIds.length > 0
          ? serverSet.has(id)
          : (localMap.get(id) ?? false);

      // If API returned nothing (offline/down), fall back to local SQLite data.
      const sourceItems = apiItems.length > 0 ? apiItems : savedLocal;

      const merged = sourceItems.map((item) => ({
        ...item,
        is_following: followMap(item.id),
      }));

      // Write resolved follow state back to SQLite so offline reads are accurate.
      if (apiItems.length > 0 && (serverFollowedIds.length > 0 || savedLocal.length === 0)) {
        agencyRepository.bulkSetFollowing(serverFollowedIds).catch(() => {});
      }

      setInterests(merged);
      setPage(1);
    } catch (err: any) {
      console.error("[SettingsInterests] loadInterests:", err.message);
      setError("Could not load policy areas. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [apiInterestRepository, agencyRepository]);

  useEffect(() => {
    loadInterests();
  }, [loadInterests]);

  // â”€â”€ Filter + Sort + Paginate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const filteredAndSorted = useMemo(() => {
    let list = interests;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q),
      );
    }

    if (followingOnly) {
      list = list.filter((a) => a.is_following);
    }

    switch (sortMode) {
      case "az":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "following":
        list = [...list].sort((a, b) =>
          a.is_following === b.is_following ? 0 : a.is_following ? -1 : 1,
        );
        break;
    }

    return list;
  }, [interests, searchQuery, followingOnly, sortMode]);

  const visibleItems = useMemo(
    () => filteredAndSorted.slice(0, page * PAGE_SIZE),
    [filteredAndSorted, page],
  );

  const handleEndReached = useCallback(() => {
    if (loadingMore.current) return;
    if (visibleItems.length >= filteredAndSorted.length) return;
    loadingMore.current = true;
    setPage((p) => p + 1);
    loadingMore.current = false;
  }, [visibleItems.length, filteredAndSorted.length]);

  // â”€â”€ Toggle Follow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const toggleFollow = useCallback(
    async (id: string, current: boolean) => {
      const next = !current;

      // Optimistic update
      setInterests((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_following: next } : a)),
      );
      hapticService.triggerLightImpact();

      try {
        // Upsert into SQLite so follow state persists
        const item = interests.find((a) => a.id === id);
        if (item) {
          await agencyRepository.saveAgency({ ...item, is_following: next });
        }
        await Promise.all([
          agencyRepository.toggleFollow(id, next),
          apiInterestRepository.toggleFollow(id, next),
        ]);
      } catch (err: any) {
        console.error("[SettingsInterests] toggleFollow:", err.message);
        // Revert
        setInterests((prev) =>
          prev.map((a) => (a.id === id ? { ...a, is_following: current } : a)),
        );
      }
    },
    [interests, agencyRepository, apiInterestRepository, hapticService],
  );

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const renderItem = useCallback(
    ({ item }: { item: Agency }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => toggleFollow(item.id, !!item.is_following)}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={styles.iconPlaceholder}>
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={styles.iconImage}
              />
            ) : (
              <Ionicons
                name="layers-outline"
                size={18}
                color={Colors.light.primary}
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={styles.itemName} type="defaultSemiBold">
              {item.name}
            </ThemedText>
            <ThemedText style={styles.description} numberOfLines={2}>
              {item.description}
            </ThemedText>
          </View>
        </View>
        <Switch
          value={!!item.is_following}
          onValueChange={() => toggleFollow(item.id, !!item.is_following)}
          trackColor={{ false: "#E2E8F0", true: Colors.light.primary }}
          thumbColor="#FFFFFF"
        />
      </TouchableOpacity>
    ),
    [toggleFollow],
  );

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader title="Interests" />
      <View style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchRow}>
          <Ionicons
            name="search-outline"
            size={16}
            color={Colors.light.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search policy areas…"
            placeholderTextColor={Colors.light.textPlaceholder}
            value={searchQuery}
            onChangeText={(t) => {
              setSearchQuery(t);
              setPage(1);
            }}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Filter / sort bar */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[chipStyles.chip, followingOnly && chipStyles.chipActive]}
            onPress={() => {
              setFollowingOnly((v) => !v);
              setPage(1);
            }}
          >
            <ThemedText
              style={[
                chipStyles.chipLabel,
                followingOnly && chipStyles.chipLabelActive,
              ]}
            >
              Following
            </ThemedText>
          </TouchableOpacity>
          <SortChip
            mode="az"
            label="A → Z"
            active={sortMode === "az"}
            onPress={setSortMode}
          />
          <SortChip
            mode="za"
            label="Z → A"
            active={sortMode === "za"}
            onPress={setSortMode}
          />
          <SortChip
            mode="following"
            label="Followed first"
            active={sortMode === "following"}
            onPress={setSortMode}
          />
        </View>

        {loading ? (
          <View style={styles.centred}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : error ? (
          <View style={styles.centred}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadInterests}
            >
              <ThemedText style={styles.retryLabel}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={visibleItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.4}
          />
        )}
      </View>
    </View>
  );
};

export default SettingsAgenciesScreen;

// â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  centred: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 14,
    color: Colors.light.text,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
      default: { elevation: 1 },
    }),
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  iconImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  retryLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
