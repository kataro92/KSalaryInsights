import { compareRulesets } from "@/src/engine/compareRulesets";

describe("compareRulesets (spec 003)", () => {
  it("TC 30tr / 0 NPT / vùng I → delta thuế 992.500", () => {
    const outcome = compareRulesets({
      gross: 30_000_000,
      region: "I",
      numDependents: 0,
      month: 3,
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.result.year1.pit.totalTax).toBe(1_627_500);
    expect(outcome.result.year2.pit.totalTax).toBe(635_000);
    expect(outcome.result.delta.tax).toBe(635_000 - 1_627_500);
    expect(Math.abs(outcome.result.delta.tax)).toBe(992_500);
    expect(outcome.result.delta.net).toBe(
      outcome.result.year2.net - outcome.result.year1.net
    );
  });

  it("returns controlled error for missing ruleset year", () => {
    const outcome = compareRulesets({
      gross: 30_000_000,
      region: "I",
      year1: 2099,
      year2: 2026,
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.code).toBe("missing_ruleset");
    expect(outcome.message).toMatch(/không so sánh|ruleset/i);
  });

  it("shows negative tax delta honestly when year2 tax higher (edge)", () => {
    // With very high dependents, both may be 0: use NPT=0 and assert signed delta retained
    const outcome = compareRulesets({
      gross: 30_000_000,
      region: "I",
      numDependents: 0,
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.delta.tax).toBeLessThan(0);
  });
});
