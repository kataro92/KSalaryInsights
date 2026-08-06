import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { AppIcon } from "@/src/components/common/AppIcon";
import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { PageHero } from "@/src/components/common/PageHero";
import { ScreenShell } from "@/src/components/common/ScreenShell";
import { Section } from "@/src/components/common/Section";
import { OtherIncomeDisclaimer } from "@/src/components/disclaimer/OtherIncomeDisclaimer";
import { CasualWithholdingCalculator } from "@/src/components/otherIncome/CasualWithholdingCalculator";
import { EsopCalculator } from "@/src/components/otherIncome/EsopCalculator";
import { HkdCalculator } from "@/src/components/otherIncome/HkdCalculator";
import { RentCalculator } from "@/src/components/otherIncome/RentCalculator";
import { SecuritiesCalculator } from "@/src/components/otherIncome/SecuritiesCalculator";
import { SimpleHkdCalculator } from "@/src/components/otherIncome/SimpleHkdCalculator";
import { SimpleRentCalculator } from "@/src/components/otherIncome/SimpleRentCalculator";
import { TAX_YEAR_OPTIONS } from "@/src/domain/constants/salary";
import { usePreferences } from "@/src/hooks/usePreferences";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";

type Depth = "simple" | "full";
type SimpleMode = "rent" | "hkd";
type FullMode = "rent" | "hkd" | "securities" | "esop" | "casual";

const DEPTHS: { id: Depth; label: string }[] = [
  { id: "simple", label: "Ước nhanh" },
  { id: "full", label: "Đầy đủ" },
];

const SIMPLE_MODES: { id: SimpleMode; label: string }[] = [
  { id: "rent", label: "Cho thuê" },
  { id: "hkd", label: "Hộ / cá nhân KD" },
];

const FULL_MODES: { id: FullMode; label: string }[] = [
  { id: "rent", label: "Cho thuê" },
  { id: "hkd", label: "Hộ / cá nhân KD" },
  { id: "securities", label: "CK" },
  { id: "esop", label: "ESOP" },
  { id: "casual", label: "Vãng lai" },
];

export function OtherIncomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { preferences } = usePreferences();
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2026
  );
  const [depth, setDepth] = useState<Depth>("simple");
  const [simpleMode, setSimpleMode] = useState<SimpleMode>("rent");
  const [fullMode, setFullMode] = useState<FullMode>("rent");

  return (
    <ScreenShell accessibilityLabel="Thu nhập khác" decorated>
      <PageHero
        title="Thu nhập khác"
        subtitle={
          depth === "simple"
            ? "Ước nhanh cho thuê hoặc hộ / cá nhân kinh doanh (freelancer) từ doanh thu tháng. Không gộp vào tính lương."
            : "Chứng khoán, ESOP, vãng lai và tuỳ chọn nâng cao. Không gộp vào tính lương. Không ước thuế coin."
        }
      />

      <OtherIncomeDisclaimer />

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Mở tổng hợp quyết toán đa nguồn"
        onPress={() => router.push("/multi-source")}
        style={styles.compareLink}
      >
        <View style={styles.compareLinkRow}>
          <Text style={[styles.compareLinkText, { color: colors.primary }]}>
            Tổng hợp năm · đa nguồn
          </Text>
          <AppIcon name="chevron-right" color={colors.primary} size={16} />
        </View>
      </Pressable>

      <Section
        title="Chế độ"
        subtitle="Ước nhanh: tháng ×12. Đầy đủ: mọi loại thu nhập."
      >
        <ChipRow equal>
          {DEPTHS.map((d) => (
            <ChoiceChip
              key={d.id}
              flex
              label={d.label}
              selected={depth === d.id}
              onPress={() => setDepth(d.id)}
            />
          ))}
        </ChipRow>
      </Section>

      <Section title="Năm thuế">
        <ChipRow equal>
          {TAX_YEAR_OPTIONS.map((y) => (
            <ChoiceChip
              key={y}
              flex
              label={String(y)}
              selected={taxYear === y}
              onPress={() => setTaxYear(y)}
            />
          ))}
        </ChipRow>
      </Section>

      {depth === "simple" ? (
        <>
          <Section title="Loại thu nhập">
            <View style={styles.row}>
              {SIMPLE_MODES.map((m) => (
                <ChoiceChip
                  key={m.id}
                  label={m.label}
                  selected={simpleMode === m.id}
                  tone="secondary"
                  onPress={() => setSimpleMode(m.id)}
                />
              ))}
            </View>
          </Section>
          {simpleMode === "rent" ? (
            <SimpleRentCalculator taxYear={taxYear} />
          ) : null}
          {simpleMode === "hkd" ? (
            <SimpleHkdCalculator taxYear={taxYear} />
          ) : null}
        </>
      ) : (
        <>
          <Section title="Loại thu nhập">
            <View style={styles.row}>
              {FULL_MODES.map((m) => (
                <ChoiceChip
                  key={m.id}
                  label={m.label}
                  selected={fullMode === m.id}
                  tone="secondary"
                  onPress={() => setFullMode(m.id)}
                />
              ))}
            </View>
          </Section>
          {fullMode === "rent" ? <RentCalculator taxYear={taxYear} /> : null}
          {fullMode === "hkd" ? <HkdCalculator taxYear={taxYear} /> : null}
          {fullMode === "securities" ? (
            <SecuritiesCalculator taxYear={taxYear} />
          ) : null}
          {fullMode === "esop" ? <EsopCalculator taxYear={taxYear} /> : null}
          {fullMode === "casual" ? (
            <CasualWithholdingCalculator
              taxYear={taxYear}
              asOfDate={`${taxYear}-08-15`}
            />
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: space[2] },
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
  },
});
