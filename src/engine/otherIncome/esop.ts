import { roundVnd } from "@/src/domain/constants/salary";
import type { EsopBreakdown, EsopInput } from "@/src/domain/types/otherIncome";
import { getRuleset } from "@/src/engine/rulesetLoader";

function resolveBookCost(input: EsopInput): {
  bookCost: number;
  usedFallback: boolean;
} {
  if (input.bookCostAtGrant != null && Number.isFinite(input.bookCostAtGrant)) {
    return {
      bookCost: Math.max(0, input.bookCostAtGrant),
      usedFallback: false,
    };
  }
  const shares = input.shares ?? 0;
  const par = input.parValue ?? 0;
  const paid = input.amountPaid ?? 0;
  const fallback = Math.max(0, shares * par - paid);
  return { bookCost: fallback, usedFallback: true };
}

/**
 * ESOP. TLTC khấu trừ 10% trên chi phí ghi sổ + thuế CN trên giá bán.
 */
export function calculateEsop(input: EsopInput): EsopBreakdown {
  if (input.salePrice < 0) throw new Error("Giá bán không hợp lệ");

  const ruleset = getRuleset(input.taxYear, input.asOfDate);
  const params = ruleset.other_income?.esop;
  if (!params) throw new Error("Thiếu tham số other_income.esop");

  const { bookCost, usedFallback } = resolveBookCost(input);
  const settlementNote =
    "Phần tiền lương từ vốn (TLTC) quyết toán theo biểu lũy tiến cuối năm. Mức khấu trừ 10% tại nguồn chỉ là tạm tính.";

  if (input.asOfDate < params.effective_from) {
    return {
      bookCost,
      usedFallback,
      tlccWithholding: 0,
      transferTax: 0,
      totalTax: 0,
      effective: false,
      ineffectivenessReason: `Chưa hiệu lực trước ${params.effective_from}.`,
      settlementNote,
      formula: "Chưa áp dụng",
      explanations: [
        `as_of_date ${input.asOfDate} < ${params.effective_from}.`,
      ],
      rulesetId: ruleset.id,
      legalSources: [...ruleset.legal_sources, "NĐ 253/2026 Đ.50: ESOP / TLTC"],
    };
  }

  const tlccWithholding = roundVnd(params.tlcc_withholding_rate * bookCost);
  const transferTax = roundVnd(params.transfer_rate * input.salePrice);
  const totalTax = tlccWithholding + transferTax;

  const explanations: string[] = [
    usedFallback
      ? `Chi phí ghi sổ (fallback mệnh giá): max(0, shares×par − đã trả) = ${bookCost.toLocaleString(
          "vi-VN"
        )}.`
      : `Chi phí ghi sổ tại trao = ${bookCost.toLocaleString("vi-VN")}.`,
    `TLTC khấu trừ = ${
      params.tlcc_withholding_rate * 100
    }% × ${bookCost.toLocaleString("vi-VN")} = ${tlccWithholding.toLocaleString(
      "vi-VN"
    )}.`,
    `Thuế CN = ${
      params.transfer_rate * 100
    }% × ${input.salePrice.toLocaleString(
      "vi-VN"
    )} = ${transferTax.toLocaleString("vi-VN")}.`,
    settlementNote,
  ];

  return {
    bookCost,
    usedFallback,
    tlccWithholding,
    transferTax,
    totalTax,
    effective: true,
    settlementNote,
    formula: `TLTC ${tlccWithholding.toLocaleString(
      "vi-VN"
    )} + CN ${transferTax.toLocaleString("vi-VN")} = ${totalTax.toLocaleString(
      "vi-VN"
    )}`,
    explanations,
    rulesetId: ruleset.id,
    legalSources: [...ruleset.legal_sources, "NĐ 253/2026 Đ.50: ESOP / TLTC"],
  };
}
