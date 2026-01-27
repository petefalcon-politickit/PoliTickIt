import React from "react";
import { StyleSheet, View } from "react-native";
import { SlugConfig } from "../../types/slug";
import { slugFactory } from "../factories/slug-factory";

interface FeedGutterProps {
  slug?: SlugConfig;
  isFirst?: boolean;
}

/**
 * FeedGutter
 * A modular cell that acts as a separator or interstitial content between snaps.
 * This is a "proper cell" architecture where the gutter is a standalone item in the feed.
 */
export const FeedGutter = ({ slug, isFirst = false }: FeedGutterProps) => {
  // 1. Determine the core configuration of this gutter cell
  const isSlug = slug && slug.type !== "separator";

  // Height logic: Slug cells are taller, separators are standard 8px bars
  const defaultHeight = isSlug ? 72 : 8;
  const height = slug?.height || defaultHeight;

  // The "Dark Gray Area" requested - Slate 200 provides the feed background depth
  const gutterColor = "#E2E8F0";
  const backgroundColor = slug?.backgroundColor || gutterColor;

  // 2. Build the dynamic cell style
  const cellStyle: any = {
    backgroundColor: isFirst && !isSlug ? "transparent" : backgroundColor,
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
  };

  // Logic for top-of-feed or general inter-card gutters
  if (isFirst) {
    if (isSlug) {
      cellStyle.minHeight = height;
    } else {
      cellStyle.height = 0;
    }
  } else {
    if (isSlug) {
      cellStyle.minHeight = height;
    } else {
      cellStyle.height = height;
    }
  }

  return (
    <View style={cellStyle}>
      {isSlug ? (
        <View style={styles.slugWrapper}>
          {slugFactory.render(slug.type, slug.props)}
        </View>
      ) : // For empty gutters, we show the solid bar of backgroundColor (Slate 200)
      // This avoids the "light-dark-light" sandwich issue.
      null}
    </View>
  );
};

const styles = StyleSheet.create({
  slugWrapper: {
    paddingVertical: 12, // Provides internal spacing for slugs
    width: "100%",
  },
});
