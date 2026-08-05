import type {
  AnnualSettlementBreakdown,
  AnnualSettlementInput,
  AnnualSettlementResult,
  SettlementDelta,
  SettlementScenario,
} from '@/src/domain/types/settlement';
import { grossToNet } from '@/src/engine/grossToNet';
import { evaluateCasualExemption } from '@/src/engine/casualExemption';
import { calculateAnnualPit } from '@/src/engine/pit';
import { getRuleset } from '@/src/engine/rulesetLoader';

function defaultAsOf(taxYear: number): string {
  return `${taxYear}-06-15`;
}

function makeDelta(annualTax: number, totalWithheld: number): SettlementDelta {
  const signed = annualTax - totalWithheld;
  if (signed > 0) return { signed, kind: 'pay', amount: signed };
  if (signed < 0) return { signed, kind: 'refund', amount: -signed };
  return { signed: 0, kind: 'even', amount: 0 };
}

function salaryIncomeAfterInsuranceYear(input: AnnualSettlementInput): number {
  const asOf = input.asOfDate ?? defaultAsOf(input.taxYear);

  if (input.monthlyGrosses && input.monthlyGrosses.length > 0) {
    let total = 0;
    input.monthlyGrosses.forEach((g, idx) => {
      if (g == null || !Number.isFinite(g) || g <= 0) return;
      const month = idx + 1;
      const asOfMonth = `${input.taxYear}-${String(month).padStart(2, '0')}-15`;
      const m = grossToNet({
        gross: g,
        region: input.region,
        taxYear: input.taxYear,
        asOfDate: asOfMonth,
        numDependents: 0,
      });
      total += m.pit.incomeAfterInsurance;
    });
    return total;
  }

  const monthly = input.monthlyGross;
  const months = input.monthsWorked ?? 12;
  if (monthly == null || !Number.isFinite(monthly) || monthly <= 0) {
    throw new Error('Cần nhập lương tháng hoặc lưới 12 tháng');
  }
  if (!Number.isInteger(months) || months < 1 || months > 12) {
    throw new Error('Số tháng làm việc phải từ 1 đến 12');
  }

  const one = grossToNet({
    gross: monthly,
    region: input.region,
    taxYear: input.taxYear,
    asOfDate: asOf,
    numDependents: 0,
  });
  return one.pit.incomeAfterInsurance * months;
}

function buildBreakdown(
  input: AnnualSettlementInput,
  opts: {
    includeCasual: boolean;
    withheldMissingWarning: boolean;
  },
): AnnualSettlementBreakdown {
  const ruleset = getRuleset(input.taxYear);
  const salaryIncome = salaryIncomeAfterInsuranceYear(input);
  const casualGross = opts.includeCasual && input.casual ? input.casual.gross : 0;
  const casualWithheld =
    opts.includeCasual && input.casual ? input.casual.withheld : 0;

  const incomeAfterInsuranceYear = salaryIncome + casualGross;
  const personalReliefYear = ruleset.personal_relief * 12;
  const dependentReliefYear =
    input.numDependents * ruleset.dependent_relief * 12;
  const reliefTotalYear = personalReliefYear + dependentReliefYear;
  const taxableIncomeAfterRelief = Math.max(
    0,
    incomeAfterInsuranceYear - reliefTotalYear,
  );
  const { brackets, totalTax } = calculateAnnualPit(
    taxableIncomeAfterRelief,
    ruleset,
  );
  const salaryWithheld = input.salaryWithheld || 0;
  const totalWithheld = salaryWithheld + casualWithheld;

  return {
    incomeAfterInsuranceYear,
    casualGrossIncluded: casualGross,
    taxableIncomeYear: incomeAfterInsuranceYear,
    personalReliefYear,
    dependentReliefYear,
    reliefTotalYear,
    taxableIncomeAfterRelief,
    brackets,
    annualTax: totalTax,
    totalWithheld,
    salaryWithheld,
    casualWithheldIncluded: casualWithheld,
    delta: makeDelta(totalTax, totalWithheld),
    rulesetId: ruleset.id,
    legalSources: ruleset.legal_sources,
    withheldMissingWarning: opts.withheldMissingWarning,
  };
}

/**
 * Ước tính quyết toán TNCN năm — offline, ruleset theo tax_year.
 */
export function calculateAnnualSettlement(
  input: AnnualSettlementInput,
): AnnualSettlementResult {
  if (!Number.isFinite(input.salaryWithheld) || input.salaryWithheld < 0) {
    throw new Error('Thuế đã khấu trừ không hợp lệ');
  }

  const withheldMissingWarning = input.salaryWithheld === 0;
  const casualEval = evaluateCasualExemption(input.taxYear, input.casual);

  if (casualEval.status === 'none') {
    const breakdown = buildBreakdown(input, {
      includeCasual: false,
      withheldMissingWarning,
    });
    const primary: SettlementScenario = {
      id: 'none',
      label: 'Quyết toán lương',
      breakdown,
    };
    return { primary, scenarios: [primary], casualStatus: 'none' };
  }

  if (casualEval.status === 'mandatory_merge') {
    const breakdown = buildBreakdown(input, {
      includeCasual: true,
      withheldMissingWarning,
    });
    const primary: SettlementScenario = {
      id: 'mandatory_merge',
      label: 'Bắt buộc gộp vãng lai',
      breakdown,
    };
    return {
      primary,
      scenarios: [primary],
      casualStatus: 'mandatory_merge',
    };
  }

  // exempt — dual scenarios
  const noMerge = buildBreakdown(input, {
    includeCasual: false,
    withheldMissingWarning,
  });
  const voluntary = buildBreakdown(input, {
    includeCasual: true,
    withheldMissingWarning,
  });

  const noMergeScenario: SettlementScenario = {
    id: 'exempt_no_merge',
    label: 'Không gộp vãng lai (được miễn)',
    breakdown: noMerge,
  };
  const mergeScenario: SettlementScenario = {
    id: 'voluntary_merge',
    label: 'Gộp tự nguyện',
    breakdown: voluntary,
  };

  // Recommend voluntary merge when refund is larger or pay is smaller
  const preferMerge =
    voluntary.delta.signed < noMerge.delta.signed ||
    (voluntary.delta.kind === 'refund' &&
      voluntary.delta.amount > (noMerge.delta.kind === 'refund' ? noMerge.delta.amount : 0));

  if (preferMerge) mergeScenario.recommended = true;
  else noMergeScenario.recommended = true;

  return {
    primary: preferMerge ? mergeScenario : noMergeScenario,
    scenarios: [noMergeScenario, mergeScenario],
    casualStatus: 'exempt',
  };
}
