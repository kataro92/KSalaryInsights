import { StyleSheet, Text } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import type { SettlementDelta } from '@/src/domain/types/settlement';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  delta: SettlementDelta;
  withheldMissingWarning?: boolean;
};

export function SettlementResultCard({ delta, withheldMissingWarning }: Props) {
  const tone =
    delta.kind === 'refund' ? 'secondarySoft' : delta.kind === 'pay' ? 'primarySoft' : 'muted';
  const title =
    delta.kind === 'refund'
      ? `Ước hoàn ${delta.amount.toLocaleString('vi-VN')} ₫`
      : delta.kind === 'pay'
        ? `Ước nộp thêm ${delta.amount.toLocaleString('vi-VN')} ₫`
        : 'Khớp — không chênh lệch';

  return (
    <ColorBlock
      tone={tone}
      style={delta.kind === 'refund' ? styles.refundBg : undefined}
      accessibilityLabel={title}
    >
      <Text style={[styles.title, delta.kind === 'refund' && styles.onSecondary]}>{title}</Text>
      {withheldMissingWarning ? (
        <Text style={[styles.warn, delta.kind === 'refund' && styles.onSecondary]}>
          Bạn chưa nhập thuế đã khấu trừ (đang dùng 0) — kết quả có thể lệch.
        </Text>
      ) : null}
    </ColorBlock>
  );
}

const styles = StyleSheet.create({
  refundBg: {
    backgroundColor: colors.secondary,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 22,
    color: colors.foreground,
  },
  onSecondary: {
    color: colors.white,
  },
  warn: {
    marginTop: space[2],
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.85,
  },
});
