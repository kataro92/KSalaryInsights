import { roundVnd } from '@/src/domain/constants/salary';
import type { PitBracketSlice, PitBreakdown, Ruleset } from '@/src/domain/types/salary';

/**
 * Progressive PIT on monthly taxable income (TNTT).
 * Each bracket slice is rounded to whole VND before summing.
 */
export function calculatePit(
  incomeAfterInsurance: number,
  numDependents: number,
  ruleset: Ruleset,
): PitBreakdown {
  const personalRelief = ruleset.personal_relief;
  const dependentReliefTotal = numDependents * ruleset.dependent_relief;
  const taxableIncome = Math.max(
    0,
    incomeAfterInsurance - personalRelief - dependentReliefTotal,
  );

  const brackets: PitBracketSlice[] = [];
  let remaining = taxableIncome;
  let lower = 0;
  let totalTax = 0;

  for (const b of ruleset.pit_brackets) {
    if (remaining <= 0) break;
    const upper = b.max_taxable_income;
    const width = upper == null ? Number.POSITIVE_INFINITY : upper - lower;
    const slice = Math.min(remaining, width);
    if (slice <= 0) {
      lower = upper ?? lower;
      continue;
    }
    const tax = roundVnd(slice * b.rate);
    brackets.push({
      bracket: b.bracket,
      rate: b.rate,
      taxableSlice: slice,
      tax,
    });
    totalTax += tax;
    remaining -= slice;
    lower = upper ?? lower;
  }

  return {
    taxableIncome,
    personalRelief,
    dependentReliefTotal,
    incomeAfterInsurance,
    brackets,
    totalTax,
  };
}

/**
 * Progressive PIT on annual TNTT — bracket ceilings = monthly max × 12.
 */
export function calculateAnnualPit(
  taxableIncomeYear: number,
  ruleset: Ruleset,
): { brackets: PitBracketSlice[]; totalTax: number } {
  const brackets: PitBracketSlice[] = [];
  let remaining = Math.max(0, taxableIncomeYear);
  let lower = 0;
  let totalTax = 0;

  for (const b of ruleset.pit_brackets) {
    if (remaining <= 0) break;
    const upper =
      b.max_taxable_income == null ? null : b.max_taxable_income * 12;
    const width = upper == null ? Number.POSITIVE_INFINITY : upper - lower;
    const slice = Math.min(remaining, width);
    if (slice <= 0) {
      lower = upper ?? lower;
      continue;
    }
    const tax = roundVnd(slice * b.rate);
    brackets.push({
      bracket: b.bracket,
      rate: b.rate,
      taxableSlice: slice,
      tax,
    });
    totalTax += tax;
    remaining -= slice;
    lower = upper ?? lower;
  }

  return { brackets, totalTax };
}
