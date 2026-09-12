// SmartDay Multi-Skin Bottom Navigation Bar (Section 0.2, 0.5, 0.6, 0.7, 0.8 Spec)
// 5 Tabs: Home | Plan | Sessions | Metrics | You
// Skin-faithful rendering:
// - Ember: Floating dark pill, active = white circle with dark icon
// - Halo: Dark floating pill with RAISED CENTER TAB in white circle
// - Grove: Dark translucent bar with icons + labels
// - Noir: Simple 5 icons, teal active

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSkin } from '../../skins/SkinContext';

export type TabKey = 'home' | 'plan' | 'sessions' | 'metrics' | 'you';

interface TabItem {
  key: TabKey;
  label: string;
  emberIcon: keyof typeof Ionicons.glyphMap;
  haloIcon: keyof typeof Ionicons.glyphMap;
  groveIcon: keyof typeof Ionicons.glyphMap;
  noirIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  {
    key: 'home',
    label: 'Home',
    emberIcon: 'home',
    haloIcon: 'home',
    groveIcon: 'grid-outline',
    noirIcon: 'pulse',
  },
  {
    key: 'plan',
    label: 'Plan',
    emberIcon: 'calendar',
    haloIcon: 'calendar',
    groveIcon: 'calendar-outline',
    noirIcon: 'calendar',
  },
  {
    key: 'sessions',
    label: 'Timer',
    emberIcon: 'time',
    haloIcon: 'pie-chart',
    groveIcon: 'timer-outline',
    noirIcon: 'timer-outline',
  },
  {
    key: 'metrics',
    label: 'Metrics',
    emberIcon: 'bar-chart',
    haloIcon: 'people',
    groveIcon: 'stats-chart-outline',
    noirIcon: 'bar-chart-outline',
  },
  {
    key: 'you',
    label: 'You',
    emberIcon: 'settings-sharp',
    haloIcon: 'chatbubbles',
    groveIcon: 'person-outline',
    noirIcon: 'person-outline',
  },
];

export interface BottomTabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  const { currentSkin, skin } = useSkin();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  // 1. EMBER TAB BAR: Floating dark pill, active = white circle with dark icon
  if (currentSkin === 'ember') {
    return (
      <View style={[styles.wrapper, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
        <View style={[styles.emberContainer, { backgroundColor: '#13151F', borderRadius: 32 }]}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => onTabPress(tab.key)}
                activeOpacity={0.8}
                style={styles.emberTabBtn}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                {isActive ? (
                  <View style={styles.emberActiveCircle}>
                    <Ionicons name={tab.emberIcon} size={20} color="#111827" />
                  </View>
                ) : (
                  <Ionicons name={tab.emberIcon} size={20} color="rgba(255, 255, 255, 0.45)" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // 2. HALO TAB BAR: Dark floating pill with RAISED CENTER TAB in white circle
  if (currentSkin === 'halo') {
    return (
      <View style={[styles.wrapper, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
        <View style={[styles.haloContainer, { backgroundColor: '#181A20', borderRadius: 36 }]}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const isCenter = tab.key === 'sessions';

            if (isCenter) {
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => onTabPress(tab.key)}
                  activeOpacity={0.85}
                  style={styles.haloCenterTouch}
                  accessibilityRole="tab"
                >
                  <View style={[styles.haloCenterCircle, { backgroundColor: '#FFFFFF' }]}>
                    <Ionicons name="time" size={24} color="#111827" />
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => onTabPress(tab.key)}
                activeOpacity={0.7}
                style={styles.haloTabBtn}
                accessibilityRole="tab"
              >
                <Ionicons
                  name={tab.haloIcon}
                  size={20}
                  color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // 3. GROVE TAB BAR: Dark translucent bar with icons + labels
  if (currentSkin === 'grove') {
    return (
      <View style={[styles.wrapper, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
        <View style={[styles.groveContainer, { backgroundColor: 'rgba(28, 34, 25, 0.95)', borderRadius: 24 }]}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => onTabPress(tab.key)}
                activeOpacity={0.75}
                style={styles.groveTabBtn}
                accessibilityRole="tab"
              >
                <Ionicons
                  name={tab.groveIcon}
                  size={19}
                  color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)'}
                />
                <Text
                  style={[
                    styles.groveLabel,
                    { color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)', fontWeight: isActive ? '700' : '500' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // 4. NOIR TAB BAR: Clean 5 icons, teal active
  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
      <View style={[styles.noirContainer, { backgroundColor: 'rgba(22, 24, 28, 0.98)', borderRadius: 999 }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
              style={styles.noirTabBtn}
              accessibilityRole="tab"
            >
              <Ionicons
                name={tab.noirIcon}
                size={22}
                color={isActive ? '#0D9488' : '#6B7280'}
              />
              <Text
                style={[
                  styles.noirLabel,
                  { color: isActive ? '#0D9488' : '#6B7280', fontWeight: isActive ? '700' : '500' },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Ember
  emberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 360,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emberTabBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emberActiveCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Halo
  haloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 360,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  haloTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  haloCenterTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20, // Raised center circle
  },
  haloCenterCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  // Grove
  groveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 360,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  groveTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  groveLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  // Noir
  noirContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 360,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  noirTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noirLabel: {
    fontSize: 10,
    marginTop: 3,
  },
});
