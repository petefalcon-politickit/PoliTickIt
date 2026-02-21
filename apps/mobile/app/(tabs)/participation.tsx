import PoliTickItHeader from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { CapitalLogo } from "@/components/ui/capital-logo";
import { Colors, GlobalStyles, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function ParticipationCapitalScreen() {
  const { forensicSignalCoordinator } = useServices();
  const { contributionCredits } = useActivity();
  const [status, setStatus] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipationData = async () => {
      try {
        const metrics = await forensicSignalCoordinator.getImpactMetrics();
        // Map coordinator metrics to legacy structure
        setStatus({
          credits: metrics.credits,
          tierLevel: metrics.tierLevel,
          tierName: metrics.tierName,
          nextTierCredits: 0, // Simplified for now
        });

        // Use placeholder actions for now
        setActions([
          {
            id: "1",
            title: "Verify District Signal",
            reward: 50,
            icon: "shield-checkmark",
          },
          {
            id: "2",
            title: "Audit FEC Correlation",
            reward: 100,
            icon: "analytics",
          },
        ]);

        setTiers([
          { level: 1, name: "Observation", requirement: 0, color: "#3182CE" },
          { level: 2, name: "Engagement", requirement: 1000, color: "#38A169" },
          { level: 3, name: "Influence", requirement: 5000, color: "#D69E2E" },
          { level: 4, name: "Sovereign", requirement: 20000, color: "#805AD5" },
        ]);
      } catch (error) {
        console.error("Failed to load participation data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadParticipationData();
  }, [forensicSignalCoordinator, contributionCredits]);

  const currentTier =
    [...tiers].reverse().find((t) => contributionCredits >= t.requirement) ||
    tiers[0];
  const nextTier = tiers.find((t) => t.requirement > contributionCredits);

  if (loading || !currentTier) {
    return (
      <View
        style={[GlobalStyles.screenContainer, { justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  const progress = nextTier
    ? (contributionCredits - currentTier.requirement) /
      (nextTier.requirement - currentTier.requirement)
    : 1;

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader
        title="Participation Capital"
        hideImpact={true}
        hideSearch={true}
      />

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
            <ThemedText style={styles.tierLevelSmall}>
              Tier {currentTier?.level}
            </ThemedText>
            <ThemedText
              style={[
                styles.tierNameLarge,
                { color: currentTier?.color || Colors.light.primary },
              ]}
            >
              {currentTier?.name}
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
                {(nextTier?.requirement || 0) - contributionCredits} remaining
              </ThemedText>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: nextTier?.color || Colors.light.primary,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Ways to Earn */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Increase Your Impact
            </ThemedText>
          </View>

          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.benefitRow,
                index === actions.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.benefitIcon}>
                <Ionicons
                  name={action.icon as any}
                  size={20}
                  color={Colors.light.primary}
                />
              </View>
              <View style={styles.benefitTextContent}>
                <ThemedText style={styles.benefitName}>
                  {action.title}
                </ThemedText>
                <ThemedText style={styles.benefitDesc}>
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
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Intelligence Tiers
            </ThemedText>
          </View>

          <View style={styles.roadmap}>
            {tiers.map((tier, index) => (
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
                  <ThemedText style={styles.tierDescription} numberOfLines={2}>
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
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 32,
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
    lineHeight: 32,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "flex-start",
  },
  tierLevelSmall: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  tierNameLarge: {
    fontWeight: "900",
    fontSize: 18,
    lineHeight: 20,
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
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  benefitTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  benefitName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
    lineHeight: 32, // Matches icon height for perfect top sync on first line
  },
  benefitDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: -4,
    lineHeight: 18,
  },
  rewardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    // Removed marginTop: 2
  },
  rewardText: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.light.primary,
    lineHeight: 24, // Matches badge internal centering well
  },
  roadmap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 0,
  },
  tierCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    minHeight: 110,
  },
  tierUnlocked: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tierLocked: {
    backgroundColor: "#F1F5F9", // Clinical Institutional Gray
    borderColor: "#CBD5E0", // Darker border for visibility (Slate 300)
    opacity: 0.9,
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
    color: "#64748B", // Slate 500 for better contrast on F1F5F9 background
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
