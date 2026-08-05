import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CalculationMode, RegionCode } from '@/src/domain/types/salary';
import type { OtDayType } from '@/src/engine/overtime';

export const SCENARIOS_STORAGE_KEY = 'kv.scenarios.v1';
export const MAX_SCENARIOS = 20;

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
};

export type SavedScenario = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  kind: 'calculator';
  inputs: CalculatorScenarioInputs;
  /** Last computed net for list preview (optional). */
  lastNet?: number;
};

export type ScenarioStore = {
  schemaVersion: 1;
  scenarios: SavedScenario[];
};

const MODES: readonly CalculationMode[] = ['gross-to-net', 'net-to-gross'];
const REGIONS: readonly RegionCode[] = ['I', 'II', 'III', 'IV'];
const OT_TYPES: readonly OtDayType[] = ['weekday', 'weekend', 'holiday'];

function isMode(v: unknown): v is CalculationMode {
  return typeof v === 'string' && (MODES as readonly string[]).includes(v);
}

function isRegion(v: unknown): v is RegionCode {
  return typeof v === 'string' && (REGIONS as readonly string[]).includes(v);
}

function isOtDay(v: unknown): v is OtDayType {
  return typeof v === 'string' && (OT_TYPES as readonly string[]).includes(v);
}

function isNonNegInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && Number.isFinite(v);
}

function isPositiveInt(v: unknown): v is number {
  return isNonNegInt(v) && v > 0;
}

export function parseCalculatorInputs(raw: unknown): CalculatorScenarioInputs | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (!isMode(o.mode)) return null;
  if (!isPositiveInt(o.amount)) return null;
  if (!isRegion(o.region)) return null;
  if (typeof o.taxYear !== 'number' || !Number.isInteger(o.taxYear)) return null;
  if (o.taxYear < 2000 || o.taxYear > 2100) return null;
  if (typeof o.month !== 'number' || !Number.isInteger(o.month) || o.month < 1 || o.month > 12) {
    return null;
  }
  if (!isNonNegInt(o.numDependents) || o.numDependents > 99) return null;
  if (typeof o.customBh !== 'boolean') return null;
  if (o.bhAmount != null && !isNonNegInt(o.bhAmount)) return null;
  if (!isNonNegInt(o.bonus)) return null;
  if (typeof o.otHours !== 'number' || !Number.isFinite(o.otHours) || o.otHours < 0 || o.otHours > 744) {
    return null;
  }
  if (!isOtDay(o.otDayType)) return null;
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
  };
}

export function parseSavedScenario(raw: unknown): SavedScenario | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || !o.id) return null;
  if (typeof o.name !== 'string' || !o.name.trim()) return null;
  if (typeof o.createdAt !== 'string' || typeof o.updatedAt !== 'string') return null;
  if (o.kind !== 'calculator') return null;
  const inputs = parseCalculatorInputs(o.inputs);
  if (!inputs) return null;
  const lastNet =
    o.lastNet == null
      ? undefined
      : typeof o.lastNet === 'number' && Number.isFinite(o.lastNet)
        ? o.lastNet
        : undefined;
  return {
    id: o.id,
    name: o.name.trim().slice(0, 80),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    kind: 'calculator',
    inputs,
    lastNet,
  };
}

export function parseScenarioStore(raw: unknown): ScenarioStore | null {
  if (!raw || typeof raw !== 'object') return null;
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

/** Compact default name from inputs, e.g. "Gross 30tr · T3/2026". */
export function defaultScenarioName(inputs: CalculatorScenarioInputs): string {
  const modeLabel = inputs.mode === 'gross-to-net' ? 'Gross' : 'Net';
  const millions = inputs.amount / 1_000_000;
  const amountLabel =
    millions >= 1
      ? `${Number.isInteger(millions) ? millions : millions.toFixed(1)}tr`
      : `${Math.round(inputs.amount / 1000)}k`;
  let suffix = '';
  if (inputs.bonus > 0) suffix += ' · thưởng';
  if (inputs.otHours > 0) suffix += ' · OT';
  return `${modeLabel} ${amountLabel} · T${inputs.month}/${inputs.taxYear}${suffix}`;
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
  if (!normalized) throw new Error('Invalid scenario store');
  await AsyncStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(normalized));
}

export type SaveScenarioInput = {
  name?: string;
  inputs: CalculatorScenarioInputs;
  lastNet?: number;
  /** Replace existing by id when updating. */
  id?: string;
  now?: Date;
};

export async function saveScenario(
  input: SaveScenarioInput,
): Promise<{ store: ScenarioStore; scenario: SavedScenario; replacedOldest: boolean }> {
  const { store } = await loadScenarios();
  const nowIso = (input.now ?? new Date()).toISOString();
  const inputs = inputsSafe(input.inputs);
  const name = (input.name?.trim() || defaultScenarioName(inputs)).slice(0, 80);

  if (input.id) {
    const idx = store.scenarios.findIndex((s) => s.id === input.id);
    if (idx >= 0) {
      const updated: SavedScenario = {
        ...store.scenarios[idx],
        name,
        inputs,
        lastNet: input.lastNet,
        updatedAt: nowIso,
      };
      const next = [...store.scenarios];
      next[idx] = updated;
      const nextStore = { schemaVersion: 1 as const, scenarios: next };
      await persistStore(nextStore);
      return { store: nextStore, scenario: updated, replacedOldest: false };
    }
  }

  const scenario: SavedScenario = {
    id: newScenarioId(),
    name,
    createdAt: nowIso,
    updatedAt: nowIso,
    kind: 'calculator',
    inputs,
    lastNet: input.lastNet,
  };

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

function inputsSafe(inputs: CalculatorScenarioInputs): CalculatorScenarioInputs {
  const parsed = parseCalculatorInputs(inputs);
  if (!parsed) throw new Error('Invalid scenario inputs');
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

/** Plain-text summary for Share sheet (no PII beyond salary figures user entered). */
export function formatScenarioShareText(args: {
  name?: string;
  inputs: CalculatorScenarioInputs;
  net?: number;
  brand?: string;
}): string {
  const brand = args.brand ?? 'KVSalaryTools';
  const i = args.inputs;
  const lines = [
    args.name ? `${args.name}` : 'Kịch bản lương',
    `${i.mode === 'gross-to-net' ? 'Gross' : 'Net mục tiêu'}: ${i.amount.toLocaleString('vi-VN')} ₫`,
    `Năm thuế ${i.taxYear} · tháng ${i.month} · vùng ${i.region} · NPT ${i.numDependents}`,
  ];
  if (i.bonus > 0) lines.push(`Thưởng: ${i.bonus.toLocaleString('vi-VN')} ₫`);
  if (i.otHours > 0) lines.push(`OT: ${i.otHours} giờ (${i.otDayType})`);
  if (args.net != null) lines.push(`Net ước: ${args.net.toLocaleString('vi-VN')} ₫`);
  lines.push(`— ước tính offline · ${brand}`);
  return lines.join('\n');
}
