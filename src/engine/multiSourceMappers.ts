import { DEFAULT_KIND_LABELS_VI } from "@/src/domain/types/multiSource";
import type { MultiSourceLine } from "@/src/domain/types/multiSource";
import type { HkdIndustryId } from "@/src/domain/types/otherIncome";
import { calculateCasualWithholding } from "@/src/engine/otherIncome/casualWithholding";
import { calculateEsop } from "@/src/engine/otherIncome/esop";
import { calculateHkd } from "@/src/engine/otherIncome/hkd";
import { calculateRent } from "@/src/engine/otherIncome/rent";
import { calculateSecuritiesTransfer } from "@/src/engine/otherIncome/securities";

function newLineId(): string {
  return `msl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function taxTotal(vat: number, pit: number, other = 0): number {
  return vat + pit + other;
}

/** Manual salary / settlement line - amounts already estimated by annual settlement. */
export function mapSalaryLine(args: {
  taxYear: number;
  revenueOrIncome: number;
  estimatedPit: number;
  withheld?: number;
  label?: string;
  notes?: string[];
  legalSources?: string[];
  scenarioId?: string;
  dualScenarioHint?: string;
}): MultiSourceLine {
  const notes = [...(args.notes ?? [])];
  if (args.dualScenarioHint) notes.push(args.dualScenarioHint);
  return {
    id: newLineId(),
    kind: "salary",
    label: args.label ?? DEFAULT_KIND_LABELS_VI.salary,
    revenueOrIncome: args.revenueOrIncome,
    estimatedVat: 0,
    estimatedPit: args.estimatedPit,
    estimatedOtherTax: 0,
    estimatedTaxTotal: args.estimatedPit,
    withheld: args.withheld ?? 0,
    notes,
    legalSources: args.legalSources ?? [],
    sourceRef: args.scenarioId
      ? { scenarioId: args.scenarioId, calculator: "settlement" }
      : { calculator: "settlement" },
    excluded: false,
  };
}

export function mapHkdLine(args: {
  annualRevenue: number;
  industryId: HkdIndustryId;
  taxYear: number;
  withheld?: number;
  label?: string;
}): MultiSourceLine {
  const r = calculateHkd({
    annualRevenue: args.annualRevenue,
    industryId: args.industryId,
    taxYear: args.taxYear,
  });
  const notes = [...r.explanations];
  if (r.exempt) {
    notes.push("Miễn thuế tỷ lệ; vẫn có thể phải kê khai / thông báo doanh thu.");
  }
  notes.push("Không gộp vào biểu lũy tiến của lương hợp đồng lao động.");
  return {
    id: newLineId(),
    kind: "hkd",
    label: args.label ?? `${DEFAULT_KIND_LABELS_VI.hkd} · ${r.industryLabel}`,
    revenueOrIncome: r.annualRevenue,
    estimatedVat: r.vat,
    estimatedPit: r.pit,
    estimatedOtherTax: 0,
    estimatedTaxTotal: taxTotal(r.vat, r.pit),
    withheld: args.withheld ?? 0,
    notes,
    legalSources: r.legalSources,
    sourceRef: { calculator: "hkd" },
    excluded: false,
  };
}

export function mapRentLine(args: {
  annualRevenue: number;
  taxYear: number;
  withheld?: number;
  label?: string;
}): MultiSourceLine {
  const r = calculateRent({
    annualRevenue: args.annualRevenue,
    taxYear: args.taxYear,
  });
  const notes = [...r.explanations];
  if (r.reportingNote) notes.push(r.reportingNote);
  notes.push("Không gộp vào biểu lũy tiến của lương hợp đồng lao động.");
  return {
    id: newLineId(),
    kind: "rent",
    label: args.label ?? DEFAULT_KIND_LABELS_VI.rent,
    revenueOrIncome: r.annualRevenue,
    estimatedVat: r.vat,
    estimatedPit: r.pit,
    estimatedOtherTax: 0,
    estimatedTaxTotal: taxTotal(r.vat, r.pit),
    withheld: args.withheld ?? 0,
    notes,
    legalSources: r.legalSources,
    sourceRef: { calculator: "rent" },
    excluded: false,
  };
}

export function mapCasualLine(args: {
  paymentAmount: number;
  taxYear: number;
  /** Override withheld (e.g. user already knows annual total). */
  withheld?: number;
  mandatoryMerge?: boolean;
  label?: string;
}): MultiSourceLine {
  const r = calculateCasualWithholding({
    paymentAmount: args.paymentAmount,
    taxYear: args.taxYear,
  });
  const withheld = args.withheld ?? r.withheld;
  const notes = [...r.explanations];
  if (r.settlementWarning) notes.push(r.settlementWarning);
  if (args.mandatoryMerge) {
    notes.push("Gợi ý hai kịch bản: bắt buộc gộp khi thuộc diện.");
  } else {
    notes.push(
      "Thu nhập vãng lai miễn / dưới ngưỡng: xem hai kịch bản trên Quyết toán lương."
    );
  }
  return {
    id: newLineId(),
    kind: "casual",
    label: args.label ?? DEFAULT_KIND_LABELS_VI.casual,
    revenueOrIncome: args.paymentAmount,
    estimatedVat: 0,
    estimatedPit: withheld,
    estimatedOtherTax: 0,
    estimatedTaxTotal: withheld,
    withheld,
    notes,
    legalSources: r.legalSources,
    sourceRef: { calculator: "casual" },
    excluded: false,
  };
}

export function mapSecuritiesLine(args: {
  transferPrice: number;
  taxYear: number;
  asOfDate?: string;
  withheld?: number;
  label?: string;
}): MultiSourceLine {
  const asOf = args.asOfDate ?? `${args.taxYear}-06-15`;
  const r = calculateSecuritiesTransfer({
    transferPrice: args.transferPrice,
    taxYear: args.taxYear,
    asOfDate: asOf,
  });
  const notes = [...r.explanations];
  notes.push("Không gộp vào biểu lũy tiến của lương hợp đồng lao động.");
  return {
    id: newLineId(),
    kind: "securities",
    label: args.label ?? DEFAULT_KIND_LABELS_VI.securities,
    revenueOrIncome: r.transferPrice,
    estimatedVat: 0,
    estimatedPit: r.tax,
    estimatedOtherTax: 0,
    estimatedTaxTotal: r.tax,
    withheld: args.withheld ?? 0,
    notes,
    legalSources: r.legalSources,
    sourceRef: { calculator: "securities" },
    excluded: false,
  };
}

export function mapEsopLine(args: {
  salePrice: number;
  taxYear: number;
  asOfDate?: string;
  bookCostAtGrant?: number;
  withheld?: number;
  label?: string;
}): MultiSourceLine {
  const asOf = args.asOfDate ?? `${args.taxYear}-06-15`;
  const r = calculateEsop({
    salePrice: args.salePrice,
    taxYear: args.taxYear,
    asOfDate: asOf,
    bookCostAtGrant: args.bookCostAtGrant,
  });
  const notes = [...r.explanations];
  if (r.settlementNote) notes.push(r.settlementNote);
  notes.push(
    "ESOP: phần thu nhập từ cổ phiếu không tự gộp vào dòng lương. Nhập tay nếu cần."
  );
  return {
    id: newLineId(),
    kind: "esop",
    label: args.label ?? DEFAULT_KIND_LABELS_VI.esop,
    revenueOrIncome: args.salePrice,
    estimatedVat: 0,
    estimatedPit: r.transferTax,
    estimatedOtherTax: r.tlccWithholding,
    estimatedTaxTotal: r.totalTax,
    withheld: args.withheld ?? 0,
    notes,
    legalSources: r.legalSources,
    sourceRef: { calculator: "esop" },
    excluded: false,
  };
}
