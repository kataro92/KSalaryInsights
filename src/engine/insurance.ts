import { REGION_TO_KEY, roundVnd } from "@/src/domain/constants/salary";
import type {
  InsuranceBreakdown,
  RegionCode,
  Ruleset,
} from "@/src/domain/types/salary";

export function calculateInsurance(
  insuranceSalary: number,
  region: RegionCode,
  ruleset: Ruleset
): InsuranceBreakdown {
  const rates = ruleset.insurance_rates.employee;
  const regionKey = REGION_TO_KEY[region];
  const minWage = ruleset.regional_minimum_wages[regionKey];

  const socialHealthCap =
    ruleset.reference_salary * ruleset.insurance_caps.social_health_multiplier;
  const unemploymentCap =
    minWage * ruleset.insurance_caps.unemployment_multiplier;

  const baseSocialHealth = Math.min(insuranceSalary, socialHealthCap);
  const baseUnemployment = Math.min(insuranceSalary, unemploymentCap);

  const social = roundVnd(baseSocialHealth * rates.social);
  const health = roundVnd(baseSocialHealth * rates.health);
  const unemployment = roundVnd(baseUnemployment * rates.unemployment);

  return {
    baseSocialHealth,
    baseUnemployment,
    social,
    health,
    unemployment,
    totalEmployee: social + health + unemployment,
    socialHealthCap,
    unemploymentCap,
  };
}
