import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { SickLeaveBreakdownCard } from '@/src/components/breakdown/SickLeaveBreakdownCard';
import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { ToolScreen } from '@/src/components/common/ToolScreen';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import {
  SickLeaveInputs,
  type SickLeaveInputsValue,
} from '@/src/components/inputs/SickLeaveInputs';
import { TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import type { SickLeaveBreakdown } from '@/src/domain/types/benefits';
import { calculateSickLeave } from '@/src/engine/sickLeave';
import { usePreferences } from '@/src/hooks/usePreferences';
import { parseMoney } from '@/src/theme/money';
import { colors, typography } from '@/src/theme/tokens';

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
    <ToolScreen
      nested
      title="Ốm đau"
      subtitle="75% ÷ 24 ngày · trần năm theo năm đóng BHXH."
      accessibilityLabel="Máy tính ốm đau"
      sticky={<Button label="Tính ốm đau" onPress={onCalculate} />}
    >
      <SickLeaveInputs
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
          <SickLeaveBreakdownCard result={result} />
          <DisclaimerFooter legalSources={result.legalSources} collapseSources />
        </>
      ) : null}
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
