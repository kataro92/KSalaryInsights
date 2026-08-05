import { grossToNet } from "@/src/engine/grossToNet";

describe("TC-TNCN-2025-01 Gross → Net", () => {
  it("gross 30tr, 0 NPT, vùng I → net 25.222.500", () => {
    const result = grossToNet({
      gross: 30_000_000,
      region: "I",
      taxYear: 2025,
      asOfDate: "2025-06-15",
      numDependents: 0,
    });

    expect(result.insurance.social).toBe(2_400_000);
    expect(result.insurance.health).toBe(450_000);
    expect(result.insurance.unemployment).toBe(300_000);
    expect(result.insurance.totalEmployee).toBe(3_150_000);
    expect(result.pit.taxableIncome).toBe(15_850_000);
    expect(result.pit.totalTax).toBe(1_627_500);
    expect(result.net).toBe(25_222_500);
    expect(result.rulesetId).toBe("ruleset-2025");
  });
});
