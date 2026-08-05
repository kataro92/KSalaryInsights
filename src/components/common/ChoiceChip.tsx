import { useState } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, layout, motion, radii, space, typography } from '@/src/theme/tokens';

type Props = PressableProps & {
  label: string;
  selected?: boolean;
  /** Selected fill — primary for tax tools, secondary for benefits. */
  tone?: 'primary' | 'secondary';
  /** Stretch to fill ChipRow equal mode. */
  flex?: boolean;
};

export function ChoiceChip({
  label,
  selected = false,
  tone = 'primary',
  flex = false,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const selectedBg = tone === 'secondary' ? colors.secondary : colors.primary;
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);

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
        <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: layout.minTouch,
    paddingHorizontal: space[3],
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  pressedOpacity: { opacity: 0.92 },
  disabled: { opacity: 0.5 },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
  labelSelected: {
    color: colors.white,
    fontFamily: typography.fontFamily.semiBold,
  },
});
