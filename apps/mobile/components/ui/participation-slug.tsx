import { Colors, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ParticipationSlugProps {
  message?: string;
  tierName?: string;
  requirement?: number;
  onPress?: () => void;
}

export const ParticipationSlug: React.FC<ParticipationSlugProps> = ({
  message,
  tierName,
  requirement,
  onPress,
}) => {
  const primaryColor = useThemeColor({}, "primary");
  const secondaryTextColor = useThemeColor({}, "textSecondary");
  const { navigationService } = useServices();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default to opening the participation screen / Intelligence feature page
      navigationService.navigate("participation");
    }
  };

  const displayText =
    message ||
    (tierName && requirement
      ? `Intelligence Earned: Unlock ${tierName} insights with ${requirement} Participation Credits.`
      : "The Wisdom of the Village: Every vote powers our collective intelligence.");

  // Brand color for Intelligence (Amethyst)
  const intelligencePurple = Colors.light.intelligence;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.slugContainer,
        {
          borderColor: Colors.light.intelligenceSubtle, // Use theme variable
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: Colors.light.intelligenceSubtle },
        ]}
      >
        <Ionicons name="flash-outline" size={14} color={intelligencePurple} />
      </View>
      <Text style={[styles.slugText, { color: secondaryTextColor }]}>
        {displayText}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={12}
        color={intelligencePurple}
        style={{ marginLeft: "auto", opacity: 0.8 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slugContainer: {
    minHeight: 48, // Changed from fixed height to minHeight to handle wrapping
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10, // Added vertical padding for wrapped text
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.light.backgroundSecondary,
    alignSelf: "stretch",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  slugText: {
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.1,
    flex: 1,
    marginRight: 16, // Extra right margin to ensure text wraps before hitting the chevron
  },
});
