import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type ColorValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/src/components/common/AppIcon";
import { TabBarIcon } from "@/src/components/common/TabBarIcon";
import { useI18n } from "@/src/i18n/useI18n";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, typography } from "@/src/theme/tokens";

function TabLabel({
  label,
  color,
}: {
  label: string;
  color: ColorValue;
}) {
  return (
    <Text
      style={{
        fontFamily: typography.fontFamily.medium,
        fontSize: 10,
        lineHeight: 12,
        color,
        textAlign: "center",
        marginBottom: 2,
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      allowFontScaling={false}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { colors, glass, isDark } = useTheme();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "web" ? 10 : 8);
  const tabBarHeight = 56 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foregroundMuted,
        tabBarAllowFontScaling: false,
        tabBarBackground: () =>
          Platform.OS === "web" ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: glass.fallback,
                  borderTopWidth: StyleSheet.hairlineWidth * 2,
                  borderTopColor: glass.border,
                },
              ]}
            />
          ) : (
            <View style={StyleSheet.absoluteFill}>
              <BlurView
                intensity={glass.blurThin}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: glass.thinFill },
                ]}
              />
            </View>
          ),
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: StyleSheet.hairlineWidth * 2,
          borderTopColor: glass.border,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          maxWidth: layout.maxContentWidth,
          width: "100%",
          alignSelf: "center",
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingTop: 2,
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.salary"),
          tabBarAccessibilityLabel: t("tabs.salary"),
          tabBarLabel: ({ color }) => (
            <TabLabel label={t("tabs.salary")} color={color} />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <AppIcon name="calculator" color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="settlement"
        options={{
          title: t("tabs.settlement"),
          tabBarAccessibilityLabel: t("tabs.settlement"),
          tabBarLabel: ({ color }) => (
            <TabLabel label={t("tabs.settlement")} color={color} />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <AppIcon name="file-text" color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="benefits"
        options={{
          title: t("tabs.benefits"),
          tabBarAccessibilityLabel: t("tabs.benefits"),
          tabBarLabel: ({ color }) => (
            <TabLabel label={t("tabs.benefits")} color={color} />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <AppIcon name="briefcase" color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarAccessibilityLabel: t("tabs.settings"),
          tabBarLabel: ({ color }) => (
            <TabLabel label={t("tabs.settings")} color={color} />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <AppIcon name="settings" color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}
