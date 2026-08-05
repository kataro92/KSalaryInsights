import { calculateSickLeave } from '@/src/engine/sickLeave';

describe('TC-SICK-01', () => {
  it('lương 12tr, 5 ngày → 1.875.000 (75%/24)', () => {
    const r = calculateSickLeave({
      salaryLastMonth: 12_000_000,
      daysRequested: 5,
      contributionYears: 5,
      taxYear: 2026,
      asOfDate: '2026-03-15',
    });
    expect(r.dailyRate).toBe(375_000);
    expect(r.daysPaid).toBe(5);
    expect(r.amount).toBe(1_875_000);
    expect(r.capped).toBe(false);
    expect(r.formula.includes('75') || r.formula.includes('/24')).toBe(true);
  });
});

describe('sick leave annual cap', () => {
  it('vượt trần → cắt days_paid + thông báo', () => {
    const r = calculateSickLeave({
      salaryLastMonth: 12_000_000,
      daysRequested: 50,
      contributionYears: 5, // cap 30
      hazard: 'normal',
      taxYear: 2026,
      asOfDate: '2026-03-15',
    });
    expect(r.annualCap).toBe(30);
    expect(r.daysPaid).toBe(30);
    expect(r.capped).toBe(true);
    expect(r.amount).toBe(375_000 * 30);
    expect(r.explanations.some((e) => e.includes('trần') || e.includes('vượt'))).toBe(
      true,
    );
  });
});
