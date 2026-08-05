import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import type { SalaryBreakdown } from '@/src/domain/types/salary';
import { formatVnd } from '@/src/theme/money';
import { colors, space, typography } from '@/src/theme/tokens';

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: 'muted' | 'tax' | 'subtotal';
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, emphasis === 'subtotal' && styles.subtotalLabel]}>{label}</Text>
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
  const { insurance, pit } = breakdown;
  return (
    <View style={styles.wrap} accessibilityLabel="Bảng chi tiết tính lương">
      <ColorBlock tone="muted">
        <Text style={styles.heading}>Chi tiết tính lương</Text>

        <Row label="Gross" value={formatVnd(breakdown.gross)} emphasis="subtotal" />

        <GroupDivider />
        <GroupTitle>Bảo hiểm</GroupTitle>
        <Row label="BHXH (8%)" value={`− ${formatVnd(insurance.social)}`} emphasis="muted" />
        <Row label="BHYT (1,5%)" value={`− ${formatVnd(insurance.health)}`} emphasis="muted" />
        <Row label="BHTN (1%)" value={`− ${formatVnd(insurance.unemployment)}`} emphasis="muted" />
        <Row
          label="Tổng BH người lao động"
          value={`− ${formatVnd(insurance.totalEmployee)}`}
          emphasis="subtotal"
        />
        <Row
          label="Thu nhập sau BH"
          value={formatVnd(pit.incomeAfterInsurance)}
          emphasis="subtotal"
        />

        <GroupDivider />
        <GroupTitle>Giảm trừ gia cảnh</GroupTitle>
        <Row
          label="GTGC bản thân"
          value={`− ${formatVnd(breakdown.reliefBreakdown.personal)}`}
          emphasis="muted"
        />
        <Row
          label="GTGC người phụ thuộc"
          value={`− ${formatVnd(breakdown.reliefBreakdown.dependent)}`}
          emphasis="muted"
        />
        <Row
          label="Tổng giảm trừ gia cảnh"
          value={`− ${formatVnd(breakdown.reliefBreakdown.total)}`}
          emphasis="subtotal"
        />
        <Row label="Thu nhập tính thuế" value={formatVnd(pit.taxableIncome)} emphasis="subtotal" />

        <GroupDivider />
        <GroupTitle>Thuế TNCN</GroupTitle>
        {pit.brackets.map((b) => (
          <Row
            key={b.bracket}
            label={`Thuế bậc ${b.bracket} (${Math.round(b.rate * 100)}%)`}
            value={`− ${formatVnd(b.tax)}`}
            emphasis="tax"
          />
        ))}
        <Row label="Tổng thuế TNCN" value={`− ${formatVnd(pit.totalTax)}`} emphasis="tax" />
      </ColorBlock>

      {!hideNet ? (
        <ColorBlock tone="secondarySoft" style={styles.netBlock}>
          <Text style={styles.netEyebrow}>Thực nhận</Text>
          <View style={styles.netRow}>
            <Text style={styles.netLabelWide}>Net</Text>
            <Text
              style={styles.netValueWide}
              accessibilityLabel={`Net thực nhận ${formatVnd(breakdown.net)}`}
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
  label: {
    flex: 1,
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
  netEyebrow: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.caption.fontSize,
    letterSpacing: typography.letterSpacingLabel,
    textTransform: 'uppercase',
    color: colors.white,
    opacity: 0.85,
    marginBottom: space[2],
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
  netLabelWide: {
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    fontSize: 18,
  },
  netValueWide: {
    fontFamily: typography.fontFamily.extraBold,
    color: colors.white,
    fontSize: 24,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
    textAlign: 'right',
  },
});
