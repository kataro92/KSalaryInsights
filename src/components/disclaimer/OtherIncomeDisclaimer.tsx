import { StyleSheet, Text } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { colors, space, typography } from '@/src/theme/tokens';

export function OtherIncomeDisclaimer() {
  return (
    <ColorBlock tone="muted" accessibilityLabel="Disclaimer thu nhập khác">
      <Text style={styles.title}>Ước tính — không thay tờ khai</Text>
      <Text style={styles.body}>
        Kết quả hỗ trợ ước thuế cho thuê / HKD / CK / ESOP / vãng lai. Không thay thế tờ khai thuế
        hay tư vấn chính thức. Ngưỡng và tỷ lệ lấy từ ruleset — không hard-code trên màn hình.
      </Text>
    </ColorBlock>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: space[2],
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
    opacity: 0.8,
  },
});
