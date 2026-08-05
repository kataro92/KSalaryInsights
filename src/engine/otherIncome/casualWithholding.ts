import { roundVnd } from '@/src/domain/constants/salary';
import type {
  CasualWithholdingBreakdown,
  CasualWithholdingInput,
} from '@/src/domain/types/otherIncome';
import { getRuleset } from '@/src/engine/rulesetLoader';

/**
 * Khấu trừ tại nguồn thu nhập vãng lai — ngưỡng theo ruleset năm
 * (2025: 2tr; 2026 cả năm: 5tr — không tách H1/H2).
 */
export function calculateCasualWithholding(
  input: CasualWithholdingInput,
): CasualWithholdingBreakdown {
  if (input.paymentAmount < 0) throw new Error('Số tiền chi trả không hợp lệ');

  const asOf = input.asOfDate ?? `${input.taxYear}-06-15`;
  const ruleset = getRuleset(input.taxYear, asOf);
  const params = ruleset.casual_income;
  if (!params) throw new Error('Ruleset thiếu casual_income');

  const threshold = params.withholding_threshold;
  const rate = params.withholding_rate;
  const withholdingApplied = input.paymentAmount >= threshold;
  const withheld = withholdingApplied
    ? roundVnd(rate * input.paymentAmount)
    : 0;
  const netReceived = input.paymentAmount - withheld;

  const explanations: string[] = [
    `Ngưỡng khấu trừ ruleset ${ruleset.id}: ${threshold.toLocaleString('vi-VN')} (tỷ lệ ${rate * 100}%).`,
  ];

  let settlementWarning: string | undefined;
  if (withholdingApplied) {
    explanations.push(
      `Khấu trừ ${withheld.toLocaleString('vi-VN')}; thực nhận ${netReceived.toLocaleString('vi-VN')}.`,
    );
    explanations.push(
      'Khi quyết toán năm có thể tổng hợp với thu nhập khác — xem module Quyết toán (004).',
    );
  } else {
    settlementWarning =
      'Dưới ngưỡng khấu trừ tại nguồn — vẫn có thể phải kê khai/quyết toán nếu thuộc diện bắt buộc.';
    explanations.push(settlementWarning);
  }

  const formula = withholdingApplied
    ? `${rate * 100}% × ${input.paymentAmount.toLocaleString('vi-VN')} = ${withheld.toLocaleString('vi-VN')}`
    : 'Không khấu trừ (< ngưỡng)';

  return {
    paymentAmount: input.paymentAmount,
    threshold,
    rate,
    withheld,
    netReceived,
    withholdingApplied,
    settlementWarning,
    formula,
    explanations,
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      'NĐ 253/2026 Đ.69 — khấu trừ vãng lai',
    ],
  };
}
