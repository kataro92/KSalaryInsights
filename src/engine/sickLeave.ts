import { roundVnd } from "@/src/domain/constants/salary";
import type {
  SickLeaveBreakdown,
  SickLeaveInput,
} from "@/src/domain/types/benefits";
import { getRuleset } from "@/src/engine/rulesetLoader";

function resolveAnnualCap(
  years: number,
  thresholds: [number, number],
  caps: [number, number, number]
): number {
  const y = Math.max(0, years);
  if (y < thresholds[0]) return caps[0];
  if (y < thresholds[1]) return caps[1];
  return caps[2];
}

/**
 * Ốm đau V1: days × (rate × lương / divisor), cắt theo trần ngày/năm.
 */
export function calculateSickLeave(input: SickLeaveInput): SickLeaveBreakdown {
  if (input.salaryLastMonth <= 0) {
    throw new Error("Lương tháng liền kề phải > 0");
  }
  if (input.daysRequested < 0 || !Number.isFinite(input.daysRequested)) {
    throw new Error("Số ngày nghỉ không hợp lệ");
  }

  const asOf = input.asOfDate ?? `${input.taxYear}-06-15`;
  const ruleset = getRuleset(input.taxYear, asOf);
  const params = ruleset.sick_leave;
  if (!params) throw new Error("Thiếu tham số sick_leave");

  const hazard = input.hazard ?? "normal";
  const caps =
    hazard === "hazardous"
      ? params.annual_day_caps_hazardous
      : params.annual_day_caps_normal;
  const years = input.contributionYears ?? 0;
  const annualCap = resolveAnnualCap(years, params.years_thresholds, caps);

  const daysRequested = Math.trunc(input.daysRequested);
  const daysPaid = Math.min(daysRequested, annualCap);
  const capped = daysRequested > annualCap;

  const dailyRate = roundVnd(
    (params.rate * input.salaryLastMonth) / params.divisor
  );
  const amount = roundVnd(dailyRate * daysPaid);

  const explanations: string[] = [
    `Mức/ngày = ${params.rate * 100}% × ${input.salaryLastMonth.toLocaleString(
      "vi-VN"
    )} / ${params.divisor} = ${dailyRate.toLocaleString("vi-VN")}.`,
    `Trần năm (${
      hazard === "hazardous" ? "nặng nhọc" : "bình thường"
    }, ${years} năm đóng) = ${annualCap} ngày.`,
  ];
  if (capped) {
    explanations.push(
      `Yêu cầu ${daysRequested} ngày vượt trần. Chỉ tính ${daysPaid} ngày.`
    );
  }

  const formula = `${dailyRate.toLocaleString(
    "vi-VN"
  )}/ngày × ${daysPaid} ngày = ${amount.toLocaleString("vi-VN")} (${
    params.rate * 100
  }%/${params.divisor})`;

  return {
    dailyRate,
    daysRequested,
    daysPaid,
    annualCap,
    capped,
    amount,
    formula,
    explanations,
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      "Luật BHXH 41/2024 Đ.43/45: ốm đau",
    ],
  };
}
