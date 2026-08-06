import { useMemo, useState } from "react";
import { Alert, Share, Text, View } from "react-native";
import { Stack } from "expo-router";

import { ScenarioPanel } from "@/src/components/calculator/ScenarioPanel";
import { SaveScenarioModal } from "@/src/components/calculator/SaveScenarioModal";
import { Button } from "@/src/components/common/Button";
import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { CollapseSection } from "@/src/components/common/CollapseSection";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { Section } from "@/src/components/common/Section";
import { ToolScreen } from "@/src/components/common/ToolScreen";
import { OfferColumn } from "@/src/components/comparison/OfferColumn";
import { OfferDeltaBar } from "@/src/components/comparison/OfferDeltaBar";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import { DependentCountInput } from "@/src/components/inputs/DependentCountInput";
import { MonthPicker } from "@/src/components/inputs/MonthPicker";
import { brand } from "@/src/copy/miu";
import {
  REGION_OPTIONS,
  TAX_YEAR_OPTIONS,
} from "@/src/domain/constants/salary";
import { DEFAULT_INSURANCE_PRESET } from "@/src/domain/types/insuranceBase";
import type {
  OfferCompareResult,
  OfferSideInput,
} from "@/src/domain/types/offerCompare";
import type { RegionCode } from "@/src/domain/types/salary";
import { compareOffers } from "@/src/engine/offerCompare";
import { useScenarios } from "@/src/hooks/useScenarios";
import { useScrollToAnchor } from "@/src/hooks/useScrollToAnchor";
import {
  defaultScenarioName,
  formatScenarioShareText,
  type OfferCompareScenarioInputs,
  type SavedScenario,
} from "@/src/store/scenarios";
import { successHaptic } from "@/src/theme/haptics";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

const DEFAULT_A: OfferSideInput = {
  mode: "net-to-gross",
  amount: 28_000_000,
  insurance: DEFAULT_INSURANCE_PRESET,
};

const DEFAULT_B: OfferSideInput = {
  mode: "gross-to-net",
  amount: 32_000_000,
  insurance: DEFAULT_INSURANCE_PRESET,
};

export function OfferCompareScreen() {
  const styles = useThemedStyles(makeStyles);
  const { scenarios, save, remove } = useScenarios("offer_compare");
  const { scrollRef, anchorRef, onScroll, scrollToAnchor } = useScrollToAnchor();

  const [taxYear, setTaxYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [region, setRegion] = useState<RegionCode>("I");
  const [numDependents, setNumDependents] = useState(0);
  const [offerA, setOfferA] = useState<OfferSideInput>(DEFAULT_A);
  const [offerB, setOfferB] = useState<OfferSideInput>(DEFAULT_B);
  const [result, setResult] = useState<OfferCompareResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");

  const inputs: OfferCompareScenarioInputs = useMemo(
    () => ({
      shared: { taxYear, month, region, numDependents },
      offerA,
      offerB,
    }),
    [taxYear, month, region, numDependents, offerA, offerB]
  );

  const clearResult = () => setResult(null);

  const onCalculate = () => {
    const next = compareOffers(inputs);
    setResult(next);
    if (next.a.ok || next.b.ok) void successHaptic();
    scrollToAnchor();
  };

  const beginSave = () => {
    if (!result) return;
    setSaveName(defaultScenarioName(inputs, "offer_compare"));
    setSaving(true);
  };

  const confirmSave = async () => {
    try {
      const { replacedOldest } = await save({
        kind: "offer_compare",
        name: saveName,
        inputs,
        lastDeltaNet: result?.deltaNet ?? undefined,
      });
      setSaving(false);
      void successHaptic();
      if (replacedOldest) {
        Alert.alert(
          "Đã lưu",
          "Đã đạt giới hạn 20 kịch bản. Kịch bản cũ nhất đã bị thay."
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
      kind: "offer_compare",
      name: saveName || defaultScenarioName(inputs, "offer_compare"),
      inputs,
      deltaNet: result?.deltaNet ?? null,
      brand: brand.name,
    });
    try {
      await Share.share({ message });
    } catch {
      /* dismissed */
    }
  };

  const applyScenario = (s: SavedScenario) => {
    if (s.kind !== "offer_compare") return;
    const i = s.inputs;
    setTaxYear(i.shared.taxYear);
    setMonth(i.shared.month);
    setRegion(i.shared.region);
    setNumDependents(i.shared.numDependents);
    setOfferA(i.offerA);
    setOfferB(i.offerB);
    clearResult();
    void successHaptic();
  };

  const legalSources = useMemo(() => {
    if (!result) return [];
    const sources = [
      ...(result.a.ok ? result.a.legalSources : []),
      ...(result.b.ok ? result.b.legalSources : []),
    ];
    return [...new Set(sources)];
  }, [result]);

  return (
    <>
      <Stack.Screen
        options={{ title: "So 2 offer", headerShown: true }}
      />
      <ToolScreen
        nested
        title="So sánh hai offer"
        subtitle="Dùng cùng năm thuế, vùng và số người phụ thuộc. Mỗi offer có thể chọn Gross hoặc Net và mức đóng bảo hiểm riêng. Không gồm thưởng/làm thêm."
        showBrand={false}
        accessibilityLabel="So sánh hai offer lương"
        aboveTabBar={false}
        scrollRef={scrollRef}
        onScroll={onScroll}
        sticky={<Button label="So sánh" onPress={onCalculate} />}
      >
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
            emptyHint="Chưa có cặp offer. Sau khi so sánh, bấm Lưu để mở lại sau."
          />
        </CollapseSection>

        <Section title="Ngữ cảnh chung" subtitle="Áp dụng cho cả hai offer.">
          <Text style={styles.fieldLabel}>Năm thuế</Text>
          <ChipRow>
            {TAX_YEAR_OPTIONS.map((y) => (
              <ChoiceChip
                key={y}
                label={String(y)}
                selected={taxYear === y}
                onPress={() => {
                  setTaxYear(y);
                  clearResult();
                }}
              />
            ))}
          </ChipRow>
          <Text style={styles.fieldLabel}>Tháng</Text>
          <MonthPicker
            value={month}
            onChange={(m) => {
              setMonth(m);
              clearResult();
            }}
          />
          <Text style={styles.fieldLabel}>Vùng</Text>
          <ChipRow>
            {REGION_OPTIONS.map((r) => (
              <ChoiceChip
                key={r.code}
                label={r.label}
                selected={region === r.code}
                onPress={() => {
                  setRegion(r.code);
                  clearResult();
                }}
              />
            ))}
          </ChipRow>
          <Text style={styles.fieldLabel}>Người phụ thuộc</Text>
          <DependentCountInput
            value={numDependents}
            onChange={(n) => {
              setNumDependents(Math.min(20, n));
              clearResult();
            }}
          />
        </Section>

        <View style={styles.columns}>
          <OfferColumn
            title="Offer A"
            value={offerA}
            onChange={(next) => {
              setOfferA(next);
              clearResult();
            }}
            result={result?.a ?? null}
          />
          <OfferColumn
            title="Offer B"
            value={offerB}
            onChange={(next) => {
              setOfferB(next);
              clearResult();
            }}
            result={result?.b ?? null}
          />
        </View>

        {result ? (
          <View ref={anchorRef} collapsable={false} style={styles.resultBlock}>
            <OfferDeltaBar
              deltaNet={result.deltaNet}
              deltaGross={result.deltaGross}
            />
            <View style={styles.actions}>
              <View style={styles.actionBtn}>
                <Button
                  label="Lưu cặp"
                  variant="secondary"
                  onPress={beginSave}
                />
              </View>
              <View style={styles.actionBtn}>
                <Button
                  label="Chia sẻ"
                  variant="outline"
                  onPress={() => {
                    void onShare();
                  }}
                />
              </View>
            </View>
            {legalSources.length > 0 ? (
              <DisclaimerFooter legalSources={legalSources} collapseSources />
            ) : null}
          </View>
        ) : (
          <EmptyErrorState
            title="Chưa so sánh"
            body="Nhập hai offer rồi bấm So sánh. Kết quả chỉ là ước tính, không khuyên bạn chọn bên nào."
          />
        )}
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
    fieldLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      marginTop: space[2],
    },
    columns: { gap: space[4] },
    resultBlock: { gap: space[3], marginTop: space[2] },
    actions: {
      flexDirection: "row",
      gap: space[3],
    },
    actionBtn: { flex: 1 },
  } satisfies ThemedStyleSheet;
}
