import { compareOffers } from "@/src/engine/offerCompare";
import { grossToNet } from "@/src/engine/grossToNet";
import { netToGrossWithPreset } from "@/src/engine/insuranceBase";
import { resolveForGrossToNet } from "@/src/engine/insuranceBase";

const SHARED = {
  taxYear: 2026,
  month: 3,
  region: "I" as const,
  numDependents: 0,
};

describe("offerCompare F021", () => {
  it("SC-002: ΔNet matches single-sided engine ±1", () => {
    const result = compareOffers({
      shared: SHARED,
      offerA: {
        mode: "net-to-gross",
        amount: 28_000_000,
        insurance: { mode: "full" },
      },
      offerB: {
        mode: "gross-to-net",
        amount: 32_000_000,
        insurance: { mode: "full" },
      },
    });
    expect(result.a.ok).toBe(true);
    expect(result.b.ok).toBe(true);
    if (!result.a.ok || !result.b.ok) return;

    const soloA = netToGrossWithPreset({
      net: 28_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      preset: { mode: "full" },
    });
    expect(soloA.ok).toBe(true);
    if (!soloA.ok) return;
    expect(Math.abs(result.a.gross - soloA.gross)).toBeLessThanOrEqual(1);
    expect(Math.abs(result.a.net - soloA.breakdown.net)).toBeLessThanOrEqual(1);

    const soloB = grossToNet({
      gross: 32_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
    });
    expect(Math.abs(result.b.net - soloB.net)).toBeLessThanOrEqual(1);
    expect(result.deltaNet).toBe(result.b.net - result.a.net);
    expect(result.deltaGross).toBe(result.b.gross - result.a.gross);
  });

  it("US2: full vs 70% — BH(A)>BH(B), Net(B)>Net(A), bases 30tr vs 21tr", () => {
    const result = compareOffers({
      shared: SHARED,
      offerA: {
        mode: "gross-to-net",
        amount: 30_000_000,
        insurance: { mode: "full" },
      },
      offerB: {
        mode: "gross-to-net",
        amount: 30_000_000,
        insurance: { mode: "percent", percent: 70 },
      },
    });
    expect(result.a.ok && result.b.ok).toBe(true);
    if (!result.a.ok || !result.b.ok) return;
    expect(result.a.insuranceBaseUsed).toBe(30_000_000);
    expect(result.b.insuranceBaseUsed).toBe(21_000_000);
    expect(result.a.insuranceEmployeeTotal).toBeGreaterThan(
      result.b.insuranceEmployeeTotal
    );
    expect(result.b.net).toBeGreaterThan(result.a.net);
  });

  it("infeasible side hides delta", () => {
    const result = compareOffers({
      shared: SHARED,
      offerA: {
        mode: "net-to-gross",
        amount: 1_000_000,
        insurance: { mode: "full" },
      },
      offerB: {
        mode: "gross-to-net",
        amount: 30_000_000,
        insurance: { mode: "full" },
      },
    });
    expect(result.a.ok).toBe(false);
    expect(result.b.ok).toBe(true);
    expect(result.deltaNet).toBeNull();
    expect(result.deltaGross).toBeNull();
    if (result.a.ok) return;
    expect(result.a.minFeasibleNet).toBeGreaterThan(0);
  });

  it("matches resolveForGrossToNet display bases", () => {
    const r = resolveForGrossToNet(30_000_000, {
      mode: "percent",
      percent: 70,
    });
    expect(r.displayBase).toBe(21_000_000);
  });
});
