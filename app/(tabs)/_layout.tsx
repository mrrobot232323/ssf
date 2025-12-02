import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "@/components/custom-tab-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  // Load Custom Fonts
  const [fontsLoaded] = useFonts({
    "UberMove-Regular": require("../../assets/fonts/UberMove-Regular.ttf"),
    "UberMove-Bold": require("../../assets/fonts/UberMove-Bold.ttf"),
    "UberMoveText-Medium": require("../../assets/fonts/UberMoveText-Medium.ttf"),
    "UberMoveText-Regular": require("../../assets/fonts/UberMoveText-Regular.ttf"),
    // "DM-Sans": require("../../assets/fonts/DM-Sans.ttf"),
  });

  // Hide Splash Screen When Ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Prevent rendering until fonts load
  if (!fontsLoaded) return null;

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="boats" options={{ title: "Boats" }} />
      <Tabs.Screen name="new-lot" options={{ title: "New Lot" }} />
      <Tabs.Screen name="daily" options={{ title: "Daily" }} />
      <Tabs.Screen name="weekly" options={{ title: "Weekly" }} />
    </Tabs>
  );
}
