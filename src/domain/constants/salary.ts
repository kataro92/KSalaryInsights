import type { RegionCode, RegionKey } from "@/src/domain/types/salary";

export const REGION_TO_KEY: Record<RegionCode, RegionKey> = {
  I: "1",
  II: "2",
  III: "3",
  IV: "4",
};

export const REGION_OPTIONS: { code: RegionCode; label: string }[] = [
  { code: "I", label: "Vùng I" },
  { code: "II", label: "Vùng II" },
  { code: "III", label: "Vùng III" },
  { code: "IV", label: "Vùng IV" },
];

export const TAX_YEAR_OPTIONS = [2025, 2026] as const;

/** Round each monetary amount to whole VND (ADR 0004). */
export function roundVnd(amount: number): number {
  return Math.round(amount);
}
