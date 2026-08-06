/** Offer compare domain types (F021). */

import type { InsuranceBasePreset } from "@/src/domain/types/insuranceBase";
import type { CalculationMode, RegionCode } from "@/src/domain/types/salary";

export type OfferSideInput = {
  mode: CalculationMode;
  /** Integer VNĐ (gross or desired net). */
  amount: number;
  insurance: InsuranceBasePreset;
};

export type OfferCompareShared = {
  taxYear: number;
  month: number;
  region: RegionCode;
  numDependents: number;
};

export type OfferSideResult =
  | {
      ok: true;
      gross: number;
      net: number;
      insuranceEmployeeTotal: number;
      pitTotal: number;
      insuranceBaseUsed: number;
      insuranceBaseLabel: string;
      legalSources: string[];
    }
  | {
      ok: false;
      errorMessage: string;
      minFeasibleNet?: number;
      legalSources: string[];
    };

export type OfferCompareResult = {
  shared: OfferCompareShared;
  a: OfferSideResult;
  b: OfferSideResult;
  /** Net(B) − Net(A); only when both ok. */
  deltaNet: number | null;
  /** Gross(B) − Gross(A); only when both ok. */
  deltaGross: number | null;
};

export type OfferCompareInputs = {
  shared: OfferCompareShared;
  offerA: OfferSideInput;
  offerB: OfferSideInput;
};
