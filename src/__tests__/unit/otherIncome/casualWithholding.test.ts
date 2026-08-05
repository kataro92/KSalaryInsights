import { calculateCasualWithholding } from '@/src/engine/otherIncome/casualWithholding';

describe('TC-CASUAL withholding', () => {
  it('TC-CASUAL-01: 10tr → khấu trừ 1tr', () => {
    const r = calculateCasualWithholding({
      paymentAmount: 10_000_000,
      taxYear: 2026,
      asOfDate: '2026-08-15',
    });
    expect(r.withheld).toBe(1_000_000);
    expect(r.netReceived).toBe(9_000_000);
  });

  it('TC-CASUAL-02: 4tr tháng 08/2026 → 0', () => {
    const r = calculateCasualWithholding({
      paymentAmount: 4_000_000,
      taxYear: 2026,
      asOfDate: '2026-08-15',
    });
    expect(r.withholdingApplied).toBe(false);
    expect(r.withheld).toBe(0);
    expect(r.settlementWarning).toBeTruthy();
  });

  it('2025 ngưỡng 2tr: 4tr → 400k', () => {
    const r = calculateCasualWithholding({
      paymentAmount: 4_000_000,
      taxYear: 2025,
      asOfDate: '2025-06-15',
    });
    expect(r.threshold).toBe(2_000_000);
    expect(r.withheld).toBe(400_000);
  });
});
