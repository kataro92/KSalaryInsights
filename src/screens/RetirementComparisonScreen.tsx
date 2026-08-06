import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { LumpSumEligibilityChecklist } from "@/src/components/checklist/LumpSumEligibilityChecklist";
import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { Section } from "@/src/components/common/Section";
import { TextField } from "@/src/components/common/TextField";
import { ToolScreen } from "@/src/components/common/ToolScreen";
import { RetirementComparisonView } from "@/src/components/comparison/RetirementComparisonView";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import {
  canShowRetirementAmounts,
  LumpSumDisclaimerGate,
} from "@/src/components/disclaimer/LumpSumDisclaimerGate";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { miuTips } from "@/src/copy/miu";
import type {
  DisclaimerAckState,
  LumpSumBreakdown,
  PensionBreakdown,
  Sex,
} from "@/src/domain/types/retirement";
import { calcLumpSum } from "@/src/engine/bhxhLumpSum";
import { calcPensionMonthly } from "@/src/engine/pensionEstimate";
import {
  getInflationAdjustment,
  listInflationAdjustmentYears,
} from "@/src/engine/rulesetLoader";
import { useScrollToAnchor } from "@/src/hooks/useScrollToAnchor";
import { successHaptic } from "@/src/theme/haptics";
import {
  requiredIntInRange,
  requiredIsoDate,
  requiredNonNegativeInt,
  requiredPositiveMoney,
} from "@/src/theme/fieldValidation";
import { parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

function parseIntSafe(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

export function RetirementComparisonScreen() {
  const { colors } = useTheme();
  const { scrollRef, anchorRef, onScroll, scrollToAnchor } = useScrollToAnchor();
  const styles = useThemedStyles(makeStyles);
  const [ack, setAck] = useState<DisclaimerAckState>({ acknowledged: false });
  const [sex, setSex] = useState<Sex>("female");
  const [t1Years, setT1Years] = useState("4");
  const [t1Months, setT1Months] = useState("0");
  const [t2Years, setT2Years] = useState("10");
  const [t2Months, setT2Months] = useState("0");
  const [pensionYears, setPensionYears] = useState("25");
  const [mbqtlText, setMbqtlText] = useState("12.000.000");
  const [participationDate, setParticipationDate] = useState("2020-01-15");
  const [tableYear, setTableYear] = useState(2026);
  const [error, setError] = useState<string | null>(null);
  const [lumpSum, setLumpSum] = useState<LumpSumBreakdown | null>(null);
  const [pension, setPension] = useState<PensionBreakdown | null>(null);

  const tableYears = useMemo(() => listInflationAdjustmentYears(), []);
  const inflation = useMemo(
    () => getInflationAdjustment(tableYear),
    [tableYear]
  );

  const showAmounts = canShowRetirementAmounts(ack.acknowledged);

  const onCalculate = () => {
    setError(null);
    const mbqtl = parseMoney(mbqtlText);
    if (mbqtl == null || mbqtl <= 0) {
      setError("Nhập lương bình quân đã điều chỉnh hợp lệ.");
      setLumpSum(null);
      setPension(null);
      return;
    }
    try {
      const nextLump = calcLumpSum({
        yearsPre2014: parseIntSafe(t1Years),
        monthsPre2014: parseIntSafe(t1Months),
        yearsFrom2014: parseIntSafe(t2Years),
        monthsFrom2014: parseIntSafe(t2Months),
        adjustedAvgSalary: mbqtl,
        firstParticipationDate: participationDate || undefined,
      });
      const nextPension = calcPensionMonthly({
        sex,
        contributionYears: parseIntSafe(pensionYears),
        adjustedAvgSalary: mbqtl,
      });
      setLumpSum(nextLump);
      setPension(nextPension);
      void successHaptic();
      scrollToAnchor();
    } catch (e) {
      setLumpSum(null);
      setPension(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  const legalSources = [
    ...(lumpSum?.legalSources ?? []),
    ...(pension?.legalSources ?? []),
    inflation.legal_source,
  ];

  return (
    <ToolScreen
      nested
      title="Lương hưu / nhận một lần"
      subtitle="So sánh tiền hưu hàng tháng với khoản bảo hiểm xã hội một lần. Đọc cảnh báo trước khi xem số."
      accessibilityLabel="So sánh lương hưu và bảo hiểm xã hội một lần"
      scrollRef={scrollRef}
      onScroll={onScroll}
      sticky={<Button label="Tính so sánh" onPress={onCalculate} />}
    >
      <LumpSumDisclaimerGate
        acknowledged={ack.acknowledged}
        onAcknowledge={() =>
          setAck({
            acknowledged: true,
            acknowledgedAt: new Date().toISOString(),
          })
        }
      />

      <Section title="Giới tính" subtitle="Dùng để chọn tỷ lệ tính lương hưu theo luật hiện hành.">
        <View style={styles.row}>
          {(
            [
              { id: "female" as const, label: "Nữ" },
              { id: "male" as const, label: "Nam" },
            ] as const
          ).map((opt) => {
            const selected = sex === opt.id;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setSex(opt.id);
                  setLumpSum(null);
                  setPension(null);
                }}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    selected && styles.chipLabelSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section
        title="Thời gian đóng để nhận một lần"
        subtitle="Tách thời gian trước 2014 và từ 2014 vì hai giai đoạn có hệ số khác nhau."
      >
        <View style={styles.pair}>
          <Field
            styles={styles}
            label="Trước 2014 (năm)"
            value={t1Years}
            error={requiredNonNegativeInt(t1Years)}
            onChange={setT1Years}
            clear={() => {
              setLumpSum(null);
              setPension(null);
            }}
          />
          <Field
            styles={styles}
            label="Trước 2014 (tháng lẻ)"
            value={t1Months}
            error={requiredIntInRange(t1Months, 0, 11, "Tháng lẻ phải từ 0 đến 11.")}
            onChange={setT1Months}
            clear={() => {
              setLumpSum(null);
              setPension(null);
            }}
          />
        </View>
        <View style={styles.pair}>
          <Field
            styles={styles}
            label="Từ 2014 (năm)"
            value={t2Years}
            error={requiredNonNegativeInt(t2Years)}
            onChange={setT2Years}
            clear={() => {
              setLumpSum(null);
              setPension(null);
            }}
          />
          <Field
            styles={styles}
            label="Từ 2014 (tháng lẻ)"
            value={t2Months}
            error={requiredIntInRange(t2Months, 0, 11, "Tháng lẻ phải từ 0 đến 11.")}
            onChange={setT2Months}
            clear={() => {
              setLumpSum(null);
              setPension(null);
            }}
          />
        </View>
      </Section>

      <Section
        title="Năm đóng cho lương hưu"
        subtitle="Tổng số năm đóng dùng để ước tính tỷ lệ hưởng lương hưu."
      >
        <Field
          styles={styles}
          label="Tổng năm đóng"
          value={pensionYears}
          error={requiredNonNegativeInt(pensionYears)}
          onChange={setPensionYears}
          clear={() => {
            setLumpSum(null);
            setPension(null);
          }}
        />
      </Section>

      <Section
        title="Lương bình quân đã điều chỉnh"
        subtitle={`Nhập thủ công hoặc tham chiếu bảng hệ số ${inflation.table_year}.`}
      >
        <MoneyField
          accessibilityLabel="Lương bình quân đã điều chỉnh"
          value={mbqtlText}
          error={requiredPositiveMoney(
            mbqtlText,
            "Nhập lương bình quân đã điều chỉnh lớn hơn 0."
          )}
          onValueChange={(formatted) => {
            setMbqtlText(formatted);
            setLumpSum(null);
            setPension(null);
          }}
        />
        <Text style={styles.hint}>
          Bảng hệ số {inflation.table_year}: ví dụ 2014 ={" "}
          {inflation.coefficients_by_year["2014"]}, 2025 ={" "}
          {inflation.coefficients_by_year["2025"]} ({inflation.legal_source}).
        </Text>
        <View style={styles.row}>
          {tableYears.map((y) => {
            const selected = tableYear === y;
            return (
              <Pressable
                key={y}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setTableYear(y)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    selected && styles.chipLabelSelected,
                  ]}
                >
                  Bảng {y}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section
        title="Ngày tham gia lần đầu"
        subtitle="Chỉ ảnh hưởng checklist điều kiện rút (không đổi số tiền)."
      >
        <TextField
          accessibilityLabel="Ngày tham gia bảo hiểm xã hội YYYY-MM-DD"
          autoCapitalize="none"
          value={participationDate}
          error={
            participationDate.trim()
              ? requiredIsoDate(participationDate)
              : null
          }
          onChangeText={(t) => {
            setParticipationDate(t.trim());
            setLumpSum(null);
            setPension(null);
          }}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.border}
        />
      </Section>

      {error ? (
        <EmptyErrorState variant="error" title="Chưa tính được" body={error} />
      ) : null}

      <View ref={anchorRef} collapsable={false}>
        {showAmounts && lumpSum && pension ? (
          <NgaiMiuTip tip={miuTips.retirement} />
        ) : null}

        <RetirementComparisonView
          lumpSum={lumpSum}
          pension={pension}
          showAmounts={showAmounts}
        />

        {showAmounts && lumpSum ? (
          <LumpSumEligibilityChecklist
            items={lumpSum.checklist}
            beforeCutoff={lumpSum.beforeCutoff}
          />
        ) : null}

        {showAmounts && lumpSum && pension ? (
          <DisclaimerFooter
            legalSources={[...new Set(legalSources)]}
            collapseSources
          />
        ) : null}
      </View>
    </ToolScreen>
  );
}

function Field({
  label,
  value,
  onChange,
  clear,
  error,
  styles,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  clear: () => void;
  error?: string | null;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.field}>
      <TextField
        label={label}
        accessibilityLabel={label}
        keyboardType="number-pad"
        value={value}
        error={error}
        onChangeText={(t) => {
          onChange(t.replace(/[^\d]/g, ""));
          clear();
        }}
      />
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    row: { flexDirection: "row", flexWrap: "wrap", gap: space[2] },
    pair: { flexDirection: "row", gap: space[3], marginBottom: space[3] },
    field: { flex: 1 },
    chip: {
      minHeight: layout.minTouch,
      paddingHorizontal: space[4],
      borderRadius: radii.md,
      backgroundColor: colors.muted,
      justifyContent: "center",
    },
    chipSelected: { backgroundColor: colors.primary },
    chipLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.foreground,
    },
    chipLabelSelected: { color: colors.white },
    hint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.7,
      marginTop: space[2],
      marginBottom: space[2],
    },
  } satisfies ThemedStyleSheet;
}
