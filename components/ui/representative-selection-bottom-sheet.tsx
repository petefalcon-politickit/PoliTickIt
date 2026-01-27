import { representatives } from "@/constants/mockData";
import { Colors, Typography } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
    FlatList,
    Modal,
    PanResponder,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface RepresentativeSelectionBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (repId: string) => void;
}

export const RepresentativeSelectionBottomSheet: React.FC<
  RepresentativeSelectionBottomSheetProps
> = ({ isVisible, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
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

  // Transform mock data to the format used in the selection list
  const selectionItems = representatives.map((rep) => ({
    id: rep.id,
    label: rep.name,
    image: rep.profileImage,
    state: rep.state,
    party: rep.party,
  }));

  const filteredReps = selectionItems.filter(
    (rep) =>
      rep.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.party.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
    setSearchQuery("");
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
            <Text style={styles.headerTitle}>Select Representative</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={20}
                color="#718096"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search by name, state or party..."
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#A0AEC0"
                autoFocus={false}
              />
            </View>
          </View>

          <FlatList
            data={filteredReps}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.repItem}
                onPress={() => handleSelect(item.id)}
              >
                <Image
                  source={item.image}
                  style={styles.avatar}
                  contentFit="cover"
                />
                <View style={styles.repInfo}>
                  <Text style={styles.repName}>{item.label}</Text>
                  <Text style={styles.repSubtitle}>
                    {item.party} • {item.state}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.light.textSlate}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
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
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  gestureArea: {
    paddingVertical: 12,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: Typography.weights.medium as any,
    color: Colors.light.text,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    backgroundColor: Colors.light.background,
    borderRadius: 4, // Mechanical consistency
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  repItem: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.border,
  },
  repInfo: {
    flex: 1,
    marginLeft: 16,
  },
  repName: {
    fontSize: 15,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.text,
  },
  repSubtitle: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    marginTop: 2,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
});
