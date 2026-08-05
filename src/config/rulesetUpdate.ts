/**
 * F019 remote ruleset update. Config (ADR 0008).
 * Manifest is public JSON; never sends salary / PII.
 */

/** Default public manifest (repo-hosted). Override in tests via `setManifestUrl`. */
export const DEFAULT_RULESET_MANIFEST_URL =
  "https://raw.githubusercontent.com/kataro92/KSalaryInsights/master/docs/product/remote/ruleset-manifest.json";

let manifestUrlOverride: string | null = null;

export function getRulesetManifestUrl(): string {
  return manifestUrlOverride ?? DEFAULT_RULESET_MANIFEST_URL;
}

/** Test / debug only. Pass null to restore default. */
export function setRulesetManifestUrl(url: string | null): void {
  manifestUrlOverride = url;
}
