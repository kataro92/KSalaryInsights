import { roundVnd } from "@/src/domain/constants/salary";
import type { HkdBreakdown, HkdInput } from "@/src/domain/types/otherIncome";
import {
  getBusinessRuleset,
  reduceBusinessPit,
  totalBusinessRevenue,
} from "./businessReduction";

/**
 * Hộ kinh doanh. GTGT trên toàn bộ DT khi vượt ngưỡng; TNCN trên phần vượt.
 */
export function calculateHkd(input: HkdInput): HkdBreakdown {
  if (!Number.isFinite(input.annualRevenue) || input.annualRevenue < 0)
    throw new Error("Doanh thu không hợp lệ");

  const asOf = input.asOfDate ?? `${input.taxYear}-06-15`;
  const ruleset = getBusinessRuleset(input.taxYear, asOf);
  const annualTotal = totalBusinessRevenue(
    input.annualRevenue,
    input.totalBusinessRevenue,
  );
  if (input.costs != null && (!Number.isFinite(input.costs) || input.costs < 0))
    throw new Error("Chi phí phải là số không âm");
  const params = ruleset.other_income?.hkd;
  if (!params) throw new Error("Thiếu tham số other_income.hkd");

  const industry = params.industry_rates.find((r) => r.id === input.industryId);
  if (!industry) {
    throw new Error(`Không tìm thấy nhóm ngành ${input.industryId}`);
  }

  const threshold = params.exemption_threshold;
  const exempt = input.annualRevenue <= threshold;
  const reportingRequired = true;
  const explanations: string[] = [];

  const method =
    !params.pit_on_full_revenue && annualTotal > params.income_method_threshold
      ? "income"
      : "revenue";
  if (!exempt && method === "income" && input.costs == null)
    throw new Error(
      "Doanh thu trên 3 tỷ: cần chi phí hợp lệ. Chuyển sang Đầy đủ và nhập chi phí.",
    );
  let vat = 0;
  let pit = 0;

  if (exempt) {
    explanations.push(
      `Doanh thu ${input.annualRevenue.toLocaleString(
        "vi-VN",
      )} ≤ ngưỡng ${threshold.toLocaleString(
        "vi-VN",
      )}. Thuế tỷ lệ = 0; vẫn kê khai doanh thu.`,
    );
  } else {
    vat = roundVnd(industry.vat_rate * input.annualRevenue);
    const excess = params.pit_on_full_revenue
      ? input.annualRevenue
      : input.annualRevenue - threshold;
    const incomeRate =
      annualTotal > (params.income_method_upper_threshold ?? Infinity)
        ? params.income_method_upper_rate!
        : params.income_method_middle_rate!;
    pit =
      method === "income"
        ? roundVnd(Math.max(0, input.annualRevenue - input.costs!) * incomeRate)
        : roundVnd(industry.pit_rate * excess);
    if (method === "income")
      explanations.push(
        `Phương pháp thu nhập: (doanh thu − chi phí hợp lệ) × ${incomeRate * 100}%.`,
      );
    explanations.push(
      `Nhóm «${industry.label}»: thuế giá trị gia tăng ${
        industry.vat_rate * 100
      }% × toàn bộ = ${vat.toLocaleString("vi-VN")}.`,
    );
    if (method === "revenue")
      explanations.push(
        `Thuế thu nhập cá nhân ${industry.pit_rate * 100}% × ${params.pit_on_full_revenue ? "toàn bộ doanh thu" : "phần vượt"} (${excess.toLocaleString(
          "vi-VN",
        )}) = ${pit.toLocaleString("vi-VN")}.`,
      );
  }

  let incomeMethodHint: HkdBreakdown["incomeMethodHint"];
  if (
    !exempt &&
    method === "revenue" &&
    !params.pit_on_full_revenue &&
    input.costs != null &&
    Number.isFinite(input.costs) &&
    input.annualRevenue > 0
  ) {
    const taxableIncome = Math.max(0, input.annualRevenue - input.costs);
    const estimatedTax = reduceBusinessPit(
      roundVnd(params.income_method_rate * taxableIncome),
      annualTotal,
      ruleset,
    ).pit;
    incomeMethodHint = {
      taxableIncome,
      rate: params.income_method_rate,
      estimatedTax,
      note: `Gợi ý so sánh phương pháp thu nhập: (doanh thu − chi phí) × ${
        params.income_method_rate * 100
      }% = ${estimatedTax.toLocaleString("vi-VN")} (không thay thế tờ khai).`,
    };
    explanations.push(incomeMethodHint.note);
  } else if (!exempt && method === "revenue" && !params.pit_on_full_revenue) {
    explanations.push(
      `Doanh thu ≤ ${params.income_method_threshold.toLocaleString(
        "vi-VN",
      )}. Cân nhắc so sánh với phương pháp (doanh thu − chi phí) × ${
        params.income_method_rate * 100
      }%.`,
    );
  }

  const reduced = reduceBusinessPit(pit, annualTotal, ruleset);
  pit = reduced.pit;
  if (reduced.pitReduction > 0)
    explanations.push(
      `NQ 43/2026/QH16: giảm 30% TNCN (${reduced.pitReduction.toLocaleString("vi-VN")} ₫); GTGT không giảm. Cá nhân cư trú có tổng doanh thu kinh doanh năm ≤ 10 tỷ. Nếu doanh thu thực tế vượt 10 tỷ, phải điều chỉnh và nộp bổ sung phần đã giảm. Ước tính, không thay tờ khai.`,
    );
  const totalTax = vat + pit;
  const formula = exempt
    ? "Thuế = 0 (≤ ngưỡng)"
    : `Thuế giá trị gia tăng ${vat.toLocaleString(
        "vi-VN",
      )} + thuế thu nhập cá nhân ${pit.toLocaleString(
        "vi-VN",
      )} = ${totalTax.toLocaleString("vi-VN")}`;

  return {
    annualRevenue: input.annualRevenue,
    industryId: input.industryId,
    industryLabel: industry.label,
    threshold,
    exempt,
    reportingRequired,
    vat,
    pit,
    pitBeforeReduction: reduced.pitBeforeReduction,
    pitReduction: reduced.pitReduction,
    method,
    totalTax,
    incomeMethodHint,
    formula,
    explanations,
    rulesetId: ruleset.id,
    legalSources: ruleset.legal_sources,
  };
}
