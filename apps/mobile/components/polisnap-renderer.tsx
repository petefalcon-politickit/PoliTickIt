import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ElementFactory from "@/components/factories/element-factory";
import "@/components/polisnap-elements"; // Initialize cohesive elements library
import { FeatureGate } from "@/components/ui/feature-gate";
import { MultiToggle } from "@/components/ui/multi-toggle";
import { PARTICIPATION_TIERS } from "@/constants/participation";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { ServiceProvider, useServices } from "@/contexts/service-provider";
import { useTelemetry } from "@/hooks/use-telemetry";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { FeedGutter } from "./ui/feed-gutter";
import { SeveredTitle } from "./ui/severed-title";

interface Element {
  id: string;
  type?: string;
  template?: any;
  data?: Record<string, any>;
  presentation?: any;
  provenance?: any;
  navigation?: any;
  controlFeatures?: any;
  textMetadata?: any;
  children?: any[];
}

// Element Renderer
export const ElementRenderer = ({
  element,
  extraProps,
}: {
  element: Element;
  extraProps?: any;
}) => {
  return ElementFactory.render(element, extraProps) as any;
};

/**
 * ProvenanceReceipt Molecule
 * A standardized CTA for accessing the "Institutional Receipt".
 */
const ProvenanceReceipt = ({
  provenance,
  onPress,
}: {
  provenance: any;
  onPress: (p: any) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.provenanceButton}
      onPress={() => onPress(provenance)}
      activeOpacity={0.7}
    >
      <View style={styles.provenanceContent}>
        <Ionicons
          name="shield-checkmark-outline"
          size={12}
          color={Colors.light.primary}
          style={{ marginRight: 6 }}
        />
        <ThemedText style={styles.provenanceText}>
          {provenance.label || "View Institutional Receipt"}
        </ThemedText>
      </View>
      <Ionicons
        name="chevron-forward"
        size={10}
        color={Colors.light.textPlaceholder}
      />
    </TouchableOpacity>
  );
};

// Collection renderer (carousel/horizontal)
ElementFactory.register("collection", (element: Element, extraProps?: any) => {
  if (!Array.isArray(element.children)) return null;

  if (element.controlFeatures?.collectionMode === "horizontal") {
    return (
      <View style={styles.horizontalRow}>
        {element.children.map((child: any) => (
          <View key={child.id} style={{ flex: 1 }}>
            {ElementFactory.render(child, extraProps)}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View key={element.id} style={styles.carouselContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {element.children.map((child: any) => (
          <View key={child.id} style={styles.carouselItem}>
            {ElementFactory.render(child, extraProps)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

export const PoliSnapItem = ({
  snap,
  hideRepHeader = false,
}: {
  snap: any;
  hideRepHeader?: boolean;
}) => {
  const elements = Array.isArray(snap.elements) ? snap.elements : [];
  const tabs = snap.controlFeatures?.tabs;
  const headerElementId = snap.metadata?.headerElementId;

  // Header Element Logic: Treat any Representative Header as the visual header
  // Prefer explicit headerElementId, but fallback to first Rep header found
  let headerElement = headerElementId
    ? elements.find((e: any) => e.id === headerElementId)
    : elements.find(
        (e: any) =>
          e.type === "Header.Representative" ||
          e.type === "Identity.Rep.Header" ||
          e.type === "Identity.Rep.Brief" ||
          e.type === "Identity.RepBrief" ||
          e.type === "Identity.Representative" ||
          e.type === "Identity.Organization.Header",
      );

  // Determine if we should hide this specific header
  const shouldHideHeader =
    hideRepHeader &&
    (headerElement?.type === "Header.Representative" ||
      headerElement?.type === "Identity.Rep.Header" ||
      headerElement?.type === "Identity.Rep.Brief" ||
      headerElement?.type === "Identity.RepBrief" ||
      headerElement?.type === "Identity.Representative" ||
      headerElement?.type === "Identity.Organization.Header");

  // Business Rule: Standardize Snap Title visibility.
  // Previously we hidden titles for self-titling molecules, but now we keep them
  // and refine the molecule titles to avoid redundancy.
  const shouldHideSnapTitle = snap.metadata?.hideTitle || false;

  // Filter out the header element and redundant source tags from the vertical block sequence
  const mainElements = elements.filter((e: any) => {
    const isHeader = e.id === (headerElementId || headerElement?.id);
    const isSourceTag = e.type === "Identity.Source.Tag";
    const isRedundantRep =
      hideRepHeader &&
      (e.type === "Identity.Rep.Brief" ||
        e.type === "Identity.RepBrief" ||
        e.type === "Identity.Rep.Header" ||
        e.type === "Header.Representative" ||
        e.type === "Identity.Representative" ||
        e.type === "Identity.Organization.Header");

    return !isHeader && !isSourceTag && !isRedundantRep;
  });

  // Initialize with the first tab if available
  const [activeTab, setActiveTab] = useState(
    tabs && tabs.length > 0 ? tabs[0] : "",
  );

  const {
    navigationService,
    forensicSignalCoordinator,
    hapticService,
    watchlistService,
  } = useServices();
  const { trackAction } = useTelemetry();
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    // Pulse Logging: Record high-frequency dwell/entry pulse
    if (forensicSignalCoordinator && snap.id) {
      forensicSignalCoordinator.emitSignal({
        type: "pulse",
        id: snap.id,
        metadata: {
          pulse_type: "dwell",
          intensity: 1,
          type: snap.type,
          tier: snap.metadata?.applicationTier,
        },
      });
    }

    const checkWatchStatus = async () => {
      if (watchlistService && snap.id) {
        const watched = await watchlistService.isWatched(snap.id);
        setIsWatched(watched);
      }
    };
    checkWatchStatus();
  }, [snap.id, watchlistService, forensicSignalCoordinator]);

  const toggleWatchlist = async () => {
    hapticService.triggerMediumImpact();
    if (isWatched) {
      await watchlistService.removeFromWatchlist(snap.id);
      setIsWatched(false);
      await trackAction(snap.id, "watchlist_remove");
    } else {
      await watchlistService.addToWatchlist(snap.id);
      setIsWatched(true);
      await trackAction(snap.id, "watchlist_add");
    }
  };

  const handleOpenProvenance = async (provenance: any) => {
    hapticService.triggerLightImpact();
    await trackAction(snap.id, "view_provenance", {
      url: provenance.url,
      provider: provenance.provider,
    });
    await WebBrowser.openBrowserAsync(provenance.url);
  };

  const extraProps = {
    activeTab,
    navigationService,
    representativeId: snap.metadata?.representativeId,
    insightType: snap.metadata?.insightType || snap.type || "Insight",
  };

  const isReward = snap.type === "Reward";

  // UI Refinement: Repetitive "Accountability" type replaced with specific insightType
  // Standardized types: VOTE, DEBATE, STATEMENT, METRIC, ANALYSIS, LOCAL
  const rawType = (
    snap.metadata?.insightType ||
    snap.type ||
    "Insight"
  ).toUpperCase();
  let insightLabel = isReward ? "" : "INSIGHT";
  if (!isReward) {
    if (rawType.includes("VOTE")) insightLabel = "VOTING RECORD";
    else if (rawType.includes("DEBATE")) insightLabel = "DEBATE";
    else if (rawType.includes("STATEMENT")) insightLabel = "STATEMENT";
    else if (
      rawType.includes("ROI") ||
      rawType.includes("SCORE") ||
      rawType.includes("METRIC") ||
      rawType.includes("ATTENDANCE") ||
      rawType.includes("FEC") ||
      rawType.includes("CONTRIBUTION")
    )
      insightLabel = "INSTITUTIONAL METRIC";
    else if (
      rawType.includes("PREDICT") ||
      rawType.includes("ANALYSIS") ||
      rawType.includes("SUMMARY")
    )
      insightLabel = "INSIGHT ANALYSIS";
    else if (rawType.includes("LOCAL") || rawType.includes("PULSE"))
      insightLabel = "LOCAL PULSE";

    const isAccountability = snap.type?.toLowerCase() === "accountability";
    if (isAccountability && insightLabel === "INSIGHT")
      insightLabel = "ACCOUNTABILITY REPORT";
  }

  const snapTier = snap.metadata?.applicationTier;
  const isHighTier =
    snapTier === "Intelligence" ||
    snapTier === "ROI Auditor" ||
    snapTier === "Institutional" ||
    snapTier === "Pro";
  const tierInfo = snapTier
    ? PARTICIPATION_TIERS.find((t) => t.name === snapTier)
    : null;

  // Trust Thread Serial Generator (Deterministic for consistent rendering)
  const serialId = `PS-${snap.id?.split("-").pop()?.toUpperCase() || "X-000"}`;

  const renderContent = () => (
    <View
      key={snap.id}
      style={[styles.snapCard, isReward && styles.rewardCard]}
    >
      {/* 0. Trust Thread Watermark (High Tier Only) */}
      {isHighTier && (
        <View style={styles.trustThreadWatermark}>
          <ThemedText
            style={styles.watermarkText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            VERIFIED DATA
          </ThemedText>
        </View>
      )}

      {isHighTier && (
        <View style={styles.serialIdBadge}>
          <ThemedText style={styles.serialIdText}>{serialId}</ThemedText>
        </View>
      )}

      <View style={[styles.snapHeader, isReward && styles.rewardHeader]}>
        {/* 1. Header (if exists and not hidden) */}
        {headerElement && !shouldHideHeader && (
          <ElementRenderer
            element={{
              ...headerElement,
              presentation: { ...headerElement.presentation, isHeader: true },
            }}
            extraProps={{ ...extraProps }}
          />
        )}

        {/* 3. Title (Pillbox removed per Alternative 1) */}
        {!shouldHideSnapTitle && !isReward && (
          <View
            style={[
              styles.titleRow,
              headerElement && !shouldHideHeader
                ? { marginTop: 11 }
                : { marginTop: 0 },
              !snap.metadata?.laymanSummary ? { marginBottom: 15 } : null,
            ]}
          >
            <SeveredTitle
              title={snap.title}
              style={styles.snapTitle}
              textAlign="left"
            />

            {/* Selective Watchlist capability: Moved to Title Row for maximum density */}
            <TouchableOpacity
              onPress={toggleWatchlist}
              style={styles.watchButton}
            >
              <Ionicons
                name={isWatched ? "bookmark" : "bookmark-outline"}
                size={20}
                color={
                  isWatched
                    ? Colors.light.primary
                    : Colors.light.textPlaceholder
                }
              />
            </TouchableOpacity>
          </View>
        )}

        {snap.metadata?.laymanSummary && (
          <ThemedText style={styles.laymanSummary}>
            {snap.metadata.laymanSummary}
          </ThemedText>
        )}
      </View>

      <View style={styles.snapContent}>
        {!snap.metadata?.laymanSummary && snap.metadata?.description && (
          <ThemedText style={styles.snapDescription}>
            {snap.metadata.description}
          </ThemedText>
        )}

        {tabs && (
          <MultiToggle
            options={tabs}
            currentValue={activeTab}
            onChange={setActiveTab}
            style={{ marginBottom: 12 }}
          />
        )}

        {/* Vertical Block Architecture: Render elements in sequence */}
        {mainElements.map((element: any, index: number) => {
          // Cohort-Based Intensity Filtering (Task 1)
          // If the element has a cohort specific intensity, we check if it matches the user context
          // (Mock implementation of intensity weighting)
          const elementIntensity = element.presentation?.intensity || 1.0;
          const isLowSignalForContext = elementIntensity < 0.2;

          if (isLowSignalForContext) return null;

          // Vertical Rhythm Override: Handle specific spacing requirements (e.g., tight-1 for forensic cards)
          const spacingAttr = element.presentation?.attributes?.spacing;
          const rhythmOverride =
            spacingAttr === "v-rhythm-tight-1"
              ? { marginTop: -11 } // Subtract 11px from the default 15px gutter to reach 4px
              : null;

          return (
            <View
              key={element.id}
              style={[
                styles.elementGutter,
                rhythmOverride,
                index === mainElements.length - 1 && styles.lastElement,
              ]}
            >
              <ElementRenderer
                element={element}
                extraProps={{
                  ...extraProps,
                  snapId: snap.id,
                  elementId: element.id,
                }}
              />
              {element.provenance && (
                <ProvenanceReceipt
                  provenance={element.provenance}
                  onPress={() => handleOpenProvenance(element.provenance)}
                />
              )}
            </View>
          );
        })}

        {/* Standalone Snap-level Provenance (Institutional Receipt) */}
        {snap.metadata?.provenance && (
          <View style={{ marginTop: 11 }}>
            <ProvenanceReceipt
              provenance={snap.metadata.provenance}
              onPress={() => handleOpenProvenance(snap.metadata.provenance)}
            />
          </View>
        )}

        {/* Footnote for Data-Driven Snaps (Exclude internal PoliTickIt features/rewards) */}
        {!snap.sources?.some((s: any) => s.name?.includes("PoliTickIt")) && (
          <View style={styles.snapFooter}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={12}
                color="#94A3B8"
                style={{ marginRight: 4 }}
              />
              <ThemedText style={styles.footerText}>
                <Text style={styles.sourceName}>
                  {snap.sources && snap.sources.length > 0
                    ? snap.sources.map((s: any) => s.name).join(", ")
                    : "Institutional Audit"}
                </Text>
                {` • `}
                {new Date(snap.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </ThemedText>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  if (tierInfo && tierInfo.level > 1) {
    return (
      <FeatureGate
        level={tierInfo.level}
        featureTitle={snap.title}
        featureDescription={`${insightLabel} analysis reserved for ${tierInfo.name} participants.`}
      >
        {renderContent()}
      </FeatureGate>
    );
  }

  return renderContent();
};

export const PoliSnapRenderer = ({
  snap,
  hideRepHeader = false,
}: {
  snap: any;
  hideRepHeader?: boolean;
}) => {
  try {
    return (
      <ServiceProvider>
        <PoliSnapItem snap={snap} hideRepHeader={hideRepHeader} />
      </ServiceProvider>
    );
  } catch (error) {
    console.error("Critical Snap Render Failure:", error);
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: "#fef2f2",
          borderRadius: 8,
          margin: 16,
        }}
      >
        <Text style={{ color: "#991b1b", fontWeight: "600" }}>
          Failed to load Snap data.
        </Text>
      </View>
    );
  }
};

export const PoliSnapCollection = ({
  poliSnaps,
  hideRepHeader = false,
}: {
  poliSnaps: any[] | any;
  hideRepHeader?: boolean;
}) => {
  const { contributionCredits = 0 } = useActivity() || {};
  const { feedEnricher } = useServices();
  const rawSnaps = Array.isArray(poliSnaps) ? poliSnaps : [poliSnaps];

  // 1. Enrich the feed using the FeedEnricher service
  // This centralizes logic for visual variety, reordering, and slug interleaving.
  const feedItems = feedEnricher.enrich(rawSnaps, { contributionCredits });

  return (
    <ThemedView
      style={[styles.screen, { backgroundColor: Colors.light.background }]}
    >
      {feedItems.map((item) => {
        if (item.type === "gutter") {
          return (
            <FeedGutter
              key={item.id}
              slug={item.config}
              isFirst={item.isFirst}
            />
          );
        }

        return (
          <PoliSnapItem
            key={item.id}
            snap={item.data}
            hideRepHeader={hideRepHeader}
          />
        );
      })}

      {/* Final footer space for the feed */}
      <View style={{ height: 32 }} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  snapCard: {
    ...GlobalStyles.snapCard,
    marginBottom: 0,
    paddingBottom: 15, // Standard 15px track
    borderBottomWidth: 0, // Removed to prevent "double lines" - Gutter handles separation
  },
  rewardCard: {
    marginTop: 15,
    marginBottom: 1,
    borderColor: Colors.light.border,
    borderBottomWidth: 4,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "#FFFFFF",
  },
  snapHeader: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 0,
    marginBottom: 0,
  },
  rewardHeader: {
    paddingHorizontal: 0,
  },
  trustThreadWatermark: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.03,
    transform: [{ rotate: "-15deg" }],
    pointerEvents: "none",
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 60,
    fontWeight: "900",
    color: Colors.light.text,
    letterSpacing: 2,
    lineHeight: 70, // Explicit line height to prevent overlap if it wraps
  },
  serialIdBadge: {
    position: "absolute",
    top: 15, // Grid aligned to the 15px track
    right: Spacing.md,
    backgroundColor: "transparent",
    opacity: 0.4,
  },
  serialIdText: {
    fontSize: 7,
    fontFamily: Typography.fonts.mono,
    color: Colors.light.textTertiary,
  },
  elementGutter: {
    marginBottom: 15,
  },
  lastElement: {
    marginBottom: 0,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 0,
    marginBottom: 15,
    paddingHorizontal: 0,
  },
  watchButton: {
    padding: 4,
  },
  snapTitle: {
    ...GlobalStyles.snapTitle,
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
  },
  laymanSummary: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
    marginTop: 0,
    marginBottom: 15,
    lineHeight: 22,
    paddingHorizontal: 0,
  },
  snapContent: {
    paddingHorizontal: Spacing.md,
  },
  snapDescription: {
    fontSize: Typography.sizes.base,
    lineHeight: 22,
    color: Colors.light.textSlate,
    marginBottom: 15, // [RHYTHM-INTERCEPT]: 15px - 11px offset = 4px Mechanical Grid synchronization
  },
  horizontalRow: { flexDirection: "row", gap: Spacing.md, width: "100%" },
  carouselContainer: { height: 200, marginVertical: 0 },
  carouselItem: { width: Dimensions.get("window").width - 32, paddingRight: 8 },
  snapFooter: {
    marginTop: 15, // [RHYTHM-INTERCEPT]: 15px - 11px offset = 4px Mechanical Grid synchronization
    paddingTop: Spacing.xs,
    paddingHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: Typography.sizes.sm,
    color: "#64748B",
    fontStyle: "italic",
  },
  sourceName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: "#475569",
  },
  provenanceButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 4,
  },
  provenanceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  provenanceText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
    letterSpacing: 0.2,
  },
});

export default PoliSnapCollection;
