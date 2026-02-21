import PoliTickItHeader from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { VerificationTier } from "@/services/interfaces/IVerificationService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function VoterVerificationScreen() {
  const { verificationService, hapticService } = useServices();
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      const s = await verificationService?.getCurrentStatus();
      setStatus(s);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    hapticService?.triggerHeavyImpact();
    setIsVerifying(true);
    try {
      // Trigger the ZK-Residency Verification Handshake
      const result = await verificationService?.verifyIdentity();
      setStatus(result);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const isTier3 = status?.tier === VerificationTier.Tier3_ZKResidency;

  if (isLoading) {
    return (
      <View style={[GlobalStyles.container, styles.center]}>
        <ActivityIndicator color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <PoliTickItHeader title="VOTER VERIFICATION" canGoBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View
            style={[
              styles.statusIconContainer,
              isTier3 ? styles.statusActive : styles.statusInactive,
            ]}
          >
            <Ionicons
              name={(isTier3 ? "checkmark-circle" : "shield-outline") as any}
              size={48}
              color="#FFF"
            />
          </View>
          <ThemedText style={styles.statusTitle}>
            {isTier3 ? "IDENTITY SECURED" : "IDENTITY UNVERIFIED"}
          </ThemedText>
          <ThemedText style={styles.statusSubtitle}>
            {isTier3
              ? "Your ZK-Residency Proof is active. Your Rational Sentiment (RS) signals carry full weight."
              : "Verify your residency to unlock the 'Signal of Truth' badge and increase your impact score."}
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardHeader}>
            ZK-RESIDENCY PROTOCOL
          </ThemedText>
          <View style={styles.benefitRow}>
            <Ionicons
              name="flash-outline"
              size={20}
              color={Colors.light.accent}
            />
            <ThemedText style={styles.benefitText}>
              1.5x Multiplier on Rational Sentiment
            </ThemedText>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons
              name="finger-print-outline"
              size={20}
              color={Colors.light.accent}
            />
            <ThemedText style={styles.benefitText}>
              Zero-Knowledge Privacy Protection
            </ThemedText>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons
              name="infinite-outline"
              size={20}
              color={Colors.light.accent}
            />
            <ThemedText style={styles.benefitText}>
              Permanent Forensic Attestation
            </ThemedText>
          </View>

          {!isTier3 && (
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ThemedText style={styles.verifyButtonText}>
                  INITIALIZE ZK-HANDSHAKE
                </ThemedText>
              )}
            </TouchableOpacity>
          )}
        </View>

        {isTier3 && (
          <View style={styles.provenanceCard}>
            <ThemedText style={styles.provenanceTitle}>
              ATTESTATION DETAILS
            </ThemedText>
            <View style={styles.tokenBox}>
              <ThemedText style={styles.tokenLabel}>
                VERIFICATION HASH
              </ThemedText>
              <ThemedText
                style={styles.tokenValue}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {status.attestationToken}
              </ThemedText>
            </View>
            <ThemedText style={styles.provenanceFooter}>
              Verification powered by Forensic Signal clusters & TargetSmart
              Oracle Integration.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: Spacing.md,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  statusIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  statusActive: {
    backgroundColor: Colors.light.success,
  },
  statusInactive: {
    backgroundColor: Colors.light.textMuted,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
    color: Colors.light.text,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.lg,
    borderRadius: 8,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.light.textTertiary,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  verifyButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  verifyButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  provenanceCard: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
  },
  provenanceTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.textMuted,
    marginBottom: Spacing.sm,
  },
  tokenBox: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: Spacing.sm,
    borderRadius: 4,
  },
  tokenLabel: {
    fontSize: 8,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textSecondary,
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.text,
    marginTop: 2,
  },
  provenanceFooter: {
    fontSize: 9,
    color: Colors.light.textMuted,
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
});
