import type {
  FilingWizardImpact,
  MultiSourceAnnualSummary,
  MultiSourceKind,
  MultiSourceLine,
  MultiSourceTotals,
} from "@/src/domain/types/multiSource";
import { MULTI_SOURCE_KINDS } from "@/src/domain/types/multiSource";

const KIND_SET = new Set<string>(MULTI_SOURCE_KINDS);

export function isMultiSourceKind(v: unknown): v is MultiSourceKind {
  return typeof v === "string" && KIND_SET.has(v);
}

/** Reject crypto / unknown kinds (FR-006 / US3). */
export function assertAllowedKind(kind: unknown): MultiSourceKind {
  if (kind === "crypto" || kind === "digital_asset" || kind === "coin") {
    throw new Error(
      "Loại nguồn không hỗ trợ: thuế tài sản mã hóa / coin ngoài phạm vi."
    );
  }
  if (!isMultiSourceKind(kind)) {
    throw new Error(`Loại nguồn không hợp lệ: ${String(kind)}`);
  }
  return kind;
}

function makeDelta(
  estimatedTax: number,
  withheld: number
): Pick<MultiSourceTotals, "deltaSigned" | "deltaKind"> {
  const deltaSigned = estimatedTax - withheld;
  if (deltaSigned > 0) return { deltaSigned, deltaKind: "pay" };
  if (deltaSigned < 0) return { deltaSigned, deltaKind: "refund" };
  return { deltaSigned: 0, deltaKind: "even" };
}

/**
 * Sum active lines. Does not recompute tax rates - engines already filled line amounts.
 */
export function summarizeMultiSource(
  summary: Pick<MultiSourceAnnualSummary, "lines">
): MultiSourceTotals {
  let estimatedTax = 0;
  let withheld = 0;
  for (const line of summary.lines) {
    assertAllowedKind(line.kind);
    if (line.excluded) continue;
    estimatedTax += line.estimatedTaxTotal;
    withheld += line.withheld;
  }
  return {
    estimatedTax,
    withheld,
    ...makeDelta(estimatedTax, withheld),
  };
}

const NON_SALARY_FORCE: ReadonlySet<MultiSourceKind> = new Set([
  "hkd",
  "rent",
  "securities",
  "esop",
]);

/**
 * Wizard impact from active lines (FR-009).
 * Casual mandatory-merge is user-flagged via notes containing "bắt buộc gộp"
 * or kind casual with note tag - for MVP, any non-excluded casual counts as
 * other income for wizard tilt; forceSelfFile when HKD/rent/CK/ESOP present.
 */
export function filingWizardImpactFromLines(
  lines: readonly MultiSourceLine[]
): FilingWizardImpact {
  const active = lines.filter((l) => !l.excluded);
  const hasNonSalarySources = active.some(
    (l) =>
      NON_SALARY_FORCE.has(l.kind) ||
      (l.kind === "casual" &&
        l.notes.some((n) => /bắt buộc gộp|mandatory/i.test(n)))
  );
  return {
    hasNonSalarySources,
    forceSelfFile: hasNonSalarySources,
  };
}

export function activeLegalSources(
  lines: readonly MultiSourceLine[]
): string[] {
  const set = new Set<string>();
  for (const line of lines) {
    if (line.excluded) continue;
    for (const s of line.legalSources) set.add(s);
  }
  return [...set];
}
