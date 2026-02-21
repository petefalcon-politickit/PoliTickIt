import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface LeaderboardEntry {
  rank: number;
  name: string;
  credits: number;
  isCurrentUser?: boolean;
  avatarUrl?: string;
  district?: string;
}

interface LeaderboardData {
  title: string;
  region: string;
  entries: LeaderboardEntry[];
  totalParticipants: number;
}

/**
 * Metric.Leaderboard.Regional
 * A high-fidelity molecule for the "Collective" competition.
 * Displays top contributors in a region/district.
 */
export const RegionalLeaderboard = ({ data }: { data: LeaderboardData }) => {
  const { title, region, entries, totalParticipants } = data;
  const [isExpanded, setIsExpanded] = useState(false);

  const currentUser = entries.find((e) => e.isCurrentUser);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, isExpanded && styles.headerExpanded]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.regionLabel}>
            {region.toUpperCase()}
          </ThemedText>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {currentUser && (
              <View style={styles.miniRankBadge}>
                <ThemedText style={styles.miniRankText}>
                  #{currentUser.rank}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.participantBadge}>
            <ThemedText style={styles.participantCount}>
              {totalParticipants.toLocaleString()} VOICES
            </ThemedText>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.light.textTertiary}
            style={{ marginLeft: 8 }}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.list}>
          {entries.map((entry, index) => (
            <View
              key={index}
              style={[
                styles.entryRow,
                entry.isCurrentUser && styles.currentUserRow,
                index === entries.length - 1 && styles.lastEntry,
              ]}
            >
              <View style={styles.rankContainer}>
                <ThemedText
                  style={[
                    styles.rankText,
                    entry.rank <= 3 && styles.topRankText,
                    entry.isCurrentUser && styles.currentUserText,
                  ]}
                >
                  #{entry.rank}
                </ThemedText>
              </View>

              <View style={styles.nameContainer}>
                <ThemedText
                  style={[
                    styles.nameText,
                    entry.isCurrentUser && styles.currentUserText,
                  ]}
                  numberOfLines={1}
                >
                  {entry.name}
                </ThemedText>
                {entry.district && (
                  <ThemedText
                    style={[
                      styles.districtText,
                      entry.isCurrentUser && styles.currentUserSubText,
                    ]}
                  >
                    {entry.district}
                  </ThemedText>
                )}
              </View>

              <View
                style={[
                  styles.creditContainer,
                  entry.isCurrentUser && styles.currentUserCreditContainer,
                ]}
              >
                <Ionicons
                  name="shield-outline"
                  size={10}
                  color={entry.isCurrentUser ? "#FFFFFF" : Colors.light.primary}
                  style={{ marginRight: 4 }}
                />
                <ThemedText
                  style={[
                    styles.creditText,
                    entry.isCurrentUser && styles.currentUserText,
                  ]}
                >
                  {entry.credits.toLocaleString()}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    marginVertical: 0,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  regionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.textTertiary,
    letterSpacing: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  miniRankBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  miniRankText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantBadge: {
    backgroundColor: Colors.light.subtleSecondaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  participantCount: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.light.primary,
  },
  list: {
    paddingVertical: 0,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  lastEntry: {
    borderBottomWidth: 0,
  },
  currentUserRow: {
    backgroundColor: Colors.light.primary,
    marginHorizontal: 0,
    borderRadius: 0,
    marginVertical: 0,
  },
  rankContainer: {
    width: 32,
    marginTop: -4,
  },
  rankText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.textTertiary,
  },
  topRankText: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: "800",
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  districtText: {
    fontSize: 10,
    color: Colors.light.textTertiary,
    marginTop: 1,
  },
  currentUserSubText: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  creditContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentUserCreditContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  creditText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.light.primary,
  },
  currentUserText: {
    color: "#FFFFFF",
  },
});

ComponentFactory.register("Metric.Leaderboard.Regional", ({ value }) => (
  <RegionalLeaderboard data={value} />
));
