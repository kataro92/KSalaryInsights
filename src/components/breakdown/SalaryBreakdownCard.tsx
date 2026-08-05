import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { InfoTip } from '@/src/components/common/InfoTip';
import type { TipId } from '@/src/i18n/types';
import { useI18n } from '@/src/i18n/useI18n';
import type { SalaryBreakdown } from '@/src/domain/types/salary';
import { formatVnd } from '@/src/theme/money';
import { colors, space, typography } from '@/src/theme/tokens';

function Row({
  label,
  value,
  tipId,
  emphasis,
}: {
  label: string;
  value: string;
  tipId?: TipId;
  emphasis?: 'muted' | 'tax' | 'subtotal';
}) {
  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, emphasis === 'subtotal' && styles.subtotalLabel]}>{label}</Text>
        {tipId ? <InfoTip tipId={tipId} size={15} /> : null}
      </View>
      <Text
        style={[
          styles.value,
          emphasis === 'muted' && styles.mutedValue,
          emphasis === 'tax' && styles.taxValue,
          emphasis === 'subtotal' && styles.subtotalValue,
        ]}
        accessibilityLabel={`${label} ${value}`}
      >
        {value}
      </Text>
    </View>
  );
}

function GroupTitle({ children }: { children: string }) {
  return <Text style={styles.groupTitle}>{children}</Text>;
}

function GroupDivider() {
  return <View style={styles.divider} />;
}

type Props = {
  breakdown: SalaryBreakdown;
  /** When ResultHero already shows Net above. */
  hideNet?: boolean;
};

export function SalaryBreakdownCard({ breakdown, hideNet = false }: Props) {
  const { t } = useI18n();
  const { insurance, pit } = breakdown;
  return (
    <View style={styles.wrap} accessibilityLabel={t('salary.breakdownTitle')}>
      <ColorBlock tone="muted">
        <Text style={styles.heading}>{t('salary.breakdownTitle')}</Text>

        <Row
          label={t('salary.labelGross')}
          value={formatVnd(breakdown.gross)}
          tipId="salary.gross"
          emphasis="subtotal"
        />

        <GroupDivider />
        <GroupTitle>{t('salary.groupInsurance')}</GroupTitle>
        <Row
          label={t('salary.labelBhxh')}
          value={`− ${formatVnd(insurance.social)}`}
          tipId="salary.bhxh"
          emphasis="muted"
        />
        <Row
          label={t('salary.labelBhyt')}
          value={`− ${formatVnd(insurance.health)}`}
          tipId="salary.bhyt"
          emphasis="muted"
        />
        <Row
          label={t('salary.labelBhtn')}
          value={`− ${formatVnd(insurance.unemployment)}`}
          tipId="salary.bhtn"
          emphasis="muted"
        />
        <Row
          label={t('salary.labelInsuranceTotal')}
          value={`− ${formatVnd(insurance.totalEmployee)}`}
          tipId="salary.insuranceTotal"
          emphasis="subtotal"
        />
        <Row
          label={t('salary.labelAfterInsurance')}
          value={formatVnd(pit.incomeAfterInsurance)}
          tipId="salary.afterInsurance"
          emphasis="subtotal"
        />

        <GroupDivider />
        <GroupTitle>{t('salary.groupRelief')}</GroupTitle>
        <Row
          label={t('salary.labelPersonalRelief')}
          value={`− ${formatVnd(breakdown.reliefBreakdown.personal)}`}
          tipId="salary.personalRelief"
          emphasis="muted"
        />
        <Row
          label={t('salary.labelDependentRelief')}
          value={`− ${formatVnd(breakdown.reliefBreakdown.dependent)}`}
          tipId="salary.dependentRelief"
          emphasis="muted"
        />
        <Row
          label={t('salary.labelReliefTotal')}
          value={`− ${formatVnd(breakdown.reliefBreakdown.total)}`}
          tipId="salary.reliefTotal"
          emphasis="subtotal"
        />
        <Row
          label={t('salary.labelTaxable')}
          value={formatVnd(pit.taxableIncome)}
          tipId="salary.taxable"
          emphasis="subtotal"
        />

        <GroupDivider />
        <GroupTitle>{t('salary.groupPit')}</GroupTitle>
        {pit.brackets.map((b) => (
          <Row
            key={b.bracket}
            label={t('salary.labelPitBracket', {
              n: b.bracket,
              pct: Math.round(b.rate * 100),
            })}
            value={`− ${formatVnd(b.tax)}`}
            tipId="salary.pit"
            emphasis="tax"
          />
        ))}
        <Row
          label={t('salary.labelPitTotal')}
          value={`− ${formatVnd(pit.totalTax)}`}
          tipId="salary.pit"
          emphasis="tax"
        />
      </ColorBlock>

      {!hideNet ? (
        <ColorBlock tone="secondarySoft" style={styles.netBlock}>
          <View style={styles.netEyebrowRow}>
            <Text style={styles.netEyebrow}>{t('salary.eyebrowNet')}</Text>
            <InfoTip tipId="salary.net" color={colors.white} size={16} />
          </View>
          <View style={styles.netRow}>
            <Text style={styles.netLabelWide}>{t('salary.labelNet')}</Text>
            <Text
              style={styles.netValueWide}
              accessibilityLabel={`${t('salary.labelNet')} ${formatVnd(breakdown.net)}`}
            >
              {formatVnd(breakdown.net)}
            </Text>
          </View>
        </ColorBlock>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space[3],
  },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.scale.subtitle.fontSize,
    color: colors.foreground,
    marginBottom: space[3],
    letterSpacing: typography.letterSpacingTight,
  },
  groupTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.caption.fontSize,
    letterSpacing: typography.letterSpacingLabel,
    textTransform: 'uppercase',
    color: colors.foregroundMuted,
    marginBottom: space[2],
  },
  divider: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: space[3],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: space[3],
    minHeight: 40,
    paddingVertical: space[1],
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
    fontSize: typography.scale.moneySm.fontSize,
    lineHeight: typography.scale.moneySm.lineHeight,
    color: colors.foreground,
  },
  value: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.moneySm.fontSize,
    lineHeight: typography.scale.moneySm.lineHeight,
    color: colors.deduction,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  mutedValue: {
    color: colors.foregroundMuted,
  },
  taxValue: {
    color: colors.foreground,
  },
  subtotalLabel: {
    fontFamily: typography.fontFamily.semiBold,
  },
  subtotalValue: {
    fontFamily: typography.fontFamily.bold,
  },
  netBlock: {
    backgroundColor: colors.secondary,
    paddingVertical: space[5],
  },
  netEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginBottom: space[2],
  },
  netEyebrow: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.caption.fontSize,
    letterSpacing: typography.letterSpacingLabel,
    textTransform: 'uppercase',
    color: colors.white,
    opacity: 0.85,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[3],
  },
  netLabelWide: {
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    fontSize: typography.scale.subtitle.fontSize,
  },
  netValueWide: {
    fontFamily: typography.fontFamily.extraBold,
    color: colors.white,
    fontSize: typography.scale.moneyLg.fontSize,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
    textAlign: 'right',
  },
});
