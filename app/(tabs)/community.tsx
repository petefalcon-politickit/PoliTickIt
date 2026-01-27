import {
    CommunityAllPostsFilter,
    CommunityFollowingFilter,
} from "@/components/filters/community-filters";
import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function CommunityScreen() {
  const { poliSnapRepository } = useServices();
  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const fetchSnaps = async () => {
      try {
        const data = await poliSnapRepository.getSnapsByCategory("community");
        setSnaps(data);
      } catch (error) {
        console.error("Failed to fetch community snaps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnaps();
  }, [poliSnapRepository]);

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
        title="Community"
        onSearchPress={() => setFilterVisible(true)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PoliSnapCollection poliSnaps={snaps as any} />
      </ScrollView>

      <DualTabBottomSheet
        isVisible={filterVisible}
        onClose={() => setFilterVisible(false)}
        tabOneLabel="Following"
        tabTwoLabel="All Posts"
        renderTabOne={() => <CommunityFollowingFilter />}
        renderTabTwo={() => <CommunityAllPostsFilter />}
        onApply={() => {
          setFilterVisible(false);
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
