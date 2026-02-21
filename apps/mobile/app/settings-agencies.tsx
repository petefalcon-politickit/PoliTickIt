import { PoliTickItHeader } from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { Agency } from "@/services/interfaces/IAgencyRepository";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";

const SettingsAgenciesScreen = () => {
  const { agencyRepository, hapticService } = useServices();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    setLoading(true);
    try {
      const data = await agencyRepository.getAllAgencies();
      setAgencies(data);
    } catch (error) {
      console.error("Failed to load agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgency = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Optimistic UI Update
    setAgencies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_following: newStatus } : a)),
    );

    hapticService.triggerLightImpact();

    try {
      await agencyRepository.toggleFollow(id, newStatus);
    } catch (error) {
      console.error("Failed to toggle agency follow:", error);
      // Revert on failure
      setAgencies((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_following: !newStatus } : a)),
      );
    }
  };

  const renderItem = ({ item }: { item: Agency }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => toggleAgency(item.id, !!item.is_following)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={styles.agencyIcon}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.agencyIcon, styles.iconPlaceholder]}>
              <Ionicons
                name="business"
                size={16}
                color={Colors.light.textPlaceholder}
              />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.agencyName} type="defaultSemiBold">
            {item.name}
          </ThemedText>
          <ThemedText style={styles.description} numberOfLines={2}>
            {item.description}
          </ThemedText>

          {item.metadata && (
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Ionicons
                  name="people-outline"
                  size={10}
                  color={Colors.light.textTertiary}
                />
                <ThemedText style={styles.metricText}>
                  {item.metadata.constituentCount?.toLocaleString()}
                </ThemedText>
              </View>
              <View style={styles.metricItem}>
                <Ionicons
                  name="pulse-outline"
                  size={10}
                  color={Colors.light.primary}
                />
                <ThemedText
                  style={[styles.metricText, { color: Colors.light.primary }]}
                >
                  {item.metadata.activityPulse}% Engagement
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </View>
      <Switch
        value={!!item.is_following}
        onValueChange={() => toggleAgency(item.id, !!item.is_following)}
        trackColor={{ false: "#E2E8F0", true: Colors.light.primary }}
        thumbColor="#FFFFFF"
      />
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader title="Agencies & Interests" />
      <ThemedView style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : (
          <FlatList
            data={agencies}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ThemedView>
    </View>
  );
};

export default SettingsAgenciesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      default: {
        elevation: 1,
      },
    }),
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 12,
  },
  agencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  iconPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  agencyName: {
    fontSize: 14,
    color: Colors.light.text,
  },
  description: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: "row",
    marginTop: 6,
    gap: 12,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
  },
});
