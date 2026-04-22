import { Tabs } from "expo-router";
import { Building2, Heart, House, Map, Settings } from "lucide-react-native";

import { colors, fonts, radii } from "@/lib/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 18,
          height: 74,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: "rgba(255,255,255,0.96)",
          borderTopColor: "transparent",
          borderRadius: radii.xl,
          boxShadow: "0px 18px 42px rgba(14, 90, 114, 0.16)",
        },
        tabBarLabelStyle: {
          fontFamily: fonts.semiBold,
          fontSize: 11,
        },
        tabBarItemStyle: {
          borderRadius: radii.lg,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="map" options={{ title: "Map", tabBarIcon: ({ color, size }) => <Map color={color} size={size} /> }} />
      <Tabs.Screen
        name="favorites"
        options={{ title: "Favorites", tabBarIcon: ({ color, size }) => <Heart color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="mosques"
        options={{ title: "Mosques", tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />
    </Tabs>
  );
}
