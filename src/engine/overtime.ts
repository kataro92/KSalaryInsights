/**
 * OT pay — BLLĐ 2019 Đ.98 + NĐ 145/2020 Đ.55–57 (ban ngày & ban đêm).
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

/** Đ.98 k.2 — phụ cấp làm đêm tối thiểu. */
export const NIGHT_WORK_PREMIUM = 0.3;

/** Đ.98 k.3 — phụ cấp thêm khi OT vào ban đêm. */
export const NIGHT_OT_EXTRA = 0.2;

/**
 * Hệ số tổng tối thiểu khi OT ban đêm (theo NĐ 145 Đ.57):
 * - Ngày thường: 150% + 30% + 20%×100% = 200%
 * - Cuối tuần: 200% + 30% + 20%×200% = 270%
 * - Lễ/Tết: 300% + 30% + 20%×300% = 390%
 *
 * Cơ sở 20%: đơn giá ban ngày của loại ngày tương ứng
 * (ngày thường = 100%A; nghỉ tuần/lễ = hệ số ngày × A).
 */
export function nightOtMultiplier(dayType: OtDayType): number {
  const dayOt = OT_MULTIPLIERS[dayType];
  const daytimeUnitForExtra = dayType === 'weekday' ? 1 : dayOt;
  return dayOt + NIGHT_WORK_PREMIUM + NIGHT_OT_EXTRA * daytimeUnitForExtra;
}

export type OvertimeInput = {
  /** Lương tháng căn cứ (gross hợp đồng). */
  monthlySalary: number;
  hours: number;
  dayType: OtDayType;
  /** OT trong khung 22h–6h (Đ.106) — áp Đ.98 k.2 + k.3. */
  isNight?: boolean;
  /** Mặc định 26 ngày công × 8 giờ. */
  workDaysPerMonth?: number;
  hoursPerDay?: number;
};

export type OvertimeBreakdown = {
  hourlyRate: number;
  multiplier: number;
  hours: number;
  dayType: OtDayType;
  isNight: boolean;
  otPay: number;
  formula: string;
  explanations: string[];
};

export function calcOvertimePay(input: OvertimeInput): OvertimeBreakdown {
  const {
    monthlySalary,
    hours,
    dayType,
    isNight = false,
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
  const multiplier = isNight ? nightOtMultiplier(dayType) : OT_MULTIPLIERS[dayType];
  const otPay = Math.round(hourlyRate * hours * multiplier);

  const pct = Math.round(multiplier * 100);
  const explanations = [
    `Đơn giá giờ ≈ ${Math.round(hourlyRate).toLocaleString('vi-VN')} ₫ (${workDaysPerMonth}×${hoursPerDay}h).`,
  ];

  if (isNight) {
    const dayOt = OT_MULTIPLIERS[dayType];
    const daytimeUnitForExtra = dayType === 'weekday' ? 1 : dayOt;
    explanations.push(
      `OT ban đêm ${OT_DAY_LABELS[dayType]} → ${pct}% = ${dayOt * 100}% (OT ngày) + ${NIGHT_WORK_PREMIUM * 100}% (đêm) + ${NIGHT_OT_EXTRA * 100}%×${daytimeUnitForExtra * 100}% (Đ.98 k.2–3 / NĐ 145 Đ.57).`,
    );
  } else {
    explanations.push(`Hệ số ${OT_DAY_LABELS[dayType]} — BLLĐ 2019 Đ.98.`);
  }

  explanations.push(
    'OT cộng vào Gross tháng để ước PIT; mức đóng BH mặc định giữ theo lương căn cứ (không cộng OT).',
  );

  return {
    hourlyRate,
    multiplier,
    hours,
    dayType,
    isNight,
    otPay,
    formula: `${monthlySalary.toLocaleString('vi-VN')} ÷ ${divisor} × ${hours} × ${multiplier}`,
    explanations,
  };
}
