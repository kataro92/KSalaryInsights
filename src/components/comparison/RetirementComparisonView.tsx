import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { EmptyErrorState } from '@/src/components/common/EmptyErrorState';
import { ResultHero } from '@/src/components/common/ResultHero';
import type {
  LumpSumBreakdown,
  PensionBreakdown,
} from '@/src/domain/types/retirement';
import { moneyAccessibilityLabel } from '@/src/theme/money';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  /** null khi chưa acknowledge — không render số (SC-002). */
  lumpSum: LumpSumBreakdown | null;
  pension: PensionBreakdown | null;
  showAmounts: boolean;
};

/**
 * So sánh trung lập hai kịch bản — không copy “nên rút” / “nên chờ” (FR-004).
 */
export function RetirementComparisonView({
  lumpSum,
  pension,
  showAmounts,
}: Props) {
  if (!showAmounts) {
    return (
      <EmptyErrorState
        title="Chưa mở khóa ước tính"
        body="Xác nhận cảnh báo bên trên để xem khoảng ước tính hai kịch bản."
      />
    );
  }

  if (!lumpSum || !pension) {
    return (
      <EmptyErrorState
        title="Chưa có so sánh"
        body="Điền MBQTL và thời gian đóng, rồi bấm Tính so sánh."
      />
    );
  }

  return (
    <View style={styles.wrap} accessibilityLabel="So sánh BHXH một lần và lương hưu">
      <Text style={styles.banner}>Khoảng ước tính — không phải số chính thức</Text>

      <ResultHero
        tone="primary"
        eyebrow="BHXH một lần"
        label="Ước nhận"
        amount={lumpSum.amount}
        accessibilityLabel={moneyAccessibilityLabel(lumpSum.amount, 'BHXH một lần')}
      />
      <ResultHero
        tone="positive"
        eyebrow="Lương hưu"
        label="Mỗi tháng"
        amount={pension.monthlyAmount}
        accessibilityLabel={moneyAccessibilityLabel(pension.monthlyAmount, 'Lương hưu mỗi tháng')}
      />

      <View style={styles.cols}>
        <ColorBlock tone="primarySoft" style={styles.col}>
          <Text style={styles.colEyebrow}>Chi tiết · một lần</Text>
          <Text style={styles.formula}>{lumpSum.formula}</Text>
          <Text style={styles.meta}>
            T1 {lumpSum.yearsPre2014Rounded} năm · T2 {lumpSum.yearsFrom2014Rounded} năm
          </Text>
          {lumpSum.explanations.map((e) => (
            <Text key={e} style={styles.explain}>
              • {e}
            </Text>
          ))}
        </ColorBlock>

        <ColorBlock tone="secondarySoft" style={styles.col}>
          <Text style={[styles.colEyebrow, styles.colEyebrowSecondary]}>Chi tiết · hưu tháng</Text>
          <Text style={styles.formula}>{pension.formula}</Text>
          <Text style={styles.meta}>
            {(pension.rate * 100).toFixed(0)}% · {pension.contributionYears} năm đóng
          </Text>
          {pension.rateSteps.map((s) => (
            <Text key={s} style={styles.explain}>
              • {s}
            </Text>
          ))}
          <Text style={styles.note}>{pension.estimateNote}</Text>
        </ColorBlock>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[3] },
  banner: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  cols: { gap: space[4] },
  col: { flex: 1 },
  colEyebrow: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: space[2],
  },
  colEyebrowSecondary: { color: colors.secondary },
  formula: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.foreground,
    marginBottom: space[2],
  },
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.7,
    marginBottom: space[2],
  },
  explain: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.85,
    marginBottom: space[1],
  },
  note: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.7,
    marginTop: space[2],
  },
});
