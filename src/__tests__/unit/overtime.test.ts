import { calcOvertimePay, nightOtMultiplier } from '@/src/engine/overtime';

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
    expect(result.isNight).toBe(false);
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

describe('OT ban đêm NĐ 145 Đ.57', () => {
  it('night multipliers: 200% / 270% / 390%', () => {
    expect(nightOtMultiplier('weekday')).toBeCloseTo(2.0);
    expect(nightOtMultiplier('weekend')).toBeCloseTo(2.7);
    expect(nightOtMultiplier('holiday')).toBeCloseTo(3.9);
  });

  it('TC-OT-NIGHT-01 weekday night 10h @ 20e6', () => {
    const result = calcOvertimePay({
      monthlySalary: 20_000_000,
      hours: 10,
      dayType: 'weekday',
      isNight: true,
    });
    // hourly ≈ 96153.846 → ×10 ×2.0 ≈ 1_923_077
    expect(result.otPay).toBe(Math.round((20_000_000 / 208) * 10 * 2));
    expect(result.multiplier).toBe(2);
    expect(result.isNight).toBe(true);
  });

  it('weekend and holiday night stack 30% + 20%×day unit', () => {
    const weekend = calcOvertimePay({
      monthlySalary: 20_000_000,
      hours: 10,
      dayType: 'weekend',
      isNight: true,
    });
    const holiday = calcOvertimePay({
      monthlySalary: 20_000_000,
      hours: 10,
      dayType: 'holiday',
      isNight: true,
    });
    expect(weekend.otPay).toBe(Math.round((20_000_000 / 208) * 10 * 2.7));
    expect(holiday.otPay).toBe(Math.round((20_000_000 / 208) * 10 * 3.9));
  });
});
