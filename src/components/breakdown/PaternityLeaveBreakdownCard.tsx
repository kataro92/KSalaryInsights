import { Text, View } from "react-native";

import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { PaternityLeaveBreakdown } from "@/src/domain/types/benefits";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  result: PaternityLeaveBreakdown;
  hideTotal?: boolean;
};

export function PaternityLeaveBreakdownCard({
  result,
  hideTotal = false,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <ColorBlock
      tone="secondarySoft"
      accessibilityLabel="Kết quả nghỉ của chồng"
    >
      {!hideTotal ? (
        <>
          <Text style={styles.eyebrow}>Tiền chế độ ước tính</Text>
          <Text style={styles.amount}>
            {result.amount.toLocaleString("vi-VN")} ₫
          </Text>
        </>
      ) : (
        <Text style={styles.eyebrow}>Chi tiết nghỉ của chồng</Text>
      )}
      <Text style={styles.formula}>{result.formula}</Text>
      <Text style={styles.meta}>
        {result.leaveDays} ngày làm việc ·{" "}
        {result.dailyRate.toLocaleString("vi-VN")} ₫/ngày
      </Text>
      <Text style={styles.leave}>{result.leaveExplanation}</Text>
      {result.explanations.map((line) => (
        <BulletLine key={line} style={styles.explain}>
          {line}
        </BulletLine>
      ))}
      <View style={styles.check}>
        <Text style={styles.checkTitle}>Điều kiện (checklist)</Text>
        {result.checklist.map((item) => (
          <BulletLine key={item.id} style={styles.explain}>
            {item.label}
          </BulletLine>
        ))}
      </View>
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    eyebrow: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 12,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: colors.secondary,
      marginBottom: space[2],
    },
    amount: {
      fontFamily: typography.fontFamily.extraBold,
      fontSize: 32,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
      marginBottom: space[2],
    },
    formula: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.foreground,
      marginBottom: space[2],
    },
    meta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
      opacity: 0.75,
      marginBottom: space[2],
    },
    leave: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.foreground,
      marginBottom: space[3],
    },
    explain: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 20,
      color: colors.foreground,
      opacity: 0.85,
      marginBottom: space[1],
    },
    check: { marginTop: space[3], gap: space[1] },
    checkTitle: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 13,
      color: colors.foreground,
      marginBottom: space[1],
    },
  } satisfies ThemedStyleSheet;
}
