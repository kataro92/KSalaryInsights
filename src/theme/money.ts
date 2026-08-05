/**
 * Shared money parse/format helpers (vi-VN grouping) + spoken Vietnamese for a11y.
 */

export function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

export function formatMoneyInput(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "";
  return n.toLocaleString("vi-VN");
}

export function formatVnd(n: number): string {
  return `${n.toLocaleString("vi-VN")} ₫`;
}

const DIGITS = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
] as const;

/** Read 0–999. When `forceHundreds`, always emit trăm (for mid groups). */
function readTriple(n: number, forceHundreds: boolean): string {
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;
  const parts: string[] = [];

  if (hundreds > 0) {
    parts.push(`${DIGITS[hundreds]} trăm`);
  } else if (forceHundreds && (tens > 0 || ones > 0)) {
    parts.push("không trăm");
  }

  if (tens > 1) {
    parts.push(`${DIGITS[tens]} mươi`);
    if (ones === 1) parts.push("mốt");
    else if (ones === 4) parts.push("tư");
    else if (ones === 5) parts.push("lăm");
    else if (ones > 0) parts.push(DIGITS[ones]);
  } else if (tens === 1) {
    parts.push("mười");
    if (ones === 5) parts.push("lăm");
    else if (ones > 0) parts.push(DIGITS[ones]);
  } else if (ones > 0) {
    if (hundreds > 0 || forceHundreds) parts.push("lẻ");
    parts.push(DIGITS[ones]);
  }

  return parts.join(" ");
}

/**
 * Convert an integer VND amount into spoken Vietnamese words (no currency unit).
 * Example: 26_215_000 → "hai mươi sáu triệu hai trăm mười lăm nghìn"
 */
export function numberToVietnameseWords(n: number): string {
  const abs = Math.round(Math.abs(n));
  if (abs === 0) return "không";

  const ty = Math.floor(abs / 1_000_000_000);
  const trieu = Math.floor((abs % 1_000_000_000) / 1_000_000);
  const nghin = Math.floor((abs % 1_000_000) / 1_000);
  const donvi = abs % 1_000;

  const parts: string[] = [];
  if (ty > 0) {
    parts.push(`${readTriple(ty, false)} tỷ`);
  }
  if (trieu > 0) {
    parts.push(`${readTriple(trieu, ty > 0)} triệu`);
  } else if (ty > 0 && (nghin > 0 || donvi > 0)) {
    // keep scale continuity only when lower groups matter; skip empty triệu
  }
  if (nghin > 0) {
    parts.push(`${readTriple(nghin, ty > 0 || trieu > 0)} nghìn`);
  }
  if (donvi > 0) {
    parts.push(readTriple(donvi, ty > 0 || trieu > 0 || nghin > 0));
  }

  const body = parts.join(" ").replace(/\s+/g, " ").trim();
  return n < 0 ? `âm ${body}` : body;
}

/**
 * Full accessibility label for screen readers (VoiceOver / TalkBack).
 * Example: "Thực nhận Net hai mươi sáu triệu hai trăm mười lăm nghìn đồng"
 */
export function moneyAccessibilityLabel(n: number, prefix = ""): string {
  const words = numberToVietnameseWords(n);
  const money = `${words} đồng`;
  return `${prefix}${prefix ? " " : ""}${money}`.trim();
}
