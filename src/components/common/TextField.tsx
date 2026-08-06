import { Text, TextInput, View, type TextInputProps } from "react-native";
import { useState } from "react";

import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = TextInputProps & {
  label?: string;
  /** Inline validation message; draws a red border when set. */
  error?: string | null;
};

/**
 * Flat Design input. Muted fill, 2px primary focus ring, no shadow.
 */
export function TextField({
  label,
  error,
  style,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const hasError = Boolean(error);

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
        style={[
          styles.input,
          focused && !hasError && styles.inputFocused,
          hasError && styles.inputError,
          style,
        ]}
      />
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
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
      borderColor: "transparent",
      borderRadius: radii.md,
      paddingHorizontal: space[3],
      fontFamily: typography.fontFamily.medium,
      fontSize: 16,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
      backgroundColor: colors.muted,
    },
    inputFocused: {
      backgroundColor: colors.white,
      borderColor: colors.primary,
    },
    inputError: {
      backgroundColor: colors.dangerSoft,
      borderColor: colors.danger,
    },
    errorText: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 16,
      color: colors.danger,
    },
  } as const;
}
