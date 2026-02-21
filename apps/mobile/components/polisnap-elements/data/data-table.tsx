import { ComponentFactory } from "@/components/factories/component-factory";
import { ThemedText } from "@/components/themed-text";
import { SeveredTitle } from "@/components/ui/severed-title";
import { Colors, GlobalStyles, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Data.Table.Expandable
 * A cohesive table molecule that supports Row expansion for details.
 */
export const ExpandableTableMolecule = ({ dataField, value }: any) => {
  if (!value || !value.data) return null;
  const { data, headers, title } = value;
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <View key={dataField} style={GlobalStyles.dataTableContainer}>
      {title && (
        <View style={styles.titleContainer}>
          <SeveredTitle
            title={title}
            style={GlobalStyles.metricCardTitle}
            textAlign="left"
          />
        </View>
      )}

      <View style={styles.table}>
        <View style={GlobalStyles.dataTableHeader}>
          {headers.map((h: string, i: number) => (
            <ThemedText
              key={i}
              style={[styles.headerCell, i === 0 && { flex: 2 }]}
            >
              {h}
            </ThemedText>
          ))}
          <View style={{ width: 30 }} />
        </View>

        {data.map((row: any, rowIndex: number) => (
          <View
            key={rowIndex}
            style={[
              styles.rowContainer,
              rowIndex === data.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <TouchableOpacity
              style={styles.dataRow}
              onPress={() => toggleRow(rowIndex)}
            >
              <ThemedText
                style={[
                  styles.cell,
                  { flex: 2, fontWeight: Typography.weights.medium },
                ]}
              >
                {row.col1}
              </ThemedText>
              <ThemedText style={styles.cell}>{row.col2}</ThemedText>
              <Ionicons
                name={expandedRows[rowIndex] ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.light.textGray}
              />
            </TouchableOpacity>

            {expandedRows[rowIndex] && row.details && (
              <View style={styles.detailsPane}>
                {row.details.map((detail: string, di: number) => (
                  <View key={di} style={styles.detailItem}>
                    <View style={styles.detailDot} />
                    <ThemedText style={styles.detailText}>{detail}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "transparent" as any,
  },
  table: {
    width: "100%",
  },
  headerCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: Typography.weights.heavy as any,
    color: Colors.light.text, // Darker for better contrast
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  rowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator, // Use separator for inner rows
  },
  dataRow: {
    flexDirection: "row" as any,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems: "center" as any,
    backgroundColor: "transparent", // Allow card tint through for cohesive mechanical look
  },
  cell: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.light.textSlate,
  },
  detailsPane: {
    backgroundColor: "rgba(255, 255, 255, 0.4)", // Translucent white for detail depth
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  detailDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
    marginRight: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textGray,
  },
});

ComponentFactory.register("Data.Table.Expandable", (props) => (
  <ExpandableTableMolecule {...props} />
));
