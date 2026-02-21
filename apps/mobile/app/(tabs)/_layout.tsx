import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { counts } = useActivity();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.OS === "android" ? { display: "none" } : {},
      }}
    >
      <Tabs.Screen
        name="accountability"
        options={{
          title: "Accountability",
          tabBarBadge:
            counts.accountability > 0 ? counts.accountability : undefined,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="participation"
        options={{
          title: "Impact",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarBadge: counts.community > 0 ? counts.community : undefined,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: "Knowledge",
          tabBarBadge: counts.knowledge > 0 ? counts.knowledge : undefined,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="representative"
        options={{
          title: "Rep",
          tabBarBadge:
            counts.representative > 0 ? counts.representative : undefined,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notify",
          tabBarBadge:
            counts.notification > 0 ? counts.notification : undefined,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bell.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarBadge: counts.watchlist > 0 ? counts.watchlist : undefined,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bookmark.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
