import React from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { ThemedText } from "../themed-text";

interface SeveredTitleProps {
  title: string;
  subtitle?: string; // Optional explicit subtitle
  style?: TextStyle | TextStyle[];
  containerStyle?: ViewStyle;
  textAlign?: "left" | "center" | "right";
}

export const SeveredTitle: React.FC<SeveredTitleProps> = ({
  title,
  subtitle: explicitSubtitle,
  style,
  containerStyle,
  textAlign: forcedTextAlign,
}) => {
  const theme = useTheme();
  // Flatten style if it's an array
  const flatStyle = StyleSheet.flatten(style || {});
  const textAlign = forcedTextAlign || flatStyle.textAlign || "center";

  // Extract layout properties that should apply to the container View
  // instead of (or in addition to) the text elements when a subtitle exists.
  const containerFlex = flatStyle.flex;

  if (!title) return null;

  // Logic to split title if colon exists
  let primaryTitle = title;
  let derivedSubtitle = explicitSubtitle || "";

  if (!explicitSubtitle && title.includes(":")) {
    const parts = title.split(":");
    primaryTitle = parts[0].trim();
    derivedSubtitle = parts.slice(1).join(":").trim();
  }

  if (!derivedSubtitle) {
    return (
      <ThemedText
        style={[
          flatStyle,
          { textAlign, color: theme.palette.text } as TextStyle,
        ]}
      >
        {title}
      </ThemedText>
    );
  }

  // Calculate Subtitle Style (1 unit size smaller, 2 weights lighter)
  const baseFontSize = (flatStyle.fontSize as number) || 14;
  const baseFontWeight = flatStyle.fontWeight as string;

  // Font Size Mapping (N-1)
  const subtitleFontSize = baseFontSize - 1;

  // Font Weight Mapping (2 units lighter)
  // Mapping: heavy(800) -> semibold(600) -> regular(400)
  // bold(700) -> medium(500) -> regular(400)
  const weightsOrder = ["400", "500", "600", "700", "800"];
  const baseWeightIndex = weightsOrder.indexOf(baseFontWeight || "600");
  const subtitleWeightIndex = Math.max(0, baseWeightIndex - 2);
  const subtitleFontWeight = weightsOrder[subtitleWeightIndex];

  const subtitleStyle: TextStyle = {
    ...flatStyle,
    fontSize: subtitleFontSize,
    fontWeight: subtitleFontWeight as any,
    lineHeight: subtitleFontSize + 2,
    marginTop: 2,
    marginBottom: flatStyle.marginBottom, // Subtitle gets the margin
    flex: undefined, // Remove flex from text to avoid internal stretching
    textAlign,
    color: theme.palette.textSecondary,
    opacity: theme.visual_intensity, // Apply the visual intensity marker
  };

  const primaryStyle: TextStyle = {
    ...flatStyle,
    marginBottom: 0, // Primary part loses its bottom margin
    flex: undefined, // Remove flex from text to avoid internal stretching
    textAlign,
    color: theme.palette.text,
  };

  return (
    <View
      style={[
        styles.container,
        containerFlex !== undefined
          ? { flex: containerFlex, width: "auto" }
          : null,
        containerStyle,
      ]}
    >
      <ThemedText style={primaryStyle}>{primaryTitle}</ThemedText>
      <ThemedText style={subtitleStyle}>{derivedSubtitle}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
