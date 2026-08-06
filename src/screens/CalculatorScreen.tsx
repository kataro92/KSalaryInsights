import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  Switch,
  Text,
  TextInput,
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
import { InfoTip } from "@/src/components/common/InfoTip";
import { MoneyField } from "@/src/components/common/MoneyField";
import { PageHero } from "@/src/components/common/PageHero";
import { ResultHero } from "@/src/components/common/ResultHero";
import { ScreenShell } from "@/src/components/common/ScreenShell";
import { SeasonalBanner } from "@/src/components/common/SeasonalBanner";
import { Section } from "@/src/components/common/Section";
import { StickyActionBar } from "@/src/components/common/StickyActionBar";
import { SalaryBreakdownCard } from "@/src/components/breakdown/SalaryBreakdownCard";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { DependentCountInput } from "@/src/components/inputs/DependentCountInput";
import { InsuranceBasePresetPicker } from "@/src/components/inputs/InsuranceBasePresetPicker";
import { MonthPicker } from "@/src/components/inputs/MonthPicker";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { brand, emptyCopy, miuTips } from "@/src/copy/miu";
import {
  REGION_OPTIONS,
  TAX_YEAR_OPTIONS,
} from "@/src/domain/constants/salary";
import type { InsuranceBasePreset } from "@/src/domain/types/insuranceBase";
import { DEFAULT_INSURANCE_PRESET } from "@/src/domain/types/insuranceBase";
import type {
  CalculationMode,
  RegionCode,
  SalaryBreakdown,
} from "@/src/domain/types/salary";
import {
  calculateBonusMonth,
  type BonusMonthResult,
} from "@/src/engine/bonusMonth";
import { grossToNet } from "@/src/engine/grossToNet";
import {
  legacyFromInsurancePreset,
  netToGrossWithPreset,
  resolveForGrossToNet,
  validateInsurancePreset,
} from "@/src/engine/insuranceBase";
import {
  calcOvertimePay,
  OT_DAY_LABELS,
  type OtDayType,
} from "@/src/engine/overtime";
import { usePreferences } from "@/src/hooks/usePreferences";
import { useScenarios } from "@/src/hooks/useScenarios";
import { useI18n } from "@/src/i18n/useI18n";
import {
  defaultScenarioName,
  formatScenarioShareText,
  type CalculatorScenarioInputs,
  type SavedScenario,
} from "@/src/store/scenarios";
import { successHaptic } from "@/src/theme/haptics";
import { formatMoneyInput, formatVnd, parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

function asOfFromMonth(taxYear: number, month: number): string {
  const m = String(month).padStart(2, "0");
  return `${taxYear}-${m}-15`;
}

function formatAsOfVi(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const OT_TYPES: OtDayType[] = ["weekday", "weekend", "holiday"];

export function CalculatorScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { preferences } = usePreferences();
  const { scenarios, save, remove } = useScenarios("calculator");
  const scrollRef = useRef<ScrollView>(null);

  const [mode, setMode] = useState<CalculationMode>("gross-to-net");
  const [amountText, setAmountText] = useState("30.000.000");
  const [region, setRegion] = useState<RegionCode>(preferences.defaultRegion);
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2026
  );
  const [month, setMonth] = useState(3);
  const [numDependents, setNumDependents] = useState(0);
  const [insurance, setInsurance] = useState<InsuranceBasePreset>(
    DEFAULT_INSURANCE_PRESET
  );
  const [insuranceBaseLabel, setInsuranceBaseLabel] = useState<string | null>(
    null
  );
  const [bonusText, setBonusText] = useState("0");
  const [otHoursText, setOtHoursText] = useState("0");
  const [otDayType, setOtDayType] = useState<OtDayType>("weekday");
  const [otNight, setOtNight] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);
  const [bonusMonth, setBonusMonth] = useState<BonusMonthResult | null>(null);
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

  const asOfDate = useMemo(
    () => asOfFromMonth(taxYear, month),
    [taxYear, month]
  );
  const seasonalHint = month === 12 || month === 1;

  const clearResult = () => {
    setBreakdown(null);
    setBonusMonth(null);
    setInsuranceBaseLabel(null);
    setError(null);
  };

  const collectInputs = (): CalculatorScenarioInputs | null => {
    const amount = parseMoney(amountText);
    if (amount == null || amount <= 0) return null;
    const checked = validateInsurancePreset(insurance);
    if (!checked.ok) return null;
    const legacy = legacyFromInsurancePreset(checked.preset);
    return {
      mode,
      amount,
      region,
      taxYear,
      month,
      numDependents,
      insurance: checked.preset,
      customBh: legacy.customBh,
      bhAmount: legacy.bhAmount,
      bonus: parseMoney(bonusText) ?? 0,
      otHours: Number(otHoursText.replace(/[^\d.]/g, "") || "0") || 0,
      otDayType,
      otNight,
    };
  };

  const applyScenario = (s: SavedScenario) => {
    if (s.kind !== "calculator") return;
    const i = s.inputs;
    setMode(i.mode);
    setAmountText(formatMoneyInput(i.amount));
    setRegion(i.region);
    setTaxYear(i.taxYear);
    setMonth(i.month);
    setNumDependents(i.numDependents);
    setInsurance(i.insurance ?? DEFAULT_INSURANCE_PRESET);
    setBonusText(formatMoneyInput(i.bonus) || "0");
    setOtHoursText(i.otHours > 0 ? String(i.otHours) : "0");
    setOtDayType(i.otDayType);
    setOtNight(i.otNight);
    clearResult();
    void successHaptic();
  };

  const beginSave = () => {
    const inputs = collectInputs();
    if (!inputs || !breakdown) {
      setError("Tính kết quả trước khi lưu kịch bản.");
      return;
    }
    setSaveName(defaultScenarioName(inputs));
    setSaving(true);
  };

  const confirmSave = async () => {
    const inputs = collectInputs();
    if (!inputs || !breakdown) return;
    try {
      await save({
        name: saveName,
        inputs,
        lastNet: breakdown.net,
      });
      setSaving(false);
      void successHaptic();
    } catch {
      Alert.alert("Không lưu được", "Vui lòng thử lại.");
    }
  };

  const onShare = async () => {
    const inputs = collectInputs();
    if (!inputs || !breakdown) return;
    const message = formatScenarioShareText({
      name: saveName || defaultScenarioName(inputs),
      inputs,
      net: breakdown.net,
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
    setInsuranceBaseLabel(null);
    const amount = parseMoney(amountText);
    if (amount == null || amount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ (> 0).");
      setBreakdown(null);
      setBonusMonth(null);
      return;
    }

    const checked = validateInsurancePreset(insurance);
    if (!checked.ok) {
      setError(checked.message);
      setBreakdown(null);
      setBonusMonth(null);
      return;
    }
    const preset = checked.preset;

    try {
      if (mode === "gross-to-net") {
        const resolved = resolveForGrossToNet(amount, preset);
        const insuranceSalary = resolved.insuranceSalary;
        setInsuranceBaseLabel(
          `${resolved.labelVi} · ${resolved.displayBase.toLocaleString("vi-VN")} ₫`
        );
        const bonus = parseMoney(bonusText) ?? 0;
        const otHours = Number(otHoursText.replace(/[^\d.]/g, "") || "0");
        let otPay = 0;
        if (otHours > 0) {
          otPay = calcOvertimePay({
            monthlySalary: amount,
            hours: otHours,
            dayType: otDayType,
            isNight: otNight,
          }).otPay;
        }

        if (bonus > 0 || otPay > 0) {
          const monthResult = calculateBonusMonth({
            baseGross: amount,
            bonus,
            otPay,
            region,
            taxYear,
            asOfDate,
            numDependents,
            insuranceSalary,
          });
          setBonusMonth(monthResult);
          setBreakdown(monthResult.withExtras);
        } else {
          setBonusMonth(null);
          setBreakdown(
            grossToNet({
              gross: amount,
              region,
              taxYear,
              asOfDate,
              numDependents,
              insuranceSalary,
            })
          );
        }
        void successHaptic();
      } else {
        setBonusMonth(null);
        const result = netToGrossWithPreset({
          net: amount,
          region,
          taxYear,
          asOfDate,
          numDependents,
          preset,
        });
        if (!result.ok) {
          setBreakdown(null);
          setError(
            `Không khả thi với vùng/tham số hiện tại. Net tối thiểu tham khảo: ${result.minFeasibleNet.toLocaleString(
              "vi-VN"
            )} ₫`
          );
          return;
        }
        const resolved = resolveForGrossToNet(result.gross, preset);
        setInsuranceBaseLabel(
          `${resolved.labelVi} · ${resolved.displayBase.toLocaleString("vi-VN")} ₫`
        );
        setBreakdown(result.breakdown);
        void successHaptic();
      }
    } catch (e) {
      setBreakdown(null);
      setBonusMonth(null);
      setInsuranceBaseLabel(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  useEffect(() => {
    if (!breakdown) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(t);
  }, [breakdown]);

  const openComparison = () => {
    const amount = parseMoney(amountText);
    if (amount == null || amount <= 0) {
      setError("Nhập Gross hợp lệ trước khi so sánh.");
      return;
    }
    const checked = validateInsurancePreset(insurance);
    const resolved =
      checked.ok && mode === "gross-to-net"
        ? resolveForGrossToNet(amount, checked.preset)
        : null;
    const insuranceSalary = resolved?.insuranceSalary ?? null;
    router.push({
      pathname: "/comparison",
      params: {
        gross: String(amount),
        region,
        numDependents: String(numDependents),
        month: String(month),
        insuranceSalary: insuranceSalary != null ? String(insuranceSalary) : "",
      },
    });
  };

  return (
    <View style={styles.root}>
      <ScreenShell
        ref={scrollRef}
        accessibilityLabel="Máy tính lương gross net"
        decorated
        contentContainerStyle={styles.scrollContent}
      >
        <PageHero title={t("calc.title")} subtitle={t("calc.subtitle")} />

        <SeasonalBanner />

        <CollapseSection
          title={
            scenarios.length > 0
              ? `Kịch bản đã lưu (${scenarios.length})`
              : "Kịch bản đã lưu"
          }
          open={scenariosOpen}
          onOpenChange={(next) => {
            setScenariosOpen(next);
          }}
        >
          <ScenarioPanel
            scenarios={scenarios}
            onLoad={applyScenario}
            onDelete={(id) => {
              void remove(id);
            }}
          />
          <NgaiMiuTip tip={miuTips.scenarios} />
        </CollapseSection>

        <Section title="Chế độ tính">
          <ChipRow equal>
            {(
              [
                ["gross-to-net", "Gross → Net"],
                ["net-to-gross", "Net → Gross"],
              ] as const
            ).map(([id, label]) => (
              <ChoiceChip
                key={id}
                flex
                label={label}
                selected={mode === id}
                onPress={() => {
                  setMode(id);
                  clearResult();
                }}
              />
            ))}
          </ChipRow>
        </Section>

        <Section
          title={mode === "gross-to-net" ? "Lương Gross" : "Net mong muốn"}
          subtitle="Nhập số nguyên VNĐ"
        >
          <MoneyField
            accessibilityLabel={
              mode === "gross-to-net"
                ? "Nhập lương gross"
                : "Nhập net mong muốn"
            }
            value={amountText}
            onValueChange={(formatted) => {
              setAmountText(formatted);
              clearResult();
            }}
          />
        </Section>

        <Section title="Năm thuế">
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

        {mode === "gross-to-net" ? (
          <CollapseSection
            title="Thưởng tháng · làm thêm"
            defaultOpen={seasonalHint}
          >
            <Section
              title="Thưởng / tháng 13"
              subtitle={
                seasonalHint
                  ? "Gợi ý mùa Tết (tháng 12–1). Mô phỏng thuế tháng nhận thưởng."
                  : "Cộng vào Gross tháng này để ước thuế TNCN."
              }
            >
              <MoneyField
                accessibilityLabel="Nhập thưởng tháng"
                value={bonusText}
                onValueChange={(formatted) => {
                  setBonusText(formatted || "0");
                  clearResult();
                }}
              />
            </Section>

            <Section
              title="Làm thêm giờ"
              subtitle="Ngày 150/200/300%; đêm tối thiểu 200/270/390% (Bộ luật Lao động Đ.98)."
            >
              <ChipRow>
                {OT_TYPES.map((t) => (
                  <ChoiceChip
                    key={t}
                    label={OT_DAY_LABELS[t]}
                    selected={otDayType === t}
                    onPress={() => {
                      setOtDayType(t);
                      clearResult();
                    }}
                  />
                ))}
              </ChipRow>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  Làm thêm ban đêm (22h–6h)
                </Text>
                <Switch
                  accessibilityLabel="Bật làm thêm ban đêm"
                  value={otNight}
                  onValueChange={(v) => {
                    setOtNight(v);
                    clearResult();
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
              <Text style={styles.fieldLabel}>Số giờ OT</Text>
              <TextInput
                accessibilityLabel="Số giờ làm thêm"
                keyboardType="decimal-pad"
                value={otHoursText}
                onChangeText={(t) => {
                  setOtHoursText(t.replace(/[^\d.]/g, ""));
                  clearResult();
                }}
                style={styles.hoursInput}
              />
            </Section>
          </CollapseSection>
        ) : null}

        <CollapseSection title="Tùy chỉnh · vùng, tháng, người phụ thuộc, BH">
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

          <Section
            title="Tháng tính lương"
            subtitle="Chọn đúng tháng để áp trần BH (2026 đổi từ 01/07)."
            titleAccessory={<InfoTip tipId="salary.asOfMonth" size={18} />}
          >
            <MonthPicker
              value={month}
              onChange={(m) => {
                setMonth(m);
                clearResult();
              }}
            />
            <Text style={styles.meta}>
              Ngày áp dụng: {formatAsOfVi(asOfDate)}
            </Text>
          </Section>

          <Section
            title="Người phụ thuộc"
            subtitle="Chỉ nhập số lượng đã đăng ký."
          >
            <DependentCountInput
              value={numDependents}
              onChange={(n) => {
                setNumDependents(n);
                clearResult();
              }}
            />
          </Section>

          <Section
            title="Mức đóng BH"
            subtitle="Full gross, % hợp đồng, hoặc số cố định."
          >
            <InsuranceBasePresetPicker
              value={insurance}
              netToGrossHint={mode === "net-to-gross"}
              onChange={(next) => {
                setInsurance(next);
                clearResult();
              }}
            />
          </Section>
        </CollapseSection>

        {error ? (
          <EmptyErrorState
            variant="error"
            title={emptyCopy.calculateError.title}
            body={error}
          />
        ) : null}

        {breakdown ? (
          <View style={styles.resultBlock}>
            <ResultHero
              amount={
                mode === "net-to-gross" ? breakdown.gross : breakdown.net
              }
              eyebrow={
                mode === "net-to-gross"
                  ? "Gross cần đạt"
                  : bonusMonth && bonusMonth.extrasTotal > 0
                    ? "Net tháng có thưởng/OT"
                    : undefined
              }
              label={mode === "net-to-gross" ? "Gross" : "Net"}
              tipId={
                mode === "net-to-gross"
                  ? "salary.gross"
                  : bonusMonth && bonusMonth.extrasTotal > 0
                    ? "bonus.month"
                    : "salary.net"
              }
              tone={mode === "net-to-gross" ? "primary" : "positive"}
            />
            {bonusMonth && bonusMonth.extrasTotal > 0 ? (
              <ColorBlock
                tone="primarySoft"
                accessibilityLabel="So sánh tháng thường và tháng thưởng"
              >
                <Text style={styles.compareTitle}>
                  So với tháng lương thường
                </Text>
                <Text style={styles.compareLine}>
                  Net thường: {formatVnd(bonusMonth.base.net)}
                </Text>
                <Text style={styles.compareLine}>
                  Thưởng + OT: {formatVnd(bonusMonth.extrasTotal)}
                  {bonusMonth.otPay > 0
                    ? ` (OT ${formatVnd(bonusMonth.otPay)})`
                    : ""}
                </Text>
                <Text style={styles.compareLine}>
                  Thuế tăng: {formatVnd(bonusMonth.deltaTax)}
                </Text>
                <Text style={styles.compareLine}>
                  Net tăng: {formatVnd(bonusMonth.deltaNet)}
                </Text>
              </ColorBlock>
            ) : null}
            <NgaiMiuTip
              tip={
                bonusMonth && bonusMonth.extrasTotal > 0
                  ? miuTips.bonusMonth
                  : miuTips.calculatorResult
              }
            />
            {insuranceBaseLabel ? (
              <Text style={styles.meta} accessibilityLabel="Căn cứ bảo hiểm">
                Căn cứ BH: {insuranceBaseLabel}
              </Text>
            ) : null}
            <SalaryBreakdownCard
              breakdown={breakdown}
              hideNet={mode === "gross-to-net"}
              hideGross={mode === "net-to-gross"}
            />
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
                  onPress={() => {
                    void onShare();
                  }}
                />
              </View>
            </View>
            <DisclaimerFooter
              legalSources={breakdown.legalSources}
              collapseSources
            />
            {mode === "gross-to-net" ? (
              <>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel="So sánh hai offer lương"
                  onPress={() => router.push("/offer-compare")}
                  style={styles.compareLink}
                >
                  <View style={styles.compareLinkRow}>
                    <Text style={styles.compareLinkText}>So 2 offer</Text>
                    <AppIcon
                      name="chevron-right"
                      color={colors.primary}
                      size={16}
                    />
                  </View>
                </Pressable>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel="So sánh biểu thuế 2025 và 2026"
                  onPress={openComparison}
                  style={styles.compareLink}
                >
                  <View style={styles.compareLinkRow}>
                    <Text style={styles.compareLinkText}>
                      So sánh 2025 vs 2026
                    </Text>
                    <AppIcon
                      name="chevron-right"
                      color={colors.primary}
                      size={16}
                    />
                  </View>
                </Pressable>
              </>
            ) : (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="So sánh hai offer lương"
                onPress={() => router.push("/offer-compare")}
                style={styles.compareLink}
              >
                <View style={styles.compareLinkRow}>
                  <Text style={styles.compareLinkText}>So 2 offer</Text>
                  <AppIcon
                    name="chevron-right"
                    color={colors.primary}
                    size={16}
                  />
                </View>
              </Pressable>
            )}
          </View>
        ) : !error ? (
          <EmptyErrorState
            title={emptyCopy.calculator.title}
            body={emptyCopy.calculator.body}
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
      />

      <StickyActionBar>
        <Button label={t("common.calculate")} onPress={onCalculate} />
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
    meta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
    },
    fieldLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      marginTop: space[3],
      marginBottom: space[1],
    },
    hoursInput: {
      minHeight: layout.minTouch,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: radii.md,
      paddingHorizontal: space[3],
      fontFamily: typography.fontFamily.medium,
      fontSize: 16,
      color: colors.foreground,
      backgroundColor: colors.white,
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
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
    },
    switchHint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
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
    compareTitle: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 16,
      color: colors.foreground,
      marginBottom: space[2],
    },
    compareLine: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      lineHeight: 22,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
    },
    compareLink: {
      minHeight: layout.minTouch,
      justifyContent: "center",
      alignSelf: "flex-start",
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
