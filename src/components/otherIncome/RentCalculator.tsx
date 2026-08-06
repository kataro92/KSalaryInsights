import { useState } from "react";
import { Switch, Text, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { ResultHero } from "@/src/components/common/ResultHero";
import { Section } from "@/src/components/common/Section";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { OtherIncomeBreakdownCard } from "@/src/components/otherIncome/OtherIncomeBreakdownCard";
import { miuTips } from "@/src/copy/miu";
import type { RentBreakdown } from "@/src/domain/types/otherIncome";
import { calculateRent } from "@/src/engine/otherIncome/rent";
import { useOptionalScrollToResult } from "@/src/context/ScrollToResultContext";
import { successHaptic } from "@/src/theme/haptics";
import { requiredNonNegativeMoney } from "@/src/theme/fieldValidation";
import { parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = { taxYear: number };

export function RentCalculator({ taxYear }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const scroll = useOptionalScrollToResult();
  const [monthlyMode, setMonthlyMode] = useState(true);
  const [amountText, setAmountText] = useState("20.000.000");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RentBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const amount = parseMoney(amountText);
    if (amount == null || amount < 0) {
      setError("Nhập doanh thu hợp lệ.");
      setResult(null);
      return;
    }
    const annualRevenue = monthlyMode ? amount * 12 : amount;
    try {
      setResult(calculateRent({ annualRevenue, taxYear }));
      void successHaptic();
      scroll?.scrollToAnchor();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <View style={styles.wrap}>
      <Section
        title="Cho thuê nhà / BĐS"
        subtitle="Ngưỡng và tỷ lệ theo năm thuế đang chọn."
      >
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Nhập theo tháng (×12)</Text>
          <Switch
            value={monthlyMode}
            onValueChange={(v) => {
              setMonthlyMode(v);
              setResult(null);
            }}
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
        </View>
        <MoneyField
          label={monthlyMode ? "Doanh thu tháng" : "Doanh thu năm"}
          accessibilityLabel="Doanh thu cho thuê"
          value={amountText}
          error={requiredNonNegativeMoney(amountText, "Nhập doanh thu hợp lệ.")}
          onValueChange={(formatted) => {
            setAmountText(formatted);
            setResult(null);
          }}
        />
      </Section>
      {error ? (
        <EmptyErrorState variant="error" title="Chưa tính được" body={error} />
      ) : null}
      <Button label="Tính cho thuê" onPress={onCalculate} />
      {result ? (
        <View ref={scroll?.anchorRef} collapsable={false}>
          <ResultHero
            tone="primary"
            eyebrow="Thuế cho thuê ước tính"
            label="Tổng thuế"
            amount={result.totalTax}
          />
          <NgaiMiuTip tip={miuTips.rent} />
          <OtherIncomeBreakdownCard
            title="Cho thuê"
            total={result.totalTax}
            formula={result.formula}
            lines={[
              {
                id: "vat",
                label: "Thuế giá trị gia tăng",
                amount: result.vat,
                tipId: "other.vat",
              },
              {
                id: "pit",
                label: "Thuế thu nhập cá nhân",
                amount: result.pit,
                tipId: "other.pit",
              },
            ]}
            explanations={result.explanations}
            note={result.reportingNote}
            hideTotal
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </View>
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[4] },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: layout.minTouch,
      marginBottom: space[2],
    },
    switchLabel: {
      flex: 1,
      fontFamily: typography.fontFamily.medium,
      fontSize: 15,
      color: colors.foreground,
      paddingRight: space[3],
    },
  } as const;
}
