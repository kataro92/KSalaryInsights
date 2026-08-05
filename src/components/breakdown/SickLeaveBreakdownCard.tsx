import { StyleSheet, Text } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import type { SickLeaveBreakdown } from '@/src/domain/types/benefits';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  result: SickLeaveBreakdown;
};

export function SickLeaveBreakdownCard({ result }: Props) {
  return (
    <ColorBlock tone="secondarySoft" accessibilityLabel="Kết quả ốm đau">
      <Text style={styles.eyebrow}>Ước ốm đau</Text>
      <Text style={styles.amount}>{result.amount.toLocaleString('vi-VN')} ₫</Text>
      <Text style={styles.formula}>{result.formula}</Text>
      <Text style={styles.meta}>
        {result.dailyRate.toLocaleString('vi-VN')} ₫/ngày × {result.daysPaid} ngày
        {result.capped
          ? ` (cắt từ ${result.daysRequested}, trần ${result.annualCap})`
          : ` · trần năm ${result.annualCap} ngày`}
      </Text>
      {result.explanations.map((line) => (
        <Text key={line} style={styles.explain}>
          • {line}
        </Text>
      ))}
    </ColorBlock>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.secondary,
    marginBottom: space[2],
  },
  amount: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 32,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
    marginBottom: space[2],
  },
  formula: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: space[2],
  },
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.75,
    marginBottom: space[3],
  },
  explain: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
    opacity: 0.85,
    marginBottom: space[1],
  },
});
