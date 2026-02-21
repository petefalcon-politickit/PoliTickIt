import { Badge } from "@/components/ui/badge";
import { currentUser } from "@/constants/mockData";
import { Colors, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useDrawer } from "@/contexts/drawer-context";
import { useServices } from "@/contexts/service-provider";
import { VerificationTier } from "@/services/interfaces/IVerificationService";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GenotypeToggle } from "./genotype-toggle";

interface ActivityItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle: string;
  route: string;
}

const activityItems: ActivityItem[] = [
  {
    id: "accountability",
    label: "Accountability",
    icon: "scale-balance",
    route: "accountability",
  },
  {
    id: "community",
    label: "Community",
    icon: "share-variant",
    route: "community",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    icon: "book-open-variant",
    route: "knowledge",
  },
  {
    id: "representative",
    label: "Representative",
    icon: "account-outline",
    route: "representative",
  },
  {
    id: "watchlist",
    label: "Watchlist",
    icon: "bookmark-outline",
    route: "watchlist",
  },
  {
    id: "notification",
    label: "Notification",
    icon: "bell-outline",
    route: "notifications",
  },
];

const settingsItems: SettingsItem[] = [
  {
    id: "settings-voter-verification",
    title: "Voter Verification",
    subtitle: "Secure your Rational Sentiment (RS)",
    route: "settings-voter-verification",
  },
  {
    id: "settings-reps",
    title: "Representatives",
    subtitle: "Manage your representatives",
    route: "settings-reps",
  },
  {
    id: "settings-interests",
    title: "Interests",
    subtitle: "Select topics you care about",
    route: "settings-interests",
  },
  {
    id: "settings-agencies",
    title: "Agencies",
    subtitle: "Stay updated on agencies",
    route: "settings-agencies",
  },
  {
    id: "notifications-settings",
    title: "Notifications",
    subtitle: "Signal Intelligence & Gating",
    route: "notifications-settings",
  },
  {
    id: "impact",
    title: "Participation Capital",
    subtitle: "Track your intelligence standing",
    route: "participation",
  },
  {
    id: "help",
    title: "Help & Validation",
    subtitle: "Nexus E2E Proof-of-Concept",
    route: "help",
  },
];

export const NavigationDrawer = () => {
  const { isOpen, closeDrawer } = useDrawer();
  const { counts, lastViewedRepresentativeId } = useActivity();
  const { verificationService } = useServices();
  const router = useRouter();
  const pathname = usePathname();
  const drawerWidth = Dimensions.get("window").width * 0.75;
  const slideAnim = React.useRef(new Animated.Value(-drawerWidth)).current;

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const check = async () => {
        const s = await verificationService?.getCurrentStatus();
        setIsVerified(s?.tier === VerificationTier.Tier3_ZKResidency);
      };
      check();
    }
  }, [isOpen, verificationService]);

  // Derive active route from pathname (e.g., "/representative" -> "representative")
  const activeRoute =
    pathname.split("/").filter(Boolean)[0] || "accountability";

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -drawerWidth,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOpen, drawerWidth, slideAnim]);

  const handleActivityPress = (route: string) => {
    closeDrawer();

    // UI Optimization: If navigating to Representative, try to use the last viewed ID
    // to avoid the intermediate "no-id" state and redirect flicker.
    if (route === "representative") {
      const targetId = lastViewedRepresentativeId;
      if (targetId) {
        router.push({
          pathname: "/representative",
          params: { id: targetId },
        });
        return;
      }
    }

    router.push(`/${route}` as any);
  };

  const handleSettingsPress = (route: string) => {
    closeDrawer();
    router.push(`/${route}` as any);
  };

  const handleSignOut = () => {
    closeDrawer();
    router.push("/logout" as any);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeDrawer}
      />

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { width: drawerWidth, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.topUtility}>
          <GenotypeToggle />
        </View>

        {/* Header with User Info */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            closeDrawer();
            router.push("/profile");
          }}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={currentUser.profileImage}
              style={styles.headerAvatar}
              contentFit="cover"
            />
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={12}
                  color="#FFF"
                />
              </View>
            )}
          </View>
          <View style={styles.userContent}>
            <Text style={styles.userName}>{String(currentUser.name)}</Text>
            <Text style={styles.userLocation}>
              {String(currentUser.state)}, {String(currentUser.district)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Activity Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVITY</Text>
            {activityItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.activityItem,
                  activeRoute === item.route && styles.activeItem,
                ]}
                onPress={() => handleActivityPress(item.route)}
              >
                <View style={styles.activityLeft}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color={Colors.light.text}
                    />
                  </View>
                  <Text style={styles.activityLabel}>{item.label}</Text>
                </View>
                <View style={styles.activityRight}>
                  <Badge
                    value={counts[item.id as keyof typeof counts] || 0}
                    type="red"
                  />
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={Colors.light.textGray}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SETTINGS</Text>
            {settingsItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.settingsItem}
                onPress={() => handleSettingsPress(item.route)}
              >
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsTitle}>{item.title}</Text>
                  <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.activityRight}>
                  <Badge value="●" type="blue" />
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={Colors.light.textGray}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Separator */}
          <View style={styles.separatorLine} />

          {/* Onboarding Demo Trigger */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => {
              closeDrawer();
              router.push("/login");
            }}
          >
            <MaterialCommunityIcons
              name="rocket-launch-outline"
              size={20}
              color={Colors.light.primary}
            />
            <Text style={[styles.signOutText, { color: Colors.light.primary }]}>
              Start Onboarding
            </Text>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={Colors.light.accent}
            />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.light.background,
    borderRightWidth: 1,
    borderRightColor: Colors.light.border,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userContent: {
    flex: 1,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  userLocation: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    opacity: 0.9,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: 12, // Adjusted for the marginRight of avatarWrapper
    backgroundColor: Colors.light.success,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.heavy,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 44,
  },
  activeItem: {
    backgroundColor: Colors.light.border,
    borderRadius: 8, // More mechanical than rounded 30
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  activityLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    fontFamily: Typography.fonts.sans,
    color: Colors.light.text,
    textAlign: "left",
  },
  activityRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 40,
    justifyContent: "flex-end",
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    minHeight: 45,
  },
  settingsContent: {
    flex: 1,
    gap: 2,
  },
  settingsTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  settingsSubtitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    color: Colors.light.textGray,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  signOutText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.accent,
  },
  topUtility: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: "flex-start",
  },
});

export default NavigationDrawer;
