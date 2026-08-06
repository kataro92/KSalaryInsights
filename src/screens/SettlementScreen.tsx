import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Share, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScenarioPanel } from "@/src/components/calculator/ScenarioPanel";
import { SaveScenarioModal } from "@/src/components/calculator/SaveScenarioModal";
import { AppIcon } from "@/src/components/common/AppIcon";
import { Button } from "@/src/components/common/Button";
import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { CollapseSection } from "@/src/components/common/CollapseSection";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { MoneyField } from "@/src/components/common/MoneyField";
import { PageHero } from "@/src/components/common/PageHero";
import { ScreenShell } from "@/src/components/common/ScreenShell";
import { SeasonalBanner } from "@/src/components/common/SeasonalBanner";
import { Section } from "@/src/components/common/Section";
import { StickyActionBar } from "@/src/components/common/StickyActionBar";
import { TextField } from "@/src/components/common/TextField";
import { AnnualBreakdownCard } from "@/src/components/breakdown/AnnualBreakdownCard";
import { SettlementDisclaimer } from "@/src/components/disclaimer/SettlementDisclaimer";
import { DependentCountInput } from "@/src/components/inputs/DependentCountInput";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { DualScenarioCard } from "@/src/components/settlement/DualScenarioCard";
import { SettlementResultCard } from "@/src/components/settlement/SettlementResultCard";
import { brand, emptyCopy, miuTips } from "@/src/copy/miu";
import {
  REGION_OPTIONS,
  TAX_YEAR_OPTIONS,
} from "@/src/domain/constants/salary";
import type { AnnualSettlementResult } from "@/src/domain/types/settlement";
import type { RegionCode } from "@/src/domain/types/salary";
import { calculateAnnualSettlement } from "@/src/engine/annualSettlement";
import { usePreferences } from "@/src/hooks/usePreferences";
import { useScenarios } from "@/src/hooks/useScenarios";
import { useI18n } from "@/src/i18n/useI18n";
import {
  defaultScenarioName,
  formatScenarioShareText,
  type SavedScenario,
  type SettlementScenarioInputs,
} from "@/src/store/scenarios";
import { successHaptic } from "@/src/theme/haptics";
import { formatMoneyInput, parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

export function SettlementScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { preferences } = usePreferences();
  const { scenarios, save, remove } = useScenarios("settlement");

  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2025
  );
  const [region, setRegion] = useState<RegionCode>(preferences.defaultRegion);
  const [numDependents, setNumDependents] = useState(0);
  const [monthlyText, setMonthlyText] = useState("30.000.000");
  const [monthsText, setMonthsText] = useState("10");
  const [withheldText, setWithheldText] = useState("16.275.000");
  const [includeCasual, setIncludeCasual] = useState(false);
  const [casualGrossText, setCasualGrossText] = useState("0");
  const [casualWithheldText, setCasualWithheldText] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnnualSettlementResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [scenariosOpen, setScenariosOpen] = useState(false);
  const scenariosBootstrapped = useRef(false);

  useEffect(() => {
    if (scenariosBootstrapped.current) return;
    if (scenarios.length > 0) {
      setScenariosOpen(true);
      scenariosBootstrapped.current = true;
    }
  }, [scenarios.length]);

  const clearResult = () => setResult(null);

  const collectInputs = (): SettlementScenarioInputs | null => {
    const monthlyGross = parseMoney(monthlyText);
    const monthsWorked = Number(monthsText.replace(/[^\d]/g, ""));
    const salaryWithheld = parseMoney(withheldText) ?? 0;
    if (monthlyGross == null || monthlyGross <= 0) return null;
    if (
      !Number.isInteger(monthsWorked) ||
      monthsWorked < 1 ||
      monthsWorked > 12
    )
      return null;
    return {
      taxYear,
      region,
      numDependents,
      monthlyGross,
      monthsWorked,
      salaryWithheld,
      includeCasual,
      casualGross: includeCasual ? parseMoney(casualGrossText) ?? 0 : 0,
      casualWithheld: includeCasual ? parseMoney(casualWithheldText) ?? 0 : 0,
    };
  };

  const applyScenario = (s: SavedScenario) => {
    if (s.kind !== "settlement") return;
    const i = s.inputs;
    setTaxYear(i.taxYear);
    setRegion(i.region);
    setNumDependents(i.numDependents);
    setMonthlyText(formatMoneyInput(i.monthlyGross));
    setMonthsText(String(i.monthsWorked));
    setWithheldText(formatMoneyInput(i.salaryWithheld));
    setIncludeCasual(i.includeCasual);
    setCasualGrossText(formatMoneyInput(i.casualGross) || "0");
    setCasualWithheldText(formatMoneyInput(i.casualWithheld) || "0");
    clearResult();
    void successHaptic();
  };

  const beginSave = () => {
    const inputs = collectInputs();
    if (!inputs || !result) {
      setError("Ước quyết toán trước khi lưu kịch bản.");
      return;
    }
    setSaveName(defaultScenarioName(inputs, "settlement"));
    setSaving(true);
  };

  const confirmSave = async () => {
    const inputs = collectInputs();
    if (!inputs || !result) return;
    try {
      await save({
        kind: "settlement",
        name: saveName,
        inputs,
        lastDelta: result.primary.breakdown.delta.signed,
      });
      setSaving(false);
      void successHaptic();
    } catch {
      Alert.alert("Không lưu được", "Vui lòng thử lại.");
    }
  };

  const onShare = async () => {
    const inputs = collectInputs();
    if (!inputs || !result) return;
    const message = formatScenarioShareText({
      kind: "settlement",
      name: saveName || defaultScenarioName(inputs, "settlement"),
      inputs,
      delta: result.primary.breakdown.delta.signed,
      brand: brand.name,
    });
    try {
      await Share.share({ message });
    } catch {
      /* user dismissed */
    }
  };

  const onCalculate = () => {
    setError(null);
    const inputs = collectInputs();
    if (!inputs) {
      const monthlyGross = parseMoney(monthlyText);
      if (monthlyGross == null || monthlyGross <= 0) {
        setError("Nhập lương tháng hợp lệ.");
      } else {
        setError("Số tháng làm việc phải từ 1 đến 12.");
      }
      setResult(null);
      return;
    }

    try {
      const next = calculateAnnualSettlement({
        taxYear: inputs.taxYear,
        region: inputs.region,
        numDependents: inputs.numDependents,
        monthlyGross: inputs.monthlyGross,
        monthsWorked: inputs.monthsWorked,
        salaryWithheld: inputs.salaryWithheld,
        casual: inputs.includeCasual
          ? {
              gross: inputs.casualGross,
              withheld: inputs.casualWithheld,
            }
          : undefined,
      });
      setResult(next);
      void successHaptic();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <View style={styles.root}>
      <ScreenShell
        accessibilityLabel="Màn hình quyết toán thuế"
        decorated
        contentContainerStyle={styles.scrollContent}
      >
        <PageHero
          title={t("settlement.title")}
          subtitle={t("settlement.subtitle")}
        />

        <SeasonalBanner />

        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Mở tổng hợp quyết toán đa nguồn"
          onPress={() => router.push("/multi-source")}
          style={styles.compareLink}
        >
          <View style={styles.compareLinkRow}>
            <Text style={styles.compareLinkText}>
              Tổng hợp năm · đa nguồn
            </Text>
            <AppIcon name="chevron-right" color={colors.primary} size={16} />
          </View>
        </Pressable>

        <CollapseSection
          title={
            scenarios.length > 0
              ? `Kịch bản quyết toán (${scenarios.length})`
              : "Kịch bản quyết toán"
          }
          open={scenariosOpen}
          onOpenChange={setScenariosOpen}
        >
          <ScenarioPanel
            scenarios={scenarios}
            onLoad={applyScenario}
            onDelete={(id) => {
              void remove(id);
            }}
            emptyHint="Chưa có kịch bản QT. Sau khi ước, bấm Lưu kịch bản để mở lại mùa quyết toán."
          />
          <NgaiMiuTip tip={miuTips.scenarios} />
        </CollapseSection>

        <Section
          title="Năm quyết toán"
          subtitle="Mức tính theo năm thu nhập, không theo ngày mở app."
        >
          <ChipRow equal>
            {TAX_YEAR_OPTIONS.map((y) => (
              <ChoiceChip
                key={y}
                flex
                label={String(y)}
                selected={taxYear === y}
                onPress={() => {
                  setTaxYear(y);
                  clearResult();
                }}
              />
            ))}
          </ChipRow>
        </Section>

        <Section title="Vùng lương tối thiểu">
          <ChipRow equal>
            {REGION_OPTIONS.map(({ code, label }) => (
              <ChoiceChip
                key={code}
                flex
                label={label}
                selected={region === code}
                onPress={() => {
                  setRegion(code);
                  clearResult();
                }}
              />
            ))}
          </ChipRow>
        </Section>

        <Section title="Người phụ thuộc">
          <DependentCountInput
            value={numDependents}
            onChange={(n) => {
              setNumDependents(n);
              clearResult();
            }}
          />
        </Section>

        <Section
          title="Lương tháng (trung bình)"
          subtitle="× số tháng có lương trong năm."
        >
          <MoneyField
            accessibilityLabel="Lương gross tháng"
            value={monthlyText}
            onValueChange={(formatted) => {
              setMonthlyText(formatted);
              clearResult();
            }}
          />
          <TextField
            label="Số tháng làm việc"
            accessibilityLabel="Số tháng làm việc"
            keyboardType="number-pad"
            value={monthsText}
            onChangeText={(t) => {
              setMonthsText(t.replace(/[^\d]/g, ""));
              clearResult();
            }}
          />
        </Section>

        <Section title="Thuế đã khấu trừ (lương)">
          <MoneyField
            accessibilityLabel="Thuế đã khấu trừ"
            value={withheldText}
            onValueChange={(formatted) => {
              setWithheldText(formatted);
              clearResult();
            }}
          />
        </Section>

        <ColorBlock tone="muted">
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.switchLabel}>Thêm thu nhập vãng lai</Text>
              <Text style={styles.switchHint}>
                Thu nhập ngoài lương đã khấu trừ 10%
              </Text>
            </View>
            <Switch
              accessibilityLabel="Thêm thu nhập vãng lai"
              value={includeCasual}
              onValueChange={(v) => {
                setIncludeCasual(v);
                clearResult();
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          {includeCasual ? (
            <View style={styles.casualFields}>
              <MoneyField
                label="Tổng vãng lai năm"
                value={casualGrossText}
                onValueChange={(formatted) => {
                  setCasualGrossText(formatted);
                  clearResult();
                }}
              />
              <MoneyField
                label="Thuế đã khấu trừ vãng lai (10%)"
                value={casualWithheldText}
                onValueChange={(formatted) => {
                  setCasualWithheldText(formatted);
                  clearResult();
                }}
              />
            </View>
          ) : null}
        </ColorBlock>

        {error ? (
          <EmptyErrorState
            variant="error"
            title={emptyCopy.calculateError.title}
            body={error}
          />
        ) : null}

        {result ? (
          <View style={styles.resultBlock}>
            {result.casualStatus === "exempt" ? (
              <DualScenarioCard scenarios={result.scenarios} />
            ) : (
              <>
                <SettlementResultCard
                  delta={result.primary.breakdown.delta}
                  withheldMissingWarning={
                    result.primary.breakdown.withheldMissingWarning
                  }
                />
                <NgaiMiuTip pose="tip" tip={miuTips.settlement} />
                <AnnualBreakdownCard breakdown={result.primary.breakdown} />
              </>
            )}
            <View style={styles.resultActions}>
              <View style={styles.resultActionBtn}>
                <Button
                  label="Lưu kịch bản"
                  variant="secondary"
                  onPress={beginSave}
                />
              </View>
              <View style={styles.resultActionBtn}>
                <Button
                  label="Chia sẻ"
                  variant="outline"
                  onPress={() => void onShare()}
                />
              </View>
            </View>
            <SettlementDisclaimer
              legalSources={result.primary.breakdown.legalSources}
            />
          </View>
        ) : !error ? (
          <EmptyErrorState
            title={emptyCopy.settlement.title}
            body={emptyCopy.settlement.body}
          />
        ) : null}
      </ScreenShell>

      <SaveScenarioModal
        visible={saving}
        saveName={saveName}
        onSaveNameChange={setSaveName}
        onConfirm={() => {
          void confirmSave();
        }}
        onCancel={() => setSaving(false)}
        placeholder="VD: QT 2025 · 1 nguồn"
      />

      <StickyActionBar>
        <Button label={t("settlement.cta")} onPress={onCalculate} />
        <Button
          label="Wizard ủy quyền / tự QT"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/filing-wizard",
              params: { year: String(taxYear) },
            })
          }
        />
      </StickyActionBar>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: { flex: 1, backgroundColor: colors.background },
    scrollContent: {
      paddingBottom: space[12] + layout.stickyBarHeight + layout.tabBarClearance,
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: space[3],
      minHeight: layout.minTouch,
    },
    switchText: { flex: 1, gap: 2 },
    switchLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 15,
      color: colors.foreground,
    },
    switchHint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      color: colors.foregroundMuted,
    },
    casualFields: {
      marginTop: space[4],
      gap: space[3],
    },
    resultBlock: {
      gap: space[4],
    },
    resultActions: {
      flexDirection: "row",
      gap: space[2],
    },
    resultActionBtn: {
      flex: 1,
    },
    compareLink: {
      minHeight: layout.minTouch,
      justifyContent: "center",
      alignSelf: "flex-start",
      marginBottom: space[2],
    },
    compareLinkRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: space[1],
    },
    compareLinkText: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.body.fontSize,
      color: colors.primary,
    },
  } satisfies ThemedStyleSheet;
}
