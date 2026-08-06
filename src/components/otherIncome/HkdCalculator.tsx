import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { ResultHero } from "@/src/components/common/ResultHero";
import { Section } from "@/src/components/common/Section";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { OtherIncomeBreakdownCard } from "@/src/components/otherIncome/OtherIncomeBreakdownCard";
import type {
  HkdBreakdown,
  HkdIndustryId,
} from "@/src/domain/types/otherIncome";
import { calculateHkd } from "@/src/engine/otherIncome/hkd";
import { getRuleset } from "@/src/engine/rulesetLoader";
import { useOptionalScrollToResult } from "@/src/context/ScrollToResultContext";
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

type Props = { taxYear: number };

export function HkdCalculator({ taxYear }: Props) {
  const styles = useThemedStyles(makeStyles);
  const scroll = useOptionalScrollToResult();
  const industries = getRuleset(taxYear).other_income?.hkd.industry_rates ?? [];
  const [industryId, setIndustryId] = useState<HkdIndustryId>("distribution");
  const [revenueText, setRevenueText] = useState("1.500.000.000");
  const [costText, setCostText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HkdBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const annualRevenue = parseMoney(revenueText);
    if (annualRevenue == null || annualRevenue < 0) {
      setError("Nhập doanh thu hợp lệ.");
      setResult(null);
      return;
    }
    try {
      setResult(
        calculateHkd({
          annualRevenue,
          industryId,
          costs: parseMoney(costText) ?? undefined,
          taxYear,
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
        title="Hộ kinh doanh"
        subtitle="Chọn nhóm ngành. Tỷ lệ theo năm thuế."
      >
        <View style={styles.row}>
          {industries.map((ind) => {
            const selected = industryId === ind.id;
            return (
              <Pressable
                key={ind.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setIndustryId(ind.id as HkdIndustryId);
                  setResult(null);
                }}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    selected && styles.chipLabelSelected,
                  ]}
                >
                  {ind.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.fieldLabel}>Doanh thu năm</Text>
        <TextInput
          accessibilityLabel="Doanh thu hộ kinh doanh năm"
          keyboardType="number-pad"
          value={revenueText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            setRevenueText(
              n == null ? t.replace(/[^\d.]/g, "") : formatInput(n)
            );
            setResult(null);
          }}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>
          Chi phí (tuỳ chọn. Gợi ý PP thu nhập)
        </Text>
        <TextInput
          accessibilityLabel="Chi phí hộ kinh doanh"
          keyboardType="number-pad"
          value={costText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            setCostText(n == null ? t.replace(/[^\d.]/g, "") : formatInput(n));
            setResult(null);
          }}
          style={styles.input}
        />
      </Section>
      {error ? (
        <EmptyErrorState variant="error" title="Chưa tính được" body={error} />
      ) : null}
      <Button label="Tính hộ kinh doanh" onPress={onCalculate} />
      {result ? (
        <View ref={scroll?.anchorRef} collapsable={false}>
          <ResultHero
            tone="primary"
            eyebrow={`Hộ kinh doanh · ${result.industryLabel}`}
            label="Tổng thuế"
            amount={result.totalTax}
          />
          <NgaiMiuTip tip="Thuế giá trị gia tăng và thuế thu nhập cá nhân theo nhóm ngành. Nếu được miễn, vẫn cần kê khai doanh thu." />
          <OtherIncomeBreakdownCard
            title={`Hộ kinh doanh. ${result.industryLabel}`}
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
            note={
              result.exempt
                ? "Miễn thuế tỷ lệ. Vẫn kê khai doanh thu."
                : result.incomeMethodHint?.note
            }
            hideTotal
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </View>
      ) : !error ? (
        <EmptyErrorState
          title="Chưa có thuế hộ kinh doanh ước tính"
          body="Chọn ngành và doanh thu năm, rồi bấm Tính hộ kinh doanh."
        />
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[4] },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: space[2],
      marginBottom: space[3],
    },
    chip: {
      minHeight: layout.minTouch,
      paddingHorizontal: space[3],
      borderRadius: radii.md,
      backgroundColor: colors.muted,
      justifyContent: "center",
      maxWidth: "100%",
    },
    chipSelected: { backgroundColor: colors.secondary },
    chipLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 12,
      color: colors.foreground,
    },
    chipLabelSelected: { color: colors.white },
    fieldLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 12,
      color: colors.foreground,
      opacity: 0.7,
      marginBottom: space[1],
      marginTop: space[2],
    },
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
