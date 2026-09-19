import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AddLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: Platform.OS === "ios",
        headerBlurEffect:
          Platform.OS === "ios" && Number(Platform.Version) < 26
            ? "regular"
            : undefined,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Aggiungi Modellino" }} />
    </Stack>
  );
}
