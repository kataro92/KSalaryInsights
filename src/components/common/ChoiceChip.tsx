import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Props = PressableProps & {
  label: string;
  selected?: boolean;
  /** Selected fill — primary for tax tools, secondary for benefits. */
  tone?: 'primary' | 'secondary';
};

export function ChoiceChip({
  label,
  selected = false,
  tone = 'primary',
  disabled,
  ...rest
}: Props) {
  const selectedBg = tone === 'secondary' ? colors.secondary : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: selectedBg },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...rest}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: layout.minTouch,
    paddingHorizontal: space[4],
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
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
