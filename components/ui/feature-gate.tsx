import { FEATURE_FLAGS } from "@/constants/feature-flags";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ParticipationSlug } from "./participation-slug";

interface FeatureGateProps {
  level: number;
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  level,
  children,
  fallbackContent,
}) => {
  const { isLocked, requirement, tierName } = useFeatureGate(level);
  const primaryColor = useThemeColor({}, "primary");
  const secondaryTextColor = useThemeColor({}, "textSecondary");
  const backgroundColor = useThemeColor({}, "backgroundSecondary");

  if (!isLocked) {
    return <>{children}</>;
  }

  // GLOBAL OVERRIDE: If locked and overlays are disabled, hide entirely
  if (
    !FEATURE_FLAGS.SHOW_LOCKED_OVERLAYS &&
    !FEATURE_FLAGS.USE_PARTICIPATION_SLUGS
  ) {
    return null;
  }

  // OPTION: Participation Slug (Compact)
  if (FEATURE_FLAGS.USE_PARTICIPATION_SLUGS) {
    return <ParticipationSlug tierName={tierName} requirement={requirement} />;
  }

  return (
    <View style={styles.container}>
      {/* Blurred/Grayed background content */}
      <View style={styles.contentOverlay} pointerEvents="none">
        {children}
        <View
          style={[styles.blurMask, { backgroundColor: backgroundColor + "CC" }]}
        />
      </View>

      {/* Lock Message */}
      <View style={styles.lockContainer}>
        <View
          style={[styles.lockIconCircle, { backgroundColor: primaryColor }]}
        >
          <Ionicons name="lock-closed" size={24} color="#FFF" />
        </View>
        <ThemedText style={styles.lockTitle}>
          {tierName} Feature Locked
        </ThemedText>
        <Text style={[styles.lockSubtitle, { color: secondaryTextColor }]}>
          Earn {requirement} total Participation Credits to unlock this
          intelligence tier.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
  },
  contentOverlay: {
    opacity: 0.3,
  },
  blurMask: {
    ...StyleSheet.absoluteFillObject,
  },
  lockContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  lockIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lockTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  lockSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
});
