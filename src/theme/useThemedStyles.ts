import { useMemo } from "react";
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from "react-native";

import { useTheme, type ThemeContextValue } from "@/src/theme/ThemeProvider";

type NamedStyles = {
  [key: string]: ViewStyle | TextStyle | ImageStyle;
};

/**
 * Use with `satisfies` (instead of `as const`) in `makeStyles` factories so
 * literal props (e.g. flexDirection) narrow correctly without freezing
 * array-typed props (e.g. fontVariant) into readonly tuples, which RN's
 * mutable style types reject.
 */
export type ThemedStyleSheet = NamedStyles;

/**
 * Build StyleSheet from current theme. Recomputes when light/dark scheme changes.
 * Pass a stable factory (module-level function) to avoid extra work.
 */
export function useThemedStyles<T extends NamedStyles>(
  factory: (theme: ThemeContextValue) => T
): T {
  const theme = useTheme();
  return useMemo(
    () => StyleSheet.create(factory(theme)) as T,
    // factory should be stable (defined at module scope)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.scheme, theme.colors, theme.glass, factory]
  );
}
