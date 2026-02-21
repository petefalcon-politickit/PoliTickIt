import PoliTickItHeader from "@/components/navigation/header";
import { interests } from "@/constants/mockData";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsInterestsScreen() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(interests.slice(0, 3).map((i) => i.id)),
  );

  const toggleInterest = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => toggleInterest(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: item.image || "https://picsum.photos/100/100" }}
          style={styles.icon}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Switch
          value={selected.has(item.id)}
          onValueChange={() => toggleInterest(item.id)}
          trackColor={{ false: "#D1D1D6", true: Colors.light.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.screenContainer}>
      <PoliTickItHeader title="Interests" />
      <FlatList
        data={interests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    ...GlobalStyles.shadowSmall,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    marginRight: Spacing.md,
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.light.textSlate,
    marginBottom: 2,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textGray,
    lineHeight: 18,
  },
  actionContainer: {
    marginLeft: Spacing.sm,
  },
});
