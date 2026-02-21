import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

/**
 * Visual.RipplePulse
 * Visualizes the district consensus as a "Pulse" and the user's own "Ripple".
 * Designed for the Consensus Ripple™ (EVO-013).
 */
export const RipplePulseMolecule = ({ data, onAction }: any) => {
  const { forensicSignalCoordinator, hapticService } = useServices();
  const [userRippleState, setUserRippleState] = useState<string>("Unset");
  const [isLoading, setIsLoading] = useState(true);

  const {
    id,
    district,
    consensusScore = 0, // -1 to 1
    voterDensity = 0,
    trustAnchor,
    uiMapping = {},
  } = data || {};

  // Fetch local state on mount
  useEffect(() => {
    const fetchLocalState = async () => {
      if (id) {
        const record = await forensicSignalCoordinator.getRipple(id);
        if (record) {
          setUserRippleState(record.user_state);
        }
      }
      setIsLoading(false);
    };
    fetchLocalState();
  }, [id, forensicSignalCoordinator]);

  const handleRippleUpdate = async (newState: any) => {
    if (newState === userRippleState) return;

    hapticService.triggerMediumImpact();
    setUserRippleState(newState);

    if (id && district) {
      await forensicSignalCoordinator.emitSignal({
        id,
        type: "ripple",
        value: newState === "Support" ? 1 : newState === "Oppose" ? -1 : 0,
        metadata: {
          district,
          state: newState,
        },
      });
    }

    onAction?.("ripple_update", { id, state: newState });
  };

  if (isLoading) {
    return (
      <View
        style={[styles.container, { height: 100, justifyContent: "center" }]}
      >
        <ActivityIndicator color={Colors.light.primary} />
      </View>
    );
  }

  // Map consensus from -1..1 to 0..100 for bar rendering
  const normalizedConsensus = ((consensusScore + 1) / 2) * 100;

  // Bar colors
  const consensusColor =
    consensusScore > 0 ? Colors.light.primary : Colors.light.accent;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.districtLabel}>
            {district} Consensus
          </ThemedText>
          <ThemedText style={styles.densityLabel}>
            {voterDensity}% Verified Participation
          </ThemedText>
        </View>
        <View style={styles.trustBadge}>
          <ThemedText style={styles.trustText}>
            {trustAnchor?.status || "Unverified"}
          </ThemedText>
        </View>
      </View>

      {/* The Pulse Bar */}
      <View style={styles.pulseTrack}>
        <View
          style={[
            styles.pulseFill,
            {
              width: `${normalizedConsensus}%`,
              backgroundColor: consensusColor,
            },
          ]}
        />
        {/* User's Ripple Indicator */}
        {userRippleState !== "Unset" && (
          <View
            style={[
              styles.userRippleIndicator,
              {
                left:
                  userRippleState === "Support"
                    ? "80%"
                    : userRippleState === "Oppose"
                      ? "20%"
                      : "50%",
              },
            ]}
          >
            <View style={styles.userRippleDot} />
            <ThemedText style={styles.userRippleText}>Your Ripple</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.labels}>
        <ThemedText style={styles.scoreText}>
          {consensusScore > 0 ? "+" : ""}
          {consensusScore.toFixed(2)}
        </ThemedText>
        <ThemedText style={styles.statusText}>
          {consensusScore > 0.3
            ? "Strong Support"
            : consensusScore < -0.3
              ? "Strong Oppose"
              : "Mixed Ripple"}
        </ThemedText>
      </View>

      {/* Tier 2 Interaction Mock */}
      <View style={styles.interactionLayer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            userRippleState === "Support" && styles.activeSupport,
          ]}
          onPress={() => handleRippleUpdate("Support")}
        >
          <ThemedText style={styles.buttonText}>Support</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            userRippleState === "Oppose" && styles.activeOppose,
          ]}
          onPress={() => handleRippleUpdate("Oppose")}
        >
          <ThemedText style={styles.buttonText}>Oppose</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colors.light.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  districtLabel: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.light.text,
  },
  densityLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  trustBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.light.border,
    borderRadius: 1,
  },
  trustText: {
    ...Typography.caption,
    fontSize: 9,
    fontFamily: "Courier",
    textTransform: "uppercase",
  },
  pulseTrack: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 1,
    width: "100%",
    position: "relative",
    marginVertical: 12,
  },
  pulseFill: {
    height: "100%",
    borderRadius: 1,
  },
  userRippleIndicator: {
    position: "absolute",
    top: -16,
    alignItems: "center",
    marginLeft: -25,
    width: 50,
  },
  userRippleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.text,
    borderWidth: 1,
    borderColor: "white",
  },
  userRippleText: {
    fontSize: 8,
    fontFamily: "Courier",
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: {
    ...Typography.h3,
    fontSize: 20,
    fontFamily: "Courier-Bold",
  },
  statusText: {
    ...Typography.caption,
    color: Colors.light.textMuted,
  },
  interactionLayer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 2,
  },
  buttonText: {
    ...Typography.caption,
    fontSize: 12,
  },
  activeSupport: {
    backgroundColor: Colors.light.primary + "20",
    borderColor: Colors.light.primary,
  },
  activeOppose: {
    backgroundColor: Colors.light.accent + "20",
    borderColor: Colors.light.accent,
  },
});

// Register with ComponentFactory
ComponentFactory.register("Visual.RipplePulse", RipplePulseMolecule);
