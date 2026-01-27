import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { PulseLogoSignalRipple } from "@/components/ui/pulse-logo-signal-ripple";
import { Colors, GlobalStyles, Spacing } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { useTelemetry } from "@/hooks/use-telemetry";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

/**
 * Interaction.Sentiment.Slider
 * A high-fidelity "Quantum Feedback" slider for capturing sentiment on a spectrum.
 * Uses a monochromatic design language to distinguish from binary "Likes".
 */
export const SentimentSliderMolecule = ({ data, extraProps }: any) => {
  const { title, leftLabel = "OPPOSE", rightLabel = "SUPPORT" } = data || {};
  const { snapId, elementId } = extraProps || {};

  const { trackSentiment } = useTelemetry();
  const { sentimentRepository } = useServices();
  const translateX = useSharedValue(0);
  const sliderWidth = useSharedValue(0);
  const lastThreshold = useSharedValue(0.5);

  useEffect(() => {
    if (snapId && elementId && sliderWidth.value > 0) {
      sentimentRepository.getSentiment(snapId, elementId).then((saved: any) => {
        if (saved && typeof saved.value === "number") {
          translateX.value = saved.value * sliderWidth.value;
          lastThreshold.value = saved.value;
        }
      });
    }
  }, [snapId, elementId, sentimentRepository, sliderWidth.value]);

  const triggerHaptic = (type: Haptics.ImpactFeedbackStyle) => {
    Haptics.impactAsync(type);
  };

  const handleEnd = async (val: number) => {
    if (snapId && elementId) {
      await trackSentiment(snapId, elementId, val);
      await sentimentRepository.saveSentiment({
        snapId,
        elementId,
        value: val,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      "worklet";
      const rawX = Math.min(Math.max(event.x, 0), sliderWidth.value);
      // Quantum Snapping at 5% (0.05) increments to support 10-0-10 scale
      const quantum = sliderWidth.value * 0.05;
      const snappedX = Math.round(rawX / quantum) * quantum;
      translateX.value = snappedX;

      const sentiment = snappedX / sliderWidth.value;

      // Trigger haptic at every 5% interval cross
      const currentTick = Math.round(sentiment * 20);
      const lastTick = Math.round(lastThreshold.value * 20);

      if (currentTick !== lastTick) {
        lastThreshold.value = sentiment;
        if (currentTick === 10) {
          runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    })
    .onEnd(() => {
      "worklet";
      const sentiment = translateX.value / sliderWidth.value;

      // Capture telemetry & persist
      runOnJS(handleEnd)(sentiment);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - 12 }],
  }));

  const activeTrackStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <PulseLogoSignalRipple size={16} />
          {title && <ThemedText style={styles.title}>{title}</ThemedText>}
        </View>
      </View>

      <View style={styles.sliderControlContainer}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.sliderWrapper}>
            <View
              style={styles.track}
              onLayout={(e) => {
                sliderWidth.value = e.nativeEvent.layout.width;
                if (translateX.value === 0) {
                  translateX.value = e.nativeEvent.layout.width / 2;
                }
              }}
            >
              <Animated.View style={[styles.activeTrack, activeTrackStyle]} />

              {/* Visual Tickmarks at every 10% interval cross */}
              {[0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9].map((pos) => (
                <View
                  key={pos}
                  style={[styles.tickMark, { left: `${pos * 100}%` }]}
                />
              ))}

              <Animated.View style={[styles.thumb, thumbStyle]}>
                <View style={styles.thumbInner}>
                  <Ionicons
                    name="radio-button-on"
                    size={16}
                    color={Colors.light.primary}
                  />
                </View>
              </Animated.View>
            </View>
          </View>
        </GestureDetector>

        <View style={styles.labelRow}>
          <ThemedText style={styles.label}>{leftLabel}</ThemedText>
          <View style={styles.centerDot} />
          <ThemedText style={styles.label}>{rightLabel}</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.engagementZone,
  },
  headerRow: {
    marginBottom: Spacing.md,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    ...GlobalStyles.metricTitle,
    textAlign: "left",
    marginBottom: 0,
    fontSize: 13,
    color: Colors.light.textSlate,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sliderControlContainer: {
    paddingHorizontal: 0,
  },
  sliderWrapper: {
    height: 40,
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  track: {
    height: 4,
    backgroundColor: Colors.light.textMuted, // Standardized Slate 400
    borderRadius: 2,
    position: "relative",
    width: "100%",
  },
  activeTrack: {
    height: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
    position: "absolute",
    left: 0,
    top: 0,
  },
  tickMark: {
    position: "absolute",
    width: 2,
    height: 6,
    backgroundColor: Colors.light.textMuted, // Match track
    top: -1, // Center vertically on 4px track
    marginLeft: -1, // Center the 2px line
  },
  thumb: {
    position: "absolute",
    top: -10,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  thumbInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.textMuted,
    letterSpacing: 1,
  },
  centerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E0",
  },
});

ComponentFactory.register(
  "Interaction.Sentiment.Slider",
  ({ value, extraProps }) => (
    <SentimentSliderMolecule data={value} extraProps={extraProps} />
  ),
);
