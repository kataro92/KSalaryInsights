import { Tabs } from 'expo-router';
import { Briefcase, Calculator, FileText, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, typography } from '@/src/theme/tokens';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // Web device-emulation often reports 0; keep a floor so labels aren't clipped.
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'web' ? 10 : 8);
  const tabBarHeight = 56 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        // PageHero owns brand + title — avoids duplicate chrome on mobile.
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foregroundMuted,
        tabBarStyle: {
          backgroundColor: colors.muted,
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 8,
          maxWidth: layout.maxContentWidth,
          width: '100%',
          alignSelf: 'center',
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.medium,
          fontSize: 11,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tính lương',
          tabBarLabel: 'Lương',
          tabBarAccessibilityLabel: 'Tab tính lương',
          tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settlement"
        options={{
          title: 'Quyết toán',
          tabBarLabel: 'Quyết toán',
          tabBarAccessibilityLabel: 'Tab quyết toán thuế',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="benefits"
        options={{
          title: 'Quyền lợi',
          tabBarLabel: 'Quyền lợi',
          tabBarAccessibilityLabel: 'Tab quyền lợi',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarLabel: 'Cài đặt',
          tabBarAccessibilityLabel: 'Tab cài đặt',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
