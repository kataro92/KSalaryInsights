import { useMemo, useState } from "react";
import { Alert, Pressable, Share, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { ScenarioPanel } from "@/src/components/calculator/ScenarioPanel";
import { SaveScenarioModal } from "@/src/components/calculator/SaveScenarioModal";
import { AppIcon } from "@/src/components/common/AppIcon";
import { Button } from "@/src/components/common/Button";
import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { CollapseSection } from "@/src/components/common/CollapseSection";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
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
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

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
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");

  const totals = useMemo(() => summarizeMultiSource({ lines }), [lines]);
  const impact = useMemo(() => filingWizardImpactFromLines(lines), [lines]);
  const legalSources = useMemo(() => activeLegalSources(lines), [lines]);

  const inputs: MultiSourceScenarioInputs = useMemo(
    () => ({
      id: summaryId,
      taxYear,
      updatedAt: new Date().toISOString(),
      lines,
    }),
    [summaryId, taxYear, lines]
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
    const estimatedPit =
      typeof s.lastDelta === "number"
        ? Math.max(0, i.salaryWithheld + s.lastDelta)
        : i.salaryWithheld;
    const income =
      i.monthlyGross * i.monthsWorked +
      (i.includeCasual ? i.casualGross : 0);
    addLine(
      mapSalaryLine({
        taxYear: i.taxYear,
        revenueOrIncome: income,
        estimatedPit,
        withheld: i.salaryWithheld + (i.includeCasual ? i.casualWithheld : 0),
        label: `Lương từ «${s.name}»`,
        scenarioId: s.id,
        dualScenarioHint: i.includeCasual
          ? "Có vãng lai trên QT — kiểm DualScenario trên màn Quyết toán."
          : undefined,
        notes: [`Năm QT ${i.taxYear} · vùng ${i.region}`],
      })
    );
    if (i.taxYear !== taxYear) setTaxYear(i.taxYear);
  };

  const beginSave = () => {
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
          "Đã đạt giới hạn 20 kịch bản — kịch bản cũ nhất đã bị thay."
        );
      }
    } catch (e) {
      Alert.alert(
        "Không lưu được",
        e instanceof Error ? e.message : "Lỗi không xác định."
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
      <Stack.Screen
        options={{ title: "Tổng hợp năm", headerShown: true }}
      />
      <ToolScreen
        nested
        title="Tổng hợp QT đa nguồn"
        subtitle="Ước thuế theo từng nguồn trong cùng năm — không nộp tờ khai, không ước coin."
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
          <CollapseSection title="Nhập từ QT đã lưu" defaultOpen={false}>
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
                <AppIcon name="chevron-right" color={colors.primary} size={16} />
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
            body="Thêm lương (từ QT), cho thuê, HKD, vãng lai, CK hoặc ESOP — hoặc mở Tính lương / Thu nhập khác / Quyết toán để lấy số liệu."
          />
        ) : (
          <MultiSourceTable
            lines={lines}
            totals={totals}
            onToggleExclude={(id) =>
              setLines((prev) =>
                prev.map((l) =>
                  l.id === id ? { ...l, excluded: !l.excluded } : l
                )
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
                  ? "Wizard (gợi ý tự QT)"
                  : "Wizard quyết toán"
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
            Có nguồn ngoài lương HĐLĐ → wizard nghiêng tự quyết toán + checklist
            chứng từ mở rộng.
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
