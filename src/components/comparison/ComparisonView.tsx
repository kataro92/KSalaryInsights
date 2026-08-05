import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { SalaryBreakdownCard } from '@/src/components/breakdown/SalaryBreakdownCard';
import type { ComparisonResult } from '@/src/domain/types/comparison';
import { colors, space, typography } from '@/src/theme/tokens';

function formatVnd(n: number): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toLocaleString('vi-VN')} ₫`;
}

type Props = {
  result: ComparisonResult;
};

export function ComparisonView({ result }: Props) {
  const taxSaved = -result.delta.tax;
  const netGain = result.delta.net;

  return (
    <View style={styles.wrap} accessibilityLabel="So sánh thuế 2025 và 2026">
      <ColorBlock tone="primarySoft">
        <Text style={styles.deltaTitle}>Chênh lệch (2026 − 2025)</Text>
        <Text style={styles.deltaLine} accessibilityLabel={`Chênh thuế ${formatVnd(result.delta.tax)}`}>
          Thuế: {formatVnd(result.delta.tax)}
          {taxSaved > 0 ? ` (tiết kiệm ${taxSaved.toLocaleString('vi-VN')} ₫)` : ''}
        </Text>
        <Text style={styles.deltaLine} accessibilityLabel={`Chênh net ${formatVnd(result.delta.net)}`}>
          Net: {formatVnd(result.delta.net)}
          {netGain > 0 ? ' — thực nhận cao hơn năm mới' : ''}
        </Text>
      </ColorBlock>

      <View style={styles.yearBlock}>
        <Text style={[styles.yearLabel, styles.year2025]} accessibilityRole="header">
          Năm {result.year1Label}
        </Text>
        <SalaryBreakdownCard breakdown={result.year1} />
      </View>

      <View style={styles.yearBlock}>
        <Text style={[styles.yearLabel, styles.year2026]} accessibilityRole="header">
          Năm {result.year2Label}
        </Text>
        <SalaryBreakdownCard breakdown={result.year2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space[6],
  },
  deltaTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: space[2],
  },
  deltaLine: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.foreground,
    marginTop: space[1],
    fontVariant: ['tabular-nums'],
  },
  yearBlock: {
    gap: space[3],
  },
  yearLabel: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  year2025: {
    color: colors.foreground,
    backgroundColor: colors.muted,
    alignSelf: 'flex-start',
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    overflow: 'hidden',
  },
  year2026: {
    color: colors.white,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    overflow: 'hidden',
  },
});
