import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { PulseLogoSignalRipple } from "@/components/ui/pulse-logo-signal-ripple";
import { Colors, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { useTelemetry } from "@/hooks/use-telemetry";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Interaction.Action.Card
 * A clean, monochromatic action card for 'Pro' features like Watchlist or Contact.
 * Uses the Zero-margin policy.
 */
export const ActionCardMolecule = ({ data, extraProps }: any) => {
  const { title, label, actionType, actionPayload, publisherImage } =
    data || {};
  const { snapId } = extraProps || {};

  const { trackAction } = useTelemetry();
  const { watchlistService, navigationService } = useServices();
  const [isWatched, setIsWatched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isPro = label?.toLowerCase().includes("pro");
  const isWatchlistAction = actionType === "watchlist";

  useEffect(() => {
    if (isWatchlistAction && snapId) {
      watchlistService.isWatched(snapId).then(setIsWatched);
    }
  }, [isWatchlistAction, snapId, watchlistService]);

  const triggerSuccessAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = async () => {
    triggerSuccessAnimation();

    // Capture telemetry
    if (snapId && actionType) {
      trackAction(snapId, actionType, actionPayload);
    }

    if (isWatchlistAction && snapId) {
      if (isWatched) {
        await watchlistService.removeFromWatchlist(snapId);
        setIsWatched(false);
      } else {
        await watchlistService.addToWatchlist(snapId);
        setIsWatched(true);
      }
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 2000);

    if (!navigationService) return;

    switch (actionType) {
      case "contact":
        navigationService.navigateToContact(actionPayload);
        break;
      default:
        console.log("Action triggered:", actionType, actionPayload);
    }
  };

  const displayTitle =
    isWatchlistAction && snapId
      ? isWatched
        ? "Remove from Watchlist"
        : "Add to Watchlist"
      : isSubmitted
        ? "Action Confirmed"
        : title || "Action";

  return (
    <Animated.View
      style={[styles.outerContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {publisherImage && (
          <Image
            source={{ uri: publisherImage }}
            style={styles.publisherImage}
            contentFit="cover"
          />
        )}
        <View style={styles.content}>
          <View style={styles.labelWrapper}>
            {isPro && (
              <PulseLogoSignalRipple size={14} color={Colors.light.primary} />
            )}
            <ThemedText
              style={[styles.label, isPro && { color: Colors.light.primary }]}
            >
              {isPro ? "PULSE PRO" : label || "ACTION"}
            </ThemedText>
          </View>
          <ThemedText style={styles.title}>{displayTitle}</ThemedText>
        </View>
        <Ionicons
          name={
            isWatchlistAction && isWatched
              ? "bookmark"
              : isSubmitted
                ? "checkmark-circle"
                : "chevron-forward"
          }
          size={18}
          color={
            (isWatchlistAction && isWatched) || isSubmitted
              ? Colors.light.primary
              : Colors.light.textPlaceholder
          }
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    // Zero-margin Policy: Vertical space is managed by the sequence container
  },
  container: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    backgroundColor: Colors.light.subtleRippleTint, // Interaction tint
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.md,
    borderRadius: 4, // Mechanical consistency
  },
  publisherImage: {
    width: 44,
    height: 44,
    borderRadius: 4, // Mechanical consistency
    marginRight: Spacing.md,
    backgroundColor: "#F1F5F9",
  },
  content: {
    flex: 1,
  },
  labelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.light.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.primary,
  },
});

ComponentFactory.register(
  "Interaction.Action.Card",
  ({ value, extraProps }) => (
    <ActionCardMolecule data={value} extraProps={extraProps} />
  ),
);
