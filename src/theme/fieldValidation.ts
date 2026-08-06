import { parseMoney } from "@/src/theme/money";

/** Required money > 0. Empty / 0 / invalid → message. */
export function requiredPositiveMoney(
  text: string,
  message = "Nhập số tiền lớn hơn 0."
): string | null {
  const n = parseMoney(text);
  if (n == null || n <= 0) return message;
  return null;
}

/** Required money ≥ 0 (0 allowed). Empty / invalid → message. */
export function requiredNonNegativeMoney(
  text: string,
  message = "Nhập số tiền hợp lệ (≥ 0)."
): string | null {
  if (!text.trim()) return message;
  const n = parseMoney(text);
  if (n == null || n < 0) return message;
  return null;
}

/** Optional money ≥ 0. Empty counts as 0 (ok). */
export function optionalNonNegativeMoney(text: string): string | null {
  if (!text.trim()) return null;
  const n = parseMoney(text);
  if (n == null || n < 0) return "Số tiền không hợp lệ.";
  return null;
}

/** Required integer in [min, max] inclusive. */
export function requiredIntInRange(
  text: string,
  min: number,
  max: number,
  message?: string
): string | null {
  if (!text.trim()) {
    return message ?? `Nhập số từ ${min} đến ${max}.`;
  }
  const n = Number(text.replace(/[^\d]/g, ""));
  if (!Number.isInteger(n) || n < min || n > max) {
    return message ?? `Nhập số nguyên từ ${min} đến ${max}.`;
  }
  return null;
}

/** Required non-negative integer (0 allowed). Empty → error. */
export function requiredNonNegativeInt(
  text: string,
  message = "Nhập số nguyên ≥ 0."
): string | null {
  if (!text.trim()) return message;
  const n = Number(text.replace(/[^\d]/g, ""));
  if (!Number.isInteger(n) || n < 0) return message;
  return null;
}

/** YYYY-MM-DD date string. */
export function requiredIsoDate(
  text: string,
  message = "Nhập ngày dạng YYYY-MM-DD."
): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text.trim())) return message;
  return null;
}
