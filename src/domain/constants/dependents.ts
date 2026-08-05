/** App limits for dependent count (spec 002). Not a legal validation. */
export const MIN_DEPENDENTS = 0;
export const MAX_DEPENDENTS = 20;

export type DependentsValidation =
  | { ok: true; value: number }
  | { ok: false; reason: "negative" | "above_max"; message: string };

export function validateDependents(raw: number): DependentsValidation {
  if (!Number.isInteger(raw) || raw < MIN_DEPENDENTS) {
    return {
      ok: false,
      reason: "negative",
      message: "Số người phụ thuộc phải là số nguyên ≥ 0.",
    };
  }
  if (raw > MAX_DEPENDENTS) {
    return {
      ok: false,
      reason: "above_max",
      message: `Giới hạn app: tối đa ${MAX_DEPENDENTS} người phụ thuộc.`,
    };
  }
  return { ok: true, value: raw };
}

export function clampDependents(raw: number): number {
  if (!Number.isFinite(raw)) return MIN_DEPENDENTS;
  return Math.min(MAX_DEPENDENTS, Math.max(MIN_DEPENDENTS, Math.trunc(raw)));
}
