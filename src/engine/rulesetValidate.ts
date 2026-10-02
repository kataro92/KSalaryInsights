/**
 * Structural validation for remote rulesets (ADR 0008).
 * Not full JSON Schema. Enough to reject garbage before merge.
 */

import type { InflationAdjustmentTable } from "@/src/domain/types/retirement";
import type { RegionKey, Ruleset } from "@/src/domain/types/salary";

const REGION_KEYS: RegionKey[] = ["1", "2", "3", "4"];

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function isDateLike(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function isRate(v: unknown): v is number {
  return isFiniteNumber(v) && v >= 0 && v <= 1;
}

/** Compare semver-ish `a` vs `b`: 1 if a>b, -1 if a<b, 0 if equal/unparseable equal. */
export function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map((x) => Number.parseInt(x, 10) || 0);
  const pb = b.split(".").map((x) => Number.parseInt(x, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da > db) return 1;
    if (da < db) return -1;
  }
  return 0;
}

export function validateRuleset(raw: unknown): Ruleset | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  if (!isNonEmptyString(o.id)) return null;
  if (!isNonEmptyString(o.version)) return null;
  if (!isNonEmptyString(o.name)) return null;
  if (typeof o.tax_year !== "number" || !Number.isInteger(o.tax_year))
    return null;
  if (o.tax_year < 2020 || o.tax_year > 2100) return null;
  if (!isDateLike(o.effective_from) || !isDateLike(o.effective_to)) return null;
  if (!Array.isArray(o.legal_sources) || o.legal_sources.length < 1)
    return null;
  if (!o.legal_sources.every(isNonEmptyString)) return null;
  if (!isFiniteNumber(o.personal_relief) || o.personal_relief < 0) return null;
  if (!isFiniteNumber(o.dependent_relief) || o.dependent_relief < 0)
    return null;
  if (!isFiniteNumber(o.reference_salary) || o.reference_salary < 0)
    return null;

  const wages = o.regional_minimum_wages;
  if (!wages || typeof wages !== "object") return null;
  const w = wages as Record<string, unknown>;
  for (const k of REGION_KEYS) {
    if (!isFiniteNumber(w[k]) || w[k] < 0) return null;
  }

  const rates = o.insurance_rates;
  if (!rates || typeof rates !== "object") return null;
  const ir = rates as Record<string, unknown>;
  const emp = ir.employee as Record<string, unknown> | undefined;
  const er = ir.employer as Record<string, unknown> | undefined;
  if (!emp || !er) return null;
  if (!isRate(emp.social) || !isRate(emp.health) || !isRate(emp.unemployment))
    return null;
  if (!isRate(er.social) || !isRate(er.health) || !isRate(er.unemployment))
    return null;

  const caps = o.insurance_caps;
  if (!caps || typeof caps !== "object") return null;
  const c = caps as Record<string, unknown>;
  if (
    !isFiniteNumber(c.social_health_multiplier) ||
    c.social_health_multiplier < 1
  )
    return null;
  if (
    !isFiniteNumber(c.unemployment_multiplier) ||
    c.unemployment_multiplier < 1
  )
    return null;

  if (!Array.isArray(o.pit_brackets) || o.pit_brackets.length < 1) return null;
  for (const br of o.pit_brackets) {
    if (!br || typeof br !== "object") return null;
    const b = br as Record<string, unknown>;
    if (typeof b.bracket !== "number" || !Number.isInteger(b.bracket))
      return null;
    if (b.max_taxable_income != null && !isFiniteNumber(b.max_taxable_income))
      return null;
    if (!isRate(b.rate)) return null;
  }

  if (o.salary_deductions != null) {
    if (typeof o.salary_deductions !== "object") return null;
    const d = o.salary_deductions as Record<string, unknown>;
    for (const key of [
      "medical_annual_cap",
      "education_annual_cap",
      "voluntary_insurance_monthly_cap",
      "meal_monthly_cap",
    ]) {
      if (!isFiniteNumber(d[key]) || d[key] < 0) return null;
    }
    if (!isDateLike(d.meal_effective_from) || o.tax_year < 2026) return null;
  }
  if (o.business_tax_reduction != null) {
    if (typeof o.business_tax_reduction !== "object") return null;
    const d = o.business_tax_reduction as Record<string, unknown>;
    if (
      !isRate(d.rate) ||
      !isFiniteNumber(d.revenue_cap) ||
      d.revenue_cap <= 0 ||
      typeof d.includes_rent !== "boolean"
    )
      return null;
    if (
      !Array.isArray(d.tax_years) ||
      d.tax_years.length === 0 ||
      !d.tax_years.every((y) => Number.isInteger(y) && y >= 2026 && y <= 2100)
    )
      return null;
    if (!d.tax_years.includes(o.tax_year)) return null;
  }
  if (o.other_income != null) {
    if (typeof o.other_income !== "object") return null;
    const other = o.other_income as Record<string, unknown>;
    for (const key of ["rent", "hkd"]) {
      if (!other[key] || typeof other[key] !== "object") return null;
      const p = other[key] as Record<string, unknown>;
      if (!isFiniteNumber(p.exemption_threshold) || p.exemption_threshold < 0)
        return null;
      if (
        p.pit_on_full_revenue != null &&
        typeof p.pit_on_full_revenue !== "boolean"
      )
        return null;
    }
    const rent = other.rent as Record<string, unknown>;
    if (!isRate(rent.vat_rate) || !isRate(rent.pit_rate_on_excess)) return null;
    const hkd = other.hkd as Record<string, unknown>;
    if (
      !isFiniteNumber(hkd.income_method_threshold) ||
      hkd.income_method_threshold <= 0 ||
      !isRate(hkd.income_method_rate)
    )
      return null;
    for (const key of [
      "income_method_middle_rate",
      "income_method_upper_rate",
    ]) {
      if (hkd[key] != null && !isRate(hkd[key])) return null;
    }
    if (
      hkd.income_method_upper_threshold != null &&
      (!isFiniteNumber(hkd.income_method_upper_threshold) ||
        hkd.income_method_upper_threshold <= hkd.income_method_threshold)
    )
      return null;
    if (
      o.tax_year >= 2026 &&
      (!isRate(hkd.income_method_middle_rate) ||
        !isRate(hkd.income_method_upper_rate) ||
        !isFiniteNumber(hkd.income_method_upper_threshold))
    )
      return null;
    if (!Array.isArray(hkd.industry_rates) || hkd.industry_rates.length === 0)
      return null;
    const ids = new Set<string>();
    for (const raw of hkd.industry_rates) {
      if (!raw || typeof raw !== "object") return null;
      const row = raw as Record<string, unknown>;
      if (
        !isNonEmptyString(row.id) ||
        ids.has(row.id) ||
        !isNonEmptyString(row.label) ||
        !isRate(row.vat_rate) ||
        !isRate(row.pit_rate)
      )
        return null;
      ids.add(row.id);
    }
  }
  return o as unknown as Ruleset;
}

export function validateInflationTable(
  raw: unknown,
): InflationAdjustmentTable | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.table_year !== "number" || !Number.isInteger(o.table_year))
    return null;
  if (!isNonEmptyString(o.legal_source)) return null;
  if (!o.coefficients_by_year || typeof o.coefficients_by_year !== "object")
    return null;
  const coeffs = o.coefficients_by_year as Record<string, unknown>;
  for (const [k, v] of Object.entries(coeffs)) {
    if (k !== "pre_1995" && !/^\d{4}$/.test(k)) return null;
    if (!isFiniteNumber(v) || v <= 0) return null;
  }
  return o as unknown as InflationAdjustmentTable;
}

export type RulesetManifestEntry = {
  id: string;
  version: string;
  url: string;
  sha256: string;
};

export type InflationManifestEntry = {
  year: number;
  url: string;
  sha256: string;
};

export type RulesetManifest = {
  schemaVersion: 1;
  generatedAt: string;
  rulesets: RulesetManifestEntry[];
  inflation?: InflationManifestEntry[];
};

export function parseRulesetManifest(raw: unknown): RulesetManifest | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.schemaVersion !== 1) return null;
  if (!isNonEmptyString(o.generatedAt)) return null;
  if (!Array.isArray(o.rulesets)) return null;

  const rulesets: RulesetManifestEntry[] = [];
  for (const item of o.rulesets) {
    if (!item || typeof item !== "object") return null;
    const e = item as Record<string, unknown>;
    if (!isNonEmptyString(e.id) || !isNonEmptyString(e.version)) return null;
    if (!isNonEmptyString(e.url) || !isNonEmptyString(e.sha256)) return null;
    if (!/^[a-f0-9]{64}$/i.test(e.sha256)) return null;
    rulesets.push({
      id: e.id,
      version: e.version,
      url: e.url,
      sha256: e.sha256.toLowerCase(),
    });
  }

  let inflation: InflationManifestEntry[] | undefined;
  if (o.inflation != null) {
    if (!Array.isArray(o.inflation)) return null;
    inflation = [];
    for (const item of o.inflation) {
      if (!item || typeof item !== "object") return null;
      const e = item as Record<string, unknown>;
      if (typeof e.year !== "number" || !Number.isInteger(e.year)) return null;
      if (!isNonEmptyString(e.url) || !isNonEmptyString(e.sha256)) return null;
      if (!/^[a-f0-9]{64}$/i.test(e.sha256)) return null;
      inflation.push({
        year: e.year,
        url: e.url,
        sha256: e.sha256.toLowerCase(),
      });
    }
  }

  return {
    schemaVersion: 1,
    generatedAt: o.generatedAt,
    rulesets,
    inflation,
  };
}
