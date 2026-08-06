import { Text, View } from "react-native";

import { ColorBlock } from "@/src/components/common/ColorBlock";
import { InfoTip } from "@/src/components/common/InfoTip";
import type { TipId } from "@/src/i18n/types";
import { useI18n } from "@/src/i18n/useI18n";
import type { AnnualSettlementBreakdown } from "@/src/domain/types/settlement";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

function formatVnd(n: number): string {
  return `${n.toLocaleString("vi-VN")} ₫`;
}

function Row({
  label,
  value,
  tipId,
  styles,
}: {
  label: string;
  value: string;
  tipId?: TipId;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {tipId ? <InfoTip tipId={tipId} size={14} /> : null}
      </View>
      <Text style={styles.value} accessibilityLabel={`${label} ${value}`}>
        {value}
      </Text>
    </View>
  );
}

type Props = { breakdown: AnnualSettlementBreakdown; title?: string };

export function AnnualBreakdownCard({ breakdown, title }: Props) {
  const { t } = useI18n();
  const styles = useThemedStyles(makeStyles);
  const heading = title ?? t("annual.heading");

  return (
    <ColorBlock tone="muted" accessibilityLabel={heading}>
      <Text style={styles.heading}>{heading}</Text>
      <Row
        styles={styles}
        label={t("annual.afterInsurance")}
        value={formatVnd(breakdown.incomeAfterInsuranceYear)}
        tipId="salary.afterInsurance"
      />
      {breakdown.casualGrossIncluded > 0 ? (
        <Row
          styles={styles}
          label={t("annual.casual")}
          value={formatVnd(breakdown.casualGrossIncluded)}
        />
      ) : null}
      <Row
        styles={styles}
        label={t("annual.personalRelief")}
        value={`− ${formatVnd(breakdown.personalReliefYear)}`}
        tipId="salary.personalRelief"
      />
      <Row
        styles={styles}
        label={t("annual.dependentRelief")}
        value={`− ${formatVnd(breakdown.dependentReliefYear)}`}
        tipId="salary.dependentRelief"
      />
      <Row
        styles={styles}
        label={t("annual.reliefTotal")}
        value={`− ${formatVnd(breakdown.reliefTotalYear)}`}
        tipId="salary.reliefTotal"
      />
      <Row
        styles={styles}
        label={t("annual.taxable")}
        value={formatVnd(breakdown.taxableIncomeAfterRelief)}
        tipId="salary.taxable"
      />
      {breakdown.brackets.map((b) => (
        <Row
          styles={styles}
          key={b.bracket}
          label={t("salary.labelPitBracket", {
            n: b.bracket,
            pct: Math.round(b.rate * 100),
          })}
          value={`− ${formatVnd(b.tax)}`}
          tipId="salary.pit"
        />
      ))}
      <Row
        styles={styles}
        label={t("annual.pitTotal")}
        value={formatVnd(breakdown.annualTax)}
        tipId="salary.pit"
      />
      <Row
        styles={styles}
        label={t("annual.withheld")}
        value={formatVnd(breakdown.totalWithheld)}
        tipId="settlement.refund"
      />
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    heading: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.subtitle.fontSize,
      lineHeight: typography.scale.subtitle.lineHeight,
      color: colors.foreground,
      marginBottom: space[3],
      letterSpacing: typography.letterSpacingTight,
      paddingRight: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: space[3],
      minHeight: 34,
      paddingVertical: 2,
    },
    labelRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: space[1],
    },
    label: {
      flexShrink: 1,
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
    },
    value: {
      flexShrink: 1,
      maxWidth: "48%",
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 13,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
      textAlign: "right",
    },
  } satisfies ThemedStyleSheet;
}
