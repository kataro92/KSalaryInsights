import { Text, View } from "react-native";

import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { MaternityBreakdown } from "@/src/domain/types/benefits";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  result: MaternityBreakdown;
  /** When ResultHero already shows the peak total. */
  hideTotal?: boolean;
};

export function MaternityBreakdownCard({ result, hideTotal = false }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <ColorBlock tone="secondarySoft" accessibilityLabel="Kết quả thai sản">
      {!hideTotal ? (
        <>
          <Text style={styles.eyebrow}>Tiền thai sản ước tính</Text>
          <Text style={styles.amount}>
            {result.total.toLocaleString("vi-VN")} ₫
          </Text>
        </>
      ) : (
        <Text style={styles.eyebrow}>Chi tiết thai sản</Text>
      )}
      <Text style={styles.formula}>{result.formula}</Text>

      <View style={styles.rows}>
        <Row styles={styles} label="Tiền chế độ" value={result.monthlyBenefitTotal} />
        <Row styles={styles} label="Trợ cấp 1 lần" value={result.oneTimeAllowance} />
        <Text style={styles.meta}>
          {result.leaveMonths} tháng nghỉ · tham chiếu{" "}
          {result.referenceSalary.toLocaleString("vi-VN")} ₫
          {result.twinBonusMonths > 0
            ? ` · +${result.twinBonusMonths} tháng do sinh đôi`
            : ""}
        </Text>
      </View>

      {result.eligibilityWarning ? (
        <Text style={styles.warn}>{result.eligibilityWarning}</Text>
      ) : null}

      {result.explanations.map((line) => (
        <BulletLine key={line} style={styles.explain}>
          {line}
        </BulletLine>
      ))}
    </ColorBlock>
  );
}

function Row({
  label,
  value,
  styles,
}: {
  label: string;
  value: number;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value.toLocaleString("vi-VN")} ₫</Text>
    </View>
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
    rows: { gap: space[2], marginBottom: space[3] },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowLabel: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      color: colors.foreground,
      opacity: 0.75,
    },
    rowValue: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 14,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
    },
    meta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
      opacity: 0.7,
      marginTop: space[1],
    },
    warn: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      lineHeight: 20,
      color: colors.accent,
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
  } satisfies ThemedStyleSheet;
}
