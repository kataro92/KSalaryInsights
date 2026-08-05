/** Domain contracts for retirement / BHXH lump sum (spec 007). */

export type Sex = "male" | "female";

export type EligibilityChecklistItem = {
  id: string;
  label: string;
};

export type DisclaimerAckState = {
  acknowledged: boolean;
  acknowledgedAt?: string;
};

export type LumpSumInput = {
  /** Năm đóng trước 2014 (T1). */
  yearsPre2014: number;
  monthsPre2014?: number;
  /** Năm đóng từ 2014 (T2). */
  yearsFrom2014: number;
  monthsFrom2014?: number;
  /** MBQTL đã trượt giá (VND). */
  adjustedAvgSalary: number;
  /**
   * Ngày tham gia BHXH lần đầu (YYYY-MM-DD). Chọn checklist trước/từ 01/07/2025.
   * Không ảnh hưởng số tiền.
   */
  firstParticipationDate?: string;
  /**
   * Số tiền đã đóng (edge <1 năm). Nếu thiếu, ước = min(đã đóng?, 2×MBQTL).
   */
  amountContributed?: number;
  taxYear?: number;
  asOfDate?: string;
};

export type LumpSumBreakdown = {
  yearsPre2014Rounded: number;
  yearsFrom2014Rounded: number;
  coefficientPre2014: number;
  coefficientFrom2014: number;
  weightedYears: number;
  adjustedAvgSalary: number;
  amount: number;
  underOneYear: boolean;
  formula: string;
  explanations: string[];
  checklist: EligibilityChecklistItem[];
  beforeCutoff: boolean;
  rulesetId: string;
  legalSources: string[];
};

export type PensionInput = {
  sex: Sex;
  /** Tổng năm đóng (đã làm tròn theo Đ.5 k.6 nếu có tháng lẻ). */
  contributionYears: number;
  contributionExtraMonths?: number;
  adjustedAvgSalary: number;
  taxYear?: number;
  asOfDate?: string;
};

export type PensionBreakdown = {
  sex: Sex;
  contributionYears: number;
  rate: number;
  monthlyAmount: number;
  adjustedAvgSalary: number;
  rateSteps: string[];
  formula: string;
  estimateNote: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};

export type InflationAdjustmentTable = {
  table_year: number;
  legal_source: string;
  /** Hệ số theo năm đóng; khóa "pre_1995" cho trước 1995. */
  coefficients_by_year: Record<string, number>;
};
