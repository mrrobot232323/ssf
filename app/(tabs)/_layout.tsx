import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import CustomTabBar from '@/components/custom-tab-bar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="boats"
        options={{
          title: 'Boats',
        }}
      />
      <Tabs.Screen
        name="new-lot"
        options={{
          title: 'New Lot',
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Daily',
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          title: 'Weekly',
        }}
      />
    </Tabs>
  );
}
