import { currentUser } from "@/constants/mockData";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useDrawer } from "@/contexts/drawer-context";
import { useServices } from "@/contexts/service-provider";
import { VerificationTier } from "@/services/interfaces/IVerificationService";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CapitalLogo } from "../ui/capital-logo";
import { ParticipationStatusModal } from "../ui/participation-status-modal";
import { TierBadge } from "../ui/tier-badge";

interface PoliTickItHeaderProps {
  title?: string;
  onSearchPress?: () => void;
  hideSearch?: boolean;
  hideImpact?: boolean;
  canGoBack?: boolean;
  representative?: {
    name: string;
    avatar: string;
    subtext?: string;
    position?: string;
    isFollowing?: boolean;
    onFollowPress?: () => void;
  };
  user?: {
    name: string;
    avatar: any;
    level: number;
    tier: string;
  };
}

export const PoliTickItHeader: React.FC<PoliTickItHeaderProps> = ({
  title,
  onSearchPress,
  hideSearch = false,
  hideImpact = false,
  canGoBack = false,
  representative,
  user,
}) => {
  const { toggleDrawer } = useDrawer();
  const { contributionCredits } = useActivity();
  const { verificationService } = useServices();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isImpactModalVisible, setIsImpactModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkVerification = async () => {
        const status = await verificationService?.getCurrentStatus();
        setIsVerified(status?.tier === VerificationTier.Tier3_ZKResidency);
      };
      checkVerification();
    }, [verificationService]),
  );

  const handleImpactPress = () => {
    setIsImpactModalVisible(true);
  };

  const showBack = canGoBack;
  const showHamburger = !canGoBack;

  const renderContent = () => {
    if (user) {
      return (
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={user.avatar}
                style={styles.headerAvatar}
                contentFit="cover"
              />
              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={10} color="#FFF" />
                </View>
              )}
            </View>
            <View>
              <Text style={styles.userNameText}>{user.name}</Text>
              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.positionPill,
                    { backgroundColor: Colors.light.primary },
                  ]}
                >
                  <Text style={[styles.positionPillText, { color: "#FFFFFF" }]}>
                    LEVEL {user.level}
                  </Text>
                </View>
                <Text style={styles.location}>{user.tier}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (representative) {
      return (
        <View style={styles.userInfoWrapper}>
          <View style={[styles.userInfoRow, { flex: 1, gap: 10 }]}>
            <View style={styles.avatarGlowContainer}>
              <Image
                source={representative.avatar}
                style={styles.headerAvatar}
                contentFit="cover"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {representative.name}
              </Text>
              <View style={styles.metaRow}>
                {representative.position && (
                  <View style={styles.positionPill}>
                    <Text style={styles.positionPillText}>
                      {representative.position}
                    </Text>
                  </View>
                )}
                {representative.subtext && (
                  <Text
                    style={[styles.location, { flexShrink: 1 }]}
                    numberOfLines={1}
                  >
                    {representative.subtext}
                  </Text>
                )}
              </View>

              {/* Following Pillbox: Moved below position as requested */}
              {representative.onFollowPress && (
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <TouchableOpacity
                    onPress={representative.onFollowPress}
                    style={[
                      styles.followButton,
                      representative.isFollowing && styles.followingButton,
                    ]}
                  >
                    <Ionicons
                      name={
                        representative.isFollowing ? "checkmark-sharp" : "add"
                      }
                      size={10}
                      color={
                        representative.isFollowing
                          ? "#FFFFFF"
                          : Colors.light.primary
                      }
                    />
                    <Text
                      style={[
                        styles.followButtonText,
                        representative.isFollowing &&
                          styles.followingButtonText,
                      ]}
                    >
                      {representative.isFollowing ? "FOLLOWING" : "FOLLOW"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    }

    if (title) {
      return (
        <View style={styles.userInfoWrapper}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      );
    }

    return (
      <View style={styles.userInfoWrapper}>
        <View style={styles.userInfoRow}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => router.push("/profile")}
          >
            <Image
              source={currentUser.profileImage}
              style={styles.headerAvatar}
              contentFit="cover"
            />
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={10} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
          <View>
            <Text style={styles.userNameText}>{String(currentUser.name)}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.location}>
                {String(currentUser.state)}
                {" • "}
                {String(currentUser.district)}
              </Text>
              <TierBadge credits={contributionCredits} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.menuButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="arrow-back-outline"
              size={28}
              color={Colors.light.text}
            />
          </TouchableOpacity>
        )}
        {showHamburger && (
          <TouchableOpacity
            onPress={toggleDrawer}
            style={styles.menuButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="menu-outline" size={32} color={Colors.light.text} />
          </TouchableOpacity>
        )}
        <View
          style={[
            styles.content,
            !showHamburger && !showBack && { marginLeft: 0 },
            (showBack || showHamburger) && { marginLeft: 4 },
          ]}
        >
          {renderContent()}
        </View>
        <View style={styles.rightIcons}>
          {!hideSearch && (
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
          )}
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
    // UI Refinement: Removed heavy 4px border to align with Material Design standards.
    // Android: No separator (clean surface). iOS: Standard hairline separator for depth.
    borderBottomWidth: Platform.select({
      ios: StyleSheet.hairlineWidth,
      android: 0,
    }),
    borderBottomColor: Colors.light.separator,
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
    marginLeft: 0, // Removed redundant gap, menuButton already has paddingRight
  },
  userInfoWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  headerContextTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
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
  avatarWrapper: {
    position: "relative",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.light.success,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.light.backgroundSecondary,
  },
  avatarGlowContainer: {
    borderRadius: 20,
    padding: 1.5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 0,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingHorizontal: 10, // Slightly reduced for smaller text
    paddingVertical: 3, // Slightly reduced for smaller text
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: Colors.light.primary,
  },
  followButtonText: {
    fontSize: 8, // Dropped 2 units as requested (10 -> 8)
    fontWeight: "700",
    color: Colors.light.primary,
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  followingButtonText: {
    color: "#FFFFFF",
  },
  positionPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  positionPillText: {
    fontSize: 9, // Dropped 1 unit as requested (10 -> 9)
    fontWeight: "700",
    color: Colors.light.primary,
    textTransform: "uppercase",
  },
  location: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    letterSpacing: 0.1,
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
