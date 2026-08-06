import {
  Image,
  StyleSheet,
  type ColorValue,
  type StyleProp,
  type ImageStyle,
} from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";

export const ICON_SOURCES = {
  calculator: require("../../../assets/icons/calculator.png"),
  "file-text": require("../../../assets/icons/file-text.png"),
  briefcase: require("../../../assets/icons/briefcase.png"),
  settings: require("../../../assets/icons/settings.png"),
  baby: require("../../../assets/icons/baby.png"),
  "heart-pulse": require("../../../assets/icons/heart-pulse.png"),
  landmark: require("../../../assets/icons/landmark.png"),
  coins: require("../../../assets/icons/coins.png"),
  "circle-dollar": require("../../../assets/icons/circle-dollar.png"),
  info: require("../../../assets/icons/info.png"),
  "chevron-right": require("../../../assets/icons/chevron-right.png"),
  "chevron-down": require("../../../assets/icons/chevron-down.png"),
  "chevron-up": require("../../../assets/icons/chevron-up.png"),
  bullet: require("../../../assets/icons/bullet.png"),
  sun: require("../../../assets/icons/sun.png"),
  moon: require("../../../assets/icons/moon.png"),
  monitor: require("../../../assets/icons/monitor.png"),
} as const;

export type AppIconName = keyof typeof ICON_SOURCES;

type Props = {
  name: AppIconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
};

/** Monochrome PNG icon. Tint via `color` (no emoji / no vector icon fonts). */
export function AppIcon({
  name,
  size = 24,
  color,
  style,
  accessibilityLabel,
}: Props) {
  const { colors } = useTheme();
  const tint = color ?? colors.foreground;
  return (
    <Image
      source={ICON_SOURCES[name]}
      accessibilityLabel={accessibilityLabel}
      accessibilityIgnoresInvertColors
      style={[
        styles.icon,
        { width: size, height: size, tintColor: tint },
        style,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    flexShrink: 0,
  },
});
