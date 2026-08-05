/** Domain contracts for other income calculators (spec 008). */

export type IncomeType =
  | 'rent'
  | 'hkd'
  | 'securities'
  | 'esop'
  | 'casual_withholding';

export type HkdIndustryId =
  | 'distribution'
  | 'services'
  | 'asset_rental_agency'
  | 'production_transport'
  | 'other';

export type RentInput = {
  /** Doanh thu năm (VND). Có thể = tháng × 12 từ UI. */
  annualRevenue: number;
  taxYear: number;
  asOfDate?: string;
};

export type RentBreakdown = {
  annualRevenue: number;
  threshold: number;
  exempt: boolean;
  reportingRequired: boolean;
  vat: number;
  pit: number;
  totalTax: number;
  formula: string;
  explanations: string[];
  reportingNote?: string;
  rulesetId: string;
  legalSources: string[];
};

export type HkdInput = {
  annualRevenue: number;
  industryId: HkdIndustryId;
  /** Chi phí (tuỳ chọn) — gợi ý PP thu nhập (DT−CP)×15%. */
  costs?: number;
  taxYear: number;
  asOfDate?: string;
};

export type HkdBreakdown = {
  annualRevenue: number;
  industryId: HkdIndustryId;
  industryLabel: string;
  threshold: number;
  exempt: boolean;
  reportingRequired: boolean;
  vat: number;
  pit: number;
  totalTax: number;
  incomeMethodHint?: {
    taxableIncome: number;
    rate: number;
    estimatedTax: number;
    note: string;
  };
  formula: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};

export type SecuritiesInput = {
  transferPrice: number;
  taxYear: number;
  asOfDate: string;
};

export type SecuritiesBreakdown = {
  transferPrice: number;
  rate: number;
  tax: number;
  effective: boolean;
  ineffectivenessReason?: string;
  formula: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};

export type EsopInput = {
  /** Chi phí ghi sổ tại thời điểm trao (ưu tiên). */
  bookCostAtGrant?: number;
  shares?: number;
  parValue?: number;
  amountPaid?: number;
  salePrice: number;
  taxYear: number;
  asOfDate: string;
};

export type EsopBreakdown = {
  bookCost: number;
  usedFallback: boolean;
  tlccWithholding: number;
  transferTax: number;
  totalTax: number;
  effective: boolean;
  ineffectivenessReason?: string;
  settlementNote: string;
  formula: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};

export type CasualWithholdingInput = {
  paymentAmount: number;
  taxYear: number;
  asOfDate?: string;
};

export type CasualWithholdingBreakdown = {
  paymentAmount: number;
  threshold: number;
  rate: number;
  withheld: number;
  netReceived: number;
  withholdingApplied: boolean;
  settlementWarning?: string;
  formula: string;
  explanations: string[];
  rulesetId: string;
  legalSources: string[];
};

/** Shared line items for UI card. */
export type OtherIncomeLine = {
  id: string;
  label: string;
  amount: number;
};
