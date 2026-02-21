import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { FeatureGate } from "../../ui/feature-gate";

/**
 * Audit.Financial (Polymorphic Molecule)
 * Consolidated intelligence for campaign finance, institutional influence, and donor forensics.
 * Modes: Aggregate, Transaction, CorruptionIndex
 */

interface AuditFinancialProps {
  data: {
    mode: "Aggregate" | "Transaction" | "Audit";
    title?: string;

    // Common / Aggregate Data
    totalAmount?: number;
    cycle?: string;
    pacs?: Array<{ name: string; amount: number }>;
    sectors?: Array<{ name: string; percent: number }>;
    topDonors?: Array<{ name: string; amount: number; type?: string }>;
    corporateTrace?: string;

    // Transaction / Audit Data
    donor?: string;
    industry?: string;
    amount?: string | number;
    date?: string;
    transactionId?: string;
    status?: string;
    voteAction?: string;
    insight?: string;
    score?: number; // For Corruption Index
    confidence?: number;
    sources?: string[];
    auditId?: string;
    drillDownSnapId?: string;
  };
}

export const AuditFinancialMolecule: React.FC<AuditFinancialProps> = ({
  data,
}) => {
  const router = useRouter();
  const {
    mode,
    title,
    totalAmount,
    cycle,
    pacs,
    sectors,
    topDonors,
    corporateTrace,
    donor,
    industry,
    amount,
    date,
    transactionId,
    status,
    voteAction,
    insight,
    score,
    confidence,
    sources,
    auditId,
    drillDownSnapId,
  } = data || {};

  const handleDrillDown = () => {
    const targetId = auditId || drillDownSnapId;
    if (targetId) {
      router.push({
        pathname: "/snap-viewer",
        params: { id: targetId },
      });
    }
  };

  const renderAggregate = () => (
    <FeatureGate
      level={2}
      featureTitle="Institutional Forensic Data"
      featureDescription="Trace the donor origin points and PAC distribution of this official."
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons
              name="stats-chart"
              size={14}
              color={Colors.light.intelligence}
            />
            <ThemedText style={styles.headerLabel}>
              INSTITUTIONAL AUDIT
            </ThemedText>
          </View>
          <ThemedText style={styles.cycleLabel}>
            {cycle || "2024 CYCLE"}
          </ThemedText>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <ThemedText style={styles.metricLabel}>TOTAL RAISED</ThemedText>
            <ThemedText style={styles.metricValue}>
              ${totalAmount ? (totalAmount / 1000000).toFixed(2) : "0.00"}M
            </ThemedText>
          </View>
        </View>

        {sectors && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              SECTOR DISTRIBUTION
            </ThemedText>
            {sectors.map((sector, index) => (
              <View key={index} style={styles.sectorRow}>
                <View style={styles.sectorInfo}>
                  <ThemedText style={styles.sectorName}>
                    {sector.name}
                  </ThemedText>
                  <ThemedText style={styles.sectorPercent}>
                    {sector.percent}%
                  </ThemedText>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[styles.barFill, { width: `${sector.percent}%` }]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {topDonors && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              TOP INSTITUTIONAL ENTITIES
            </ThemedText>
            {topDonors.map((d, index) => (
              <View key={index} style={styles.entityRow}>
                <View style={styles.entityInfo}>
                  <ThemedText style={styles.entityName} numberOfLines={1}>
                    {d.name}
                  </ThemedText>
                  <ThemedText style={styles.entityType}>
                    {d.type || "PAC"}
                  </ThemedText>
                </View>
                <ThemedText style={styles.entityAmount}>
                  ${d.amount?.toLocaleString()}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {corporateTrace && (
          <View style={styles.traceContainer}>
            <ThemedText
              style={[styles.sectionTitle, { color: Colors.light.accent }]}
            >
              CORPORATION TRACEABILITY
            </ThemedText>
            <ThemedText style={styles.traceText}>{corporateTrace}</ThemedText>
          </View>
        )}
      </View>
    </FeatureGate>
  );

  const renderTransaction = () => (
    <View style={styles.forensicContainer}>
      <View style={styles.forensicHeader}>
        <View style={styles.donorRow}>
          <View style={styles.donorIcon}>
            <Ionicons
              name="finger-print"
              size={24}
              color={Colors.light.primary}
            />
          </View>
          <View>
            <ThemedText style={styles.donorName}>{donor}</ThemedText>
            <ThemedText style={styles.transactionId}>
              TX-ID: {transactionId}
            </ThemedText>
          </View>
        </View>
        <View style={styles.amountBadge}>
          <ThemedText style={styles.amountLabelSmall}>AMOUNT</ThemedText>
          <ThemedText style={styles.amountValueLarge}>
            {typeof amount === "number"
              ? `$${amount.toLocaleString()}`
              : amount}
          </ThemedText>
        </View>
      </View>

      <View style={styles.forensicGrid}>
        <View style={styles.gridItem}>
          <ThemedText style={styles.gridLabel}>TIMESTAMP</ThemedText>
          <ThemedText style={styles.gridValue}>{date}</ThemedText>
        </View>
        <View style={styles.gridItem}>
          <ThemedText style={styles.gridLabel}>LEDGER STATUS</ThemedText>
          <View style={styles.statusRow}>
            <View style={styles.statusPulse} />
            <ThemedText style={styles.statusText}>
              {status || "Hardened"}
            </ThemedText>
          </View>
        </View>
      </View>

      {handleDrillDownFooter()}
    </View>
  );

  const renderAudit = () => {
    const scoreColor =
      score && score >= 75
        ? Colors.light.error
        : score && score >= 50
          ? Colors.light.warning
          : Colors.light.success;

    return (
      <View style={GlobalStyles.corruptionIndexContainer}>
        {title && (
          <SeveredTitle
            title={title}
            style={GlobalStyles.metricCardTitleLeft}
            textAlign="left"
          />
        )}
        <View style={styles.auditContent}>
          <View style={styles.scoreRow}>
            <View style={styles.badgeCol}>
              <View
                style={[styles.scoreBadge, { backgroundColor: scoreColor }]}
              >
                <ThemedText style={styles.scoreValue}>{score}</ThemedText>
                <ThemedText style={styles.scoreLabel}>INDEX</ThemedText>
              </View>
              {confidence && (
                <View style={styles.badgeConfidence}>
                  <ThemedText
                    style={GlobalStyles.corruptionIndexConfidenceValue}
                  >
                    {(confidence * 100).toFixed(0)}%
                  </ThemedText>
                  <ThemedText
                    style={GlobalStyles.corruptionIndexConfidenceLabel}
                  >
                    CONFIDENCE
                  </ThemedText>
                </View>
              )}
            </View>
            <View style={styles.metaCol}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="business"
                  size={18}
                  color={Colors.light.textTertiary}
                />
                <View>
                  <ThemedText style={GlobalStyles.corruptionIndexMetaText}>
                    {donor}
                  </ThemedText>
                  <ThemedText style={GlobalStyles.corruptionIndexIndustryText}>
                    {industry}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.metaItem}>
                <Ionicons
                  name="cash"
                  size={18}
                  color={Colors.light.textTertiary}
                />
                <ThemedText style={GlobalStyles.corruptionIndexMetaText}>
                  {amount} Contribution
                </ThemedText>
              </View>
            </View>
          </View>

          {insight && (
            <View style={styles.insightBox}>
              <ThemedText style={GlobalStyles.corruptionIndexInsightTitle}>
                ANALYST INSIGHT
              </ThemedText>
              <ThemedText style={GlobalStyles.corruptionIndexInsightText}>
                {insight}
              </ThemedText>
            </View>
          )}

          {handleDrillDownFooter()}
        </View>
      </View>
    );
  };

  const handleDrillDownFooter = () => {
    if (!auditId && !drillDownSnapId)
      return (
        <View style={styles.terminalContainer}>
          <ThemedText style={styles.terminalText}>
            END OF THREAD: AUDIT COMPLETE
          </ThemedText>
        </View>
      );

    return (
      <TouchableOpacity
        style={GlobalStyles.continuumFooter}
        activeOpacity={0.7}
        onPress={handleDrillDown}
      >
        <View style={styles.drillDownContent}>
          <ThemedText style={GlobalStyles.continuumLabel}>
            TRUST THREAD™
          </ThemedText>
          <ThemedText style={GlobalStyles.continuumSubtext}>
            Verify floor vote records & legislative receipt
          </ThemedText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={14}
          color={Colors.light.primary}
        />
      </TouchableOpacity>
    );
  };

  switch (mode) {
    case "Aggregate":
      return renderAggregate();
    case "Transaction":
      return renderTransaction();
    case "Audit":
      return renderAudit();
    default:
      return renderAggregate();
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.intelligence,
    letterSpacing: 1,
  },
  cycleLabel: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.text,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sectorRow: {
    marginBottom: 8,
  },
  sectorInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectorName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.text,
  },
  sectorPercent: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light.textMuted,
  },
  barTrack: {
    height: 4,
    backgroundColor: Colors.light.separator,
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: Colors.light.intelligence,
  },
  entityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  entityInfo: {
    flex: 1,
  },
  entityName: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.text,
  },
  entityType: {
    fontSize: 10,
    color: Colors.light.textTertiary,
  },
  entityAmount: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.light.text,
  },
  traceContainer: {
    padding: 8,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.accent,
  },
  traceText: {
    fontSize: 11,
    color: Colors.light.textSlate,
    lineHeight: 16,
  },
  forensicContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  forensicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  donorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  donorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  donorName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.light.text,
  },
  transactionId: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  amountBadge: {
    alignItems: "flex-end",
  },
  amountLabelSmall: {
    fontSize: 8,
    fontWeight: "800",
    color: Colors.light.textMuted,
  },
  amountValueLarge: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.light.primary,
  },
  forensicGrid: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: Colors.light.textMuted,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.text,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.success,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
  },
  auditContent: {
    marginTop: Spacing.xs,
  },
  scoreRow: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  badgeCol: {
    alignItems: "center",
    marginRight: Spacing.md,
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.light.background,
  },
  scoreLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: Colors.light.background,
    opacity: 0.8,
  },
  metaCol: {
    flex: 1,
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeConfidence: {
    alignItems: "center",
    marginTop: 4,
  },
  insightBox: {
    marginTop: Spacing.sm,
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.primary,
  },
  terminalContainer: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.light.separator,
  },
  terminalText: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.light.textTertiary,
    letterSpacing: 2,
  },
  drillDownContent: {
    flex: 1,
  },
});

// Register with ComponentFactory
ComponentFactory.register("Audit.Financial", (config) => (
  <AuditFinancialMolecule data={config.value} />
));

// Backwards compatibility for the migration phase
ComponentFactory.register("Metric.CorruptionIndex", (config) => (
  <AuditFinancialMolecule data={{ ...config.value, mode: "Audit" }} />
));

ComponentFactory.register("Metric.FEC.Details", (config) => (
  <AuditFinancialMolecule data={{ ...config.value, mode: "Transaction" }} />
));

ComponentFactory.register("Metric.FEC.ContributionAnalysis", (config) => (
  <AuditFinancialMolecule data={{ ...config.value, mode: "Aggregate" }} />
));
