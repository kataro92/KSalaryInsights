import { calcOvertimePay } from '@/src/engine/overtime';

describe('calcOvertimePay TC-OT-01', () => {
  it('computes weekday OT for 20e6 / 10h', () => {
    const result = calcOvertimePay({
      monthlySalary: 20_000_000,
      hours: 10,
      dayType: 'weekday',
    });
    // hourly = 20e6 / 208 ≈ 96153.846 → ×10 ×1.5 ≈ 1_442_308
    expect(result.otPay).toBe(1_442_308);
    expect(result.multiplier).toBe(1.5);
  });

  it('applies weekend and holiday multipliers', () => {
    const weekend = calcOvertimePay({
      monthlySalary: 20_000_000,
      hours: 10,
      dayType: 'weekend',
    });
    const holiday = calcOvertimePay({
      monthlySalary: 20_000_000,
      hours: 10,
      dayType: 'holiday',
    });
    expect(weekend.otPay).toBe(Math.round((20_000_000 / 208) * 10 * 2));
    expect(holiday.otPay).toBe(Math.round((20_000_000 / 208) * 10 * 3));
  });
});
