import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { MaternityBreakdownCard } from '@/src/components/breakdown/MaternityBreakdownCard';
import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { ToolScreen } from '@/src/components/common/ToolScreen';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { OutOfScopeNote } from '@/src/components/disclaimer/OutOfScopeNote';
import {
  MaternityInputs,
  type MaternityInputsValue,
} from '@/src/components/inputs/MaternityInputs';
import type { MaternityBreakdown } from '@/src/domain/types/benefits';
import { calculateMaternity } from '@/src/engine/maternity';
import { parseMoney } from '@/src/theme/money';
import { colors, typography } from '@/src/theme/tokens';

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
        <ColorBlock tone="primarySoft">
          <Text style={styles.error}>{error}</Text>
        </ColorBlock>
      ) : null}
      {result ? (
        <>
          <MaternityBreakdownCard result={result} />
          <DisclaimerFooter legalSources={result.legalSources} collapseSources />
        </>
      ) : null}
      <OutOfScopeNote />
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.danger,
  },
});
