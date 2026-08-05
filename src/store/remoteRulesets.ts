import AsyncStorage from "@react-native-async-storage/async-storage";

import type { InflationAdjustmentTable } from "@/src/domain/types/retirement";
import type { Ruleset } from "@/src/domain/types/salary";
import {
  validateInflationTable,
  validateRuleset,
} from "@/src/engine/rulesetValidate";

export const REMOTE_RULESETS_STORAGE_KEY = "kv.remoteRulesets.v1";

export type RemoteRulesetCache = {
  schemaVersion: 1;
  updatedAt: string | null;
  manifestGeneratedAt: string | null;
  rulesets: Ruleset[];
  inflation: InflationAdjustmentTable[];
  lastError: string | null;
  lastCheckAt: string | null;
};

export function emptyRemoteRulesetCache(): RemoteRulesetCache {
  return {
    schemaVersion: 1,
    updatedAt: null,
    manifestGeneratedAt: null,
    rulesets: [],
    inflation: [],
    lastError: null,
    lastCheckAt: null,
  };
}

export function parseRemoteRulesetCache(
  raw: unknown
): RemoteRulesetCache | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.schemaVersion !== 1) return null;
  if (!Array.isArray(o.rulesets) || !Array.isArray(o.inflation)) return null;

  const rulesets: Ruleset[] = [];
  for (const item of o.rulesets) {
    const r = validateRuleset(item);
    if (r) rulesets.push(r);
  }

  const inflation: InflationAdjustmentTable[] = [];
  for (const item of o.inflation) {
    const t = validateInflationTable(item);
    if (t) inflation.push(t);
  }

  return {
    schemaVersion: 1,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
    manifestGeneratedAt:
      typeof o.manifestGeneratedAt === "string" ? o.manifestGeneratedAt : null,
    rulesets,
    inflation,
    lastError: typeof o.lastError === "string" ? o.lastError : null,
    lastCheckAt: typeof o.lastCheckAt === "string" ? o.lastCheckAt : null,
  };
}

export async function loadRemoteRulesetCache(): Promise<{
  cache: RemoteRulesetCache;
  recoveredFromCorrupt: boolean;
}> {
  try {
    const json = await AsyncStorage.getItem(REMOTE_RULESETS_STORAGE_KEY);
    if (json == null) {
      return { cache: emptyRemoteRulesetCache(), recoveredFromCorrupt: false };
    }
    const parsed = parseRemoteRulesetCache(JSON.parse(json));
    if (!parsed) {
      return { cache: emptyRemoteRulesetCache(), recoveredFromCorrupt: true };
    }
    return { cache: parsed, recoveredFromCorrupt: false };
  } catch {
    return { cache: emptyRemoteRulesetCache(), recoveredFromCorrupt: true };
  }
}

export async function saveRemoteRulesetCache(
  cache: RemoteRulesetCache
): Promise<void> {
  const normalized = parseRemoteRulesetCache(cache);
  if (!normalized) throw new Error("Invalid remote ruleset cache");
  await AsyncStorage.setItem(
    REMOTE_RULESETS_STORAGE_KEY,
    JSON.stringify(normalized)
  );
}

export async function clearRemoteRulesetCache(): Promise<RemoteRulesetCache> {
  const empty = emptyRemoteRulesetCache();
  await AsyncStorage.setItem(
    REMOTE_RULESETS_STORAGE_KEY,
    JSON.stringify(empty)
  );
  return empty;
}
