/**
 * F019: fetch remote ruleset manifest, verify checksum, cache + apply overlays.
 * @see docs/decisions/0008-remote-ruleset-update.md
 */

import { getRulesetManifestUrl } from "@/src/config/rulesetUpdate";
import type { InflationAdjustmentTable } from "@/src/domain/types/retirement";
import type { Ruleset } from "@/src/domain/types/salary";
import {
  clearRulesetOverlays,
  listBundledRulesets,
  setInflationOverlays,
  setRulesetOverlays,
} from "@/src/engine/rulesetLoader";
import {
  compareSemver,
  parseRulesetManifest,
  validateInflationTable,
  validateRuleset,
  type RulesetManifest,
} from "@/src/engine/rulesetValidate";
import { verifySha256 } from "@/src/engine/sha256";
import {
  emptyRemoteRulesetCache,
  loadRemoteRulesetCache,
  saveRemoteRulesetCache,
  type RemoteRulesetCache,
} from "@/src/store/remoteRulesets";

export type RulesetUpdateResult = {
  ok: boolean;
  cache: RemoteRulesetCache;
  /** Rulesets newly written or version-bumped this run. */
  appliedIds: string[];
  message: string;
};

type FetchLike = typeof fetch;

async function fetchText(url: string, fetchImpl: FetchLike): Promise<string> {
  const res = await fetchImpl(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} khi tải ${url}`);
  }
  return res.text();
}

function shouldInstallRemote(remote: Ruleset, bundled: Ruleset[]): boolean {
  const existing = bundled.find((b) => b.id === remote.id);
  if (!existing) return true;
  return compareSemver(remote.version, existing.version) > 0;
}

/**
 * Apply cache into in-memory registry (call on cold start).
 */
export async function hydrateRulesetOverlaysFromCache(): Promise<RemoteRulesetCache> {
  const { cache } = await loadRemoteRulesetCache();
  setRulesetOverlays(cache.rulesets);
  setInflationOverlays(cache.inflation);
  return cache;
}

export async function clearRemoteRulesetsAndOverlays(): Promise<RemoteRulesetCache> {
  clearRulesetOverlays();
  const empty = emptyRemoteRulesetCache();
  await saveRemoteRulesetCache(empty);
  return empty;
}

/**
 * Check remote manifest and install newer / new rulesets.
 * Never uploads salary data. GET only.
 */
export async function checkAndApplyRulesetUpdates(options?: {
  fetchImpl?: FetchLike;
  manifestUrl?: string;
  now?: Date;
}): Promise<RulesetUpdateResult> {
  const fetchImpl = options?.fetchImpl ?? fetch;
  const manifestUrl = options?.manifestUrl ?? getRulesetManifestUrl();
  const nowIso = (options?.now ?? new Date()).toISOString();
  const { cache: prev } = await loadRemoteRulesetCache();
  const bundled = listBundledRulesets();

  try {
    const manifestText = await fetchText(manifestUrl, fetchImpl);
    const manifest = parseRulesetManifest(JSON.parse(manifestText));
    if (!manifest) {
      throw new Error("Manifest không hợp lệ");
    }

    const nextRulesets = new Map<string, Ruleset>();
    for (const r of prev.rulesets) nextRulesets.set(r.id, r);

    const nextInflation = new Map<number, InflationAdjustmentTable>();
    for (const t of prev.inflation) nextInflation.set(t.table_year, t);

    const appliedIds: string[] = [];

    for (const entry of manifest.rulesets) {
      const body = await fetchText(entry.url, fetchImpl);
      const okHash = await verifySha256(body, entry.sha256);
      if (!okHash) {
        throw new Error(`Checksum sai cho bộ tham số ${entry.id}`);
      }
      const parsed = validateRuleset(JSON.parse(body));
      if (!parsed) {
        throw new Error(`Bộ tham số ${entry.id} không đúng cấu trúc`);
      }
      if (parsed.id !== entry.id) {
        throw new Error(`Manifest id ${entry.id} ≠ file id ${parsed.id}`);
      }
      if (parsed.version !== entry.version) {
        throw new Error(
          `Manifest version ${entry.version} ≠ file version ${parsed.version}`
        );
      }
      // Only cache if newer than bundle (or brand-new id).
      if (!shouldInstallRemote(parsed, bundled)) {
        continue;
      }
      const cached = nextRulesets.get(parsed.id);
      if (cached && compareSemver(parsed.version, cached.version) <= 0) {
        continue;
      }
      nextRulesets.set(parsed.id, parsed);
      appliedIds.push(parsed.id);
    }

    for (const entry of manifest.inflation ?? []) {
      const body = await fetchText(entry.url, fetchImpl);
      const okHash = await verifySha256(body, entry.sha256);
      if (!okHash) {
        throw new Error(`Checksum sai cho bảng trượt giá ${entry.year}`);
      }
      const parsed = validateInflationTable(JSON.parse(body));
      if (!parsed) {
        throw new Error(`Bảng trượt giá ${entry.year} không hợp lệ`);
      }
      if (parsed.table_year !== entry.year) {
        throw new Error(
          `Manifest year ${entry.year} ≠ table_year ${parsed.table_year}`
        );
      }
      nextInflation.set(parsed.table_year, parsed);
      appliedIds.push(`inflation-${parsed.table_year}`);
    }

    const cache: RemoteRulesetCache = {
      schemaVersion: 1,
      updatedAt: appliedIds.length > 0 ? nowIso : prev.updatedAt,
      manifestGeneratedAt: manifest.generatedAt,
      rulesets: [...nextRulesets.values()],
      inflation: [...nextInflation.values()],
      lastError: null,
      lastCheckAt: nowIso,
    };

    await saveRemoteRulesetCache(cache);
    setRulesetOverlays(cache.rulesets);
    setInflationOverlays(cache.inflation);

    const message =
      appliedIds.length > 0
        ? `Đã cập nhật ${appliedIds.length} bộ tham số.`
        : "Mức thuế · BH đã ở phiên bản mới nhất.";

    return { ok: true, cache, appliedIds, message };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : "Không kiểm tra được cập nhật mức thuế · BH";
    const cache: RemoteRulesetCache = {
      ...prev,
      lastError: message,
      lastCheckAt: nowIso,
    };
    await saveRemoteRulesetCache(cache);
    // Keep existing overlays from prev cache
    setRulesetOverlays(prev.rulesets);
    setInflationOverlays(prev.inflation);
    return { ok: false, cache, appliedIds: [], message };
  }
}

export type { RulesetManifest };
