// ─────────────────────────────────────────────────────────────────────────────
// FILE        : my-representation.tsx
// APP         : PoliTickIt Mobile
// LAYER       : App → Screens
// PURPOSE     : Dedicated "My Representation" screen — shows the authenticated
//               user's Congress members (House + 2 Senators) fetched from the
//               /api/my-representatives endpoint. Executive Branch section is
//               reserved for Phase 2.
// ─────────────────────────────────────────────────────────────────────────────

import { PoliTickItHeader } from "@/components/navigation/header";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useServices } from "@/contexts/service-provider";
import { Representative } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PARTY_COLORS: Record<string, string> = {
  Republican: "#DC2626",
  Democrat: "#2563EB",
  Democratic: "#2563EB",
  Independent: "#7C3AED",
};

function partyColor(party: string): string {
  return PARTY_COLORS[party] ?? Colors.light.primary;
}

// ── Rep Card ─────────────────────────────────────────────────────────────────

interface RepCardProps {
  rep: Representative;
  onPress: (rep: Representative) => void;
}

const RepCard: React.FC<RepCardProps> = ({ rep, onPress }) => {
  const chamberLabel =
    rep.branchType === "executive"
      ? (rep.chamber ?? rep.position ?? "Executive Official")
      : rep.chamber?.toLowerCase().includes("senate") ||
          rep.chamber?.toLowerCase().includes("senator")
        ? "Senator"
        : "Representative";

  return (
    <TouchableOpacity
      style={styles.repCard}
      onPress={() => onPress(rep)}
      activeOpacity={0.75}
    >
      <View
        style={[styles.partyAccent, { backgroundColor: partyColor(rep.party) }]}
      />
      <Image
        source={rep.profileImage || rep.imageUrl}
        style={styles.repAvatar}
        contentFit="cover"
      />
      <View style={styles.repInfo}>
        <Text style={styles.repName} numberOfLines={2}>
          {rep.name}
        </Text>
        <Text style={styles.repChamber}>{chamberLabel}</Text>
        <View style={styles.repMeta}>
          <Text style={[styles.repParty, { color: partyColor(rep.party) }]}>
            {rep.party.charAt(0)}
          </Text>
          <Text style={styles.repState}>{rep.state}</Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={Colors.light.primary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

// ── Screen ───────────────────────────────────────────────────────────────────

export default function MyRepresentationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { representativeRepository, apiRepresentativeRepository } =
    useServices();

  const [reps, setReps] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [executives, setExecutives] = useState<Representative[]>([]);
  const [executivesLoading, setExecutivesLoading] = useState(true);

  // Strips leading zeros so "04" and "4" compare equal.
  const normalizeDistrict = (d?: string | null): string | undefined => {
    if (!d) return undefined;
    const n = parseInt(d, 10);
    return isNaN(n) ? d : String(n);
  };

  const loadReps = useCallback(async () => {
    setError(null);
    try {
      // Primary path: fetch from /api/my-representatives with the user's JWT.
      // The API endpoint reads state/district from the token and returns the
      // correct House member(s) + both Senators for the authenticated user.
      const data: Representative[] =
        await apiRepresentativeRepository.fetchMyRepresentatives();
      if (data.length > 0) {
        setReps(data);
        return;
      }

      // Offline / SQLite fallback: filter cached reps by user's state+district.
      // Normalize districts before comparing (strips leading zeros, e.g. "04"→"4").
      const all = await representativeRepository.getAllRepresentatives();
      const userDistrict = normalizeDistrict(user?.district);
      const filtered = all.filter(
        (r) =>
          r.state === user?.state &&
          (normalizeDistrict(r.district) === userDistrict || !r.district),
      );
      setReps(filtered);
    } catch (e: any) {
      console.error("[MyRepresentation] loadReps:", e.message);
      setError("Could not load your representatives. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [representativeRepository, apiRepresentativeRepository, user]);

  const loadExecutives = useCallback(async () => {
    try {
      const data = await apiRepresentativeRepository.fetchExecutiveOfficials();
      setExecutives(data);
    } catch (e: any) {
      console.error("[MyRepresentation] loadExecutives:", e.message);
    } finally {
      setExecutivesLoading(false);
    }
  }, [apiRepresentativeRepository]);

  useEffect(() => {
    loadReps();
    loadExecutives();
  }, [loadReps, loadExecutives]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadReps();
    loadExecutives();
  }, [loadReps, loadExecutives]);

  const handleRepPress = (rep: Representative) => {
    router.push({ pathname: "/representative", params: { id: rep.id } });
  };

  // ── Render ──────────────────────────────────────────────────────────────

  const renderCongressSection = () => {
    if (loading) {
      return (
        <View style={styles.centeredBlock}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading your Congress members…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centeredBlock}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={40}
            color="#DC2626"
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadReps}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!user?.state || !user?.district) {
      return (
        <View style={styles.centeredBlock}>
          <MaterialCommunityIcons
            name="map-marker-off-outline"
            size={40}
            color={Colors.light.primary}
          />
          <Text style={styles.emptyTitle}>District Not Set</Text>
          <Text style={styles.emptyBody}>
            Your congressional district is determined during onboarding. If it's
            missing, update your profile in Settings.
          </Text>
        </View>
      );
    }

    if (reps.length === 0) {
      return (
        <View style={styles.centeredBlock}>
          <MaterialCommunityIcons
            name="account-search-outline"
            size={40}
            color={Colors.light.primary}
          />
          <Text style={styles.emptyTitle}>No Members Found</Text>
          <Text style={styles.emptyBody}>
            We couldn't find Congress members for {user.state} District{" "}
            {user.district}. The roster may be refreshing.
          </Text>
        </View>
      );
    }

    return reps.map((rep) => (
      <RepCard key={rep.id} rep={rep} onPress={handleRepPress} />
    ));
  };

  return (
    <View style={styles.container}>
      <PoliTickItHeader title="My Representation" showBack />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.light.primary}
          />
        }
      >
        {/* District context pill */}
        {user?.state && user?.district && (
          <View style={styles.districtPill}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color={Colors.light.primary}
            />
            <Text style={styles.districtPillText}>
              {user.state} · District {user.district}
            </Text>
          </View>
        )}

        {/* Congress Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="bank-outline"
            size={18}
            color={Colors.light.primary}
          />
          <Text style={styles.sectionTitle}>CONGRESS</Text>
        </View>
        {renderCongressSection()}

        {/* Executive Branch Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="star-circle-outline"
            size={18}
            color={Colors.light.primary}
          />
          <Text style={styles.sectionTitle}>EXECUTIVE BRANCH</Text>
        </View>
        {executivesLoading ? (
          <View style={styles.centeredBlock}>
            <ActivityIndicator size="small" color={Colors.light.primary} />
          </View>
        ) : executives.length > 0 ? (
          executives.map((official) => (
            <RepCard
              key={official.id}
              rep={official}
              onPress={handleRepPress}
            />
          ))
        ) : (
          <View style={styles.centeredBlock}>
            <MaterialCommunityIcons
              name="flag-outline"
              size={36}
              color={Colors.light.primary}
            />
            <Text style={styles.emptyTitle}>Unavailable</Text>
            <Text style={styles.emptyBody}>
              Executive Branch officials could not be loaded.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },

  // District pill
  districtPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  districtPillText: {
    ...Typography.caption,
    color: Colors.light.primary,
    fontWeight: "600",
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.light.primary,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  // Rep card
  repCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundSecondary,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  partyAccent: {
    width: 4,
    alignSelf: "stretch",
  },
  repAvatar: {
    width: 56,
    height: 56,
    margin: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundSubtle,
  },
  repInfo: {
    flex: 1,
    paddingVertical: Spacing.sm,
  },
  repName: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 2,
  },
  repChamber: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  repMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  repParty: {
    ...Typography.caption,
    fontWeight: "700",
    fontSize: 12,
  },
  repState: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  chevron: {
    marginRight: Spacing.sm,
  },

  // Centered content blocks (loading / empty / error)
  centeredBlock: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  errorText: {
    ...Typography.body,
    color: "#DC2626",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: 4,
  },
  retryText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyTitle: {
    ...Typography.heading3,
    color: Colors.light.text,
    fontWeight: "600",
  },
  emptyBody: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
