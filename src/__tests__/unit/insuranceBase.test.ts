import { grossToNet } from "@/src/engine/grossToNet";
import {
  insurancePresetFromLegacy,
  netToGrossWithPreset,
  parseInsurancePreset,
  resolveForGrossToNet,
  validateInsurancePreset,
} from "@/src/engine/insuranceBase";

describe("insuranceBase F022", () => {
  it("validate rejects bad percent", () => {
    expect(validateInsurancePreset({ mode: "percent", percent: 0 }).ok).toBe(
      false
    );
    expect(validateInsurancePreset({ mode: "percent", percent: 101 }).ok).toBe(
      false
    );
  });

  it("validate rejects absolute 0", () => {
    expect(
      validateInsurancePreset({ mode: "absolute", absoluteAmount: 0 }).ok
    ).toBe(false);
  });

  it("legacy map customBh false → full", () => {
    expect(insurancePresetFromLegacy(false, null)).toEqual({ mode: "full" });
  });

  it("legacy map customBh true → absolute", () => {
    expect(insurancePresetFromLegacy(true, 15_000_000)).toEqual({
      mode: "absolute",
      absoluteAmount: 15_000_000,
    });
  });

  it("resolve full leaves insuranceSalary undefined", () => {
    const r = resolveForGrossToNet(30_000_000, { mode: "full" });
    expect(r.insuranceSalary).toBeUndefined();
    expect(r.displayBase).toBe(30_000_000);
  });

  it("resolve 70% → base 21tr", () => {
    const r = resolveForGrossToNet(30_000_000, {
      mode: "percent",
      percent: 70,
    });
    expect(r.insuranceSalary).toBe(21_000_000);
    expect(r.displayBase).toBe(21_000_000);
  });

  it("SC-001: Gross 30tr full vs 70% differ under H1 2026 vùng I", () => {
    const full = grossToNet({
      gross: 30_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      insuranceSalary: resolveForGrossToNet(30_000_000, { mode: "full" })
        .insuranceSalary,
    });
    const pct = grossToNet({
      gross: 30_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      insuranceSalary: resolveForGrossToNet(30_000_000, {
        mode: "percent",
        percent: 70,
      }).insuranceSalary,
    });
    expect(full.insurance.totalEmployee).toBe(3_150_000);
    expect(pct.insurance.totalEmployee).toBe(2_205_000);
    expect(pct.net).toBeGreaterThan(full.net);
  });

  it("netToGrossWithPreset full round-trips ±1", () => {
    const net = 26_215_000;
    const result = netToGrossWithPreset({
      net,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      preset: { mode: "full" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Math.abs(result.gross - 30_000_000)).toBeLessThanOrEqual(1);
  });

  it("netToGrossWithPreset 70% round-trips ±1", () => {
    const forward = grossToNet({
      gross: 30_000_000,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      insuranceSalary: 21_000_000,
    });
    const result = netToGrossWithPreset({
      net: forward.net,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      preset: { mode: "percent", percent: 70 },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const check = grossToNet({
      gross: result.gross,
      region: "I",
      taxYear: 2026,
      asOfDate: "2026-03-15",
      insuranceSalary: resolveForGrossToNet(result.gross, {
        mode: "percent",
        percent: 70,
      }).insuranceSalary,
    });
    expect(Math.abs(check.net - forward.net)).toBeLessThanOrEqual(1);
  });

  it("parseInsurancePreset accepts full", () => {
    expect(parseInsurancePreset({ mode: "full" })).toEqual({ mode: "full" });
  });
});
