import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Shared Pill Component for Headers
 */
const HeaderPill = ({ text, type }: { text: string; type?: string }) => {
  let bgColor = Colors.light.border;
  let textColor = Colors.light.textSecondary;

  if (type === "primary") {
    bgColor = "#FEE2E2"; // Red-100
    textColor = "#B91C1C"; // Red-700
  } else if (type === "secondary") {
    bgColor = "#E0F2FE"; // Blue-100
    textColor = "#0369A1"; // Blue-700
  }

  return (
    <View style={[styles.pill, { backgroundColor: bgColor }]}>
      <ThemedText style={[styles.pillText, { color: textColor }]}>
        {text}
      </ThemedText>
    </View>
  );
};

/**
 * Party Badge Badge
 */
const PartyBadge = ({ party }: { party?: string }) => {
  if (!party) return null;
  const isRep = party.toLowerCase().startsWith("r");
  const isDem = party.toLowerCase().startsWith("d");

  return (
    <View
      style={[
        styles.partyBadge,
        {
          backgroundColor: isRep
            ? "#D0021B"
            : isDem
              ? "#164269"
              : Colors.light.textGray,
        },
      ]}
    >
      <ThemedText style={styles.partyBadgeText}>{party[0]}</ThemedText>
    </View>
  );
};

/**
 * Header.Representative
 * Matches the high-fidelity wireframe for political entities.
 */
export const HeaderRepresentative = ({
  data,
  navigationService,
  extraProps,
}: any) => {
  const {
    id,
    context,
    name,
    imgUri,
    imageUrl,
    position,
    tags,
    party,
    location,
    state,
    district,
  } = data || {};

  const effectiveId = id || extraProps?.representativeId;
  const insightType = extraProps?.insightType;

  // Clean name: Remove titles (Sen., Rep.) and state abbreviations (CA)
  const cleanName = name
    ?.replace(/^(Sen\.|Rep\.)\s+/, "")
    .replace(/\s+\([A-Z]{2}\)$/, "");

  const handlePress = () => {
    if (navigationService && effectiveId) {
      navigationService.navigateToEntity("representative", effectiveId);
    }
  };

  // Build high-fidelity location string from enriched mock data
  const locationString =
    location || (state ? (district ? `${state} • ${district}` : state) : null);

  const Content = (
    <View style={styles.container}>
      <Image
        source={
          imgUri ||
          imageUrl ||
          `https://ui-avatars.com/api/?name=${cleanName || "Rep"}&background=CBD5E0&color=4A5568`
        }
        style={styles.avatar}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.content}>
        <View style={styles.headerTopRow}>
          {context && <ThemedText style={styles.context}>{context}</ThemedText>}
        </View>
        <ThemedText style={styles.name}>{cleanName}</ThemedText>

        <View style={styles.metadataRow}>
          {position && <HeaderPill text={position} />}
          {tags?.map((tag: any, i: number) => (
            <HeaderPill key={i} text={tag.name} type={tag.type} />
          ))}
          <PartyBadge party={party} />
          {locationString && (
            <ThemedText style={styles.locationText}>
              {locationString}
            </ThemedText>
          )}
        </View>
      </View>
      <View style={styles.actionContainer}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={Colors.light.textMuted}
        />
      </View>
    </View>
  );

  if (navigationService && effectiveId) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

/**
 * Header.Profile
 * Matches wireframe for user or contributor profiles.
 */
export const HeaderProfile = ({ data }: any) => {
  const { context, name, imgUri, tags, timestamp } = data || {};

  return (
    <View style={styles.container}>
      <Image
        source={
          imgUri ||
          `https://ui-avatars.com/api/?name=${name || "User"}&background=E2E8F0&color=475569`
        }
        style={styles.avatar}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.content}>
        {context && <ThemedText style={styles.context}>{context}</ThemedText>}
        <ThemedText style={styles.name}>{name}</ThemedText>

        <View style={styles.metadataRow}>
          {tags?.map((tag: any, i: number) => (
            <HeaderPill key={i} text={tag.name} type={tag.type} />
          ))}
          {timestamp && (
            <ThemedText style={styles.locationText}>{timestamp}</ThemedText>
          )}
        </View>
      </View>
      <View style={styles.actionContainer}>
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={Colors.light.textMuted}
        />
      </View>
    </View>
  );
};

/**
 * Header.Sponsor
 * Matches wireframe for sponsored/promoted content.
 */
export const HeaderSponsor = ({ data }: any) => {
  const {
    sponsorName,
    promotionTitle,
    imgUri,
    tags,
    isVerified,
    organizationType,
  } = data || {};

  return (
    <View style={styles.container}>
      <Image
        source={
          imgUri ||
          `https://ui-avatars.com/api/?name=${sponsorName || "Sponsor"}&background=E2E8F0&color=475569`
        }
        style={styles.avatar}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.content}>
        <View style={styles.headerTopRow}>
          {sponsorName && (
            <ThemedText style={styles.context}>{sponsorName}</ThemedText>
          )}
          {isVerified && (
            <Ionicons
              name="checkmark-circle"
              size={12}
              color={Colors.light.primary}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
        <ThemedText style={styles.name}>{promotionTitle}</ThemedText>

        <View style={styles.metadataRow}>
          {organizationType && (
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: "#F0FDFA",
                  borderColor: "#14B8A6",
                  borderWidth: 0.5,
                },
              ]}
            >
              <ThemedText style={[styles.pillText, { color: "#0D9488" }]}>
                {organizationType}
              </ThemedText>
            </View>
          )}
          {tags?.map((tag: any, i: number) => (
            <HeaderPill key={i} text={tag.name} type={tag.type} />
          ))}
          <ThemedText style={styles.locationText}>Sponsored Content</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 0, // Card padding handles the top 15px
    paddingBottom: Spacing.xs, // Combines with titleRow's 11px for 15px track
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F7FAFC",
  },
  content: {
    flex: 1,
    marginLeft: Spacing.sm, // Reduced from Spacing.md for tighter mechanical alignment
    justifyContent: "center",
  },
  context: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    marginBottom: 0,
    letterSpacing: 0.5,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.text,
    lineHeight: 20,
    marginTop: 1,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
    columnGap: 8,
    rowGap: 4,
  },
  pill: {
    paddingHorizontal: 6,
    borderRadius: 4, // Mechanical radius
  },
  pillText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  partyBadge: {
    width: 18,
    height: 18,
    borderRadius: 4, // Mechanical alignment
    justifyContent: "center",
    alignItems: "center",
    // Center alignment fixes for R/D text
    ...Platform.select({
      ios: {
        paddingTop: 1,
      },
      android: {
        paddingBottom: 1,
      },
    }),
  },
  partyBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: Typography.weights.heavy as any,
    textAlign: "center",
    includeFontPadding: false,
  },
  locationText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  actionContainer: {
    paddingLeft: Spacing.sm,
  },
});

// Component Registrations
ComponentFactory.register("Header.Representative", ({ value, extraProps }) => (
  <HeaderRepresentative
    data={value}
    navigationService={extraProps?.navigationService}
    extraProps={extraProps}
  />
));

ComponentFactory.register("Header.Profile", ({ value }) => (
  <HeaderProfile data={value} />
));

ComponentFactory.register("Header.Sponsor", ({ value }) => (
  <HeaderSponsor data={value} />
));
