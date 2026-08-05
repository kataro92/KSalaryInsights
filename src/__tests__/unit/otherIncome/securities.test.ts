import { calculateSecuritiesTransfer } from '@/src/engine/otherIncome/securities';

describe('TC-SEC-01', () => {
  it('bán 100tr sau 01/07/2026 → thuế 100.000', () => {
    const r = calculateSecuritiesTransfer({
      transferPrice: 100_000_000,
      taxYear: 2026,
      asOfDate: '2026-08-15',
    });
    expect(r.effective).toBe(true);
    expect(r.tax).toBe(100_000);
  });

  it('trước 01/07/2026 → chưa hiệu lực', () => {
    const r = calculateSecuritiesTransfer({
      transferPrice: 100_000_000,
      taxYear: 2026,
      asOfDate: '2026-03-15',
    });
    expect(r.effective).toBe(false);
    expect(r.tax).toBe(0);
  });
});
