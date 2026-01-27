import { PoliTickItHeader } from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { InsightUnlockGate } from "@/components/ui/insight-unlock-gate";
import { RepresentativeSelectionBottomSheet } from "@/components/ui/representative-selection-bottom-sheet";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { PoliSnap } from "@/types/polisnap";
import { Representative } from "@/types/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const TABS = [
  "Activity",
  "Audit",
  "Productivity",
  "Community",
  "Voting",
  "Events",
  "Committee",
  "Biography",
];

export default function RepresentativeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { poliSnapRepository } = useServices();
  const {
    lastViewedRepresentativeId,
    setLastViewedRepresentativeId,
    contributionCredits,
  } = useActivity();

  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [representative, setRepresentative] = useState<Representative | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Activity");
  const [filterVisible, setFilterVisible] = useState(false);
  const [repSearchVisible, setRepSearchVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Identify the target representative ID
      // If we have one in params, use it. Otherwise, look for fallback.
      let targetId = id || lastViewedRepresentativeId;

      if (!targetId) {
        const allReps = await poliSnapRepository.getAllRepresentatives();
        const followedRep = allReps.find((r: any) => r.isFollowing);
        targetId = followedRep ? followedRep.id : allReps[0]?.id;
      }

      // 2. If we already have the data for this target, don't re-fetch
      if (targetId && representative?.id === targetId) return;

      if (!targetId) {
        setLoading(false);
        return;
      }

      // 3. Fetch Case: targetId is known
      setLoading(true);

      // If we are switching, clear old data to avoid visual jumps
      if (representative && representative.id !== targetId) {
        setRepresentative(null);
        setSnaps([]);
      }

      try {
        const [repData, snapData] = await Promise.all([
          poliSnapRepository.getRepresentativeById(targetId),
          poliSnapRepository.getSnapsByCategory("representative"),
        ]);

        setRepresentative(repData);
        setLastViewedRepresentativeId(targetId);

        // Filter snaps for this specific rep
        setSnaps(
          snapData.filter((s: any) => {
            const repElement = s.elements.find(
              (e: any) =>
                e.type === "Header.Representative" ||
                e.type === "Identity.Rep.Brief",
            );
            const repId = repElement?.data?.id || s.metadata?.representativeId;
            return (
              String(repId).toLowerCase() === String(targetId).toLowerCase()
            );
          }),
        );
      } catch (error) {
        console.error("Failed to fetch representative data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, poliSnapRepository]);

  const renderTabs = () => {
    if (!representative) return null;

    return (
      <View style={styles.tabWrapper}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </ThemedText>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    if (!representative) return null;

    if (activeTab === "Biography") {
      return (
        <View style={styles.bioContainer}>
          <ThemedText style={styles.sectionTitle}>Biography</ThemedText>
          <ThemedText style={styles.bioText}>
            {representative?.biography ||
              "No biography available. This representative serves their constituents with a focus on regional economic development and legislative oversight."}
          </ThemedText>

          {representative?.contact && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => {
                // Future implementation: Linking.openURL(representative.contact)
              }}
            >
              <ThemedText style={styles.contactButtonText}>
                Official Website & Contact
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (activeTab === "Committee") {
      return (
        <View style={styles.committeeContainer}>
          <ThemedText style={styles.sectionTitle}>
            Committee Assignments
          </ThemedText>
          {representative?.committees?.map((c, i) => (
            <View key={i} style={styles.committeeItem}>
              <ThemedText style={styles.committeeText}>{c}</ThemedText>
            </View>
          )) || (
            <ThemedText style={styles.emptyText}>
              No specifically assigned committees found in current session.
            </ThemedText>
          )}
        </View>
      );
    }

    if (activeTab === "Events") {
      return (
        <View style={styles.eventsContainer}>
          <ThemedText style={styles.sectionTitle}>
            Upcoming & Recent Events
          </ThemedText>
          {representative?.recentEvents?.map((event, i) => (
            <View key={i} style={styles.eventCard}>
              <View style={styles.eventDateBadge}>
                <ThemedText style={styles.eventDateText}>
                  {event.date.split("-")[1]}/{event.date.split("-")[2]}
                </ThemedText>
              </View>
              <View style={styles.eventInfo}>
                <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                <ThemedText style={styles.eventDescription}>
                  {event.description}
                </ThemedText>
              </View>
            </View>
          )) || (
            <ThemedText style={styles.emptyText}>
              No upcoming events scheduled at this time.
            </ThemedText>
          )}
        </View>
      );
    }

    // Voting, Community, Activity all use Snap Collection with specific filters
    // Specialized Audit snaps (Scorecards and Financial Correlations) are restricted to the "Audit" tab
    const isAuditRelated = (s: PoliSnap) =>
      s.metadata?.insightType === "ROI Audit" ||
      s.metadata?.insightType === "Financial Correlation" ||
      s.metadata?.insightType === "Financial Intelligence" ||
      s.elements.some((e) =>
        String(e.type).includes("Accountability.Scorecard"),
      );

    const getTierForSnap = (s: PoliSnap): number => {
      if (
        s.metadata?.insightType === "Financial Correlation" ||
        s.metadata?.insightType === "Financial Intelligence"
      )
        return 1;
      if (
        s.metadata?.insightType === "ROI Audit" ||
        s.elements.some((e) =>
          String(e.type).includes("Accountability.Scorecard"),
        )
      )
        return 2;
      return 0;
    };

    const TIER_REQUIREMENTS: Record<number, number> = {
      1: 500,
      2: 1200,
      3: 2500,
    };

    let filteredSnaps = snaps;
    let lockedTiers: number[] = [];

    if (activeTab === "Audit") {
      filteredSnaps = snaps.filter((s) => {
        if (!isAuditRelated(s)) return false;
        const tier = getTierForSnap(s);
        return contributionCredits >= (TIER_REQUIREMENTS[tier] || 0);
      });

      // Determine which tiers are still locked to show the gates
      if (contributionCredits < TIER_REQUIREMENTS[1]) lockedTiers.push(1);
      if (contributionCredits < TIER_REQUIREMENTS[2]) lockedTiers.push(2);
      lockedTiers.push(3); // Tier 3 is always locked in MVP demo
    } else if (activeTab === "Voting") {
      filteredSnaps = snaps.filter(
        (s) =>
          !isAuditRelated(s) &&
          (s.metadata?.insightType === "Legislative" ||
            s.elements.some((e) => e.type === "Metric.Dual.Comparison")),
      );
    } else if (activeTab === "Community") {
      filteredSnaps = snaps.filter(
        (s) => !isAuditRelated(s) && s.type === "Community",
      );
    } else if (activeTab === "Productivity") {
      filteredSnaps = snaps.filter(
        (s) =>
          !isAuditRelated(s) &&
          (s.id.includes("productivity") ||
            s.elements.some((e) => e.type === "Metric.Progress.Stepper")),
      );
    } else if (activeTab === "Activity") {
      filteredSnaps = snaps.filter((s) => !isAuditRelated(s));
    }

    return (
      <View style={styles.feedWrapper}>
        {activeTab === "Productivity" && (
          <View style={styles.statsContainer}>
            <ThemedText style={styles.sectionTitle}>
              Legislative Performance
            </ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <ThemedText style={styles.statLabel}>Productivity</ThemedText>
                <ThemedText style={styles.statValue}>
                  {representative?.stats?.productivityScore || 72}%
                </ThemedText>
              </View>
              <View style={styles.statBox}>
                <ThemedText style={styles.statLabel}>Attendance</ThemedText>
                <ThemedText style={styles.statValue}>
                  {representative?.stats?.attendanceRate || 94}%
                </ThemedText>
              </View>
              <View style={styles.statBox}>
                <ThemedText style={styles.statLabel}>Bipartisan</ThemedText>
                <ThemedText style={styles.statValue}>
                  {representative?.stats?.bipartisanIndex || 48}%
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {filteredSnaps.length > 0 ? (
          <PoliSnapCollection poliSnaps={filteredSnaps as any} hideRepHeader />
        ) : (
          activeTab !== "Audit" && (
            <View style={styles.emptyFeed}>
              <ThemedText style={styles.emptyText}>
                No recent {activeTab.toLowerCase()} data for this
                representative.
              </ThemedText>
            </View>
          )
        )}

        {activeTab === "Audit" && (
          <View style={{ paddingHorizontal: 16 }}>
            {lockedTiers.includes(1) && (
              <InsightUnlockGate
                tier={1}
                title="FEC Correlation Intelligence"
                description="Unlock deep-dive correlations between campaign donations and legislative voting patterns."
                requiredCredits={TIER_REQUIREMENTS[1]}
                currentCredits={contributionCredits}
              />
            )}
            {lockedTiers.includes(2) && (
              <InsightUnlockGate
                tier={2}
                title="Full ROI Audit Scorecard"
                description="Comprehensive multi-dimensional analysis of representative effectiveness vs. constituent sentiment."
                requiredCredits={TIER_REQUIREMENTS[2]}
                currentCredits={contributionCredits}
              />
            )}
            {lockedTiers.includes(3) && (
              <InsightUnlockGate
                tier={3}
                title="Predictive Intelligence"
                description="AI-driven projections on bill passage odds and future legislative pivots based on historical sentiment."
                requiredCredits={TIER_REQUIREMENTS[3]}
                currentCredits={contributionCredits}
              />
            )}
          </View>
        )}

        {activeTab === "Productivity" && (
          <ThemedText style={styles.statInsight}>
            Productivity is measured by the number of bills sponsored and
            reported out of committee. Bipartisan index reflects co-sponsorship
            across party lines.
          </ThemedText>
        )}
      </View>
    );
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader
        title="Representative"
        representative={
          representative
            ? {
                name: representative.name,
                avatar: representative.profileImage,
                position: representative.position,
                subtext: representative.district
                  ? `${representative.state}, ${representative.district}`
                  : representative.state,
              }
            : undefined
        }
        onSearchPress={() => {
          if (id || representative?.id) {
            setRepSearchVisible(true);
          } else {
            setFilterVisible(true);
          }
        }}
      />

      <Animated.ScrollView
        stickyHeaderIndices={[0]}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Slot 0: Tabs (Sticky) */}
        <View
          style={[
            styles.tabsContainer,
            !representative && { height: 48, borderBottomWidth: 0 },
          ]}
        >
          {renderTabs()}
        </View>

        {/* Slot 1: Content Area */}
        <View style={styles.contentArea}>
          {loading && !representative ? (
            <View style={{ paddingVertical: 100 }}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
          ) : (
            renderContent()
          )}
        </View>
      </Animated.ScrollView>

      <DualTabBottomSheet
        isVisible={filterVisible}
        onClose={() => setFilterVisible(false)}
        tabOneLabel="Following"
        tabTwoLabel="All"
      />

      <RepresentativeSelectionBottomSheet
        isVisible={repSearchVisible}
        onClose={() => setRepSearchVisible(false)}
        onSelect={(repId) => {
          router.replace({
            pathname: "/representative",
            params: { id: repId },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing["2xl"],
  },
  tabsContainer: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    zIndex: 10,
  },
  tabWrapper: {
    flex: 1,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  tab: {
    marginRight: 24,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {},
  tabText: {
    fontSize: Typography.sizes.md,
    color: "#718096",
    fontWeight: Typography.weights.medium,
  },
  activeTabText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "60%",
    height: 6,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  contentArea: {
    paddingTop: 8,
  },
  feedWrapper: {
    // Already has internal padding via SnapCollection/Elements
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bioContainer: {
    padding: 16,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.textSecondary,
  },
  contactButton: {
    marginTop: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  committeeContainer: {
    padding: 16,
  },
  committeeItem: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.secondary,
  },
  committeeText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
  },
  eventsContainer: {
    padding: 16,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  eventDateBadge: {
    width: 44,
    height: 44,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  eventDateText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 13,
    color: Colors.light.textTertiary,
  },
  statsContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textMuted,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  statInsight: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  emptyFeed: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: "center",
  },
});
