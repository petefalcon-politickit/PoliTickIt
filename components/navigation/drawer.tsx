import { Badge } from "@/components/ui/badge";
import { Colors, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useDrawer } from "@/contexts/drawer-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
    id: "notification",
    label: "Notification",
    icon: "bell-outline",
    route: "notifications",
  },
  {
    id: "watchlist",
    label: "Watchlist",
    icon: "bookmark-outline",
    route: "watchlist",
  },
];

const settingsItems: SettingsItem[] = [
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
    id: "impact",
    title: "Participation Capital",
    subtitle: "Track your intelligence standing",
    route: "participation",
  },
];

export const NavigationDrawer = () => {
  const { isOpen, closeDrawer } = useDrawer();
  const { counts, lastViewedRepresentativeId } = useActivity();
  const router = useRouter();
  const pathname = usePathname();
  const drawerWidth = Dimensions.get("window").width * 0.75;
  const slideAnim = React.useRef(new Animated.Value(-drawerWidth)).current;

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
        {/* Header with User Info */}
        <View style={styles.header}>
          <View style={styles.userContent}>
            <Text style={styles.userName}>Pete Falcon</Text>
            <Text style={styles.userLocation}>Colorado, District 4</Text>
          </View>
          {/* Logo Branding */}
          <View style={styles.logoBadge}>
            <Image
              source={require("@/assets/images/logo.svg")}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
        </View>

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
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  logoImage: {
    width: "70%",
    height: "70%",
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.textGray,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    letterSpacing: 0.5,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    height: 50,
  },
  activeItem: {
    backgroundColor: Colors.light.border,
    borderRadius: 30,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
    textAlign: "left",
  },
  activityRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 50,
    justifyContent: "flex-end",
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 70,
  },
  settingsContent: {
    flex: 1,
    gap: 4,
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
});

export default NavigationDrawer;
