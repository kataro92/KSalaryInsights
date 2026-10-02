import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Share,
  Switch,
  Text,
  View,
} from "react-native";
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
import {
  DependentPeriodsInput,
  type DependentPeriod,
} from "@/src/components/inputs/DependentPeriodsInput";
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
import { useScrollToAnchor } from "@/src/hooks/useScrollToAnchor";
import { useI18n } from "@/src/i18n/useI18n";
import {
  defaultScenarioName,
  formatScenarioShareText,
  type SavedScenario,
  type SettlementScenarioInputs,
} from "@/src/store/scenarios";
import { successHaptic } from "@/src/theme/haptics";
import {
  requiredIntInRange,
  requiredPositiveMoney,
} from "@/src/theme/fieldValidation";
import { formatMoneyInput, parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import {
  useThemedStyles,
  type ThemedStyleSheet,
} from "@/src/theme/useThemedStyles";

export function SettlementScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { preferences } = usePreferences();
  const { scenarios, save, remove } = useScenarios("settlement");
  const { scrollRef, anchorRef, onScroll, scrollToAnchor } =
    useScrollToAnchor();

  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2025,
  );
  const [region, setRegion] = useState<RegionCode>(preferences.defaultRegion);
  const [numDependents, setNumDependents] = useState(0);
  const [dependentPeriods, setDependentPeriods] = useState<DependentPeriod[]>(
    [],
  );
  const [medicalText, setMedicalText] = useState("0");
  const [educationText, setEducationText] = useState("0");
  const [charityText, setCharityText] = useState("0");
  const [voluntaryText, setVoluntaryText] = useState("0");
  const [voluntaryMonthsText, setVoluntaryMonthsText] = useState("12");
  const [mealText, setMealText] = useState("0");
  const [mealMonthsText, setMealMonthsText] = useState("0");
  const [exemptText, setExemptText] = useState("0");
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
      dependentPeriods,
      medicalExpenses: parseMoney(medicalText) ?? 0,
      educationExpenses: parseMoney(educationText) ?? 0,
      charitableContributions: parseMoney(charityText) ?? 0,
      voluntaryInsuranceMonthly: parseMoney(voluntaryText) ?? 0,
      voluntaryInsuranceMonths: Number(voluntaryMonthsText),
      mealAllowanceMonthly: parseMoney(mealText) ?? 0,
      mealAllowanceMonths: Number(mealMonthsText),
      exemptAllowancesYear: parseMoney(exemptText) ?? 0,
      includeCasual,
      casualGross: includeCasual ? (parseMoney(casualGrossText) ?? 0) : 0,
      casualWithheld: includeCasual ? (parseMoney(casualWithheldText) ?? 0) : 0,
    };
  };

  const applyScenario = (s: SavedScenario) => {
    if (s.kind !== "settlement") return;
    const i = s.inputs;
    setTaxYear(i.taxYear);
    setRegion(i.region);
    setNumDependents(i.numDependents);
    setDependentPeriods(
      i.dependentPeriods ??
        Array.from({ length: i.numDependents }, () => ({
          startMonth: 1,
          endMonth: 12,
        })),
    );
    setMedicalText(formatMoneyInput(i.medicalExpenses ?? 0));
    setEducationText(formatMoneyInput(i.educationExpenses ?? 0));
    setCharityText(formatMoneyInput(i.charitableContributions ?? 0));
    setVoluntaryText(formatMoneyInput(i.voluntaryInsuranceMonthly ?? 0));
    setVoluntaryMonthsText(String(i.voluntaryInsuranceMonths ?? 12));
    setMealText(formatMoneyInput(i.mealAllowanceMonthly ?? 0));
    setMealMonthsText(String(i.mealAllowanceMonths ?? 0));
    setExemptText(formatMoneyInput(i.exemptAllowancesYear ?? 0));
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
      setError("Tính quyết toán trước khi lưu kịch bản.");
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
        ...inputs,
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
      scrollToAnchor();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenShell
        ref={scrollRef}
        accessibilityLabel="Màn hình quyết toán thuế"
        decorated
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <PageHero
          showBrand
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
            <Text style={styles.compareLinkText}>Tổng hợp thu nhập cả năm</Text>
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
            emptyHint="Chưa có kịch bản quyết toán. Sau khi tính, bấm Lưu kịch bản để mở lại mùa quyết toán."
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
              setDependentPeriods((prev) =>
                Array.from(
                  { length: n },
                  (_, i) => prev[i] ?? { startMonth: 1, endMonth: 12 },
                ),
              );
              clearResult();
            }}
          />
        </Section>

        {numDependents > 0 ? (
          <CollapseSection title="Tháng đăng ký người phụ thuộc" defaultOpen>
            <DependentPeriodsInput
              value={dependentPeriods}
              onChange={(v) => {
                setDependentPeriods(v);
                clearResult();
              }}
            />
          </CollapseSection>
        ) : null}
        <CollapseSection title="Khoản miễn thuế và giảm trừ khi tự quyết toán">
          <MoneyField
            label="Phụ cấp / trợ cấp miễn thuế trong Gross cả năm"
            value={exemptText}
            onValueChange={(v) => {
              setExemptText(v);
              clearResult();
            }}
          />
          <MoneyField
            label="Từ thiện / nhân đạo đủ điều kiện cả năm"
            value={charityText}
            onValueChange={(v) => {
              setCharityText(v);
              clearResult();
            }}
          />
          {taxYear === 2026 ? (
            <>
              <Text style={styles.switchHint}>
                NĐ 253 Đ.49: chi tự chịu cho bản thân/người phụ thuộc tại cơ sở
                trong nước, hóa đơn/chứng từ đúng người; y tế cần bảng kê khám
                chữa bệnh thuộc danh mục BHYT. Không nhập khoản được bảo hiểm,
                công ty hoặc nguồn khác chi trả; không tính trùng khoản đã dùng
                để giảm thuế. Chỉ dùng khi tự quyết toán, không tải chứng từ lên
                app.
              </Text>
              <MoneyField
                label="Chi y tế đủ điều kiện / năm (trần 23 triệu)"
                value={medicalText}
                onValueChange={(v) => {
                  setMedicalText(v);
                  clearResult();
                }}
              />
              <MoneyField
                label="Chi giáo dục đủ điều kiện / năm (trần 24 triệu)"
                value={educationText}
                onValueChange={(v) => {
                  setEducationText(v);
                  clearResult();
                }}
              />
              <MoneyField
                label="Bảo hiểm bổ sung / hưu trí / nhân thọ / tháng (trần 3 triệu)"
                value={voluntaryText}
                onValueChange={(v) => {
                  setVoluntaryText(v);
                  clearResult();
                }}
              />
              <Text style={styles.switchHint}>
                Gồm cả phần công ty và cá nhân đóng, có chứng từ. Nhập mức đóng
                đều mỗi tháng; nếu thay đổi, tính tổng các mức đã giới hạn 3
                triệu/tháng rồi chia cho số tháng.
              </Text>
              <TextField
                label="Số tháng đóng bảo hiểm bổ sung (0–12)"
                keyboardType="number-pad"
                value={voluntaryMonthsText}
                onChangeText={(v) => {
                  setVoluntaryMonthsText(v.replace(/\D/g, ""));
                  clearResult();
                }}
              />
              <MoneyField
                label="Tiền ăn trong Gross / tháng (trần miễn 1,2 triệu)"
                value={mealText}
                onValueChange={(v) => {
                  setMealText(v);
                  clearResult();
                }}
              />
              <TextField
                label="Số tháng nhận tiền ăn từ tháng 7 (0–6)"
                keyboardType="number-pad"
                value={mealMonthsText}
                onChangeText={(v) => {
                  setMealMonthsText(v.replace(/\D/g, ""));
                  clearResult();
                }}
              />
            </>
          ) : null}
        </CollapseSection>
        <Section
          title="Lương tháng (trung bình)"
          subtitle="× số tháng có lương trong năm."
        >
          <MoneyField
            accessibilityLabel="Lương gross tháng"
            value={monthlyText}
            error={requiredPositiveMoney(
              monthlyText,
              "Nhập lương tháng lớn hơn 0.",
            )}
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
            error={requiredIntInRange(
              monthsText,
              1,
              12,
              "Số tháng làm việc phải từ 1 đến 12.",
            )}
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
                Thu nhập ngoài lương đã bị khấu trừ 10%
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
                label="Tổng thu nhập vãng lai trong năm"
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
          <View ref={anchorRef} collapsable={false} style={styles.resultBlock}>
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
        placeholder="VD: Quyết toán 2025 · 1 nguồn"
      />

      <StickyActionBar>
        <Button label={t("settlement.cta")} onPress={onCalculate} />
        <Button
          label="Hướng dẫn ủy quyền hoặc tự quyết toán"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/filing-wizard",
              params: { year: String(taxYear) },
            })
          }
        />
      </StickyActionBar>
    </KeyboardAvoidingView>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: { flex: 1, backgroundColor: colors.background },
    scrollContent: {
      paddingBottom:
        space[12] + layout.stickyBarHeightDual + layout.tabBarClearance,
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
