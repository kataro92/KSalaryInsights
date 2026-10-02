import type { Ruleset } from "@/src/domain/types/salary";
import { roundVnd } from "@/src/domain/constants/salary";
import { nonNegative } from "@/src/engine/deductions";
import { getRuleset } from "@/src/engine/rulesetLoader";

/** Only business parameters are carried into 2027; salary/BH rules are not inferred. */
export function getBusinessRuleset(
  taxYear: number,
  asOfDate?: string,
): Ruleset {
  if (taxYear === 2027) {
    if (asOfDate && !asOfDate.startsWith("2027-"))
      throw new Error("Ngày áp dụng không khớp năm thuế");
    const base = getRuleset(2026);
    return { ...base, id: `${base.id}-business-2027`, tax_year: 2027 };
  }
  return getRuleset(taxYear, asOfDate);
}

export function reduceBusinessPit(
  pit: number,
  revenue: number,
  ruleset: Ruleset,
  rent = false,
) {
  const reduction = ruleset.business_tax_reduction;
  const eligible =
    reduction &&
    reduction.tax_years.includes(ruleset.tax_year) &&
    revenue <= reduction.revenue_cap &&
    (!rent || reduction.includes_rent);
  const pitReduction = eligible ? roundVnd(pit * reduction.rate) : 0;
  return { pitBeforeReduction: pit, pitReduction, pit: pit - pitReduction };
}

export function totalBusinessRevenue(revenue: number, total?: number): number {
  const annual = nonNegative(total ?? revenue, "Tổng doanh thu kinh doanh năm");
  if (annual < revenue)
    throw new Error(
      "Tổng doanh thu kinh doanh không được thấp hơn doanh thu nguồn này",
    );
  return annual;
}
