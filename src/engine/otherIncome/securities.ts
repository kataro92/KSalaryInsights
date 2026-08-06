import { roundVnd } from "@/src/domain/constants/salary";
import type {
  SecuritiesBreakdown,
  SecuritiesInput,
} from "@/src/domain/types/otherIncome";
import { getRuleset } from "@/src/engine/rulesetLoader";

/**
 * Chuyển nhượng chứng khoán. Tỷ lệ thống nhất từ `effective_from`.
 */
export function calculateSecuritiesTransfer(
  input: SecuritiesInput
): SecuritiesBreakdown {
  if (input.transferPrice < 0)
    throw new Error("Giá chuyển nhượng không hợp lệ");

  const ruleset = getRuleset(input.taxYear, input.asOfDate);
  const params = ruleset.other_income?.securities;
  if (!params) throw new Error("Thiếu tham số other_income.securities");

  const effective = input.asOfDate >= params.effective_from;
  if (!effective) {
    return {
      transferPrice: input.transferPrice,
      rate: params.transfer_rate,
      tax: 0,
      effective: false,
      ineffectivenessReason: `Tỷ lệ thống nhất ${
        params.transfer_rate * 100
      }% chưa hiệu lực trước ${params.effective_from}.`,
      formula: "Chưa áp dụng",
      explanations: [
        `as_of_date ${input.asOfDate} < ${
          params.effective_from
        }. Chưa dùng tỷ lệ ${params.transfer_rate * 100}%.`,
      ],
      rulesetId: ruleset.id,
      legalSources: [
        ...ruleset.legal_sources,
        "Nghị định 253/2026: thuế chuyển nhượng chứng khoán",
      ],
    };
  }

  const tax = roundVnd(params.transfer_rate * input.transferPrice);
  return {
    transferPrice: input.transferPrice,
    rate: params.transfer_rate,
    tax,
    effective: true,
    formula: `${
      params.transfer_rate * 100
    }% × ${input.transferPrice.toLocaleString("vi-VN")} = ${tax.toLocaleString(
      "vi-VN"
    )}`,
    explanations: [
      `Thuế chuyển nhượng = ${
        params.transfer_rate * 100
      }% × giá bán (hiệu lực từ ${params.effective_from}).`,
    ],
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      "Nghị định 253/2026: thuế chuyển nhượng chứng khoán",
    ],
  };
}
