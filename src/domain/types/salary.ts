/** Domain contracts for salary calculation (spec 001). */

export type RegionCode = "I" | "II" | "III" | "IV";

export type RegionKey = "1" | "2" | "3" | "4";

export type CalculationMode = "gross-to-net" | "net-to-gross";

export type PitBracket = {
  bracket: number;
  /** Cumulative upper bound of taxable income for this bracket; null = open-ended. */
  max_taxable_income: number | null;
  rate: number;
};

export type Ruleset = {
  id: string;
  version: string;
  name: string;
  tax_year: number;
  effective_from: string;
  effective_to: string;
  legal_sources: string[];
  personal_relief: number;
  dependent_relief: number;
  reference_salary: number;
  regional_minimum_wages: Record<RegionKey, number>;
  insurance_rates: {
    employee: {
      social: number;
      health: number;
      unemployment: number;
    };
    employer: {
      social: number;
      health: number;
      unemployment: number;
      occupational_accident?: number;
    };
  };
  insurance_caps: {
    social_health_multiplier: number;
    unemployment_multiplier: number;
  };
  pit_brackets: PitBracket[];
  severance_pay?: {
    resignation_months_per_year: number;
    job_loss_months_per_year: number;
    job_loss_min_months: number;
  };
  unemployment_benefit?: {
    monthly_rate: number;
    cap_lttv_multiplier: number;
    benefit_months_base: number;
    benefit_months_per_12_paid: number;
    benefit_months_max: number;
    min_paid_months: number;
    waiting_work_days: number;
    benefit_start_work_day: number;
    filing_deadline_months: number;
    lookback_months_standard: number;
    lookback_months_short_contract: number;
  };
  maternity?: {
    rate: number;
    one_time_multiplier: number;
    first_child_months: number;
    second_child_months: number;
    second_child_extended_from: string;
    twin_bonus_from_child: number;
  };
  sick_leave?: {
    rate: number;
    divisor: number;
    /** Trần ngày/năm theo nhóm năm đóng: [ <15, 15–<30, ≥30 ]. */
    annual_day_caps_normal: [number, number, number];
    annual_day_caps_hazardous: [number, number, number];
    /** Ngưỡng năm đóng tương ứng bậc trần: [15, 30]. */
    years_thresholds: [number, number];
  };
  lump_sum_withdrawal?: {
    pre_2014_coefficient: number;
    from_2014_coefficient: number;
    participation_cutoff: string;
    under_one_year_max_months: number;
    conditions_before_cutoff: string[];
    conditions_from_cutoff: string[];
  };
  pension_rates?: {
    female_base_years: number;
    female_base_rate: number;
    female_increment_per_year: number;
    female_max_rate: number;
    female_max_years: number;
    male_long_base_years: number;
    male_long_base_rate: number;
    male_long_increment_per_year: number;
    male_long_max_rate: number;
    male_long_max_years: number;
    male_short_base_years: number;
    male_short_base_rate: number;
    male_short_increment_per_year: number;
    male_short_max_years: number;
    min_years: number;
  };
  inflation_adjustment?: {
    table_year: number;
    note?: string;
  };
  casual_income?: {
    withholding_threshold: number;
    withholding_rate: number;
    exemption_settlement_monthly_avg: number;
  };
  other_income?: {
    rent: {
      exemption_threshold: number;
      vat_rate: number;
      pit_rate_on_excess: number;
      reporting_form?: string;
      reporting_deadline_note?: string;
    };
    hkd: {
      exemption_threshold: number;
      income_method_threshold: number;
      income_method_rate: number;
      industry_rates: Array<{
        id: string;
        label: string;
        vat_rate: number;
        pit_rate: number;
      }>;
    };
    securities: {
      transfer_rate: number;
      effective_from: string;
    };
    esop: {
      tlcc_withholding_rate: number;
      transfer_rate: number;
      effective_from: string;
    };
  };
};

export type SalaryInput = {
  /** Gross salary when mode is gross-to-net; ignored as source when net-to-gross. */
  gross?: number;
  /** Target net when mode is net-to-gross. */
  net?: number;
  region: RegionCode;
  taxYear: number;
  /** YYYY-MM-DD. Selects mid-year insurance caps (e.g. 2026-H1 vs H2). */
  asOfDate: string;
  /**
   * Số người phụ thuộc (NPT).
   * App constraint: `0 ≤ numDependents ≤ 20` (MVP. Chỉ số lượng, không PII).
   */
  numDependents: number;
  /** Insurance contribution base; defaults to gross. */
  insuranceSalary?: number;
};

/** Tách GTGC hiển thị riêng trong breakdown (spec 002). */
export type ReliefBreakdown = {
  personal: number;
  dependent: number;
  total: number;
};

export type InsuranceBreakdown = {
  baseSocialHealth: number;
  baseUnemployment: number;
  social: number;
  health: number;
  unemployment: number;
  totalEmployee: number;
  socialHealthCap: number;
  unemploymentCap: number;
};

export type PitBracketSlice = {
  bracket: number;
  rate: number;
  taxableSlice: number;
  tax: number;
};

export type PitBreakdown = {
  taxableIncome: number;
  personalRelief: number;
  dependentReliefTotal: number;
  incomeAfterInsurance: number;
  brackets: PitBracketSlice[];
  totalTax: number;
};

export type SalaryBreakdown = {
  gross: number;
  net: number;
  insurance: InsuranceBreakdown;
  pit: PitBreakdown;
  reliefBreakdown: ReliefBreakdown;
  rulesetId: string;
  legalSources: string[];
};
