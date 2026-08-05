import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { LocaleCode } from '@/src/i18n/types';
import {
  getDefaultPreferences,
  loadPreferences,
  resetPreferences,
  savePreferences,
  type AppPreferences,
  type RegionCode,
} from '@/src/store/preferences';

type PreferencesContextValue = {
  preferences: AppPreferences;
  ready: boolean;
  recoveredFromCorrupt: boolean;
  setDefaultRegion: (region: RegionCode) => Promise<void>;
  setDefaultTaxYear: (year: number) => Promise<void>;
  setLocale: (locale: LocaleCode) => Promise<void>;
  resetToDefaults: () => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(getDefaultPreferences);
  const [ready, setReady] = useState(false);
  const [recoveredFromCorrupt, setRecoveredFromCorrupt] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await loadPreferences();
      if (cancelled) return;
      setPreferences(result.preferences);
      setRecoveredFromCorrupt(result.recoveredFromCorrupt);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: AppPreferences) => {
    setPreferences(next);
    await savePreferences(next);
    setRecoveredFromCorrupt(false);
  }, []);

  const setDefaultRegion = useCallback(
    async (region: RegionCode) => {
      await persist({ ...preferences, defaultRegion: region });
    },
    [persist, preferences],
  );

  const setDefaultTaxYear = useCallback(
    async (year: number) => {
      await persist({ ...preferences, defaultTaxYear: year });
    },
    [persist, preferences],
  );

  const setLocale = useCallback(
    async (locale: LocaleCode) => {
      await persist({ ...preferences, locale });
    },
    [persist, preferences],
  );

  const resetToDefaults = useCallback(async () => {
    const defaults = await resetPreferences();
    setPreferences(defaults);
    setRecoveredFromCorrupt(false);
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      ready,
      recoveredFromCorrupt,
      setDefaultRegion,
      setDefaultTaxYear,
      setLocale,
      resetToDefaults,
    }),
    [
      preferences,
      ready,
      recoveredFromCorrupt,
      setDefaultRegion,
      setDefaultTaxYear,
      setLocale,
      resetToDefaults,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
