import { grossToNet } from '@/src/engine/grossToNet';

describe('Dependents GTGC (spec 002)', () => {
  it('TC-TNCN-2026-02: NPT=2 → GTGC 27.9tr, thuế 0, net 26.85tr', () => {
    const result = grossToNet({
      gross: 30_000_000,
      region: 'I',
      taxYear: 2026,
      asOfDate: '2026-03-15',
      numDependents: 2,
    });

    expect(result.reliefBreakdown.personal).toBe(15_500_000);
    expect(result.reliefBreakdown.dependent).toBe(12_400_000);
    expect(result.reliefBreakdown.total).toBe(27_900_000);
    expect(result.pit.totalTax).toBe(0);
    expect(result.insurance.totalEmployee).toBe(3_150_000);
    expect(result.net).toBe(26_850_000);
  });

  it('NPT=0 → only personal_relief', () => {
    const result = grossToNet({
      gross: 30_000_000,
      region: 'I',
      taxYear: 2026,
      asOfDate: '2026-03-15',
      numDependents: 0,
    });
    expect(result.reliefBreakdown.personal).toBe(15_500_000);
    expect(result.reliefBreakdown.dependent).toBe(0);
    expect(result.reliefBreakdown.total).toBe(15_500_000);
  });
});
