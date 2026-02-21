import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

interface ToggleListItemProps {
  id: string;
  name: string;
  description?: string;
  isSelected: boolean;
  onToggle: (id: string, selected: boolean) => void;
}

export const ToggleListItem = ({
  id,
  name,
  description,
  isSelected,
  onToggle,
}: ToggleListItemProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.7}
        onPress={() => onToggle(id, !isSelected)}
      >
        <View style={styles.textContainer}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          {description && (
            <ThemedText style={styles.description}>{description}</ThemedText>
          )}
        </View>
      </TouchableOpacity>
      <Switch
        value={isSelected}
        onValueChange={(value) => onToggle(id, value)}
        trackColor={{ false: "#E2E8F0", true: Colors.light.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E2E8F0"
        style={styles.toggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  content: {
    flex: 1,
  },
  textContainer: {
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
  },
  description: {
    fontSize: 13,
    color: Colors.light.textGray,
    lineHeight: 18,
  },
  toggle: {
    marginLeft: 12,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default ToggleListItem;
