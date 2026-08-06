import { roundVnd } from "@/src/domain/constants/salary";
import type {
  PaternityLeaveBreakdown,
  PaternityLeaveInput,
} from "@/src/domain/types/benefits";
import { getRuleset } from "@/src/engine/rulesetLoader";

export type PaternityLeaveDaysParams = {
  normal_days: number;
  surgery_or_preterm_days: number;
  twins_days: number;
  twins_surgery_days: number;
  extra_days_per_child_from: number;
  extra_days_per_child: number;
  /** Từ mốc này: vợ sinh con thứ hai → tối thiểu second_child_min_days. */
  second_child_extended_from: string;
  second_child_min_days: number;
};

export type PaternityLeaveDaysResult = {
  leaveDays: number;
  explanation: string;
};

/**
 * Số ngày LV nghỉ của chồng khi vợ sinh (Đ.53 k.2 + sửa Luật Dân số).
 */
export function resolvePaternityLeaveDays(
  input: Pick<
    PaternityLeaveInput,
    "birthDate" | "childOrder" | "numChildren" | "surgeryOrPreterm"
  >,
  params: PaternityLeaveDaysParams
): PaternityLeaveDaysResult {
  const numChildren = Math.max(1, Math.trunc(input.numChildren));
  // twins base; +extra per child from con thứ `extra_days_per_child_from` (thường = 3)
  const multiExtra =
    numChildren >= params.extra_days_per_child_from
      ? (numChildren - (params.extra_days_per_child_from - 1)) *
        params.extra_days_per_child
      : 0;

  const parts: string[] = [];
  let leaveDays: number;

  if (numChildren >= 2) {
    const base = input.surgeryOrPreterm
      ? params.twins_surgery_days
      : params.twins_days;
    leaveDays = base + multiExtra;
    parts.push(
      input.surgeryOrPreterm
        ? `Sinh ${numChildren} con phải phẫu thuật: ${base} ngày`
        : `Sinh ${numChildren} con: ${base} ngày`
    );
    if (multiExtra > 0) {
      parts.push(
        `+${multiExtra} ngày (thêm ${params.extra_days_per_child} ngày/con từ con thứ ${params.extra_days_per_child_from})`
      );
    }
  } else {
    const secondExtended =
      input.childOrder === "second" &&
      input.birthDate >= params.second_child_extended_from;
    if (secondExtended) {
      leaveDays = Math.max(
        params.second_child_min_days,
        input.surgeryOrPreterm
          ? params.surgery_or_preterm_days
          : params.normal_days
      );
      parts.push(
        `Con thứ hai từ ${params.second_child_extended_from}: ${leaveDays} ngày làm việc`
      );
    } else if (input.surgeryOrPreterm) {
      leaveDays = params.surgery_or_preterm_days;
      parts.push(
        `Phẫu thuật hoặc sinh dưới 32 tuần: ${leaveDays} ngày làm việc`
      );
    } else {
      leaveDays = params.normal_days;
      parts.push(`Sinh thường: ${leaveDays} ngày làm việc`);
    }
  }

  return { leaveDays, explanation: parts.join("; ") };
}

function taxYearFromDate(iso: string): number {
  const y = Number(iso.slice(0, 4));
  if (!Number.isInteger(y)) throw new Error("Ngày sinh không hợp lệ");
  return y;
}

export function calculatePaternityLeave(
  input: PaternityLeaveInput
): PaternityLeaveBreakdown {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)) {
    throw new Error("Ngày sinh phải dạng YYYY-MM-DD");
  }
  if (input.avgSalary6m <= 0) {
    throw new Error("Bình quân lương phải > 0");
  }
  if (input.numChildren < 1) {
    throw new Error("Số con phải ≥ 1");
  }

  const taxYear = taxYearFromDate(input.birthDate);
  const ruleset = getRuleset(taxYear, input.birthDate);
  const params = ruleset.paternity_leave;
  if (!params) throw new Error("Thiếu tham số paternity_leave");

  const leave = resolvePaternityLeaveDays(input, params);
  const dailyRate = roundVnd(
    (params.rate * input.avgSalary6m) / params.divisor
  );
  // Đ.59: làm tròn trên tổng ngày × (tháng/24), khớp ví dụ pháp lý phổ biến.
  const amount = roundVnd(
    (params.rate * input.avgSalary6m * leave.leaveDays) / params.divisor
  );

  const explanations: string[] = [
    leave.explanation,
    `Mức/ngày = ${params.rate * 100}% × ${input.avgSalary6m.toLocaleString(
      "vi-VN"
    )} / ${params.divisor} = ${dailyRate.toLocaleString("vi-VN")}.`,
    `Tổng = ${dailyRate.toLocaleString("vi-VN")} × ${
      leave.leaveDays
    } ngày = ${amount.toLocaleString("vi-VN")}.`,
    `Ngày bắt đầu nghỉ phải trong 60 ngày kể từ ngày vợ sinh (Đ.53 k.3).`,
  ];

  const formula = `${dailyRate.toLocaleString("vi-VN")}/ngày × ${
    leave.leaveDays
  } ngày = ${amount.toLocaleString("vi-VN")}`;

  return {
    leaveDays: leave.leaveDays,
    dailyRate,
    amount,
    leaveExplanation: leave.explanation,
    formula,
    explanations,
    checklist: [
      {
        id: "within_60_days",
        label:
          "Ngày bắt đầu nghỉ (lần cuối nếu nghỉ nhiều đợt) trong 60 ngày kể từ ngày vợ sinh.",
      },
      {
        id: "mandatory_si",
        label: "Đang tham gia bảo hiểm xã hội bắt buộc tại thời điểm nghỉ.",
      },
    ],
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      "Luật Bảo hiểm xã hội 41/2024 Đ.53 k.2–3, Đ.59 k.1–2: nghỉ của chồng khi vợ sinh",
      "Luật Dân số 113/2025 Đ.29 k.2: 10 ngày khi vợ sinh con thứ hai / sinh đôi",
    ],
  };
}
