import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";

type Item = {
  label: string;
  value: string;
};

type ThemedPickerProps = {
  items: Item[];
  value: string | null;
  onChange: (value: string) => void;
};

export function ThemedPicker({ items, value, onChange }: ThemedPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const selected = value === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[
              styles.box,
              {
                borderColor: selected ? theme.primary : theme.textSecondary,
                backgroundColor: selected
                  ? theme.primary + "20"
                  : theme.backgroundElement,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                {color: selected ? theme.primary : theme.text,}
              ]}

            >
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
});
