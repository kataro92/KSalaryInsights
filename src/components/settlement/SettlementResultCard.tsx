import { Text, View } from "react-native";

import { ResultHero } from "@/src/components/common/ResultHero";
import { InfoTip } from "@/src/components/common/InfoTip";
import { useI18n } from "@/src/i18n/useI18n";
import type { SettlementDelta } from "@/src/domain/types/settlement";
import { moneyAccessibilityLabel } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  delta: SettlementDelta;
  withheldMissingWarning?: boolean;
};

export function SettlementResultCard({ delta, withheldMissingWarning }: Props) {
  const { t } = useI18n();
  const styles = useThemedStyles(makeStyles);

  if (delta.kind === "even") {
    return (
      <View
        style={styles.balanced}
        accessibilityLabel={t("settlement.evenTitle")}
      >
        <View style={styles.evenRow}>
          <Text style={styles.balancedTitle}>{t("settlement.evenTitle")}</Text>
          <InfoTip tipId="settlement.even" size={16} />
        </View>
        {withheldMissingWarning ? (
          <Text style={styles.warn}>{t("settlement.withheldWarn")}</Text>
        ) : null}
      </View>
    );
  }

  const isRefund = delta.kind === "refund";
  return (
    <View style={styles.wrap}>
      <ResultHero
        tone={isRefund ? "positive" : "primary"}
        eyebrow={
          isRefund ? t("settlement.refundEyebrow") : t("settlement.payEyebrow")
        }
        label={
          isRefund ? t("settlement.refundLabel") : t("settlement.payLabel")
        }
        amount={delta.amount}
        tipId={isRefund ? "settlement.refund" : "settlement.pay"}
        accessibilityLabel={moneyAccessibilityLabel(
          delta.amount,
          isRefund ? t("settlement.refundEyebrow") : t("settlement.payEyebrow")
        )}
      />
      {withheldMissingWarning ? (
        <Text style={styles.warn}>{t("settlement.withheldWarn")}</Text>
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[3] },
    balanced: {
      backgroundColor: colors.muted,
      padding: space[5],
      borderRadius: 8,
    },
    evenRow: { flexDirection: "row", alignItems: "center", gap: space[2] },
    balancedTitle: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 16,
      color: colors.foreground,
    },
    warn: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 20,
      color: colors.accent,
      marginTop: space[2],
    },
  } as const;
}
