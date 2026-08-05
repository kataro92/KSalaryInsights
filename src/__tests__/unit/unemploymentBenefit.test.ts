import { calcUnemploymentBenefit } from "@/src/engine/unemploymentBenefit";

describe("TC-UE-01 / TC-UE-02 / TC-UE-03", () => {
  it("TC-UE-01: 72 tháng, 15tr, vùng I → 54.000.000", () => {
    const r = calcUnemploymentBenefit({
      monthsPaid: 72,
      avgSalaryBhtn6m: 15_000_000,
      region: "I",
      lastContributionDate: "2026-03-15",
      taxYear: 2026,
    });
    expect(r.eligible).toBe(true);
    expect(r.monthlyBenefit).toBe(9_000_000);
    expect(r.benefitMonths).toBe(6);
    expect(r.totalBenefit).toBe(54_000_000);
    expect(r.checklist.some((c) => c.label.includes("10"))).toBe(true);
  });

  it("TC-UE-02: 50tr → trần 26.550.000/tháng", () => {
    const r = calcUnemploymentBenefit({
      monthsPaid: 72,
      avgSalaryBhtn6m: 50_000_000,
      region: "I",
      lastContributionDate: "2026-03-15",
      taxYear: 2026,
    });
    expect(r.monthlyBenefit).toBe(26_550_000);
    expect(r.hitCap).toBe(true);
  });

  it("TC-UE-03: 10 tháng → không đủ điều kiện", () => {
    const r = calcUnemploymentBenefit({
      monthsPaid: 10,
      avgSalaryBhtn6m: 15_000_000,
      region: "I",
      lastContributionDate: "2026-03-15",
      taxYear: 2026,
    });
    expect(r.eligible).toBe(false);
    expect(r.ineligibilityReason).toBeTruthy();
  });
});

describe("LTTV theo last_contribution_date", () => {
  it("H1 vs H2 chọn đúng ruleset", () => {
    const h1 = calcUnemploymentBenefit({
      monthsPaid: 72,
      avgSalaryBhtn6m: 50_000_000,
      region: "I",
      lastContributionDate: "2026-03-15",
      taxYear: 2026,
    });
    const h2 = calcUnemploymentBenefit({
      monthsPaid: 72,
      avgSalaryBhtn6m: 50_000_000,
      region: "I",
      lastContributionDate: "2026-08-15",
      taxYear: 2026,
    });
    expect(h1.rulesetId).toBe("ruleset-2026-h1");
    expect(h2.rulesetId).toBe("ruleset-2026-h2");
  });
});
