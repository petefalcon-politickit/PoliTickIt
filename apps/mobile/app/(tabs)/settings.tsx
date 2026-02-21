import { PoliTickItHeader } from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import { GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const settingsOptions = [
    {
      title: "Voter Verification",
      subtitle: "Secure your Rational Sentiment (RS)",
      icon: "shield-checkmark-outline",
      href: "/settings-voter-verification",
    },
    {
      title: "Representatives",
      subtitle: "Manage who you follow",
      icon: "person-outline",
      href: "/settings-reps",
    },
    {
      title: "Interests & Policies",
      subtitle: "Tailor your feed",
      icon: "options-outline",
      href: "/settings-interests",
    },
    {
      title: "Agencies & Governments",
      subtitle: "Local and Federal oversight",
      icon: "business-outline",
      href: "/settings-agencies",
    },
    {
      title: "Notifications",
      subtitle: "Alerts and frequency",
      icon: "notifications-outline",
      href: "/notifications-settings",
    },
    {
      title: "Help & Nexus Validation",
      subtitle: "E2E Truth Mirror Proof",
      icon: "help-circle-outline",
      href: "/help",
    },
    {
      title: "Sign Out",
      subtitle: "Logout of your account",
      icon: "log-out-outline",
      href: "/logout",
      isAction: true,
    },
  ];

  return (
    <DashboardBackground>
      <View style={GlobalStyles.screenContainer}>
        <PoliTickItHeader title="Settings" />
        <ScrollView contentContainerStyle={styles.container}>
          {settingsOptions.map((option, index) => (
            <Link key={index} href={option.href as any} asChild>
              <TouchableOpacity style={styles.option}>
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      option.isAction && { backgroundColor: "#FEE2E2" },
                    ]}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={22}
                      color={option.isAction ? "#EF4444" : "#64748B"}
                    />
                  </View>
                  <View>
                    <ThemedText
                      style={[
                        styles.optionTitle,
                        option.isAction && { color: "#EF4444" },
                      ]}
                    >
                      {option.title}
                    </ThemedText>
                    <ThemedText style={styles.optionSubtitle}>
                      {option.subtitle}
                    </ThemedText>
                  </View>
                </View>
                {!option.isAction && (
                  <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                )}
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  container: {
    paddingHorizontal: Spacing.lg,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: "#64748B",
    marginTop: 2,
  },
});
