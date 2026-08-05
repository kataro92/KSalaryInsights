import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import type { SalaryBreakdown } from '@/src/domain/types/salary';
import { colors, space, typography } from '@/src/theme/tokens';

function formatVnd(n: number): string {
  return `${n.toLocaleString('vi-VN')} ₫`;
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: 'muted' | 'net' | 'tax' | 'subtotal';
}) {
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          emphasis === 'net' && styles.netLabel,
          emphasis === 'subtotal' && styles.subtotalLabel,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.value,
          emphasis === 'muted' && styles.mutedValue,
          emphasis === 'net' && styles.netValue,
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

function GroupDivider() {
  return <View style={styles.divider} />;
}

type Props = {
  breakdown: SalaryBreakdown;
};

export function SalaryBreakdownCard({ breakdown }: Props) {
  const { insurance, pit } = breakdown;
  return (
    <View style={styles.wrap} accessibilityLabel="Bảng chi tiết tính lương">
      <ColorBlock tone="muted">
        <Text style={styles.heading}>Chi tiết tính lương</Text>

        <Row label="Gross" value={formatVnd(breakdown.gross)} emphasis="subtotal" />
        <GroupDivider />
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space[3],
  },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.foreground,
    marginBottom: space[3],
    letterSpacing: typography.letterSpacingTight,
  },
  divider: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: space[2],
    opacity: 0.7,
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
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
  },
  value: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
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
    fontSize: 12,
    letterSpacing: 0.8,
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
  netLabel: {
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    fontSize: 16,
  },
  netValue: {
    fontFamily: typography.fontFamily.extraBold,
    color: colors.white,
    fontSize: 20,
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
