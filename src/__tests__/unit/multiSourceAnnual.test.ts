import {
  assertAllowedKind,
  filingWizardImpactFromLines,
  summarizeMultiSource,
} from "@/src/engine/multiSourceAnnual";
import {
  mapCasualLine,
  mapHkdLine,
  mapRentLine,
  mapSalaryLine,
} from "@/src/engine/multiSourceMappers";
import { parseMultiSourceInputs } from "@/src/store/scenarios";

describe("multiSourceAnnual F020", () => {
  it("salary-only totals = line tax", () => {
    const salary = mapSalaryLine({
      taxYear: 2025,
      revenueOrIncome: 300_000_000,
      estimatedPit: 16_275_000,
      withheld: 16_275_000,
    });
    const totals = summarizeMultiSource({ lines: [salary] });
    expect(totals.estimatedTax).toBe(16_275_000);
    expect(totals.withheld).toBe(16_275_000);
    expect(totals.deltaKind).toBe("even");
  });

  it("three-line fixture totals = sum of line taxes", () => {
    const salary = mapSalaryLine({
      taxYear: 2026,
      revenueOrIncome: 300_000_000,
      estimatedPit: 20_000_000,
      withheld: 18_000_000,
    });
    const rent = mapRentLine({
      annualRevenue: 240_000_000,
      taxYear: 2026,
    });
    const casual = mapCasualLine({
      paymentAmount: 3_000_000,
      taxYear: 2026,
    });
    expect(rent.estimatedTaxTotal).toBe(0);
    const totals = summarizeMultiSource({ lines: [salary, rent, casual] });
    expect(totals.estimatedTax).toBe(
      salary.estimatedTaxTotal +
        rent.estimatedTaxTotal +
        casual.estimatedTaxTotal
    );
    expect(totals.withheld).toBe(
      salary.withheld + rent.withheld + casual.withheld
    );
  });

  it("SC-002: salary tax T + HKD exempt → totals.estimatedTax === T", () => {
    const T = 12_345_678;
    const salary = mapSalaryLine({
      taxYear: 2026,
      revenueOrIncome: 250_000_000,
      estimatedPit: T,
      withheld: 10_000_000,
    });
    const hkd = mapHkdLine({
      annualRevenue: 800_000_000,
      industryId: "services",
      taxYear: 2026,
    });
    expect(hkd.estimatedTaxTotal).toBe(0);
    expect(hkd.notes.some((n) => /kê khai|thông báo/i.test(n))).toBe(true);
    const totals = summarizeMultiSource({ lines: [salary, hkd] });
    expect(Math.abs(totals.estimatedTax - T)).toBeLessThanOrEqual(1);
  });

  it("HKD above threshold splits vat + pit", () => {
    const hkd = mapHkdLine({
      annualRevenue: 1_500_000_000,
      industryId: "distribution",
      taxYear: 2026,
    });
    expect(hkd.estimatedVat).toBe(15_000_000);
    expect(hkd.estimatedPit).toBe(2_500_000);
    expect(hkd.estimatedTaxTotal).toBe(17_500_000);
  });

  it("excluded lines omit from totals", () => {
    const a = mapSalaryLine({
      taxYear: 2026,
      revenueOrIncome: 1,
      estimatedPit: 1_000_000,
    });
    const b = {
      ...mapSalaryLine({
        taxYear: 2026,
        revenueOrIncome: 1,
        estimatedPit: 5_000_000,
      }),
      excluded: true,
    };
    expect(summarizeMultiSource({ lines: [a, b] }).estimatedTax).toBe(
      1_000_000
    );
  });

  it("assertAllowedKind rejects crypto", () => {
    expect(() => assertAllowedKind("crypto")).toThrow(/coin|mã hóa/i);
    expect(() => assertAllowedKind("coin")).toThrow();
    expect(() => assertAllowedKind("unknown")).toThrow();
  });

  it("parse rejects crypto kind in scenario JSON", () => {
    const parsed = parseMultiSourceInputs({
      id: "ms1",
      taxYear: 2026,
      updatedAt: new Date().toISOString(),
      lines: [
        {
          id: "l1",
          kind: "crypto",
          label: "Coin",
          revenueOrIncome: 1,
          estimatedVat: 0,
          estimatedPit: 0,
          estimatedOtherTax: 0,
          estimatedTaxTotal: 0,
          withheld: 0,
          notes: [],
          legalSources: [],
          excluded: false,
        },
      ],
    });
    expect(parsed).toBeNull();
  });

  it("filingWizardImpact forces self-file for rent/hkd", () => {
    const rent = mapRentLine({ annualRevenue: 100_000_000, taxYear: 2026 });
    const impact = filingWizardImpactFromLines([rent]);
    expect(impact.hasNonSalarySources).toBe(true);
    expect(impact.forceSelfFile).toBe(true);
  });
});
