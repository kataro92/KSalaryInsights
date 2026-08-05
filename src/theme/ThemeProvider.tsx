import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { Appearance, useColorScheme } from "react-native";

import { usePreferences } from "@/src/hooks/usePreferences";
import type { ThemePreference } from "@/src/store/preferences";
import {
  darkColors,
  darkGlass,
  lightColors,
  lightGlass,
  type ColorTokens,
  type GlassTokens,
} from "@/src/theme/palettes";

export type ColorSchemeName = "light" | "dark";

export type ThemeContextValue = {
  /** User preference: light / dark / follow system. */
  preference: ThemePreference;
  /** Resolved appearance after applying preference. */
  scheme: ColorSchemeName;
  colors: ColorTokens;
  glass: GlassTokens;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function resolveScheme(
  preference: ThemePreference,
  system: "light" | "dark" | "unspecified" | null | undefined
): ColorSchemeName {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  return system === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { preferences } = usePreferences();
  const system = useColorScheme();
  const preference = preferences.themePreference;

  const scheme = resolveScheme(preference, system);

  // Keep Appearance in sync so native chrome (keyboard, etc.) matches when forced.
  useEffect(() => {
    if (preference === "system") {
      Appearance.setColorScheme("unspecified");
    } else {
      Appearance.setColorScheme(preference);
    }
  }, [preference]);

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = scheme === "dark";
    return {
      preference,
      scheme,
      colors: isDark ? darkColors : lightColors,
      glass: isDark ? darkGlass : lightGlass,
      isDark,
    };
  }, [preference, scheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
