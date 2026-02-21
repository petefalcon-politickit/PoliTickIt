import { Colors, GlobalStyles } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SimpleFilterBarProps {
  onFilterPress: () => void;
}

export const SimpleFilterBar: React.FC<SimpleFilterBarProps> = ({
  onFilterPress,
}) => {
  return (
    <View style={styles.filterRow}>
      <TouchableOpacity
        style={styles.filterIcon}
        onPress={onFilterPress}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="options-outline" size={24} color={Colors.light.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    ...GlobalStyles.filterBar,
    flexDirection: "row",
    alignItems: "center",
  },
  filterIcon: {
    paddingRight: 4,
  },
});
