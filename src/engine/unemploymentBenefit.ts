import { REGION_TO_KEY, roundVnd } from "@/src/domain/constants/salary";
import type {
  EligibilityChecklistItem,
  UnemploymentBreakdown,
  UnemploymentInput,
} from "@/src/domain/types/benefits";
import { getRuleset } from "@/src/engine/rulesetLoader";

function benefitMonthsFromPaid(
  monthsPaid: number,
  base: number,
  per12: number,
  max: number
): number {
  if (monthsPaid < 36) {
    return base;
  }
  return Math.min(max, base + Math.floor((monthsPaid - 36) / 12) * per12);
}

/**
 * Trợ cấp thất nghiệp (BHTN). Mức tháng = min(60% × lương BQ 6 tháng, 5×LTTV).
 */
export function calcUnemploymentBenefit(
  input: UnemploymentInput
): UnemploymentBreakdown {
  const ruleset = getRuleset(input.taxYear, input.lastContributionDate);
  const params = ruleset.unemployment_benefit;
  if (!params) {
    throw new Error("Thiếu tham số unemployment_benefit");
  }

  const regionalMinWage =
    ruleset.regional_minimum_wages[REGION_TO_KEY[input.region]];
  const capMonthly = roundVnd(params.cap_lttv_multiplier * regionalMinWage);
  const uncappedMonthly = roundVnd(params.monthly_rate * input.avgSalaryBhtn6m);
  const monthlyBenefit = Math.min(uncappedMonthly, capMonthly);
  const hitCap = uncappedMonthly > capMonthly;

  const lookback = input.shortTermContract
    ? params.lookback_months_short_contract
    : params.lookback_months_standard;

  const checklist: EligibilityChecklistItem[] = [
    {
      id: "paid_min",
      label: `Đóng đủ ít nhất ${
        params.min_paid_months
      } tháng bảo hiểm thất nghiệp trong ${lookback} tháng trước khi thất nghiệp${
        input.shortTermContract ? " (hợp đồng ngắn: xét 36 tháng)" : ""
      }.`,
    },
    {
      id: "file_deadline",
      label: `Nộp hồ sơ hưởng trong ${params.filing_deadline_months} tháng kể từ ngày chấm dứt hợp đồng lao động.`,
    },
    {
      id: "waiting",
      label: `Sau ${params.waiting_work_days} ngày làm việc kể từ ngày nộp hồ sơ mà chưa có việc làm.`,
    },
    {
      id: "start_day",
      label: `Thời điểm hưởng trợ cấp: ngày làm việc thứ ${params.benefit_start_work_day}.`,
    },
  ];

  const explanations: string[] = [];
  const legalSources = [
    ...ruleset.legal_sources,
    "Luật Việc làm. Trợ cấp thất nghiệp",
  ];

  if (input.monthsPaid < params.min_paid_months) {
    return {
      eligible: false,
      ineligibilityReason: `Chưa đủ ${params.min_paid_months} tháng đóng bảo hiểm thất nghiệp (đang có ${input.monthsPaid} tháng).`,
      monthlyBenefit: 0,
      benefitMonths: 0,
      totalBenefit: 0,
      uncappedMonthly,
      capMonthly,
      hitCap: false,
      regionalMinWage,
      formula: "Không đủ điều kiện hưởng",
      explanations: [
        `Cần tối thiểu ${params.min_paid_months} tháng đóng; hiện tại ${input.monthsPaid} tháng.`,
      ],
      checklist,
      rulesetId: ruleset.id,
      legalSources,
    };
  }

  const benefitMonths = benefitMonthsFromPaid(
    input.monthsPaid,
    params.benefit_months_base,
    params.benefit_months_per_12_paid,
    params.benefit_months_max
  );
  const totalBenefit = roundVnd(monthlyBenefit * benefitMonths);

  explanations.push(
    `Mức tháng = ${
      params.monthly_rate * 100
    }% × ${input.avgSalaryBhtn6m.toLocaleString(
      "vi-VN"
    )} = ${uncappedMonthly.toLocaleString("vi-VN")}.`
  );
  explanations.push(
    `Trần = ${params.cap_lttv_multiplier} × LTTV vùng ${
      input.region
    } (${regionalMinWage.toLocaleString(
      "vi-VN"
    )}) = ${capMonthly.toLocaleString("vi-VN")} (mức ${ruleset.id.replace(
      /^ruleset-/,
      ""
    )}, ngày cuối đóng ${input.lastContributionDate}).`
  );
  if (hitCap) {
    explanations.push("Đã chạm trần 5× LTTV. Không áp trần lương cơ sở.");
  }
  explanations.push(
    `Số tháng hưởng = min(${params.benefit_months_max}, ${params.benefit_months_base} + floor((${input.monthsPaid}−36)/12)) = ${benefitMonths}.`
  );

  const formula = `${monthlyBenefit.toLocaleString(
    "vi-VN"
  )}/tháng × ${benefitMonths} tháng = ${totalBenefit.toLocaleString("vi-VN")}`;

  return {
    eligible: true,
    monthlyBenefit,
    benefitMonths,
    totalBenefit,
    uncappedMonthly,
    capMonthly,
    hitCap,
    regionalMinWage,
    formula,
    explanations,
    checklist,
    rulesetId: ruleset.id,
    legalSources,
  };
}
