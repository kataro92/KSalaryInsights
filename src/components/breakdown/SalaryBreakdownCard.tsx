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
  emphasis?: 'muted' | 'net' | 'tax';
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, emphasis === 'net' && styles.netLabel]}>{label}</Text>
      <Text
        style={[
          styles.value,
          emphasis === 'muted' && styles.mutedValue,
          emphasis === 'net' && styles.netValue,
          emphasis === 'tax' && styles.taxValue,
        ]}
        accessibilityLabel={`${label} ${value}`}
      >
        {value}
      </Text>
    </View>
  );
}

type Props = {
  breakdown: SalaryBreakdown;
};

export function SalaryBreakdownCard({ breakdown }: Props) {
  const { insurance, pit } = breakdown;
  return (
    <View style={styles.wrap} accessibilityLabel="Bảng chi tiết tính lương">
      <ColorBlock tone="muted">
        <Text style={styles.heading}>Breakdown</Text>
        <Row label="Gross" value={formatVnd(breakdown.gross)} />
        <Row label="BHXH (8%)" value={`− ${formatVnd(insurance.social)}`} emphasis="muted" />
        <Row label="BHYT (1,5%)" value={`− ${formatVnd(insurance.health)}`} emphasis="muted" />
        <Row label="BHTN (1%)" value={`− ${formatVnd(insurance.unemployment)}`} emphasis="muted" />
        <Row
          label="Tổng BH NLĐ"
          value={`− ${formatVnd(insurance.totalEmployee)}`}
          emphasis="muted"
        />
        <Row
          label="TN sau BH"
          value={formatVnd(pit.incomeAfterInsurance)}
          emphasis="muted"
        />
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
          label="Giảm trừ gia cảnh (GTGC)"
          value={`− ${formatVnd(breakdown.reliefBreakdown.total)}`}
        />
        <Row label="TNTT" value={formatVnd(pit.taxableIncome)} />
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
        <Row label="Net (thực nhận)" value={formatVnd(breakdown.net)} emphasis="net" />
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[3],
    minHeight: 36,
    paddingVertical: space[1],
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
  },
  value: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
  },
  mutedValue: {
    opacity: 0.75,
  },
  taxValue: {
    color: colors.foreground,
  },
  netBlock: {
    backgroundColor: colors.secondary,
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
});
