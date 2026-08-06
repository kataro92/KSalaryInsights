import type { RegionCode } from "@/src/domain/types/salary";
import type { PitBracketSlice } from "@/src/domain/types/salary";

export type CasualIncomeInput = {
  /** Tổng thu nhập vãng lai trong năm (số nhận). */
  gross: number;
  /** Thuế đã khấu trừ tại nguồn (thường 10%). */
  withheld: number;
};

export type AnnualSettlementInput = {
  taxYear: number;
  region: RegionCode;
  numDependents: number;
  /** Gross/tháng khi dùng chế độ trung bình × số tháng. */
  monthlyGross?: number;
  /** Số tháng có lương (1-12). */
  monthsWorked?: number;
  /** 12 ô tháng. Null/0 = không có lương tháng đó. */
  monthlyGrosses?: (number | null)[];
  /** Thuế TNCN đã khấu trừ từ lương (lũy kế năm). */
  salaryWithheld: number;
  casual?: CasualIncomeInput;
  /** Ngày dùng cho trần BH khi suy từ tháng; mặc định giữa năm. */
  asOfDate?: string;
};

export type SettlementOutcomeKind = "refund" | "pay" | "even";

export type SettlementDelta = {
  /** Thuế năm − đã khấu trừ (>0 nộp thêm, <0 hoàn). */
  signed: number;
  kind: SettlementOutcomeKind;
  /** |signed| khi refund/pay; 0 khi even. */
  amount: number;
};

export type AnnualSettlementBreakdown = {
  incomeAfterInsuranceYear: number;
  casualGrossIncluded: number;
  taxableIncomeYear: number;
  personalReliefYear: number;
  dependentReliefYear: number;
  reliefTotalYear: number;
  taxableIncomeAfterRelief: number;
  brackets: PitBracketSlice[];
  annualTax: number;
  totalWithheld: number;
  salaryWithheld: number;
  casualWithheldIncluded: number;
  delta: SettlementDelta;
  rulesetId: string;
  legalSources: string[];
  withheldMissingWarning: boolean;
};

export type CasualMergeMode =
  | "none"
  | "mandatory_merge"
  | "exempt_no_merge"
  | "voluntary_merge";

export type SettlementScenario = {
  id: CasualMergeMode;
  label: string;
  breakdown: AnnualSettlementBreakdown;
  recommended?: boolean;
};

export type AnnualSettlementResult = {
  primary: SettlementScenario;
  scenarios: SettlementScenario[];
  casualStatus: "none" | "mandatory_merge" | "exempt";
};

export type FilingWizardAnswers = {
  hasSingleEmployerFullYear: boolean;
  hasOtherIncome: boolean;
  employerOffersAuthorization: boolean;
};

export type FilingConclusion = "authorize" | "self_file";

export type FilingWizardResult = {
  conclusion: FilingConclusion;
  checklist: string[];
  orgDeadlineLabel: string;
  individualDeadlineLabel: string;
  notes: string[];
};
