import { calculateHkd } from '@/src/engine/otherIncome/hkd';

describe('TC-HKD', () => {
  it('TC-HKD-01: 800tr → 0 + reporting', () => {
    const r = calculateHkd({
      annualRevenue: 800_000_000,
      industryId: 'distribution',
      taxYear: 2026,
    });
    expect(r.totalTax).toBe(0);
    expect(r.exempt).toBe(true);
    expect(r.reportingRequired).toBe(true);
  });

  it('TC-HKD-02: tạp hóa 1,5 tỷ → GTGT 15tr + TNCN 2,5tr', () => {
    const r = calculateHkd({
      annualRevenue: 1_500_000_000,
      industryId: 'distribution',
      taxYear: 2026,
      costs: 200_000_000,
    });
    expect(r.vat).toBe(15_000_000);
    expect(r.pit).toBe(2_500_000);
    expect(r.totalTax).toBe(17_500_000);
    expect(r.incomeMethodHint).toBeTruthy();
  });
});
