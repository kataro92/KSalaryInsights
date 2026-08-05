import { grossToNet } from '@/src/engine/grossToNet';

describe('TC-TNCN-2026-01 / TC-BH-2026-01 Gross → Net', () => {
  it('gross 30tr, 0 NPT, vùng I, H1 2026 → net 26.065.000', () => {
    const result = grossToNet({
      gross: 30_000_000,
      region: 'I',
      taxYear: 2026,
      asOfDate: '2026-03-15',
      numDependents: 0,
    });

    expect(result.insurance.totalEmployee).toBe(3_150_000);
    expect(result.pit.taxableIncome).toBe(11_350_000);
    expect(result.pit.totalTax).toBe(635_000);
    // Steps: 30M − 3.15M BH − 635k tax = 26.215M (domain table Net 26.065M is arithmetic typo)
    expect(result.net).toBe(26_215_000);
    expect(result.rulesetId).toBe('ruleset-2026-h1');
  });
});
