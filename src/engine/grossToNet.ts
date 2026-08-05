import { validateDependents } from '@/src/domain/constants/dependents';
import type { SalaryBreakdown, SalaryInput } from '@/src/domain/types/salary';
import { calculateInsurance } from '@/src/engine/insurance';
import { calculatePit } from '@/src/engine/pit';
import { getRuleset } from '@/src/engine/rulesetLoader';

export type GrossToNetParams = {
  gross: number;
  region: SalaryInput['region'];
  taxYear: number;
  asOfDate: string;
  numDependents?: number;
  insuranceSalary?: number;
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
    throw new Error('Gross phải là số dương');
  }

  const dependentsCheck = validateDependents(numDependents);
  if (!dependentsCheck.ok) {
    throw new Error(dependentsCheck.message);
  }

  const ruleset = getRuleset(taxYear, asOfDate);
  const bhBase = insuranceSalary ?? gross;
  if (!Number.isFinite(bhBase) || bhBase < 0) {
    throw new Error('Mức đóng BH không hợp lệ');
  }

  const insurance = calculateInsurance(bhBase, region, ruleset);
  const incomeAfterInsurance = gross - insurance.totalEmployee;
  const pit = calculatePit(incomeAfterInsurance, dependentsCheck.value, ruleset);
  const net = gross - insurance.totalEmployee - pit.totalTax;

  return {
    gross,
    net,
    insurance,
    pit,
    reliefBreakdown: {
      personal: pit.personalRelief,
      dependent: pit.dependentReliefTotal,
      total: pit.personalRelief + pit.dependentReliefTotal,
    },
    rulesetId: ruleset.id,
    legalSources: ruleset.legal_sources,
  };
}
