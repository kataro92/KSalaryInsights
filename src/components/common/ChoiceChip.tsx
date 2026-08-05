import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

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
        flex && styles.flex,
        selected && { backgroundColor: selectedBg },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...rest}
    >
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
        {label}
      </Text>
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
