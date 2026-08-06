import { roundVnd } from "@/src/domain/constants/salary";
import type {
  EligibilityChecklistItem,
  LumpSumBreakdown,
  LumpSumInput,
} from "@/src/domain/types/retirement";
import { getRuleset } from "@/src/engine/rulesetLoader";

/**
 * Tháng lẻ Đ.5 k.6: 1-6 tháng = ½ năm; 7-11 tháng = 1 năm.
 * (Khác làm tròn thôi việc: ≥6 tháng → 1 năm.)
 */
export function roundContributionYears(
  wholeYears: number,
  extraMonths = 0
): number {
  const y = Math.max(0, Math.trunc(wholeYears));
  const m = Math.max(0, Math.trunc(extraMonths));
  let extra = 0;
  if (m >= 7) extra = 1;
  else if (m >= 1) extra = 0.5;
  return y + extra;
}

function totalMonths(input: LumpSumInput): number {
  return (
    Math.max(0, Math.trunc(input.yearsPre2014)) * 12 +
    Math.max(0, Math.trunc(input.monthsPre2014 ?? 0)) +
    Math.max(0, Math.trunc(input.yearsFrom2014)) * 12 +
    Math.max(0, Math.trunc(input.monthsFrom2014 ?? 0))
  );
}

/**
 * BHXH một lần. Đ.70: (1,5×T1 + 2×T2) × MBQTL.
 */
export function calcLumpSum(input: LumpSumInput): LumpSumBreakdown {
  if (input.adjustedAvgSalary <= 0) {
    throw new Error("MBQTL phải > 0");
  }

  const taxYear = input.taxYear ?? 2026;
  const asOf = input.asOfDate ?? `${taxYear}-06-15`;
  const ruleset = getRuleset(taxYear, asOf);
  const params = ruleset.lump_sum_withdrawal;
  if (!params) throw new Error("Thiếu tham số lump_sum_withdrawal");

  const yearsPre2014Rounded = roundContributionYears(
    input.yearsPre2014,
    input.monthsPre2014
  );
  const yearsFrom2014Rounded = roundContributionYears(
    input.yearsFrom2014,
    input.monthsFrom2014
  );

  const beforeCutoff =
    !input.firstParticipationDate ||
    input.firstParticipationDate < params.participation_cutoff;

  const conditions = beforeCutoff
    ? params.conditions_before_cutoff
    : params.conditions_from_cutoff;
  const checklist: EligibilityChecklistItem[] = conditions.map((label, i) => ({
    id: `cond-${i}`,
    label,
  }));

  const explanations: string[] = [];
  const legalSources = [
    ...ruleset.legal_sources,
    "Luật BHXH 41/2024 Đ.70: BHXH một lần",
    "Luật BHXH 41/2024 Đ.5 k.6: làm tròn tháng lẻ",
  ];

  // Đ.70 k.3c: chưa đủ 1 năm đóng (theo tháng thực tế, trước khi làm tròn năm)
  if (totalMonths(input) < 12) {
    const maxAmount = roundVnd(
      params.under_one_year_max_months * input.adjustedAvgSalary
    );
    const amount =
      input.amountContributed != null
        ? roundVnd(Math.min(input.amountContributed, maxAmount))
        : maxAmount;
    explanations.push(
      `Đóng chưa đủ 1 năm (${totalMonths(
        input
      )} tháng): mức = số đã đóng, tối đa ${
        params.under_one_year_max_months
      } tháng MBQTL = ${maxAmount.toLocaleString("vi-VN")}.`
    );
    return {
      yearsPre2014Rounded,
      yearsFrom2014Rounded,
      coefficientPre2014: params.pre_2014_coefficient,
      coefficientFrom2014: params.from_2014_coefficient,
      weightedYears: 0,
      adjustedAvgSalary: input.adjustedAvgSalary,
      amount,
      underOneYear: true,
      formula: `min(đã đóng, ${
        params.under_one_year_max_months
      } × MBQTL) = ${amount.toLocaleString("vi-VN")}`,
      explanations,
      checklist,
      beforeCutoff,
      rulesetId: ruleset.id,
      legalSources,
    };
  }

  const weightedYears =
    params.pre_2014_coefficient * yearsPre2014Rounded +
    params.from_2014_coefficient * yearsFrom2014Rounded;
  const amount = roundVnd(weightedYears * input.adjustedAvgSalary);

  explanations.push(
    `T1 (trước 2014) = ${yearsPre2014Rounded} năm × hệ số ${params.pre_2014_coefficient}.`
  );
  explanations.push(
    `T2 (từ 2014) = ${yearsFrom2014Rounded} năm × hệ số ${params.from_2014_coefficient}.`
  );
  explanations.push(
    `Tổng hệ số năm = ${weightedYears} × MBQTL ${input.adjustedAvgSalary.toLocaleString(
      "vi-VN"
    )}.`
  );

  const formula = `(${params.pre_2014_coefficient}×${yearsPre2014Rounded} + ${
    params.from_2014_coefficient
  }×${yearsFrom2014Rounded}) × ${input.adjustedAvgSalary.toLocaleString(
    "vi-VN"
  )} = ${amount.toLocaleString("vi-VN")}`;

  return {
    yearsPre2014Rounded,
    yearsFrom2014Rounded,
    coefficientPre2014: params.pre_2014_coefficient,
    coefficientFrom2014: params.from_2014_coefficient,
    weightedYears,
    adjustedAvgSalary: input.adjustedAvgSalary,
    amount,
    underOneYear: false,
    formula,
    explanations,
    checklist,
    beforeCutoff,
    rulesetId: ruleset.id,
    legalSources,
  };
}

/** Exported for tests. */
export { totalMonths as totalContributionMonths };
