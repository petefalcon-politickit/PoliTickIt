import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ComponentFactory } from "../../factories/component-factory";

interface StatusItem {
  id: string;
  name: string;
  status: string;
  color: string;
  progress?: number;
  type?: "rep" | "bill";
  party?: string;
}

interface StatusGridProps {
  data: {
    title: string;
    items: StatusItem[];
  };
}

export const StatusGrid: React.FC<StatusGridProps> = ({ data }) => {
  const { title, items } = data;

  return (
    <View style={GlobalStyles.statusGridContainer}>
      <ThemedText style={GlobalStyles.metricCardTitleLeft}>{title}</ThemedText>
      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View
                style={[styles.indicator, { backgroundColor: item.color }]}
              />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={[styles.statusText, { color: item.color }]}>
                {item.status}
              </Text>
              {item.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${item.progress * 100}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              )}
              {item.party && (
                <View style={styles.partyBadge}>
                  <Text style={styles.partyText}>{item.party}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.idText}>{item.id}</Text>
              <Ionicons
                name="chevron-forward"
                size={12}
                color={Colors.light.textMuted}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.sans,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  card: {
    width: "48%", // Roughly 2 items per row
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.sm,
    justifyContent: "space-between",
    minHeight: 90,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemName: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.text,
    flex: 1,
  },
  cardBody: {
    flex: 1,
    justifyContent: "center" as any,
  },
  statusText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 4,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  partyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
  },
  partyText: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.light.textSlate,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  idText: {
    fontSize: 10,
    color: Colors.light.textMuted,
    fontWeight: "500",
  },
});

ComponentFactory.register("Metric.Status.Grid", ({ value }) => (
  <StatusGrid data={value} />
));
