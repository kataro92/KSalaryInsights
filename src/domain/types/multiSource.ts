/** Multi-source annual tax summary (F020). No crypto kinds. */

import type { RegionCode } from "@/src/domain/types/salary";
import type { SettlementOutcomeKind } from "@/src/domain/types/settlement";

export const MULTI_SOURCE_KINDS = [
  "salary",
  "casual",
  "hkd",
  "rent",
  "securities",
  "esop",
] as const;

export type MultiSourceKind = (typeof MULTI_SOURCE_KINDS)[number];

export type MultiSourceSourceRef = {
  scenarioId?: string;
  calculator?: string;
};

export type MultiSourceLine = {
  id: string;
  kind: MultiSourceKind;
  label: string;
  revenueOrIncome: number;
  estimatedVat: number;
  estimatedPit: number;
  estimatedOtherTax: number;
  estimatedTaxTotal: number;
  withheld: number;
  notes: string[];
  legalSources: string[];
  sourceRef?: MultiSourceSourceRef;
  excluded: boolean;
};

export type MultiSourceAnnualSummary = {
  id: string;
  taxYear: number;
  region?: RegionCode;
  name?: string;
  createdAt?: string;
  updatedAt: string;
  lines: MultiSourceLine[];
};

export type MultiSourceTotals = {
  estimatedTax: number;
  withheld: number;
  deltaSigned: number;
  deltaKind: SettlementOutcomeKind;
};

export type FilingWizardImpact = {
  hasNonSalarySources: boolean;
  forceSelfFile: boolean;
};

export const MAX_MULTI_SOURCE_LINES = 20;

export const DEFAULT_KIND_LABELS_VI: Record<MultiSourceKind, string> = {
  salary: "Lương HĐLĐ",
  casual: "Vãng lai",
  hkd: "Hộ / cá nhân KD",
  rent: "Cho thuê BĐS",
  securities: "Chứng khoán",
  esop: "ESOP",
};
