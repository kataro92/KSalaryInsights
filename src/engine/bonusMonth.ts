import type { RegionCode, SalaryBreakdown } from '@/src/domain/types/salary';
import { grossToNet } from '@/src/engine/grossToNet';

export type BonusMonthParams = {
  baseGross: number;
  /** Thưởng / thu nhập thêm trong tháng (Tết, tháng 13…). */
  bonus: number;
  /** OT pay đã tính — cộng cùng thưởng vào Gross chịu thuế. */
  otPay?: number;
  region: RegionCode;
  taxYear: number;
  asOfDate: string;
  numDependents?: number;
  /** Mức đóng BH tùy chỉnh; nếu bỏ trống → BH theo lương căn cứ (không gồm thưởng/OT). */
  insuranceSalary?: number;
};

export type BonusMonthResult = {
  /** Tháng chỉ lương căn cứ. */
  base: SalaryBreakdown;
  /** Tháng có thưởng (+ OT nếu có). */
  withExtras: SalaryBreakdown;
  extrasTotal: number;
  bonus: number;
  otPay: number;
  deltaNet: number;
  deltaTax: number;
  explanations: string[];
};

/**
 * Mô phỏng tháng có thưởng / OT (F009 + F010).
 * PIT trên gross = base + bonus + ot; BH mặc định trên base (ước tính thực tế phổ biến).
 */
export function calculateBonusMonth(params: BonusMonthParams): BonusMonthResult {
  const {
    baseGross,
    bonus,
    otPay = 0,
    region,
    taxYear,
    asOfDate,
    numDependents = 0,
    insuranceSalary,
  } = params;

  if (!Number.isFinite(baseGross) || baseGross <= 0) {
    throw new Error('Lương căn cứ phải > 0');
  }
  if (!Number.isFinite(bonus) || bonus < 0) {
    throw new Error('Thưởng không hợp lệ');
  }
  if (!Number.isFinite(otPay) || otPay < 0) {
    throw new Error('OT không hợp lệ');
  }

  const extrasTotal = bonus + otPay;
  const bhBase = insuranceSalary ?? baseGross;

  const base = grossToNet({
    gross: baseGross,
    region,
    taxYear,
    asOfDate,
    numDependents,
    insuranceSalary: bhBase,
  });

  const withExtras =
    extrasTotal > 0
      ? grossToNet({
          gross: baseGross + extrasTotal,
          region,
          taxYear,
          asOfDate,
          numDependents,
          insuranceSalary: bhBase,
        })
      : base;

  return {
    base,
    withExtras,
    extrasTotal,
    bonus,
    otPay,
    deltaNet: withExtras.net - base.net,
    deltaTax: withExtras.pit.totalTax - base.pit.totalTax,
    explanations: [
      extrasTotal > 0
        ? 'Thuế tháng có thưởng/OT tính trên tổng Gross; mức đóng BH giữ theo lương căn cứ (trừ khi bạn bật mức BH riêng).'
        : 'Không có thưởng/OT — kết quả trùng tháng lương thường.',
      'Ước tính — chính sách BH trên thưởng/OT có thể khác theo HĐLĐ và nội quy công ty.',
    ],
  };
}
