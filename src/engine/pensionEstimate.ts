import { roundVnd } from '@/src/domain/constants/salary';
import type {
  PensionBreakdown,
  PensionInput,
} from '@/src/domain/types/retirement';
import { roundContributionYears } from '@/src/engine/bhxhLumpSum';
import { getRuleset } from '@/src/engine/rulesetLoader';

export type PensionRateResult = {
  rate: number;
  steps: string[];
};

/**
 * Tỷ lệ lương hưu Đ.66 — ba nhánh nữ / nam ≥20 / nam 15–<20.
 */
export function calcPensionRate(
  sex: PensionInput['sex'],
  contributionYears: number,
  params: NonNullable<
    import('@/src/domain/types/salary').Ruleset['pension_rates']
  >,
): PensionRateResult {
  const years = contributionYears;
  const steps: string[] = [];

  if (years < params.min_years) {
    steps.push(
      `Chưa đủ ${params.min_years} năm đóng — chưa đủ điều kiện hưởng lương hưu theo Đ.66.`,
    );
    return { rate: 0, steps };
  }

  if (sex === 'female') {
    const extra = Math.max(0, years - params.female_base_years);
    const raw =
      params.female_base_rate + params.female_increment_per_year * extra;
    const rate = Math.min(raw, params.female_max_rate);
    steps.push(
      `Nữ: ${params.female_base_rate * 100}% @ ${params.female_base_years} năm`,
    );
    if (extra > 0) {
      steps.push(
        `+ ${extra} × ${params.female_increment_per_year * 100}% = ${(raw * 100).toFixed(0)}%`,
      );
    }
    if (raw > params.female_max_rate) {
      steps.push(`Trần ${params.female_max_rate * 100}% (@ ${params.female_max_years} năm)`);
    }
    return { rate, steps };
  }

  // male
  if (years >= params.male_long_base_years) {
    const extra = years - params.male_long_base_years;
    const raw =
      params.male_long_base_rate + params.male_long_increment_per_year * extra;
    const rate = Math.min(raw, params.male_long_max_rate);
    steps.push(
      `Nam ≥${params.male_long_base_years} năm: ${params.male_long_base_rate * 100}% @ ${params.male_long_base_years} năm`,
    );
    if (extra > 0) {
      steps.push(
        `+ ${extra} × ${params.male_long_increment_per_year * 100}% = ${(raw * 100).toFixed(0)}%`,
      );
    }
    if (raw > params.male_long_max_rate) {
      steps.push(
        `Trần ${params.male_long_max_rate * 100}% (@ ${params.male_long_max_years} năm)`,
      );
    }
    return { rate, steps };
  }

  const extra = years - params.male_short_base_years;
  const rate =
    params.male_short_base_rate + params.male_short_increment_per_year * extra;
  steps.push(
    `Nam ${params.male_short_base_years}–<${params.male_long_base_years} năm: ${params.male_short_base_rate * 100}% @ ${params.male_short_base_years} năm`,
  );
  if (extra > 0) {
    steps.push(
      `+ ${extra} × ${params.male_short_increment_per_year * 100}% = ${(rate * 100).toFixed(0)}%`,
    );
  }
  return { rate, steps };
}

export function calcPensionMonthly(input: PensionInput): PensionBreakdown {
  if (input.adjustedAvgSalary <= 0) {
    throw new Error('MBQTL phải > 0');
  }

  const taxYear = input.taxYear ?? 2026;
  const asOf = input.asOfDate ?? `${taxYear}-06-15`;
  const ruleset = getRuleset(taxYear, asOf);
  const params = ruleset.pension_rates;
  if (!params) throw new Error('Ruleset thiếu pension_rates');

  const contributionYears = roundContributionYears(
    input.contributionYears,
    input.contributionExtraMonths,
  );
  const { rate, steps } = calcPensionRate(input.sex, contributionYears, params);
  const monthlyAmount = roundVnd(rate * input.adjustedAvgSalary);

  const estimateNote =
    'Khoảng ước tính — MBQTL thật phụ thuộc lịch sử đóng và hệ số trượt giá; app không tính MBQTL thay bạn.';

  const formula =
    rate === 0
      ? 'Chưa đủ điều kiện tỷ lệ hưu'
      : `${(rate * 100).toFixed(0)}% × ${input.adjustedAvgSalary.toLocaleString('vi-VN')} = ${monthlyAmount.toLocaleString('vi-VN')}/tháng`;

  return {
    sex: input.sex,
    contributionYears,
    rate,
    monthlyAmount,
    adjustedAvgSalary: input.adjustedAvgSalary,
    rateSteps: steps,
    formula,
    estimateNote,
    explanations: [...steps, estimateNote],
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      'Luật BHXH 41/2024 Đ.66 — tỷ lệ lương hưu',
    ],
  };
}
