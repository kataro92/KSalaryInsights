import {
  clearScenarios,
  defaultScenarioName,
  deleteScenario,
  formatScenarioShareText,
  loadScenarios,
  MAX_SCENARIOS,
  parseCalculatorInputs,
  parseScenarioStore,
  parseSettlementInputs,
  saveScenario,
  scenariosOfKind,
  SCENARIOS_STORAGE_KEY,
  type CalculatorScenarioInputs,
  type SettlementScenarioInputs,
} from "@/src/store/scenarios";

const sampleInputs = (): CalculatorScenarioInputs => ({
  mode: "gross-to-net",
  amount: 30_000_000,
  region: "I",
  taxYear: 2026,
  month: 3,
  numDependents: 1,
  insurance: { mode: "full" },
  customBh: false,
  bhAmount: null,
  bonus: 0,
  otHours: 0,
  otDayType: "weekday",
  otNight: false,
});

const sampleSettlement = (): SettlementScenarioInputs => ({
  taxYear: 2025,
  region: "I",
  numDependents: 0,
  monthlyGross: 30_000_000,
  monthsWorked: 10,
  salaryWithheld: 16_275_000,
  includeCasual: false,
  casualGross: 0,
  casualWithheld: 0,
});

describe("scenarios store (F014)", () => {
  beforeEach(async () => {
    await clearScenarios();
  });

  it("uses stable storage key and max cap", () => {
    expect(SCENARIOS_STORAGE_KEY).toBe("kv.scenarios.v1");
    expect(MAX_SCENARIOS).toBe(20);
  });

  it("defaultScenarioName formats compact label", () => {
    expect(defaultScenarioName(sampleInputs())).toBe("Gross 30tr · T3/2026");
    expect(
      defaultScenarioName({
        ...sampleInputs(),
        mode: "net-to-gross",
        amount: 500_000,
        bonus: 10_000_000,
        otHours: 2,
      })
    ).toBe("Net 500k · T3/2026 · thưởng · làm thêm");
  });

  it("defaultScenarioName formats settlement label", () => {
    expect(defaultScenarioName(sampleSettlement(), "settlement")).toBe(
      "Quyết toán 30tr ×10 · 2025"
    );
    expect(
      defaultScenarioName(
        { ...sampleSettlement(), includeCasual: true, casualGross: 60_000_000 },
        "settlement"
      )
    ).toBe("Quyết toán 30tr ×10 · 2025 · vãng lai");
  });

  it("parseCalculatorInputs rejects invalid payloads", () => {
    expect(parseCalculatorInputs(null)).toBeNull();
    expect(parseCalculatorInputs({ ...sampleInputs(), amount: 0 })).toBeNull();
    expect(parseCalculatorInputs({ ...sampleInputs(), month: 13 })).toBeNull();
    expect(
      parseCalculatorInputs({ ...sampleInputs(), region: "V" })
    ).toBeNull();
    expect(
      parseCalculatorInputs({ ...sampleInputs(), otHours: -1 })
    ).toBeNull();
  });

  it("parseCalculatorInputs defaults missing otNight to false (legacy saves)", () => {
    const { otNight: _drop, ...legacy } = sampleInputs();
    const parsed = parseCalculatorInputs(legacy);
    expect(parsed?.otNight).toBe(false);
  });

  it("parseSettlementInputs validates months and money", () => {
    expect(parseSettlementInputs(sampleSettlement())?.monthsWorked).toBe(10);
    expect(
      parseSettlementInputs({ ...sampleSettlement(), monthsWorked: 0 })
    ).toBeNull();
    expect(
      parseSettlementInputs({ ...sampleSettlement(), monthlyGross: 0 })
    ).toBeNull();
  });

  it("parseScenarioStore drops corrupt entries and keeps valid", () => {
    const store = parseScenarioStore({
      schemaVersion: 1,
      scenarios: [
        {
          id: "a",
          name: "OK",
          createdAt: "2026-03-01T00:00:00.000Z",
          updatedAt: "2026-03-01T00:00:00.000Z",
          kind: "calculator",
          inputs: sampleInputs(),
          lastNet: 22_000_000,
        },
        {
          id: "b",
          name: "QT OK",
          createdAt: "2026-03-01T00:00:00.000Z",
          updatedAt: "2026-03-01T00:00:00.000Z",
          kind: "settlement",
          inputs: sampleSettlement(),
          lastDelta: -4_800_000,
        },
        { id: "bad", name: "", kind: "calculator" },
      ],
    });
    expect(store?.scenarios).toHaveLength(2);
    expect(store?.scenarios[0].name).toBe("OK");
    expect(store?.scenarios[1].kind).toBe("settlement");
  });

  it("persists save, load, delete", async () => {
    const { scenario, replacedOldest } = await saveScenario({
      name: "Lương chính",
      inputs: sampleInputs(),
      lastNet: 22_500_000,
      now: new Date("2026-03-15T10:00:00.000Z"),
    });
    expect(replacedOldest).toBe(false);
    expect(scenario.name).toBe("Lương chính");
    expect(scenario.kind).toBe("calculator");
    if (scenario.kind === "calculator") {
      expect(scenario.inputs.amount).toBe(30_000_000);
    }

    const loaded = await loadScenarios();
    expect(loaded.recoveredFromCorrupt).toBe(false);
    expect(loaded.store.scenarios).toHaveLength(1);

    await deleteScenario(scenario.id);
    const after = await loadScenarios();
    expect(after.store.scenarios).toHaveLength(0);
  });

  it("persists settlement scenarios alongside calculator", async () => {
    await saveScenario({ inputs: sampleInputs(), name: "Lương" });
    const { scenario } = await saveScenario({
      kind: "settlement",
      name: "QT 2025",
      inputs: sampleSettlement(),
      lastDelta: -4_800_000,
    });
    expect(scenario.kind).toBe("settlement");
    if (scenario.kind === "settlement") {
      expect(scenario.lastDelta).toBe(-4_800_000);
    }

    const loaded = await loadScenarios();
    expect(loaded.store.scenarios).toHaveLength(2);
    expect(scenariosOfKind(loaded.store.scenarios, "settlement")).toHaveLength(
      1
    );
    expect(scenariosOfKind(loaded.store.scenarios, "calculator")).toHaveLength(
      1
    );
  });

  it("caps at MAX_SCENARIOS and drops oldest", async () => {
    for (let i = 0; i < MAX_SCENARIOS; i++) {
      await saveScenario({
        name: `S${i}`,
        inputs: { ...sampleInputs(), amount: 1_000_000 + i },
      });
    }
    const overflow = await saveScenario({
      name: "Newest",
      inputs: { ...sampleInputs(), amount: 99_000_000 },
    });
    expect(overflow.replacedOldest).toBe(true);
    expect(overflow.store.scenarios).toHaveLength(MAX_SCENARIOS);
    expect(overflow.store.scenarios[0].name).toBe("Newest");
    expect(overflow.store.scenarios.some((s) => s.name === "S0")).toBe(false);
  });

  it("formatScenarioShareText includes net and brand", () => {
    const text = formatScenarioShareText({
      name: "Demo",
      inputs: sampleInputs(),
      net: 22_000_000,
      brand: "KSalaryInsights",
    });
    expect(text).toContain("Demo");
    expect(text).toContain("30.000.000");
    expect(text).toContain("22.000.000");
    expect(text).toContain("KSalaryInsights");
  });

  it("formatScenarioShareText for settlement includes delta", () => {
    const text = formatScenarioShareText({
      kind: "settlement",
      name: "QT Demo",
      inputs: sampleSettlement(),
      delta: -4_800_000,
      brand: "KSalaryInsights",
    });
    expect(text).toContain("QT Demo");
    expect(text).toContain("hoàn");
    expect(text).toContain("4.800.000");
    expect(text).toContain("KSalaryInsights");
  });
});
