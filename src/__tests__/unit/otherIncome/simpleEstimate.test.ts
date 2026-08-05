import { annualFromMonthly } from "@/src/engine/otherIncome/simpleEstimate";
import { calculateHkd } from "@/src/engine/otherIncome/hkd";
import { calculateRent } from "@/src/engine/otherIncome/rent";

describe("F016′ simple monthly ×12", () => {
  it("annualFromMonthly multiplies and rejects negatives", () => {
    expect(annualFromMonthly(20_000_000)).toBe(240_000_000);
    expect(annualFromMonthly(125_000_000)).toBe(1_500_000_000);
    expect(() => annualFromMonthly(-1)).toThrow();
  });

  it("TC-RENT-01 via monthly path", () => {
    const annual = annualFromMonthly(20_000_000);
    const result = calculateRent({ annualRevenue: annual, taxYear: 2026 });
    expect(result.exempt).toBe(true);
    expect(result.totalTax).toBe(0);
  });

  it("TC-HKD-02 via monthly path (tạp hóa)", () => {
    const annual = annualFromMonthly(125_000_000);
    const result = calculateHkd({
      annualRevenue: annual,
      industryId: "distribution",
      taxYear: 2026,
    });
    expect(result.vat).toBe(15_000_000);
    expect(result.pit).toBe(2_500_000);
    expect(result.totalTax).toBe(17_500_000);
  });
});
