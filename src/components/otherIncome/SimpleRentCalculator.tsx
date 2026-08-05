import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { ResultHero } from "@/src/components/common/ResultHero";
import { Section } from "@/src/components/common/Section";
import { StickyActionBar } from "@/src/components/common/StickyActionBar";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { OtherIncomeBreakdownCard } from "@/src/components/otherIncome/OtherIncomeBreakdownCard";
import { emptyCopy, miuTips } from "@/src/copy/miu";
import type { RentBreakdown } from "@/src/domain/types/otherIncome";
import { calculateRent } from "@/src/engine/otherIncome/rent";
import { annualFromMonthly } from "@/src/engine/otherIncome/simpleEstimate";
import { successHaptic } from "@/src/theme/haptics";
import { parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = { taxYear: number };

/**
 * F016′. Bản đơn giản: chỉ tiền thuê / tháng → ×12 → thuế cho thuê.
 */
export function SimpleRentCalculator({ taxYear }: Props) {
  const styles = useThemedStyles(makeStyles);
  const [monthlyText, setMonthlyText] = useState("20.000.000");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RentBreakdown | null>(null);

  const clearResult = () => setResult(null);

  const onCalculate = () => {
    setError(null);
    const monthly = parseMoney(monthlyText);
    if (monthly == null || monthly < 0) {
      setError("Nhập tiền thuê tháng hợp lệ.");
      setResult(null);
      return;
    }
    try {
      const annualRevenue = annualFromMonthly(monthly);
      setResult(calculateRent({ annualRevenue, taxYear }));
      void successHaptic();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.body}>
        <Section
          title="Cho thuê nhà. Ước nhanh"
          subtitle="Nhập tiền thuê một tháng. Tôi nhân ×12 theo năm thuế đang chọn."
        >
          <MoneyField
            label="Tiền thuê / tháng"
            accessibilityLabel="Tiền thuê mỗi tháng"
            value={monthlyText}
            onValueChange={(formatted) => {
              setMonthlyText(formatted || "0");
              clearResult();
            }}
          />
          <Text style={styles.hint}>
            Không cần nhập năm hay chi phí. Bật «Đầy đủ» nếu muốn nhập doanh thu
            năm.
          </Text>
        </Section>

        {error ? (
          <EmptyErrorState
            variant="error"
            title={emptyCopy.calculateError.title}
            body={error}
          />
        ) : null}

        {result ? (
          <>
            <ResultHero
              tone="primary"
              eyebrow={`Ước năm · ${result.annualRevenue.toLocaleString(
                "vi-VN"
              )} ₫`}
              label="Tổng thuế"
              amount={result.totalTax}
            />
            <NgaiMiuTip tip={miuTips.rentSimple} />
            <OtherIncomeBreakdownCard
              title="Cho thuê"
              total={result.totalTax}
              formula={result.formula}
              lines={[
                {
                  id: "vat",
                  label: "GTGT",
                  amount: result.vat,
                  tipId: "other.vat",
                },
                {
                  id: "pit",
                  label: "TNCN",
                  amount: result.pit,
                  tipId: "other.pit",
                },
              ]}
              explanations={result.explanations}
              note={result.reportingNote}
              hideTotal
            />
            <DisclaimerFooter legalSources={result.legalSources} />
          </>
        ) : !error ? (
          <EmptyErrorState
            title="Chưa có ước cho thuê"
            body="Nhập tiền thuê tháng, rồi bấm Ước nhanh."
          />
        ) : null}
      </View>

      <StickyActionBar aboveTabBar={false}>
        <Button label="Ước nhanh" onPress={onCalculate} />
      </StickyActionBar>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: { flexGrow: 1 },
    body: {
      gap: space[4],
      paddingBottom: layout.stickyBarHeight + space[8],
    },
    hint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      marginTop: space[2],
      lineHeight: 18,
    },
  } as const;
}
