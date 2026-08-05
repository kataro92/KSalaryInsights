import { roundVnd } from "@/src/domain/constants/salary";
import type {
  SeveranceBreakdown,
  SeveranceInput,
} from "@/src/domain/types/benefits";
import { getRuleset } from "@/src/engine/rulesetLoader";

/** Lẻ 1–<6 tháng → ½ năm; ≥6 tháng → 1 năm. */
export function roundServiceYears(wholeYears: number, extraMonths = 0): number {
  const y = Math.max(0, Math.trunc(wholeYears));
  const m = Math.max(0, Math.trunc(extraMonths));
  let extra = 0;
  if (m >= 6) extra = 1;
  else if (m >= 1) extra = 0.5;
  return y + extra;
}

function toMonths(years: number, extraMonths = 0): number {
  return (
    Math.max(0, Math.trunc(years)) * 12 + Math.max(0, Math.trunc(extraMonths))
  );
}

function monthsToRoundedYears(totalMonths: number): number {
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return roundServiceYears(y, m);
}

/**
 * Trợ cấp thôi việc (Đ.46) hoặc mất việc (Đ.47).
 */
export function calcSeverancePay(input: SeveranceInput): SeveranceBreakdown {
  const asOf = input.asOfDate ?? `${input.taxYear}-06-15`;
  const ruleset = getRuleset(input.taxYear, asOf);
  const params = ruleset.severance_pay;
  if (!params) {
    throw new Error("Thiếu tham số severance_pay");
  }

  const totalM = toMonths(input.totalYears, input.totalExtraMonths);
  const bhtnM = toMonths(input.bhtnYears, input.bhtnExtraMonths);
  const paidM = toMonths(
    input.previouslyPaidYears ?? 0,
    input.previouslyPaidExtraMonths
  );
  const countedMonths = Math.max(0, totalM - bhtnM - paidM);
  const yearsCounted = monthsToRoundedYears(countedMonths);

  const rate =
    input.mode === "resignation"
      ? params.resignation_months_per_year
      : params.job_loss_months_per_year;
  const minMonths = input.mode === "job_loss" ? params.job_loss_min_months : 0;

  const rawMonths = rate * yearsCounted;
  const amount =
    yearsCounted <= 0
      ? 0
      : roundVnd(Math.max(rawMonths, minMonths) * input.avgSalary6m);

  const explanations: string[] = [];
  explanations.push(
    `Thời gian tính = tổng − BHTN − đã chi trả = ${countedMonths} tháng → làm tròn ${yearsCounted} năm.`
  );
  if (bhtnM > 0) {
    explanations.push(
      `Đã trừ ${bhtnM} tháng tham gia BHTN khỏi thời gian tính trợ cấp.`
    );
  }
  if (yearsCounted <= 0) {
    explanations.push(
      "Thời gian tính trợ cấp = 0 vì đã tham gia BHTN (và/hoặc đã được chi trả) hết thời gian làm việc. Kết quả 0 là đúng luật, không phải lỗi."
    );
  }
  if (input.mode === "job_loss" && yearsCounted > 0 && rawMonths < minMonths) {
    explanations.push(
      `Áp sàn mất việc tối thiểu ${minMonths} tháng lương (Đ.47).`
    );
  }

  const modeLabel = input.mode === "resignation" ? "thôi việc" : "mất việc";
  const formula =
    yearsCounted <= 0
      ? `0 (không còn thời gian tính ${modeLabel})`
      : input.mode === "job_loss"
      ? `max(${rate} × ${yearsCounted} × ${input.avgSalary6m.toLocaleString(
          "vi-VN"
        )}, ${minMonths} × lương) = ${amount.toLocaleString("vi-VN")}`
      : `${rate} × ${yearsCounted} × ${input.avgSalary6m.toLocaleString(
          "vi-VN"
        )} = ${amount.toLocaleString("vi-VN")}`;

  return {
    mode: input.mode,
    yearsCounted,
    rateMonthsPerYear: rate,
    minMonths,
    avgSalary6m: input.avgSalary6m,
    amount,
    formula,
    explanations,
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      input.mode === "resignation"
        ? "BLLĐ 2019 Đ.46: trợ cấp thôi việc"
        : "BLLĐ 2019 Đ.47: trợ cấp mất việc làm",
    ],
  };
}

export function calcJobLossPay(
  input: Omit<SeveranceInput, "mode">
): SeveranceBreakdown {
  return calcSeverancePay({ ...input, mode: "job_loss" });
}
