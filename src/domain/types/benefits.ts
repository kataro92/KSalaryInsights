import type { RegionCode } from "@/src/domain/types/salary";

export type SeveranceMode = "resignation" | "job_loss";

export type SeveranceInput = {
  mode: SeveranceMode;
  /** Tổng thời gian làm việc (năm nguyên). */
  totalYears: number;
  /** Tháng lẻ kèm totalYears (0-11). */
  totalExtraMonths?: number;
  /** Thời gian đã đóng BHTN (năm). */
  bhtnYears: number;
  bhtnExtraMonths?: number;
  /** Thời gian đã được chi trả trợ cấp trước đó (năm). */
  previouslyPaidYears?: number;
  previouslyPaidExtraMonths?: number;
  /** Bình quân lương 6 tháng liền kề. */
  avgSalary6m: number;
  taxYear: number;
  asOfDate?: string;
};

export type SeveranceBreakdown = {
  mode: SeveranceMode;
  yearsCounted: number;
  rateMonthsPerYear: number;
  minMonths: number;
  avgSalary6m: number;
  amount: number;
  formula: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};

export type UnemploymentInput = {
  monthsPaid: number;
  avgSalaryBhtn6m: number;
  region: RegionCode;
  /** Tháng cuối đóng BHTN. Chọn LTTV trần. */
  lastContributionDate: string;
  taxYear: number;
  /** HĐ 1-<12 tháng → lookback 36 tháng thay vì 24 (chỉ checklist). */
  shortTermContract?: boolean;
};

export type UnemploymentBreakdown = {
  eligible: boolean;
  ineligibilityReason?: string;
  monthlyBenefit: number;
  benefitMonths: number;
  totalBenefit: number;
  uncappedMonthly: number;
  capMonthly: number;
  hitCap: boolean;
  regionalMinWage: number;
  formula: string;
  explanations: string[];
  checklist: EligibilityChecklistItem[];
  rulesetId: string;
  legalSources: string[];
};

export type EligibilityChecklistItem = {
  id: string;
  label: string;
};

export type ChildOrder = "first" | "second";

export type MaternityInput = {
  avgSalary6m: number;
  /** YYYY-MM-DD. Chọn reference_salary + số tháng nghỉ. */
  birthDate: string;
  childOrder: ChildOrder;
  /** Số con trong lần sinh (1 = đơn; 2+ = sinh đôi trở lên). */
  numChildren: number;
  /** User xác nhận đủ 6 tháng đóng trong 12 tháng trước sinh. */
  hasMinContribution: boolean;
};

export type MaternityBreakdown = {
  leaveMonths: number;
  monthlyBenefitTotal: number;
  oneTimeAllowance: number;
  oneTimePerChild: number;
  total: number;
  referenceSalary: number;
  twinBonusMonths: number;
  leaveExplanation: string;
  formula: string;
  eligibilityWarning?: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};

export type SickLeaveHazard = "normal" | "hazardous";

export type SickLeaveInput = {
  salaryLastMonth: number;
  daysRequested: number;
  /** Số năm đóng BHXH. Chọn trần ngày/năm. */
  contributionYears?: number;
  hazard?: SickLeaveHazard;
  taxYear: number;
  asOfDate?: string;
};

export type SickLeaveBreakdown = {
  dailyRate: number;
  daysRequested: number;
  daysPaid: number;
  annualCap: number;
  capped: boolean;
  amount: number;
  formula: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};
