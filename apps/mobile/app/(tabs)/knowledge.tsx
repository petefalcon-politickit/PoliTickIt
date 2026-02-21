import {
    KnowledgeSavedFilter,
    KnowledgeTopicsFilter,
} from "@/components/filters/knowledge-filters";
import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

export default function KnowledgeScreen() {
  const { omniFeedProvider, hapticService } = useServices();
  const { refreshCounts } = useActivity();
  const { snapId } = useLocalSearchParams<{ snapId?: string }>();
  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const fetchSnaps = useCallback(async () => {
    try {
      const { snaps: data } = await omniFeedProvider.getSnaps({
        category: "knowledge",
      });
      setSnaps(data);
    } catch (error) {
      console.error("Failed to fetch knowledge snaps:", error);
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

  const sortedSnaps = useMemo(() => {
    if (!snapId) return snaps;

    // Move the requested snap to the top
    const highlightIndex = snaps.findIndex((s) => s.id === snapId);
    if (highlightIndex === -1) return snaps;

    const highlighted = snaps[highlightIndex];
    const filtered = snaps.filter((_, i) => i !== highlightIndex);
    return [highlighted, ...filtered];
  }, [snaps, snapId]);

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
        title="Knowledge"
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
        {sortedSnaps.length > 0 ? (
          <PoliSnapCollection poliSnaps={sortedSnaps as any} />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={48}
              color={Colors.light.textMuted}
            />
            <ThemedText style={styles.emptyText}>
              No knowledge snaps found.
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <DualTabBottomSheet
        isVisible={filterVisible}
        onClose={() => setFilterVisible(false)}
        tabOneLabel="Topics"
        tabTwoLabel="Saved"
        renderTabOne={() => <KnowledgeTopicsFilter />}
        renderTabTwo={() => <KnowledgeSavedFilter />}
        onApply={() => {
          setFilterVisible(false);
          // Handle filter application here
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
