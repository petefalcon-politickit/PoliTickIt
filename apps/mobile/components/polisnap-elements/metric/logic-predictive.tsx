import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Logic.Predictive (Polymorphic Molecule)
 * Consolidated intelligence for passage probability, momentum tracking, and algorithmic forecasting.
 * Modes: Single (Forecasting), List (Scoring)
 */

interface PredictiveItem {
  id: string;
  name: string;
  probability: number;
  trend: "up" | "down" | "stable" | "surging" | "stalling";
  category?: string;
}

interface LogicPredictiveProps {
  data: {
    mode: "Single" | "List";
    title?: string;

    // Single Mode Data
    billTitle?: string;
    passageProbability?: number;
    momentum?: "surging" | "stalling" | "stable";
    predictionSource?: string;

    // List Mode Data
    items?: PredictiveItem[];

    // Navigation / Drill-Down
    knowledgeSnapId?: string;
  };
}

export const LogicPredictiveMolecule: React.FC<LogicPredictiveProps> = ({
  data,
}) => {
  const {
    mode,
    title,
    billTitle,
    passageProbability,
    momentum,
    predictionSource,
    items,
    knowledgeSnapId,
  } = data || {};
  const router = useRouter();

  const handleKnowledgeDrill = () => {
    if (knowledgeSnapId) {
      router.push({
        pathname: "/snap-viewer",
        params: { id: knowledgeSnapId },
      });
    }
  };

  const getMomentumColor = (m?: string) => {
    if (m === "surging" || m === "up") return Colors.light.success;
    if (m === "stalling" || m === "down") return Colors.light.error;
    return Colors.light.textMuted;
  };

  const getMomentumIcon = (m?: string) => {
    if (m === "surging" || m === "up") return "trending-up";
    if (m === "stalling" || m === "down") return "trending-down";
    return "remove";
  };

  const ProbabilityTicker = ({ val }: { val: number }) => (
    <View style={styles.tickerContainer}>
      <ThemedText style={styles.tickerValue}>{val}%</ThemedText>
      <ThemedText style={styles.tickerLabel}>PROBABILITY</ThemedText>
    </View>
  );

  const renderSingle = () => (
    <View style={GlobalStyles.predictiveScoringContainer}>
      <View style={[GlobalStyles.rowBetween, { alignItems: "flex-start" }]}>
        <ThemedText style={[GlobalStyles.snapTitle, { flex: 1 }]}>
          {billTitle}
        </ThemedText>
        {knowledgeSnapId && (
          <TouchableOpacity onPress={handleKnowledgeDrill}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={Colors.light.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.mainForecasting}>
        <ProbabilityTicker val={passageProbability || 0} />

        <View style={styles.momentumCol}>
          <View style={GlobalStyles.row}>
            <Ionicons
              name={getMomentumIcon(momentum)}
              size={20}
              color={getMomentumColor(momentum)}
            />
            <ThemedText
              style={[
                styles.momentumText,
                { color: getMomentumColor(momentum) },
              ]}
            >
              {momentum?.toUpperCase() || "STABLE"}
            </ThemedText>
          </View>
          <ThemedText style={styles.sourceText}>
            Source: {predictionSource || "Omni-Forecaster"}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderList = () => (
    <View style={GlobalStyles.predictiveScoringContainer}>
      <ThemedText style={GlobalStyles.metricCardTitleLeft}>
        {title || "PREDICTIVE SCORING"}
      </ThemedText>
      <View style={styles.list}>
        {items?.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.infoCol}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              {item.category && (
                <ThemedText style={styles.itemCategory}>
                  {item.category}
                </ThemedText>
              )}
            </View>
            <View style={styles.scoreCol}>
              <ThemedText style={styles.probabilityValue}>
                {item.probability}%
              </ThemedText>
              <Ionicons
                name={getMomentumIcon(item.trend)}
                size={16}
                color={getMomentumColor(item.trend)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return mode === "List" ? renderList() : renderSingle();
};

const styles = StyleSheet.create({
  tickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  tickerValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.light.primary,
  },
  tickerLabel: {
    fontSize: 7,
    fontWeight: "800",
    color: Colors.light.textMuted,
  },
  mainForecasting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: Spacing.md,
  },
  momentumCol: {
    flex: 1,
  },
  momentumText: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 4,
  },
  sourceText: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    marginTop: 4,
  },
  list: {
    marginTop: Spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  infoCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
  },
  itemCategory: {
    fontSize: 10,
    color: Colors.light.textTertiary,
  },
  scoreCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  probabilityValue: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.primary,
  },
});

// Register with ComponentFactory
ComponentFactory.register("Logic.Predictive", (config) => (
  <LogicPredictiveMolecule data={config.value} />
));

// Backwards compatibility
ComponentFactory.register("Metric.PredictiveScoring", (config) => (
  <LogicPredictiveMolecule data={{ ...config.value, mode: "List" }} />
));

ComponentFactory.register("Metric.PredictiveForecasting", (config) => (
  <LogicPredictiveMolecule data={{ ...config.value, mode: "Single" }} />
));
