import { grossToNet } from "@/src/engine/grossToNet";

describe("Dependents ruleset switch (US2)", () => {
  it("NPT=1: 2025 → 2026 updates personal and dependent relief", () => {
    const y2025 = grossToNet({
      gross: 30_000_000,
      region: "I",
      taxYear: 2025,
      asOfDate: "2025-06-15",
      numDependents: 1,
    });
    const y2026 = grossToNet({
      gross: 30_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      numDependents: 1,
    });

    expect(y2025.reliefBreakdown.personal).toBe(11_000_000);
    expect(y2025.reliefBreakdown.dependent).toBe(4_400_000);
    expect(y2025.reliefBreakdown.total).toBe(15_400_000);

    expect(y2026.reliefBreakdown.personal).toBe(15_500_000);
    expect(y2026.reliefBreakdown.dependent).toBe(6_200_000);
    expect(y2026.reliefBreakdown.total).toBe(21_700_000);

    expect(y2025.rulesetId).not.toBe(y2026.rulesetId);
  });
});
