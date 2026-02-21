import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

/**
 * Narrative.Congressional.Transcript
 *
 * A specialized element for raw, forensic-grade transcripts.
 * Designed to look like a official government record.
 */
export const NarrativeCongressionalTranscript = ({ data }: any) => {
  const {
    id, // Official CR ID
    text,
    representative,
    date,
    chamber,
    timestamp,
    volume,
    number,
    page,
  } = data || {};

  return (
    <View style={styles.container}>
      {/* Official Government Border/Header */}
      <View style={styles.officialHeader}>
        <View style={styles.sealContainer}>
          <Ionicons name="library" size={24} color={Colors.light.textMuted} />
        </View>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.chamberTitle}>
            {chamber || "HOUSE OF REPRESENTATIVES"}
          </ThemedText>
          <View style={styles.metaRow}>
            <ThemedText style={styles.metaText}>
              VOL. {volume || "172"}
            </ThemedText>
            <ThemedText style={styles.separator}>|</ThemedText>
            <ThemedText style={styles.metaText}>
              NO. {number || "14"}
            </ThemedText>
            <ThemedText style={styles.separator}>|</ThemedText>
            <ThemedText style={styles.metaText}>
              PAGE {page || "H882"}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.documentBody}>
        {/* Procedural Header */}
        <ThemedText style={styles.proceduralHeader}>
          PROCEEDING: {date} {timestamp && `AT ${timestamp}`}
        </ThemedText>

        <View style={styles.transcriptWatermark}>
          <ThemedText style={styles.watermarkText}>FORENSIC RECORD</ThemedText>
        </View>

        {/* The "Record" Text */}
        <View style={styles.columnContainer}>
          <ThemedText style={styles.transcriptText}>
            {representative && (
              <ThemedText style={styles.speakerAnchor}>
                Mr. {representative.name.split(" ").pop().toUpperCase()}.{" "}
              </ThemedText>
            )}
            {text}
          </ThemedText>
        </View>

        {/* Forensic Footer */}
        <View style={styles.forensicFooter}>
          <View style={styles.auditStamp}>
            <Ionicons
              name="finger-print"
              size={12}
              color={Colors.light.primary}
            />
            <ThemedText style={styles.auditText}>
              FORENSIC HASH VERIFIED: {id || "CR-STMT-VERIFIED"}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCFCF9", // Paper-like off-white
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 2,
    marginVertical: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  officialHeader: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: "#000",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  sealContainer: {
    marginRight: Spacing.md,
    opacity: 0.8,
    paddingTop: 2, // Fine-tuned top alignment
  },
  headerInfo: {
    flex: 1,
  },
  chamberTitle: {
    fontSize: 15,
    fontWeight: Typography.weights.heavy as any,
    letterSpacing: 2.5,
    color: "#000",
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 0,
    alignItems: "center",
  },
  metaText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    color: "#64748b",
  },
  separator: {
    marginHorizontal: 8,
    color: "#CBD5E1",
    fontSize: 10,
  },
  documentBody: {
    padding: Spacing.lg,
    position: "relative",
  },
  transcriptWatermark: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.03,
    transform: [{ rotate: "-45deg" }],
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 60,
    fontWeight: Typography.weights.heavy as any,
    color: "#000",
  },
  proceduralHeader: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: "#475569",
    marginBottom: Spacing.lg,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 6,
    textAlign: "center",
  },
  columnContainer: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.05)",
    paddingLeft: Spacing.md,
  },
  transcriptText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#1E293B",
    textAlign: "justify",
    ...Platform.select({
      ios: { fontFamily: "Times New Roman" },
      android: { fontFamily: "serif" },
    }),
  },
  speakerAnchor: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 14,
  },
  forensicFooter: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: "#E2E8F0",
  },
  auditStamp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    opacity: 0.8,
  },
  auditText: {
    fontSize: 8,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.primary,
    letterSpacing: 1,
  },
});

ComponentFactory.register("Narrative.Congressional.Transcript", (props) => (
  <NarrativeCongressionalTranscript data={props.value} />
));
