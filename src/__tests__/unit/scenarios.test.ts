import {
  clearScenarios,
  defaultScenarioName,
  deleteScenario,
  formatScenarioShareText,
  loadScenarios,
  MAX_SCENARIOS,
  parseCalculatorInputs,
  parseScenarioStore,
  saveScenario,
  SCENARIOS_STORAGE_KEY,
  type CalculatorScenarioInputs,
} from '@/src/store/scenarios';

const sampleInputs = (): CalculatorScenarioInputs => ({
  mode: 'gross-to-net',
  amount: 30_000_000,
  region: 'I',
  taxYear: 2026,
  month: 3,
  numDependents: 1,
  customBh: false,
  bhAmount: null,
  bonus: 0,
  otHours: 0,
  otDayType: 'weekday',
});

describe('scenarios store (F014)', () => {
  beforeEach(async () => {
    await clearScenarios();
  });

  it('uses stable storage key and max cap', () => {
    expect(SCENARIOS_STORAGE_KEY).toBe('kv.scenarios.v1');
    expect(MAX_SCENARIOS).toBe(20);
  });

  it('defaultScenarioName formats compact label', () => {
    expect(defaultScenarioName(sampleInputs())).toBe('Gross 30tr · T3/2026');
    expect(
      defaultScenarioName({
        ...sampleInputs(),
        mode: 'net-to-gross',
        amount: 500_000,
        bonus: 10_000_000,
        otHours: 2,
      }),
    ).toBe('Net 500k · T3/2026 · thưởng · OT');
  });

  it('parseCalculatorInputs rejects invalid payloads', () => {
    expect(parseCalculatorInputs(null)).toBeNull();
    expect(parseCalculatorInputs({ ...sampleInputs(), amount: 0 })).toBeNull();
    expect(parseCalculatorInputs({ ...sampleInputs(), month: 13 })).toBeNull();
    expect(parseCalculatorInputs({ ...sampleInputs(), region: 'V' })).toBeNull();
    expect(parseCalculatorInputs({ ...sampleInputs(), otHours: -1 })).toBeNull();
  });

  it('parseScenarioStore drops corrupt entries and keeps valid', () => {
    const store = parseScenarioStore({
      schemaVersion: 1,
      scenarios: [
        {
          id: 'a',
          name: 'OK',
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
          kind: 'calculator',
          inputs: sampleInputs(),
          lastNet: 22_000_000,
        },
        { id: 'bad', name: '', kind: 'calculator' },
      ],
    });
    expect(store?.scenarios).toHaveLength(1);
    expect(store?.scenarios[0].name).toBe('OK');
  });

  it('persists save, load, delete', async () => {
    const { scenario, replacedOldest } = await saveScenario({
      name: 'Lương chính',
      inputs: sampleInputs(),
      lastNet: 22_500_000,
      now: new Date('2026-03-15T10:00:00.000Z'),
    });
    expect(replacedOldest).toBe(false);
    expect(scenario.name).toBe('Lương chính');
    expect(scenario.inputs.amount).toBe(30_000_000);

    const loaded = await loadScenarios();
    expect(loaded.recoveredFromCorrupt).toBe(false);
    expect(loaded.store.scenarios).toHaveLength(1);

    await deleteScenario(scenario.id);
    const after = await loadScenarios();
    expect(after.store.scenarios).toHaveLength(0);
  });

  it('caps at MAX_SCENARIOS and drops oldest', async () => {
    for (let i = 0; i < MAX_SCENARIOS; i++) {
      await saveScenario({
        name: `S${i}`,
        inputs: { ...sampleInputs(), amount: 1_000_000 + i },
      });
    }
    const overflow = await saveScenario({
      name: 'Newest',
      inputs: { ...sampleInputs(), amount: 99_000_000 },
    });
    expect(overflow.replacedOldest).toBe(true);
    expect(overflow.store.scenarios).toHaveLength(MAX_SCENARIOS);
    expect(overflow.store.scenarios[0].name).toBe('Newest');
    expect(overflow.store.scenarios.some((s) => s.name === 'S0')).toBe(false);
  });

  it('formatScenarioShareText includes net and brand', () => {
    const text = formatScenarioShareText({
      name: 'Demo',
      inputs: sampleInputs(),
      net: 22_000_000,
      brand: 'KVSalaryTools',
    });
    expect(text).toContain('Demo');
    expect(text).toContain('30.000.000');
    expect(text).toContain('22.000.000');
    expect(text).toContain('KVSalaryTools');
  });
});
