import { currentUser } from "@/constants/mockData";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useDrawer } from "@/contexts/drawer-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CapitalLogo } from "../ui/capital-logo";
import { ParticipationStatusModal } from "../ui/participation-status-modal";

interface PoliTickItHeaderProps {
  title?: string;
  onSearchPress?: () => void;
  hideImpact?: boolean;
  representative?: {
    name: string;
    avatar: string;
    subtext?: string;
    position?: string;
  };
}

export const PoliTickItHeader: React.FC<PoliTickItHeaderProps> = ({
  title,
  onSearchPress,
  hideImpact = false,
  representative,
}) => {
  const { toggleDrawer } = useDrawer();
  const { contributionCredits } = useActivity();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isImpactModalVisible, setIsImpactModalVisible] = useState(false);

  const handleImpactPress = () => {
    setIsImpactModalVisible(true);
  };

  const showHamburger = true; // Always show hamburger now that tab bar is removed

  const renderContent = () => {
    if (representative) {
      return (
        <View style={styles.userInfoRow}>
          <Image
            source={representative.avatar}
            style={styles.headerAvatar}
            contentFit="cover"
          />
          <View>
            <Text style={styles.name}>{representative.name}</Text>
            <View style={styles.metaRow}>
              {representative.position && (
                <View style={styles.positionPill}>
                  <Text style={styles.positionPillText}>
                    {representative.position}
                  </Text>
                </View>
              )}
              {representative.subtext && (
                <Text style={styles.location}>{representative.subtext}</Text>
              )}
            </View>
          </View>
        </View>
      );
    }

    if (title) {
      return <Text style={styles.titleText}>{title}</Text>;
    }

    return (
      <View style={styles.userInfoRow}>
        <View style={styles.headerLogoContainer}>
          <Image
            source={require("@/assets/images/logo.svg")}
            style={styles.headerLogo}
            contentFit="contain"
          />
        </View>
        <View>
          <Text style={styles.name}>{String(currentUser.name)}</Text>
          <Text style={styles.location}>
            {String(currentUser.state)}
            {" • "}
            {String(currentUser.district)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <View style={styles.headerContent}>
        {showHamburger && (
          <TouchableOpacity
            onPress={toggleDrawer}
            style={styles.menuButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="menu-outline" size={32} color={Colors.light.text} />
          </TouchableOpacity>
        )}
        <View style={[styles.content, !showHamburger && { marginLeft: 0 }]}>
          {renderContent()}
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            disabled={!onSearchPress}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={onSearchPress ? Colors.light.text : "#E2E8F0"}
            />
          </TouchableOpacity>
          {!hideImpact && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleImpactPress}
            >
              <CapitalLogo credits={contributionCredits} size={26} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ParticipationStatusModal
        isVisible={isImpactModalVisible}
        onClose={() => setIsImpactModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    zIndex: 10,
    borderBottomWidth: 4, // Restoring Pulse brand thick bottom border
    borderBottomColor: Colors.light.border,
  },
  headerContent: {
    ...GlobalStyles.headerContent,
  },
  menuButton: {
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    marginLeft: -Spacing.xs, // Pull slightly into padding for visual optical alignment
  },
  content: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLogoContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F7FAFC",
    padding: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F7FAFC",
  },
  headerLogo: {
    width: "100%",
    height: "100%",
  },
  titleText: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    color: Colors.light.text,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    color: Colors.light.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -2, // Added 2px of space from previous -4
  },
  positionPill: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 2,
  },
  positionPillText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
  },
  rightIcons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginRight: -Spacing.xs, // Pull slightly into padding for visual optical alignment
  },
  iconButton: {
    padding: Spacing.xs,
  },
});

export default PoliTickItHeader;
