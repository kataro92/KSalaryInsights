import { validateDependents } from "@/src/domain/constants/dependents";
import type { SalaryBreakdown, SalaryInput } from "@/src/domain/types/salary";
import { calculateInsurance } from "@/src/engine/insurance";
import { calculatePit } from "@/src/engine/pit";
import { getRuleset } from "@/src/engine/rulesetLoader";
import { nonNegative } from "@/src/engine/deductions";

export type GrossToNetParams = {
  gross: number;
  region: SalaryInput["region"];
  taxYear: number;
  asOfDate: string;
  numDependents?: number;
  insuranceSalary?: number;
  mealAllowance?: number;
  exemptAllowances?: number;
  voluntaryInsurance?: number;
};

export function grossToNet(params: GrossToNetParams): SalaryBreakdown {
  const {
    gross,
    region,
    taxYear,
    asOfDate,
    numDependents = 0,
    insuranceSalary,
  } = params;

  if (!Number.isFinite(gross) || gross <= 0) {
    throw new Error("Gross phải là số dương");
  }

  const dependentsCheck = validateDependents(numDependents);
  if (!dependentsCheck.ok) {
    throw new Error(dependentsCheck.message);
  }

  const ruleset = getRuleset(taxYear, asOfDate);
  const bhBase = insuranceSalary ?? gross;
  if (!Number.isFinite(bhBase) || bhBase < 0) {
    throw new Error("Mức đóng bảo hiểm không hợp lệ");
  }

  const insurance = calculateInsurance(bhBase, region, ruleset);
  const caps = ruleset.salary_deductions;
  const meal = nonNegative(params.mealAllowance, "Tiền ăn trong Gross");
  const exemptAllowances = nonNegative(
    params.exemptAllowances,
    "Phụ cấp miễn thuế trong Gross",
  );
  if (meal + exemptAllowances > gross)
    throw new Error("Tiền ăn và phụ cấp trong Gross không được vượt Gross");
  const voluntary = nonNegative(params.voluntaryInsurance, "Bảo hiểm bổ sung");
  const mealExempt =
    caps && asOfDate >= caps.meal_effective_from
      ? Math.min(meal, caps.meal_monthly_cap)
      : 0;
  const voluntaryInsurance = caps
    ? Math.min(voluntary, caps.voluntary_insurance_monthly_cap)
    : 0;
  const incomeAfterInsurance = Math.max(
    0,
    gross - insurance.totalEmployee - mealExempt - exemptAllowances,
  );
  const pit = calculatePit(
    Math.max(0, incomeAfterInsurance - voluntaryInsurance),
    dependentsCheck.value,
    ruleset,
  );
  const net = gross - insurance.totalEmployee - pit.totalTax;
  pit.incomeAfterInsurance = incomeAfterInsurance;

  return {
    gross,
    net,
    insurance,
    pit,
    reliefBreakdown: {
      personal: pit.personalRelief,
      dependent: pit.dependentReliefTotal,
      total: pit.personalRelief + pit.dependentReliefTotal + voluntaryInsurance,
    },
    rulesetId: ruleset.id,
    legalSources: ruleset.legal_sources,
    deductions: { mealExempt, exemptAllowances, voluntaryInsurance },
  };
}
