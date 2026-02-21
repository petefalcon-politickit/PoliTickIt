import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Trust.Thread
 * A forensic provenance molecule for high-integrity data.
 * Supports a collapsible state to preserve vertical density in the feed.
 */
export const TrustThread = ({ value: data, presentation }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    referenceId,
    serialNumber,
    verificationLevel,
    oracleSource,
    auditDate,
  } = data || {};

  const attributes = presentation?.attributes || {};
  const fontSizeOffset = attributes.fontSizeOffset || 0;
  const preservePillbox = attributes.preservePillboxScale || false;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Dynamic Scale Calculator
  const getScaledSize = (
    base: number,
    ignoreOffset: boolean = false,
    adjustment: number = 0,
  ) => {
    return ignoreOffset ? base : base + fontSizeOffset + adjustment;
  };

  return (
    <View
      style={[
        styles.container,
        !isExpanded && { paddingBottom: 8, borderStyle: "solid" },
      ]}
    >
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={10} color="#059669" />
            <ThemedText
              style={[
                styles.badgeText,
                { fontSize: getScaledSize(10, preservePillbox) },
              ]}
            >
              {verificationLevel || "VERIFIED"}
            </ThemedText>
          </View>
          <View style={styles.serialGroup}>
            <ThemedText style={styles.trustLabel}>
              SECURE TRUST THREAD™
            </ThemedText>
            <ThemedText
              style={[
                styles.serialText,
                {
                  fontSize: getScaledSize(10, preservePillbox),
                  marginTop: -5,
                },
              ]}
            >
              {serialNumber || referenceId}
            </ThemedText>
          </View>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={14}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={styles.column}>
              <ThemedText
                style={[styles.label, { fontSize: getScaledSize(8, false, 0) }]}
              >
                ORACLE SOURCE
              </ThemedText>
              <ThemedText
                style={[
                  styles.value,
                  {
                    fontSize: getScaledSize(10, false, 0),
                    marginTop: -5,
                  },
                ]}
              >
                {oracleSource || "System"}
              </ThemedText>
            </View>
            <View style={styles.columnRight}>
              <ThemedText
                style={[
                  styles.label,
                  { fontSize: getScaledSize(8, false, 0), textAlign: "right" },
                ]}
              >
                AUDIT DATE
              </ThemedText>
              <ThemedText
                style={[
                  styles.value,
                  {
                    fontSize: getScaledSize(10, false, 0),
                    textAlign: "right",
                    marginTop: -5,
                  },
                ]}
              >
                {auditDate || "Recent"}
              </ThemedText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderStyle: "dashed",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2, // Extra vertical padding for larger touch target
    width: "100%",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serialGroup: {
    flexDirection: "column",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#10B981",
  },
  badgeText: {
    fontWeight: "700",
    color: "#059669",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  serialText: {
    fontFamily: Typography.fonts.mono,
    color: "#64748B", // Slate 500 for higher contrast (Forensic Standard)
    fontWeight: "500",
  },
  trustLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  content: {
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  column: {
    flexDirection: "column",
    flex: 2,
  },
  columnRight: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-end",
  },
  label: {
    fontWeight: "600",
    color: Colors.light.textTertiary,
    letterSpacing: 0.5,
  },
  value: {
    fontWeight: "500",
    color: Colors.light.textSecondary,
  },
});

ComponentFactory.register("Trust.Thread", TrustThread);
