import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapItem } from "@/components/polisnap-renderer";
import { GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function SnapViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { poliSnapRepository } = useServices();
  const [snap, setSnap] = useState<PoliSnap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnap = async () => {
      if (!id) return;
      try {
        const data = await poliSnapRepository.getSnapById(id);
        setSnap(data);
      } catch (error) {
        console.error("Failed to fetch snap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnap();
  }, [id, poliSnapRepository]);

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
      <PoliTickItHeader title="Insight Detail" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {snap ? (
          <PoliSnapItem snap={snap} />
        ) : (
          <View style={styles.errorContainer}>
            <ActivityIndicator size="small" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing["2xl"],
  },
  errorContainer: {
    marginTop: 100,
    alignItems: "center",
  },
});
