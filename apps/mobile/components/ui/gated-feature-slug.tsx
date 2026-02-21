import { Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SeveredTitle } from "./severed-title";

interface GatedFeatureSlugProps {
  tierName: string;
  requirement: number;
  featureTitle?: string;
  featureDescription?: string;
  onUnlockPress?: () => void;
}

/**
 * GatedFeatureSlug
 * A high-density interstitial that replaces a full PoliSnap or Element when locked.
 * Focuses on 'Value Discovery' rather than 'Content Obstruction'.
 */
export const GatedFeatureSlug: React.FC<GatedFeatureSlugProps> = ({
  tierName,
  requirement,
  featureTitle = "Advanced Intelligence",
  featureDescription = "This forensic analysis contains restricted data points.",
  onUnlockPress,
}) => {
  const primaryColor = useThemeColor({}, "primary");
  const { navigationService } = useServices();

  const handlePress = () => {
    if (onUnlockPress) {
      onUnlockPress();
    } else {
      navigationService.navigate("participation");
    }
  };

  // Tier-specific accents
  const getTierAccent = () => {
    switch (tierName.toLowerCase()) {
      case "intelligence":
        return "#3182CE";
      case "roi auditor":
        return "#38A169";
      case "institutional":
        return "#805AD5";
      default:
        return primaryColor;
    }
  };

  const accent = getTierAccent();

  return (
    <View style={styles.gutterWrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[styles.container, { borderColor: accent + "20" }]}
      >
        <View style={[styles.accentBar, { backgroundColor: accent }]} />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.tierLabel, { color: accent }]}>
              {tierName.toUpperCase()}
            </Text>
            <View style={styles.lockRow}>
              <Ionicons
                name="lock-closed"
                size={10}
                color={accent}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.requirementText, { color: accent }]}>
                {requirement} Credits
              </Text>
            </View>
          </View>

          <SeveredTitle
            title={featureTitle || "Locked Feature"}
            style={styles.title}
            textAlign="left"
          />
          <Text style={styles.description} numberOfLines={2}>
            {featureDescription}
          </Text>
        </View>

        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  gutterWrapper: {
    backgroundColor: "#F1F5F9", // Muted Institutional Gray (Slate 100)
    paddingVertical: 4, // Syncs with 8px Gutter to create consistent 12px vertical spacing
    width: "100%",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    minHeight: 80,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
  accentBar: {
    width: 4,
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementText: {
    fontSize: 10,
    fontWeight: "600",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#718096",
    lineHeight: 16,
  },
  chevron: {
    paddingRight: 12,
  },
});
