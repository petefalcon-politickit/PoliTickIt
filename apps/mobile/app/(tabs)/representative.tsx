import { PoliTickItHeader } from "@/components/navigation/header";
import { PoliSnapCollection } from "@/components/polisnap-renderer";
import { ThemedText } from "@/components/themed-text";
import { DualTabBottomSheet } from "@/components/ui/dual-tab-bottom-sheet";
import { InsightUnlockGate } from "@/components/ui/insight-unlock-gate";
import { RepresentativeSelectionBottomSheet } from "@/components/ui/representative-selection-bottom-sheet";
import { ROIReportCard } from "@/components/ui/roi-report-card";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { AlignmentReport } from "@/services/interfaces/ICivicIntelligenceService";
import { PoliSnap } from "@/types/polisnap";
import { Representative } from "@/types/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
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
  const {
    omniFeedProvider,
    representativeRepository,
    civicIntelligenceService,
  } = useServices();
  const {
    lastViewedRepresentativeId,
    setLastViewedRepresentativeId,
    contributionCredits,
  } = useActivity();

  const [snaps, setSnaps] = useState<PoliSnap[]>([]);
  const [lockedTiers, setLockedTiers] = useState<number[]>([]);
  const [representative, setRepresentative] = useState<Representative | null>(
    null,
  );
  const [alignmentReport, setAlignmentReport] =
    useState<AlignmentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Activity");
  const [filterVisible, setFilterVisible] = useState(false);
  const [repSearchVisible, setRepSearchVisible] = useState(false);

  const prevTabRef = useRef(activeTab);
  const prevIdRef = useRef(id);

  const toggleFollow = async () => {
    if (!representative) return;

    const newStatus = !representative.isFollowing;

    // Optimistic UI Update
    setRepresentative({
      ...representative,
      isFollowing: newStatus,
    });

    try {
      await representativeRepository.toggleFollow(representative.id, newStatus);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      // Revert on failure
      setRepresentative({
        ...representative,
        isFollowing: !newStatus,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Identify the target representative ID
      let targetId = id || lastViewedRepresentativeId;

      if (!targetId) {
        const allReps = await representativeRepository.getAllRepresentatives();
        const followedRep = allReps.find((r: any) => r.isFollowing);
        targetId = followedRep ? followedRep.id : allReps[0]?.id;
      }

      if (!targetId) {
        setLoading(false);
        return;
      }

      // Check if this is a "Hard" change (different rep or different tab)
      // If it's just credits changing, we do a "Soft" refresh (no clearing snaps)
      const isHardRefresh =
        !representative ||
        representative.id !== targetId ||
        prevTabRef.current !== activeTab ||
        prevIdRef.current !== id;

      // 2. Fetch Representative Profile Data
      if (isHardRefresh) {
        setLoading(true);
        setSnaps([]);
        setLockedTiers([]);
      }

      // If we are switching reps, clear the profile and report
      if (representative && representative.id !== targetId) {
        setRepresentative(null);
        setAlignmentReport(null);
      }

      try {
        const repData =
          await representativeRepository.getRepresentativeById(targetId);
        setRepresentative(repData);
        setLastViewedRepresentativeId(targetId);

        // Fetch Alignment Report for this representative
        const report =
          await civicIntelligenceService.getAlignmentReport(targetId);
        setAlignmentReport(report);

        // Fetch snaps for the current active tab
        const { snaps: tabSnaps, lockedTiers: tiers } =
          await omniFeedProvider.getSnaps({
            representativeId: targetId,
            tab: activeTab,
            credits: contributionCredits,
          });

        setSnaps(tabSnaps);
        setLockedTiers(tiers || []);

        // Update refs for next change
        prevTabRef.current = activeTab;
        prevIdRef.current = id;
      } catch (error) {
        console.error("Failed to fetch representative data:", error);
      } finally {
        if (isHardRefresh) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [
    id,
    activeTab,
    contributionCredits,
    omniFeedProvider,
    representativeRepository,
    civicIntelligenceService,
  ]);

  const renderTabs = () => {
    if (!representative) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
        pointerEvents="auto"
        style={styles.tabsScrollView}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => {
              setActiveTab(tab);
            }}
            style={({ pressed }) => [
              styles.tab,
              activeTab === tab && styles.activeTab,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            hitSlop={{ top: 20, bottom: 20, left: 15, right: 15 }}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
              {activeTab === tab ? " " : ""}
            </ThemedText>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderContent = () => {
    if (!representative) return null;

    if (activeTab === "Biography") {
      return (
        <View style={GlobalStyles.metricContainer}>
          <ThemedText style={GlobalStyles.metricCardTitleLeft}>
            Biography
          </ThemedText>
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
        <View style={GlobalStyles.metricContainer}>
          <ThemedText style={GlobalStyles.metricCardTitleLeft}>
            Committee Assignments
          </ThemedText>
          <View style={styles.committeeList}>
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
        </View>
      );
    }

    if (activeTab === "Events") {
      return (
        <View style={GlobalStyles.metricContainer}>
          <ThemedText style={GlobalStyles.metricCardTitleLeft}>
            Upcoming & Recent Events
          </ThemedText>
          <View style={styles.eventsList}>
            {representative?.recentEvents?.map((event, i) => (
              <View key={i} style={styles.eventCard}>
                <View style={styles.eventDateBadge}>
                  <ThemedText style={styles.eventDateText}>
                    {event.date.split("-")[1]}/{event.date.split("-")[2]}
                  </ThemedText>
                </View>
                <View style={styles.eventInfo}>
                  <ThemedText style={styles.eventTitle}>
                    {event.title}
                  </ThemedText>
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
        </View>
      );
    }

    // Voting, Community, Activity, Audit all use Snap Collection with specific filters
    // Specialized Audit snaps (Scorecards and Financial Correlations) are restricted to the "Audit" tab
    const TIER_REQUIREMENTS: Record<number, number> = {
      1: 500,
      2: 1200,
      3: 2500,
    };

    return (
      <View style={styles.feedWrapper}>
        {activeTab === "Productivity" && (
          <View style={styles.statsContainer}>
            <ThemedText style={GlobalStyles.metricCardTitleLeft}>
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

        {activeTab === "Audit" && alignmentReport && (
          <View style={{ marginHorizontal: 16, marginVertical: 20 }}>
            <ROIReportCard report={alignmentReport} />
          </View>
        )}

        {snaps.length > 0 ? (
          <PoliSnapCollection poliSnaps={snaps as any} hideRepHeader />
        ) : loading ? (
          <View style={{ paddingVertical: 100 }}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : (
          activeTab !== "Audit" && (
            <View style={styles.emptyFeed}>
              <ThemedText style={styles.emptyText}>
                {representative
                  ? `No recent ${activeTab.toLowerCase()} data for this representative.`
                  : "No representative data found. Please ensure your relational ledger is hydrated."}
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
        representative={
          representative
            ? {
                name: representative.name,
                avatar: representative.profileImage,
                position: representative.position,
                subtext: representative.district
                  ? `${representative.state}, ${representative.district}`
                  : representative.state,
                isFollowing: representative.isFollowing,
                onFollowPress: toggleFollow,
              }
            : loading && (id || lastViewedRepresentativeId)
              ? {
                  name: "Loading...",
                  avatar: "",
                  position: "Fetching Forensic Data",
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

      <View
        collapsable={false}
        style={[
          styles.tabsContainer,
          !representative && { height: 48, borderBottomWidth: 0 },
        ]}
      >
        {renderTabs()}
      </View>

      <ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        removeClippedSubviews={false}
        nestedScrollEnabled={true}
      >
        {/* Slot 1: Content Area */}
        {loading && !representative ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : (
          renderContent()
        )}
      </ScrollView>

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
    backgroundColor: Colors.light.backgroundSecondary,
    borderBottomWidth: Platform.select({
      ios: StyleSheet.hairlineWidth,
      android: 1,
    }),
    borderBottomColor: Colors.light.separator,
    zIndex: 10, // Standard stacking
    elevation: 0,
    height: 48,
  },
  tabsScrollView: {
    flex: 1,
  },
  tabWrapper: {
    // Replaced by direct ScrollView in renderTabs
  },
  contentArea: {
    zIndex: 1,
    elevation: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  tab: {
    marginRight: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
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
    fontWeight: Typography.weights.semibold,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
    height: 3,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentArea: {
    // Replaced with screenGutter
  },
  feedWrapper: {
    // Already has internal padding via SnapCollection/Elements
  },
  sectionTitle: {
    ...GlobalStyles.metricCardTitleLeft,
  },
  bioText: {
    fontSize: Typography.sizes.md, // Standardized
    lineHeight: 22,
    color: Colors.light.textSecondary,
    marginBottom: 5,
  },
  contactButton: {
    marginTop: 15, // Grid synchronization standard
    backgroundColor: Colors.light.background, // Match container
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  committeeList: {
    gap: 10,
  },
  committeeItem: {
    backgroundColor: Colors.light.background,
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.secondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  committeeText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    borderRadius: 8,
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
    paddingHorizontal: 16,
    paddingTop: 15, // Grid synchronization standard
    paddingBottom: 15, // SYNCED: Vertical Rhythm Standard
    backgroundColor: Colors.light.background, // Match page background
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0, // Rhythm managed by Container padding
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary, // Cards should pop from the Slate 50 background
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: 15, // Vertical rhythm inside the cards
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.light.separator, // Lighter separator for subtle institutional feel
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    fontWeight: Typography.weights.semibold as any,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.primary,
  },
  statInsight: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
    marginTop: 20, // Separation from feed
    marginBottom: 15,
  },
  emptyFeed: {
    paddingTop: 80,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: "center",
  },
});
