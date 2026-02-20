import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, BorderRadius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabIconName = keyof typeof Ionicons.glyphMap;

interface TabItem {
  name: string;
  title: string;
  icon: TabIconName;
  iconFocused: TabIconName;
}

const TABS: TabItem[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'explore', title: 'Explore', icon: 'compass-outline', iconFocused: 'compass' },
  { name: 'run', title: 'Run', icon: 'fitness-outline', iconFocused: 'fitness' },
  { name: 'activity', title: 'Activity', icon: 'stats-chart-outline', iconFocused: 'stats-chart' },
  { name: 'profile', title: 'Profile', icon: 'person-outline', iconFocused: 'person' },
];

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          const tabConfig = TABS.find((t) => t.name === route.name);
          if (!tabConfig) return null;

          const isFocused = state.index === index;
          const iconName = isFocused ? tabConfig.iconFocused : tabConfig.icon;

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

          // Special center button for "Run"
          const isRunTab = tabConfig.name === 'run';

          if (isRunTab) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.8}
                style={styles.runButtonWrapper}
              >
                <View style={[styles.runButton, isFocused && styles.runButtonActive]}>
                  <Ionicons
                    name={iconName}
                    size={26}
                    color={isFocused ? Colors.primary : Colors.white}
                  />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              {isFocused ? (
                <View style={styles.activeTabPill}>
                  <Ionicons name={iconName} size={20} color={Colors.primary} />
                  <Text style={styles.activeTabLabel}>{tabConfig.title}</Text>
                </View>
              ) : (
                <Ionicons name={iconName} size={22} color={Colors.tabBarInactive} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="run" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: BorderRadius.pill,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabBarActive,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  activeTabLabel: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.primary,
  },
  runButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  runButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.tabBarBackground,
  },
  runButtonActive: {
    backgroundColor: Colors.accent,
  },
});
