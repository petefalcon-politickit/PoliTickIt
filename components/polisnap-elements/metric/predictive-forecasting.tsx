import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { FeatureGate } from "@/components/ui/feature-gate";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface PredictiveForecastingProps {
  data: {
    billTitle: string;
    passageProbability: number;
    sentimentRipple: number; // 0 to 1
    momentum: "surging" | "stalling" | "stable";
    predictionSource: string;
  };
}

export const PredictiveForecastingMolecule: React.FC<
  PredictiveForecastingProps
> = ({ data }) => {
  const { billTitle, passageProbability, momentum } = data || {};
  const { navigationService } = useServices();

  const momentumColor =
    momentum === "surging"
      ? Colors.light.success
      : momentum === "stalling"
        ? Colors.light.error
        : Colors.light.textMuted;

  const momentumIcon =
    momentum === "surging"
      ? "trending-up"
      : momentum === "stalling"
        ? "trending-down"
        : "remove";

  const renderContent = () => (
    <View style={GlobalStyles.predictiveScoringContainer}>
      <View style={[GlobalStyles.rowBetween, { alignItems: "flex-start" }]}>
        <ThemedText style={[GlobalStyles.snapTitle, { flex: 1 }]}>
          {billTitle}
        </ThemedText>
        <TouchableOpacity
          onPress={() =>
            navigationService.navigate("knowledge", {
              snapId: "kn-guide-tier4-b2b",
            })
          }
          style={styles.helpIcon}
        >
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={Colors.light.textTertiary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mainGroup}>
        {/* LEFT: Passage Odds */}
        <View style={styles.oddsCol}>
          <ThemedText style={GlobalStyles.predictiveForecastingOddsLabel}>
            PASSAGE ODDS
          </ThemedText>
          <ThemedText style={GlobalStyles.predictiveForecastingOddsValue}>
            {passageProbability}%
          </ThemedText>
        </View>

        {/* CENTER: Sentiment Ripple */}
        <View style={styles.momentumCol}>
          <ThemedText style={GlobalStyles.predictiveForecastingMomentumLabel}>
            SENTIMENT RIPPLE
          </ThemedText>
          <View style={[GlobalStyles.row, { marginTop: 12 }]}>
            <Ionicons
              name={momentumIcon}
              size={22}
              color={momentumColor}
              style={{ marginRight: 9 }}
            />
            <ThemedText
              style={[
                GlobalStyles.predictiveForecastingMomentumValue,
                { color: momentumColor },
              ]}
            >
              {momentum.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        {/* RIGHT: Bullseye */}
        <View style={styles.rippleCol}>
          <View style={styles.rippleOuter}>
            <View
              style={[
                GlobalStyles.predictiveForecastingRipple,
                { transform: [{ scale: 1 }], opacity: 0.1 },
              ]}
            />
            <View
              style={[
                GlobalStyles.predictiveForecastingRipple,
                { transform: [{ scale: 0.7 }], opacity: 0.2 },
              ]}
            />
            <View
              style={[
                GlobalStyles.predictiveForecastingRipple,
                { transform: [{ scale: 0.4 }], opacity: 0.3 },
              ]}
            />
            <Ionicons name="analytics" size={18} color="#6B46C1" />
          </View>
        </View>
      </View>
    </View>
  );

  return <FeatureGate level={4}>{renderContent()}</FeatureGate>;
};

const styles = StyleSheet.create({
  helpIcon: {
    padding: 4,
    marginTop: -5,
  },
  mainGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: Spacing.sm,
  },
  rippleCol: {
    width: 60,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingTop: 12, // Align with the top of the big numeric value
  },
  rippleOuter: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  momentumCol: {
    flex: 1.2,
    alignItems: "center",
    marginLeft: -10,
  },
  oddsCol: {
    flex: 1,
    alignItems: "center",
    marginLeft: -20,
  },
});

ComponentFactory.register("Metric.Predictive.Forecasting", (props) => (
  <PredictiveForecastingMolecule data={props.value} />
));
