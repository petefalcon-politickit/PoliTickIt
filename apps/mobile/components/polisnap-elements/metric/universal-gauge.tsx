import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Universal.Gauge (Polymorphic Molecule)
 * Supports multiple visualization modes for spectral and intensity data.
 * Patterns: Spectrum (0-100, center 50), Friction (0-1.0, G->R), Intensity (Radial)
 */

interface UniversalGaugeProps {
  data: {
    title?: string;
    label?: string; // New: label for description
    subLabel?: string; // New: sub-label for metadata
    value: number; // 0-100 or 0-1.0
    mode: "Spectrum" | "Friction" | "Radial" | "Linear"; // Added Linear
    leftLabel?: string;
    rightLabel?: string;
    insight?: string;
    intensity?: "Low" | "Medium" | "High" | "Critical";
  };
}

export const UniversalGaugeMolecule: React.FC<UniversalGaugeProps> = ({
  data,
}) => {
  const {
    title,
    label,
    subLabel,
    value,
    mode,
    leftLabel,
    rightLabel,
    insight,
    intensity,
  } = data || {};

  // Normalize values: handle both 0-1.0 and 0-100 inputs automatically
  const rawValue = value || 0;
  const normalizedValue =
    rawValue <= 1.0 && rawValue > 0 ? rawValue * 100 : rawValue;
  const position = Math.min(Math.max(normalizedValue, 0), 100);

  const renderSpectrum = () => (
    <View style={styles.trackContainer}>
      <View style={styles.track}>
        <View style={styles.midpoint} />
        <View style={[styles.indicator, { left: `${position}%` }]}>
          <View style={styles.indicatorPin} />
        </View>
      </View>
      <View style={styles.labels}>
        <ThemedText style={styles.labelText}>{leftLabel || "Left"}</ThemedText>
        <ThemedText style={styles.labelText}>
          {rightLabel || "Right"}
        </ThemedText>
      </View>
    </View>
  );

  const renderFriction = () => {
    // Friction mapping 0 (Green) to 1 (Red)
    const frictionColor =
      position > 70
        ? Colors.light.error
        : position > 40
          ? Colors.light.warning
          : Colors.light.success;

    return (
      <View style={styles.trackContainer}>
        <View
          style={[styles.track, { backgroundColor: Colors.light.separator }]}
        >
          <View
            style={[
              styles.frictionFill,
              { width: `${position}%`, backgroundColor: frictionColor },
            ]}
          />
        </View>
        <View style={styles.labels}>
          <ThemedText style={styles.labelText}>
            {label || leftLabel || "Velocity"}
          </ThemedText>
          <ThemedText style={[styles.labelText, { color: frictionColor }]}>
            {subLabel || intensity || (position > 70 ? "Stagnant" : "Fluid")}
          </ThemedText>
        </View>
      </View>
    );
  };

  const renderLinear = () => (
    <View style={styles.trackContainer}>
      <View style={[styles.track, { backgroundColor: Colors.light.separator }]}>
        <View
          style={[
            styles.frictionFill,
            { width: `${position}%`, backgroundColor: Colors.light.primary },
          ]}
        />
      </View>
      <View style={styles.labels}>
        <ThemedText style={styles.labelText}>{label || "Impact"}</ThemedText>
        <ThemedText style={styles.labelText}>
          {subLabel || `${Math.round(position)}%`}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <View style={GlobalStyles.gaugeContainer}>
      {title && (
        <SeveredTitle
          title={title}
          style={GlobalStyles.gaugeTitle}
          textAlign="left"
        />
      )}

      {mode === "Friction"
        ? renderFriction()
        : mode === "Linear"
          ? renderLinear()
          : renderSpectrum()}

      {insight ? (
        <View style={styles.insightBox}>
          <ThemedText style={styles.insightText}>{insight}</ThemedText>
        </View>
      ) : (
        <View style={{ height: Spacing.xs }} /> // Minimal buffer when no insight
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    marginBottom: 0, // Removed bottom margin to allow card padding to handle it
  },
  track: {
    height: 8,
    backgroundColor: Colors.light.separator,
    borderRadius: 4,
    position: "relative",
    justifyContent: "center",
    overflow: "hidden",
  },
  midpoint: {
    position: "absolute",
    left: "50%",
    width: 2,
    height: 12,
    backgroundColor: Colors.light.textMuted,
  },
  indicator: {
    position: "absolute",
    width: 20,
    height: 20,
    marginLeft: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorPin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    borderWidth: 3,
    borderColor: Colors.light.backgroundSecondary,
  },
  frictionFill: {
    height: "100%",
    borderRadius: 4,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  labelText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textSecondary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  insightBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  insightText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
    lineHeight: 20,
    fontStyle: "italic" as any,
  },
});

// Register with the universal key
ComponentFactory.register("Universal.Gauge", (config) => (
  <UniversalGaugeMolecule data={config.value} />
));

// Backwards compatibility for the migration phase
ComponentFactory.register("Metric.Alignment.Gauge", (config) => (
  <UniversalGaugeMolecule data={{ ...config.value, mode: "Spectrum" }} />
));
