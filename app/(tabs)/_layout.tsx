import { Tabs } from 'expo-router';
import { Briefcase, Calculator, FileText, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarIcon } from '@/src/components/common/TabBarIcon';
import { useI18n } from '@/src/i18n/useI18n';
import { colors, layout, typography } from '@/src/theme/tokens';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
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
          title: t('tabs.salary'),
          tabBarLabel: t('tabs.salary'),
          tabBarAccessibilityLabel: t('tabs.salary'),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <Calculator color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="settlement"
        options={{
          title: t('tabs.settlement'),
          tabBarLabel: t('tabs.settlement'),
          tabBarAccessibilityLabel: t('tabs.settlement'),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <FileText color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="benefits"
        options={{
          title: t('tabs.benefits'),
          tabBarLabel: t('tabs.benefits'),
          tabBarAccessibilityLabel: t('tabs.benefits'),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <Briefcase color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarLabel: t('tabs.settings'),
          tabBarAccessibilityLabel: t('tabs.settings'),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <Settings color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}
