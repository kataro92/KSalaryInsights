import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { EmptyErrorState } from '@/src/components/common/EmptyErrorState';
import { ResultHero } from '@/src/components/common/ResultHero';
import { Section } from '@/src/components/common/Section';
import { TextField } from '@/src/components/common/TextField';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { OtherIncomeBreakdownCard } from '@/src/components/otherIncome/OtherIncomeBreakdownCard';
import type { RentBreakdown } from '@/src/domain/types/otherIncome';
import { calculateRent } from '@/src/engine/otherIncome/rent';
import { successHaptic } from '@/src/theme/haptics';
import { colors, layout, space, typography } from '@/src/theme/tokens';

function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function formatInput(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return '';
  return n.toLocaleString('vi-VN');
}

type Props = { taxYear: number };

export function RentCalculator({ taxYear }: Props) {
  const [monthlyMode, setMonthlyMode] = useState(true);
  const [amountText, setAmountText] = useState('20.000.000');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RentBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const amount = parseMoney(amountText);
    if (amount == null || amount < 0) {
      setError('Nhập doanh thu hợp lệ.');
      setResult(null);
      return;
    }
    const annualRevenue = monthlyMode ? amount * 12 : amount;
    try {
      setResult(calculateRent({ annualRevenue, taxYear }));
      void successHaptic();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  return (
    <View style={styles.wrap}>
      <Section title="Cho thuê nhà / BĐS" subtitle="Ngưỡng và tỷ lệ lấy từ ruleset năm đang chọn.">
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Nhập theo tháng (×12)</Text>
          <Switch
            value={monthlyMode}
            onValueChange={(v) => {
              setMonthlyMode(v);
              setResult(null);
            }}
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
        </View>
        <TextField
          label={monthlyMode ? 'Doanh thu tháng' : 'Doanh thu năm'}
          accessibilityLabel="Doanh thu cho thuê"
          keyboardType="number-pad"
          value={amountText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            setAmountText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
            setResult(null);
          }}
        />
      </Section>
      {error ? <EmptyErrorState variant="error" title="Chưa tính được" body={error} /> : null}
      <Button label="Tính cho thuê" onPress={onCalculate} />
      {result ? (
        <>
          <ResultHero
            tone="primary"
            eyebrow="Ước thuế cho thuê"
            label="Tổng thuế"
            amount={result.totalTax}
          />
          <NgaiMiuTip tip="GTGT và TNCN tách dòng bên dưới — ngưỡng miễn theo ruleset năm." />
          <OtherIncomeBreakdownCard
            title="Cho thuê"
            total={result.totalTax}
            formula={result.formula}
            lines={[
              { id: 'vat', label: 'GTGT', amount: result.vat },
              { id: 'pit', label: 'TNCN', amount: result.pit },
            ]}
            explanations={result.explanations}
            note={result.reportingNote}
            hideTotal
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </>
      ) : !error ? (
        <EmptyErrorState
          title="Chưa có ước cho thuê"
          body="Nhập doanh thu, rồi bấm Tính cho thuê."
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[4] },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space[2],
    minHeight: layout.minTouch,
  },
  switchLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
});
