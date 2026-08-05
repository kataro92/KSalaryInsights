/**
 * OT pay — BLLĐ 2019 Đ.98 (3 hệ số ngày; đêm ghi nợ V1.1).
 * @see docs/domain/quyen-loi-lao-dong.md §1
 */

export type OtDayType = 'weekday' | 'weekend' | 'holiday';

export const OT_MULTIPLIERS: Record<OtDayType, number> = {
  weekday: 1.5,
  weekend: 2,
  holiday: 3,
};

export const OT_DAY_LABELS: Record<OtDayType, string> = {
  weekday: 'Ngày thường (150%)',
  weekend: 'Cuối tuần (200%)',
  holiday: 'Lễ / Tết (300%)',
};

export type OvertimeInput = {
  /** Lương tháng căn cứ (gross hợp đồng). */
  monthlySalary: number;
  hours: number;
  dayType: OtDayType;
  /** Mặc định 26 ngày công × 8 giờ. */
  workDaysPerMonth?: number;
  hoursPerDay?: number;
};

export type OvertimeBreakdown = {
  hourlyRate: number;
  multiplier: number;
  hours: number;
  dayType: OtDayType;
  otPay: number;
  formula: string;
  explanations: string[];
};

export function calcOvertimePay(input: OvertimeInput): OvertimeBreakdown {
  const {
    monthlySalary,
    hours,
    dayType,
    workDaysPerMonth = 26,
    hoursPerDay = 8,
  } = input;

  if (!Number.isFinite(monthlySalary) || monthlySalary <= 0) {
    throw new Error('Lương tháng căn cứ OT phải > 0');
  }
  if (!Number.isFinite(hours) || hours < 0) {
    throw new Error('Số giờ OT không hợp lệ');
  }
  if (workDaysPerMonth <= 0 || hoursPerDay <= 0) {
    throw new Error('Ngày công / giờ ngày không hợp lệ');
  }

  const divisor = workDaysPerMonth * hoursPerDay;
  const hourlyRate = monthlySalary / divisor;
  const multiplier = OT_MULTIPLIERS[dayType];
  const otPay = Math.round(hourlyRate * hours * multiplier);

  return {
    hourlyRate,
    multiplier,
    hours,
    dayType,
    otPay,
    formula: `${monthlySalary.toLocaleString('vi-VN')} ÷ ${divisor} × ${hours} × ${multiplier}`,
    explanations: [
      `Đơn giá giờ ≈ ${Math.round(hourlyRate).toLocaleString('vi-VN')} ₫ (${workDaysPerMonth}×${hoursPerDay}h).`,
      `Hệ số ${OT_DAY_LABELS[dayType]} — BLLĐ 2019 Đ.98 (chưa gồm phụ cấp đêm).`,
      'OT cộng vào Gross tháng để ước PIT; mức đóng BH mặc định giữ theo lương căn cứ (không cộng OT).',
    ],
  };
}
