/** Supported UI locales. Default `vi`. */
export type LocaleCode = "vi" | "en" | "zh" | "hi" | "es" | "fr" | "ja";

export const LOCALE_OPTIONS: readonly { code: LocaleCode; label: string }[] = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "hi", label: "हिंदी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ja", label: "日本語" },
] as const;

export const DEFAULT_LOCALE: LocaleCode = "vi";

export function isLocaleCode(v: unknown): v is LocaleCode {
  return (
    typeof v === "string" &&
    (LOCALE_OPTIONS as readonly { code: string }[]).some((o) => o.code === v)
  );
}

/** Tip ids for calculated-line explanations (F-info). */
export type TipId =
  | "salary.gross"
  | "salary.bhxh"
  | "salary.bhyt"
  | "salary.bhtn"
  | "salary.insuranceTotal"
  | "salary.afterInsurance"
  | "salary.personalRelief"
  | "salary.dependentRelief"
  | "salary.reliefTotal"
  | "salary.taxable"
  | "salary.pit"
  | "salary.net"
  | "settlement.refund"
  | "settlement.pay"
  | "settlement.even"
  | "other.vat"
  | "other.pit"
  | "other.threshold"
  | "ot.pay"
  | "bonus.month";

export type TipContent = {
  title: string;
  /** Short “what is this” summary. */
  body: string;
  /** Calculation formula shown in a code-like block. */
  formula?: string;
  /** Extra how-it-works / caveats / examples. */
  detail?: string;
  /** Official legal refs. Keep statute titles; may include locale gloss. */
  sources: string[];
};
