import { calculateInsurance } from '@/src/engine/insurance';
import { getRuleset } from '@/src/engine/rulesetLoader';
import { grossToNet } from '@/src/engine/grossToNet';

describe('Insurance caps mid-year 2026', () => {
  it('TC-BH-2026-02: 60tr Mar 2026 → BH 5.046.000 (cap 46.8tr)', () => {
    const ruleset = getRuleset(2026, '2026-03-15');
    expect(ruleset.reference_salary).toBe(2_340_000);
    const bh = calculateInsurance(60_000_000, 'I', ruleset);
    expect(bh.socialHealthCap).toBe(46_800_000);
    expect(bh.social).toBe(3_744_000);
    expect(bh.health).toBe(702_000);
    expect(bh.unemployment).toBe(600_000);
    expect(bh.totalEmployee).toBe(5_046_000);
  });

  it('TC-BH-2026H2-01: 60tr Aug 2026 → BH 5.407.000 (cap 50.6tr)', () => {
    const ruleset = getRuleset(2026, '2026-08-15');
    expect(ruleset.reference_salary).toBe(2_530_000);
    const bh = calculateInsurance(60_000_000, 'I', ruleset);
    expect(bh.socialHealthCap).toBe(50_600_000);
    expect(bh.social).toBe(4_048_000);
    expect(bh.health).toBe(759_000);
    expect(bh.unemployment).toBe(600_000);
    expect(bh.totalEmployee).toBe(5_407_000);
  });

  it('grossToNet switches H1/H2 via asOfDate for same 60tr input', () => {
    const h1 = grossToNet({
      gross: 60_000_000,
      region: 'I',
      taxYear: 2026,
      asOfDate: '2026-03-01',
    });
    const h2 = grossToNet({
      gross: 60_000_000,
      region: 'I',
      taxYear: 2026,
      asOfDate: '2026-08-01',
    });
    expect(h1.insurance.totalEmployee).toBe(5_046_000);
    expect(h2.insurance.totalEmployee).toBe(5_407_000);
    expect(h1.rulesetId).toBe('ruleset-2026-h1');
    expect(h2.rulesetId).toBe('ruleset-2026-h2');
  });
});
