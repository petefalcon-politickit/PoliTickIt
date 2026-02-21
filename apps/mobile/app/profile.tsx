import { PoliTickItHeader } from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { DashboardBackground } from "@/components/ui/dashboard-background";
import { MultiToggle } from "@/components/ui/multi-toggle";
import { currentUser } from "@/constants/mockData";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { VerificationTier } from "@/services/interfaces/IVerificationService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  const { contributionCredits, dossierStats } = useActivity();
  const { omniFeedProvider, verificationService } = useServices();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dossier");
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyEndReached, setHistoryEndReached] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const checkVerification = async () => {
        const status = await verificationService?.getCurrentStatus();
        setVerificationStatus(status);
      };
      checkVerification();
    }, [verificationService]),
  );

  const loadMoreHistory = useCallback(async () => {
    if (loadingHistory || historyEndReached) return;

    setLoadingHistory(true);
    try {
      const nextBatch = await omniFeedProvider.getParticipationHistory(
        20,
        history.length,
      );
      if (nextBatch.length < 20) {
        setHistoryEndReached(true);
      }
      setHistory((prev) => [...prev, ...nextBatch]);
    } catch (error) {
      console.error("Failed to load more history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, [omniFeedProvider, history.length, loadingHistory, historyEndReached]);

  useEffect(() => {
    // Initial load or refresh on credit change
    setHistory([]);
    setHistoryEndReached(false);
    const initialLoad = async () => {
      setLoadingHistory(true);
      const historyData = await omniFeedProvider.getParticipationHistory(20, 0);
      setHistory(historyData);
      if (historyData.length < 20) setHistoryEndReached(true);
      setLoadingHistory(false);
    };
    initialLoad();
  }, [omniFeedProvider, contributionCredits]);

  // Tier calculation local to Dossier for progress tracking
  const getProgress = (credits: number) => {
    if (credits >= 2500)
      return {
        current: "TIER 4",
        next: "MAX",
        level: 4,
        label: "ELITE",
        percent: 1,
      };
    if (credits >= 1200)
      return {
        current: "TIER 3",
        next: "TIER 4",
        level: 3,
        label: "VETERAN",
        percent: (credits - 1200) / (2500 - 1200),
      };
    if (credits >= 500)
      return {
        current: "TIER 2",
        next: "TIER 3",
        level: 2,
        label: "ACTIVE",
        percent: (credits - 500) / (1200 - 500),
      };
    return {
      current: "TIER 1",
      next: "TIER 2",
      level: 1,
      label: "OBSERVER",
      percent: credits / 500,
    };
  };

  const progress = getProgress(contributionCredits);

  const renderHistoryItem = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.historyItem,
        index === history.length - 1 && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.historyLeft}>
        <View
          style={[
            styles.historyIconCircle,
            {
              backgroundColor:
                item.type === "sentiment" ? "#EFF6FF" : "#F5F3FF",
            },
          ]}
        >
          <Ionicons
            name={item.type === "sentiment" ? "pulse-outline" : "flash-outline"}
            size={12}
            color={item.type === "sentiment" ? "#3B82F6" : "#8B5CF6"}
          />
        </View>
        <View style={styles.historyTextContainer}>
          <ThemedText style={styles.historyTitle}>
            {item.type === "sentiment" ? "Sentiment Pulse" : "Impact Action"}
          </ThemedText>
          <ThemedText style={styles.historyMeta}>
            {new Date(item.timestamp).toLocaleDateString()} •{" "}
            {item.resourceId.split(":")[1] || "Global"}
          </ThemedText>
        </View>
      </View>
      <View style={styles.historyCredits}>
        <ThemedText style={styles.historyCreditValue}>
          +{item.credits}
        </ThemedText>
      </View>
    </View>
  );

  const renderDossierContent = () => {
    const isVerified =
      verificationStatus?.tier === VerificationTier.Tier3_ZKResidency;

    return (
      <View style={styles.dossierContent}>
        {/* 3. Progression Module */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              TIER-UP PROGRESS
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              {Math.round(progress.percent * 100)}% TO {progress.next}
            </ThemedText>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress.percent * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* 4. Functional Vault (Placeholders) */}
        <View style={styles.vaultSection}>
          <ThemedText style={styles.sectionTitle}>VAULT</ThemedText>
          <TouchableOpacity
            style={styles.vaultItem}
            onPress={() => router.push("/settings-voter-verification")}
          >
            <Ionicons
              name={isVerified ? "shield-checkmark" : "shield-outline"}
              size={20}
              color={isVerified ? Colors.light.success : Colors.light.primary}
            />
            <ThemedText
              style={[
                styles.vaultItemText,
                isVerified && {
                  color: Colors.light.success,
                  fontWeight: "700",
                },
              ]}
            >
              {isVerified ? "ZK-RESIDENCY VERIFIED" : "VERIFY RESIDENCY"}
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={Colors.light.textPlaceholder}
            />
          </TouchableOpacity>
          <View style={styles.vaultItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={Colors.light.primary}
            />
            <ThemedText style={styles.vaultItemText}>
              POLIPROOF™ REPORTS (PDF)
            </ThemedText>
            <Ionicons
              name="lock-closed"
              size={14}
              color={Colors.light.textPlaceholder}
            />
          </View>
          <View style={styles.vaultItem}>
            <Ionicons
              name="ribbon-outline"
              size={20}
              color={Colors.light.primary}
            />
            <ThemedText style={styles.vaultItemText}>
              TOPIC MASTERY BADGES
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={Colors.light.textPlaceholder}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Tab Switcher */}
      <View style={styles.tabSwitcherContainer}>
        <MultiToggle
          options={[
            { label: "DOSSIER", value: "dossier" },
            { label: "LEDGER", value: "ledger" },
          ]}
          currentValue={activeTab}
          onChange={setActiveTab}
          style={styles.tabToggle}
        />
      </View>

      {/* 2. Forensic Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>TOTAL CREDITS</ThemedText>
          <ThemedText style={styles.statValue}>
            {contributionCredits}
          </ThemedText>
        </View>
        <View style={[styles.statBox, styles.statBoxBorder]}>
          <ThemedText style={styles.statLabel}>TRUST STREAK</ThemedText>
          <ThemedText style={styles.statValue}>
            {dossierStats.streak} DAYS
          </ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>POLIPROOF™</ThemedText>
          <ThemedText style={styles.statValue}>
            {dossierStats.proofs}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <DashboardBackground>
      <View style={GlobalStyles.screenContainer}>
        <PoliTickItHeader
          hideImpact
          user={{
            name: currentUser.name,
            avatar: currentUser.profileImage,
            level: progress.level,
            tier: `${progress.current} · ${progress.label}`,
          }}
        />
        <FlatList
          contentContainerStyle={styles.container}
          ListHeaderComponent={renderHeader}
          data={activeTab === "dossier" ? [{ id: "dossier" }] : history}
          keyExtractor={(item: any) => item.id || item.type}
          renderItem={({ item, index }) =>
            activeTab === "dossier"
              ? renderDossierContent()
              : renderHistoryItem({ item, index })
          }
          onEndReached={activeTab === "ledger" ? loadMoreHistory : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingHistory ? (
              <ActivityIndicator
                size="small"
                color={Colors.light.primary}
                style={{ marginVertical: Spacing.md }}
              />
            ) : null
          }
        />
      </View>
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    backgroundColor: "rgba(22, 69, 112, 0.03)",
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: Spacing.sm,
    borderRadius: 4,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(22, 69, 112, 0.1)",
  },
  statLabel: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 9,
    fontWeight: "700",
    color: Colors.light.textSecondary,
    letterSpacing: 0.8,
  },
  statValue: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 20,
    fontWeight: Typography.weights.heavy,
    color: Colors.light.primary,
    marginTop: 2,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  sectionTitle: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    color: Colors.light.text,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 9,
    color: Colors.light.primary,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(22, 69, 112, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
  },
  vaultSection: {
    gap: Spacing.sm,
  },
  vaultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    gap: Spacing.md,
    minHeight: 64,
  },
  vaultItemText: {
    flex: 1,
    fontFamily: Typography.fonts?.sans,
    fontWeight: "700",
    fontSize: 14,
    color: Colors.light.text,
    letterSpacing: 0.5,
  },
  headerContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  tabSwitcherContainer: {
    alignItems: "center",
    paddingVertical: 0,
  },
  tabToggle: {
    width: "100%",
    height: 36,
  },
  dossierContent: {
    gap: Spacing.lg,
    marginTop: Spacing.xs,
  },
  activitySection: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  historyList: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.md,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  historyIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  historyTextContainer: {
    gap: 0,
    marginTop: -1,
  },
  historyTitle: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  historyMeta: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 9,
    color: Colors.light.textSecondary, // Improved contrast
    marginTop: -2,
  },
  historyCredits: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  historyCreditValue: {
    fontFamily: Typography.fonts?.mono,
    fontSize: 9,
    fontWeight: "800",
    color: "#16A34A",
  },
});
