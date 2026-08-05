import { validateDependents } from "@/src/domain/constants/dependents";
import { grossToNet } from "@/src/engine/grossToNet";

describe("Dependents validation", () => {
  it("rejects negative NPT", () => {
    const v = validateDependents(-1);
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.reason).toBe("negative");
  });

  it("rejects NPT above 20 with app limit message", () => {
    const v = validateDependents(21);
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.reason).toBe("above_max");
    expect(v.message).toMatch(/tối đa 20/);
  });

  it("grossToNet throws on invalid dependents", () => {
    expect(() =>
      grossToNet({
        gross: 30_000_000,
        region: "I",
        taxYear: 2026,
        asOfDate: "2026-03-15",
        numDependents: -1,
      })
    ).toThrow(/≥ 0/);

    expect(() =>
      grossToNet({
        gross: 30_000_000,
        region: "I",
        taxYear: 2026,
        asOfDate: "2026-03-15",
        numDependents: 21,
      })
    ).toThrow(/tối đa 20/);
  });
});
