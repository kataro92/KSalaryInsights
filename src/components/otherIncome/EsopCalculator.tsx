import { useState } from "react";
import { Switch, Text, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { ResultHero } from "@/src/components/common/ResultHero";
import { Section } from "@/src/components/common/Section";
import { TextField } from "@/src/components/common/TextField";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { OtherIncomeBreakdownCard } from "@/src/components/otherIncome/OtherIncomeBreakdownCard";
import type { EsopBreakdown } from "@/src/domain/types/otherIncome";
import { calculateEsop } from "@/src/engine/otherIncome/esop";
import { useOptionalScrollToResult } from "@/src/context/ScrollToResultContext";
import { successHaptic } from "@/src/theme/haptics";
import {
  optionalNonNegativeMoney,
  requiredIsoDate,
  requiredNonNegativeInt,
  requiredNonNegativeMoney,
} from "@/src/theme/fieldValidation";
import { parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = { taxYear: number };

export function EsopCalculator({ taxYear }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const scroll = useOptionalScrollToResult();
  const [useBookCost, setUseBookCost] = useState(true);
  const [bookText, setBookText] = useState("100.000.000");
  const [sharesText, setSharesText] = useState("10000");
  const [parText, setParText] = useState("10.000");
  const [paidText, setPaidText] = useState("0");
  const [saleText, setSaleText] = useState("300.000.000");
  const [asOfDate, setAsOfDate] = useState("2026-08-15");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EsopBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const salePrice = parseMoney(saleText);
    if (salePrice == null || salePrice < 0) {
      setError("Nhập giá bán hợp lệ.");
      setResult(null);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) {
      setError("Ngày phải dạng YYYY-MM-DD.");
      setResult(null);
      return;
    }
    try {
      setResult(
        calculateEsop({
          salePrice,
          taxYear,
          asOfDate,
          bookCostAtGrant: useBookCost
            ? parseMoney(bookText) ?? undefined
            : undefined,
          shares: useBookCost
            ? undefined
            : Number(sharesText.replace(/[^\d]/g, "") || "0"),
          parValue: useBookCost ? undefined : parseMoney(parText) ?? undefined,
          amountPaid: useBookCost ? undefined : parseMoney(paidText) ?? 0,
        })
      );
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
        title="ESOP"
        subtitle="Tính thuế từ cổ phiếu được thưởng/mua ưu đãi và thuế khi chuyển nhượng."
      >
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Dùng chi phí ghi sổ</Text>
          <Switch
            value={useBookCost}
            onValueChange={(v) => {
              setUseBookCost(v);
              setResult(null);
            }}
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
        </View>
        {useBookCost ? (
          <MoneyField
            label="Chi phí ghi sổ tại trao"
            accessibilityLabel="Chi phí ghi sổ ESOP"
            value={bookText}
            error={optionalNonNegativeMoney(bookText)}
            onValueChange={(formatted) => {
              setBookText(formatted);
              setResult(null);
            }}
          />
        ) : (
          <>
            <TextField
              label="Số cổ phiếu"
              accessibilityLabel="Số cổ phiếu"
              keyboardType="number-pad"
              value={sharesText}
              error={requiredNonNegativeInt(sharesText, "Nhập số cổ phiếu.")}
              onChangeText={(t) => {
                setSharesText(t.replace(/[^\d]/g, ""));
                setResult(null);
              }}
            />
            <MoneyField
              label="Mệnh giá"
              accessibilityLabel="Mệnh giá"
              value={parText}
              error={optionalNonNegativeMoney(parText)}
              onValueChange={(formatted) => {
                setParText(formatted);
                setResult(null);
              }}
            />
            <MoneyField
              label="Số đã trả"
              accessibilityLabel="Số đã trả"
              value={paidText}
              error={optionalNonNegativeMoney(paidText)}
              onValueChange={(formatted) => {
                setPaidText(formatted);
                setResult(null);
              }}
            />
          </>
        )}
        <MoneyField
          label="Giá bán"
          accessibilityLabel="Giá bán ESOP"
          value={saleText}
          error={requiredNonNegativeMoney(saleText, "Nhập giá bán hợp lệ.")}
          onValueChange={(formatted) => {
            setSaleText(formatted);
            setResult(null);
          }}
        />
        <TextField
          label="Ngày (YYYY-MM-DD)"
          accessibilityLabel="Ngày ESOP"
          autoCapitalize="none"
          value={asOfDate}
          error={requiredIsoDate(asOfDate)}
          onChangeText={(t) => {
            setAsOfDate(t.trim());
            setResult(null);
          }}
        />
      </Section>
      {error ? (
        <EmptyErrorState variant="error" title="Chưa tính được" body={error} />
      ) : null}
      <Button label="Tính ESOP" onPress={onCalculate} />
      {result ? (
        <View ref={scroll?.anchorRef} collapsable={false}>
          <ResultHero
            tone="primary"
            eyebrow="Thuế ESOP ước tính"
            label="Tổng thuế"
            amount={result.totalTax}
          />
          <NgaiMiuTip tip="Thuế từ phần thu nhập cổ phiếu và thuế chuyển nhượng được tách dòng. Đọc ghi chú quyết toán nếu có." />
          <OtherIncomeBreakdownCard
            title="ESOP"
            total={result.totalTax}
            formula={result.formula}
            lines={[
              {
                id: "tlcc",
                label: "Thuế thu nhập từ cổ phiếu",
                amount: result.tlccWithholding,
              },
              {
                id: "cn",
                label: "Thuế chuyển nhượng",
                amount: result.transferTax,
              },
            ]}
            explanations={result.explanations}
            note={result.settlementNote}
            hideTotal
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </View>
      ) : !error ? (
        <EmptyErrorState
          title="Chưa có thuế ESOP ước tính"
          body="Nhập chi phí / giá bán, rồi bấm Tính ESOP."
        />
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
      flexShrink: 1,
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.foreground,
      paddingRight: space[2],
    },
  } satisfies ThemedStyleSheet;
}
