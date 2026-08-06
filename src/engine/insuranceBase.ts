import { REGION_TO_KEY, roundVnd } from "@/src/domain/constants/salary";
import type {
  InsuranceBasePreset,
  ResolvedGrossToNetInsurance,
} from "@/src/domain/types/insuranceBase";
import { DEFAULT_INSURANCE_PRESET } from "@/src/domain/types/insuranceBase";
import { grossToNet } from "@/src/engine/grossToNet";
import {
  netToGross,
  type NetToGrossParams,
  type NetToGrossResult,
} from "@/src/engine/netToGross";
import { getRuleset } from "@/src/engine/rulesetLoader";

export type InsurancePresetValidation =
  | { ok: true; preset: InsuranceBasePreset }
  | { ok: false; message: string };

export function validateInsurancePreset(
  raw: unknown
): InsurancePresetValidation {
  if (!raw || typeof raw !== "object") {
    return { ok: false, message: "Preset BH không hợp lệ." };
  }
  const o = raw as Record<string, unknown>;
  if (o.mode === "full") {
    return { ok: true, preset: { mode: "full" } };
  }
  if (o.mode === "percent") {
    const percent = o.percent;
    if (
      typeof percent !== "number" ||
      !Number.isInteger(percent) ||
      percent < 1 ||
      percent > 100
    ) {
      return { ok: false, message: "Tỷ lệ BH phải là số nguyên 1-100." };
    }
    return { ok: true, preset: { mode: "percent", percent } };
  }
  if (o.mode === "absolute") {
    const absoluteAmount = o.absoluteAmount;
    if (
      typeof absoluteAmount !== "number" ||
      !Number.isInteger(absoluteAmount) ||
      absoluteAmount <= 0
    ) {
      return { ok: false, message: "Mức đóng BH tuyệt đối phải > 0." };
    }
    return { ok: true, preset: { mode: "absolute", absoluteAmount } };
  }
  return { ok: false, message: "Chế độ BH không hỗ trợ." };
}

export function parseInsurancePreset(raw: unknown): InsuranceBasePreset | null {
  const v = validateInsurancePreset(raw);
  return v.ok ? v.preset : null;
}

/** Map legacy calculator fields → preset. */
export function insurancePresetFromLegacy(
  customBh: boolean,
  bhAmount: number | null | undefined
): InsuranceBasePreset {
  if (!customBh) return { mode: "full" };
  if (bhAmount != null && Number.isInteger(bhAmount) && bhAmount > 0) {
    return { mode: "absolute", absoluteAmount: bhAmount };
  }
  return { mode: "full" };
}

export function legacyFromInsurancePreset(preset: InsuranceBasePreset): {
  customBh: boolean;
  bhAmount: number | null;
} {
  if (preset.mode === "absolute") {
    return { customBh: true, bhAmount: preset.absoluteAmount };
  }
  if (preset.mode === "percent") {
    // Older clients only understand absolute/full; percent → full on export flags.
    return { customBh: false, bhAmount: null };
  }
  return { customBh: false, bhAmount: null };
}

export function resolveForGrossToNet(
  gross: number,
  preset: InsuranceBasePreset = DEFAULT_INSURANCE_PRESET
): ResolvedGrossToNetInsurance {
  if (!Number.isFinite(gross) || gross <= 0) {
    throw new Error("Gross phải là số dương");
  }
  const checked = validateInsurancePreset(preset);
  if (!checked.ok) throw new Error(checked.message);

  if (checked.preset.mode === "full") {
    return {
      insuranceSalary: undefined,
      displayBase: roundVnd(gross),
      labelVi: "Full gross",
      labelEn: "Full gross",
    };
  }
  if (checked.preset.mode === "percent") {
    const base = roundVnd((gross * checked.preset.percent) / 100);
    return {
      insuranceSalary: base,
      displayBase: base,
      labelVi: `${checked.preset.percent}% × gross`,
      labelEn: `${checked.preset.percent}% × gross`,
    };
  }
  const abs = checked.preset.absoluteAmount;
  return {
    insuranceSalary: abs,
    displayBase: abs,
    labelVi: `Tuyệt đối ${abs.toLocaleString("vi-VN")} ₫`,
    labelEn: `Fixed ${abs.toLocaleString("en-US")} VND`,
  };
}

type NetToGrossWithPresetParams = Omit<
  NetToGrossParams,
  "insuranceTracksGross" | "insuranceSalary"
> & {
  preset?: InsuranceBasePreset;
};

/**
 * Net→Gross with F022 presets. Percent mode: BH base = percent × candidate gross each step.
 */
export function netToGrossWithPreset(
  params: NetToGrossWithPresetParams
): NetToGrossResult {
  const { preset: rawPreset = DEFAULT_INSURANCE_PRESET, ...rest } = params;
  const checked = validateInsurancePreset(rawPreset);
  if (!checked.ok) throw new Error(checked.message);

  if (checked.preset.mode === "full") {
    return netToGross({ ...rest, insuranceTracksGross: true });
  }
  if (checked.preset.mode === "absolute") {
    return netToGross({
      ...rest,
      insuranceTracksGross: false,
      insuranceSalary: checked.preset.absoluteAmount,
    });
  }

  return netToGrossWithPercent({
    ...rest,
    percent: checked.preset.percent,
  });
}

function netToGrossWithPercent(
  params: Omit<NetToGrossParams, "insuranceTracksGross" | "insuranceSalary"> & {
    percent: number;
  }
): NetToGrossResult {
  const {
    net,
    region,
    taxYear,
    asOfDate,
    numDependents = 0,
    percent,
  } = params;

  if (!Number.isFinite(net) || net <= 0) {
    throw new Error("Net phải là số dương");
  }

  const salaryFor = (gross: number) =>
    roundVnd((gross * percent) / 100);

  const ruleset = getRuleset(taxYear, asOfDate);
  const minWage = ruleset.regional_minimum_wages[REGION_TO_KEY[region]];
  const minBreakdown = grossToNet({
    gross: minWage,
    region,
    taxYear,
    asOfDate,
    numDependents,
    insuranceSalary: salaryFor(minWage),
  });

  if (net < minBreakdown.net) {
    return {
      ok: false,
      reason: "infeasible",
      minFeasibleNet: minBreakdown.net,
    };
  }

  let low = minWage;
  let high = Math.max(net * 2, minWage * 2, net + 50_000_000);

  for (let i = 0; i < 20; i++) {
    const hiNet = grossToNet({
      gross: high,
      region,
      taxYear,
      asOfDate,
      numDependents,
      insuranceSalary: salaryFor(high),
    }).net;
    if (hiNet >= net) break;
    high *= 2;
  }

  let bestGross = high;
  let bestBreakdown = grossToNet({
    gross: high,
    region,
    taxYear,
    asOfDate,
    numDependents,
    insuranceSalary: salaryFor(high),
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const breakdown = grossToNet({
      gross: mid,
      region,
      taxYear,
      asOfDate,
      numDependents,
      insuranceSalary: salaryFor(mid),
    });
    const diff = breakdown.net - net;
    if (Math.abs(diff) <= 1) {
      return { ok: true, gross: mid, breakdown };
    }
    if (diff < 0) {
      low = mid + 1;
    } else {
      bestGross = mid;
      bestBreakdown = breakdown;
      high = mid - 1;
    }
  }

  if (Math.abs(bestBreakdown.net - net) <= 1) {
    return { ok: true, gross: bestGross, breakdown: bestBreakdown };
  }

  for (const g of [bestGross - 1, bestGross, bestGross + 1, low, high]) {
    if (g < minWage) continue;
    const breakdown = grossToNet({
      gross: g,
      region,
      taxYear,
      asOfDate,
      numDependents,
      insuranceSalary: salaryFor(g),
    });
    if (Math.abs(breakdown.net - net) <= 1) {
      return { ok: true, gross: g, breakdown };
    }
  }

  return { ok: true, gross: bestGross, breakdown: bestBreakdown };
}

export function presetLabelVi(preset: InsuranceBasePreset): string {
  if (preset.mode === "full") return "Full gross";
  if (preset.mode === "percent") return `${preset.percent}% × gross`;
  return `Tuyệt đối ${preset.absoluteAmount.toLocaleString("vi-VN")} ₫`;
}
