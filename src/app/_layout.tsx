import { initializeDatabase } from "@/utils/db_init";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <SQLiteProvider databaseName="database" onInit={initializeDatabase}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: true,
          statusBarStyle: isDark ? "light" : "dark",
          statusBarBackgroundColor: isDark ? "#000000" : "#F3F4F6",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
