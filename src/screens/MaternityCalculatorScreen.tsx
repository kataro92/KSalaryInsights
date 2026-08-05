import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MaternityBreakdownCard } from '@/src/components/breakdown/MaternityBreakdownCard';
import { Button } from '@/src/components/common/Button';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { OutOfScopeNote } from '@/src/components/disclaimer/OutOfScopeNote';
import {
  MaternityInputs,
  type MaternityInputsValue,
} from '@/src/components/inputs/MaternityInputs';
import type { MaternityBreakdown } from '@/src/domain/types/benefits';
import { calculateMaternity } from '@/src/engine/maternity';
import { colors, layout, space, typography } from '@/src/theme/tokens';

function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

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
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Máy tính thai sản"
    >
      <View style={styles.inner}>
        <MaternityInputs
          value={inputs}
          onChange={(v) => {
            setInputs(v);
            setResult(null);
          }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Tính thai sản" onPress={onCalculate} />
        {result ? (
          <>
            <MaternityBreakdownCard result={result} />
            <DisclaimerFooter legalSources={result.legalSources} />
          </>
        ) : null}
        <OutOfScopeNote />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: space[10] },
  inner: {
    paddingHorizontal: layout.pagePaddingX,
    paddingTop: space[4],
    gap: space[5],
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: '#DC2626',
  },
});
