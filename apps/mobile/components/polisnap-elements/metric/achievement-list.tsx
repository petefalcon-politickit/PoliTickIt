import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Metric.Achievement.List
 *
 * A specialized list for tracking legislative milestones and accomplishments.
 * Uses semantic iconography for different types of achievements.
 */
export const AchievementListMolecule = ({ data }: any) => {
  const { title, drillDownSnapId, auditId } = data || {};
  // Handle both 'achievements' (objects) and 'items' (strings) from different oracles/mocks
  const rawItems = data?.achievements || data?.items || [];
  const achievements = rawItems.map((item: any) =>
    typeof item === "string"
      ? { title: item, type: "general", date: "Documented" }
      : item,
  );

  const router = useRouter();

  const hasDrillDown = !!(drillDownSnapId || auditId);

  const handleTrustThread = () => {
    const targetId = drillDownSnapId || auditId;
    if (targetId) {
      router.push({
        pathname: "/snap-viewer",
        params: { id: targetId },
      } as any);
    } else {
      router.push("/accountability");
    }
  };

  const getIcon = (type: string): any => {
    switch (type?.toLowerCase()) {
      case "law":
        return "document-text";
      case "amendment":
        return "construct";
      case "cosponsor":
        return "people";
      default:
        return "star";
    }
  };

  const getColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "law":
        return Colors.light.primary;
      case "amendment":
        return Colors.light.secondary;
      case "cosponsor":
        return Colors.light.textGray;
      default:
        return Colors.light.primary;
    }
  };

  return (
    <View style={GlobalStyles.achievementContainer}>
      <SeveredTitle
        title={title || "Legislative Achievements"}
        style={GlobalStyles.metricCardTitleLeft}
        textAlign="left"
      />
      <View style={styles.list}>
        {achievements?.map((item: any, i: number) => (
          <View key={i} style={styles.item}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: getColor(item.type) + "10" },
              ]}
            >
              <Ionicons
                name={getIcon(item.type)}
                size={16}
                color={getColor(item.type)}
              />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
              <View style={styles.meta}>
                <ThemedText style={styles.typeText}>
                  {item.type?.toUpperCase()}
                </ThemedText>
                <ThemedText style={styles.dot}>•</ThemedText>
                <ThemedText style={styles.dateText}>{item.date}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </View>

      {hasDrillDown && (
        <TouchableOpacity
          style={GlobalStyles.continuumFooter}
          activeOpacity={0.7}
          onPress={handleTrustThread}
        >
          <View>
            <ThemedText style={GlobalStyles.continuumLabel}>
              TRUST THREAD™
            </ThemedText>
            <ThemedText style={GlobalStyles.continuumSubtext}>
              Ledger-verified source documentation
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
    marginTop: 0, // Handled by GlobalStyles.metricCardTitleLeft marginBottom (15px)
  },
  item: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.text,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  typeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
  },
  dot: {
    fontSize: 10,
    color: Colors.light.textMuted,
  },
  dateText: {
    fontSize: 10,
    color: Colors.light.textTertiary,
  },
});

ComponentFactory.register("Metric.Achievement.List", ({ value }) => (
  <AchievementListMolecule data={value} />
));
