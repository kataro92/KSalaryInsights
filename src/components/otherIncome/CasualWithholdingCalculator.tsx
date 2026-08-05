import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { ResultHero } from "@/src/components/common/ResultHero";
import { Section } from "@/src/components/common/Section";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { OtherIncomeBreakdownCard } from "@/src/components/otherIncome/OtherIncomeBreakdownCard";
import type { CasualWithholdingBreakdown } from "@/src/domain/types/otherIncome";
import { calculateCasualWithholding } from "@/src/engine/otherIncome/casualWithholding";
import { successHaptic } from "@/src/theme/haptics";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function formatInput(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "";
  return n.toLocaleString("vi-VN");
}

type Props = { taxYear: number; asOfDate?: string };

export function CasualWithholdingCalculator({ taxYear, asOfDate }: Props) {
  const styles = useThemedStyles(makeStyles);
  const [amountText, setAmountText] = useState("10.000.000");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CasualWithholdingBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const paymentAmount = parseMoney(amountText);
    if (paymentAmount == null || paymentAmount < 0) {
      setError("Nhập số tiền hợp lệ.");
      setResult(null);
      return;
    }
    try {
      setResult(
        calculateCasualWithholding({
          paymentAmount,
          taxYear,
          asOfDate: asOfDate ?? `${taxYear}-08-15`,
        })
      );
      void successHaptic();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <View style={styles.wrap}>
      <Section
        title="Vãng lai. Khấu trừ tại nguồn"
        subtitle="Ngưỡng 5tr (2026) / 2tr (≤2025) theo năm thuế. Miễn QT xem Quyết toán."
      >
        <TextInput
          accessibilityLabel="Số tiền chi trả vãng lai"
          keyboardType="number-pad"
          value={amountText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            setAmountText(
              n == null ? t.replace(/[^\d.]/g, "") : formatInput(n)
            );
            setResult(null);
          }}
          style={styles.input}
        />
      </Section>
      {error ? (
        <EmptyErrorState variant="error" title="Chưa tính được" body={error} />
      ) : null}
      <Button label="Tính khấu trừ" onPress={onCalculate} />
      {result ? (
        <>
          <ResultHero
            tone="primary"
            eyebrow="Khấu trừ vãng lai"
            label="Đã trừ"
            amount={result.withheld}
          />
          <NgaiMiuTip tip="Thực nhận nằm trong breakdown. Miễn QT chỉ áp khi đủ điều kiện ở Quyết toán." />
          <OtherIncomeBreakdownCard
            title="Khấu trừ vãng lai"
            total={result.withheld}
            totalLabel="Số khấu trừ"
            formula={result.formula}
            lines={[
              { id: "withheld", label: "Khấu trừ", amount: result.withheld },
              { id: "net", label: "Thực nhận", amount: result.netReceived },
            ]}
            explanations={result.explanations}
            note={result.settlementWarning}
            hideTotal
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </>
      ) : !error ? (
        <EmptyErrorState
          title="Chưa có ước khấu trừ"
          body="Nhập số tiền chi trả, rồi bấm Tính khấu trừ."
        />
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[4] },
    input: {
      minHeight: layout.minTouch,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.md,
      paddingHorizontal: space[3],
      fontFamily: typography.fontFamily.medium,
      fontSize: 16,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
      backgroundColor: colors.white,
    },
  } satisfies ThemedStyleSheet;
}
