import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Identity.Organization.Header
 * A production-grade header for community organizations and non-profits.
 * Adheres to the 15px vertical rhythm and zero-margin policy.
 */
export const IdentityOrganizationHeader = ({ data }: any) => {
  const { name, imgUri, location, status, isVerified, tags } = data || {};

  return (
    <View style={styles.container}>
      <Image
        source={
          imgUri ||
          `https://ui-avatars.com/api/?name=${name || "Org"}&background=CBD5E0&color=4A5568`
        }
        style={styles.logo}
        contentFit="contain"
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <ThemedText style={styles.name}>{name}</ThemedText>
        </View>
        <View style={styles.metaRow}>
          {isVerified || (status && status.toLowerCase().includes("501")) ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={11} color="#FFFFFF" />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText style={styles.verifiedText}>501</ThemedText>
                <ThemedText style={[styles.verifiedText, { marginLeft: 0 }]}>
                  (c)(3)
                </ThemedText>
              </View>
            </View>
          ) : status ? (
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              <ThemedText style={styles.statusText}>{status}</ThemedText>
            </View>
          ) : null}
        </View>
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.light.textTertiary}
          />
          <ThemedText style={styles.location}>{location}</ThemedText>
        </View>
        {tags && tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tagPill}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 4,
    alignItems: "flex-start", // Top aligned per user request
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginTop: 2, // Slight top margin for better visual alignment with high-weight text
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
    alignSelf: "flex-start",
    minWidth: 85, // Even larger to prevent any clipping of the 501 prefix
    justifyContent: "flex-start",
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
    marginLeft: 6,
    letterSpacing: 0,
    flexShrink: 0,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%", // Explicitly take full width of content column
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
    marginLeft: 6, // Increased spacing from icon
    letterSpacing: 0, // Reset letter spacing to avoid numeric character merging
    flexShrink: 0, // Force text to not shrink, allowing parent horizontal scroll or wrapping
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    fontSize: 13,
    color: Colors.light.textTertiary,
    marginLeft: 4,
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(34, 113, 186, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.light.primary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

ComponentFactory.register("Identity.Organization.Header", (props) => (
  <IdentityOrganizationHeader data={props.value} />
));
