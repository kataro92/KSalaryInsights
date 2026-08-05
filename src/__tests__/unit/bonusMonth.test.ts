import { calculateBonusMonth } from '@/src/engine/bonusMonth';

describe('calculateBonusMonth', () => {
  it('increases tax when bonus is added (same BH base)', () => {
    const result = calculateBonusMonth({
      baseGross: 30_000_000,
      bonus: 30_000_000,
      region: 'I',
      taxYear: 2026,
      asOfDate: '2026-12-15',
      numDependents: 0,
    });
    expect(result.withExtras.gross).toBe(60_000_000);
    expect(result.withExtras.pit.totalTax).toBeGreaterThan(result.base.pit.totalTax);
    expect(result.deltaTax).toBe(result.withExtras.pit.totalTax - result.base.pit.totalTax);
    expect(result.withExtras.net).toBeGreaterThan(result.base.net);
  });

  it('returns identical breakdowns when extras are zero', () => {
    const result = calculateBonusMonth({
      baseGross: 20_000_000,
      bonus: 0,
      otPay: 0,
      region: 'I',
      taxYear: 2026,
      asOfDate: '2026-03-15',
    });
    expect(result.withExtras.net).toBe(result.base.net);
    expect(result.deltaTax).toBe(0);
  });
});
