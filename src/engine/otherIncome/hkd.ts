import { roundVnd } from '@/src/domain/constants/salary';
import type { HkdBreakdown, HkdInput } from '@/src/domain/types/otherIncome';
import { getRuleset } from '@/src/engine/rulesetLoader';

/**
 * Hộ kinh doanh — GTGT trên toàn bộ DT khi vượt ngưỡng; TNCN trên phần vượt.
 */
export function calculateHkd(input: HkdInput): HkdBreakdown {
  if (input.annualRevenue < 0) throw new Error('Doanh thu không hợp lệ');

  const asOf = input.asOfDate ?? `${input.taxYear}-06-15`;
  const ruleset = getRuleset(input.taxYear, asOf);
  const params = ruleset.other_income?.hkd;
  if (!params) throw new Error('Ruleset thiếu other_income.hkd');

  const industry = params.industry_rates.find((r) => r.id === input.industryId);
  if (!industry) {
    throw new Error(`Không tìm thấy nhóm ngành ${input.industryId}`);
  }

  const threshold = params.exemption_threshold;
  const exempt = input.annualRevenue <= threshold;
  const reportingRequired = true;
  const explanations: string[] = [];

  let vat = 0;
  let pit = 0;

  if (exempt) {
    explanations.push(
      `Doanh thu ${input.annualRevenue.toLocaleString('vi-VN')} ≤ ngưỡng ${threshold.toLocaleString('vi-VN')} — thuế tỷ lệ = 0; vẫn kê khai doanh thu.`,
    );
  } else {
    vat = roundVnd(industry.vat_rate * input.annualRevenue);
    const excess = input.annualRevenue - threshold;
    pit = roundVnd(industry.pit_rate * excess);
    explanations.push(
      `Nhóm «${industry.label}»: GTGT ${industry.vat_rate * 100}% × toàn bộ = ${vat.toLocaleString('vi-VN')}.`,
    );
    explanations.push(
      `TNCN ${industry.pit_rate * 100}% × phần vượt (${excess.toLocaleString('vi-VN')}) = ${pit.toLocaleString('vi-VN')}.`,
    );
  }

  let incomeMethodHint: HkdBreakdown['incomeMethodHint'];
  if (
    !exempt &&
    input.costs != null &&
    Number.isFinite(input.costs) &&
    input.annualRevenue > 0
  ) {
    const taxableIncome = Math.max(0, input.annualRevenue - input.costs);
    const estimatedTax = roundVnd(params.income_method_rate * taxableIncome);
    incomeMethodHint = {
      taxableIncome,
      rate: params.income_method_rate,
      estimatedTax,
      note: `Gợi ý so sánh phương pháp thu nhập: (DT − CP) × ${params.income_method_rate * 100}% = ${estimatedTax.toLocaleString('vi-VN')} (không thay thế tờ khai).`,
    };
    explanations.push(incomeMethodHint.note);
  } else if (!exempt && input.annualRevenue >= params.income_method_threshold) {
    explanations.push(
      `Doanh thu ≥ ${params.income_method_threshold.toLocaleString('vi-VN')} — cân nhắc so sánh với phương pháp (DT−CP)×${params.income_method_rate * 100}%.`,
    );
  }

  const totalTax = vat + pit;
  const formula = exempt
    ? 'Thuế = 0 (≤ ngưỡng)'
    : `GTGT ${vat.toLocaleString('vi-VN')} + TNCN ${pit.toLocaleString('vi-VN')} = ${totalTax.toLocaleString('vi-VN')}`;

  return {
    annualRevenue: input.annualRevenue,
    industryId: input.industryId,
    industryLabel: industry.label,
    threshold,
    exempt,
    reportingRequired,
    vat,
    pit,
    totalTax,
    incomeMethodHint,
    formula,
    explanations,
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      'NĐ 68/2026 — biểu tỷ lệ ngành HKD',
      'Luật 109/2025 Đ.7 — ngưỡng HKD',
    ],
  };
}
