import { useState } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, layout, motion, radii, space, typography } from '@/src/theme/tokens';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = PressableProps & {
  label: string;
  variant?: Variant;
};

export function Button({
  label,
  variant = 'primary',
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
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
      style={typeof style === 'function' ? undefined : style}
      {...rest}
    >
      <Animated.View
        style={[
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'outline' && styles.outline,
          pressed && !disabled && variant === 'primary' && styles.primaryPressed,
          pressed && !disabled && variant === 'secondary' && styles.secondaryPressed,
          pressed && !disabled && variant === 'outline' && styles.outlinePressed,
          disabled && styles.disabled,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.label,
            variant === 'primary' && styles.labelOnPrimary,
            variant === 'secondary' && styles.labelOnSecondary,
            variant === 'outline' && styles.labelOutline,
            pressed && !disabled && variant === 'outline' && styles.labelOnPrimary,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.minTouch + 12,
    paddingHorizontal: space[6],
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  secondary: {
    backgroundColor: colors.muted,
  },
  secondaryPressed: {
    backgroundColor: colors.mutedPressed,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  outlinePressed: {
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  labelOnPrimary: {
    color: colors.white,
  },
  labelOnSecondary: {
    color: colors.foreground,
  },
  labelOutline: {
    color: colors.primary,
  },
});
