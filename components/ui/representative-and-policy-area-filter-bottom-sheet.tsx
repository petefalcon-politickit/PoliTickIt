import { Colors, Typography } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
    FlatList,
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface RepresentativeAndPolicyAreaFilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: {
    sortBy: "date-desc" | "date-asc" | "relevancy";
    importance: "all" | "high" | "medium";
    insightType: string;
    reps: string[];
    policies: string[];
    state: string;
    gov: string;
    party: string;
    followingOnly: boolean;
  }) => void;
}

export const POLICY_AREAS = [
  {
    id: "1",
    label: "Agriculture and Food",
    image: "https://picsum.photos/id/11/100/100",
  },
  { id: "2", label: "Animals", image: "https://picsum.photos/id/2/100/100" },
  {
    id: "3",
    label: "Armed Forces and National Security",
    image: "https://picsum.photos/id/10/100/100",
  },
  {
    id: "4",
    label: "Arts, Culture, Religion",
    image: "https://picsum.photos/id/15/100/100",
  },
  {
    id: "5",
    label: "Civil Rights and Liberties, Minority Issues",
    image: "https://picsum.photos/id/19/100/100",
  },
  { id: "6", label: "Commerce", image: "https://picsum.photos/id/20/100/100" },
  { id: "7", label: "Congress", image: "https://picsum.photos/id/24/100/100" },
  {
    id: "8",
    label: "Crime and Law Enforcement",
    image: "https://picsum.photos/id/26/100/100",
  },
  {
    id: "9",
    label: "Economics and Public Finance",
    image: "https://picsum.photos/id/30/100/100",
  },
  {
    id: "10",
    label: "Education",
    image: "https://picsum.photos/id/17/100/100",
  },
  {
    id: "11",
    label: "Emergency Management",
    image: "https://picsum.photos/id/35/100/100",
  },
  { id: "12", label: "Energy", image: "https://picsum.photos/id/37/100/100" },
  {
    id: "13",
    label: "Environmental Protection",
    image: "https://picsum.photos/id/40/100/100",
  },
  { id: "14", label: "Families", image: "https://picsum.photos/id/44/100/100" },
  {
    id: "15",
    label: "Finance and Financial Sector",
    image: "https://picsum.photos/id/48/100/100",
  },
  {
    id: "16",
    label: "Foreign Trade and International Finance",
    image: "https://picsum.photos/id/50/100/100",
  },
  {
    id: "17",
    label: "Government Operations and Politics",
    image: "https://picsum.photos/id/55/100/100",
  },
  { id: "18", label: "Health", image: "https://picsum.photos/id/60/100/100" },
  {
    id: "19",
    label: "Housing and Community Development",
    image: "https://picsum.photos/id/65/100/100",
  },
  {
    id: "20",
    label: "Immigration",
    image: "https://picsum.photos/id/70/100/100",
  },
  {
    id: "21",
    label: "International Affairs",
    image: "https://picsum.photos/id/75/100/100",
  },
  {
    id: "22",
    label: "Labor and Employment",
    image: "https://picsum.photos/id/80/100/100",
  },
  { id: "23", label: "Law", image: "https://picsum.photos/id/85/100/100" },
  {
    id: "24",
    label: "Native Americans",
    image: "https://picsum.photos/id/90/100/100",
  },
  {
    id: "25",
    label: "Public Lands and Natural Resources",
    image: "https://picsum.photos/id/95/100/100",
  },
  {
    id: "26",
    label: "Science, Technology, Communications",
    image: "https://picsum.photos/id/100/100/100",
  },
  {
    id: "27",
    label: "Social Welfare",
    image: "https://picsum.photos/id/105/100/100",
  },
  {
    id: "28",
    label: "Sports and Recreation",
    image: "https://picsum.photos/id/110/100/100",
  },
  {
    id: "29",
    label: "Taxation",
    image: "https://picsum.photos/id/115/100/100",
  },
  {
    id: "30",
    label: "Transportation and Public Works",
    image: "https://picsum.photos/id/120/100/100",
  },
  {
    id: "31",
    label: "Water Resources Development",
    image: "https://picsum.photos/id/125/100/100",
  },
  {
    id: "32",
    label: "Veterans",
    image: "https://picsum.photos/id/130/100/100",
  },
  {
    id: "33",
    label: "Small Business",
    image: "https://picsum.photos/id/131/100/100",
  },
  {
    id: "34",
    label: "Cybersecurity",
    image: "https://picsum.photos/id/132/100/100",
  },
];

const INSIGHT_TYPES = [
  "All Types",
  "Legislative",
  "Financial Correlation",
  "Campaign Finance",
  "Market",
  "Community",
  "Trends",
];

export const REPRESENTATIVES = [
  {
    id: "T000250",
    label: "John Thune",
    image: "https://unitedstates.github.io/images/congress/225x275/T000250.jpg",
    state: "South Dakota",
    gov: "Federal",
    party: "Republican",
    isFollowing: true,
  },
  {
    id: "S000148",
    label: "Chuck Schumer",
    image: "https://unitedstates.github.io/images/congress/225x275/S000148.jpg",
    state: "New York",
    gov: "Federal",
    party: "Democrat",
    isFollowing: true,
  },
  {
    id: "C001056",
    label: "John Cornyn",
    image: "https://unitedstates.github.io/images/congress/225x275/C001056.jpg",
    state: "Texas",
    gov: "Federal",
    party: "Republican",
    isFollowing: false,
  },
  {
    id: "W000817",
    label: "Elizabeth Warren",
    image: "https://unitedstates.github.io/images/congress/225x275/W000817.jpg",
    state: "Massachusetts",
    gov: "Federal",
    party: "Democrat",
    isFollowing: true,
  },
  {
    id: "C001098",
    label: "Ted Cruz",
    image: "https://unitedstates.github.io/images/congress/225x275/C001098.jpg",
    state: "Texas",
    gov: "Federal",
    party: "Republican",
    isFollowing: false,
  },
  {
    id: "S000033",
    label: "Bernie Sanders",
    image: "https://unitedstates.github.io/images/congress/225x275/S000033.jpg",
    state: "Vermont",
    gov: "Federal",
    party: "Independent",
    isFollowing: true,
  },
  {
    id: "C001131",
    label: "Greg Casar",
    image: "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
    state: "Texas",
    gov: "Federal",
    party: "Democrat",
    isFollowing: true,
  },
  {
    id: "C001035",
    label: "Susan Collins",
    image: "https://unitedstates.github.io/images/congress/225x275/C001035.jpg",
    state: "Maine",
    gov: "Federal",
    party: "Republican",
    isFollowing: false,
  },
  {
    id: "K000377",
    label: "Mark Kelly",
    image: "https://unitedstates.github.io/images/congress/225x275/K000377.jpg",
    state: "Arizona",
    gov: "Federal",
    party: "Democrat",
    isFollowing: true,
  },
  {
    id: "C001131",
    label: "Greg Casar",
    image: "https://unitedstates.github.io/images/congress/225x275/C001131.jpg",
    state: "Texas",
    gov: "Federal",
    party: "Democrat",
    isFollowing: true,
  },
  {
    id: "P000197",
    label: "Nancy Pelosi",
    image: "https://unitedstates.github.io/images/congress/225x275/P000197.jpg",
    state: "California",
    gov: "Federal",
    party: "Democrat",
    isFollowing: true,
  },
];

const US_STATES = [
  "Any state",
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
  "American Samoa",
  "Guam",
  "Northern Mariana Islands",
  "Puerto Rico",
  "U.S. Virgin Islands",
];

const GOV_LEVELS = ["All governments", "Federal", "State", "County", "City"];
const PARTIES = ["Any party", "Democrat", "Independent", "Republican"];

export const RepresentativeAndPolicyAreaFilterBottomSheet: React.FC<
  RepresentativeAndPolicyAreaFilterBottomSheetProps
> = ({ isVisible, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState<"general" | "reps" | "policy">(
    "general",
  );
  const overlayColor = useThemeColor({}, "overlay");
  const [followingOnlyReps, setFollowingOnlyReps] = useState(true);
  const [followingOnlyPolicy, setFollowingOnlyPolicy] = useState(false);

  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "relevancy">(
    "date-desc",
  );
  const [importance, setImportance] = useState<"all" | "high" | "medium">(
    "all",
  );
  const [insightType, setInsightType] = useState("All Types");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // More sensitive start: only 5px movement required
        return gestureState.dy > 5;
      },
      onPanResponderRelease: (_, gestureState) => {
        // Easier dismissal: only 60px swipe required instead of 100
        if (gestureState.dy > 60) {
          onClose();
        }
      },
    }),
  ).current;

  // Filter & Selection States
  const [selectedReps, setSelectedReps] = useState<string[]>(
    REPRESENTATIVES.filter((r) => r.isFollowing).map((r) => r.id),
  );
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>(
    POLICY_AREAS.map((p) => p.id),
  );
  const [selectedState, setSelectedState] = useState("Any state");
  const [selectedGov, setSelectedGov] = useState("All governments");
  const [selectedParty, setSelectedParty] = useState("Any party");

  // Custom Picker State
  const [activePicker, setActivePicker] = useState<
    "state" | "gov" | "party" | null
  >(null);

  const displayedReps = followingOnlyReps
    ? REPRESENTATIVES.filter((r) => r.isFollowing)
    : REPRESENTATIVES;

  // Toggle Following Logic
  const handleToggleFollowing = () => {
    if (activeTab === "reps") {
      const newVal = !followingOnlyReps;
      setFollowingOnlyReps(newVal);

      if (newVal) {
        // Auto select only following
        const following = REPRESENTATIVES.filter((r) => r.isFollowing).map(
          (r) => r.id,
        );
        if (following.length > 0) {
          setSelectedReps(following);
        }
        // Reset dropdowns to "All" (implied "All" if we don't have enough data, but showing 'All' visually)
        setSelectedState("Any state");
        setSelectedGov("All governments");
        setSelectedParty("Any party");
      }
    } else {
      setFollowingOnlyPolicy(!followingOnlyPolicy);
    }
  };

  const toggleRepSelection = (id: string) => {
    setSelectedReps((prev) => {
      if (prev.includes(id)) {
        // Do not allow < 1 representative to be selected
        if (prev.length <= 1) return prev;
        return prev.filter((rid) => rid !== id);
      }
      return [...prev, id];
    });
  };

  const togglePolicySelection = (id: string) => {
    setSelectedPolicies((prev) => {
      if (prev.includes(id)) {
        // Do not allow < 1 policy to be selected
        if (prev.length <= 1) return prev;
        return prev.filter((pid) => pid !== id);
      }
      return [...prev, id];
    });
  };

  const renderTabs = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "general" && styles.activeTab]}
        onPress={() => setActiveTab("general")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "general" && styles.activeTabText,
          ]}
        >
          General
        </Text>
        {activeTab === "general" && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "reps" && styles.activeTab]}
        onPress={() => setActiveTab("reps")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={[styles.tabText, activeTab === "reps" && styles.activeTabText]}
        >
          Representatives
        </Text>
        {activeTab === "reps" && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "policy" && styles.activeTab]}
        onPress={() => setActiveTab("policy")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "policy" && styles.activeTabText,
          ]}
        >
          Policy Areas
        </Text>
        {activeTab === "policy" && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    </View>
  );

  const renderFollowingToggle = () => {
    const isFollowingOnly =
      activeTab === "reps" ? followingOnlyReps : followingOnlyPolicy;

    return (
      <View style={styles.followingRow}>
        <Text style={styles.followingText}>Following</Text>
        <TouchableOpacity
          onPress={handleToggleFollowing}
          style={[styles.toggleContainer, isFollowingOnly && styles.toggleOn]}
        >
          <View
            style={[
              styles.toggleCircle,
              isFollowingOnly && styles.toggleCircleOn,
            ]}
          >
            {isFollowingOnly && (
              <Ionicons
                name="checkmark"
                size={12}
                color={Colors.light.primary}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGeneralTab = () => (
    <View style={styles.generalTabContent}>
      <Text style={styles.sectionTitle}>Sort By</Text>
      <View style={styles.chipContainer}>
        {[
          { label: "Date (Newest)", value: "date-desc" },
          { label: "Date (Oldest)", value: "date-asc" },
          { label: "Relevancy", value: "relevancy" },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, sortBy === option.value && styles.activeChip]}
            onPress={() => setSortBy(option.value as any)}
          >
            <Text
              style={[
                styles.chipText,
                sortBy === option.value && styles.activeChipText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Importance</Text>
      <View style={styles.chipContainer}>
        {["all", "high", "medium"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.chip, importance === level && styles.activeChip]}
            onPress={() => setImportance(level as any)}
          >
            <Text
              style={[
                styles.chipText,
                importance === level && styles.activeChipText,
              ]}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Insight Type</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setActivePicker("insightType" as any)}
      >
        <Text style={styles.dropdownText}>{insightType}</Text>
        <Ionicons name="chevron-down" size={20} color={Colors.light.text} />
      </TouchableOpacity>
    </View>
  );

  const renderDropdowns = () => (
    <View
      style={[
        styles.dropdownRow,
        followingOnlyReps && styles.disabledContainer,
      ]}
    >
      <TouchableOpacity
        style={styles.dropdown}
        disabled={followingOnlyReps}
        onPress={() => setActivePicker("state")}
      >
        <Ionicons name="checkmark" size={14} color={Colors.light.textSlate} />
        <Text style={styles.dropdownText} numberOfLines={1}>
          {selectedState}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={Colors.light.textSlate}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dropdown}
        disabled={followingOnlyReps}
        onPress={() => setActivePicker("gov")}
      >
        <Text style={styles.dropdownText} numberOfLines={1}>
          {selectedGov}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={Colors.light.textSlate}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dropdown}
        disabled={followingOnlyReps}
        onPress={() => setActivePicker("party")}
      >
        <Ionicons name="checkmark" size={14} color={Colors.light.textSlate} />
        <Text style={styles.dropdownText} numberOfLines={1}>
          {selectedParty}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={Colors.light.textSlate}
        />
      </TouchableOpacity>
    </View>
  );

  const renderPicker = () => {
    if (!activePicker) return null;

    let data: string[] = [];
    let currentVal = "";
    let setter: (v: string) => void = () => {};

    if (activePicker === "state") {
      data = US_STATES;
      currentVal = selectedState;
      setter = setSelectedState;
    } else if (activePicker === "gov") {
      data = GOV_LEVELS;
      currentVal = selectedGov;
      setter = setSelectedGov;
    } else if (activePicker === "party") {
      data = PARTIES;
      currentVal = selectedParty;
      setter = setSelectedParty;
    } else if (activePicker === ("insightType" as any)) {
      data = INSIGHT_TYPES;
      currentVal = insightType;
      setter = setInsightType;
    }

    return (
      <Modal visible={!!activePicker} transparent animationType="fade">
        <View style={styles.pickerOverlay}>
          <TouchableOpacity
            style={styles.pickerDismissArea}
            activeOpacity={1}
            onPress={() => setActivePicker(null)}
          />
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select {activePicker}</Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    currentVal === item && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setter(item);
                    setActivePicker(null);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      currentVal === item && styles.pickerItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {currentVal === item && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.light.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.pickerListContent}
              style={styles.pickerList}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const handleApply = () => {
    onApply({
      sortBy,
      importance,
      insightType,
      reps: selectedReps,
      policies: selectedPolicies,
      state: selectedState,
      gov: selectedGov,
      party: selectedParty,
      followingOnly: followingOnlyReps,
    });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
        <View style={styles.content}>
          <View {...panResponder.panHandlers} style={styles.gestureArea}>
            <View style={styles.handle} />
            {renderTabs()}
          </View>

          <View style={styles.fixedContentArea}>
            <ScrollView style={styles.scrollArea}>
              <View style={styles.innerContent}>
                {activeTab !== "general" && renderFollowingToggle()}

                {activeTab === "general" && renderGeneralTab()}
                {activeTab === "reps" && renderDropdowns()}

                <View style={styles.grid}>
                  {activeTab === "reps" ? (
                    displayedReps.map((item) => {
                      const isSelected = selectedReps.includes(item.id);
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.gridItem}
                          onPress={() => toggleRepSelection(item.id)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.avatarContainer,
                              isSelected && styles.avatarSelected,
                            ]}
                          >
                            <Image
                              source={item.image}
                              style={styles.avatar}
                              contentFit="cover"
                              transition={200}
                            />
                          </View>
                          <Text style={styles.gridLabel} numberOfLines={2}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  ) : activeTab === "policy" ? (
                    <View style={styles.policyChipContainer}>
                      {POLICY_AREAS.map((item) => {
                        const isSelected = selectedPolicies.includes(item.id);
                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.interestChip,
                              isSelected && styles.interestChipActive,
                            ]}
                            onPress={() => togglePolicySelection(item.id)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.interestText,
                                isSelected && styles.interestTextActive,
                              ]}
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleApply}
            >
              <Text style={styles.primaryButtonText}>Filter selected</Text>
            </TouchableOpacity>

            {activeTab === "policy" ? (
              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1 }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (selectedPolicies.length === POLICY_AREAS.length) {
                    setSelectedPolicies([]);
                  } else {
                    setSelectedPolicies(POLICY_AREAS.map((p) => p.id));
                  }
                }}
              >
                <Text style={styles.secondaryButtonText}>
                  {selectedPolicies.length === POLICY_AREAS.length
                    ? "Clear all"
                    : "All policy areas"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.viewRepButton,
                  selectedReps.length === 1 && styles.viewRepButtonActive,
                ]}
                disabled={selectedReps.length !== 1}
              >
                <Text
                  style={[
                    styles.viewRepButtonText,
                    selectedReps.length === 1 && styles.viewRepButtonTextActive,
                  ]}
                >
                  View rep
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {renderPicker()}
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
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "60%",
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  gestureArea: {
    paddingTop: 12,
    paddingBottom: 4,
    width: "100%",
    backgroundColor: "transparent",
  },
  handle: {
    width: 40,
    height: 6,
    backgroundColor: "#CBD5E0",
    borderRadius: 3,
    alignSelf: "center",
  },
  fixedContentArea: {
    height: 475, // Enough to show ~4 rows plus toggle/dropdowns reliably
  },
  tabBar: {
    flexDirection: "row",
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
  },
  tab: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  activeTab: {},
  tabText: {
    fontSize: Typography.sizes.md,
    color: "#718096",
    fontWeight: Typography.weights.medium,
  },
  activeTabText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "60%",
    height: 6,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  scrollArea: {
    paddingHorizontal: 20,
  },
  innerContent: {
    paddingTop: 14,
    paddingBottom: 60,
  },
  followingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  followingText: {
    fontSize: Typography.sizes.md,
    color: Colors.light.primary,
    fontWeight: Typography.weights.medium,
    marginRight: 12,
  },
  toggleContainer: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    padding: 2,
  },
  toggleOn: {
    backgroundColor: Colors.light.primary,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleCircleOn: {
    transform: [{ translateX: 20 }],
  },

  // General Tab Styles
  generalTabContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
    marginTop: 18,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeChip: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    fontWeight: Typography.weights.medium,
  },
  activeChipText: {
    color: "#FFF",
    fontWeight: Typography.weights.bold,
  },
  dropdownRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  dropdown: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E2E8F0",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4, // Mechanical consistency
  },
  dropdownText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSlate,
    fontWeight: Typography.weights.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    columnGap: "2.6%",
    rowGap: 8,
  },
  repsArea: {
    minHeight: 240,
    justifyContent: "center",
  },
  gridInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "2.5%",
  },
  horizontalReps: {
    paddingVertical: 10,
    gap: 20,
  },
  horizontalColumn: {
    gap: 20,
    alignItems: "center",
  },
  horizontalItem: {
    width: 80,
    alignItems: "center",
  },
  gridItem: {
    width: "23%",
    alignItems: "center",
    marginBottom: 0,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    overflow: "hidden",
    marginBottom: 2,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
    marginBottom: 2,
  },
  avatarSelected: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    padding: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  gridLabel: {
    fontSize: Typography.sizes.sm,
    color: "#718096",
    textAlign: "center",
    lineHeight: 14,
    height: 28,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 10,
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: Colors.light.background,
  },
  // Picker Styles
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerDismissArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pickerContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%", // Fixed height works best with FlatList inside Modal
    width: "100%",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  pickerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "bold",
    color: Colors.light.text,
    textTransform: "capitalize",
  },
  pickerList: {
    flex: 1, // Required to fill the remaining 75% height
  },
  pickerListContent: {
    padding: 16,
    paddingBottom: 60, // Ensure bottom items aren't cut off
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  pickerItemActive: {
    backgroundColor: "#F7FAFC",
  },
  pickerItemText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
  },
  pickerItemTextActive: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4, // Mechanical consistency
    flex: 1,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: Typography.weights.bold,
  },
  secondaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4, // Mechanical consistency
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },
  viewRepButton: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4, // Mechanical consistency
    flex: 1,
    alignItems: "center",
  },
  viewRepButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  viewRepButtonText: {
    color: "#D1D1D1",
    fontWeight: Typography.weights.bold,
  },
  viewRepButtonTextActive: {
    color: "#FFFFFF",
  },
  // High-Fidelity Chips (Metadata Pillbox)
  policyChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 10,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 5,
    borderRadius: 4, // Mechanical consistency
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "transparent",
  },
  interestChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  interestText: {
    fontSize: 10, // Slightly smaller for the bottom sheet density
    color: Colors.light.textSlate,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  interestTextActive: {
    color: "#FFFFFF",
  },
});
