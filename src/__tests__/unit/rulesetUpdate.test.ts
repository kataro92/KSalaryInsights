import {
  clearRulesetOverlays,
  getRuleset,
  listBundledRulesets,
  listRulesets,
} from "@/src/engine/rulesetLoader";
import {
  checkAndApplyRulesetUpdates,
  clearRemoteRulesetsAndOverlays,
} from "@/src/engine/rulesetUpdate";
import {
  compareSemver,
  parseRulesetManifest,
  validateRuleset,
} from "@/src/engine/rulesetValidate";
import { sha256Hex } from "@/src/engine/sha256";
import { clearRemoteRulesetCache } from "@/src/store/remoteRulesets";

const FIXTURE_RULESET = {
  id: "ruleset-2027-h1",
  version: "1.0.0",
  name: "Kỳ tính thuế 2027 H1 (fixture F019)",
  tax_year: 2027,
  effective_from: "2027-01-01",
  effective_to: "2027-06-30",
  legal_sources: ["Fixture F019: không dùng production"],
  personal_relief: 15_500_000,
  dependent_relief: 6_200_000,
  reference_salary: 2_530_000,
  regional_minimum_wages: {
    "1": 5_310_000,
    "2": 4_730_000,
    "3": 4_140_000,
    "4": 3_700_000,
  },
  insurance_rates: {
    employee: { social: 0.08, health: 0.015, unemployment: 0.01 },
    employer: { social: 0.17, health: 0.03, unemployment: 0.01 },
  },
  insurance_caps: { social_health_multiplier: 20, unemployment_multiplier: 20 },
  pit_brackets: [
    { bracket: 1, max_taxable_income: 10_000_000, rate: 0.05 },
    { bracket: 2, max_taxable_income: null, rate: 0.35 },
  ],
} as const;

const FIXTURE_BODY = JSON.stringify(FIXTURE_RULESET);

function mockFetch(
  map: Record<string, { body: string; status?: number }>
): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    const hit = map[url];
    if (!hit) {
      return new Response("not found", { status: 404 });
    }
    return new Response(hit.body, {
      status: hit.status ?? 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

describe("F019 remote ruleset update", () => {
  beforeEach(async () => {
    clearRulesetOverlays();
    await clearRemoteRulesetCache();
  });

  afterEach(() => {
    clearRulesetOverlays();
  });

  it("compareSemver orders versions", () => {
    expect(compareSemver("1.0.1", "1.0.0")).toBe(1);
    expect(compareSemver("1.0.0", "1.0.1")).toBe(-1);
    expect(compareSemver("1.0.0", "1.0.0")).toBe(0);
  });

  it("validateRuleset accepts fixture and rejects garbage", () => {
    expect(validateRuleset(FIXTURE_RULESET)?.id).toBe("ruleset-2027-h1");
    expect(validateRuleset({ id: "x" })).toBeNull();
  });

  it("parseRulesetManifest requires sha256 hex", () => {
    expect(
      parseRulesetManifest({
        schemaVersion: 1,
        generatedAt: "2026-08-05T00:00:00.000Z",
        rulesets: [],
      })
    ).not.toBeNull();
    expect(
      parseRulesetManifest({
        schemaVersion: 1,
        generatedAt: "2026-08-05T00:00:00.000Z",
        rulesets: [
          {
            id: "x",
            version: "1.0.0",
            url: "https://example.com/x.json",
            sha256: "deadbeef",
          },
        ],
      })
    ).toBeNull();
  });

  it("empty manifest keeps bundle and reports up to date", async () => {
    const before = listBundledRulesets().length;
    const manifest = JSON.stringify({
      schemaVersion: 1,
      generatedAt: "2026-08-05T00:00:00.000Z",
      rulesets: [],
      inflation: [],
    });
    const result = await checkAndApplyRulesetUpdates({
      manifestUrl: "https://example.test/manifest.json",
      fetchImpl: mockFetch({
        "https://example.test/manifest.json": { body: manifest },
      }),
      now: new Date("2026-08-05T12:00:00.000Z"),
    });
    expect(result.ok).toBe(true);
    expect(result.appliedIds).toHaveLength(0);
    expect(listRulesets()).toHaveLength(before);
    expect(result.message).toMatch(/mới nhất/i);
  });

  it("installs new ruleset id after checksum pass", async () => {
    const hash = await sha256Hex(FIXTURE_BODY);
    const manifest = JSON.stringify({
      schemaVersion: 1,
      generatedAt: "2026-08-05T00:00:00.000Z",
      rulesets: [
        {
          id: "ruleset-2027-h1",
          version: "1.0.0",
          url: "https://example.test/2027-h1.json",
          sha256: hash,
        },
      ],
    });

    const result = await checkAndApplyRulesetUpdates({
      manifestUrl: "https://example.test/manifest.json",
      fetchImpl: mockFetch({
        "https://example.test/manifest.json": { body: manifest },
        "https://example.test/2027-h1.json": { body: FIXTURE_BODY },
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.appliedIds).toContain("ruleset-2027-h1");
    expect(getRuleset(2027).id).toBe("ruleset-2027-h1");
  });

  it("rejects bad checksum and keeps bundle", async () => {
    const before = listRulesets()
      .map((r) => r.id)
      .sort();
    const manifest = JSON.stringify({
      schemaVersion: 1,
      generatedAt: "2026-08-05T00:00:00.000Z",
      rulesets: [
        {
          id: "ruleset-2027-h1",
          version: "1.0.0",
          url: "https://example.test/2027-h1.json",
          sha256: "a".repeat(64),
        },
      ],
    });

    const result = await checkAndApplyRulesetUpdates({
      manifestUrl: "https://example.test/manifest.json",
      fetchImpl: mockFetch({
        "https://example.test/manifest.json": { body: manifest },
        "https://example.test/2027-h1.json": { body: FIXTURE_BODY },
      }),
    });

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Checksum/i);
    expect(
      listRulesets()
        .map((r) => r.id)
        .sort()
    ).toEqual(before);
  });

  it("does not override bundle with older remote version", async () => {
    const bundled = listBundledRulesets().find((r) => r.id === "ruleset-2025");
    expect(bundled).toBeTruthy();
    const older = { ...bundled!, version: "0.9.0" };
    const body = JSON.stringify(older);
    const hash = await sha256Hex(body);
    const manifest = JSON.stringify({
      schemaVersion: 1,
      generatedAt: "2026-08-05T00:00:00.000Z",
      rulesets: [
        {
          id: "ruleset-2025",
          version: "0.9.0",
          url: "https://example.test/2025-old.json",
          sha256: hash,
        },
      ],
    });

    const result = await checkAndApplyRulesetUpdates({
      manifestUrl: "https://example.test/manifest.json",
      fetchImpl: mockFetch({
        "https://example.test/manifest.json": { body: manifest },
        "https://example.test/2025-old.json": { body },
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.appliedIds).toHaveLength(0);
    expect(getRuleset(2025).version).toBe(bundled!.version);
  });

  it("clearRemoteRulesetsAndOverlays restores bundle-only", async () => {
    const hash = await sha256Hex(FIXTURE_BODY);
    const manifest = JSON.stringify({
      schemaVersion: 1,
      generatedAt: "2026-08-05T00:00:00.000Z",
      rulesets: [
        {
          id: "ruleset-2027-h1",
          version: "1.0.0",
          url: "https://example.test/2027-h1.json",
          sha256: hash,
        },
      ],
    });
    await checkAndApplyRulesetUpdates({
      manifestUrl: "https://example.test/manifest.json",
      fetchImpl: mockFetch({
        "https://example.test/manifest.json": { body: manifest },
        "https://example.test/2027-h1.json": { body: FIXTURE_BODY },
      }),
    });
    expect(listRulesets().some((r) => r.id === "ruleset-2027-h1")).toBe(true);

    await clearRemoteRulesetsAndOverlays();
    expect(listRulesets().some((r) => r.id === "ruleset-2027-h1")).toBe(false);
    expect(listRulesets()).toHaveLength(listBundledRulesets().length);
  });
});
