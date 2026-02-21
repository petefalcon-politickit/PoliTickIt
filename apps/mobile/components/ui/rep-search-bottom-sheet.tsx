import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface RepSearchBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: {
    searchQuery: string;
    govLevel: string;
    selectedStates: string[];
    followingOnly: boolean;
  }) => void;
  initialFilters: {
    searchQuery: string;
    govLevel: string;
    selectedStates: string[];
    followingOnly: boolean;
  };
}

const STATES = [
  "All",
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

const GOV_LEVELS = ["All", "Federal", "State", "County"];

export const RepSearchBottomSheet: React.FC<RepSearchBottomSheetProps> = ({
  isVisible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [govLevel, setGovLevel] = useState(initialFilters.govLevel);
  const [selectedStates, setSelectedStates] = useState<string[]>(
    initialFilters.selectedStates,
  );
  const [followingOnly, setFollowingOnly] = useState(
    initialFilters.followingOnly,
  );

  const overlayColor = useThemeColor({}, "overlay");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 60) onClose();
      },
    }),
  ).current;

  const handleApply = () => {
    onApply({ searchQuery, govLevel, selectedStates, followingOnly });
    onClose();
  };

  const handleReset = () => {
    setSearchQuery("");
    setGovLevel("All");
    setSelectedStates(["All"]);
    setFollowingOnly(false);
  };

  const toggleState = (st: string) => {
    if (st === "All") {
      setSelectedStates(["All"]);
      return;
    }

    let newStates = [...selectedStates].filter((s) => s !== "All");
    if (newStates.includes(st)) {
      newStates = newStates.filter((s) => s !== st);
      if (newStates.length === 0) newStates = ["All"];
    } else {
      newStates.push(st);
    }
    setSelectedStates(newStates);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.content}>
          <View {...panResponder.panHandlers} style={styles.gestureArea}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Search & Filter</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Search Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Search</Text>
              <View style={styles.searchBar}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#718096"
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Name, position, or keyword..."
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            {/* Following Toggle */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Watchlist</Text>
              <View style={styles.chipContainer}>
                <TouchableOpacity
                  onPress={() => setFollowingOnly(false)}
                  style={[styles.chip, !followingOnly && styles.activeChip]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      !followingOnly && styles.activeChipText,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFollowingOnly(true)}
                  style={[styles.chip, followingOnly && styles.activeChip]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      followingOnly && styles.activeChipText,
                    ]}
                  >
                    Following
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Gov Level */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Government Branch</Text>
              <View style={styles.chipContainer}>
                {GOV_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setGovLevel(level)}
                    style={[
                      styles.chip,
                      govLevel === level && styles.activeChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        govLevel === level && styles.activeChipText,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* States */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>State / Territory</Text>
              <View style={styles.chipContainer}>
                {STATES.map((st) => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => toggleState(st)}
                    style={[
                      styles.chip,
                      selectedStates.includes(st) && styles.activeChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStates.includes(st) && styles.activeChipText,
                      ]}
                    >
                      {st === "All" ? "All States" : st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 40, // Increased for safe area coverage
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  gestureArea: {
    width: "100%",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: Typography.weights.medium as any,
    color: Colors.light.text,
  },
  resetText: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: Typography.weights.bold as any,
    textTransform: "uppercase" as any,
  },
  scrollBody: {
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.textTertiary,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    backgroundColor: Colors.light.background,
    borderRadius: 4, // Mechanical Sharpness
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
  },
  chipContainer: {
    flexDirection: "row" as any,
    flexWrap: "wrap" as any,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4, // Mechanical consistency
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeChip: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: Typography.weights.bold as any,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  activeChipText: {
    color: "#FFFFFF",
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  applyButton: {
    ...GlobalStyles.primaryButton,
    height: 54, // Consistent height for sheet actions
  },
  applyButtonText: {
    ...GlobalStyles.primaryButtonText,
  },
});
