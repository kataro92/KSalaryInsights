import { useState } from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";

import { EligibilityChecklist } from "@/src/components/benefits/EligibilityChecklist";
import { Button } from "@/src/components/common/Button";
import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { ResultHero } from "@/src/components/common/ResultHero";
import { Section } from "@/src/components/common/Section";
import { ToolScreen } from "@/src/components/common/ToolScreen";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { emptyCopy, miuTips } from "@/src/copy/miu";
import {
  REGION_OPTIONS,
  TAX_YEAR_OPTIONS,
} from "@/src/domain/constants/salary";
import type { UnemploymentBreakdown } from "@/src/domain/types/benefits";
import type { RegionCode } from "@/src/domain/types/salary";
import { calcUnemploymentBenefit } from "@/src/engine/unemploymentBenefit";
import { usePreferences } from "@/src/hooks/usePreferences";
import { useScrollToAnchor } from "@/src/hooks/useScrollToAnchor";
import { successHaptic } from "@/src/theme/haptics";
import { parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

export function UnemploymentCalculatorScreen() {
  const { preferences } = usePreferences();
  const { scrollRef, anchorRef, onScroll, scrollToAnchor } = useScrollToAnchor();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2026
  );
  const [region, setRegion] = useState<RegionCode>(preferences.defaultRegion);
  const [monthsPaid, setMonthsPaid] = useState("72");
  const [salaryText, setSalaryText] = useState("15.000.000");
  const [lastDate, setLastDate] = useState("2026-03-15");
  const [shortTerm, setShortTerm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UnemploymentBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const avg = parseMoney(salaryText);
    const paid = Number(monthsPaid.replace(/[^\d]/g, ""));
    if (avg == null || avg <= 0) {
      setError("Nhập lương bình quân đóng bảo hiểm thất nghiệp 6 tháng hợp lệ.");
      setResult(null);
      return;
    }
    if (!Number.isInteger(paid) || paid < 0) {
      setError("Số tháng đóng bảo hiểm thất nghiệp không hợp lệ.");
      setResult(null);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastDate)) {
      setError("Ngày cuối đóng phải dạng YYYY-MM-DD.");
      setResult(null);
      return;
    }

    try {
      const next = calcUnemploymentBenefit({
        monthsPaid: paid,
        avgSalaryBhtn6m: avg,
        region,
        lastContributionDate: lastDate,
        taxYear,
        shortTermContract: shortTerm,
      });
      setResult(next);
      void successHaptic();
      scrollToAnchor();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <ToolScreen
      nested
      title="Trợ cấp thất nghiệp"
      subtitle="Tính khoản tiền có thể nhận khi nghỉ việc. Mức thường là 60% lương bình quân, có trần theo vùng."
      accessibilityLabel="Máy tính trợ cấp thất nghiệp"
      scrollRef={scrollRef}
      onScroll={onScroll}
      sticky={<Button label="Tính thất nghiệp" onPress={onCalculate} />}
    >
      <Section
        title="Năm / vùng"
        subtitle="Trần trợ cấp theo mức tại ngày cuối đóng."
      >
        <View style={styles.row}>
          {TAX_YEAR_OPTIONS.map((y) => {
            const selected = taxYear === y;
            return (
              <Pressable
                key={y}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setTaxYear(y);
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
                  {y}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.row, { marginTop: space[2] }]}>
          {REGION_OPTIONS.map(({ code, label }) => {
            const selected = region === code;
            return (
              <Pressable
                key={code}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setRegion(code);
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
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section
        title="Tháng đã đóng bảo hiểm thất nghiệp"
        subtitle="Tối thiểu 12 tháng để đủ điều kiện."
      >
        <TextInput
          accessibilityLabel="Số tháng đã đóng bảo hiểm thất nghiệp"
          keyboardType="number-pad"
          value={monthsPaid}
          onChangeText={(t) => {
            setMonthsPaid(t.replace(/[^\d]/g, ""));
            setResult(null);
          }}
          style={styles.input}
        />
      </Section>

      <Section
        title="Lương bình quân 6 tháng"
        subtitle="Lương làm căn cứ đóng bảo hiểm thất nghiệp bình quân 6 tháng cuối."
      >
        <MoneyField
          accessibilityLabel="Lương bình quân đóng bảo hiểm thất nghiệp 6 tháng"
          value={salaryText}
          onValueChange={(formatted) => {
            setSalaryText(formatted);
            setResult(null);
          }}
        />
      </Section>

      <Section
        title="Ngày cuối đóng"
        subtitle="Chọn ngày để áp đúng lương tối thiểu vùng (ví dụ 15/03/2026 = nửa đầu năm)."
      >
        <TextInput
          accessibilityLabel="Ngày cuối đóng bảo hiểm thất nghiệp YYYY-MM-DD"
          autoCapitalize="none"
          value={lastDate}
          onChangeText={(t) => {
            setLastDate(t.trim());
            setResult(null);
          }}
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.border}
        />
      </Section>

      <Section
        title="Hợp đồng ngắn"
        subtitle="Hợp đồng dưới 12 tháng: xét 36 tháng gần nhất."
      >
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Hợp đồng ngắn hạn</Text>
          <Switch
            value={shortTerm}
            onValueChange={(v) => {
              setShortTerm(v);
              setResult(null);
            }}
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
        </View>
      </Section>

      {error ? (
        <EmptyErrorState
          variant="error"
          title={emptyCopy.calculateError.title}
          body={error}
        />
      ) : null}

      {result ? (
        <View ref={anchorRef} collapsable={false}>
          {result.eligible ? (
            <>
              <ResultHero
                eyebrow="Trợ cấp thất nghiệp"
                label="Tổng hưởng"
                amount={result.totalBenefit}
              />
              <NgaiMiuTip tip={miuTips.unemployment} />
            </>
          ) : (
            <EmptyErrorState
              variant="error"
              title="Không đủ điều kiện"
              body={result.ineligibilityReason}
            />
          )}
          <ColorBlock
            tone={result.eligible ? "secondarySoft" : "muted"}
            accessibilityLabel="Kết quả trợ cấp thất nghiệp"
          >
            {result.eligible ? (
              <>
                <Text style={styles.formula}>{result.formula}</Text>
                <Text style={styles.meta}>
                  {result.monthlyBenefit.toLocaleString("vi-VN")} ₫/tháng ×{" "}
                  {result.benefitMonths} tháng
                  {result.hitCap
                    ? " · Đã chạm trần 5 × lương tối thiểu vùng"
                    : ""}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.eyebrow}>Không đủ điều kiện</Text>
                <Text style={styles.ineligible}>
                  {result.ineligibilityReason}
                </Text>
              </>
            )}
            {result.explanations.map((line) => (
              <BulletLine key={line} style={styles.explain}>
                {line}
              </BulletLine>
            ))}
          </ColorBlock>
          <EligibilityChecklist items={result.checklist} />
          <DisclaimerFooter
            legalSources={result.legalSources}
            collapseSources
          />
        </View>
      ) : !error ? (
        <EmptyErrorState
          title={emptyCopy.unemployment.title}
          body={emptyCopy.unemployment.body}
        />
      ) : null}
    </ToolScreen>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    row: { flexDirection: "row", flexWrap: "wrap", gap: space[2] },
    chip: {
      minHeight: layout.minTouch,
      paddingHorizontal: space[4],
      borderRadius: radii.md,
      backgroundColor: colors.muted,
      justifyContent: "center",
    },
    chipSelected: { backgroundColor: colors.secondary },
    chipLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.foreground,
    },
    chipLabelSelected: { color: colors.white },
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
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: layout.minTouch,
    },
    switchLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 15,
      color: colors.foreground,
    },
    error: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.danger,
    },
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
      marginBottom: space[2],
    },
    meta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
      opacity: 0.75,
      marginBottom: space[3],
    },
    ineligible: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 16,
      color: colors.foreground,
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
