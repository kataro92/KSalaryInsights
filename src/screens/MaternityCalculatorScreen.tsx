import { useState } from 'react';

import { MaternityBreakdownCard } from '@/src/components/breakdown/MaternityBreakdownCard';
import { Button } from '@/src/components/common/Button';
import { EmptyErrorState } from '@/src/components/common/EmptyErrorState';
import { ResultHero } from '@/src/components/common/ResultHero';
import { ToolScreen } from '@/src/components/common/ToolScreen';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { OutOfScopeNote } from '@/src/components/disclaimer/OutOfScopeNote';
import {
  MaternityInputs,
  type MaternityInputsValue,
} from '@/src/components/inputs/MaternityInputs';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { emptyCopy, miuTips } from '@/src/copy/miu';
import type { MaternityBreakdown } from '@/src/domain/types/benefits';
import { calculateMaternity } from '@/src/engine/maternity';
import { successHaptic } from '@/src/theme/haptics';
import { parseMoney } from '@/src/theme/money';

export function MaternityCalculatorScreen() {
  const [inputs, setInputs] = useState<MaternityInputsValue>({
    avgText: '18.000.000',
    birthDate: '2026-08-15',
    childOrder: 'first',
    numChildren: 1,
    hasMinContribution: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MaternityBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const avg = parseMoney(inputs.avgText);
    if (avg == null || avg <= 0) {
      setError('Nhập bình quân lương hợp lệ.');
      setResult(null);
      return;
    }
    try {
      const next = calculateMaternity({
        avgSalary6m: avg,
        birthDate: inputs.birthDate,
        childOrder: inputs.childOrder,
        numChildren: inputs.numChildren,
        hasMinContribution: inputs.hasMinContribution,
      });
      setResult(next);
      void successHaptic();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  return (
    <ToolScreen
      nested
      title="Thai sản"
      subtitle="Tháng nghỉ và trợ cấp một lần theo mức tham chiếu — ước tính offline."
      accessibilityLabel="Máy tính thai sản"
      sticky={<Button label="Tính thai sản" onPress={onCalculate} />}
    >
      <MaternityInputs
        value={inputs}
        onChange={(v) => {
          setInputs(v);
          setResult(null);
        }}
      />
      {error ? (
        <EmptyErrorState variant="error" title={emptyCopy.calculateError.title} body={error} />
      ) : null}
      {result ? (
        <>
          <ResultHero
            eyebrow="Ước thai sản"
            label="Tổng"
            amount={result.total}
          />
          <NgaiMiuTip tip={miuTips.maternity} />
          <MaternityBreakdownCard result={result} hideTotal />
          <DisclaimerFooter legalSources={result.legalSources} collapseSources />
        </>
      ) : !error ? (
        <EmptyErrorState
          title={emptyCopy.maternity.title}
          body={emptyCopy.maternity.body}
        />
      ) : null}
      <OutOfScopeNote />
    </ToolScreen>
  );
}
