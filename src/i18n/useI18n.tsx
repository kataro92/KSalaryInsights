import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { translate, type MessageKey } from "@/src/i18n/messages";
import { getTip } from "@/src/i18n/tips";
import type { LocaleCode, TipContent, TipId } from "@/src/i18n/types";
import { usePreferences } from "@/src/hooks/usePreferences";

type I18nValue = {
  locale: LocaleCode;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  tip: (id: TipId) => TipContent;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { preferences } = usePreferences();
  const locale = preferences.locale;

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );

  const tip = useCallback((id: TipId) => getTip(locale, id), [locale]);

  const value = useMemo(() => ({ locale, t, tip }), [locale, t, tip]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
