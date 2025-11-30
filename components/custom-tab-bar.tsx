import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Typography from '@/constants/Typography';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Icon mapping
          const getIconName = (routeName: string): React.ComponentProps<typeof FontAwesome>['name'] => {
            switch (routeName) {
              case 'index':
                return 'home';
              case 'boats':
                return 'ship';
              case 'new-lot':
                return 'plus-circle';
              case 'daily':
                return 'bar-chart';
              case 'weekly':
                return 'calendar';
              default:
                return 'circle';
            }
          };

          const iconName = getIconName(route.name);

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={[styles.tabContent, isFocused && styles.tabContentActive]}>
                <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                  <FontAwesome
                    name={iconName}
                    size={20}
                    color={isFocused ? '#007ACC' : '#666666'}
                    style={styles.icon}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {String(label)}
                </Text>
              </View>
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
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 0.5,
    borderColor: '#E8E8E8',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 18,
    minWidth: 64,
    transition: 'all 0.2s ease',
  },
  tabContentActive: {
    backgroundColor: '#E3F2FD',
  },
  iconContainer: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  iconContainerActive: {
    // Additional styling if needed
  },
  icon: {
    // Icon styling
  },
  tabLabel: {
    ...Typography.styles.tabLabel,
    color: '#666666',
    textAlign: 'center',
  },
  tabLabelActive: {
    ...Typography.styles.tabLabelActive,
    color: '#007ACC',
    textAlign: 'center',
  },
});

