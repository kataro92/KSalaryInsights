import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  clearScenarios,
  deleteScenario,
  loadScenarios,
  saveScenario,
  scenariosOfKind,
  type CalculatorScenarioInputs,
  type SavedScenario,
  type SaveScenarioInput,
  type ScenarioKind,
  type SettlementScenarioInputs,
} from '@/src/store/scenarios';

export function useScenarios(kind?: ScenarioKind) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [ready, setReady] = useState(false);
  const [recoveredFromCorrupt, setRecoveredFromCorrupt] = useState(false);

  const refresh = useCallback(async () => {
    const result = await loadScenarios();
    setScenarios(result.store.scenarios);
    setRecoveredFromCorrupt(result.recoveredFromCorrupt);
    setReady(true);
    return result.store.scenarios;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await loadScenarios();
      if (cancelled) return;
      setScenarios(result.store.scenarios);
      setRecoveredFromCorrupt(result.recoveredFromCorrupt);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (input: SaveScenarioInput) => {
    const result = await saveScenario(input);
    setScenarios(result.store.scenarios);
    setRecoveredFromCorrupt(false);
    return result;
  }, []);

  const remove = useCallback(async (id: string) => {
    const store = await deleteScenario(id);
    setScenarios(store.scenarios);
    return store.scenarios;
  }, []);

  const clearAll = useCallback(async () => {
    const store = await clearScenarios();
    setScenarios(store.scenarios);
    return store.scenarios;
  }, []);

  const filtered = useMemo(
    () => (kind ? scenariosOfKind(scenarios, kind) : scenarios),
    [scenarios, kind],
  );

  return {
    /** All kinds when `kind` omitted; otherwise filtered. */
    scenarios: filtered,
    allScenarios: scenarios,
    ready,
    recoveredFromCorrupt,
    refresh,
    save,
    remove,
    clearAll,
  };
}

export type {
  CalculatorScenarioInputs,
  SavedScenario,
  SettlementScenarioInputs,
};
