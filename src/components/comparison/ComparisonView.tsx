import { StyleSheet, Text, View } from 'react-native';

import { SalaryBreakdownCard } from '@/src/components/breakdown/SalaryBreakdownCard';
import { ResultHero } from '@/src/components/common/ResultHero';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { miuTips } from '@/src/copy/miu';
import type { ComparisonResult } from '@/src/domain/types/comparison';
import { moneyAccessibilityLabel } from '@/src/theme/money';
import { colors, space, typography } from '@/src/theme/tokens';

function formatVndSigned(n: number): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toLocaleString('vi-VN')} ₫`;
}

type Props = {
  result: ComparisonResult;
};

export function ComparisonView({ result }: Props) {
  const taxSaved = -result.delta.tax;
  const netGain = result.delta.net;
  const heroAmount = Math.abs(result.delta.net);
  const heroTone = netGain >= 0 ? 'positive' : 'primary';

  return (
    <View style={styles.wrap} accessibilityLabel="So sánh thuế 2025 và 2026">
      <ResultHero
        tone={heroTone}
        eyebrow="Chênh Net (2026 − 2025)"
        label={netGain >= 0 ? 'Cao hơn' : 'Thấp hơn'}
        amount={heroAmount}
        accessibilityLabel={moneyAccessibilityLabel(
          heroAmount,
          netGain >= 0 ? 'Net năm mới cao hơn' : 'Net năm mới thấp hơn',
        )}
      />
      <NgaiMiuTip tip={miuTips.comparison} />
      <Text style={styles.deltaLine} accessibilityLabel={`Chênh thuế ${formatVndSigned(result.delta.tax)}`}>
        Thuế: {formatVndSigned(result.delta.tax)}
        {taxSaved > 0 ? ` (tiết kiệm ${taxSaved.toLocaleString('vi-VN')} ₫)` : ''}
      </Text>

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
    gap: space[5],
  },
  deltaLine: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.foreground,
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
