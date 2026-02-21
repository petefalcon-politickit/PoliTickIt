import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Data.List.Columnar
 *
 * An adaptive 2 or 3 column bullet list element used for pros/cons,
 * aligned topics, or categorical highlights.
 */
export const ColumnarListMolecule = ({ data, containerStyle }: any) => {
  const { title, columns } = data || {};

  if (!columns || !Array.isArray(columns)) return null;

  return (
    <View style={containerStyle || GlobalStyles.metricContainer}>
      {title && (
        <SeveredTitle
          title={title}
          style={GlobalStyles.metricCardTitle}
          textAlign="center"
        />
      )}

      <View style={styles.row}>
        {columns.map((column: any, colIndex: number) => (
          <View key={colIndex} style={styles.column}>
            {column.title && (
              <ThemedText style={styles.columnTitle}>{column.title}</ThemedText>
            )}

            <View style={styles.list}>
              {column.items?.map((item: any, itemIndex: number) => {
                const isString = typeof item === "string";
                const text = isString ? item : item.text;
                const icon = isString
                  ? column.defaultIcon
                  : item.icon || column.defaultIcon;
                const color = isString
                  ? column.defaultColor
                  : item.color ||
                    column.defaultColor ||
                    Colors.light.textTertiary;

                return (
                  <View key={itemIndex} style={styles.listItem}>
                    {icon && (
                      <Ionicons name={icon as any} size={14} color={color} />
                    )}
                    {!icon && (
                      <View
                        style={[styles.bullet, { backgroundColor: color }]}
                      />
                    )}
                    <ThemedText style={styles.itemText}>{text}</ThemedText>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  column: {
    flex: 1,
    gap: 6,
  },
  columnTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.bold as any,
    color: Colors.light.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  list: {
    gap: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 5,
  },
  itemText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    flexShrink: 1, // Allow text to wrap if list is dense
  },
});

ComponentFactory.register("Data.List.Columnar", ({ value }) => (
  <ColumnarListMolecule data={value} />
));

ComponentFactory.register("Data.List.Bullet", ({ value }) => (
  <ColumnarListMolecule data={value} />
));
