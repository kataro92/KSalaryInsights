import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import type { AnnualSettlementBreakdown } from '@/src/domain/types/settlement';
import { colors, space, typography } from '@/src/theme/tokens';

function formatVnd(n: number): string {
  return `${n.toLocaleString('vi-VN')} ₫`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} accessibilityLabel={`${label} ${value}`}>
        {value}
      </Text>
    </View>
  );
}

type Props = { breakdown: AnnualSettlementBreakdown; title?: string };

export function AnnualBreakdownCard({ breakdown, title = 'Breakdown năm' }: Props) {
  return (
    <ColorBlock tone="muted" accessibilityLabel={title}>
      <Text style={styles.heading}>{title}</Text>
      <Row label="TN sau BH (năm)" value={formatVnd(breakdown.incomeAfterInsuranceYear)} />
      {breakdown.casualGrossIncluded > 0 ? (
        <Row label="Trong đó vãng lai" value={formatVnd(breakdown.casualGrossIncluded)} />
      ) : null}
      <Row label="GTGC bản thân ×12" value={`− ${formatVnd(breakdown.personalReliefYear)}`} />
      <Row label="GTGC NPT ×12" value={`− ${formatVnd(breakdown.dependentReliefYear)}`} />
      <Row label="Tổng GTGC năm" value={`− ${formatVnd(breakdown.reliefTotalYear)}`} />
      <Row label="TNTT năm" value={formatVnd(breakdown.taxableIncomeAfterRelief)} />
      {breakdown.brackets.map((b) => (
        <Row
          key={b.bracket}
          label={`Thuế bậc ${b.bracket} (${Math.round(b.rate * 100)}%)`}
          value={`− ${formatVnd(b.tax)}`}
        />
      ))}
      <Row label="Thuế năm" value={formatVnd(breakdown.annualTax)} />
      <Row label="Đã khấu trừ (lương)" value={formatVnd(breakdown.salaryWithheld)} />
      {breakdown.casualWithheldIncluded > 0 ? (
        <Row
          label="Đã khấu trừ (vãng lai)"
          value={formatVnd(breakdown.casualWithheldIncluded)}
        />
      ) : null}
      <Row label="Tổng đã khấu trừ" value={formatVnd(breakdown.totalWithheld)} />
    </ColorBlock>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.foreground,
    marginBottom: space[3],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[3],
    minHeight: 34,
    paddingVertical: 2,
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
  },
  value: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
  },
});
