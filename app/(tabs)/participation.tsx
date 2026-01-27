import { PoliTickItHeader } from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { CapitalLogo } from "@/components/ui/capital-logo";
import { Colors, GlobalStyles, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ParticipationCapitalScreen() {
  const { contributionCredits } = useActivity();
  const [actionsExpanded, setActionsExpanded] = useState(false);
  const [tiersExpanded, setTiersExpanded] = useState(true);

  const TIERS = [
    {
      level: 1,
      name: "Standard",
      requirement: 0,
      description: "Basic legislative tracking and public sentiment access.",
      color: "#94A3B8",
    },
    {
      level: 2,
      name: "Intelligence",
      requirement: 500,
      description: "Unlock FEC correlation data and donor influence maps.",
      color: Colors.light.primary,
    },
    {
      level: 3,
      name: "ROI Auditor",
      requirement: 1200,
      description: "Full ROI Scorecards and accountability analysis tools.",
      color: Colors.light.secondary,
    },
    {
      level: 4,
      name: "Institutional",
      requirement: 2500,
      description:
        "AI-driven predictive pivoting and B2B legislative forensics.",
      color: "#8B5CF6",
    },
  ];

  const ACTIONS = [
    {
      title: "Pulse Sentiment",
      reward: "+25",
      icon: "pulse-outline",
      description: "React to a policy or representative action in your feed.",
    },
    {
      title: "Detailed Action",
      reward: "+100",
      icon: "chatbubble-ellipses-outline",
      description: "Complete a call to action or attend a virtual town hall.",
    },
    {
      title: "Share Intelligence",
      reward: "+50",
      icon: "share-social-outline",
      description: "Distribute a critical insight to your social community.",
    },
  ];

  const currentTier =
    [...TIERS].reverse().find((t) => contributionCredits >= t.requirement) ||
    TIERS[0];
  const nextTier = TIERS.find((t) => t.requirement > contributionCredits);
  const progress = nextTier
    ? (contributionCredits - currentTier.requirement) /
      (nextTier.requirement - currentTier.requirement)
    : 1;

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader title="Participation Capital" hideImpact={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Credit Display */}
        <View style={styles.heroSection}>
          <View style={styles.heroLeft}>
            <CapitalLogo credits={contributionCredits} size={32} />
            <View style={styles.creditInfo}>
              <ThemedText style={styles.creditLabel}>Total Credits</ThemedText>
              <ThemedText style={styles.creditValue}>
                {contributionCredits}
              </ThemedText>
            </View>
          </View>

          <View style={styles.currentTierBadge}>
            <ThemedText style={[styles.tierName, { color: currentTier.color }]}>
              Tier {currentTier.level}: {currentTier.name}
            </ThemedText>
          </View>
        </View>

        {/* Progress Section */}
        {nextTier && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressTitle}>
                Next Level: {nextTier.name}
              </ThemedText>
              <ThemedText style={styles.progressTarget}>
                {nextTier.requirement - contributionCredits} remaining
              </ThemedText>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: nextTier.color,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Ways to Earn */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setActionsExpanded(!actionsExpanded)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.sectionTitle}>
              Increase Your Impact
            </ThemedText>
            <Ionicons
              name={actionsExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={Colors.light.textSecondary}
            />
          </TouchableOpacity>

          {actionsExpanded &&
            ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionCard,
                  index === ACTIONS.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons
                    name={action.icon as any}
                    size={24}
                    color={Colors.light.primary}
                  />
                </View>
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    {action.title}
                  </ThemedText>
                  <ThemedText style={styles.actionDescription}>
                    {action.description}
                  </ThemedText>
                </View>
                <View style={styles.rewardBadge}>
                  <ThemedText style={styles.rewardText}>
                    {action.reward}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Tier Roadmap */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setTiersExpanded(!tiersExpanded)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.sectionTitle}>
              Intelligence Tiers
            </ThemedText>
            <Ionicons
              name={tiersExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.light.primary}
            />
          </TouchableOpacity>

          {tiersExpanded && (
            <View style={styles.roadmap}>
              {TIERS.map((tier, index) => (
                <View
                  key={index}
                  style={[
                    styles.tierCard,
                    contributionCredits >= tier.requirement
                      ? styles.tierUnlocked
                      : styles.tierLocked,
                  ]}
                >
                  <View
                    style={[
                      styles.tierIndicator,
                      { backgroundColor: tier.color },
                    ]}
                  />
                  <View style={styles.tierInfo}>
                    <ThemedText style={styles.tierTitle} numberOfLines={1}>
                      {tier.name}
                    </ThemedText>
                    <ThemedText
                      style={styles.tierDescription}
                      numberOfLines={2}
                    >
                      {tier.description}
                    </ThemedText>
                    <ThemedText style={styles.tierReq}>
                      {tier.requirement === 0
                        ? "Default"
                        : `${tier.requirement} Cr`}
                    </ThemedText>
                  </View>
                  {contributionCredits >= tier.requirement ? (
                    <View style={styles.tierStatusIcon}>
                      <CapitalLogo tier={tier.level} size={20} />
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color="#10B981"
                        style={styles.checkOverlay}
                      />
                    </View>
                  ) : (
                    <View style={styles.tierStatusIcon}>
                      <CapitalLogo tier={tier.level} size={20} />
                      <Ionicons
                        name="lock-closed"
                        size={12}
                        color="#94A3B8"
                        style={styles.checkOverlay}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  creditInfo: {
    justifyContent: "center",
  },
  creditValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.light.text,
    lineHeight: 28,
  },
  creditLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
    marginBottom: -2,
  },
  currentTierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  tierName: {
    fontWeight: "700",
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  progressTarget: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  actionDescription: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  rewardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
  },
  rewardText: {
    fontSize: 11,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  roadmap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
  tierCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    minHeight: 100,
  },
  tierUnlocked: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  tierLocked: {
    backgroundColor: "#F8FAFC",
    borderColor: "#F1F5F9",
    opacity: 0.8,
  },
  tierIndicator: {
    width: 3,
    height: "80%",
    borderRadius: 2,
    marginRight: 8,
  },
  tierInfo: {
    flex: 1,
  },
  tierTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  tierDescription: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  tierReq: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginTop: 4,
    textTransform: "uppercase",
  },
  tierStatusIcon: {
    position: "relative",
    padding: 4,
  },
  checkOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
  },
});
