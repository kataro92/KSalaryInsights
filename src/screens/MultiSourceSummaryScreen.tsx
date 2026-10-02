import { useMemo, useState } from "react";
import { Alert, Pressable, Share, Switch, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { ScenarioPanel } from "@/src/components/calculator/ScenarioPanel";
import { SaveScenarioModal } from "@/src/components/calculator/SaveScenarioModal";
import { AppIcon } from "@/src/components/common/AppIcon";
import { Button } from "@/src/components/common/Button";
import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { CollapseSection } from "@/src/components/common/CollapseSection";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { DependentCountInput } from "@/src/components/inputs/DependentCountInput";
import {
  DependentPeriodsInput,
  type DependentPeriod,
} from "@/src/components/inputs/DependentPeriodsInput";
import { calculateAnnualSettlement } from "@/src/engine/annualSettlement";
import { formatVnd, formatMoneyInput, parseMoney } from "@/src/theme/money";
import { Section } from "@/src/components/common/Section";
import { ToolScreen } from "@/src/components/common/ToolScreen";
import { OtherIncomeDisclaimer } from "@/src/components/disclaimer/OtherIncomeDisclaimer";
import { MultiSourceLineEditor } from "@/src/components/settlement/MultiSourceLineEditor";
import { MultiSourceTable } from "@/src/components/settlement/MultiSourceTable";
import { brand } from "@/src/copy/miu";
import { TAX_YEAR_OPTIONS } from "@/src/domain/constants/salary";
import type { MultiSourceLine } from "@/src/domain/types/multiSource";
import { MAX_MULTI_SOURCE_LINES } from "@/src/domain/types/multiSource";
import {
  activeLegalSources,
  filingWizardImpactFromLines,
  summarizeMultiSource,
} from "@/src/engine/multiSourceAnnual";
import { mapSalaryLine } from "@/src/engine/multiSourceMappers";
import { useScenarios } from "@/src/hooks/useScenarios";
import {
  defaultScenarioName,
  formatScenarioShareText,
  newScenarioId,
  type MultiSourceScenarioInputs,
  type SavedScenario,
} from "@/src/store/scenarios";
import { successHaptic } from "@/src/theme/haptics";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import {
  useThemedStyles,
  type ThemedStyleSheet,
} from "@/src/theme/useThemedStyles";

function newSummaryId(): string {
  return `ms_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function MultiSourceSummaryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { scenarios, save, remove } = useScenarios("multi_source");
  const settlementScenarios = useScenarios("settlement").scenarios;

  const [taxYear, setTaxYear] = useState(2026);
  const [summaryId, setSummaryId] = useState(newSummaryId);
  const [lines, setLines] = useState<MultiSourceLine[]>([]);
  const [useSalaryRelief, setUseSalaryRelief] = useState(false);
  const [medicalText, setMedicalText] = useState("0");
  const [educationText, setEducationText] = useState("0");
  const [numDependents, setNumDependents] = useState(0);
  const [periods, setPeriods] = useState<DependentPeriod[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");

  const salaryRelief = useSalaryRelief
    ? {
        numDependents,
        dependentPeriods: periods,
        medicalExpenses: parseMoney(medicalText) ?? 0,
        educationExpenses: parseMoney(educationText) ?? 0,
      }
    : undefined;
  const assessment = useMemo(() => {
    try {
      return {
        totals: summarizeMultiSource({ lines, taxYear, salaryRelief }),
        error: null,
      };
    } catch (e) {
      return {
        totals: summarizeMultiSource({ lines }),
        error: e instanceof Error ? e.message : "Không tính được giảm trừ",
      };
    }
  }, [
    lines,
    taxYear,
    useSalaryRelief,
    numDependents,
    periods,
    medicalText,
    educationText,
  ]);
  const { totals } = assessment;
  const impact = useMemo(() => filingWizardImpactFromLines(lines), [lines]);
  const legalSources = useMemo(() => activeLegalSources(lines), [lines]);

  const inputs: MultiSourceScenarioInputs = useMemo(
    () => ({
      id: summaryId,
      taxYear,
      updatedAt: new Date().toISOString(),
      lines,
      salaryRelief,
    }),
    [
      summaryId,
      taxYear,
      lines,
      useSalaryRelief,
      numDependents,
      periods,
      medicalText,
      educationText,
    ],
  );

  const addLine = (line: MultiSourceLine) => {
    if (lines.length >= MAX_MULTI_SOURCE_LINES) {
      Alert.alert("Giới hạn", `Tối đa ${MAX_MULTI_SOURCE_LINES} dòng nguồn.`);
      return;
    }
    setLines((prev) => [...prev, line]);
    void successHaptic();
  };

  const importFromSettlement = (s: SavedScenario) => {
    if (s.kind !== "settlement") return;
    const i = s.inputs;
    const computed = calculateAnnualSettlement({
      ...i,
      casual: i.includeCasual
        ? { gross: i.casualGross, withheld: i.casualWithheld }
        : undefined,
    });
    const b = computed.primary.breakdown;
    const estimatedPit = b.annualTax;
    const income =
      b.incomeAfterInsuranceYear -
      (b.exemptIncomeYear ?? 0) -
      (b.additionalReliefYear?.voluntaryInsurance ?? 0) -
      (b.additionalReliefYear?.charity ?? 0);
    addLine(
      mapSalaryLine({
        taxYear: i.taxYear,
        revenueOrIncome: income,
        estimatedPit,
        withheld: b.totalWithheld,
        legalSources: b.legalSources,
        label: `Lương từ «${s.name}»`,
        scenarioId: s.id,
        dualScenarioHint: i.includeCasual
          ? "Có thu nhập vãng lai trong quyết toán. Kiểm tra hai kịch bản trên màn Quyết toán."
          : undefined,
        notes: [`Năm quyết toán ${i.taxYear} · vùng ${i.region}`],
      }),
    );
    if (i.taxYear !== taxYear) setTaxYear(i.taxYear);
  };

  const beginSave = () => {
    if (assessment.error) {
      Alert.alert("Chưa tính được", assessment.error);
      return;
    }
    setSaveName(defaultScenarioName(inputs, "multi_source"));
    setSaving(true);
  };

  const confirmSave = async () => {
    try {
      const payload: MultiSourceScenarioInputs = {
        ...inputs,
        id: summaryId || newScenarioId(),
        updatedAt: new Date().toISOString(),
        createdAt: inputs.createdAt ?? new Date().toISOString(),
        name: saveName,
      };
      const { replacedOldest } = await save({
        kind: "multi_source",
        name: saveName,
        inputs: payload,
        lastDelta: totals.deltaSigned,
      });
      setSummaryId(payload.id);
      setSaving(false);
      void successHaptic();
      if (replacedOldest) {
        Alert.alert(
          "Đã lưu",
          "Đã đạt giới hạn 20 kịch bản. Kịch bản cũ nhất đã bị thay.",
        );
      }
    } catch (e) {
      Alert.alert(
        "Không lưu được",
        e instanceof Error ? e.message : "Lỗi không xác định.",
      );
    }
  };

  const onShare = async () => {
    const message = formatScenarioShareText({
      kind: "multi_source",
      name: saveName || defaultScenarioName(inputs, "multi_source"),
      inputs,
      estimatedTax: totals.estimatedTax,
      withheld: totals.withheld,
      delta: totals.deltaSigned,
      brand: brand.name,
    });
    try {
      await Share.share({ message });
    } catch {
      /* dismissed */
    }
  };

  const applyScenario = (s: SavedScenario) => {
    if (s.kind !== "multi_source") return;
    setSummaryId(s.inputs.id);
    setTaxYear(s.inputs.taxYear);
    setLines(s.inputs.lines);
    const relief = s.inputs.salaryRelief;
    setUseSalaryRelief(!!relief);
    setNumDependents(relief?.numDependents ?? 0);
    setPeriods(
      relief?.dependentPeriods ??
        Array.from({ length: relief?.numDependents ?? 0 }, () => ({
          startMonth: 1,
          endMonth: 12,
        })),
    );
    setMedicalText(formatMoneyInput(relief?.medicalExpenses ?? 0));
    setEducationText(formatMoneyInput(relief?.educationExpenses ?? 0));
    void successHaptic();
  };

  const openWizard = () => {
    router.push({
      pathname: "/filing-wizard",
      params: {
        year: String(taxYear),
        hasNonSalary: impact.forceSelfFile ? "1" : "0",
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: "Tổng hợp năm", headerShown: true }} />
      <ToolScreen
        nested
        title="Tổng hợp thu nhập cả năm"
        subtitle="Tính thử thuế theo từng nguồn trong cùng năm. App không nộp tờ khai và không tính thuế coin."
        showBrand={false}
        accessibilityLabel="Tổng hợp quyết toán đa nguồn"
        aboveTabBar={false}
        sticky={
          lines.length > 0 ? (
            <Button label="Lưu bảng" onPress={beginSave} />
          ) : undefined
        }
      >
        <OtherIncomeDisclaimer />
        <CollapseSection title="Giảm trừ khi tự quyết toán lương">
          <Text style={styles.wizardHint}>
            Bật để tính lại thuế trên tổng các dòng lương sau bảo hiểm, khoản
            miễn thuế, bảo hiểm bổ sung và từ thiện. GTGC và chi y tế/giáo dục
            chỉ trừ một lần cho cả năm. Thuế kinh doanh, cho thuê và chứng khoán
            giữ riêng. Vãng lai cần gộp: tính trên màn Quyết toán rồi nhập vào
            dòng lương, tránh nhập lại dòng vãng lai.
          </Text>
          <Switch
            accessibilityLabel="Tính lại thuế lương năm với giảm trừ"
            value={useSalaryRelief}
            onValueChange={setUseSalaryRelief}
          />
          {useSalaryRelief ? (
            <>
              <DependentCountInput
                value={numDependents}
                onChange={(n) => {
                  setNumDependents(n);
                  setPeriods((prev) =>
                    Array.from(
                      { length: n },
                      (_, i) => prev[i] ?? { startMonth: 1, endMonth: 12 },
                    ),
                  );
                }}
              />
              {numDependents > 0 ? (
                <DependentPeriodsInput value={periods} onChange={setPeriods} />
              ) : null}
              {taxYear === 2026 ? (
                <>
                  <Text style={styles.wizardHint}>
                    NĐ 253 Đ.49: chi tự chịu cho bản thân/người phụ thuộc tại cơ
                    sở trong nước, có hóa đơn/chứng từ đúng người; y tế cần bảng
                    kê thuộc danh mục BHYT. Không nhập phần được công ty, bảo
                    hiểm hoặc nguồn khác chi trả, hoặc đã dùng giảm thuế.
                  </Text>
                  <MoneyField
                    label="Chi y tế đủ điều kiện / năm (trần 23 triệu)"
                    value={medicalText}
                    onValueChange={setMedicalText}
                  />
                  <MoneyField
                    label="Chi giáo dục đủ điều kiện / năm (trần 24 triệu)"
                    value={educationText}
                    onValueChange={setEducationText}
                  />
                </>
              ) : null}
              <Text style={styles.wizardHint}>
                Giảm trừ y tế / giáo dục đã áp:{" "}
                {formatVnd(totals.salaryReliefApplied ?? 0)}. Thuế lương tính
                lại: {formatVnd(totals.salaryAnnualTax ?? 0)}.
              </Text>
            </>
          ) : null}
          {assessment.error ? (
            <Text style={[styles.wizardHint, { color: colors.danger }]}>
              {assessment.error}
            </Text>
          ) : null}
        </CollapseSection>

        <CollapseSection
          title={
            scenarios.length > 0
              ? `Kịch bản đã lưu (${scenarios.length})`
              : "Kịch bản đã lưu"
          }
          defaultOpen={scenarios.length > 0}
        >
          <ScenarioPanel
            scenarios={scenarios}
            onLoad={applyScenario}
            onDelete={(id) => {
              void remove(id);
            }}
            emptyHint="Chưa có bảng tổng hợp. Thêm nguồn rồi Lưu bảng."
          />
        </CollapseSection>

        <Section title="Năm thuế" subtitle="Tất cả dòng dùng cùng năm này.">
          <ChipRow>
            {TAX_YEAR_OPTIONS.map((y) => (
              <ChoiceChip
                key={y}
                label={String(y)}
                selected={taxYear === y}
                onPress={() => setTaxYear(y)}
              />
            ))}
          </ChipRow>
        </Section>

        {settlementScenarios.length > 0 ? (
          <CollapseSection
            title="Nhập từ quyết toán đã lưu"
            defaultOpen={false}
          >
            {settlementScenarios.slice(0, 5).map((s) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={`Nhập từ ${s.name}`}
                onPress={() => importFromSettlement(s)}
                style={styles.importRow}
              >
                <Text style={styles.importName} numberOfLines={1}>
                  {s.name}
                </Text>
                <AppIcon
                  name="chevron-right"
                  color={colors.primary}
                  size={16}
                />
              </Pressable>
            ))}
          </CollapseSection>
        ) : null}

        <Section title="Thêm nguồn">
          <MultiSourceLineEditor
            taxYear={taxYear}
            disabled={lines.length >= MAX_MULTI_SOURCE_LINES}
            onAdd={addLine}
          />
        </Section>

        {lines.length === 0 ? (
          <EmptyErrorState
            title="Chưa có nguồn"
            body="Thêm lương từ quyết toán, cho thuê, hộ kinh doanh, thu nhập vãng lai, chứng khoán hoặc ESOP. Bạn cũng có thể mở Tính lương, Thu nhập khác hoặc Quyết toán để lấy số liệu."
          />
        ) : (
          <MultiSourceTable
            lines={lines}
            totals={totals}
            onToggleExclude={(id) =>
              setLines((prev) =>
                prev.map((l) =>
                  l.id === id ? { ...l, excluded: !l.excluded } : l,
                ),
              )
            }
            onRemove={(id) =>
              setLines((prev) => prev.filter((l) => l.id !== id))
            }
          />
        )}

        <View style={styles.links}>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push("/")}
            style={styles.link}
          >
            <Text style={styles.linkText}>Tính lương</Text>
            <AppIcon name="chevron-right" color={colors.primary} size={16} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push("/other-income")}
            style={styles.link}
          >
            <Text style={styles.linkText}>Thu nhập khác</Text>
            <AppIcon name="chevron-right" color={colors.primary} size={16} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push("/settlement")}
            style={styles.link}
          >
            <Text style={styles.linkText}>Quyết toán lương</Text>
            <AppIcon name="chevron-right" color={colors.primary} size={16} />
          </Pressable>
        </View>

        {lines.length > 0 ? (
          <View style={styles.footerActions}>
            <Button
              label="Chia sẻ"
              variant="outline"
              onPress={() => {
                void onShare();
              }}
            />
            <Button
              label={
                impact.forceSelfFile
                  ? "Gợi ý tự quyết toán"
                  : "Hướng dẫn quyết toán"
              }
              variant="secondary"
              onPress={openWizard}
            />
          </View>
        ) : null}

        {legalSources.length > 0 ? (
          <Text style={styles.sources} numberOfLines={4}>
            Căn cứ: {legalSources.slice(0, 4).join(" · ")}
          </Text>
        ) : null}

        {impact.forceSelfFile ? (
          <Text style={styles.wizardHint}>
            Có nguồn ngoài lương hợp đồng lao động, nên phần hướng dẫn sẽ
            nghiêng về tự quyết toán và nhắc thêm chứng từ cần chuẩn bị.
          </Text>
        ) : null}
      </ToolScreen>

      <SaveScenarioModal
        visible={saving}
        saveName={saveName}
        onSaveNameChange={setSaveName}
        onConfirm={() => {
          void confirmSave();
        }}
        onCancel={() => setSaving(false)}
      />
    </>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    importRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: space[2],
      paddingVertical: space[2],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    importName: {
      flex: 1,
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
    },
    links: { gap: space[1], marginTop: space[2] },
    link: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: space[2],
    },
    linkText: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.body.fontSize,
      color: colors.primary,
    },
    footerActions: { gap: space[3], marginTop: space[3] },
    sources: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      color: colors.foregroundMuted,
      marginTop: space[3],
    },
    wizardHint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 18,
      color: colors.foregroundMuted,
      marginTop: space[2],
    },
  } satisfies ThemedStyleSheet;
}
