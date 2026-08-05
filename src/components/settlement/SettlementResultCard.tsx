import { StyleSheet, Text, View } from 'react-native';

import { ResultHero } from '@/src/components/common/ResultHero';
import type { SettlementDelta } from '@/src/domain/types/settlement';
import { moneyAccessibilityLabel } from '@/src/theme/money';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  delta: SettlementDelta;
  withheldMissingWarning?: boolean;
};

export function SettlementResultCard({ delta, withheldMissingWarning }: Props) {
  if (delta.kind === 'even') {
    return (
      <View style={styles.balanced} accessibilityLabel="Khớp — không chênh lệch">
        <Text style={styles.balancedTitle}>Khớp — không chênh lệch</Text>
        {withheldMissingWarning ? (
          <Text style={styles.warn}>
            Bạn chưa nhập thuế đã khấu trừ (đang dùng 0) — kết quả có thể lệch.
          </Text>
        ) : null}
      </View>
    );
  }

  const isRefund = delta.kind === 'refund';
  return (
    <View style={styles.wrap}>
      <ResultHero
        tone={isRefund ? 'positive' : 'primary'}
        eyebrow={isRefund ? 'Ước hoàn' : 'Ước nộp thêm'}
        label={isRefund ? 'Hoàn' : 'Nộp thêm'}
        amount={delta.amount}
        accessibilityLabel={moneyAccessibilityLabel(
          delta.amount,
          isRefund ? 'Ước hoàn' : 'Ước nộp thêm',
        )}
      />
      {withheldMissingWarning ? (
        <Text style={styles.warn}>
          Bạn chưa nhập thuế đã khấu trừ (đang dùng 0) — kết quả có thể lệch.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[2] },
  balanced: {
    backgroundColor: colors.muted,
    padding: space[5],
    borderRadius: 8,
  },
  balancedTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 22,
    color: colors.foreground,
  },
  warn: {
    marginTop: space[1],
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.85,
  },
});
