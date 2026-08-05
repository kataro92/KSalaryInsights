import type { SalaryBreakdown } from "@/src/domain/types/salary";

export type ComparisonDelta = {
  /** year2.tax − year1.tax (negative = save tax in year2) */
  tax: number;
  /** year2.net − year1.net */
  net: number;
};

export type ComparisonResult = {
  year1: SalaryBreakdown;
  year2: SalaryBreakdown;
  year1Label: number;
  year2Label: number;
  delta: ComparisonDelta;
};

export type ComparisonFailure = {
  ok: false;
  code: "missing_ruleset" | "invalid_input";
  message: string;
};

export type ComparisonSuccess = {
  ok: true;
  result: ComparisonResult;
};

export type ComparisonOutcome = ComparisonSuccess | ComparisonFailure;
