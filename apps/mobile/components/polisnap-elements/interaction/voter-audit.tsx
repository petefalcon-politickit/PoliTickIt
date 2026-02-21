import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { VerificationTier } from "@/services/interfaces/IVerificationService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

/**
 * Interaction.VoterAudit (Forensic Molecule)
 * Bridge for ZK-Verified constituent accountability.
 * Allows users to perform high-integrity audits on representatives based on residency.
 */

interface VoterAuditProps {
  data: {
    representativeId: string;
    representativeName: string;
    auditTargetId: string; // e.g. a specific vote or bill
    requiredTier?: VerificationTier;
  };
}

export const VoterAuditMolecule: React.FC<VoterAuditProps> = ({ data }) => {
  const {
    representativeId,
    representativeName,
    auditTargetId,
    requiredTier = VerificationTier.Tier3_ZKResidency,
  } = data || {};
  const {
    verificationService,
    hapticService,
    forensicSignalCoordinator,
    omniFeedProvider,
  } = useServices();

  const [status, setStatus] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const s = await verificationService?.getCurrentStatus();
    setStatus(s);
  };

  const handleVerify = async () => {
    hapticService?.triggerLightImpact();
    setIsVerifying(true);
    try {
      const result = await verificationService?.verifyIdentity();
      setStatus(result);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAudit = async () => {
    if (
      !status?.isVerified ||
      status.tier !== VerificationTier.Tier3_ZKResidency
    )
      return;

    hapticService?.triggerHeavyImpact();
    setIsAuditing(true);

    try {
      // Simulate the Audit Pulse
      await omniFeedProvider?.executeAction("REQUEST_DEEP_AUDIT", {
        snapId: auditTargetId,
      });

      await forensicSignalCoordinator?.emitSignal({
        id: auditTargetId,
        type: "action",
        metadata: {
          action: "constituent_audit",
          representativeId,
          tier: status.tier,
          auditType: "forensic_compliance",
        },
      });

      alert(
        "Constituent Audit Pulse Sent. Verification Hash: " +
          status.attestationToken,
      );
    } finally {
      setIsAuditing(false);
    }
  };

  const isTier3 = status?.tier === VerificationTier.Tier3_ZKResidency;

  return (
    <View style={styles.container}>
      <View style={GlobalStyles.rowBetween}>
        <View style={styles.infoCol}>
          <ThemedText style={styles.title}>VOTER AUDIT GATE</ThemedText>
          <ThemedText style={styles.subtitle}>
            Target: {representativeName || "Representative"}
          </ThemedText>
        </View>
        <View
          style={[
            styles.badge,
            isTier3 ? styles.badgeActive : styles.badgeInactive,
          ]}
        >
          <Ionicons
            name={isTier3 ? "shield-checkmark" : "shield"}
            size={12}
            color="#FFF"
          />
          <ThemedText style={styles.badgeText}>
            {isTier3 ? "VERIFIED" : "UNVERIFIED"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.bridgeContent}>
        {!isTier3 ? (
          <View style={styles.lockedState}>
            <ThemedText style={styles.lockedText}>
              Audit actions require Tier 3 ZK-Residency Verification.
            </ThemedText>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons
                    name="finger-print"
                    size={16}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <ThemedText style={styles.verifyButtonText}>
                    INITIALIZE HANDSHAKE
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.unlockedState}>
            <ThemedText style={styles.unlockedText}>
              Identified as a constituent of {representativeName}. Your audit
              will have 5x weight.
            </ThemedText>
            <TouchableOpacity
              style={styles.auditButton}
              onPress={handleAudit}
              disabled={isAuditing}
            >
              {isAuditing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons
                    name="git-compare"
                    size={18}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <ThemedText style={styles.auditButtonText}>
                    COMMENCE CONSTITUENT AUDIT
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.provenance}>
        <ThemedText style={styles.provenanceText}>
          ZK-PROOF HANDSHAKE: TARGETSMART ORACLE
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.light.textTertiary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  badgeActive: {
    backgroundColor: Colors.light.success,
  },
  badgeInactive: {
    backgroundColor: Colors.light.textMuted,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#FFF",
  },
  bridgeContent: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  lockedState: {
    alignItems: "center",
  },
  lockedText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  verifyButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: "100%",
  },
  verifyButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  unlockedState: {
    alignItems: "center",
  },
  unlockedText: {
    fontSize: 13,
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  auditButton: {
    backgroundColor: Colors.light.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: "100%",
  },
  auditButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  provenance: {
    marginTop: Spacing.sm,
    alignItems: "flex-end",
  },
  provenanceText: {
    fontSize: 8,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textMuted,
  },
});

// Register with ComponentFactory
ComponentFactory.register("Interaction.VoterAudit", (config) => (
  <VoterAuditMolecule data={config.value} />
));
