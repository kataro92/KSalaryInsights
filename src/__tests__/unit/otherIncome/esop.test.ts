import { calculateEsop } from "@/src/engine/otherIncome/esop";

describe("TC-ESOP-01", () => {
  it("ghi sổ 100tr, bán 300tr → TLTC 10tr + CN 300k", () => {
    const r = calculateEsop({
      bookCostAtGrant: 100_000_000,
      salePrice: 300_000_000,
      taxYear: 2026,
      asOfDate: "2026-08-15",
    });
    expect(r.tlccWithholding).toBe(10_000_000);
    expect(r.transferTax).toBe(300_000);
    expect(r.totalTax).toBe(10_300_000);
  });

  it("fallback mệnh giá âm → 0", () => {
    const r = calculateEsop({
      shares: 100,
      parValue: 1000,
      amountPaid: 500_000,
      salePrice: 1_000_000,
      taxYear: 2026,
      asOfDate: "2026-08-15",
    });
    expect(r.usedFallback).toBe(true);
    expect(r.bookCost).toBe(0);
    expect(r.tlccWithholding).toBe(0);
  });
});
