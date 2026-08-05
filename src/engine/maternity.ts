import { roundVnd } from '@/src/domain/constants/salary';
import type {
  MaternityBreakdown,
  MaternityInput,
} from '@/src/domain/types/benefits';
import { getRuleset } from '@/src/engine/rulesetLoader';

export type LeaveMonthsResult = {
  leaveMonths: number;
  baseMonths: number;
  twinBonusMonths: number;
  explanation: string;
};

/**
 * Số tháng nghỉ thai sản: con đầu 6; con thứ hai từ mốc extended → 7;
 * sinh đôi +1 tháng/con từ con thứ twin_bonus_from_child.
 */
export function resolveMaternityLeaveMonths(
  input: Pick<MaternityInput, 'birthDate' | 'childOrder' | 'numChildren'>,
  params: {
    first_child_months: number;
    second_child_months: number;
    second_child_extended_from: string;
    twin_bonus_from_child: number;
  },
): LeaveMonthsResult {
  const numChildren = Math.max(1, Math.trunc(input.numChildren));
  const extended =
    input.childOrder === 'second' &&
    input.birthDate >= params.second_child_extended_from;

  const baseMonths = extended
    ? params.second_child_months
    : params.first_child_months;

  const twinFrom = Math.max(1, params.twin_bonus_from_child);
  // twin_bonus_from_child=2 → +1 tháng cho mỗi con từ con thứ 2
  const twinBonusMonths = Math.max(0, numChildren - (twinFrom - 1));
  const leaveMonths = baseMonths + twinBonusMonths;

  const parts: string[] = [];
  if (extended) {
    parts.push(
      `Con thứ hai từ ${params.second_child_extended_from}: ${baseMonths} tháng`,
    );
  } else if (input.childOrder === 'second') {
    parts.push(
      `Con thứ hai trước ${params.second_child_extended_from}: ${baseMonths} tháng (chưa áp ${params.second_child_months} tháng)`,
    );
  } else {
    parts.push(`Con đầu: ${baseMonths} tháng`);
  }
  if (twinBonusMonths > 0) {
    parts.push(
      `+${twinBonusMonths} tháng do sinh ${numChildren} con (từ con thứ ${twinFrom})`,
    );
  }

  return {
    leaveMonths,
    baseMonths,
    twinBonusMonths,
    explanation: parts.join('; '),
  };
}

function taxYearFromDate(iso: string): number {
  const y = Number(iso.slice(0, 4));
  if (!Number.isInteger(y)) throw new Error('Ngày sinh không hợp lệ');
  return y;
}

export function calculateMaternity(input: MaternityInput): MaternityBreakdown {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)) {
    throw new Error('Ngày sinh phải dạng YYYY-MM-DD');
  }
  if (input.avgSalary6m <= 0) {
    throw new Error('Bình quân lương phải > 0');
  }
  if (input.numChildren < 1) {
    throw new Error('Số con phải ≥ 1');
  }

  const taxYear = taxYearFromDate(input.birthDate);
  const ruleset = getRuleset(taxYear, input.birthDate);
  const params = ruleset.maternity;
  if (!params) throw new Error('Ruleset thiếu maternity');

  const leave = resolveMaternityLeaveMonths(input, params);
  const monthlyBenefitTotal = roundVnd(
    params.rate * input.avgSalary6m * leave.leaveMonths,
  );
  const oneTimePerChild = roundVnd(
    params.one_time_multiplier * ruleset.reference_salary,
  );
  const oneTimeAllowance = roundVnd(oneTimePerChild * input.numChildren);
  const total = monthlyBenefitTotal + oneTimeAllowance;

  const explanations: string[] = [
    leave.explanation,
    `Tiền chế độ = ${params.rate * 100}% × ${input.avgSalary6m.toLocaleString('vi-VN')} × ${leave.leaveMonths} = ${monthlyBenefitTotal.toLocaleString('vi-VN')}.`,
    `Trợ cấp 1 lần = ${params.one_time_multiplier} × mức tham chiếu ${ruleset.reference_salary.toLocaleString('vi-VN')} × ${input.numChildren} con = ${oneTimeAllowance.toLocaleString('vi-VN')}.`,
  ];
  if (leave.twinBonusMonths > 0) {
    explanations.push(
      `+${leave.twinBonusMonths} tháng do sinh đôi (từ con thứ ${params.twin_bonus_from_child}).`,
    );
  }

  let eligibilityWarning: string | undefined;
  if (!input.hasMinContribution) {
    eligibilityWarning =
      'Có thể không đủ điều kiện hưởng nếu chưa đóng đủ 6 tháng BHXH trong 12 tháng trước sinh — đây chỉ là ước tính.';
  }

  const formula = `${monthlyBenefitTotal.toLocaleString('vi-VN')} (chế độ) + ${oneTimeAllowance.toLocaleString('vi-VN')} (1 lần) = ${total.toLocaleString('vi-VN')}`;

  return {
    leaveMonths: leave.leaveMonths,
    monthlyBenefitTotal,
    oneTimeAllowance,
    oneTimePerChild,
    total,
    referenceSalary: ruleset.reference_salary,
    twinBonusMonths: leave.twinBonusMonths,
    leaveExplanation: leave.explanation,
    formula,
    eligibilityWarning,
    explanations,
    rulesetId: ruleset.id,
    legalSources: [
      ...ruleset.legal_sources,
      'Luật BHXH 41/2024 Đ.53/58/59 — thai sản',
      'Luật Dân số 113/2025 Đ.14/29 — tháng nghỉ con thứ hai',
      'NĐ 161/2026 — mức tham chiếu',
    ],
  };
}
