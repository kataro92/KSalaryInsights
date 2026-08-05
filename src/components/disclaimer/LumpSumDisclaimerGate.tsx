import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

export { canShowRetirementAmounts } from '@/src/components/disclaimer/retirementGate';

type Props = {
  acknowledged: boolean;
  onAcknowledge: () => void;
};

/**
 * Bắt buộc acknowledge trước khi hiện số tiền BHXH một lần / hưu (FR-002).
 * Copy trung lập — không khuyến nghị rút hay chờ (FR-004).
 */
export function LumpSumDisclaimerGate({ acknowledged, onAcknowledge }: Props) {
  if (acknowledged) return null;

  return (
    <ColorBlock tone="muted" accessibilityLabel="Cảnh báo trước khi xem ước tính">
      <Text style={styles.title}>Đọc trước khi xem số</Text>
      <Text style={styles.body}>
        Quyết định rút BHXH một lần thường không thể đảo ngược. Kết quả dưới đây chỉ là khoảng ước
        tính — hãy xác nhận với cơ quan BHXH / VssID trước khi quyết định.
      </Text>
      <Text style={styles.body}>
        Ứng dụng không tư vấn nên rút hay nên chờ; chỉ trình bày hai kịch bản song song.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tôi đã đọc cảnh báo"
        onPress={onAcknowledge}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      >
        <Text style={styles.btnLabel}>Tôi đã đọc và hiểu</Text>
      </Pressable>
    </ColorBlock>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: space[2],
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.foreground,
    opacity: 0.85,
    marginBottom: space[3],
  },
  btn: {
    minHeight: layout.minTouch,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[4],
  },
  btnPressed: { opacity: 0.9 },
  btnLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.foreground,
  },
});
