import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AppIcon, type AppIconName } from "@/src/components/common/AppIcon";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, motion, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = PressableProps & {
  label: string;
  selected?: boolean;
  /** Selected fill. Primary for tax tools, secondary for benefits. */
  tone?: "primary" | "secondary";
  /** Stretch to fill ChipRow equal mode. */
  flex?: boolean;
  /** Optional leading monochrome icon. */
  icon?: AppIconName;
  /** Optional leading node (e.g. flag). */
  leading?: ReactNode;
};

export function ChoiceChip({
  label,
  selected = false,
  tone = "primary",
  flex = false,
  icon,
  leading,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const selectedBg = tone === "secondary" ? colors.secondary : colors.primary;
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);
  const labelColor = selected ? colors.white : colors.foreground;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPressIn={(e) => {
        setPressed(true);
        scale.value = withTiming(0.97, { duration: motion.interactionMs });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        scale.value = withTiming(1, { duration: motion.interactionMs });
        onPressOut?.(e);
      }}
      {...rest}
    >
      <Animated.View
        style={[
          styles.chip,
          flex && styles.flex,
          selected && { backgroundColor: selectedBg },
          pressed && !disabled && styles.pressedOpacity,
          disabled && styles.disabled,
          animatedStyle,
        ]}
      >
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        {icon ? (
          <AppIcon
            name={icon}
            size={16}
            color={labelColor}
            accessibilityLabel={undefined}
          />
        ) : null}
        <Text
          style={[styles.label, selected && styles.labelSelected]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    chip: {
      minHeight: layout.minTouch,
      paddingHorizontal: space[2],
      borderRadius: radii.md,
      backgroundColor: colors.muted,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: space[1],
    },
    flex: {
      flexGrow: 1,
      flexShrink: 1,
      // ~2 chips per row when wrapping; keep room for "2026" / short labels.
      flexBasis: "40%",
      minWidth: 72,
    },
    leading: {
      flexShrink: 0,
    },
    pressedOpacity: { opacity: 0.92 },
    disabled: { opacity: 0.5 },
    label: {
      // Do not flex-shrink the text: that truncated years to "20…".
      flexShrink: 0,
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.foreground,
      textAlign: "center",
    },
    labelSelected: {
      color: colors.white,
      fontFamily: typography.fontFamily.semiBold,
    },
  } as const;
}
