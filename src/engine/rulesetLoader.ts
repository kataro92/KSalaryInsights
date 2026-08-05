import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import type { InflationAdjustmentTable } from '@/src/domain/types/retirement';
import type { Ruleset } from '@/src/domain/types/salary';

// Metro/Jest (CJS) and Node ESM both supported via createRequire + import.meta.
const moduleUrl = import.meta.url;
const requireJson = createRequire(moduleUrl);
const rulesetDir = join(dirname(fileURLToPath(moduleUrl)), 'rulesets');

const ruleset2025 = requireJson(join(rulesetDir, '2025.json')) as Ruleset;
const ruleset2026H1 = requireJson(join(rulesetDir, '2026-h1.json')) as Ruleset;
const ruleset2026H2 = requireJson(join(rulesetDir, '2026-h2.json')) as Ruleset;

/** Bảng trượt giá CV 340 — tách khỏi ruleset thuế (spec 007 / FR-006). */
const inflation2026 = requireJson(
  join(rulesetDir, 'inflation-adjustment-2026.json'),
) as InflationAdjustmentTable;

const ALL_RULESETS: Ruleset[] = [ruleset2025, ruleset2026H1, ruleset2026H2];
const INFLATION_BY_YEAR: Record<number, InflationAdjustmentTable> = {
  2026: inflation2026,
};

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
  const yearSets = ALL_RULESETS.filter((r) => r.tax_year === taxYear);
  if (yearSets.length === 0) {
    throw new Error(`Không có ruleset cho năm thuế ${taxYear}`);
  }

  if (asOfDate) {
    const match = yearSets.find((r) =>
      dateInRange(asOfDate, r.effective_from, r.effective_to),
    );
    if (match) return match;
    throw new Error(
      `Không có ruleset năm ${taxYear} hiệu lực tại ${asOfDate}`,
    );
  }

  return [...yearSets].sort((a, b) =>
    a.effective_to < b.effective_to ? 1 : -1,
  )[0];
}

export function listRulesets(): Ruleset[] {
  return [...ALL_RULESETS];
}

/**
 * Bảng hệ số điều chỉnh tiền lương đã đóng BHXH theo năm công bố
 * (CV 340/BHXH-CSXH…) — không gắn `tax_year` / kỳ thuế.
 */
export function getInflationAdjustment(
  tableYear = 2026,
): InflationAdjustmentTable {
  const table = INFLATION_BY_YEAR[tableYear];
  if (!table) {
    throw new Error(`Không có bảng trượt giá năm ${tableYear}`);
  }
  return table;
}

export function listInflationAdjustmentYears(): number[] {
  return Object.keys(INFLATION_BY_YEAR)
    .map(Number)
    .sort((a, b) => a - b);
}
