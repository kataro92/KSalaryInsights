import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CalculationMode, RegionCode } from "@/src/domain/types/salary";
import type { InsuranceBasePreset } from "@/src/domain/types/insuranceBase";
import type {
  MultiSourceAnnualSummary,
  MultiSourceKind,
  MultiSourceLine,
} from "@/src/domain/types/multiSource";
import {
  MAX_MULTI_SOURCE_LINES,
  MULTI_SOURCE_KINDS,
} from "@/src/domain/types/multiSource";
import type {
  OfferCompareInputs,
  OfferSideInput,
} from "@/src/domain/types/offerCompare";
import {
  insurancePresetFromLegacy,
  legacyFromInsurancePreset,
  parseInsurancePreset,
} from "@/src/engine/insuranceBase";
import type { OtDayType } from "@/src/engine/overtime";

export const SCENARIOS_STORAGE_KEY = "kv.scenarios.v1";
export const MAX_SCENARIOS = 20;

export type ScenarioKind =
  | "calculator"
  | "settlement"
  | "offer_compare"
  | "multi_source";

export type CalculatorScenarioInputs = {
  mode: CalculationMode;
  /** Integer VNĐ amount (gross or desired net). */
  amount: number;
  region: RegionCode;
  taxYear: number;
  month: number;
  numDependents: number;
  /** F022 insurance base preset. */
  insurance: InsuranceBasePreset;
  /**
   * @deprecated Prefer `insurance`. Kept for older saves / migration.
   */
  customBh: boolean;
  /** @deprecated Prefer `insurance`. */
  bhAmount: number | null;
  bonus: number;
  otHours: number;
  otDayType: OtDayType;
  /** OT trong khung 22h-6h (Đ.106). Missing on older saves → false. */
  otNight: boolean;
};

export type SettlementScenarioInputs = {
  taxYear: number;
  region: RegionCode;
  numDependents: number;
  monthlyGross: number;
  monthsWorked: number;
  salaryWithheld: number;
  includeCasual: boolean;
  casualGross: number;
  casualWithheld: number;
};

export type OfferCompareScenarioInputs = OfferCompareInputs;

/** F020 multi-source annual summary payload. */
export type MultiSourceScenarioInputs = MultiSourceAnnualSummary;

type ScenarioBase = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SavedCalculatorScenario = ScenarioBase & {
  kind: "calculator";
  inputs: CalculatorScenarioInputs;
  /** Last computed net for list preview (optional). */
  lastNet?: number;
};

export type SavedSettlementScenario = ScenarioBase & {
  kind: "settlement";
  inputs: SettlementScenarioInputs;
  /** Last primary delta (signed) for list preview. */
  lastDelta?: number;
};

export type SavedOfferCompareScenario = ScenarioBase & {
  kind: "offer_compare";
  inputs: OfferCompareScenarioInputs;
  lastDeltaNet?: number;
};

export type SavedMultiSourceScenario = ScenarioBase & {
  kind: "multi_source";
  inputs: MultiSourceScenarioInputs;
  lastDelta?: number;
};

export type SavedScenario =
  | SavedCalculatorScenario
  | SavedSettlementScenario
  | SavedOfferCompareScenario
  | SavedMultiSourceScenario;

export type ScenarioStore = {
  schemaVersion: 1;
  scenarios: SavedScenario[];
};

const MODES: readonly CalculationMode[] = ["gross-to-net", "net-to-gross"];
const REGIONS: readonly RegionCode[] = ["I", "II", "III", "IV"];
const OT_TYPES: readonly OtDayType[] = ["weekday", "weekend", "holiday"];

function isMode(v: unknown): v is CalculationMode {
  return typeof v === "string" && (MODES as readonly string[]).includes(v);
}

function isRegion(v: unknown): v is RegionCode {
  return typeof v === "string" && (REGIONS as readonly string[]).includes(v);
}

function isOtDay(v: unknown): v is OtDayType {
  return typeof v === "string" && (OT_TYPES as readonly string[]).includes(v);
}

function isNonNegInt(v: unknown): v is number {
  return (
    typeof v === "number" && Number.isInteger(v) && v >= 0 && Number.isFinite(v)
  );
}

function isPositiveInt(v: unknown): v is number {
  return isNonNegInt(v) && v > 0;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function compactMoneyLabel(amount: number): string {
  const millions = amount / 1_000_000;
  if (millions >= 1) {
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}tr`;
  }
  return `${Math.round(amount / 1000)}k`;
}

export function parseCalculatorInputs(
  raw: unknown
): CalculatorScenarioInputs | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!isMode(o.mode)) return null;
  if (!isPositiveInt(o.amount)) return null;
  if (!isRegion(o.region)) return null;
  if (typeof o.taxYear !== "number" || !Number.isInteger(o.taxYear))
    return null;
  if (o.taxYear < 2000 || o.taxYear > 2100) return null;
  if (
    typeof o.month !== "number" ||
    !Number.isInteger(o.month) ||
    o.month < 1 ||
    o.month > 12
  ) {
    return null;
  }
  if (!isNonNegInt(o.numDependents) || o.numDependents > 99) return null;
  let insurance = parseInsurancePreset(o.insurance);
  if (!insurance) {
    // Legacy: customBh + bhAmount
    if (typeof o.customBh !== "boolean") return null;
    if (o.bhAmount != null && !isNonNegInt(o.bhAmount)) return null;
    insurance = insurancePresetFromLegacy(
      o.customBh,
      o.bhAmount == null ? null : o.bhAmount
    );
  }
  const legacy = legacyFromInsurancePreset(insurance);
  if (!isNonNegInt(o.bonus)) return null;
  if (
    typeof o.otHours !== "number" ||
    !Number.isFinite(o.otHours) ||
    o.otHours < 0 ||
    o.otHours > 744
  ) {
    return null;
  }
  if (!isOtDay(o.otDayType)) return null;
  // Backward compatible: older v1 saves omit otNight.
  if (o.otNight != null && typeof o.otNight !== "boolean") return null;
  return {
    mode: o.mode,
    amount: o.amount,
    region: o.region,
    taxYear: o.taxYear,
    month: o.month,
    numDependents: o.numDependents,
    insurance,
    customBh: legacy.customBh,
    bhAmount: legacy.bhAmount,
    bonus: o.bonus,
    otHours: o.otHours,
    otDayType: o.otDayType,
    otNight: o.otNight === true,
  };
}

export function parseSettlementInputs(
  raw: unknown
): SettlementScenarioInputs | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.taxYear !== "number" || !Number.isInteger(o.taxYear))
    return null;
  if (o.taxYear < 2000 || o.taxYear > 2100) return null;
  if (!isRegion(o.region)) return null;
  if (!isNonNegInt(o.numDependents) || o.numDependents > 99) return null;
  if (!isPositiveInt(o.monthlyGross)) return null;
  if (
    typeof o.monthsWorked !== "number" ||
    !Number.isInteger(o.monthsWorked) ||
    o.monthsWorked < 1 ||
    o.monthsWorked > 12
  ) {
    return null;
  }
  if (!isNonNegInt(o.salaryWithheld)) return null;
  if (typeof o.includeCasual !== "boolean") return null;
  if (!isNonNegInt(o.casualGross)) return null;
  if (!isNonNegInt(o.casualWithheld)) return null;
  return {
    taxYear: o.taxYear,
    region: o.region,
    numDependents: o.numDependents,
    monthlyGross: o.monthlyGross,
    monthsWorked: o.monthsWorked,
    salaryWithheld: o.salaryWithheld,
    includeCasual: o.includeCasual,
    casualGross: o.casualGross,
    casualWithheld: o.casualWithheld,
  };
}

function parseOfferSideInput(raw: unknown): OfferSideInput | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!isMode(o.mode)) return null;
  if (!isPositiveInt(o.amount)) return null;
  const insurance = parseInsurancePreset(o.insurance);
  if (!insurance) return null;
  return { mode: o.mode, amount: o.amount, insurance };
}

export function parseOfferCompareInputs(
  raw: unknown
): OfferCompareScenarioInputs | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!o.shared || typeof o.shared !== "object") return null;
  const s = o.shared as Record<string, unknown>;
  if (typeof s.taxYear !== "number" || !Number.isInteger(s.taxYear))
    return null;
  if (s.taxYear < 2000 || s.taxYear > 2100) return null;
  if (
    typeof s.month !== "number" ||
    !Number.isInteger(s.month) ||
    s.month < 1 ||
    s.month > 12
  ) {
    return null;
  }
  if (!isRegion(s.region)) return null;
  if (!isNonNegInt(s.numDependents) || s.numDependents > 20) return null;
  const offerA = parseOfferSideInput(o.offerA);
  const offerB = parseOfferSideInput(o.offerB);
  if (!offerA || !offerB) return null;
  return {
    shared: {
      taxYear: s.taxYear,
      month: s.month,
      region: s.region,
      numDependents: s.numDependents,
    },
    offerA,
    offerB,
  };
}

const MULTI_KIND_SET = new Set<string>(MULTI_SOURCE_KINDS);

function parseMultiSourceLine(raw: unknown): MultiSourceLine | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (o.kind === "crypto" || o.kind === "digital_asset" || o.kind === "coin") {
    return null;
  }
  if (typeof o.kind !== "string" || !MULTI_KIND_SET.has(o.kind)) return null;
  if (typeof o.label !== "string" || !o.label.trim()) return null;
  if (!isNonNegInt(o.revenueOrIncome)) return null;
  if (!isNonNegInt(o.estimatedVat)) return null;
  if (!isNonNegInt(o.estimatedPit)) return null;
  if (!isNonNegInt(o.estimatedOtherTax)) return null;
  if (!isNonNegInt(o.estimatedTaxTotal)) return null;
  if (!isNonNegInt(o.withheld)) return null;
  if (!Array.isArray(o.notes) || !o.notes.every((n) => typeof n === "string"))
    return null;
  if (
    !Array.isArray(o.legalSources) ||
    !o.legalSources.every((n) => typeof n === "string")
  ) {
    return null;
  }
  if (typeof o.excluded !== "boolean") return null;
  let sourceRef: MultiSourceLine["sourceRef"];
  if (o.sourceRef != null) {
    if (typeof o.sourceRef !== "object") return null;
    const sr = o.sourceRef as Record<string, unknown>;
    if (sr.scenarioId != null && typeof sr.scenarioId !== "string") return null;
    if (sr.calculator != null && typeof sr.calculator !== "string") return null;
    sourceRef = {
      scenarioId:
        typeof sr.scenarioId === "string" ? sr.scenarioId : undefined,
      calculator:
        typeof sr.calculator === "string" ? sr.calculator : undefined,
    };
  }
  return {
    id: o.id,
    kind: o.kind as MultiSourceKind,
    label: o.label.trim().slice(0, 80),
    revenueOrIncome: o.revenueOrIncome,
    estimatedVat: o.estimatedVat,
    estimatedPit: o.estimatedPit,
    estimatedOtherTax: o.estimatedOtherTax,
    estimatedTaxTotal: o.estimatedTaxTotal,
    withheld: o.withheld,
    notes: o.notes as string[],
    legalSources: o.legalSources as string[],
    sourceRef,
    excluded: o.excluded,
  };
}

export function parseMultiSourceInputs(
  raw: unknown
): MultiSourceScenarioInputs | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (typeof o.taxYear !== "number" || !Number.isInteger(o.taxYear))
    return null;
  if (o.taxYear < 2000 || o.taxYear > 2100) return null;
  if (o.region != null && !isRegion(o.region)) return null;
  if (o.name != null && typeof o.name !== "string") return null;
  if (typeof o.updatedAt !== "string" || !o.updatedAt) return null;
  if (o.createdAt != null && typeof o.createdAt !== "string") return null;
  if (!Array.isArray(o.lines) || o.lines.length > MAX_MULTI_SOURCE_LINES)
    return null;
  const lines: MultiSourceLine[] = [];
  for (const item of o.lines) {
    const line = parseMultiSourceLine(item);
    if (!line) return null;
    lines.push(line);
  }
  return {
    id: o.id,
    taxYear: o.taxYear,
    region: o.region as RegionCode | undefined,
    name: typeof o.name === "string" ? o.name.trim().slice(0, 80) : undefined,
    createdAt: typeof o.createdAt === "string" ? o.createdAt : undefined,
    updatedAt: o.updatedAt,
    lines,
  };
}

export function parseSavedScenario(raw: unknown): SavedScenario | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (typeof o.name !== "string" || !o.name.trim()) return null;
  if (typeof o.createdAt !== "string" || typeof o.updatedAt !== "string")
    return null;

  const base = {
    id: o.id,
    name: o.name.trim().slice(0, 80),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };

  if (o.kind === "calculator") {
    const inputs = parseCalculatorInputs(o.inputs);
    if (!inputs) return null;
    const lastNet =
      o.lastNet == null
        ? undefined
        : isFiniteNumber(o.lastNet)
        ? o.lastNet
        : undefined;
    return { ...base, kind: "calculator", inputs, lastNet };
  }

  if (o.kind === "settlement") {
    const inputs = parseSettlementInputs(o.inputs);
    if (!inputs) return null;
    const lastDelta =
      o.lastDelta == null
        ? undefined
        : isFiniteNumber(o.lastDelta)
        ? o.lastDelta
        : undefined;
    return { ...base, kind: "settlement", inputs, lastDelta };
  }

  if (o.kind === "offer_compare") {
    const inputs = parseOfferCompareInputs(o.inputs);
    if (!inputs) return null;
    const lastDeltaNet =
      o.lastDeltaNet == null
        ? undefined
        : isFiniteNumber(o.lastDeltaNet)
        ? o.lastDeltaNet
        : undefined;
    return { ...base, kind: "offer_compare", inputs, lastDeltaNet };
  }

  if (o.kind === "multi_source") {
    const inputs = parseMultiSourceInputs(o.inputs);
    if (!inputs) return null;
    const lastDelta =
      o.lastDelta == null
        ? undefined
        : isFiniteNumber(o.lastDelta)
        ? o.lastDelta
        : undefined;
    return { ...base, kind: "multi_source", inputs, lastDelta };
  }

  return null;
}

export function parseScenarioStore(raw: unknown): ScenarioStore | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.schemaVersion !== 1) return null;
  if (!Array.isArray(o.scenarios)) return null;
  const scenarios: SavedScenario[] = [];
  for (const item of o.scenarios) {
    const s = parseSavedScenario(item);
    if (s) scenarios.push(s);
  }
  return { schemaVersion: 1, scenarios: scenarios.slice(0, MAX_SCENARIOS) };
}

export function emptyScenarioStore(): ScenarioStore {
  return { schemaVersion: 1, scenarios: [] };
}

export function scenariosOfKind<K extends ScenarioKind>(
  scenarios: readonly SavedScenario[],
  kind: K
): Extract<SavedScenario, { kind: K }>[] {
  return scenarios.filter(
    (s): s is Extract<SavedScenario, { kind: K }> => s.kind === kind
  );
}

/** Compact default name. Calculator e.g. "Gross 30tr · T3/2026". */
export function defaultScenarioName(inputs: CalculatorScenarioInputs): string;
export function defaultScenarioName(
  inputs: SettlementScenarioInputs,
  kind: "settlement"
): string;
export function defaultScenarioName(
  inputs: OfferCompareScenarioInputs,
  kind: "offer_compare"
): string;
export function defaultScenarioName(
  inputs: MultiSourceScenarioInputs,
  kind: "multi_source"
): string;
export function defaultScenarioName(
  inputs:
    | CalculatorScenarioInputs
    | SettlementScenarioInputs
    | OfferCompareScenarioInputs
    | MultiSourceScenarioInputs,
  kind: ScenarioKind = "calculator"
): string {
  if (kind === "settlement") {
    const i = inputs as SettlementScenarioInputs;
    const casual = i.includeCasual && i.casualGross > 0 ? " · vãng lai" : "";
    return `QT ${compactMoneyLabel(i.monthlyGross)} ×${i.monthsWorked} · ${
      i.taxYear
    }${casual}`;
  }
  if (kind === "offer_compare") {
    const i = inputs as OfferCompareScenarioInputs;
    const label = (side: OfferSideInput) =>
      `${side.mode === "gross-to-net" ? "G" : "N"}${compactMoneyLabel(
        side.amount
      )}`;
    return `Offer ${label(i.offerA)} vs ${label(i.offerB)} · T${i.shared.month}/${
      i.shared.taxYear
    }`;
  }
  if (kind === "multi_source") {
    const i = inputs as MultiSourceScenarioInputs;
    const active = i.lines.filter((l) => !l.excluded).length;
    return `Tổng hợp ${active} nguồn · ${i.taxYear}`;
  }
  const i = inputs as CalculatorScenarioInputs;
  const modeLabel = i.mode === "gross-to-net" ? "Gross" : "Net";
  let suffix = "";
  if (i.bonus > 0) suffix += " · thưởng";
  if (i.otHours > 0) suffix += " · OT";
  return `${modeLabel} ${compactMoneyLabel(i.amount)} · T${i.month}/${
    i.taxYear
  }${suffix}`;
}

export function newScenarioId(now = Date.now()): string {
  return `sc_${now}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadScenarios(): Promise<{
  store: ScenarioStore;
  recoveredFromCorrupt: boolean;
}> {
  try {
    const json = await AsyncStorage.getItem(SCENARIOS_STORAGE_KEY);
    if (json == null) {
      return { store: emptyScenarioStore(), recoveredFromCorrupt: false };
    }
    const parsed = parseScenarioStore(JSON.parse(json));
    if (!parsed) {
      return { store: emptyScenarioStore(), recoveredFromCorrupt: true };
    }
    return { store: parsed, recoveredFromCorrupt: false };
  } catch {
    return { store: emptyScenarioStore(), recoveredFromCorrupt: true };
  }
}

async function persistStore(store: ScenarioStore): Promise<void> {
  const normalized = parseScenarioStore(store);
  if (!normalized) throw new Error("Invalid scenario store");
  await AsyncStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(normalized));
}

export type SaveScenarioInput =
  | {
      kind?: "calculator";
      name?: string;
      inputs: CalculatorScenarioInputs;
      lastNet?: number;
      id?: string;
      now?: Date;
    }
  | {
      kind: "settlement";
      name?: string;
      inputs: SettlementScenarioInputs;
      lastDelta?: number;
      id?: string;
      now?: Date;
    }
  | {
      kind: "offer_compare";
      name?: string;
      inputs: OfferCompareScenarioInputs;
      lastDeltaNet?: number;
      id?: string;
      now?: Date;
    }
  | {
      kind: "multi_source";
      name?: string;
      inputs: MultiSourceScenarioInputs;
      lastDelta?: number;
      id?: string;
      now?: Date;
    };

export async function saveScenario(
  input: SaveScenarioInput
): Promise<{
  store: ScenarioStore;
  scenario: SavedScenario;
  replacedOldest: boolean;
}> {
  const { store } = await loadScenarios();
  const nowIso = (input.now ?? new Date()).toISOString();
  const kind: ScenarioKind = input.kind ?? "calculator";

  let scenario: SavedScenario;
  if (kind === "settlement") {
    const settlementInput = input as Extract<
      SaveScenarioInput,
      { kind: "settlement" }
    >;
    const inputs = settlementInputsSafe(settlementInput.inputs);
    const name = (
      settlementInput.name?.trim() || defaultScenarioName(inputs, "settlement")
    ).slice(0, 80);
    if (settlementInput.id) {
      const idx = store.scenarios.findIndex((s) => s.id === settlementInput.id);
      if (idx >= 0 && store.scenarios[idx].kind === "settlement") {
        const updated: SavedSettlementScenario = {
          ...store.scenarios[idx],
          name,
          inputs,
          lastDelta: settlementInput.lastDelta,
          updatedAt: nowIso,
        };
        const next = [...store.scenarios];
        next[idx] = updated;
        const nextStore = { schemaVersion: 1 as const, scenarios: next };
        await persistStore(nextStore);
        return { store: nextStore, scenario: updated, replacedOldest: false };
      }
    }
    scenario = {
      id: newScenarioId(),
      name,
      createdAt: nowIso,
      updatedAt: nowIso,
      kind: "settlement",
      inputs,
      lastDelta: settlementInput.lastDelta,
    };
  } else if (kind === "offer_compare") {
    const offerInput = input as Extract<
      SaveScenarioInput,
      { kind: "offer_compare" }
    >;
    const inputs = offerCompareInputsSafe(offerInput.inputs);
    const name = (
      offerInput.name?.trim() || defaultScenarioName(inputs, "offer_compare")
    ).slice(0, 80);
    if (offerInput.id) {
      const idx = store.scenarios.findIndex((s) => s.id === offerInput.id);
      if (idx >= 0 && store.scenarios[idx].kind === "offer_compare") {
        const updated: SavedOfferCompareScenario = {
          ...store.scenarios[idx],
          name,
          inputs,
          lastDeltaNet: offerInput.lastDeltaNet,
          updatedAt: nowIso,
        };
        const next = [...store.scenarios];
        next[idx] = updated;
        const nextStore = { schemaVersion: 1 as const, scenarios: next };
        await persistStore(nextStore);
        return { store: nextStore, scenario: updated, replacedOldest: false };
      }
    }
    scenario = {
      id: newScenarioId(),
      name,
      createdAt: nowIso,
      updatedAt: nowIso,
      kind: "offer_compare",
      inputs,
      lastDeltaNet: offerInput.lastDeltaNet,
    };
  } else if (kind === "multi_source") {
    const msInput = input as Extract<
      SaveScenarioInput,
      { kind: "multi_source" }
    >;
    const inputs = multiSourceInputsSafe(msInput.inputs);
    const name = (
      msInput.name?.trim() || defaultScenarioName(inputs, "multi_source")
    ).slice(0, 80);
    if (msInput.id) {
      const idx = store.scenarios.findIndex((s) => s.id === msInput.id);
      if (idx >= 0 && store.scenarios[idx].kind === "multi_source") {
        const updated: SavedMultiSourceScenario = {
          ...store.scenarios[idx],
          name,
          inputs,
          lastDelta: msInput.lastDelta,
          updatedAt: nowIso,
        };
        const next = [...store.scenarios];
        next[idx] = updated;
        const nextStore = { schemaVersion: 1 as const, scenarios: next };
        await persistStore(nextStore);
        return { store: nextStore, scenario: updated, replacedOldest: false };
      }
    }
    scenario = {
      id: newScenarioId(),
      name,
      createdAt: nowIso,
      updatedAt: nowIso,
      kind: "multi_source",
      inputs,
      lastDelta: msInput.lastDelta,
    };
  } else {
    const calcInput = input as Extract<
      SaveScenarioInput,
      { kind?: "calculator" }
    >;
    const inputs = calculatorInputsSafe(calcInput.inputs);
    const name = (calcInput.name?.trim() || defaultScenarioName(inputs)).slice(
      0,
      80
    );
    if (calcInput.id) {
      const idx = store.scenarios.findIndex((s) => s.id === calcInput.id);
      if (idx >= 0 && store.scenarios[idx].kind === "calculator") {
        const updated: SavedCalculatorScenario = {
          ...store.scenarios[idx],
          name,
          inputs,
          lastNet: calcInput.lastNet,
          updatedAt: nowIso,
        };
        const next = [...store.scenarios];
        next[idx] = updated;
        const nextStore = { schemaVersion: 1 as const, scenarios: next };
        await persistStore(nextStore);
        return { store: nextStore, scenario: updated, replacedOldest: false };
      }
    }
    scenario = {
      id: newScenarioId(),
      name,
      createdAt: nowIso,
      updatedAt: nowIso,
      kind: "calculator",
      inputs,
      lastNet: calcInput.lastNet,
    };
  }

  let replacedOldest = false;
  let list = [scenario, ...store.scenarios];
  if (list.length > MAX_SCENARIOS) {
    list = list.slice(0, MAX_SCENARIOS);
    replacedOldest = true;
  }
  const nextStore = { schemaVersion: 1 as const, scenarios: list };
  await persistStore(nextStore);
  return { store: nextStore, scenario, replacedOldest };
}

function calculatorInputsSafe(
  inputs: CalculatorScenarioInputs
): CalculatorScenarioInputs {
  const parsed = parseCalculatorInputs(inputs);
  if (!parsed) throw new Error("Invalid scenario inputs");
  return parsed;
}

function settlementInputsSafe(
  inputs: SettlementScenarioInputs
): SettlementScenarioInputs {
  const parsed = parseSettlementInputs(inputs);
  if (!parsed) throw new Error("Invalid settlement scenario inputs");
  return parsed;
}

function offerCompareInputsSafe(
  inputs: OfferCompareScenarioInputs
): OfferCompareScenarioInputs {
  const parsed = parseOfferCompareInputs(inputs);
  if (!parsed) throw new Error("Invalid offer compare scenario inputs");
  return parsed;
}

function multiSourceInputsSafe(
  inputs: MultiSourceScenarioInputs
): MultiSourceScenarioInputs {
  const parsed = parseMultiSourceInputs(inputs);
  if (!parsed) throw new Error("Invalid multi-source scenario inputs");
  return parsed;
}

export async function deleteScenario(id: string): Promise<ScenarioStore> {
  const { store } = await loadScenarios();
  const nextStore = {
    schemaVersion: 1 as const,
    scenarios: store.scenarios.filter((s) => s.id !== id),
  };
  await persistStore(nextStore);
  return nextStore;
}

export async function clearScenarios(): Promise<ScenarioStore> {
  const next = emptyScenarioStore();
  await persistStore(next);
  return next;
}

function formatDeltaPreview(delta: number): string {
  if (delta === 0) return "khớp";
  if (delta > 0) return `nộp thêm ${delta.toLocaleString("vi-VN")} ₫`;
  return `hoàn ${Math.abs(delta).toLocaleString("vi-VN")} ₫`;
}

/** Plain-text summary for Share sheet (no PII beyond figures user entered). */
export function formatScenarioShareText(args: {
  name?: string;
  inputs: CalculatorScenarioInputs;
  net?: number;
  brand?: string;
}): string;
export function formatScenarioShareText(args: {
  name?: string;
  kind: "settlement";
  inputs: SettlementScenarioInputs;
  delta?: number;
  brand?: string;
}): string;
export function formatScenarioShareText(args: {
  name?: string;
  kind: "offer_compare";
  inputs: OfferCompareScenarioInputs;
  deltaNet?: number | null;
  brand?: string;
}): string;
export function formatScenarioShareText(args: {
  name?: string;
  kind: "multi_source";
  inputs: MultiSourceScenarioInputs;
  estimatedTax?: number;
  withheld?: number;
  delta?: number;
  brand?: string;
}): string;
export function formatScenarioShareText(
  args:
    | {
        name?: string;
        inputs: CalculatorScenarioInputs;
        net?: number;
        brand?: string;
        kind?: "calculator";
      }
    | {
        name?: string;
        kind: "settlement";
        inputs: SettlementScenarioInputs;
        delta?: number;
        brand?: string;
      }
    | {
        name?: string;
        kind: "offer_compare";
        inputs: OfferCompareScenarioInputs;
        deltaNet?: number | null;
        brand?: string;
      }
    | {
        name?: string;
        kind: "multi_source";
        inputs: MultiSourceScenarioInputs;
        estimatedTax?: number;
        withheld?: number;
        delta?: number;
        brand?: string;
      }
): string {
  const brand = args.brand ?? "KSalaryInsights";
  if (args.kind === "settlement") {
    const i = args.inputs;
    const lines = [
      args.name ? `${args.name}` : "Kịch bản quyết toán",
      `Lương ${i.monthlyGross.toLocaleString("vi-VN")} ₫ × ${
        i.monthsWorked
      } tháng`,
      `Năm QT ${i.taxYear} · vùng ${i.region} · NPT ${i.numDependents}`,
      `Đã khấu trừ lương: ${i.salaryWithheld.toLocaleString("vi-VN")} ₫`,
    ];
    if (i.includeCasual) {
      lines.push(
        `Vãng lai: ${i.casualGross.toLocaleString(
          "vi-VN"
        )} ₫ (đã trừ ${i.casualWithheld.toLocaleString("vi-VN")} ₫)`
      );
    }
    if (args.delta != null)
      lines.push(`Ước: ${formatDeltaPreview(args.delta)}`);
    lines.push(` - ước tính offline · ${brand}`);
    return lines.join("\n");
  }

  if (args.kind === "offer_compare") {
    const i = args.inputs;
    const sideLine = (label: string, side: OfferSideInput) =>
      `${label}: ${
        side.mode === "gross-to-net" ? "Gross" : "Net"
      } ${side.amount.toLocaleString("vi-VN")} ₫`;
    const lines = [
      args.name ? `${args.name}` : "So sánh hai offer",
      sideLine("A", i.offerA),
      sideLine("B", i.offerB),
      `Năm ${i.shared.taxYear} · T${i.shared.month} · vùng ${i.shared.region} · NPT ${i.shared.numDependents}`,
    ];
    if (args.deltaNet != null) {
      lines.push(
        `ΔNet (B−A): ${args.deltaNet.toLocaleString("vi-VN")} ₫ (ước)`
      );
    }
    lines.push(` - ước tính offline · không tư vấn chọn · ${brand}`);
    return lines.join("\n");
  }

  if (args.kind === "multi_source") {
    const i = args.inputs;
    const active = i.lines.filter((l) => !l.excluded);
    const lines = [
      args.name ? `${args.name}` : "Tổng hợp QT đa nguồn",
      `Năm ${i.taxYear} · ${active.length} dòng nguồn (ước)`,
    ];
    for (const line of active.slice(0, 6)) {
      lines.push(
        `· ${line.label}: thuế ${line.estimatedTaxTotal.toLocaleString(
          "vi-VN"
        )} ₫`
      );
    }
    if (args.estimatedTax != null) {
      lines.push(
        `Tổng thuế ước: ${args.estimatedTax.toLocaleString("vi-VN")} ₫`
      );
    }
    if (args.withheld != null) {
      lines.push(`Đã nộp: ${args.withheld.toLocaleString("vi-VN")} ₫`);
    }
    if (args.delta != null) {
      lines.push(`Chênh (ước): ${formatDeltaPreview(args.delta)}`);
    }
    lines.push(
      ` - ước tính offline · không thay tờ khai · không ước coin · ${brand}`
    );
    return lines.join("\n");
  }

  const i = args.inputs;
  const lines = [
    args.name ? `${args.name}` : "Kịch bản lương",
    `${
      i.mode === "gross-to-net" ? "Gross" : "Net mục tiêu"
    }: ${i.amount.toLocaleString("vi-VN")} ₫`,
    `Năm thuế ${i.taxYear} · tháng ${i.month} · vùng ${i.region} · NPT ${i.numDependents}`,
  ];
  if (i.bonus > 0) lines.push(`Thưởng: ${i.bonus.toLocaleString("vi-VN")} ₫`);
  if (i.otHours > 0) {
    const night = i.otNight ? " · đêm" : "";
    lines.push(`OT: ${i.otHours} giờ (${i.otDayType}${night})`);
  }
  if (args.net != null)
    lines.push(`Net ước: ${args.net.toLocaleString("vi-VN")} ₫`);
  lines.push(` - ước tính offline · ${brand}`);
  return lines.join("\n");
}

export function scenarioRowMeta(scenario: SavedScenario): string {
  if (scenario.kind === "settlement") {
    const i = scenario.inputs;
    const base = `${formatVndCompact(i.monthlyGross)} ×${i.monthsWorked} · ${
      i.taxYear
    }`;
    if (scenario.lastDelta == null) return base;
    return `${base} · ${formatDeltaPreview(scenario.lastDelta)}`;
  }
  if (scenario.kind === "offer_compare") {
    const i = scenario.inputs;
    const base = `A ${formatVndCompact(i.offerA.amount)} vs B ${formatVndCompact(
      i.offerB.amount
    )}`;
    if (scenario.lastDeltaNet == null) return base;
    const d = scenario.lastDeltaNet;
    const sign = d > 0 ? "+" : "";
    return `${base} · ΔNet ${sign}${formatVndCompact(d)}`;
  }
  if (scenario.kind === "multi_source") {
    const i = scenario.inputs;
    const n = i.lines.filter((l) => !l.excluded).length;
    const base = `${n} nguồn · ${i.taxYear}`;
    if (scenario.lastDelta == null) return base;
    return `${base} · ${formatDeltaPreview(scenario.lastDelta)}`;
  }
  const i = scenario.inputs;
  const mode = i.mode === "gross-to-net" ? "Gross" : "Net";
  const base = `${mode} ${formatVndCompact(i.amount)}`;
  if (scenario.lastNet == null) return base;
  return `${base} · Net ${formatVndCompact(scenario.lastNet)}`;
}

function formatVndCompact(n: number): string {
  return `${n.toLocaleString("vi-VN")} ₫`;
}
