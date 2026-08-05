import type { RegionCode } from '@/src/domain/types/salary';
import type { ComparisonOutcome } from '@/src/domain/types/comparison';
import { grossToNet } from '@/src/engine/grossToNet';
import { getRuleset } from '@/src/engine/rulesetLoader';

export type CompareRulesetsInput = {
  gross: number;
  region: RegionCode;
  numDependents?: number;
  /** Month 1–12 used for mid-year insurance caps within each tax year. */
  month?: number;
  insuranceSalary?: number;
  year1?: number;
  year2?: number;
};

function asOf(taxYear: number, month: number): string {
  return `${taxYear}-${String(month).padStart(2, '0')}-15`;
}

/**
 * Orchestrates two grossToNet calls (2025 vs 2026 by default). No new tax formulas.
 */
export function compareRulesets(input: CompareRulesetsInput): ComparisonOutcome {
  const {
    gross,
    region,
    numDependents = 0,
    month = 3,
    insuranceSalary,
    year1 = 2025,
    year2 = 2026,
  } = input;

  if (!Number.isFinite(gross) || gross <= 0) {
    return {
      ok: false,
      code: 'invalid_input',
      message: 'Gross phải là số dương để so sánh.',
    };
  }

  try {
    getRuleset(year1, asOf(year1, month));
    getRuleset(year2, asOf(year2, month));
  } catch {
    return {
      ok: false,
      code: 'missing_ruleset',
      message: `Không so sánh được: thiếu ruleset bundle cho năm ${year1} hoặc ${year2}.`,
    };
  }

  try {
    const left = grossToNet({
      gross,
      region,
      taxYear: year1,
      asOfDate: asOf(year1, month),
      numDependents,
      insuranceSalary,
    });
    const right = grossToNet({
      gross,
      region,
      taxYear: year2,
      asOfDate: asOf(year2, month),
      numDependents,
      insuranceSalary,
    });

    return {
      ok: true,
      result: {
        year1: left,
        year2: right,
        year1Label: year1,
        year2Label: year2,
        delta: {
          tax: right.pit.totalTax - left.pit.totalTax,
          net: right.net - left.net,
        },
      },
    };
  } catch (e) {
    return {
      ok: false,
      code: 'missing_ruleset',
      message:
        e instanceof Error
          ? e.message
          : 'Không so sánh được vì lỗi ruleset hoặc tham số.',
    };
  }
}
