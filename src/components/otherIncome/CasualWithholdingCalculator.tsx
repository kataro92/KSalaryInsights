import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { Section } from '@/src/components/common/Section';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { OtherIncomeBreakdownCard } from '@/src/components/otherIncome/OtherIncomeBreakdownCard';
import type { CasualWithholdingBreakdown } from '@/src/domain/types/otherIncome';
import { calculateCasualWithholding } from '@/src/engine/otherIncome/casualWithholding';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

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

type Props = { taxYear: number; asOfDate?: string };

export function CasualWithholdingCalculator({ taxYear, asOfDate }: Props) {
  const [amountText, setAmountText] = useState('10.000.000');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CasualWithholdingBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const paymentAmount = parseMoney(amountText);
    if (paymentAmount == null || paymentAmount < 0) {
      setError('Nhập số tiền hợp lệ.');
      setResult(null);
      return;
    }
    try {
      setResult(
        calculateCasualWithholding({
          paymentAmount,
          taxYear,
          asOfDate: asOfDate ?? `${taxYear}-08-15`,
        }),
      );
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  return (
    <View style={styles.wrap}>
      <Section
        title="Vãng lai — khấu trừ tại nguồn"
        subtitle="Ngưỡng 5tr (2026) / 2tr (≤2025) từ ruleset. Miễn QT xem Quyết toán."
      >
        <TextInput
          accessibilityLabel="Số tiền chi trả vãng lai"
          keyboardType="number-pad"
          value={amountText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            setAmountText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
            setResult(null);
          }}
          style={styles.input}
        />
      </Section>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Tính khấu trừ" onPress={onCalculate} />
      {result ? (
        <>
          <OtherIncomeBreakdownCard
            title="Khấu trừ vãng lai"
            total={result.withheld}
            totalLabel="Số khấu trừ"
            formula={result.formula}
            lines={[
              { id: 'withheld', label: 'Khấu trừ', amount: result.withheld },
              { id: 'net', label: 'Thực nhận', amount: result.netReceived },
            ]}
            explanations={result.explanations}
            note={result.settlementWarning}
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[4] },
  input: {
    minHeight: layout.minTouch,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: space[3],
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
    backgroundColor: colors.white,
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: '#DC2626',
  },
});
