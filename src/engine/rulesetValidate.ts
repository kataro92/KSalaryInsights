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

  // Accept extra optional sections as-is (maternity, etc.). Cast after core checks.
  return o as unknown as Ruleset;
}

export function validateInflationTable(
  raw: unknown
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
