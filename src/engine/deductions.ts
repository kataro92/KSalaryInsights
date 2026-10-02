import type { Ruleset } from "@/src/domain/types/salary";
import type { AnnualSettlementInput } from "@/src/domain/types/settlement";
import { validateDependents } from "@/src/domain/constants/dependents";

export function nonNegative(value: number | undefined, label: string): number {
  const n = value ?? 0;
  if (!Number.isFinite(n) || n < 0)
    throw new Error(`${label} phải là số không âm`);
  return n;
}

export function monthCount(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 0 || value > 12)
    throw new Error(`${label} phải từ 0 đến 12`);
  return value;
}

export function dependentReliefYear(
  input: Pick<AnnualSettlementInput, "numDependents" | "dependentPeriods">,
  ruleset: Ruleset,
): number {
  const check = validateDependents(input.numDependents);
  if (!check.ok) throw new Error(check.message);
  if (!input.dependentPeriods)
    return check.value * ruleset.dependent_relief * 12;
  if (input.dependentPeriods.length !== check.value)
    throw new Error("Cần một khoảng đăng ký cho mỗi người phụ thuộc");
  return input.dependentPeriods.reduce((sum, p) => {
    if (
      !Number.isInteger(p.startMonth) ||
      !Number.isInteger(p.endMonth) ||
      p.startMonth < 1 ||
      p.endMonth > 12 ||
      p.endMonth < p.startMonth
    ) {
      throw new Error(
        "Tháng đăng ký người phụ thuộc phải từ 1 đến 12, kết thúc không trước bắt đầu",
      );
    }
    return sum + ruleset.dependent_relief * (p.endMonth - p.startMonth + 1);
  }, 0);
}

export function annualAdditionalRelief(
  input: Pick<
    AnnualSettlementInput,
    | "medicalExpenses"
    | "educationExpenses"
    | "charitableContributions"
    | "voluntaryInsuranceMonthly"
    | "voluntaryInsuranceMonths"
  >,
  ruleset: Ruleset,
) {
  const medical = nonNegative(input.medicalExpenses, "Chi y tế");
  const education = nonNegative(input.educationExpenses, "Chi giáo dục");
  const voluntary = nonNegative(
    input.voluntaryInsuranceMonthly,
    "Bảo hiểm bổ sung",
  );
  const months = monthCount(
    input.voluntaryInsuranceMonths ?? 12,
    "Số tháng đóng bảo hiểm",
  );
  const caps = ruleset.salary_deductions;
  return {
    medical: caps ? Math.min(medical, caps.medical_annual_cap) : 0,
    education: caps ? Math.min(education, caps.education_annual_cap) : 0,
    charity: nonNegative(
      input.charitableContributions,
      "Từ thiện đủ điều kiện",
    ),
    voluntaryInsurance: caps
      ? Math.min(voluntary, caps.voluntary_insurance_monthly_cap) * months
      : 0,
  };
}
