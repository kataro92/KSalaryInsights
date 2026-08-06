import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { ResultHero } from "@/src/components/common/ResultHero";
import { Section } from "@/src/components/common/Section";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { OtherIncomeBreakdownCard } from "@/src/components/otherIncome/OtherIncomeBreakdownCard";
import { emptyCopy, miuTips } from "@/src/copy/miu";
import type { RentBreakdown } from "@/src/domain/types/otherIncome";
import { calculateRent } from "@/src/engine/otherIncome/rent";
import { annualFromMonthly } from "@/src/engine/otherIncome/simpleEstimate";
import { useOptionalScrollToResult } from "@/src/context/ScrollToResultContext";
import { successHaptic } from "@/src/theme/haptics";
import { parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = { taxYear: number };

/**
 * F016′. Bản đơn giản: chỉ tiền thuê / tháng → ×12 → thuế cho thuê.
 */
export function SimpleRentCalculator({ taxYear }: Props) {
  const styles = useThemedStyles(makeStyles);
  const scroll = useOptionalScrollToResult();
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
      scroll?.scrollToAnchor();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <View style={styles.root}>
      <Section
        title="Cho thuê nhà. Tính nhanh"
        subtitle="Nhập tiền thuê một tháng. Tôi nhân ×12 để ước thuế cả năm."
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
          Không cần nhập chi phí. Bật «Đầy đủ» nếu muốn nhập doanh thu
          năm.
        </Text>
      </Section>

      <Button label="Tính nhanh" onPress={onCalculate} />

      {error ? (
        <EmptyErrorState
          variant="error"
          title={emptyCopy.calculateError.title}
          body={error}
        />
      ) : null}

      {result ? (
        <View ref={scroll?.anchorRef} collapsable={false}>
          <ResultHero
            tone="primary"
            eyebrow={`Doanh thu năm ước tính · ${result.annualRevenue.toLocaleString(
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
      ) : !error ? (
        <EmptyErrorState
          title="Chưa có thuế cho thuê ước tính"
          body="Nhập tiền thuê tháng, rồi bấm Tính nhanh."
        />
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: {
      gap: space[4],
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
