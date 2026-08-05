import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { Section } from '@/src/components/common/Section';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { OtherIncomeBreakdownCard } from '@/src/components/otherIncome/OtherIncomeBreakdownCard';
import type { SecuritiesBreakdown } from '@/src/domain/types/otherIncome';
import { calculateSecuritiesTransfer } from '@/src/engine/otherIncome/securities';
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

type Props = { taxYear: number };

export function SecuritiesCalculator({ taxYear }: Props) {
  const [priceText, setPriceText] = useState('100.000.000');
  const [asOfDate, setAsOfDate] = useState('2026-08-15');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SecuritiesBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const transferPrice = parseMoney(priceText);
    if (transferPrice == null || transferPrice < 0) {
      setError('Nhập giá bán hợp lệ.');
      setResult(null);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) {
      setError('Ngày phải dạng YYYY-MM-DD.');
      setResult(null);
      return;
    }
    try {
      setResult(calculateSecuritiesTransfer({ transferPrice, taxYear, asOfDate }));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  return (
    <View style={styles.wrap}>
      <Section title="Chứng khoán" subtitle="Tỷ lệ CN từ ruleset theo as_of_date.">
        <Text style={styles.fieldLabel}>Giá chuyển nhượng</Text>
        <TextInput
          accessibilityLabel="Giá bán chứng khoán"
          keyboardType="number-pad"
          value={priceText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            setPriceText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
            setResult(null);
          }}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Ngày giao dịch (YYYY-MM-DD)</Text>
        <TextInput
          accessibilityLabel="Ngày giao dịch"
          autoCapitalize="none"
          value={asOfDate}
          onChangeText={(t) => {
            setAsOfDate(t.trim());
            setResult(null);
          }}
          style={styles.input}
        />
      </Section>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Tính CK" onPress={onCalculate} />
      {result ? (
        <>
          <OtherIncomeBreakdownCard
            title="Chuyển nhượng CK"
            total={result.tax}
            totalLabel="Thuế CN"
            formula={result.formula}
            lines={[{ id: 'tax', label: 'Thuế chuyển nhượng', amount: result.tax }]}
            explanations={result.explanations}
            note={result.ineffectivenessReason}
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[4] },
  fieldLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.foreground,
    opacity: 0.7,
    marginBottom: space[1],
    marginTop: space[2],
  },
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
