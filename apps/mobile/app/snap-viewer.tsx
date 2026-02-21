import PoliTickItHeader from "@/components/navigation/header";
import { PoliSnapItem } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { TrustThreadStepper } from "@/components/ui/trust-thread-stepper";
import { GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Representative } from "@/types/user";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function SnapViewerScreen() {
  const { id, parentId, type } = useLocalSearchParams<{
    id?: string;
    parentId?: string;
    type?: string;
  }>();
  const { snapRepository, omniFeedProvider, representativeRepository } =
    useServices();
  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [representative, setRepresentative] = useState<Representative | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let results: PoliSnap[] = [];
        if (id) {
          const data = await snapRepository.getSnapById(id);
          results = data ? [data] : [];
        } else if (parentId) {
          // Use the Resource-based Omni-OS Feed Provider
          results = await omniFeedProvider.getRelatedSnaps(
            parentId,
            type || "drill-down",
          );
        }

        // Check if all items belong to a single representative
        const repIds = new Set(
          results.map((s) => s.metadata?.representativeId).filter(Boolean),
        );
        if (repIds.size === 1) {
          const repId = Array.from(repIds)[0] as string;
          const repData =
            await representativeRepository.getRepresentativeById(repId);
          setRepresentative(repData);
        } else {
          setRepresentative(null);
        }

        setSnaps(results);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    id,
    parentId,
    type,
    snapRepository,
    omniFeedProvider,
    representativeRepository,
  ]);

  const getHeaderTitle = () => {
    if (representative) return undefined;
    if (type === "debates") return "Floor Activity";
    if (type === "statements") return "Representative Proof";
    return "Insight Detail";
  };

  const getTrustLevel = (): 1 | 2 | 3 => {
    if (type === "summaries") return 1;
    if (type === "debates") return 2;
    if (type === "statements") return 3;

    // Fallback based on content if navigated directly via ID
    if (snaps.length > 0) {
      const insightType = snaps[0].metadata?.insightType;
      if (
        insightType === "Weekly Summary" ||
        insightType === "Accountability Record"
      )
        return 1;
      if (insightType === "Debate Summary" || insightType === "Floor Activity")
        return 2;
      if (
        insightType === "Transcript Statement" ||
        insightType === "Congressional Statement" ||
        insightType === "Transcript Statement"
      )
        return 3;
    }
    return 1; // Default
  };

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
        title={getHeaderTitle()}
        canGoBack={true}
        representative={
          representative
            ? {
                name: representative.name,
                avatar: representative.profileImage,
                position: representative.position,
                subtext: representative.district
                  ? `${representative.state}, ${representative.district}`
                  : representative.state,
              }
            : undefined
        }
      />
      <TrustThreadStepper currentLevel={getTrustLevel()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {snaps.length > 0 ? (
          snaps.map((snap) => (
            <PoliSnapItem
              key={snap.id}
              snap={snap}
              hideRepHeader={!!representative}
            />
          ))
        ) : (
          <View style={styles.errorContainer}>
            <ThemedText>No details found for this selection.</ThemedText>
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
