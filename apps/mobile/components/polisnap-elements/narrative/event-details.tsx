import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

/**
 * Narrative.Event.Details
 * A structured molecule for community events and volunteer opportunities.
 * Adheres to the 15px vertical rhythm and zero-margin policy.
 */
export const NarrativeEventDetails = ({ data }: any) => {
  const { title, date, time, location, requirements } = data || {};

  const handleOpenMaps = () => {
    if (!location) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(location)}`,
      android: `geo:0,0?q=${encodeURIComponent(location)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
    });
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerArea}>
          <ThemedText style={styles.eventLabel}>EVENT</ThemedText>
          <ThemedText style={styles.eventTitle}>{title}</ThemedText>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailGrid}>
          <View style={styles.detailRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={Colors.light.textTertiary}
            />
            <View style={styles.detailTextContainer}>
              <ThemedText style={styles.label}>Date</ThemedText>
              <ThemedText style={styles.value}>{date}</ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={Colors.light.textTertiary}
            />
            <View style={styles.detailTextContainer}>
              <ThemedText style={styles.label}>Time</ThemedText>
              <ThemedText style={styles.value}>{time}</ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.detailRow}
            onPress={handleOpenMaps}
            activeOpacity={0.7}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={Colors.light.primary}
            />
            <View style={styles.detailTextContainer}>
              <ThemedText
                style={[styles.label, { color: Colors.light.primary }]}
              >
                Location
              </ThemedText>
              <ThemedText style={styles.value} numberOfLines={2}>
                {location}
              </ThemedText>
            </View>
          </TouchableOpacity>

          {requirements && (
            <View style={styles.requirementsBox}>
              <View style={styles.reqHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color={Colors.light.textTertiary}
                />
                <ThemedText style={styles.reqHeaderText}>
                  Requirements
                </ThemedText>
              </View>
              <ThemedText style={styles.reqText}>{requirements}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  card: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 4, // Mechanical Styling
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 0,
  },
  headerArea: {
    marginBottom: 12,
  },
  eventLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 13, // Standard Card Title Scaling
    fontWeight: "600",
    color: Colors.light.text,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 16,
    opacity: 0.6,
  },
  detailGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  requirementsBox: {
    marginTop: 4,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  reqHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  reqHeaderText: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.light.textTertiary,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reqText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    fontWeight: "500",
  },
});

ComponentFactory.register("Narrative.Event.Details", (props) => (
  <NarrativeEventDetails data={props.value} />
));
