import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  LayoutGrid,
  Ship, // Changed from FileText
  Plus,
  BarChart2, // Changed from Bell
  Calendar // Changed from Search
} from 'lucide-react-native';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Helper function to get icon and color based on route name
  const getIconData = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return { IconComponent: LayoutGrid, activeColor: '#FFFFFF' };
      case 'boats':
        return { IconComponent: Ship, activeColor: '#8E55EA' }; // Purple
      case 'new-lot':
        return { IconComponent: Plus, activeColor: '#FFFFFF' }; // White (for inside blue button)
      case 'daily':
        return { IconComponent: BarChart2, activeColor: '#246BFD' }; // Blue
      case 'weekly':
        return { IconComponent: Calendar, activeColor: '#93D94E' }; // Green
      default:
        return { IconComponent: LayoutGrid, activeColor: '#FFFFFF' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.content,
        {
          marginBottom: Platform.OS === 'ios' ? insets.bottom : 10
        }
      ]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const { IconComponent, activeColor } = getIconData(route.name);
          const isCenterButton = route.name === 'new-lot';

          if (isCenterButton) {
            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.9}
                onPress={onPress}
                style={styles.centerButtonContainer}
              >
                <View style={styles.centerButton}>
                  <IconComponent size={28} color={activeColor} strokeWidth={3} />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}
            >
              <IconComponent
                size={24}
                color={isFocused ? activeColor : "#6B7280"}
                strokeWidth={isFocused ? 2.5 : 2}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#181822',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 35,
    paddingHorizontal: 10,

    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  centerButtonContainer: {
    width: 60,
    height: 60,
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#246BFD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#0B0B15',

    shadowColor: '#246BFD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  }
});