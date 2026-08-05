import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { InfoTip } from '@/src/components/common/InfoTip';
import type { TipId } from '@/src/i18n/types';
import { useI18n } from '@/src/i18n/useI18n';
import type { AnnualSettlementBreakdown } from '@/src/domain/types/settlement';
import { colors, space, typography } from '@/src/theme/tokens';

function formatVnd(n: number): string {
  return `${n.toLocaleString('vi-VN')} ₫`;
}

function Row({
  label,
  value,
  tipId,
}: {
  label: string;
  value: string;
  tipId?: TipId;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {tipId ? <InfoTip tipId={tipId} size={14} /> : null}
      </View>
      <Text style={styles.value} accessibilityLabel={`${label} ${value}`}>
        {value}
      </Text>
    </View>
  );
}

type Props = { breakdown: AnnualSettlementBreakdown; title?: string };

export function AnnualBreakdownCard({ breakdown, title }: Props) {
  const { t } = useI18n();
  const heading = title ?? t('annual.heading');

  return (
    <ColorBlock tone="muted" accessibilityLabel={heading}>
      <Text style={styles.heading}>{heading}</Text>
      <Row
        label={t('annual.afterInsurance')}
        value={formatVnd(breakdown.incomeAfterInsuranceYear)}
        tipId="salary.afterInsurance"
      />
      {breakdown.casualGrossIncluded > 0 ? (
        <Row label={t('annual.casual')} value={formatVnd(breakdown.casualGrossIncluded)} />
      ) : null}
      <Row
        label={t('annual.personalRelief')}
        value={`− ${formatVnd(breakdown.personalReliefYear)}`}
        tipId="salary.personalRelief"
      />
      <Row
        label={t('annual.dependentRelief')}
        value={`− ${formatVnd(breakdown.dependentReliefYear)}`}
        tipId="salary.dependentRelief"
      />
      <Row
        label={t('annual.reliefTotal')}
        value={`− ${formatVnd(breakdown.reliefTotalYear)}`}
        tipId="salary.reliefTotal"
      />
      <Row
        label={t('annual.taxable')}
        value={formatVnd(breakdown.taxableIncomeAfterRelief)}
        tipId="salary.taxable"
      />
      {breakdown.brackets.map((b) => (
        <Row
          key={b.bracket}
          label={t('salary.labelPitBracket', {
            n: b.bracket,
            pct: Math.round(b.rate * 100),
          })}
          value={`− ${formatVnd(b.tax)}`}
          tipId="salary.pit"
        />
      ))}
      <Row
        label={t('annual.pitTotal')}
        value={formatVnd(breakdown.annualTax)}
        tipId="salary.pit"
      />
      <Row
        label={t('annual.withheld')}
        value={formatVnd(breakdown.totalWithheld)}
        tipId="settlement.refund"
      />
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
    alignItems: 'flex-start',
    gap: space[3],
    minHeight: 34,
    paddingVertical: 2,
  },
  labelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  label: {
    flexShrink: 1,
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
