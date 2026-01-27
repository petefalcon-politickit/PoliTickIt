import { ThemedText } from "@/components/themed-text";
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
        onPress={() => onToggle(id, !isSelected)}
      >
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {name}
          </ThemedText>
          {description && (
            <ThemedText style={styles.description}>{description}</ThemedText>
          )}
        </View>
      </TouchableOpacity>
      <Switch
        value={isSelected}
        onValueChange={(value) => onToggle(id, value)}
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
    borderBottomColor: "#E5E5EA",
  },
  content: {
    flex: 1,
  },
  textContainer: {
    gap: 4,
  },
  name: {
    fontSize: 16,
  },
  description: {
    fontSize: 13,
    color: "#999999",
  },
  toggle: {
    marginLeft: 12,
  },
});

export default ToggleListItem;
