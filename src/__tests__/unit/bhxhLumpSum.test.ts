import { calcLumpSum, roundContributionYears } from "@/src/engine/bhxhLumpSum";

describe("roundContributionYears (Đ.5 k.6)", () => {
  it("4 năm 8 tháng → 5 năm", () => {
    expect(roundContributionYears(4, 8)).toBe(5);
  });
  it("1-6 tháng → ½ năm", () => {
    expect(roundContributionYears(0, 6)).toBe(0.5);
    expect(roundContributionYears(0, 1)).toBe(0.5);
  });
});

describe("TC-LUMPSUM-01 + edges", () => {
  it("TC-LUMPSUM-01: T1=4, T2=10, MBQTL 12tr → 312.000.000", () => {
    const r = calcLumpSum({
      yearsPre2014: 4,
      yearsFrom2014: 10,
      adjustedAvgSalary: 12_000_000,
    });
    expect(r.amount).toBe(312_000_000);
    expect(r.weightedYears).toBe(26);
    expect(r.explanations.length).toBeGreaterThan(0);
  });

  it("edge <1 năm: đóng 8 tháng → tối đa 2 × MBQTL", () => {
    const r = calcLumpSum({
      yearsPre2014: 0,
      monthsPre2014: 8,
      yearsFrom2014: 0,
      adjustedAvgSalary: 10_000_000,
    });
    expect(r.underOneYear).toBe(true);
    expect(r.amount).toBe(20_000_000);
  });

  it("tham gia từ 08/2025 → checklist không có nghỉ 12 tháng", () => {
    const r = calcLumpSum({
      yearsPre2014: 0,
      yearsFrom2014: 10,
      adjustedAvgSalary: 12_000_000,
      firstParticipationDate: "2025-08-01",
    });
    expect(r.beforeCutoff).toBe(false);
    expect(r.checklist.every((c) => !c.label.includes("12 tháng"))).toBe(true);
  });
});
