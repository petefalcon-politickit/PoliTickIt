import {
    KnowledgeSavedFilter,
    KnowledgeTopicsFilter,
} from "@/components/filters/knowledge-filters";
import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function KnowledgeScreen() {
  const { poliSnapRepository } = useServices();
  const { snapId } = useLocalSearchParams<{ snapId?: string }>();
  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const fetchSnaps = async () => {
      try {
        const data = await poliSnapRepository.getSnapsByCategory("knowledge");
        setSnaps(data);
      } catch (error) {
        console.error("Failed to fetch knowledge snaps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnaps();
  }, [poliSnapRepository]);

  const sortedSnaps = useMemo(() => {
    if (!snapId) return snaps;

    // Move the requested snap to the top
    const highlightIndex = snaps.findIndex((s) => s.id === snapId);
    if (highlightIndex === -1) return snaps;

    const highlighted = snaps[highlightIndex];
    const filtered = snaps.filter((_, i) => i !== highlightIndex);
    return [highlighted, ...filtered];
  }, [snaps, snapId]);

  if (loading) {
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PoliSnapCollection poliSnaps={sortedSnaps as any} />
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
});
