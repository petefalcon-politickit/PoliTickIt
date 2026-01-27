import { ThemedText } from "@/components/themed-text";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
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
  const { sentimentRepository } = useServices();
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
    }
  }, [snapId, id, sentimentRepository]);

  const handleSelect = async (opt: SentimentOption) => {
    setSelectedId(opt.id);

    if (snapId && id) {
      // Persist locally
      await sentimentRepository.saveSentiment({
        snapId,
        elementId: id,
        value: opt.id,
        timestamp: new Date().toISOString(),
      });

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
            <ThemedText style={styles.pulseTitle}>{cleanTitle}</ThemedText>
          )}
        </View>
      </View>

      <View style={styles.pulseContent}>
        <SentimentQuantumPicker
          options={pulseOptions}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {selectedId && data.stats && (
          <View style={styles.statsRow}>
            <IconSymbol name="chart.pie.fill" size={16} color="#4A5568" />
            <ThemedText style={styles.statsText}>
              <ThemedText style={styles.percentageValue}>
                {Math.round(
                  (data.stats.agree /
                    (data.stats.agree + data.stats.disagree)) *
                    100,
                )}
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
    marginBottom: Spacing.sm,
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
});
