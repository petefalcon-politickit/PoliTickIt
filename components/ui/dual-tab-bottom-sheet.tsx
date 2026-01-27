import { Colors, Typography } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useRef, useState } from "react";
import {
    Modal,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DualTabBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  tabOneLabel?: string;
  tabTwoLabel?: string;
  renderTabOne?: () => React.ReactNode;
  renderTabTwo?: () => React.ReactNode;
  onApply?: () => void;
  primaryButtonText?: string;
}

export const DualTabBottomSheet: React.FC<DualTabBottomSheetProps> = ({
  isVisible,
  onClose,
  tabOneLabel = "Tab 1",
  tabTwoLabel = "Tab 2",
  renderTabOne,
  renderTabTwo,
  onApply,
  primaryButtonText = "Apply Filters",
}) => {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
  const overlayColor = useThemeColor({}, "overlay");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 60) {
          onClose();
        }
      },
    }),
  ).current;

  const renderContent = () => {
    if (activeTab === "tab1") {
      return renderTabOne ? (
        renderTabOne()
      ) : (
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>
            Content for {tabOneLabel} will appear here.
          </Text>
        </View>
      );
    }
    return renderTabTwo ? (
      renderTabTwo()
    ) : (
      <View style={styles.emptyContent}>
        <Text style={styles.emptyText}>
          Content for {tabTwoLabel} will appear here.
        </Text>
      </View>
    );
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

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "tab1" && styles.activeTab]}
              onPress={() => setActiveTab("tab1")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "tab1" && styles.activeTabText,
                ]}
              >
                {tabOneLabel}
              </Text>
              {activeTab === "tab1" && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "tab2" && styles.activeTab]}
              onPress={() => setActiveTab("tab2")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "tab2" && styles.activeTabText,
                ]}
              >
                {tabTwoLabel}
              </Text>
              {activeTab === "tab2" && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>

          <View style={styles.fixedContentArea}>{renderContent()}</View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onApply || onClose}
            >
              <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
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
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "40%",
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  gestureArea: {
    paddingTop: 12,
    paddingBottom: 4,
    width: "100%",
  },
  handle: {
    width: 40,
    height: 6,
    backgroundColor: "#CBD5E0",
    borderRadius: 3,
    alignSelf: "center",
  },
  tabBar: {
    flexDirection: "row",
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
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
  fixedContentArea: {
    height: 475, // Enforce stability as per tech spec
  },
  emptyContent: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.light.textGray,
    fontSize: Typography.sizes.base,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 4, // Mechanical Sharpness
    alignItems: "center" as any,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: Typography.weights.bold,
  },
});
