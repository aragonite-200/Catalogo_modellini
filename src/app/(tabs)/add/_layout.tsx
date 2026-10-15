import { Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";

export default function AddLayout() {
  const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark'
  return (
    
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: Platform.OS === "ios",
        headerBlurEffect:
          Platform.OS === "ios" && Number(Platform.Version) < 26
            ? "regular"
            : undefined,
            headerTintColor: isDark ? '#fff' : '#000',
          ...(Platform.OS === 'android' && {
            headerStyle: {
              backgroundColor: isDark ? '#000' : '#fff',
            },
          }),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Aggiungi Modellino" }} />
    </Stack>
  );
}
