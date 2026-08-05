import { REGION_TO_KEY } from "@/src/domain/constants/salary";
import type { RegionCode, SalaryBreakdown } from "@/src/domain/types/salary";
import { grossToNet } from "@/src/engine/grossToNet";
import { getRuleset } from "@/src/engine/rulesetLoader";

export type NetToGrossParams = {
  net: number;
  region: RegionCode;
  taxYear: number;
  asOfDate: string;
  numDependents?: number;
  /** When true, insurance base tracks candidate gross (default). */
  insuranceTracksGross?: boolean;
  insuranceSalary?: number;
};

export type NetToGrossResult =
  | { ok: true; gross: number; breakdown: SalaryBreakdown }
  | { ok: false; reason: "infeasible"; minFeasibleNet: number };

/**
 * Binary search gross such that grossToNet(gross).net ≈ target net (±1 VND).
 */
export function netToGross(params: NetToGrossParams): NetToGrossResult {
  const {
    net,
    region,
    taxYear,
    asOfDate,
    numDependents = 0,
    insuranceTracksGross = true,
    insuranceSalary,
  } = params;

  if (!Number.isFinite(net) || net <= 0) {
    throw new Error("Net phải là số dương");
  }

  const ruleset = getRuleset(taxYear, asOfDate);
  const minWage = ruleset.regional_minimum_wages[REGION_TO_KEY[region]];
  const minBreakdown = grossToNet({
    gross: minWage,
    region,
    taxYear,
    asOfDate,
    numDependents,
    insuranceSalary: insuranceTracksGross ? minWage : insuranceSalary,
  });

  if (net < minBreakdown.net) {
    return {
      ok: false,
      reason: "infeasible",
      minFeasibleNet: minBreakdown.net,
    };
  }

  let low = minWage;
  let high = Math.max(net * 2, minWage * 2, net + 50_000_000);

  // Expand upper bound until net(high) >= target
  for (let i = 0; i < 20; i++) {
    const hiNet = grossToNet({
      gross: high,
      region,
      taxYear,
      asOfDate,
      numDependents,
      insuranceSalary: insuranceTracksGross ? high : insuranceSalary,
    }).net;
    if (hiNet >= net) break;
    high *= 2;
  }

  let bestGross = high;
  let bestBreakdown = grossToNet({
    gross: high,
    region,
    taxYear,
    asOfDate,
    numDependents,
    insuranceSalary: insuranceTracksGross ? high : insuranceSalary,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const breakdown = grossToNet({
      gross: mid,
      region,
      taxYear,
      asOfDate,
      numDependents,
      insuranceSalary: insuranceTracksGross ? mid : insuranceSalary,
    });
    const diff = breakdown.net - net;
    if (Math.abs(diff) <= 1) {
      return { ok: true, gross: mid, breakdown };
    }
    if (diff < 0) {
      low = mid + 1;
    } else {
      bestGross = mid;
      bestBreakdown = breakdown;
      high = mid - 1;
    }
  }

  // Closest candidate within ±1 after search collapse
  if (Math.abs(bestBreakdown.net - net) <= 1) {
    return { ok: true, gross: bestGross, breakdown: bestBreakdown };
  }

  // Fine scan near best
  for (const g of [bestGross - 1, bestGross, bestGross + 1, low, high]) {
    if (g < minWage) continue;
    const breakdown = grossToNet({
      gross: g,
      region,
      taxYear,
      asOfDate,
      numDependents,
      insuranceSalary: insuranceTracksGross ? g : insuranceSalary,
    });
    if (Math.abs(breakdown.net - net) <= 1) {
      return { ok: true, gross: g, breakdown };
    }
  }

  return { ok: true, gross: bestGross, breakdown: bestBreakdown };
}
