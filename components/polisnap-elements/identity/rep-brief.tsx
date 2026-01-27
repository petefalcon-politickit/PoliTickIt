import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const IdentityRepBrief = ({
  data,
  presentation,
  navigationService,
}: any) => {
  const { name, state, district, party, imgUri, status, id } = data || {};
  const isFollowing = status?.isFollowing;
  const hideFollowButton = presentation?.hideFollowButton;
  const primaryColor = Colors.light.primary;
  const textMuted = Colors.light.textTertiary;

  const handlePress = () => {
    if (navigationService && id) {
      navigationService.navigateToEntity("representative", id);
    }
  };

  const locationString = state
    ? district
      ? `${state} • ${district}`
      : state
    : "Location";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!navigationService}
      onPress={handlePress}
      style={[
        styles.container,
        presentation?.showDivider && styles.divider,
        presentation?.isHeader && styles.headerMode,
      ]}
    >
      <View style={styles.headerRow}>
        <Image
          source={
            imgUri ||
            `https://ui-avatars.com/api/?name=${name || "Rep"}&background=CBD5E0&color=4A5568`
          }
          style={styles.avatar}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={styles.info}>
          <ThemedText style={styles.name}>
            {name || "Representative Name"}
          </ThemedText>
          <ThemedText style={[styles.subText, { color: textMuted }]}>
            {party || "Party"} • {locationString}
            {hideFollowButton && isFollowing && (
              <ThemedText style={styles.followingContext}>
                {"  "}•{"  "}
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors.light.success}
                />{" "}
                Following
              </ThemedText>
            )}
          </ThemedText>
        </View>

        {!hideFollowButton && (
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing
                ? styles.following
                : { borderColor: Colors.light.border },
            ]}
          >
            <Ionicons
              name={isFollowing ? "checkmark-circle" : "add-outline"}
              size={16}
              color={isFollowing ? "#FFFFFF" : Colors.light.secondary}
            />
            <ThemedText
              style={[
                styles.followButtonText,
                { color: isFollowing ? "#FFFFFF" : Colors.light.secondary },
              ]}
            >
              {isFollowing ? "FOLLOWING" : "FOLLOW"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  headerMode: {
    paddingVertical: 0,
    marginBottom: Spacing.xs,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.border,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: 15,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
  },
  subText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    marginTop: 2,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  followingContext: {
    fontSize: 11,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.success,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  following: {
    backgroundColor: Colors.light.success,
    borderColor: Colors.light.success,
  },
  followButtonText: {
    fontSize: 11,
    fontWeight: Typography.weights.heavy as any,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
});

// Register the cohesive element
ComponentFactory.register(
  "Identity.Rep.Brief",
  ({ value, presentation, extraProps }) => (
    <IdentityRepBrief
      data={value}
      presentation={presentation}
      navigationService={extraProps?.navigationService}
    />
  ),
);
