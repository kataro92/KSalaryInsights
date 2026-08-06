import type { CasualIncomeInput } from "@/src/domain/types/settlement";

export const CASUAL_EXEMPTION_MONTHLY_AVG = 15_000_000;

export type CasualExemptionResult =
  | { status: "none" }
  | { status: "mandatory_merge"; monthlyAverage: number }
  | {
      status: "exempt";
      monthlyAverage: number;
      reason: string;
    };

/**
 * NĐ 253/2026 Đ.69.1.a. Miễn QT phần vãng lai khi tax_year ≥ 2026,
 * bình quân ≤ 15tr/tháng và đã khấu trừ tại nguồn (> 0).
 */
export function evaluateCasualExemption(
  taxYear: number,
  casual: CasualIncomeInput | undefined
): CasualExemptionResult {
  if (!casual || !Number.isFinite(casual.gross) || casual.gross <= 0) {
    return { status: "none" };
  }

  const monthlyAverage = casual.gross / 12;

  if (taxYear < 2026) {
    return { status: "mandatory_merge", monthlyAverage };
  }

  const withheldOk = Number.isFinite(casual.withheld) && casual.withheld > 0;
  if (monthlyAverage <= CASUAL_EXEMPTION_MONTHLY_AVG && withheldOk) {
    return {
      status: "exempt",
      monthlyAverage,
      reason:
        "Thu nhập vãng lai bình quân ≤ 15.000.000 đ/tháng và đã khấu trừ tại nguồn. Không bắt buộc quyết toán phần này (Nghị định 253/2026).",
    };
  }

  return { status: "mandatory_merge", monthlyAverage };
}
