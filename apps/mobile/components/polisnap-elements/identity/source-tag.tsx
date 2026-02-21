import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Identity.Source.Tag
 * A clean, low-profile metadata line for citing sources and dates.
 * Prevents "attribution clutter" within visual elements.
 */
export const SourceTagMolecule = ({ data, navigationService }: any) => {
  const { source, date, reliability, url } = data || {};
  if (!source) return null;

  const handlePress = () => {
    if (navigationService && url) {
      navigationService.openExternalSource(url);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.footerContainer}
        onPress={handlePress}
        disabled={!url || !navigationService}
        activeOpacity={0.7}
      >
        <Ionicons
          name="information-circle-outline"
          size={14}
          color={url ? Colors.light.primary : Colors.light.textMuted}
        />
        <ThemedText
          style={[styles.text, url && { color: Colors.light.primary }]}
        >
          {source}
          {date && ` • ${date}`}
        </ThemedText>
        {reliability && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  reliability === "High"
                    ? Colors.light.successSubtle
                    : Colors.light.warningSubtle,
              },
            ]}
          >
            <ThemedText style={styles.badgeText}>{reliability}</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Neutral container to let snapContent padding handle the outer bounds
  },
  footerContainer: {
    ...GlobalStyles.snapFooter,
    paddingHorizontal: 0, // Let the parent Spacing.md handle alignment
    borderTopColor: Colors.light.border,
  },
  text: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textMuted,
    fontStyle: "italic",
  },
  sourceName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 2,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text, // Dark slate on light background
  },
});

ComponentFactory.register("Identity.Source.Tag", ({ value, extraProps }) => (
  <SourceTagMolecule
    data={value}
    navigationService={extraProps?.navigationService}
  />
));
