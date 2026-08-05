import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = PressableProps & {
  label: string;
  variant?: Variant;
};

export function Button({ label, variant = 'primary', disabled, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        pressed && !disabled && variant === 'primary' && styles.primaryPressed,
        pressed && !disabled && variant === 'secondary' && styles.secondaryPressed,
        pressed && !disabled && variant === 'outline' && styles.outlinePressed,
        disabled && styles.disabled,
      ]}
      {...rest}
    >
      {({ pressed }) => (
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
      )}
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
    transform: [{ scale: 0.97 }],
  },
  secondary: {
    backgroundColor: colors.muted,
  },
  secondaryPressed: {
    backgroundColor: colors.mutedPressed,
    transform: [{ scale: 0.97 }],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  outlinePressed: {
    backgroundColor: colors.primary,
    transform: [{ scale: 0.97 }],
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
