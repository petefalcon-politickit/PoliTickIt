// ─────────────────────────────────────────────────────────────────────────────
// FILE        : insight-dashboard-view.tsx
// PROJECT     : PoliTickIt.Mobile
// LAYER       : Components → Feature
// PURPOSE     : Tier-gated Insight Dashboard rendered within the Watchlist
//               screen. Computes category breakdowns and rep counts from the
//               user's watched snaps. Tier 1 shows a gate screen; Tier 2+
//               unlocks summary analytics; Tier 3+ teases deeper analysis.
// ─────────────────────────────────────────────────────────────────────────────

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// ── Tier access thresholds (mirrors analysis doc) ────────────────────────────
const TIER_LABELS: Record<number, string> = {
  1: "Observation",
  2: "Engagement",
  3: "Influence",
  4: "Sovereign",
};

interface CategoryStat {
  id: string;
  label: string;
  count: number;
}

interface InsightDashboardViewProps {
  watchedSnaps: PoliSnap[];
  onBoostPress: () => void;
}

// ── Helper: derive category stats from snaps ──────────────────────────────────
function computeCategoryStats(snaps: PoliSnap[]): CategoryStat[] {
  const counts: Record<string, number> = {};
  for (const snap of snaps) {
    const area = snap.metadata?.policyArea ?? "Uncategorized";
    counts[area] = (counts[area] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([id, count]) => ({ id, label: toDisplayLabel(id), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function computeRepStats(snaps: PoliSnap[]): number {
  const ids = new Set<string>();
  for (const snap of snaps) {
    if (snap.metadata?.representativeId)
      ids.add(snap.metadata.representativeId);
  }
  return ids.size;
}

function toDisplayLabel(slug: string): string {
  if (!slug || slug === "Uncategorized") return "Uncategorized";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={22} color={Colors.light.primary} />
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

function CategoryBar({ stat, max }: { stat: CategoryStat; max: number }) {
  const fill = max > 0 ? stat.count / max : 0;
  return (
    <View style={styles.categoryRow}>
      <ThemedText style={styles.categoryLabel} numberOfLines={1}>
        {stat.label}
      </ThemedText>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { flex: fill }]} />
        <View style={{ flex: 1 - fill }} />
      </View>
      <ThemedText style={styles.categoryCount}>{stat.count}</ThemedText>
    </View>
  );
}

function TierGateScreen({ onBoostPress }: { onBoostPress: () => void }) {
  return (
    <View style={styles.gateContainer}>
      <View style={styles.gateIconContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={52}
          color={Colors.light.textMuted}
        />
      </View>
      <ThemedText style={styles.gateTitle}>Intelligence Locked</ThemedText>
      <ThemedText style={styles.gateSubtext}>
        Insight Dashboards require{"\n"}
        <ThemedText style={styles.gateTierLabel}>Engagement tier</ThemedText>
        {" (1,000 Community Capital).\n"}
        Participate in audits or share insights to unlock deep-tier legislative
        analytics.
      </ThemedText>
      <TouchableOpacity style={styles.boostButton} onPress={onBoostPress}>
        <Ionicons name="flash-outline" size={18} color="#FFF" />
        <ThemedText style={styles.boostButtonText}>
          Boost Participation Capital
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function InsightDashboardView({
  watchedSnaps,
  onBoostPress,
}: InsightDashboardViewProps) {
  const { forensicSignalCoordinator } = useServices();
  const [tierLevel, setTierLevel] = useState<number | null>(null);
  const [tierName, setTierName] = useState<string>("");

  const loadTier = useCallback(async () => {
    try {
      const metrics = await forensicSignalCoordinator.getImpactMetrics();
      setTierLevel(metrics.tierLevel);
      setTierName(metrics.tierName ?? TIER_LABELS[metrics.tierLevel] ?? "");

      if (metrics.tierLevel < 2) {
        forensicSignalCoordinator
          .emitSignal({
            type: "action",
            id: "screen",
            metadata: {
              actionType: "feature_gate_hit",
              feature: "insight_dashboard",
              tierLevel: metrics.tierLevel,
              required: 2,
            },
          })
          .catch(() => {});
      } else {
        forensicSignalCoordinator
          .emitSignal({
            type: "action",
            id: "screen",
            metadata: {
              actionType: "insight_dashboard_view",
              tierLevel: metrics.tierLevel,
            },
          })
          .catch(() => {});
      }
    } catch {
      // Default to tier 1 on error so gate screen shows rather than crashing
      setTierLevel(1);
    }
  }, [forensicSignalCoordinator]);

  useEffect(() => {
    loadTier();
  }, [loadTier]);

  if (tierLevel === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
      </View>
    );
  }

  // ── Tier 1: Gate screen ───────────────────────────────────────────────────
  if (tierLevel < 2) {
    return <TierGateScreen onBoostPress={onBoostPress} />;
  }

  // ── Tier 2+: Analytics ────────────────────────────────────────────────────
  const categoryStats = computeCategoryStats(watchedSnaps);
  const repCount = computeRepStats(watchedSnaps);
  const topCategoryMax = categoryStats[0]?.count ?? 1;

  return (
    <ScrollView
      contentContainerStyle={styles.analyticsContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Tier badge */}
      <View style={styles.tierBadge}>
        <Ionicons
          name="shield-checkmark-outline"
          size={14}
          color={Colors.light.primary}
        />
        <ThemedText style={styles.tierBadgeText}>{tierName} Access</ThemedText>
      </View>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <StatCard
          icon="bookmark-outline"
          value={watchedSnaps.length}
          label="Tracked"
        />
        <StatCard icon="people-outline" value={repCount} label="Reps" />
        <StatCard
          icon="layers-outline"
          value={categoryStats.length}
          label="Categories"
        />
      </View>

      {watchedSnaps.length === 0 ? (
        <View style={styles.emptyAnalytics}>
          <Ionicons
            name="analytics-outline"
            size={36}
            color={Colors.light.textMuted}
          />
          <ThemedText style={styles.emptyAnalyticsText}>
            Bookmark snaps to start building intelligence
          </ThemedText>
        </View>
      ) : (
        <>
          {/* Category breakdown */}
          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>
              Policy Area Breakdown
            </ThemedText>
            {categoryStats.map((stat) => (
              <CategoryBar key={stat.id} stat={stat} max={topCategoryMax} />
            ))}
          </View>

          {/* Tier 3+ teaser */}
          {tierLevel >= 3 ? (
            <View style={styles.sectionCard}>
              <ThemedText style={styles.sectionTitle}>
                Sentiment Trend Analysis
              </ThemedText>
              <ThemedText style={styles.comingSoonText}>
                Deep-tier trend analysis will appear here as you track more
                legislative activity.
              </ThemedText>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.teaseCard}
              onPress={onBoostPress}
              activeOpacity={0.8}
            >
              <View style={styles.teaseRow}>
                <Ionicons
                  name="trending-up-outline"
                  size={20}
                  color={Colors.light.primary}
                />
                <ThemedText style={styles.teaseTitle}>
                  Sentiment Trend Analysis
                </ThemedText>
                <View style={styles.teaseLockBadge}>
                  <Ionicons name="lock-closed" size={11} color="#FFF" />
                  <ThemedText style={styles.teaseLockText}>
                    Influence
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.teaseSubtext}>
                Reach Influence tier (5,000 Capital) to unlock sentiment
                distribution charts across your tracked issues.
              </ThemedText>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },

  // Gate screen
  gateContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  gateIconContainer: {
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },
  gateTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  gateSubtext: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  gateTierLabel: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.semibold,
  },
  boostButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  boostButtonText: {
    color: "#FFF",
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.base,
  },

  // Analytics
  analyticsContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing["2xl"],
    gap: Spacing.lg,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(99,102,241,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tierBadgeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.primary,
    fontWeight: Typography.weights.semibold,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.textSecondary,
  },
  sectionCard: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 28,
  },
  categoryLabel: {
    width: 110,
    fontSize: Typography.sizes.xs,
    color: Colors.light.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
    flexDirection: "row",
    overflow: "hidden",
  },
  barFill: {
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  categoryCount: {
    width: 24,
    fontSize: Typography.sizes.xs,
    color: Colors.light.textSecondary,
    textAlign: "right",
  },
  emptyAnalytics: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
    opacity: 0.6,
  },
  emptyAnalyticsText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },

  // Tier 3+ tease card
  teaseCard: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.sm,
    opacity: 0.7,
  },
  teaseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teaseTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  teaseLockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.textMuted,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  teaseLockText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: Typography.weights.bold,
  },
  teaseSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  comingSoonText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
