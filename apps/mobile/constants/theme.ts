/**
 * PoliTickIt Design System
 * Consistent colors, typography, and spacing across the app
 */

import { Platform } from "react-native";

// ============================================================================
// COLORS - Light Mode (Primary)
// ============================================================================
const Colors = {
  light: {
    // Backgrounds
    background: "#F8FAFC", // Solid Slate 50 for predictable grid contrast
    backgroundSecondary: "#FFFFFF", // White for cards and interactive surfaces
    backgroundTertiary: "#FFFFFF", // Unified with white surfaces

    // Branding & Accents
    primary: "#164570", // Deep Navy Blue
    secondary: "#2271ba", // Light Blue
    subtleSecondaryTint: "rgba(34, 113, 186, 0.08)", // Light Blue Tint for headers/data separation
    subtleAccentTint: "rgba(225, 29, 72, 0.02)", // Light Rose Tint for Pulse metrics
    subtleVisualTint: "rgba(34, 113, 186, 0.02)", // Even lighter blue for charts/visuals
    subtleRippleTint: "#f88ca302", // Subtle accent tint for Pulse interactions (2% Opacity)
    backgroundSubtle: "#F1F5F9", // Slate 100 for background contrast
    accent: "#E11D48", // Rose Crimson requested

    // Text
    text: "#0F172A", // Slate 900 (High contrast)
    textSlate: "#4A5568", // Deep Gray/Slate (Alias)
    textGray: "#718096", // Body Text Gray (Alias)
    textSecondary: "#475569", // Slate 600
    textTertiary: "#64748B", // Slate 500
    textMuted: "#94A3B8", // Slate 400 (All-caps/Meta)
    textPlaceholder: "#CBD5E1",

    // UI Elements
    border: "#CBD5E1", // Darkened for contrast on tinted backgrounds
    separator: "#E2E8F0", // Higher visibility horizontal lines
    divider: "rgba(34, 113, 186, 0.3)", // Brand Light Blue at 30%
    icon: "#4A5568",
    overlay: "rgba(0, 0, 0, 0.3)", // Subtle gray overlay

    // Status Colors (Dulled for high-density professional baseline)
    success: "#38A169", // Dulled Green (Chakra Green 600)
    successSubtle: "#C6F6D5",
    warning: "#D69E2E", // Dulled Orange (Chakra Yellow 600)
    warningSubtle: "#FEEBC8",
    error: "#C53030", // Dulled Red (Chakra Red 600)
    info: "#2C5282", // Dulled Blue (Chakra Blue 800)
    intelligence: "#6B46C1", // Purple for AI/ML features
    intelligenceSubtle: "rgba(107, 70, 193, 0.1)", // Alpha for backgrounds/borders
    intelligenceDeep: "#44337A", // Deep Purple for headers
    intelligenceMedium: "#553C9A", // Medium Purple for values

    // Legacy support
    tint: "#164570",
    tabIconDefault: "#718096",
    tabIconSelected: "#164570",
  },
  dark: {
    // Backgrounds
    background: "#151718",
    backgroundSecondary: "#1F2023",

    // Branding & Accents
    primary: "#4DA3FF",
    secondary: "#79B6F2",
    subtleSecondaryTint: "#79B6F218", // White for cards and interactive surfaces
    subtleRippleTint: "#EF63740D", // Subtle accent tint for Pulse interactions (5% Opacity)
    accent: "#EF6374",

    // Text
    text: "#ECEDEE",
    textSecondary: "#A0AEC0",
    textTertiary: "#718096",
    textMuted: "#8E8E93",
    textPlaceholder: "#4A5568",

    // UI Elements
    border: "#3A3A3C",
    separator: "#1F2023",
    icon: "#9BA1A6",
    overlay: "rgba(0, 0, 0, 0.5)", // Slightly deeper gray for dark mode contrast

    // Status Colors
    success: "#34C759",
    warning: "#FF9500",
    error: "#EF6374",
    info: "#4DA3FF",

    // Legacy support
    tint: "#fff",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================
const Typography = {
  // Font families
  fonts: Platform.select({
    ios: {
      sans: "System",
      serif: "ui-serif",
      rounded: "ui-rounded",
      mono: "ui-monospace",
    },
    default: {
      sans: "normal",
      serif: "serif",
      rounded: "normal",
      mono: "monospace",
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded:
        "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),

  // Font sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
  },

  // Font weights
  weights: {
    regular: "400" as any,
    medium: "500" as any,
    semibold: "600" as any,
    bold: "700" as any,
    heavy: "800" as any,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: "700" as any,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as any,
  },
  h3: {
    fontSize: 18,
    fontWeight: "700" as any,
  },
};

// ============================================================================
// SPACING
// ============================================================================
const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================
const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ============================================================================
// SHADOWS
// ============================================================================
const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
};

/**
 * Common layout patterns
 */
const PulseGlobalStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  center: {
    justifyContent: "center" as any,
    alignItems: "center" as any,
  },
  rowBetween: {
    flexDirection: "row" as any,
    justifyContent: "space-between" as any,
    alignItems: "center" as any,
  },
  row: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  // High-Density minimalist patterns
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  flatSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  // Top-Level Assembly Containers
  pulseContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    marginBottom: 1,
  },
  pulseProContainer: {
    backgroundColor: "rgba(225, 29, 72, 0.02)",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    borderColor: Colors.light.border,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md + 5,
    marginBottom: 1,
  },
  snapCard: {
    // SEVERED from pulseProContainer
    backgroundColor: Colors.light.backgroundSecondary,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    borderColor: Colors.light.border,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: 15,
    marginBottom: 1,
  },
  snapFooter: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs, // Reduced padding since the line is gone
    flexDirection: "row" as any,
    alignItems: "center" as any,
    gap: 6,
  },
  engagementZone: {
    backgroundColor: Colors.light.subtleAccentTint, // Light Rose Tint for interaction area
    padding: Spacing.md,
    borderWidth: 1, // Standard Pulse full border
    borderColor: Colors.light.border,
    marginVertical: 0, // Adheres to Zero-Margin Policy
  },
  contentSection: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7, // Reduced from Spacing.md (12) by 5px
  },
  filterBar: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  cardLabel: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase" as any,
    color: Colors.light.textGray,
    textAlign: "center" as any,
  },
  tagPill: {
    paddingHorizontal: Spacing.sm,
    paddingTop: 4,
    paddingBottom: 3,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border, // Standardized Pulse border color
    backgroundColor: "transparent" as any,
  },
  tagText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  // --- Drill-Down Continuum patterns ---
  continuumFooter: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    justifyContent: "space-between" as any,
    backgroundColor: "rgba(34, 113, 186, 0.05)",
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: 15, // Standardized 15px Vertical Track
  },
  continuumLabel: {
    fontSize: 12, // Standardized for CTAs
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase" as any,
    includeFontPadding: false,
  },
  continuumSubtext: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    lineHeight: 14,
    marginTop: 2,
  },
  screenGutter: {
    height: 8,
    backgroundColor: "#F1F5F9", // Solid Slate 100 for visual separation
  },
  metricTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 15,
    textAlign: "left" as any,
    textTransform: "uppercase" as any,
  },
  // Element-Level Molecular Containers (One global source for separate evolution)
  metricContainer: {
    backgroundColor: Colors.light.backgroundSecondary, // SEVERED: Solid white for mechanical clarity
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0, // Adheres to Zero-Margin Policy
  },
  statusGridContainer: {
    backgroundColor: Colors.light.backgroundSecondary, // Solid white
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  aggregatePulseContainer: {
    backgroundColor: "rgba(225, 29, 72, 0.08)", // Bumped to 8% for visibility
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  dataTableContainer: {
    backgroundColor: "#F8FAFC", // Slate 50
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.lg, // Deeper bottom padding for tables
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  dataTableHeader: {
    flexDirection: "row" as any,
    backgroundColor: "#F1F5F9", // Slate 100
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1", // Slate 300 for contrast
  },
  visualContainer: {
    backgroundColor: "rgba(34, 113, 186, 0.08)", // Bumped to 8% for visibility
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  barChartContainer: {
    backgroundColor: "rgba(34, 113, 186, 0.08)", // Match visual container background
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  sentimentTrendContainer: {
    backgroundColor: "rgba(34, 113, 186, 0.06)", // Reduced from 0.08 (~20% reduction)
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  metricGroupContainer: {
    backgroundColor: "#F2F2F2", // 5% Gray
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  groupedGridContainer: {
    backgroundColor: "#FAFAFA", // 2% Gray
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  gaugeContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.sm, // Reduced from Spacing.md for tighter Sentinel layout
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  stepperContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  dualComparisonContainer: {
    backgroundColor: "#F2F2F2", // 5% Gray (Synced with Metric Group)
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  narrativeContainer: {
    backgroundColor: "transparent" as any, // Often nested or uses accent bar
    paddingVertical: 0, // Adheres to Zero-Margin Policy
    marginVertical: 0,
  },
  interactionContainer: {
    backgroundColor: Colors.light.subtleAccentTint, // Unified with aggregate pulse for now
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  predictiveScoringContainer: {
    backgroundColor: "rgba(128, 90, 213, 0.05)", // 5% Purple Tint for Intelligence
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: 2, // Tightened per request
    borderWidth: 1,
    borderColor: "rgba(128, 90, 213, 0.2)",
    marginVertical: 0,
  },
  predictiveForecastingOddsValue: {
    fontSize: 42,
    fontWeight: Typography.weights.heavy as any,
    color: "#6B46C1", // Deep Purple
    letterSpacing: -1,
    lineHeight: 48, // Ensuring no cut-off
  },
  predictiveForecastingOddsLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
    marginBottom: -6, // Tighter to the value
  },
  predictiveForecastingRipple: {
    position: "absolute" as any,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: "#6B46C1",
  },
  predictiveForecastingMomentumLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
    marginBottom: -6, // Synced with Odds Label
  },
  predictiveForecastingMomentumValue: {
    fontSize: 16,
    fontWeight: Typography.weights.heavy as any,
    letterSpacing: 0.5,
  },
  consensusRippleContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  consensusRippleTitle: {
    fontSize: 14,
    fontWeight: Typography.weights.medium as any,
    color: Colors.light.primary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  consensusRippleMetricLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.regular as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
  },
  consensusRippleMetricValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.medium as any,
    color: Colors.light.text,
  },
  congressionalRecordContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingTop: 16,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderLeftWidth: 4,
    borderLeftColor: "#164570", // Colors.light.primary
    borderRadius: 4,
    marginVertical: 0,
  },
  congressionalDebateContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingTop: 16,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  weeklySummaryContainer: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  attendanceContainer: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  achievementContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  localPreferenceContainer: {
    backgroundColor: "rgba(56, 161, 105, 0.05)", // 5% Green Tint for Local/Community
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(56, 161, 105, 0.2)",
    marginVertical: 0,
  },
  fecHeatmapContainer: {
    backgroundColor: Colors.light.backgroundSecondary, // SEVERED: Solid surface
    paddingHorizontal: Spacing.md,
    paddingTop: 15, // Standardized 15px Vertical Track
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  fecHeatmapTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.heavy as any,
    letterSpacing: 0.5,
    textTransform: "uppercase" as any,
    color: Colors.light.text,
  },
  fecHeatmapMetricLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 1,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  fecHeatmapValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.primary,
  },
  fecHeatmapRow: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  fecHeatmapIndustryText: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.light.textSecondary,
  },
  fecHeatmapAmountText: {
    fontSize: 12,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
  },
  fecHeatmapBarTrack: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    overflow: "hidden" as any,
  },
  corruptionIndexContainer: {
    backgroundColor: "rgba(230, 102, 102, 0.01)", // Reduced to 2% Red/Crimson Tint for Accountability/Warning (Matches user intent for lower intensity)
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(229, 62, 62, 0.1)", // Also softening the border
    marginVertical: 0,
  },
  corruptionIndexMetaText: {
    fontSize: 13, // SM (12) + 1
    fontWeight: Typography.weights.medium as any,
    color: Colors.light.textSecondary,
  },
  corruptionIndexIndustryText: {
    fontSize: 11, // XS (10) + 1
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    marginTop: 1,
    letterSpacing: 0.3,
  },
  corruptionIndexInsightTitle: {
    fontSize: 11, // 10 + 1
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase" as any,
  },
  corruptionIndexInsightText: {
    fontSize: 13, // SM (12) + 1
    lineHeight: 18,
    color: Colors.light.text,
    fontStyle: "italic" as any,
  },
  corruptionIndexConfidenceLabel: {
    fontSize: 9, // Reduced 2 units
    color: Colors.light.textMuted,
    includeFontPadding: false,
    marginTop: -8, // Pull up closer to the value
  },
  corruptionIndexConfidenceValue: {
    fontSize: 9, // Reduced 2 units
    fontWeight: Typography.weights.medium as any, // Reduced from bold
    color: Colors.light.textSecondary,
    includeFontPadding: false,
  },
  // --- ACCOUNTABILITY SCORECARD (COLLECTIVE) ---
  scorecardGradeCircle: {
    width: 34, // ~25% smaller than the previous 44px
    height: 34,
    borderRadius: 4, // Mechanical square-ish look
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5, // Request: 5px padding above score badge
  },
  scorecardGradeText: {
    fontSize: 16, // Adjusted for smaller badge
    fontWeight: Typography.weights.heavy as any,
    color: "#FFFFFF", // Request: solid fill white text
    includeFontPadding: false,
  },
  scorecardMetricLabel: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  scorecardMetricValue: {
    fontSize: 18,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
  },
  scorecardAlignmentTrack: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden" as any,
    marginTop: 8,
  },
  scorecardAlignmentFill: {
    height: "100%",
    borderRadius: 3,
  },
  scorecardSentimentRow: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    justifyContent: "space-between" as any,
    marginTop: 4,
  },
  scorecardCorrelationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // Legacy Aliases
  metricCard: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  pulseCard: {
    backgroundColor: Colors.light.subtleAccentTint,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  dataCard: {
    backgroundColor: Colors.light.subtleSecondaryTint,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  visualCard: {
    backgroundColor: Colors.light.subtleVisualTint,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  metricCardTitle: {
    fontSize: 13, // Standardized 13pt for high-density mechanical look
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold to avoid Snap Title competition
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // SYNCED with dualComparisonTitle for Severed Grid consistency
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  metricCardTitleLeft: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // SYNCED with dualComparisonTitle for Severed Grid consistency
    textAlign: "left" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  pulseTitle: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // SYNCED with dualComparisonTitle for Severed Grid consistency
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
    // paddingHorizontal removed for Grid consistency
  },
  pulseProTitle: {
    fontSize: 14,
    fontWeight: Typography.weights.heavy as any,
    lineHeight: 16,
    color: Colors.light.text,
    marginBottom: 15, // Grid synchronization standard
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 1.2,
    // paddingHorizontal removed for Grid consistency
  },
  snapTitle: {
    fontSize: 14,
    fontWeight: Typography.weights.heavy as any,
    lineHeight: 16,
    color: Colors.light.text,
    marginBottom: 15, // Unified Institutional Track
    textAlign: "left" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  metricGroupTitle: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // SYNCED with dualComparisonTitle for Severed Grid consistency
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  groupedGridTitle: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // SYNCED with dualComparisonTitle for Severed Grid consistency
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  aggregatePulseTitle: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // SYNCED with dualComparisonTitle for Severed Grid consistency
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  gaugeTitle: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // Grid synchronization standard
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  stepperTitle: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // Grid synchronization standard
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  dualComparisonTitle: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold as any, // REDUCED from bold
    lineHeight: 14,
    color: Colors.light.text,
    marginBottom: 15, // Increased by 8px per user request for Action Timeline spacing
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  metricCardSectionTitle: {
    fontSize: 11, // Subordinate to primary card title
    fontWeight: Typography.weights.heavy as any, // Ultra-bold for categorical clarity
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
  },
  metricLabel: {
    fontSize: 11, // High-density mechanical size
    fontWeight: Typography.weights.bold as any, // Full Bold
    color: Colors.light.textTertiary,
    textAlign: "center" as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
    lineHeight: 12, // ~110% line height
    marginBottom: 6, // Vertical padding between title and value
  },
  metricValue: {
    fontSize: 15, // Slightly reduced for high density, but prominent
    fontWeight: Typography.weights.semibold as any, // Semibold for data prominence
    lineHeight: 17,
    color: Colors.light.text,
    textAlign: "center" as any,
  },
  metricSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textMuted,
    lineHeight: 13,
    textAlign: "center" as any,
    marginTop: 2,
  },
  // Mechanical Buttons
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    borderRadius: 4, // Higher mechanical density
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: "center" as any,
    justifyContent: "center" as any,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: Typography.weights.heavy as any,
    textTransform: "uppercase" as any,
    letterSpacing: 1.2,
  },
  secondaryButton: {
    backgroundColor: "transparent" as any,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    borderRadius: 4,
    borderWidth: 1.5, // Stronger mechanical border
    borderColor: Colors.light.primary,
    alignItems: "center" as any,
    justifyContent: "center" as any,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: Typography.weights.heavy as any,
    textTransform: "uppercase" as any,
    letterSpacing: 1.2,
  },
  shadowSmall: Shadows.small,
  shadowMedium: Shadows.medium,
};

const Fonts = Typography.fonts;

export {
    BorderRadius,
    Colors,
    Fonts,
    PulseGlobalStyles as GlobalStyles,
    Shadows,
    Spacing,
    Typography
};

// ============================================================================
// LEGACY EXPORTS (For backward compatibility)
// ============================================================================
