import { CapitalLogo } from "@/components/ui/capital-logo";
import { PARTICIPATION_TIERS } from "@/constants/participation";
import { Colors } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../themed-text";

interface ParticipationStatusModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ParticipationStatusModal: React.FC<
  ParticipationStatusModalProps
> = ({ isVisible, onClose }) => {
  const { contributionCredits } = useActivity();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const overlayColor = useThemeColor({}, "overlay");
  const primaryColor = useThemeColor({}, "primary");
  const secondaryTextColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const surfaceColor = useThemeColor({}, "backgroundSecondary");

  const currentLevel =
    [...PARTICIPATION_TIERS]
      .reverse()
      .find((t) => contributionCredits >= t.requirement) ||
    PARTICIPATION_TIERS[0];
  const nextLevel = PARTICIPATION_TIERS.find(
    (t) => t.requirement > contributionCredits,
  );

  const handleGoToDashboard = () => {
    onClose();
    router.push("/participation");
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={secondaryTextColor} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Branding */}
            <View style={styles.header}>
              <View
                style={[
                  styles.logoContainer,
                  { backgroundColor: primaryColor + "10" },
                ]}
              >
                <CapitalLogo credits={contributionCredits} size={48} />
              </View>
              <ThemedText style={styles.brandTitle}>
                Participation Capital
              </ThemedText>
              <ThemedText style={styles.brandSubtitle}>
                Intelligence Earned, Not Bought.
              </ThemedText>
            </View>

            {/* Current Status */}
            <View
              style={[
                styles.statusBox,
                { backgroundColor: surfaceColor, borderColor },
              ]}
            >
              <View style={styles.statusRow}>
                <View>
                  <Text
                    style={[styles.statusLabel, { color: secondaryTextColor }]}
                  >
                    CURRENT BALANCE
                  </Text>
                  <Text style={[styles.statusValue, { color: primaryColor }]}>
                    {contributionCredits} Credits
                  </Text>
                </View>
                <View
                  style={[styles.tierBadge, { backgroundColor: primaryColor }]}
                >
                  <Text style={styles.tierBadgeText}>{currentLevel.name}</Text>
                </View>
              </View>

              {nextLevel && (
                <View style={styles.progressArea}>
                  <View style={styles.progressInfo}>
                    <Text
                      style={[
                        styles.progressText,
                        { color: secondaryTextColor },
                      ]}
                    >
                      Next: {nextLevel.name}
                    </Text>
                    <Text
                      style={[
                        styles.progressText,
                        { color: secondaryTextColor },
                      ]}
                    >
                      {nextLevel.requirement - contributionCredits} Cr left
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: primaryColor,
                          width: `${Math.min((contributionCredits / nextLevel.requirement) * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Benefit List */}
            <View style={styles.benefitsContainer}>
              <Text style={[styles.sectionTitle, { color: primaryColor }]}>
                THE INTELLIGENCE ROADMAP
              </Text>
              {PARTICIPATION_TIERS.map((tier) => (
                <View
                  key={tier.level}
                  style={[
                    styles.benefitRow,
                    contributionCredits < tier.requirement &&
                      styles.lockedBenefit,
                  ]}
                >
                  <View style={styles.benefitIcon}>
                    <Ionicons
                      name={tier.icon as any}
                      size={20}
                      color={
                        contributionCredits >= tier.requirement
                          ? primaryColor
                          : secondaryTextColor
                      }
                    />
                  </View>
                  <View style={styles.benefitTextContent}>
                    <Text
                      style={[
                        styles.benefitName,
                        {
                          color:
                            contributionCredits >= tier.requirement
                              ? primaryColor
                              : secondaryTextColor,
                        },
                        contributionCredits >= tier.requirement &&
                          styles.activeBenefitText,
                      ]}
                    >
                      {tier.name}
                    </Text>
                    <Text
                      style={[
                        styles.benefitDesc,
                        { color: secondaryTextColor },
                      ]}
                    >
                      {tier.benefit}
                    </Text>
                  </View>
                  {contributionCredits < tier.requirement ? (
                    <Ionicons
                      name="lock-closed"
                      size={14}
                      color={secondaryTextColor}
                    />
                  ) : (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={Colors.light.success}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Feature Teasers */}
            <View style={styles.teasersContainer}>
              <View
                style={[
                  styles.teaserCard,
                  { backgroundColor: surfaceColor, borderColor },
                ]}
              >
                <Ionicons name="bar-chart" size={18} color={primaryColor} />
                <Text
                  style={[styles.teaserText, { color: secondaryTextColor }]}
                >
                  Accountability ROI scorecards verify rep effectiveness.
                </Text>
              </View>
              <View
                style={[
                  styles.teaserCard,
                  { backgroundColor: surfaceColor, borderColor },
                ]}
              >
                <Ionicons name="bulb" size={18} color={primaryColor} />
                <Text
                  style={[styles.teaserText, { color: secondaryTextColor }]}
                >
                  AI Insights simplify complex legislative jargon.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: primaryColor }]}
              onPress={handleGoToDashboard}
            >
              <Text style={styles.primaryButtonText}>
                VIEW IMPACT DASHBOARD
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFF"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "100%",
    maxHeight: "85%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
    padding: 8,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.text,
  },
  brandSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  statusBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.textSecondary,
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.light.text,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tierBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  progressArea: {
    marginTop: 16,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.light.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  lockedBenefit: {
    opacity: 0.6,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  benefitTextContent: {
    flex: 1,
  },
  benefitName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.textSecondary,
  },
  activeBenefitText: {
    color: Colors.light.text,
  },
  benefitDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  teasersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  teaserCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  teaserText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.light.text,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
