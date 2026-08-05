import { calcPensionMonthly, calcPensionRate } from '@/src/engine/pensionEstimate';
import { getRuleset } from '@/src/engine/rulesetLoader';

describe('TC-PENSION-01 / TC-PENSION-02', () => {
  it('TC-PENSION-01: nữ 25 năm, MBQTL 10tr → 6.500.000/tháng', () => {
    const r = calcPensionMonthly({
      sex: 'female',
      contributionYears: 25,
      adjustedAvgSalary: 10_000_000,
    });
    expect(r.rate).toBeCloseTo(0.65, 6);
    expect(r.monthlyAmount).toBe(6_500_000);
    expect(r.rateSteps.length).toBeGreaterThan(0);
  });

  it('TC-PENSION-02: nam 17 năm, MBQTL 10tr → 4.200.000/tháng', () => {
    const r = calcPensionMonthly({
      sex: 'male',
      contributionYears: 17,
      adjustedAvgSalary: 10_000_000,
    });
    expect(r.rate).toBeCloseTo(0.42, 6);
    expect(r.monthlyAmount).toBe(4_200_000);
  });

  it('trần 75%: nữ 30+ năm', () => {
    const params = getRuleset(2026).pension_rates!;
    const { rate } = calcPensionRate('female', 35, params);
    expect(rate).toBe(0.75);
  });
});
