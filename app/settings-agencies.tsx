import PoliTickItHeader from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { agencies } from "@/constants/mockData";
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsAgenciesScreen() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(agencies.slice(0, 2).map((a) => a.id)),
  );

  const toggleAgency = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item} onPress={() => toggleAgency(item.id)}>
      <View style={styles.itemContent}>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <ThemedText style={styles.level}>{item.level}</ThemedText>
      </View>
      <Switch
        value={selected.has(item.id)}
        onValueChange={() => toggleAgency(item.id)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <PoliTickItHeader />
      <ThemedView style={styles.container}>
        <FlatList
          data={agencies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  item: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    justifyContent: "space-between" as any,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 4, // Mechanical Sharpness
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemContent: {
    flex: 1,
  },
  level: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
  },
});
