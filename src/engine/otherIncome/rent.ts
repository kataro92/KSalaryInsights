import { roundVnd } from "@/src/domain/constants/salary";
import type { RentBreakdown, RentInput } from "@/src/domain/types/otherIncome";
import {
  getBusinessRuleset,
  reduceBusinessPit,
  totalBusinessRevenue,
} from "./businessReduction";

/**
 * Cho thuê BĐS. GTGT trên toàn bộ DT khi vượt ngưỡng; TNCN trên phần vượt.
 */
export function calculateRent(input: RentInput): RentBreakdown {
  if (!Number.isFinite(input.annualRevenue) || input.annualRevenue < 0)
    throw new Error("Doanh thu không hợp lệ");

  const asOf = input.asOfDate ?? `${input.taxYear}-06-15`;
  const ruleset = getBusinessRuleset(input.taxYear, asOf);
  const annualTotal = totalBusinessRevenue(
    input.annualRevenue,
    input.totalBusinessRevenue,
  );
  const params = ruleset.other_income?.rent;
  if (!params) throw new Error("Thiếu tham số other_income.rent");

  const threshold = params.exemption_threshold;
  const exempt = input.annualRevenue <= threshold;
  const reportingRequired = true;

  let vat = 0;
  let pit = 0;
  const explanations: string[] = [];

  if (exempt) {
    explanations.push(
      `Doanh thu ${input.annualRevenue.toLocaleString(
        "vi-VN",
      )} ≤ ngưỡng ${threshold.toLocaleString(
        "vi-VN",
      )}. Không phát sinh thuế giá trị gia tăng / thuế thu nhập cá nhân theo tỷ lệ.`,
    );
  } else {
    vat = roundVnd(params.vat_rate * input.annualRevenue);
    const excess = params.pit_on_full_revenue
      ? input.annualRevenue
      : input.annualRevenue - threshold;
    pit = roundVnd(params.pit_rate_on_excess * excess);
    explanations.push(
      `Thuế giá trị gia tăng = ${params.vat_rate * 100}% × toàn bộ doanh thu = ${vat.toLocaleString(
        "vi-VN",
      )}.`,
    );
    explanations.push(
      `Thuế thu nhập cá nhân = ${
        params.pit_rate_on_excess * 100
      }% × ${params.pit_on_full_revenue ? "toàn bộ doanh thu" : "phần vượt ngưỡng"} (${excess.toLocaleString(
        "vi-VN",
      )}) = ${pit.toLocaleString("vi-VN")}.`,
    );
  }

  const reduced = reduceBusinessPit(pit, annualTotal, ruleset, true);
  pit = reduced.pit;
  if (reduced.pitReduction > 0)
    explanations.push(
      `NQ 43/2026/QH16: giảm 30% TNCN (${reduced.pitReduction.toLocaleString("vi-VN")} ₫); GTGT không giảm. Cho thuê thuộc thu nhập kinh doanh (Luật 109 Đ.7 khoản 4, NĐ 68 Đ.4 khoản 4). Cá nhân cư trú có tổng doanh thu kinh doanh năm ≤ 10 tỷ. Vượt 10 tỷ thực tế phải điều chỉnh, nộp bổ sung; không thay tờ khai.`,
    );
  const totalTax = vat + pit;
  const reportingNote =
    input.taxYear === 2025
      ? params.reporting_deadline_note
      : exempt
        ? `Vẫn phải thông báo doanh thu (${params.reporting_form ?? "01/BĐS"}). ${
            params.reporting_deadline_note ?? ""
          }`.trim()
        : undefined;

  if (reportingNote) explanations.push(reportingNote);

  const formula = exempt
    ? "Thuế = 0 (≤ ngưỡng)"
    : `Thuế giá trị gia tăng ${vat.toLocaleString(
        "vi-VN",
      )} + thuế thu nhập cá nhân ${pit.toLocaleString(
        "vi-VN",
      )} = ${totalTax.toLocaleString("vi-VN")}`;

  return {
    annualRevenue: input.annualRevenue,
    threshold,
    exempt,
    reportingRequired,
    vat,
    pit,
    pitBeforeReduction: reduced.pitBeforeReduction,
    pitReduction: reduced.pitReduction,
    totalTax,
    formula,
    explanations,
    reportingNote,
    rulesetId: ruleset.id,
    legalSources: ruleset.legal_sources,
  };
}
