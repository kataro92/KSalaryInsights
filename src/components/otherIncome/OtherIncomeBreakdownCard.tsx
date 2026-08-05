import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import type { OtherIncomeLine } from '@/src/domain/types/otherIncome';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  title: string;
  totalLabel?: string;
  total: number;
  formula: string;
  lines: OtherIncomeLine[];
  explanations: string[];
  note?: string;
};

export function OtherIncomeBreakdownCard({
  title,
  totalLabel = 'Tổng ước thuế',
  total,
  formula,
  lines,
  explanations,
  note,
}: Props) {
  return (
    <ColorBlock tone="secondarySoft" accessibilityLabel={`Kết quả ${title}`}>
      <Text style={styles.eyebrow}>{title}</Text>
      <Text style={styles.totalLabel}>{totalLabel}</Text>
      <Text style={styles.amount}>{total.toLocaleString('vi-VN')} ₫</Text>
      <Text style={styles.formula}>{formula}</Text>
      {lines.map((line) => (
        <View key={line.id} style={styles.row}>
          <Text style={styles.rowLabel}>{line.label}</Text>
          <Text style={styles.rowValue}>{line.amount.toLocaleString('vi-VN')} ₫</Text>
        </View>
      ))}
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {explanations.map((e) => (
        <Text key={e} style={styles.explain}>
          • {e}
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
  totalLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.7,
  },
  amount: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 28,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
    marginBottom: space[2],
  },
  formula: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.foreground,
    marginBottom: space[3],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: space[1],
  },
  rowLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.75,
  },
  rowValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    color: colors.foreground,
  },
  note: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    lineHeight: 20,
    color: colors.accent,
    marginVertical: space[2],
  },
  explain: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.85,
    marginBottom: space[1],
  },
});
