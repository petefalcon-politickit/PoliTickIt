import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

export type ComponentRenderProps = {
  dataField: string;
  value: any;
  metadata?: any;
  theme?: any;
  presentation?: any;
  extraProps?: any;
};

/**
 * Shadow Registry / Fallback Molecule
 * Renders a "Forensic Placeholder" for unknown element types to prevent app crashes
 * and maintain the Institutional aesthetic while the model/app matures.
 */
const ShadowFallbackMolecule = ({
  type,
  value,
}: {
  type: string;
  value: any;
}) => (
  <View style={styles.fallbackContainer}>
    <View style={GlobalStyles.row}>
      <Ionicons
        name="alert-circle-outline"
        size={14}
        color={Colors.light.textMuted}
        style={{ marginRight: 6 }}
      />
      <Text style={styles.fallbackTitle}>
        UNSUPPORTED MOLECULE: {String(type).toUpperCase()}
      </Text>
    </View>
    <View style={styles.shadowDataBlock}>
      <Text style={styles.fallbackText}>
        {typeof value === "object"
          ? JSON.stringify(value, null, 2)
          : String(value)}
      </Text>
    </View>
    <View style={styles.provenanceTag}>
      <Text style={styles.provenanceText}>PENDING REGISTRY HYDRATION</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  fallbackContainer: {
    padding: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 2,
    marginVertical: Spacing.xs,
  },
  fallbackTitle: {
    fontSize: 9,
    fontFamily: Typography.fonts.mono,
    fontWeight: "900",
    color: Colors.light.textMuted,
    letterSpacing: 1,
  },
  shadowDataBlock: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.border,
  },
  fallbackText: {
    fontSize: 11,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  provenanceTag: {
    marginTop: Spacing.sm,
    alignSelf: "flex-end",
  },
  provenanceText: {
    fontSize: 7,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textTertiary,
    opacity: 0.6,
  },
});

export class ComponentFactory {
  private static renderers: Map<
    string,
    (props: ComponentRenderProps) => JSX.Element
  > = new Map();

  static register(
    type: string,
    fn: (props: ComponentRenderProps) => JSX.Element,
  ) {
    this.renderers.set(String(type).toLowerCase(), fn);
  }

  static render(type: string, props: ComponentRenderProps) {
    const Renderer = this.renderers.get(String(type).toLowerCase());
    if (!Renderer) {
      return <ShadowFallbackMolecule type={type} value={props.value} />;
    }
    // Render as a proper React component to ensure hook isolation and fiber tree stability
    return <Renderer {...props} />;
  }

  static has(type: string): boolean {
    return this.renderers.has(String(type).toLowerCase());
  }
}

export default ComponentFactory;
