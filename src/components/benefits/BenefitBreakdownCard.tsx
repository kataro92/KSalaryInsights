import { Text, View } from "react-native";

import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { SeveranceBreakdown } from "@/src/domain/types/benefits";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  result: SeveranceBreakdown;
  /** When ResultHero already shows the peak amount. */
  hideTotal?: boolean;
};

export function BenefitBreakdownCard({ result, hideTotal = false }: Props) {
  const styles = useThemedStyles(makeStyles);
  const modeLabel =
    result.mode === "resignation" ? "Trợ cấp thôi việc" : "Trợ cấp mất việc";

  return (
    <ColorBlock
      tone="secondarySoft"
      accessibilityLabel={`Kết quả ${modeLabel}`}
    >
      <Text style={styles.eyebrow}>
        {hideTotal ? `Chi tiết · ${modeLabel}` : modeLabel}
      </Text>
      {!hideTotal ? (
        <Text style={styles.amount} accessibilityRole="text">
          {result.amount.toLocaleString("vi-VN")} ₫
        </Text>
      ) : null}
      <Text style={styles.formula}>{result.formula}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaLine}>
          Thời gian tính: {result.yearsCounted} năm · Hệ số{" "}
          {result.rateMonthsPerYear}
          {result.mode === "job_loss" ? ` · Sàn ${result.minMonths} tháng` : ""}
        </Text>
      </View>
      {result.explanations.map((line) => (
        <BulletLine key={line} style={styles.explain}>
          {line}
        </BulletLine>
      ))}
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
      marginBottom: space[3],
    },
    meta: {
      marginBottom: space[3],
    },
    metaLine: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
      opacity: 0.75,
    },
    explain: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 20,
      color: colors.foreground,
      opacity: 0.85,
      marginBottom: space[1],
    },
  } satisfies ThemedStyleSheet;
}
