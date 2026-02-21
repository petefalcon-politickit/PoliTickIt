import { ComponentFactory } from "@/components/factories/component-factory";
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Visual.Card.Base
 * A cohesive container element that provides a card-like shadow and border.
 * It is designed to host other components via the registry.
 */
export const CardContainerBase = ({ value, presentation, children }: any) => {
  return (
    <View
      style={[
        styles.card,
        presentation?.styling === "compact" && styles.compact,
        presentation?.style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.separator,
  },
  compact: {
    padding: 12,
  },
});

ComponentFactory.register("Visual.Card.Base", ({ value, presentation }) => {
  // If the data contains nested elements, they should be rendered as children
  // This supports the recursive composition pattern
  return (
    <CardContainerBase presentation={presentation}>
      {/* 
         In this architecture, 'value' might contain a list of sub-elements or
         direct fields that map to other atom/molecule renderers.
       */}
      {Array.isArray(value?.elements) &&
        value.elements.map((el: any, index: number) => (
          <React.Fragment key={el.id || index}>
            {ComponentFactory.render(el.type, {
              dataField: el.id,
              value: el.data,
              presentation: el.presentation,
              metadata: el.textMetadata,
            })}
          </React.Fragment>
        ))}
    </CardContainerBase>
  );
});
