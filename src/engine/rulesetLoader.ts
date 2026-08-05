import type { InflationAdjustmentTable } from "@/src/domain/types/retirement";
import type { Ruleset } from "@/src/domain/types/salary";
import { compareSemver } from "@/src/engine/rulesetValidate";

// Import JSON files directly (works in web/Metro bundle)
import ruleset2025 from "./rulesets/2025.json";
import ruleset2026H1 from "./rulesets/2026-h1.json";
import ruleset2026H2 from "./rulesets/2026-h2.json";
import inflation2026 from "./rulesets/inflation-adjustment-2026.json";

const BUNDLED_RULESETS: Ruleset[] = [
  ruleset2025 as Ruleset,
  ruleset2026H1 as Ruleset,
  ruleset2026H2 as Ruleset,
];

const BUNDLED_INFLATION: Record<number, InflationAdjustmentTable> = {
  2026: inflation2026 as InflationAdjustmentTable,
};

/** Remote overlays (F019). Never remove bundled; higher version wins per id. */
let overlayRulesets: Ruleset[] = [];
let overlayInflation: Record<number, InflationAdjustmentTable> = {};

export function setRulesetOverlays(rulesets: Ruleset[]): void {
  overlayRulesets = [...rulesets];
}

export function setInflationOverlays(tables: InflationAdjustmentTable[]): void {
  const next: Record<number, InflationAdjustmentTable> = {};
  for (const t of tables) {
    next[t.table_year] = t;
  }
  overlayInflation = next;
}

/** Test helper. Clear overlays without touching AsyncStorage. */
export function clearRulesetOverlays(): void {
  overlayRulesets = [];
  overlayInflation = {};
}

export function listBundledRulesets(): Ruleset[] {
  return [...BUNDLED_RULESETS];
}

function mergeRulesets(bundled: Ruleset[], overlays: Ruleset[]): Ruleset[] {
  const map = new Map<string, Ruleset>();
  for (const r of bundled) map.set(r.id, r);
  for (const r of overlays) {
    const existing = map.get(r.id);
    if (!existing || compareSemver(r.version, existing.version) > 0) {
      map.set(r.id, r);
    }
  }
  return [...map.values()].sort((a, b) => {
    if (a.tax_year !== b.tax_year) return a.tax_year - b.tax_year;
    return a.effective_from < b.effective_from ? -1 : 1;
  });
}

function dateInRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to;
}

/**
 * Select ruleset by tax year and optional as-of date (insurance mid-year splits).
 * Without asOfDate: latest effective ruleset in that tax year.
 *
 * Spec 007: `lump_sum_withdrawal` / `pension_rates` nằm trong ruleset năm;
 * bảng hệ số trượt giá load riêng qua `getInflationAdjustment(tableYear)`.
 */
export function getRuleset(taxYear: number, asOfDate?: string): Ruleset {
  const all = mergeRulesets(BUNDLED_RULESETS, overlayRulesets);
  const yearSets = all.filter((r) => r.tax_year === taxYear);
  if (yearSets.length === 0) {
    throw new Error(`Không có mức tính cho năm thuế ${taxYear}`);
  }

  if (asOfDate) {
    const match = yearSets.find((r) =>
      dateInRange(asOfDate, r.effective_from, r.effective_to)
    );
    if (match) return match;
    throw new Error(
      `Không có mức tính năm ${taxYear} hiệu lực tại ${asOfDate}`
    );
  }

  return [...yearSets].sort((a, b) =>
    a.effective_to < b.effective_to ? 1 : -1
  )[0];
}

export function listRulesets(): Ruleset[] {
  return mergeRulesets(BUNDLED_RULESETS, overlayRulesets);
}

/**
 * Bảng hệ số điều chỉnh tiền lương đã đóng BHXH theo năm công bố
 * (CV 340/BHXH-CSXH…). Không gắn `tax_year` / kỳ thuế.
 */
export function getInflationAdjustment(
  tableYear = 2026
): InflationAdjustmentTable {
  const table = overlayInflation[tableYear] ?? BUNDLED_INFLATION[tableYear];
  if (!table) {
    throw new Error(`Không có bảng trượt giá năm ${tableYear}`);
  }
  return table;
}

export function listInflationAdjustmentYears(): number[] {
  const years = new Set<number>([
    ...Object.keys(BUNDLED_INFLATION).map(Number),
    ...Object.keys(overlayInflation).map(Number),
  ]);
  return [...years].sort((a, b) => a - b);
}
