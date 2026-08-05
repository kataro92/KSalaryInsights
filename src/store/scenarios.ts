import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CalculationMode, RegionCode } from "@/src/domain/types/salary";
import type { OtDayType } from "@/src/engine/overtime";

export const SCENARIOS_STORAGE_KEY = "kv.scenarios.v1";
export const MAX_SCENARIOS = 20;

export type ScenarioKind = "calculator" | "settlement";

export type CalculatorScenarioInputs = {
  mode: CalculationMode;
  /** Integer VNĐ amount (gross or desired net). */
  amount: number;
  region: RegionCode;
  taxYear: number;
  month: number;
  numDependents: number;
  customBh: boolean;
  /** Insurance base when customBh; otherwise ignored. */
  bhAmount: number | null;
  bonus: number;
  otHours: number;
  otDayType: OtDayType;
  /** OT trong khung 22h–6h (Đ.106). Missing on older saves → false. */
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

export type SavedScenario = SavedCalculatorScenario | SavedSettlementScenario;

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
  if (typeof o.customBh !== "boolean") return null;
  if (o.bhAmount != null && !isNonNegInt(o.bhAmount)) return null;
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
    customBh: o.customBh,
    bhAmount: o.bhAmount == null ? null : o.bhAmount,
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
  inputs: CalculatorScenarioInputs | SettlementScenarioInputs,
  kind: ScenarioKind = "calculator"
): string {
  if (kind === "settlement") {
    const i = inputs as SettlementScenarioInputs;
    const casual = i.includeCasual && i.casualGross > 0 ? " · vãng lai" : "";
    return `QT ${compactMoneyLabel(i.monthlyGross)} ×${i.monthsWorked} · ${
      i.taxYear
    }${casual}`;
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
): string {
  const brand = args.brand ?? "KVSalaryTools";
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
  const i = scenario.inputs;
  const mode = i.mode === "gross-to-net" ? "Gross" : "Net";
  const base = `${mode} ${formatVndCompact(i.amount)}`;
  if (scenario.lastNet == null) return base;
  return `${base} · Net ${formatVndCompact(scenario.lastNet)}`;
}

function formatVndCompact(n: number): string {
  return `${n.toLocaleString("vi-VN")} ₫`;
}
