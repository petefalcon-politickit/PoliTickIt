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
import { MultiToggle } from "@/components/ui/multi-toggle";
import { FEATURE_FLAGS } from "@/constants/feature-flags";
import { PARTICIPATION_TIERS } from "@/constants/participation";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useActivity } from "@/contexts/activity-context";
import { useServices } from "@/contexts/service-provider";
import { SlugConfig } from "@/types/slug";
import { Ionicons } from "@expo/vector-icons";
import { FeedGutter } from "./ui/feed-gutter";

interface Element {
  id: string;
  type?: string;
  template?: any;
  data?: Record<string, any>;
  presentation?: any;
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
          e.type === "Header.Representative" || e.type === "Identity.Rep.Brief",
      );

  // Determine if we should hide this specific header
  const shouldHideHeader =
    hideRepHeader &&
    (headerElement?.type === "Header.Representative" ||
      headerElement?.type === "Identity.Rep.Brief");

  // Filter out the header element and redundant source tags from the vertical block sequence
  const mainElements = elements.filter((e: any) => {
    const isHeader = e.id === (headerElementId || headerElement?.id);
    const isSourceTag = e.type === "Identity.Source.Tag";
    const isRedundantRep =
      hideRepHeader &&
      (e.type === "Identity.Rep.Brief" || e.type === "Header.Representative");

    return !isHeader && !isSourceTag && !isRedundantRep;
  });

  // Initialize with the first tab if available
  const [activeTab, setActiveTab] = useState(
    tabs && tabs.length > 0 ? tabs[0] : "",
  );

  const { navigationService, watchlistService, telemetryService } =
    useServices();
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    watchlistService.isWatched(snap.id).then(setIsWatched);
  }, [snap.id, watchlistService]);

  const toggleWatchlist = async () => {
    if (isWatched) {
      await watchlistService.removeFromWatchlist(snap.id);
    } else {
      await watchlistService.addToWatchlist(snap.id);
      // Earn credits for adding to watchlist
      await telemetryService.trackAction(snap.id, "WATCHLIST_ADD", {
        type: snap.type,
        title: snap.title,
      });
    }
    setIsWatched(!isWatched);
  };

  const extraProps = { activeTab, navigationService };

  // UI Refinement: Repetitive "Accountability" type replaced with specific insightType
  const insightLabel = snap.metadata?.insightType || snap.type || "Insight";
  const isAccountability = snap.type?.toLowerCase() === "accountability";

  return (
    <View key={snap.id} style={styles.snapCard}>
      <View style={styles.snapHeader}>
        {/* 1. Header (if exists and not hidden) */}
        {headerElement && !shouldHideHeader && (
          <ElementRenderer
            element={{
              ...headerElement,
              presentation: { ...headerElement.presentation, isHeader: true },
            }}
            extraProps={extraProps}
          />
        )}

        {/* 2. PoliSnap Type (Pillbox) */}
        <View
          style={[
            styles.typeContainer,
            (!headerElement || shouldHideHeader) && { marginTop: 0 },
          ]}
        >
          <View
            style={[
              styles.typePill,
              isAccountability && styles.accountabilityPill,
            ]}
          >
            <ThemedText
              style={[
                styles.typeText,
                isAccountability && styles.accountabilityTypeText,
              ]}
            >
              {insightLabel}
            </ThemedText>
          </View>
        </View>

        {/* 3. Title (Always comes after Type) */}
        <ThemedText style={styles.snapTitle}>{snap.title}</ThemedText>

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
        {mainElements.map((element: any, index: number) => (
          <View
            key={element.id}
            style={[
              styles.elementGutter,
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
          </View>
        ))}

        <View style={styles.snapFooter}>
          <View style={styles.footerLeft}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#94A3B8"
            />
            <ThemedText style={styles.footerText}>
              <Text style={styles.sourceName}>
                {snap.sources && snap.sources.length > 0
                  ? snap.sources.map((s: any) => s.name).join(", ")
                  : "Not Specified"}
              </Text>
              {` • `}
              {new Date(snap.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={toggleWatchlist}
            style={styles.watchlistButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isWatched ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isWatched ? Colors.light.primary : "#94A3B8"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const PoliSnapCollection = ({
  poliSnaps,
  hideRepHeader = false,
}: {
  poliSnaps: any[] | any;
  hideRepHeader?: boolean;
}) => {
  const { contributionCredits } = useActivity() || { contributionCredits: 0 };
  const rawSnaps = Array.isArray(poliSnaps) ? poliSnaps : [poliSnaps];

  // 1. Filter out snaps by Tier
  const snaps = rawSnaps.filter((snap: any) => {
    const snapTier = snap.metadata?.applicationTier;
    if (!snapTier) return true;
    const tierInfo = PARTICIPATION_TIERS.find((t) => t.name === snapTier);
    return !tierInfo || contributionCredits >= tierInfo.requirement;
  });

  const frequency = FEATURE_FLAGS.SLUG_FREQUENCY || 3;

  // 2. Normalize and Interleave Feed Items (Proper Cell Logic)
  // This approach handles all gutters and slugs as structured "cells" in the sequence
  const feedItems = snaps.reduce((acc: any[], snap, index) => {
    const isLead = index === 0;
    const showSlug =
      FEATURE_FLAGS.RANDOM_SLUGS_IN_FEED && index % frequency === 0;

    // Add Gutter/Slug Cell BEFORE the snap
    let slugConfig: SlugConfig | undefined;
    if (showSlug) {
      slugConfig = {
        id: `slug-${snap.id}`,
        type: "participation",
        props: {
          message: isLead
            ? "Wisdom of the Village: Your participation powers our collective insight."
            : undefined,
        },
      };
    }

    acc.push({
      type: "gutter",
      id: `gutter-${snap.id}`,
      config: slugConfig,
      isFirst: isLead,
    });

    // Add the Snap Cell itself
    acc.push({
      type: "snap",
      id: snap.id,
      data: snap,
    });

    return acc;
  }, []);

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
    paddingBottom: Spacing.md, // Reduced from GlobalStyles (+5) to tighten feed rhythm
    borderBottomWidth: 0, // Removed to prevent "double lines" - Gutter handles separation
  },
  snapHeader: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  elementGutter: {
    marginBottom: 12, // Consistent vertical sequence gutter
  },
  lastElement: {
    marginBottom: 0, // Last element doesn't need a gutter before the footer
  },
  typeContainer: {
    flexDirection: "row",
    marginTop: Spacing.xs,
    marginBottom: 0, // Title's marginTop handles the spacing
  },
  typePill: {
    ...GlobalStyles.tagPill,
  },
  accountabilityPill: {
    ...GlobalStyles.tagPill,
  },
  typeText: {
    ...GlobalStyles.tagText,
  },
  accountabilityTypeText: {
    ...GlobalStyles.tagText,
  },
  snapTitle: {
    ...GlobalStyles.snapTitle,
    paddingHorizontal: 0, // Header container already has padding
    marginTop: Spacing.sm,
  },
  laymanSummary: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  snapContent: {
    paddingHorizontal: Spacing.md,
  },
  snapDescription: {
    fontSize: Typography.sizes.base,
    lineHeight: 22,
    color: Colors.light.textSlate,
    marginBottom: 12,
  },
  horizontalRow: { flexDirection: "row", gap: Spacing.md, width: "100%" },
  carouselContainer: { height: 200, marginVertical: 0 },
  carouselItem: { width: Dimensions.get("window").width - 32, paddingRight: 8 },
  snapFooter: {
    ...GlobalStyles.snapFooter,
    justifyContent: "space-between",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  watchlistButton: {
    paddingLeft: Spacing.sm,
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
  dateSeparator: {
    fontSize: Typography.sizes.xs,
    color: "#CBD5E1",
  },
});

export default PoliSnapCollection;
