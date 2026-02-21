import { StyleSheet, Text, type TextProps } from "react-native";

import { Typography } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "small"
    | "caption";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        { fontFamily: Typography.fonts?.sans },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "small" ? styles.small : undefined,
        type === "caption" ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.sizes.base,
    lineHeight: 20,
  },
  defaultSemiBold: {
    fontSize: Typography.sizes.base,
    lineHeight: 20,
    fontWeight: Typography.weights.semibold,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.medium,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    lineHeight: 24,
  },
  link: {
    lineHeight: 20,
    fontSize: Typography.sizes.base,
    color: "#164269",
  },
  small: {
    fontSize: Typography.sizes.sm,
    lineHeight: 16,
  },
  caption: {
    fontSize: Typography.sizes.xs,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
