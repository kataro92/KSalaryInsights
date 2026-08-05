import { Text, View } from "react-native";

import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import { InfoTip } from "@/src/components/common/InfoTip";
import type { TipId } from "@/src/i18n/types";
import { useI18n } from "@/src/i18n/useI18n";
import type { OtherIncomeLine } from "@/src/domain/types/otherIncome";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type LineWithTip = OtherIncomeLine & { tipId?: TipId };

type Props = {
  title: string;
  totalLabel?: string;
  total: number;
  formula: string;
  lines: LineWithTip[];
  explanations: string[];
  note?: string;
  /** When ResultHero already shows the peak total. */
  hideTotal?: boolean;
};

export function OtherIncomeBreakdownCard({
  title,
  totalLabel,
  total,
  formula,
  lines,
  explanations,
  note,
  hideTotal = false,
}: Props) {
  const { t } = useI18n();
  const styles = useThemedStyles(makeStyles);
  const resolvedTotalLabel = totalLabel ?? t("other.totalTax");

  return (
    <ColorBlock tone="secondarySoft" accessibilityLabel={`Kết quả ${title}`}>
      <Text style={styles.eyebrow}>
        {hideTotal ? t("other.detail", { title }) : title}
      </Text>
      {!hideTotal ? (
        <>
          <Text style={styles.totalLabel}>{resolvedTotalLabel}</Text>
          <Text style={styles.amount}>{total.toLocaleString("vi-VN")} ₫</Text>
        </>
      ) : null}
      <Text style={styles.formula}>{formula}</Text>
      {lines.map((line) => (
        <View key={line.id} style={styles.row}>
          <View style={styles.labelRow}>
            <Text style={styles.rowLabel}>{line.label}</Text>
            {line.tipId ? <InfoTip tipId={line.tipId} size={14} /> : null}
          </View>
          <Text style={styles.rowValue}>
            {line.amount.toLocaleString("vi-VN")} ₫
          </Text>
        </View>
      ))}
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {explanations.map((e) => (
        <BulletLine key={e} style={styles.explain}>
          {e}
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
    totalLabel: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
      opacity: 0.7,
    },
    amount: {
      fontFamily: typography.fontFamily.extraBold,
      fontSize: 28,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
      marginBottom: space[2],
    },
    formula: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      color: colors.foreground,
      marginBottom: space[3],
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: space[1],
    },
    labelRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: space[1],
      paddingRight: space[2],
    },
    rowLabel: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
      opacity: 0.75,
      flexShrink: 1,
    },
    rowValue: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 13,
      fontVariant: ["tabular-nums"],
      color: colors.foreground,
    },
    note: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      lineHeight: 20,
      color: colors.accent,
      marginVertical: space[2],
    },
    explain: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.85,
      marginBottom: space[1],
    },
  } satisfies ThemedStyleSheet;
}
