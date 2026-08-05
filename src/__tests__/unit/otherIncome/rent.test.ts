import { calculateRent } from '@/src/engine/otherIncome/rent';

describe('TC-RENT', () => {
  it('TC-RENT-01: 240tr/năm → thuế 0 + reporting', () => {
    const r = calculateRent({ annualRevenue: 240_000_000, taxYear: 2026 });
    expect(r.totalTax).toBe(0);
    expect(r.exempt).toBe(true);
    expect(r.reportingRequired).toBe(true);
    expect(r.reportingNote).toBeTruthy();
  });

  it('TC-RENT-02: 1,5 tỷ → GTGT 75tr + TNCN 25tr', () => {
    const r = calculateRent({ annualRevenue: 1_500_000_000, taxYear: 2026 });
    expect(r.vat).toBe(75_000_000);
    expect(r.pit).toBe(25_000_000);
    expect(r.totalTax).toBe(100_000_000);
  });

  it('TC-RENT-03: đúng 1 tỷ → 0', () => {
    const r = calculateRent({ annualRevenue: 1_000_000_000, taxYear: 2026 });
    expect(r.totalTax).toBe(0);
    expect(r.exempt).toBe(true);
  });
});
