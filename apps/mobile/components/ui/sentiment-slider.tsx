import { Colors } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { IconSymbol } from "./icon-symbol";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDER_WIDTH = SCREEN_WIDTH - 80;
const TOUCH_TARGET_SIZE = 48;
const VISUAL_THUMB_SIZE = 8;

interface SentimentSliderProps {
  onValueChange: (value: number) => void;
  initialValue?: number;
}

export const SentimentSlider: React.FC<SentimentSliderProps> = ({
  onValueChange,
  initialValue = 0,
}) => {
  const translateX = useSharedValue(initialValue * (SLIDER_WIDTH / 2));
  const context = useSharedValue(0);
  const lastThreshold = useSharedValue(0);

  const triggerHapticIfThreshold = (val: number) => {
    const rounded = Math.round(val * 4) / 4; // 0.25 steps
    if (rounded !== lastThreshold.value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastThreshold.value = rounded;
    }
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateX.value;
    })
    .onUpdate((event) => {
      let nextX = context.value + event.translationX;
      nextX = Math.max(-SLIDER_WIDTH / 2, Math.min(SLIDER_WIDTH / 2, nextX));
      translateX.value = nextX;

      const val = nextX / (SLIDER_WIDTH / 2);
      runOnJS(triggerHapticIfThreshold)(val);
    })
    .onEnd(() => {
      const finalVal = translateX.value / (SLIDER_WIDTH / 2);
      runOnJS(onValueChange)(finalVal);
    });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [-SLIDER_WIDTH / 2, 0, SLIDER_WIDTH / 2],
        [Colors.light.error, "#AAA", Colors.light.success],
      ),
    };
  });

  const animatedTrackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [-SLIDER_WIDTH / 2, 0, SLIDER_WIDTH / 2],
        [
          "rgba(211, 47, 47, 0.25)",
          "rgba(0,0,0,0.05)",
          "rgba(56, 142, 60, 0.25)",
        ],
      ),
    };
  });

  const animatedNegativeIcon = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SLIDER_WIDTH / 2, 0, SLIDER_WIDTH / 2],
      [0.8, 0.2, 0.1],
    );

    return {
      opacity,
      transform: [
        {
          scale: interpolate(
            translateX.value,
            [-SLIDER_WIDTH / 2, 0],
            [1.2, 1],
            "clamp",
          ),
        },
      ],
    };
  });

  const animatedPositiveIcon = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SLIDER_WIDTH / 2, 0, SLIDER_WIDTH / 2],
      [0.1, 0.2, 0.8],
    );

    return {
      opacity,
      transform: [
        {
          scale: interpolate(
            translateX.value,
            [0, SLIDER_WIDTH / 2],
            [1, 1.2],
            "clamp",
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.sliderLayout}>
        <Animated.View style={[styles.iconContainer, animatedNegativeIcon]}>
          <IconSymbol
            name="minus.circle.fill"
            size={14}
            color={Colors.light.error}
          />
        </Animated.View>

        <View style={styles.trackContainer}>
          <Animated.View style={[styles.track, animatedTrackStyle]} />
          <View style={styles.neutralNotch} />

          <View style={styles.thumbWrapper}>
            <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.hitArea, animatedHandleStyle]}>
                <Animated.View style={[styles.thumb, animatedThumbStyle]} />
              </Animated.View>
            </GestureDetector>
          </View>
        </View>

        <Animated.View style={[styles.iconContainer, animatedPositiveIcon]}>
          <IconSymbol
            name="plus.circle.fill"
            size={14}
            color={Colors.light.success}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
  },
  sliderLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  trackContainer: {
    width: SLIDER_WIDTH - 72,
    height: 1,
    justifyContent: "center",
  },
  track: {
    width: "100%",
    height: 1,
  },
  neutralNotch: {
    position: "absolute",
    left: "50%",
    width: 1,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginLeft: -0.5,
  },
  thumbWrapper: {
    position: "absolute",
    width: "100%",
    height: TOUCH_TARGET_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  hitArea: {
    width: TOUCH_TARGET_SIZE,
    height: TOUCH_TARGET_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  thumb: {
    width: VISUAL_THUMB_SIZE,
    height: VISUAL_THUMB_SIZE,
    borderRadius: VISUAL_THUMB_SIZE / 2,
    borderWidth: 1,
    borderColor: "#FFF",
  },
});
