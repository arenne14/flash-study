import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/build/layouts/Tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShadowBox from './ShadowBox';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = { home: 'home', courses: 'book', progress: 'time', profile: 'person-circle' };

// The rounded bottom tab bar from the design. The selected tab shows its name.
export default function TabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 6, paddingTop: 6, backgroundColor: 'transparent' }}>
      <ShadowBox color="#D9FBFF" radius={40} offset={6}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const label = route.name.charAt(0).toUpperCase() + route.name.slice(1);
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => {
                  const event = emitter.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigateToTab(route.key);
                  }
                }}
              >
                {focused ? (
                  <ShadowBox color="#FB8C8C" radius={14} offset={4}>
                    <View style={styles.active}>
                      <Ionicons name={ICONS[route.name]} size={26} color="#000" />
                      <Text style={styles.label}>{label}</Text>
                    </View>
                  </ShadowBox>
                ) : (
                  <View style={styles.inactive}>
                    <Ionicons name={ICONS[route.name]} size={30} color="#000" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ShadowBox>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
  active: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  inactive: { padding: 8 },
  label: { fontSize: 18, marginLeft: 6 },
});
