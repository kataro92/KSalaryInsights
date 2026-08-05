import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DEFAULT_LOCALE,
  isLocaleCode,
  type LocaleCode,
} from "@/src/i18n/types";

export type RegionCode = "I" | "II" | "III" | "IV";

/** Appearance preference: force light, force dark, or follow OS. */
export type ThemePreference = "light" | "dark" | "system";

export type AppPreferences = {
  schemaVersion: 1;
  defaultRegion: RegionCode;
  defaultTaxYear: number;
  /** UI language. Default Vietnamese. */
  locale: LocaleCode;
  /** Appearance. Default follow system. */
  themePreference: ThemePreference;
};

export const PREFERENCES_STORAGE_KEY = "kv.preferences.v1";

const REGIONS: readonly RegionCode[] = ["I", "II", "III", "IV"];
const THEME_PREFERENCES: readonly ThemePreference[] = [
  "light",
  "dark",
  "system",
];

export function systemDefaultTaxYear(now = new Date()): number {
  const year = now.getFullYear();
  return year >= 2025 ? year : 2026;
}

export function getDefaultPreferences(now = new Date()): AppPreferences {
  return {
    schemaVersion: 1,
    defaultRegion: "I",
    defaultTaxYear: systemDefaultTaxYear(now),
    locale: DEFAULT_LOCALE,
    themePreference: "system",
  };
}

export function isRegionCode(value: unknown): value is RegionCode {
  return (
    typeof value === "string" && (REGIONS as readonly string[]).includes(value)
  );
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    (THEME_PREFERENCES as readonly string[]).includes(value)
  );
}

/** Validate & normalize unknown JSON into AppPreferences; returns null if unusable. */
export function parsePreferences(raw: unknown): AppPreferences | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj.schemaVersion !== 1) return null;
  if (!isRegionCode(obj.defaultRegion)) return null;
  if (
    typeof obj.defaultTaxYear !== "number" ||
    !Number.isInteger(obj.defaultTaxYear)
  ) {
    return null;
  }
  if (obj.defaultTaxYear < 2000 || obj.defaultTaxYear > 2100) return null;
  // Backward compatible: older saves omit locale → vi.
  if (obj.locale != null && !isLocaleCode(obj.locale)) return null;
  // Backward compatible: older saves omit theme → system.
  if (obj.themePreference != null && !isThemePreference(obj.themePreference)) {
    return null;
  }
  return {
    schemaVersion: 1,
    defaultRegion: obj.defaultRegion,
    defaultTaxYear: obj.defaultTaxYear,
    locale: isLocaleCode(obj.locale) ? obj.locale : DEFAULT_LOCALE,
    themePreference: isThemePreference(obj.themePreference)
      ? obj.themePreference
      : "system",
  };
}

export async function loadPreferences(): Promise<{
  preferences: AppPreferences;
  recoveredFromCorrupt: boolean;
}> {
  try {
    const json = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (json == null) {
      return {
        preferences: getDefaultPreferences(),
        recoveredFromCorrupt: false,
      };
    }
    const parsed = parsePreferences(JSON.parse(json));
    if (!parsed) {
      return {
        preferences: getDefaultPreferences(),
        recoveredFromCorrupt: true,
      };
    }
    return { preferences: parsed, recoveredFromCorrupt: false };
  } catch {
    return { preferences: getDefaultPreferences(), recoveredFromCorrupt: true };
  }
}

export async function savePreferences(
  preferences: AppPreferences
): Promise<void> {
  const normalized = parsePreferences(preferences);
  if (!normalized) {
    throw new Error("Invalid preferences");
  }
  await AsyncStorage.setItem(
    PREFERENCES_STORAGE_KEY,
    JSON.stringify(normalized)
  );
}

export async function resetPreferences(): Promise<AppPreferences> {
  const defaults = getDefaultPreferences();
  await savePreferences(defaults);
  return defaults;
}
