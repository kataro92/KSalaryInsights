import { Text } from "react-native";

import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

export function OtherIncomeDisclaimer() {
  const styles = useThemedStyles(makeStyles);
  return (
    <ColorBlock tone="muted" accessibilityLabel="Disclaimer thu nhập khác">
      <Text style={styles.title}>Ước tính, không thay tờ khai</Text>
      <Text style={styles.body}>
        Kết quả hỗ trợ ước thuế cho thuê, hộ kinh doanh, chứng khoán, ESOP và
        thu nhập vãng lai. Không thay thế tờ khai hay tư vấn chính thức. Ngưỡng
        và tỷ lệ theo năm thuế đang chọn.
      </Text>
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
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
  } as const;
}
