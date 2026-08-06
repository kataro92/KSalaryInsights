import { Text, View } from "react-native";

import { ColorBlock } from "@/src/components/common/ColorBlock";
import { formatVnd } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  deltaNet: number | null;
  deltaGross: number | null;
};

function signed(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${formatVnd(n)}`;
}

/**
 * Shows Net / Gross difference (B minus A) when both offers succeed. No advice copy.
 */
export function OfferDeltaBar({ deltaNet, deltaGross }: Props) {
  const styles = useThemedStyles(makeStyles);

  if (deltaNet == null || deltaGross == null) {
    return (
      <ColorBlock tone="muted" accessibilityLabel="Chênh lệch chưa có">
        <Text style={styles.note}>
          Chênh Net và Gross sẽ hiện khi cả hai offer tính được.
        </Text>
      </ColorBlock>
    );
  }

  return (
    <ColorBlock
      tone="primarySoft"
      accessibilityLabel="Chênh lệch Net và Gross giữa hai offer"
    >
      <Text style={styles.title}>Chênh lệch offer B so với A</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Chênh Net</Text>
        <Text
          style={styles.value}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {signed(deltaNet)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Chênh Gross</Text>
        <Text
          style={styles.value}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {signed(deltaGross)}
        </Text>
      </View>
      <Text style={styles.note}>
        Chỉ số liệu ước, không phải khuyến nghị chọn offer.
      </Text>
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
      marginBottom: space[2],
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: space[3],
      marginBottom: space[1],
    },
    label: {
      flexShrink: 1,
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.body.fontSize,
      color: colors.foregroundMuted,
    },
    value: {
      flexShrink: 1,
      minWidth: 0,
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
    },
    note: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      marginTop: space[2],
      lineHeight: 18,
    },
  } satisfies ThemedStyleSheet;
}
