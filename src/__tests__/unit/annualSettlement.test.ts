import { calculateAnnualSettlement } from "@/src/engine/annualSettlement";
import { evaluateCasualExemption } from "@/src/engine/casualExemption";
import { evaluateFilingWizard } from "@/src/engine/filingWizard";
import { grossToNet } from "@/src/engine/grossToNet";

describe("TC-QT-2025-01", () => {
  it("10 months × 30tr → refund 4.800.000", () => {
    const result = calculateAnnualSettlement({
      taxYear: 2025,
      region: "I",
      numDependents: 0,
      monthlyGross: 30_000_000,
      monthsWorked: 10,
      salaryWithheld: 16_275_000,
    });
    const b = result.primary.breakdown;
    expect(b.annualTax).toBe(11_475_000);
    expect(b.delta.kind).toBe("refund");
    expect(b.delta.amount).toBe(4_800_000);
  });

  it("pay-more case and withheld=0 warning", () => {
    const result = calculateAnnualSettlement({
      taxYear: 2025,
      region: "I",
      numDependents: 0,
      monthlyGross: 30_000_000,
      monthsWorked: 12,
      salaryWithheld: 0,
    });
    expect(result.primary.breakdown.withheldMissingWarning).toBe(true);
    expect(result.primary.breakdown.delta.kind).toBe("pay");
  });
});

describe("TC-QT-2026", () => {
  it("TC-QT-2026-01 mandatory merge → pay 1.620.000", () => {
    const result = calculateAnnualSettlement({
      taxYear: 2026,
      region: "I",
      numDependents: 0,
      monthlyGross: 30_000_000,
      monthsWorked: 12,
      salaryWithheld: 7_620_000,
      casual: { gross: 240_000_000, withheld: 24_000_000 },
    });
    expect(result.casualStatus).toBe("mandatory_merge");
    expect(result.primary.breakdown.annualTax).toBe(33_240_000);
    expect(result.primary.breakdown.delta.kind).toBe("pay");
    expect(result.primary.breakdown.delta.amount).toBe(1_620_000);
  });

  it("TC-QT-2026-02 exempt dual scenarios", () => {
    const result = calculateAnnualSettlement({
      taxYear: 2026,
      region: "I",
      numDependents: 0,
      monthlyGross: 20_000_000,
      monthsWorked: 12,
      salaryWithheld: 1_440_000,
      casual: { gross: 60_000_000, withheld: 6_000_000 },
    });
    expect(result.casualStatus).toBe("exempt");
    expect(result.scenarios).toHaveLength(2);
    const noMerge = result.scenarios.find((s) => s.id === "exempt_no_merge")!;
    const merge = result.scenarios.find((s) => s.id === "voluntary_merge")!;
    expect(noMerge.breakdown.delta.amount).toBe(0);
    expect(merge.breakdown.delta.kind).toBe("refund");
    expect(merge.breakdown.delta.amount).toBe(3_000_000);
  });
});

describe("casualExemption", () => {
  it("exempts ≤15tr avg with withheld in 2026", () => {
    const r = evaluateCasualExemption(2026, {
      gross: 60_000_000,
      withheld: 6_000_000,
    });
    expect(r.status).toBe("exempt");
  });

  it("mandatory when avg > 15tr", () => {
    const r = evaluateCasualExemption(2026, {
      gross: 240_000_000,
      withheld: 24_000_000,
    });
    expect(r.status).toBe("mandatory_merge");
  });
});

describe("filingWizard", () => {
  it("authorize when single employer + no other income + offer", () => {
    const r = evaluateFilingWizard(
      {
        hasSingleEmployerFullYear: true,
        hasOtherIncome: false,
        employerOffersAuthorization: true,
      },
      2025
    );
    expect(r.conclusion).toBe("authorize");
    expect(r.orgDeadlineLabel).toMatch(/31\/03/);
  });

  it("self_file otherwise", () => {
    const r = evaluateFilingWizard(
      {
        hasSingleEmployerFullYear: true,
        hasOtherIncome: true,
        employerOffersAuthorization: true,
      },
      2025
    );
    expect(r.conclusion).toBe("self_file");
    expect(r.individualDeadlineLabel).toMatch(/tháng 5/);
    expect(
      r.checklist.some((c) => /hộ kinh doanh|cho thuê|chứng khoán/i.test(c))
    ).toBe(true);
  });

  it("forceSelfFile from multi-source overrides authorize path", () => {
    const r = evaluateFilingWizard(
      {
        hasSingleEmployerFullYear: true,
        hasOtherIncome: false,
        employerOffersAuthorization: true,
      },
      2026,
      { forceSelfFile: true }
    );
    expect(r.conclusion).toBe("self_file");
    expect(r.notes.some((n) => /ngoài lương/i.test(n))).toBe(true);
  });
});

describe("SC-002 annual vs 12× monthly", () => {
  it("|annual − 12×monthly| ≤ 12", () => {
    const monthly = grossToNet({
      gross: 30_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      numDependents: 0,
    });
    const annual = calculateAnnualSettlement({
      taxYear: 2026,
      region: "I",
      numDependents: 0,
      monthlyGross: 30_000_000,
      monthsWorked: 12,
      salaryWithheld: monthly.pit.totalTax * 12,
    });
    expect(
      Math.abs(annual.primary.breakdown.annualTax - monthly.pit.totalTax * 12)
    ).toBeLessThanOrEqual(12);
  });
});
