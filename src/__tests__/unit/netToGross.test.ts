import { netToGross } from "@/src/engine/netToGross";
import { grossToNet } from "@/src/engine/grossToNet";

describe("Net → Gross", () => {
  it("roundtrips TC-TNCN-2026-01 net back to ~30tr gross", () => {
    const result = netToGross({
      net: 26_215_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      numDependents: 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Math.abs(result.gross - 30_000_000)).toBeLessThanOrEqual(1);
    expect(Math.abs(result.breakdown.net - 26_215_000)).toBeLessThanOrEqual(1);
  });

  it("rejects net below feasible minimum for region", () => {
    const result = netToGross({
      net: 1_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("infeasible");
    expect(result.minFeasibleNet).toBeGreaterThan(1_000_000);
  });

  it("roundtrips random nets within ±1 VND", () => {
    const nets = [
      5_000_000, 8_500_000, 12_000_000, 20_000_000, 26_215_000, 40_000_000,
      55_000_000, 80_000_000, 100_000_000,
    ];
    for (const net of nets) {
      const found = netToGross({
        net,
        region: "I",
        taxYear: 2026,
        asOfDate: "2026-08-15",
      });
      if (!found.ok) continue;
      const again = grossToNet({
        gross: found.gross,
        region: "I",
        taxYear: 2026,
        asOfDate: "2026-08-15",
      });
      expect(Math.abs(again.net - net)).toBeLessThanOrEqual(1);
    }
  });
});
