import { Tabs } from "expo-router";
import { colors } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Kreu" }} />
      <Tabs.Screen name="dossiers" options={{ title: "Dosjet" }} />
      <Tabs.Screen name="upload" options={{ title: "Ngarko" }} />
      <Tabs.Screen name="track" options={{ title: "Gjurmim" }} />
    </Tabs>
  );
}
