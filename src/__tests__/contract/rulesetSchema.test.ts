import { getRuleset } from '@/src/engine/rulesetLoader';

describe('ruleset other_income contract', () => {
  it('HKD industry_rates đủ 5 nhóm trên mọi ruleset', () => {
    for (const year of [2025, 2026] as const) {
      const r = getRuleset(year);
      expect(r.other_income).toBeTruthy();
      expect(r.other_income!.hkd.industry_rates).toHaveLength(5);
      expect(r.casual_income).toBeTruthy();
    }
    expect(getRuleset(2025).casual_income!.withholding_threshold).toBe(2_000_000);
    expect(getRuleset(2026, '2026-03-15').casual_income!.withholding_threshold).toBe(
      5_000_000,
    );
    expect(getRuleset(2026, '2026-08-15').casual_income!.withholding_threshold).toBe(
      5_000_000,
    );
  });
});
