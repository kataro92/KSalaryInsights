/**
 * Shared money parse/format helpers (vi-VN grouping).
 */
export function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

export function formatMoneyInput(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return '';
  return n.toLocaleString('vi-VN');
}

export function formatVnd(n: number): string {
  return `${n.toLocaleString('vi-VN')} ₫`;
}

/** Rough accessibility label — digits spoken as grouped; full NLP later. */
export function moneyAccessibilityLabel(n: number, prefix = ''): string {
  const formatted = n.toLocaleString('vi-VN');
  return `${prefix}${prefix ? ' ' : ''}${formatted} đồng`.trim();
}
