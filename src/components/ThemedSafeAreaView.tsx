import { SafeAreaView, type SafeAreaViewProps } from "react-native-screens/experimental";
import { StyleSheet } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export type ThemedSafeAreaViewProps = SafeAreaViewProps & {};

export function ThemedSafeAreaView({
  style,
  ...props
}: ThemedSafeAreaViewProps) {
  const theme = useTheme();

  const backgroundColor =
    theme.background ?? "#FFFFFF"; 

  return (
    <SafeAreaView
      style={[
        styles.base,
        {
          backgroundColor:
            backgroundColor === "#000000"
              ? "#000000"
              : "#FFFFFF",
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});