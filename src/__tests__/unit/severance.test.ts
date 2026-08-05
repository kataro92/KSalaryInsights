import {
  calcJobLossPay,
  calcSeverancePay,
  roundServiceYears,
} from "@/src/engine/severance";

describe("roundServiceYears", () => {
  it("1 năm 7 tháng → 2 năm", () => {
    expect(roundServiceYears(1, 7)).toBe(2);
  });
  it("1 năm 5 tháng → 1.5 năm", () => {
    expect(roundServiceYears(1, 5)).toBe(1.5);
  });
});

describe("TC-SEVERANCE-01 / TC-SEVERANCE-02", () => {
  it("TC-SEVERANCE-01: 7y − 5y BHTN, 20tr → 20.000.000", () => {
    const r = calcSeverancePay({
      mode: "resignation",
      totalYears: 7,
      bhtnYears: 5,
      avgSalary6m: 20_000_000,
      taxYear: 2026,
    });
    expect(r.yearsCounted).toBe(2);
    expect(r.amount).toBe(20_000_000);
    expect(r.explanations.some((e) => e.includes("BHTN"))).toBe(true);
  });

  it("TC-SEVERANCE-02: 1y 7m → làm tròn 2y → 20.000.000", () => {
    const r = calcSeverancePay({
      mode: "resignation",
      totalYears: 1,
      totalExtraMonths: 7,
      bhtnYears: 0,
      avgSalary6m: 20_000_000,
      taxYear: 2026,
    });
    expect(r.yearsCounted).toBe(2);
    expect(r.amount).toBe(20_000_000);
  });
});

describe("TC-JOBLOSS-01 + full BHTN", () => {
  it("TC-JOBLOSS-01: 1 năm, 20tr → sàn 2 tháng = 40.000.000", () => {
    const r = calcJobLossPay({
      totalYears: 1,
      bhtnYears: 0,
      avgSalary6m: 20_000_000,
      taxYear: 2026,
    });
    expect(r.amount).toBe(40_000_000);
  });

  it("BHTN đầy đủ → 0 + explanation", () => {
    const r = calcSeverancePay({
      mode: "resignation",
      totalYears: 5,
      bhtnYears: 5,
      avgSalary6m: 20_000_000,
      taxYear: 2026,
    });
    expect(r.amount).toBe(0);
    expect(r.explanations.length).toBeGreaterThan(0);
  });
});
