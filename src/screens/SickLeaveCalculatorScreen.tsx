import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SickLeaveBreakdownCard } from '@/src/components/breakdown/SickLeaveBreakdownCard';
import { Button } from '@/src/components/common/Button';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import {
  SickLeaveInputs,
  type SickLeaveInputsValue,
} from '@/src/components/inputs/SickLeaveInputs';
import { TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import type { SickLeaveBreakdown } from '@/src/domain/types/benefits';
import { calculateSickLeave } from '@/src/engine/sickLeave';
import { usePreferences } from '@/src/hooks/usePreferences';
import { colors, layout, space, typography } from '@/src/theme/tokens';

function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

export function SickLeaveCalculatorScreen() {
  const { preferences } = usePreferences();
  const taxYear = (TAX_YEAR_OPTIONS as readonly number[]).includes(
    preferences.defaultTaxYear,
  )
    ? preferences.defaultTaxYear
    : 2026;

  const [inputs, setInputs] = useState<SickLeaveInputsValue>({
    salaryText: '12.000.000',
    daysText: '5',
    yearsText: '5',
    hazard: 'normal',
  });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SickLeaveBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const salary = parseMoney(inputs.salaryText);
    const days = Number(inputs.daysText);
    const years = Number(inputs.yearsText || '0');
    if (salary == null || salary <= 0) {
      setError('Nhập lương tháng liền kề hợp lệ.');
      setResult(null);
      return;
    }
    if (!Number.isInteger(days) || days < 0) {
      setError('Số ngày nghỉ không hợp lệ.');
      setResult(null);
      return;
    }
    try {
      const next = calculateSickLeave({
        salaryLastMonth: salary,
        daysRequested: days,
        contributionYears: Number.isFinite(years) ? years : 0,
        hazard: inputs.hazard,
        taxYear,
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
      accessibilityLabel="Máy tính ốm đau"
    >
      <View style={styles.inner}>
        <SickLeaveInputs
          value={inputs}
          onChange={(v) => {
            setInputs(v);
            setResult(null);
          }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Tính ốm đau" onPress={onCalculate} />
        {result ? (
          <>
            <SickLeaveBreakdownCard result={result} />
            <DisclaimerFooter legalSources={result.legalSources} />
          </>
        ) : null}
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
