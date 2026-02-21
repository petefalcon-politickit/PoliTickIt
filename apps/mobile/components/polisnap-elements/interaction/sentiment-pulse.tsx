import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Typography } from "@/constants/theme";
import { useServices } from "@/contexts/service-provider";
import { useTelemetry } from "@/hooks/use-telemetry";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ComponentFactory } from "../../factories/component-factory";
import { IconSymbol } from "../../ui/icon-symbol";
import { PulseLogoSignalRipple } from "../../ui/pulse-logo-signal-ripple";
import {
    SentimentOption,
    SentimentQuantumPicker,
} from "../../ui/sentiment-quantum-picker";

interface SentimentPulseProps {
  id: string;
  snapId?: string;
  data: {
    title?: string;
    agreeLabel?: string;
    disagreeLabel?: string;
    options?: SentimentOption[];
    stats?: {
      agree: number;
      disagree: number;
    };
  };
}

export const SentimentPulse: React.FC<SentimentPulseProps> = ({
  data,
  id,
  snapId,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rationalSentiment, setRationalSentiment] = useState<number | null>(
    null,
  );
  const { sentimentRepository, omniFeedProvider, forensicSignalCoordinator } =
    useServices();
  const { trackSentiment } = useTelemetry();

  const {
    title = "Constituent",
    agreeLabel = "Support",
    disagreeLabel = "Oppose",
  } = data;

  useEffect(() => {
    if (snapId && id) {
      sentimentRepository.getSentiment(snapId, id).then((saved: any) => {
        if (saved) setSelectedId(saved.value);
      });

      // Fetch ripple state for Rational Sentiment display
      forensicSignalCoordinator.getRipple(snapId).then((ripple) => {
        if (ripple?.rational_sentiment) {
          setRationalSentiment(ripple.rational_sentiment);
        }
      });
    }
  }, [snapId, id, sentimentRepository, forensicSignalCoordinator]);

  const handleSelect = async (opt: SentimentOption) => {
    // Check if we already have it selected (no double counting)
    const isFirstTime = !selectedId;
    setSelectedId(opt.id);

    if (snapId && id) {
      // Persist locally in legacy repository
      await sentimentRepository.saveSentiment({
        snapId,
        elementId: id,
        value: opt.id,
        timestamp: new Date().toISOString(),
      });

      // UPGRADE: Update Consensus Ripple with Rational Sentiment
      await forensicSignalCoordinator.emitSignal({
        type: "ripple",
        id: snapId,
        value: opt.id === "agree" ? 1.0 : opt.id === "disagree" ? -1.0 : 0.0,
        metadata: {
          district: "TX-35",
          state:
            opt.id === "agree"
              ? "Support"
              : opt.id === "disagree"
                ? "Oppose"
                : "Neutral",
        },
      });

      // Refresh local RS display
      const newRipple = await forensicSignalCoordinator.getRipple(snapId);
      if (newRipple) setRationalSentiment(newRipple.rational_sentiment || null);

      // Track telemetry
      await trackSentiment(
        snapId,
        id,
        opt.sentiment === "positive"
          ? 1.0
          : opt.sentiment === "neutral"
            ? 0.5
            : 0.0,
      );

      // Reward participation if first time for this pulse
      if (isFirstTime) {
        await forensicSignalCoordinator.emitSignal({
          type: "pulse",
          id: snapId,
        });
      }
    }
  };

  // Default to a 3-choice quantum state if no specific options provided
  const pulseOptions: SentimentOption[] = data.options || [
    { id: "disagree", label: disagreeLabel, sentiment: "negative" },
    { id: "neutral", label: "Neutral", sentiment: "neutral" },
    { id: "agree", label: agreeLabel, sentiment: "positive" },
  ];

  // Ensure "Pulse" is not in the title if it's default or custom
  const cleanTitle = title.replace(/\s*[Pp]ulse\s*/g, " ").trim();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <PulseLogoSignalRipple size={16} />
          {cleanTitle && (
            <SeveredTitle
              title={cleanTitle}
              style={styles.pulseTitle}
              textAlign="left"
              containerStyle={{ flex: 1, marginLeft: 8 }}
            />
          )}
        </View>
      </View>

      <View style={styles.pulseContent}>
        <SentimentQuantumPicker
          options={pulseOptions}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {selectedId && (
          <View style={styles.statsRow}>
            {rationalSentiment !== null && (
              <View style={styles.rsBadge}>
                <ThemedText style={styles.rsText}>
                  RS: {rationalSentiment > 0 ? "+" : ""}
                  {rationalSentiment}
                </ThemedText>
              </View>
            )}
            <IconSymbol
              name="chart.pie.fill"
              size={12}
              color={Colors.light.icon}
            />
            <ThemedText style={styles.statsText}>
              <ThemedText style={styles.percentageValue}>
                {data.stats
                  ? Math.round(
                      (data.stats.agree /
                        (data.stats.agree + data.stats.disagree)) *
                        100,
                    )
                  : 85}
                %
              </ThemedText>{" "}
              COMMUNITY AGREEMENT
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

// Registration
ComponentFactory.register(
  "Interaction.Sentiment.Pulse",
  ({ value, extraProps }) => {
    const normalizedValue = {
      ...value,
      options: value.options?.map((opt: any) => ({
        ...opt,
        label: opt.label?.toUpperCase(),
      })),
    };
    return (
      <SentimentPulse
        data={normalizedValue}
        id={extraProps?.elementId || value.id}
        snapId={extraProps?.snapId}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.engagementZone,
  },
  headerRow: {
    paddingHorizontal: 0, // Parent snapContent provides the 16pt padding
    marginBottom: 15, // Grid synchronization standard
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
  },
  pulseTitle: {
    ...GlobalStyles.pulseTitle,
    marginBottom: 0, // Override global margin to allow alignment with icon
  },
  pulseContent: {
    paddingHorizontal: 0, // Parent snapContent provides the 16pt padding
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8, // Reduced from 12 to balance bottom padding
    alignSelf: "flex-start",
    gap: 6,
  },
  statsText: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.textSecondary,
    fontWeight: Typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  percentageValue: {
    fontSize: Typography.sizes.base,
    color: Colors.light.primary,
  },
  rsBadge: {
    backgroundColor: Colors.light.primary + "15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.primary + "30",
  },
  rsText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.primary,
  },
});
