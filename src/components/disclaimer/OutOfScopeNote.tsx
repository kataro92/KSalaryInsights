import { Text } from "react-native";

import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

export function OutOfScopeNote() {
  const styles = useThemedStyles(makeStyles);
  return (
    <ColorBlock tone="muted" accessibilityLabel="Phạm vi chưa hỗ trợ V2">
      <Text style={styles.title}>Chưa hỗ trợ (V2)</Text>
      <Text style={styles.body}>
        Nhận nuôi, mang thai hộ, chế độ nghỉ của chồng khi vợ sinh (Đ.53). Sẽ bổ
        sung ở phiên bản sau. Ước tính hiện tại chỉ cho lao động nữ sinh con.
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
