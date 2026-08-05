import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useState } from 'react';

import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Props = TextInputProps & {
  label?: string;
};

/**
 * Flat Design input — muted fill, 2px primary focus ring, no shadow.
 */
export function TextField({ label, style, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={colors.border}
        style={[styles.input, focused && styles.inputFocused, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[1] },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.foreground,
    opacity: 0.7,
  },
  input: {
    minHeight: layout.minTouch,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radii.md,
    paddingHorizontal: space[3],
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
    backgroundColor: colors.muted,
  },
  inputFocused: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
});
