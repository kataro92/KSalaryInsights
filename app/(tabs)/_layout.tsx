import { Tabs } from 'expo-router';
import { Briefcase, Calculator, FileText, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

import { colors, layout, typography } from '@/src/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontFamily: typography.fontFamily.bold,
          fontSize: 17,
          color: colors.foreground,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foregroundMuted,
        tabBarStyle: {
          backgroundColor: colors.muted,
          borderTopWidth: 0,
          height: Platform.OS === 'web' ? 64 : 68,
          paddingBottom: Platform.OS === 'web' ? 8 : 10,
          paddingTop: 8,
          maxWidth: layout.maxContentWidth,
          width: '100%',
          alignSelf: 'center',
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.medium,
          fontSize: 11,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tính lương',
          headerTitle: 'Tính lương',
          tabBarLabel: 'Lương',
          tabBarAccessibilityLabel: 'Tab tính lương',
          tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settlement"
        options={{
          title: 'Quyết toán',
          headerTitle: 'Quyết toán',
          tabBarLabel: 'Quyết toán',
          tabBarAccessibilityLabel: 'Tab quyết toán thuế',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="benefits"
        options={{
          title: 'Quyền lợi',
          headerTitle: 'Quyền lợi',
          tabBarLabel: 'Quyền lợi',
          tabBarAccessibilityLabel: 'Tab quyền lợi',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          headerTitle: 'Cài đặt',
          tabBarLabel: 'Cài đặt',
          tabBarAccessibilityLabel: 'Tab cài đặt',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
