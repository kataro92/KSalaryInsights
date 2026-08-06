import type {
  OfferCompareInputs,
  OfferCompareResult,
  OfferCompareShared,
  OfferSideInput,
  OfferSideResult,
} from "@/src/domain/types/offerCompare";
import { grossToNet } from "@/src/engine/grossToNet";
import {
  netToGrossWithPreset,
  resolveForGrossToNet,
  validateInsurancePreset,
} from "@/src/engine/insuranceBase";
import type { RegionCode } from "@/src/domain/types/salary";

function asOfFromMonth(taxYear: number, month: number): string {
  const m = String(month).padStart(2, "0");
  return `${taxYear}-${m}-15`;
}

function validateShared(shared: OfferCompareShared): string | null {
  if (
    !Number.isInteger(shared.taxYear) ||
    shared.taxYear < 2000 ||
    shared.taxYear > 2100
  ) {
    return "Năm thuế không hợp lệ.";
  }
  if (
    !Number.isInteger(shared.month) ||
    shared.month < 1 ||
    shared.month > 12
  ) {
    return "Tháng không hợp lệ.";
  }
  const regions: RegionCode[] = ["I", "II", "III", "IV"];
  if (!regions.includes(shared.region)) return "Vùng không hợp lệ.";
  if (
    !Number.isInteger(shared.numDependents) ||
    shared.numDependents < 0 ||
    shared.numDependents > 20
  ) {
    return "Số người phụ thuộc phải từ 0 đến 20.";
  }
  return null;
}

function computeSide(
  side: OfferSideInput,
  shared: OfferCompareShared,
  asOfDate: string
): OfferSideResult {
  if (!Number.isInteger(side.amount) || side.amount <= 0) {
    return {
      ok: false,
      errorMessage: "Số tiền phải là số nguyên dương.",
      legalSources: [],
    };
  }
  const checked = validateInsurancePreset(side.insurance);
  if (!checked.ok) {
    return {
      ok: false,
      errorMessage: checked.message,
      legalSources: [],
    };
  }
  const preset = checked.preset;

  try {
    if (side.mode === "gross-to-net") {
      const resolved = resolveForGrossToNet(side.amount, preset);
      const breakdown = grossToNet({
        gross: side.amount,
        region: shared.region,
        taxYear: shared.taxYear,
        asOfDate,
        numDependents: shared.numDependents,
        insuranceSalary: resolved.insuranceSalary,
      });
      return {
        ok: true,
        gross: breakdown.gross,
        net: breakdown.net,
        insuranceEmployeeTotal: breakdown.insurance.totalEmployee,
        pitTotal: breakdown.pit.totalTax,
        insuranceBaseUsed: resolved.displayBase,
        insuranceBaseLabel: resolved.labelVi,
        legalSources: breakdown.legalSources,
      };
    }

    const result = netToGrossWithPreset({
      net: side.amount,
      region: shared.region,
      taxYear: shared.taxYear,
      asOfDate,
      numDependents: shared.numDependents,
      preset,
    });
    if (!result.ok) {
      return {
        ok: false,
        errorMessage: "Không khả thi với vùng/tham số hiện tại.",
        minFeasibleNet: result.minFeasibleNet,
        legalSources: [],
      };
    }
    const resolved = resolveForGrossToNet(result.gross, preset);
    return {
      ok: true,
      gross: result.breakdown.gross,
      net: result.breakdown.net,
      insuranceEmployeeTotal: result.breakdown.insurance.totalEmployee,
      pitTotal: result.breakdown.pit.totalTax,
      insuranceBaseUsed: resolved.displayBase,
      insuranceBaseLabel: resolved.labelVi,
      legalSources: result.breakdown.legalSources,
    };
  } catch (e) {
    return {
      ok: false,
      errorMessage: e instanceof Error ? e.message : "Không tính được.",
      legalSources: [],
    };
  }
}

/**
 * Compare two independent offers with shared tax/region/NPT context (F021).
 */
export function compareOffers(inputs: OfferCompareInputs): OfferCompareResult {
  const sharedErr = validateShared(inputs.shared);
  if (sharedErr) {
    const fail: OfferSideResult = {
      ok: false,
      errorMessage: sharedErr,
      legalSources: [],
    };
    return {
      shared: inputs.shared,
      a: fail,
      b: fail,
      deltaNet: null,
      deltaGross: null,
    };
  }

  const asOfDate = asOfFromMonth(inputs.shared.taxYear, inputs.shared.month);
  const a = computeSide(inputs.offerA, inputs.shared, asOfDate);
  const b = computeSide(inputs.offerB, inputs.shared, asOfDate);

  const bothOk = a.ok && b.ok;
  return {
    shared: inputs.shared,
    a,
    b,
    deltaNet: bothOk && a.ok && b.ok ? b.net - a.net : null,
    deltaGross: bothOk && a.ok && b.ok ? b.gross - a.gross : null,
  };
}
