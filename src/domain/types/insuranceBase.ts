/** Insurance contribution base presets (F022). */

export type InsuranceBaseMode = "full" | "percent" | "absolute";

export type InsuranceBasePreset =
  | { mode: "full" }
  | { mode: "percent"; percent: number }
  | { mode: "absolute"; absoluteAmount: number };

export type ResolvedGrossToNetInsurance = {
  /** Pass to grossToNet; undefined means base = gross. */
  insuranceSalary: number | undefined;
  /** Base used for display (before statutory caps inside engine). */
  displayBase: number;
  labelVi: string;
  labelEn: string;
};

export const DEFAULT_INSURANCE_PRESET: InsuranceBasePreset = { mode: "full" };
