import { roundVnd } from '@/src/domain/constants/salary';
import type { RentBreakdown, RentInput } from '@/src/domain/types/otherIncome';
import { getRuleset } from '@/src/engine/rulesetLoader';

/**
 * Cho thuê BĐS — GTGT trên toàn bộ DT khi vượt ngưỡng; TNCN trên phần vượt.
 */
export function calculateRent(input: RentInput): RentBreakdown {
  if (input.annualRevenue < 0) throw new Error('Doanh thu không hợp lệ');

  const asOf = input.asOfDate ?? `${input.taxYear}-06-15`;
  const ruleset = getRuleset(input.taxYear, asOf);
  const params = ruleset.other_income?.rent;
  if (!params) throw new Error('Ruleset thiếu other_income.rent');

  const threshold = params.exemption_threshold;
  const exempt = input.annualRevenue <= threshold;
  const reportingRequired = true;

  let vat = 0;
  let pit = 0;
  const explanations: string[] = [];

  if (exempt) {
    explanations.push(
      `Doanh thu ${input.annualRevenue.toLocaleString('vi-VN')} ≤ ngưỡng ${threshold.toLocaleString('vi-VN')} — không phát sinh GTGT/TNCN theo tỷ lệ.`,
    );
  } else {
    vat = roundVnd(params.vat_rate * input.annualRevenue);
    const excess = input.annualRevenue - threshold;
    pit = roundVnd(params.pit_rate_on_excess * excess);
    explanations.push(
      `GTGT = ${params.vat_rate * 100}% × toàn bộ DT = ${vat.toLocaleString('vi-VN')}.`,
    );
    explanations.push(
      `TNCN = ${params.pit_rate_on_excess * 100}% × phần vượt ngưỡng (${excess.toLocaleString('vi-VN')}) = ${pit.toLocaleString('vi-VN')}.`,
    );
  }

  const totalTax = vat + pit;
  const reportingNote = exempt
    ? `Vẫn phải thông báo doanh thu (${params.reporting_form ?? '01/BĐS'}). ${params.reporting_deadline_note ?? ''}`.trim()
    : undefined;

  if (reportingNote) explanations.push(reportingNote);

  const formula = exempt
    ? 'Thuế = 0 (≤ ngưỡng)'
    : `GTGT ${vat.toLocaleString('vi-VN')} + TNCN ${pit.toLocaleString('vi-VN')} = ${totalTax.toLocaleString('vi-VN')}`;

  return {
    annualRevenue: input.annualRevenue,
    threshold,
    exempt,
    reportingRequired,
    vat,
    pit,
    totalTax,
    formula,
    explanations,
    reportingNote,
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      'Luật 109/2025 Đ.7 — ngưỡng cho thuê',
      'NĐ liên quan GTGT/TNCN cho thuê BĐS',
    ],
  };
}
